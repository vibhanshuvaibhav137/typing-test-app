import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTyping } from '../../contexts/TypingContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { SAMPLE_TEXTS, TEST_DURATIONS } from '../../utils/constants';
import { Clock, RotateCcw, Settings, Type, Timer, Zap, Hash, CaseSensitive, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const TypingTest = () => {
  const { user } = useAuth();
  const {
    testText,
    typedText,
    currentIndex,
    isActive,
    isCompleted,
    timeElapsed,
    errors,
    finalStats,
    startTest,
    updateTyping,
    resetTest,
    saveResult
  } = useTyping();

  // Local dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [selectedDuration, setSelectedDuration] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(selectedDuration);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [savingResult, setSavingResult] = useState(false);
  const [displayLines, setDisplayLines] = useState([]);
  const [allGeneratedLines, setAllGeneratedLines] = useState([]);
  const [lineOffset, setLineOffset] = useState(0);
  const [totalCharactersTyped, setTotalCharactersTyped] = useState(0);
  const [totalCorrectCharacters, setTotalCorrectCharacters] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [localFinalStats, setLocalFinalStats] = useState(null); // Store local final stats
  
  // Text generation options - these should persist across resets
  const [textOptions, setTextOptions] = useState({
    includeUppercase: false,
    includeNumbers: false,
    includeSpecialChars: false
  });
  
  const textareaRef = useRef(null);
  const timerRef = useRef(null);
  const saveRef = useRef(false);

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Generate lines of text (each line ~70 characters)
  const generateLines = useCallback((count = 5) => {
    const baseTexts = [...SAMPLE_TEXTS];
    let words = [];
    
    // Extract words from sample texts
    baseTexts.forEach(text => {
      words.push(...text.toLowerCase().replace(/[^\w\s]/g, '').split(' '));
    });
    
    // Filter out empty words and shuffle
    words = words.filter(word => word.length > 0);
    
    let lines = [];
    
    for (let i = 0; i < count; i++) {
      let currentLine = '';
      
      while (currentLine.length < 60) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        let processedWord = randomWord;
        
        // Apply text options
        if (textOptions.includeUppercase && Math.random() < 0.3) {
          processedWord = Math.random() < 0.5 
            ? processedWord.charAt(0).toUpperCase() + processedWord.slice(1)
            : processedWord.toUpperCase();
        }
        
        if (textOptions.includeNumbers && Math.random() < 0.15) {
          processedWord += Math.floor(Math.random() * 100);
        }
        
        if (textOptions.includeSpecialChars && Math.random() < 0.1) {
          const specialChars = ['!', '?', '.', ',', ';', ':', '-'];
          processedWord += specialChars[Math.floor(Math.random() * specialChars.length)];
        }
        
        if (currentLine.length + processedWord.length + 1 <= 70) {
          currentLine += (currentLine ? ' ' : '') + processedWord;
        } else {
          break;
        }
      }
      
      lines.push(currentLine);
    }
    
    return lines;
  }, [textOptions]);

  // Calculate accurate WPM based on correctly typed words
  const calculateWPM = useCallback(() => {
    const elapsedMinutes = Math.max(selectedDuration - timeLeft, 1) / 60;
    
    const fullExpectedText = allGeneratedLines.slice(0, lineOffset + 5).join(' ');
    const currentTypedLength = totalCharactersTyped + typedText.length;
    
    const wordsTyped = Math.floor(currentTypedLength / 5);
    
    const correctCharacters = totalCorrectCharacters + getCorrectCharactersInCurrentText();
    const correctWords = Math.floor(correctCharacters / 5);
    
    const grossWPM = Math.round(wordsTyped / elapsedMinutes);
    const netWPM = Math.round(correctWords / elapsedMinutes);
    
    return {
      grossWPM,
      netWPM: Math.max(0, netWPM),
      correctCharacters,
      totalCharacters: currentTypedLength
    };
  }, [selectedDuration, timeLeft, allGeneratedLines, lineOffset, totalCharactersTyped, typedText, totalCorrectCharacters]);

  // Get correct characters in current visible text
  const getCorrectCharactersInCurrentText = useCallback(() => {
    const currentDisplayText = displayLines.join(' ');
    let correctCount = 0;
    
    for (let i = 0; i < Math.min(typedText.length, currentDisplayText.length); i++) {
      if (typedText[i] === currentDisplayText[i]) {
        correctCount++;
      }
    }
    
    return correctCount;
  }, [typedText, displayLines]);

  // Calculate accuracy
  const calculateAccuracy = useCallback(() => {
    const currentCorrect = getCorrectCharactersInCurrentText();
    const totalCorrect = totalCorrectCharacters + currentCorrect;
    const totalTyped = totalCharactersTyped + typedText.length;
    
    return totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100;
  }, [totalCorrectCharacters, totalCharactersTyped, typedText, getCorrectCharactersInCurrentText]);

  // Calculate current errors
  const getCurrentErrors = useCallback(() => {
    const currentDisplayText = displayLines.join(' ');
    let currentErrors = 0;
    
    for (let i = 0; i < Math.min(typedText.length, currentDisplayText.length); i++) {
      if (typedText[i] !== currentDisplayText[i]) {
        currentErrors++;
      }
    }
    
    return totalErrors + currentErrors;
  }, [typedText, displayLines, totalErrors]);

  // Initialize text without changing settings
  const initializeTest = useCallback(() => {
    const initialLines = generateLines(10);
    setAllGeneratedLines(initialLines);
    setDisplayLines(initialLines.slice(0, 5));
    setLineOffset(0);
    setTotalCharactersTyped(0);
    setTotalCorrectCharacters(0);
    setTotalErrors(0);
    setTimeLeft(selectedDuration);
    setTestStarted(false);
    setTestCompleted(false);
    setShowResults(false);
    setResultSaved(false);
    setSavingResult(false);
    setScrolling(false);
    setLocalFinalStats(null); // Reset local final stats
    saveRef.current = false;
    resetTest();
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  }, [selectedDuration, generateLines, resetTest]);

  // Initialize with first set of lines - only when settings change
  useEffect(() => {
    initializeTest();
  }, [selectedDuration, textOptions, initializeTest]);

  // Handle line scrolling logic with improved positioning
  useEffect(() => {
    if (!testStarted || typedText.length === 0 || scrolling) return;

    let currentLineIndex = 0;
    let charCount = 0;
    
    for (let i = 0; i < displayLines.length; i++) {
      const lineLength = displayLines[i].length;
      if (charCount + lineLength >= typedText.length) {
        currentLineIndex = i;
        break;
      }
      charCount += lineLength + 1;
      currentLineIndex = i + 1;
    }

    if (currentLineIndex >= 3) {
      const progressInLine = typedText.length - charCount;
      const currentLineText = displayLines[currentLineIndex] || '';
      
      if (progressInLine > currentLineText.length * 0.9) {
        setScrolling(true);
        
        if (lineOffset + 6 >= allGeneratedLines.length) {
          const newLines = generateLines(5);
          setAllGeneratedLines(prev => [...prev, ...newLines]);
        }
        
        const scrolledLineText = displayLines[0];
        const scrolledLineLength = scrolledLineText.length + 1;
        
        let scrolledCorrectChars = 0;
        let scrolledErrors = 0;
        
        for (let i = 0; i < Math.min(scrolledLineLength - 1, typedText.length); i++) {
          if (i < scrolledLineText.length) {
            if (typedText[i] === scrolledLineText[i]) {
              scrolledCorrectChars++;
            } else {
              scrolledErrors++;
            }
          }
        }
        
        setTotalCharactersTyped(prev => prev + scrolledLineLength);
        setTotalCorrectCharacters(prev => prev + scrolledCorrectChars);
        setTotalErrors(prev => prev + scrolledErrors);
        
        const newOffset = lineOffset + 1;
        setLineOffset(newOffset);
        
        const newDisplayLines = allGeneratedLines.slice(newOffset, newOffset + 5);
        setDisplayLines(newDisplayLines);
        
        const adjustedTypedText = typedText.substring(scrolledLineLength);
        
        setTimeout(() => {
          updateTyping(adjustedTypedText);
          setScrolling(false);
        }, 100);
      }
    }
  }, [typedText, testStarted, displayLines, lineOffset, allGeneratedLines, generateLines, updateTyping, scrolling]);

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testStarted, timeLeft, testCompleted]);

  // Handle test completion with duplicate prevention
  const handleTestComplete = useCallback(() => {
    if (saveRef.current || savingResult || testCompleted) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    saveRef.current = true;
    setSavingResult(true);
    setTestCompleted(true);

    const wpmStats = calculateWPM();
    const accuracy = calculateAccuracy();
    const currentErrors = getCurrentErrors();
    const actualDuration = selectedDuration - timeLeft;

    const calculatedFinalStats = {
      wpm: wpmStats.netWPM,
      accuracy,
      duration: actualDuration,
      totalCharacters: wpmStats.totalCharacters,
      errors: currentErrors
    };

    // Store local final stats immediately
    setLocalFinalStats(calculatedFinalStats);
    setShowResults(true);
    setResultSaved(true);

    if (user && actualDuration > 5 && !resultSaved) {
      saveResult({
        wpm: calculatedFinalStats.wpm,
        accuracy: calculatedFinalStats.accuracy,
        duration: calculatedFinalStats.duration
      }).then((result) => {
        setSavingResult(false);
        if (result && result.success) {
          toast.success('Result saved successfully!');
        } else {
          saveRef.current = false;
        }
      }).catch((error) => {
        setSavingResult(false);
        saveRef.current = false;
        console.error('Error saving result:', error);
      });
    } else {
      setSavingResult(false);
    }
  }, [calculateWPM, calculateAccuracy, getCurrentErrors, selectedDuration, timeLeft, user, saveResult, resultSaved, savingResult, testCompleted]);

  // Reset test - preserves settings
  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Use initializeTest which preserves settings
    initializeTest();
  };

  // Restart test - same as reset but different name for clarity
  const handleRestart = () => {
    handleReset();
  };

  const handleDurationChange = (duration) => {
    if (!testStarted) {
      setSelectedDuration(duration);
    }
  };

  const handleTextOptionsChange = (option) => {
    if (!testStarted) {
      setTextOptions(prev => ({
        ...prev,
        [option]: !prev[option]
      }));
    }
  };

  const handleTextChange = (e) => {
    if (timeLeft <= 0 || scrolling || testCompleted) return;
    
    const value = e.target.value;
    
    if (!testStarted && value.length >= 1) {
      setTestStarted(true);
      const allText = allGeneratedLines.join(' ');
      startTest(allText);
    }
    
    const currentDisplayText = displayLines.join(' ');
    if (value.length > currentDisplayText.length) {
      return;
    }
    
    updateTyping(value);
  };

  // Handle keyboard events for Enter key functionality
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && testCompleted) {
      e.preventDefault();
      handleRestart();
    }
  }, [testCompleted, handleRestart]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Get character-level coloring with improved positioning
  const getCharacterClass = (charIndex, lineIndex) => {
    let lineStartPosition = 0;
    for (let i = 0; i < lineIndex; i++) {
      lineStartPosition += displayLines[i].length + 1;
    }
    const absoluteCharIndex = lineStartPosition + charIndex;
    
    if (absoluteCharIndex < typedText.length) {
      const currentDisplayText = displayLines.join(' ');
      const isCorrect = typedText[absoluteCharIndex] === currentDisplayText[absoluteCharIndex];
      return isCorrect
        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20' 
        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    } else if (absoluteCharIndex === typedText.length) {
      return 'bg-blue-400 dark:bg-blue-600 animate-pulse text-white';
    }
    
    return 'text-gray-600 dark:text-gray-400';
  };

  // Get space character class with improved logic
  const getSpaceClass = (lineIndex) => {
    let lineStartPosition = 0;
    for (let i = 0; i <= lineIndex; i++) {
      if (i < lineIndex) {
        lineStartPosition += displayLines[i].length + 1;
      } else {
        lineStartPosition += displayLines[i].length;
      }
    }
    
    if (lineStartPosition < typedText.length) {
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
    } else if (lineStartPosition === typedText.length) {
      return 'bg-blue-400 dark:bg-blue-600 animate-pulse text-white';
    }
    
    return 'text-gray-600 dark:text-gray-400';
  };

  // Calculate real-time stats
  const currentWPM = calculateWPM();
  const currentAccuracy = calculateAccuracy();
  const currentErrors = getCurrentErrors();
  const timeProgress = ((selectedDuration - timeLeft) / selectedDuration) * 100;

  // Use local final stats or fallback to context final stats
  const displayFinalStats = localFinalStats || finalStats;

  // Only show results when test is completed
  if (testCompleted && showResults && displayFinalStats) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Screen */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-center text-green-600 dark:text-green-400 flex items-center justify-center space-x-2">
              <Clock className="h-6 w-6" />
              <span>Test Complete!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-3xl font-bold text-primary-600">{displayFinalStats.wpm}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Words Per Minute</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{displayFinalStats.accuracy}%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{displayFinalStats.duration}s</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{displayFinalStats.errors}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Performance Rating: {' '}
                <span className={`font-bold ${
                  displayFinalStats.wpm >= 60 ? 'text-green-600 dark:text-green-400' :
                  displayFinalStats.wpm >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {displayFinalStats.wpm >= 60 ? 'Excellent' :
                   displayFinalStats.wpm >= 40 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
              
              {/* Test Configuration Summary */}
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Test Configuration:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedDuration}s
                  </span>
                  {textOptions.includeUppercase && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200">
                      <CaseSensitive className="h-3 w-3 mr-1" />
                      Uppercase
                    </span>
                  )}
                  {textOptions.includeNumbers && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                      <Hash className="h-3 w-3 mr-1" />
                      Numbers
                    </span>
                  )}
                  {textOptions.includeSpecialChars && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">
                      <Zap className="h-3 w-3 mr-1" />
                      Symbols
                    </span>
                  )}
                </div>
              </div>

              {/* Enter to restart hint */}
              <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center space-x-2">
                  <span>💡</span>
                  <span>Press <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">Enter</kbd> to start a new test</span>
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={handleRestart} className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Take Another Test</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Settings Panel - Inline Collapsible */}
      {showSettings && (
        <Card className="dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 animate-in slide-in-from-top-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100 text-lg">
                <Settings className="h-5 w-5 text-primary-600" />
                <span>Test Configuration</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="flex items-center space-x-1"
              >
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm">Hide</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Duration Selection */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Timer className="h-4 w-4 text-primary-600" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Duration
                </label>
                {testStarted && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    (Cannot change during test)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {TEST_DURATIONS.map((duration) => (
                  <Button
                    key={duration}
                    variant={selectedDuration === duration ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDurationChange(duration)}
                    disabled={testStarted}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {duration}s
                  </Button>
                ))}
              </div>
            </div>

            {/* Text Options */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Type className="h-4 w-4 text-primary-600" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Text Complexity
                </label>
                {testStarted && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    (Cannot change during test)
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    textOptions.includeUppercase 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-primary-300 dark:hover:border-primary-500'
                  } ${testStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !testStarted && handleTextOptionsChange('includeUppercase')}
                >
                  <div className="flex items-center space-x-2">
                    <CaseSensitive className={`h-5 w-5 ${textOptions.includeUppercase ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={`text-sm font-medium ${textOptions.includeUppercase ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'}`}>
                      Uppercase
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Include capital letters in the text
                  </p>
                </div>

                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    textOptions.includeNumbers 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-primary-300 dark:hover:border-primary-500'
                  } ${testStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !testStarted && handleTextOptionsChange('includeNumbers')}
                >
                  <div className="flex items-center space-x-2">
                    <Hash className={`h-5 w-5 ${textOptions.includeNumbers ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={`text-sm font-medium ${textOptions.includeNumbers ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'}`}>
                      Numbers
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Include digits 0-9 in the text
                  </p>
                </div>

                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    textOptions.includeSpecialChars 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-primary-300 dark:hover:border-primary-500'
                  } ${testStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !testStarted && handleTextOptionsChange('includeSpecialChars')}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className={`h-5 w-5 ${textOptions.includeSpecialChars ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={`text-sm font-medium ${textOptions.includeSpecialChars ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-200'}`}>
                      Symbols
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Include punctuation marks
                  </p>
                </div>
              </div>
            </div>

            {/* Current Settings Summary */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Active Configuration</h4>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-500 border dark:border-blue-700">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedDuration}s duration
                </span>
                {textOptions.includeUppercase && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border dark:border-blue-700">
                    <CaseSensitive className="h-3 w-3 mr-1" />
                    Uppercase
                  </span>
                )}
                {textOptions.includeNumbers && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border dark:border-green-700">
                    <Hash className="h-3 w-3 mr-1" />
                    Numbers
                  </span>
                )}
                {textOptions.includeSpecialChars && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border dark:border-purple-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Symbols
                  </span>
                )}
                {!textOptions.includeUppercase && !textOptions.includeNumbers && !textOptions.includeSpecialChars && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border dark:border-gray-600">
                    <Type className="h-3 w-3 mr-1" />
                    Lowercase only
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                {timeLeft}s
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Time Left</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{currentWPM.netWPM}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">WPM</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{currentAccuracy}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{currentErrors}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Area */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
              <Type className="h-5 w-5" />
              <span>Typing Test ({selectedDuration}s)</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
                {showSettings ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Time Progress</span>
              <span>{Math.round(timeProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${timeProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Text Display - Scrolling 5 lines */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg font-mono text-lg leading-relaxed h-40 overflow-hidden transition-all duration-200">
            {displayLines.map((line, lineIndex) => (
              <div key={`line-${lineOffset + lineIndex}`} className="mb-1 min-h-[1.5rem]">
                {line.split('').map((char, charIndex) => (
                  <span key={`char-${lineIndex}-${charIndex}`} className={getCharacterClass(charIndex, lineIndex)}>
                    {char}
                  </span>
                ))}
                {lineIndex < displayLines.length - 1 && (
                  <span className={getSpaceClass(lineIndex)}>
                    {' '}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <textarea
            ref={textareaRef}
            value={typedText}
            onChange={handleTextChange}
            disabled={timeLeft <= 0 || testCompleted}
            placeholder={
              testCompleted
                ? "Test completed! Press Enter to start a new test..."
                : timeLeft <= 0 
                ? "Time's up! Press Enter to restart..." 
                : `Press "ENTER" to begin the test...`
            }
            className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-lg disabled:bg-gray-100 dark:disabled:bg-gray-800 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Stats Footer */}
          <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Characters: {currentWPM.totalCharacters} | 
              Correct: {currentWPM.correctCharacters}
            </span>
            <span>
              {testCompleted ? 'Press Enter to restart' :
               testStarted ? `Lines: ${lineOffset + 1}` : 'Press "ENTER" to begin test'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingTest;