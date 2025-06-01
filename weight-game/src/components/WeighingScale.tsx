import React from 'react';
import { Item } from '../types';
import { useDrop } from 'react-dnd';
import './WeighingScale.css'; // Import CSS for animations and styling

// Define a type for the draggable item (should match ItemShelf if it were imported)
const ItemTypes = {
  ITEM: 'item',
};

interface WeighingScaleProps {
  targetWeight: number;
  currentWeight: number;
  itemsOnScale: Item[];
  onAddItemToScale: (item: Item) => void;
  onRemoveItemFromScale: (item: Item) => void; // New prop for removing items
}

const WeighingScale: React.FC<WeighingScaleProps> = ({ targetWeight, currentWeight, itemsOnScale, onAddItemToScale, onRemoveItemFromScale }) => {
  const remainingWeight = Math.max(0, targetWeight - currentWeight);

  // Updated formatWeight to return JSX for styling units
  const formatWeight = (weightInGrams: number): JSX.Element => {
    if (weightInGrams >= 1000) {
      const kg = weightInGrams / 1000;
      // Use toFixed to handle potential floating point inaccuracies for display, e.g. 0.75kg from 750g
      const displayValue = Number.isInteger(kg) ? kg : kg.toFixed(Math.max(1, (kg.toString().split('.')[1] || '').length));
      return <>{displayValue}<span className="kilogram-unit">kg</span></>;
    }
    return <>{weightInGrams}<span className="gram-unit">g</span></>;
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.ITEM,
    drop: (item: Item) => onAddItemToScale(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div className="weighing-scale-container">
      <h2>Weighing Scale</h2>
      <p>ターゲット (Target): {formatWeight(targetWeight)}</p>
      <p>現在の重さ (Current): {formatWeight(currentWeight)}</p>
      <p>残り (Remaining): {remainingWeight}g</p>
      {/* Feedback message display removed from here */}
      <div
        ref={drop}
        className={`drop-zone ${isOver && canDrop ? 'can-drop' : ''} ${isOver ? 'is-over' : ''}`}
      >
        <h3>乗っているアイテム (Items on Scale)</h3>
        {itemsOnScale.length === 0 ? (
          <p className="drop-zone-placeholder">{isOver && canDrop ? 'ここにドロップ！' : 'アイテムをここにドラッグ＆ドロップ'}</p>
        ) : (
          <ul className="scale-items-list">
            {itemsOnScale.map(item => (
              <li
                key={item.id}
                className="scale-item interactive" // Added 'interactive' class for styling clickable items
                onClick={() => onRemoveItemFromScale(item)}
                title="クリックして削除 (Click to remove)" // Tooltip for usability
              >
                {item.name} - {item.weight}g
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WeighingScale;
