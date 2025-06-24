export const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
  "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house. The wife had discovered that the husband was carrying on an intrigue with a French girl.",
  "Programming is not about typing, it's about thinking. However, the ability to type quickly and accurately can significantly improve your productivity as a developer.",
  "The art of computer programming requires patience, precision, and practice. Each line of code is a step toward solving complex problems and creating innovative solutions.",
  "Technology has revolutionized the way we communicate, work, and live. From smartphones to artificial intelligence, we are constantly surrounded by digital innovations.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Every expert was once a beginner, and every pro was once an amateur.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
  "Education is the most powerful weapon which you can use to change the world. Learning never exhausts the mind, and knowledge is power that grows when shared.",
  "In the midst of winter, I found there was, within me, an invincible summer. Life is not about waiting for the storm to pass, but learning to dance in the rain."
];

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const TEST_DURATIONS = [15, 30, 60, 120, 300]; // seconds

export const WPM_RATINGS = {
  BEGINNER: { min: 0, max: 25, label: 'Beginner', color: 'red' },
  AVERAGE: { min: 26, max: 40, label: 'Average', color: 'yellow' },
  GOOD: { min: 41, max: 60, label: 'Good', color: 'blue' },
  EXCELLENT: { min: 61, max: 80, label: 'Excellent', color: 'green' },
  PROFESSIONAL: { min: 81, max: 999, label: 'Professional', color: 'purple' }
};