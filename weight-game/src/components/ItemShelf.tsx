import React from 'react';
import { Item } from '../types';
import { useDrag } from 'react-dnd';
import './ItemShelf.css'; // Import CSS for styling

// Define a type for the draggable item
const ItemTypes = {
  ITEM: 'item',
};

interface DraggableItemProps {
  item: Item;
  onItemSelect: (item: Item) => void; // Callback for when an item is selected (clicked)
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onItemSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ITEM,
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={() => onItemSelect(item)}
      className="draggable-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="item-name">{item.name}</div>
      <div className="item-weight">
        {item.weight}<span className="gram-unit">g</span>
      </div>
    </div>
  );
};

interface ItemShelfProps {
  availableItems: Item[];
  onItemSelect: (item: Item) => void; // Prop for item selection callback
}

const ItemShelf: React.FC<ItemShelfProps> = ({ availableItems, onItemSelect }) => {
  return (
    <div className="item-shelf-container">
      <h2>Available Items</h2>
      <div className="items-grid">
        {availableItems.map(item => (
          <DraggableItem key={item.id} item={item} onItemSelect={onItemSelect} />
        ))}
      </div>
    </div>
  );
};

export default ItemShelf;
