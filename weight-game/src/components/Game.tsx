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

  const feedbackType = feedbackMessage.includes("ピッタリ") || feedbackMessage.includes("クリア") ? 'correct'
                     : feedbackMessage.includes("オーバー") || feedbackMessage.includes("足りません") || feedbackMessage.includes("乗っています") ? 'error'
                     : '';

  return (
    <div className="game-container"> {/* Use class for main container styling */}
      <h1 className="game-title">Weight Game - <span className="level-indicator">Level {currentLevel + 1}</span></h1>
      <p
        key={feedbackKey}
        className={`feedback-message ${feedbackMessage ? 'visible' : ''} ${feedbackType}`}
      >
        {feedbackMessage}
      </p>
      <div className="game-area"> {/* Class for the main game interaction area */}
        <div className="scale-section"> {/* Class for the weighing scale and its controls */}
          <WeighingScale
            targetWeight={targetWeight}
            currentWeight={currentWeight}
            itemsOnScale={itemsOnScale}
            onAddItemToScale={handleAddItemToScale}
            onRemoveItemFromScale={handleRemoveItemFromScale}
          />
          <div className="game-buttons">
            <button onClick={checkWeight} className="button-check">
              重さをチェック！
            </button>
            <button onClick={resetCurrentAttempt} className="button-reset">
              リセット
            </button>
          </div>
        </div>
        <ItemShelf availableItems={availableItems} onItemSelect={handleAddItemToScale} />
      </div>
    </div>
  );
};

export default Game;
