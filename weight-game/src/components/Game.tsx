import React, { useState, useEffect } from 'react';
import WeighingScale from './WeighingScale';
import ItemShelf from './ItemShelf';
import { Item } from '../types';
import { playSound, SOUND_CORRECT, SOUND_FEEDBACK, SOUND_ADD_ITEM, SOUND_LEVEL_UP, SOUND_RESET, SOUND_REMOVE_ITEM } from '../utils/sound'; // Added SOUND_REMOVE_ITEM
import './Game.css'; // Import CSS for animations

const availableItemsList: Item[] = [
  { id: 'item1', name: 'Apple', weight: 150 },
  { id: 'item2', name: 'Banana', weight: 120 },
  { id: 'item3', name: 'Orange', weight: 200 },
  { id: 'item4', name: 'Mango', weight: 250 },
  { id: 'item5', name: 'Pineapple', weight: 500 },
];

const targetWeightsList: number[] = [1000, 750, 1250, 500, 1500]; // Example target weights

const Game: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(targetWeightsList[currentLevel]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [itemsOnScale, setItemsOnScale] = useState<Item[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>(availableItemsList);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackKey, setFeedbackKey] = useState<number>(0); // To re-trigger animation

  useEffect(() => {
    // When feedbackMessage changes, update the key to re-trigger animation
    setFeedbackKey(prevKey => prevKey + 1);
  }, [feedbackMessage]);

  const handleAddItemToScale = (item: Item) => {
    if (!itemsOnScale.find(i => i.id === item.id)) {
      setCurrentWeight(prevWeight => prevWeight + item.weight);
      setItemsOnScale(prevItems => [...prevItems, item]);
      setFeedbackMessage('');
      playSound(SOUND_ADD_ITEM);
    } else {
      setFeedbackMessage("そのアイテムはもう乗っています！");
      playSound(SOUND_FEEDBACK);
    }
  };

  const handleRemoveItemFromScale = (itemToRemove: Item) => {
    setCurrentWeight(prevWeight => Math.max(0, prevWeight - itemToRemove.weight)); // Ensure weight doesn't go below 0
    setItemsOnScale(prevItems => prevItems.filter(item => item.id !== itemToRemove.id)); // Simple removal by ID
    setFeedbackMessage(''); // Clear feedback
    playSound(SOUND_REMOVE_ITEM);
  };

  const checkWeight = () => {
    if (currentWeight === targetWeight) {
      setFeedbackMessage("ピッタリ！素晴らしい！");
      playSound(SOUND_CORRECT);
      if (currentLevel < targetWeightsList.length - 1) {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setTargetWeight(targetWeightsList[nextLevel]);
        setCurrentWeight(0);
        setItemsOnScale([]);
        playSound(SOUND_LEVEL_UP);
        // setFeedbackMessage("次のレベルへ！"); // This would override "ピッタリ！"
      } else {
        setFeedbackMessage("全レベルクリア！おめでとうございます！");
        // playSound(SOUND_GAME_COMPLETE); // If you have one
      }
    } else if (currentWeight < targetWeight) {
      setFeedbackMessage(`あと ${targetWeight - currentWeight}g です`);
      playSound(SOUND_FEEDBACK);
    } else {
      setFeedbackMessage(`${currentWeight - targetWeight}g オーバーです`);
      playSound(SOUND_FEEDBACK);
    }
  };

  const resetCurrentAttempt = () => {
    setCurrentWeight(0);
    setItemsOnScale([]);
    setFeedbackMessage('リセットしました。もう一度挑戦！');
    playSound(SOUND_RESET);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Weight Game - Level {currentLevel + 1}</h1>
      {/* Adding a key to WeighingScale's feedback display part or the message itself for animation reset */}
      <p key={feedbackKey} className={`feedback-message ${feedbackMessage ? 'visible' : ''}`}>
        {feedbackMessage}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '900px' }}> {/* Increased maxWidth slightly */}
        <div style={{flexBasis: '50%'}}> {/* Assign basis for scale side */}
          <WeighingScale
            targetWeight={targetWeight}
            currentWeight={currentWeight}
            itemsOnScale={itemsOnScale}
            onAddItemToScale={handleAddItemToScale}
            onRemoveItemFromScale={handleRemoveItemFromScale} // Pass the new handler
          />
          <button onClick={checkWeight} style={{ marginTop: '20px', padding: '12px 25px', fontSize: '18px', cursor: 'pointer' }}>
            重さをチェック！ (Check Weight)
          </button>
          <button onClick={resetCurrentAttempt} style={{ marginTop: '20px', marginLeft: '15px', padding: '12px 25px', fontSize: '18px', cursor: 'pointer' }}>
            リセット (Reset)
          </button>
        </div>
        <ItemShelf availableItems={availableItems} onItemSelect={handleAddItemToScale} />
      </div>
    </div>
  );
};

export default Game;
