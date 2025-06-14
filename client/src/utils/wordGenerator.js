const baseWords = [
  "apple", "banana", "grape", "orange", "pine", "kiwi", "melon", "lemon", "lime", "berry",
  "code", "stack", "react", "node", "async", "route", "form", "array", "token", "fetch"
];

const specialChars = "!@#$%^&*()_+~<>?/[]{}";

const randomSpecialChar = () => {
  return specialChars[Math.floor(Math.random() * specialChars.length)];
};

const modifyWord = (word, includeUpper, includeSpecial) => {
  let newWord = word;

  if (includeUpper && Math.random() > 0.5) {
    newWord = newWord.toUpperCase();
  }

  if (includeSpecial && Math.random() > 0.7) {
    const pos = Math.floor(Math.random() * newWord.length);
    newWord =
      newWord.slice(0, pos) + randomSpecialChar() + newWord.slice(pos);
  }

  return newWord;
};

const generateWords = (count = 50, includeUpper = false, includeSpecial = false) => {
  return Array.from({ length: count }, () => {
    const word = baseWords[Math.floor(Math.random() * baseWords.length)];
    return modifyWord(word, includeUpper, includeSpecial);
  });
};

export default generateWords;
