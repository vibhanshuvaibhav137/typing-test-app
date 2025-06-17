import { useEffect, useRef, useState, useContext } from "react";
import generateWords from "../utils/wordGenerator";
import TypingChart from "./TypingChart";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext"; // For user token

const TypingBox = ({ duration, includeUpper, includeSpecial }) => {
  const [words, setWords] = useState([]);
  const [typed, setTyped] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalTypedWords, setTotalTypedWords] = useState(0);
  const [start, setStart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef(null);

  const { user } = useContext(AuthContext); // for checking if user is logged in

  useEffect(() => {
    setWords(generateWords(60, includeUpper, includeSpecial));
    setTyped("");
    setCurrentWordIndex(0);
    setCorrectWords(0);
    setTotalTypedWords(0);
    setStart(false);
    setShowResult(false);
    setTimeLeft(duration);
  }, [includeUpper, includeSpecial, duration]);

  useEffect(() => {
    let timer;
    if (start && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setShowResult(true);
      saveResult(); // Save result when timer hits zero
    }
    return () => clearInterval(timer);
  }, [start, timeLeft]);

  const handleInput = (e) => {
    if (!start) setStart(true);
    const value = e.target.value;

    if (value.endsWith(" ")) {
      const trimmed = value.trim();
      if (trimmed === words[currentWordIndex]) {
        setCorrectWords((prev) => prev + 1);
      }
      setTyped("");
      setCurrentWordIndex((prev) => prev + 1);
      setTotalTypedWords((prev) => prev + 1);
    } else {
      setTyped(value);
    }
  };

  const getCharStyles = (word, typedInput) => {
    return word.split("").map((char, i) => {
      const className =
        i < typedInput.length
          ? char === typedInput[i]
            ? "text-green-600"
            : "text-red-500"
          : "";
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  const calculateResults = () => {
    const timeInMinutes = duration / 60;
    const rawWPM = Math.round((typed.length / 5) / timeInMinutes);
    const actualWPM = Math.round(correctWords / timeInMinutes);
    const accuracy = Math.round((correctWords / totalTypedWords) * 100 || 0);

    return { rawWPM, actualWPM, accuracy };
  };

  const { rawWPM, actualWPM, accuracy } = calculateResults();

  const saveResult = async () => {
    if (!user || !user.token) return; // Prevent saving for unauthenticated users

    try {
      await api.post(
        "/typing/save",
        {
          rawWPM,
          actualWPM,
          accuracy,
          duration,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Typing result saved to backend.");
    } catch (err) {
      console.error("Saving result failed:", err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 mt-4 rounded-xl shadow-md">
      {!showResult ? (
        <>
          <div className="flex justify-between mb-3">
            <span className="text-accent font-semibold">Time Left: {timeLeft}s</span>
            <span className="text-accent font-semibold">
              Correct: {correctWords}
            </span>
          </div>

          <div className="typing-area h-80 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4 text-3xl font-mono leading-relaxed break-words">
            <div className="flex flex-wrap gap-2">
                {words.map((word, idx) => {
                const isActive = idx === currentWordIndex;
                const className = isActive
                    ? "bg-indigo-200 dark:bg-indigo-600 text-black dark:text-white rounded px-1"
                    : "";

                return (
                    <span key={idx} className={`${className}`}>
                    {isActive ? getCharStyles(word, typed) : word}
                    </span>
                );
                })}
            </div>
          </div>


          <input
            type="text"
            value={typed}
            onChange={handleInput}
            ref={inputRef}
            disabled={timeLeft === 0}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none dark:bg-gray-900 dark:text-white"
            placeholder="Start typing here..."
          />
        </>
      ) : (
        <>
          <div className="text-center space-y-3 text-lg">
            <h3 className="font-bold text-2xl text-primary">Test Results</h3>
            <p>📝 <strong>Raw WPM:</strong> {rawWPM}</p>
            <p>✅ <strong>Actual WPM:</strong> {actualWPM}</p>
            <p>🎯 <strong>Accuracy:</strong> {accuracy}%</p>
          </div>

          <TypingChart
            rawWPM={rawWPM}
            actualWPM={actualWPM}
            accuracy={accuracy}
          />
        </>
      )}
    </div>
  );
};

export default TypingBox;
