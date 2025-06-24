import React, { useState, useEffect, useCallback } from 'react';
import { useTyping } from '../../contexts/TypingContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { SAMPLE_TEXTS } from '../../utils/constants';
import { Clock, RotateCcw, Play, Pause } from 'lucide-react';
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
    duration,
    finalStats,
    startTest,
    updateTyping,
    resetTest,
    saveResult
  } = useTyping();

  const [selectedDuration, setSelectedDuration] = useState(60);
  const [showResults, setShowResults] = useState(false);

  // Initialize with random text
  useEffect(() => {
    if (!testText) {
      const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
      startTest(randomText);
    }
  }, [testText, startTest]);

  const handleStart = () => {
    if (!testText) {
      const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
      startTest(randomText);
    } else {
      startTest(testText);
    }
  };

  const handleReset = () => {
    resetTest();
    setShowResults(false);
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    startTest(randomText);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    const stats = updateTyping(value);
    
    if (stats && !showResults) {
      setShowResults(true);
      // Auto-save result if user is logged in
      if (user) {
        saveResult({
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          duration: stats.duration
        }).then((result) => {
          if (result.success) {
            toast.success('Result saved successfully!');
          }
        });
      }
    }
  };

  const getCharacterClass = (index) => {
    if (index < typedText.length) {
      return typedText[index] === testText[index] 
        ? 'bg-green-200 text-green-800' 
        : 'bg-red-200 text-red-800';
    }
    if (index === currentIndex && isActive) {
      return 'bg-blue-200 animate-pulse';
    }
    return 'text-gray-600';
  };

  const wpm = isActive ? Math.round((typedText.length / 5) / (timeElapsed / 60)) || 0 : 0;
  const accuracy = typedText.length > 0 ? Math.round(((typedText.length - errors) / typedText.length) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                {Math.max(0, selectedDuration - Math.floor(timeElapsed))}s
              </span>
            </div>
            <p className="text-sm text-gray-600">Time Left</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{wpm}</div>
            <p className="text-sm text-gray-600">WPM</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
            <p className="text-sm text-gray-600">Accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errors}</div>
            <p className="text-sm text-gray-600">Errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Area */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Typing Test</CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={handleStart}
                disabled={isActive}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Play className="h-4 w-4" />
                <span>Start</span>
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
          {/* Text Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg font-mono text-lg leading-relaxed">
            {testText.split('').map((char, index) => (
              <span key={index} className={getCharacterClass(index)}>
                {char}
              </span>
            ))}
          </div>

          {/* Input Area */}
          <textarea
            value={typedText}
            onChange={handleTextChange}
            disabled={!isActive || isCompleted}
            placeholder={isActive ? "Start typing..." : "Click Start to begin"}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-lg disabled:bg-gray-100"
            spellCheck="false"
            autoComplete="off"
          />
        </CardContent>
      </Card>

      {/* Results Modal */}
      {showResults && finalStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Test Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600">{finalStats.wpm}</div>
                <p className="text-sm text-gray-600">Words Per Minute</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{finalStats.accuracy}%</div>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{finalStats.duration}s</div>
                <p className="text-sm text-gray-600">Duration</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{finalStats.errors}</div>
                <p className="text-sm text-gray-600">Errors</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={handleReset}>Try Again</Button>
              <Button variant="secondary" onClick={() => setShowResults(false)}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TypingTest;