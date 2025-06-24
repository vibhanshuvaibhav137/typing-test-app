import React, { createContext, useContext, useReducer, useCallback } from 'react';
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
        timeElapsed: 0,
        isCompleted: false,
        finalStats: null
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
        results: state.results // Preserve results when resetting test
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
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
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
  duration: 60,
  results: [],
  finalStats: null,
  loading: false
};

export const TypingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(typingReducer, initialState);

  const startTest = useCallback((testText) => {
    dispatch({ type: 'SET_TEST_TEXT', payload: testText });
    dispatch({ type: 'START_TEST' });
  }, []);

  const updateTyping = useCallback((typedText) => {
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

    dispatch({
      type: 'UPDATE_TYPING',
      payload: { typedText, currentIndex, errors, timeElapsed }
    });
  }, [state.isActive, state.startTime, state.testText]);

  const resetTest = useCallback(() => {
    dispatch({ type: 'RESET_TEST' });
  }, []);

  const saveResult = useCallback(async (resultData) => {
    try {
      const response = await api.post('/users/save-result', resultData);
      console.log('Result saved:', response.data);
      return { success: true };
    } catch (error) {
      console.error('Error saving result:', error);
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  const getResults = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/users/get-result');
      dispatch({ type: 'SET_RESULTS', payload: response.data.data });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching results:', error);
      return { success: false, error: error.response?.data?.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

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