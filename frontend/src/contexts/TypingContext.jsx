import React, { createContext, useContext, useReducer } from 'react';
import api from '../services/api';

const TypingContext = createContext();

const typingReducer = (state, action) => {
  switch (action.type) {
    case 'START_TEST':
      return {
        ...state,
        isActive: true,
        startTime: Date.now(),
        currentIndex: 0,
        typedText: '',
        errors: 0,
        timeElapsed: 0
      };
    case 'UPDATE_TYPING':
      return {
        ...state,
        typedText: action.payload.typedText,
        currentIndex: action.payload.currentIndex,
        errors: action.payload.errors,
        timeElapsed: action.payload.timeElapsed
      };
    case 'FINISH_TEST':
      return {
        ...state,
        isActive: false,
        isCompleted: true,
        finalStats: action.payload
      };
    case 'RESET_TEST':
      return {
        ...initialState,
        testText: state.testText
      };
    case 'SET_TEST_TEXT':
      return {
        ...state,
        testText: action.payload
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  testText: '',
  typedText: '',
  currentIndex: 0,
  isActive: false,
  isCompleted: false,
  startTime: null,
  timeElapsed: 0,
  errors: 0,
  duration: 60, // seconds
  results: [],
  finalStats: null
};

export const TypingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(typingReducer, initialState);

  const startTest = (testText) => {
    dispatch({ type: 'SET_TEST_TEXT', payload: testText });
    dispatch({ type: 'START_TEST' });
  };

  const updateTyping = (typedText) => {
    if (!state.isActive) return;

    const currentIndex = typedText.length;
    const timeElapsed = (Date.now() - state.startTime) / 1000;
    
    // Calculate errors
    let errors = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] !== state.testText[i]) {
        errors++;
      }
    }

    // Check if test is completed
    if (currentIndex >= state.testText.length || timeElapsed >= state.duration) {
      const wpm = Math.round((typedText.length / 5) / (timeElapsed / 60));
      const accuracy = Math.round(((typedText.length - errors) / typedText.length) * 100) || 0;
      
      const finalStats = {
        wpm,
        accuracy,
        duration: Math.round(timeElapsed),
        totalCharacters: typedText.length,
        errors
      };

      dispatch({ type: 'FINISH_TEST', payload: finalStats });
      return finalStats;
    }

    dispatch({
      type: 'UPDATE_TYPING',
      payload: { typedText, currentIndex, errors, timeElapsed }
    });
  };

  const resetTest = () => {
    dispatch({ type: 'RESET_TEST' });
  };

  const saveResult = async (resultData) => {
    try {
      await api.post('/users/save-result', resultData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const getResults = async () => {
    try {
      const response = await api.post('/users/get-result');
      dispatch({ type: 'SET_RESULTS', payload: response.data.data });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  return (
    <TypingContext.Provider value={{
      ...state,
      startTest,
      updateTyping,
      resetTest,
      saveResult,
      getResults
    }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error('useTyping must be used within a TypingProvider');
  }
  return context;
};