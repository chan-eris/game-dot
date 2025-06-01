// Sound effect names
export const SOUND_CORRECT = 'correct';
export const SOUND_FEEDBACK = 'feedback'; // For general feedback (over/under)
export const SOUND_ADD_ITEM = 'addItem';
export const SOUND_REMOVE_ITEM = 'removeItem'; // New sound for removing an item
export const SOUND_RESET = 'reset';
export const SOUND_LEVEL_UP = 'levelUp';

// In a real implementation, you would have audio files associated with these.
// For now, we'll just log to the console.

/**
 * Plays a sound based on its name.
 * In a real app, this would use the Web Audio API or <audio> elements.
 * @param soundName The name of the sound to play.
 */
export const playSound = (soundName: string): void => {
  if (!soundName) {
    console.warn('playSound called with no soundName');
    return;
  }

  // Example: Log to console for now
  console.log(`Playing sound: ${soundName}`);

  // Future implementation:
  // const audio = new Audio(`/sounds/${soundName}.mp3`); // Assuming sounds are in public/sounds
  // audio.play().catch(error => console.error(`Error playing sound ${soundName}:`, error));
};
