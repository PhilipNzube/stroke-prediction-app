import React, { createContext, useContext, useReducer } from 'react';

const PredictionContext = createContext();

const initialState = {
  predictionData: null,
  results: null,
  loading: false,
  error: null,
  userProfile: null,
};

const predictionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PREDICTION_DATA':
      return { ...state, predictionData: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'CLEAR_RESULTS':
      return { ...state, results: null, error: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const PredictionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(predictionReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setPredictionData = (data) => {
    dispatch({ type: 'SET_PREDICTION_DATA', payload: data });
  };

  const setResults = (results) => {
    dispatch({ type: 'SET_RESULTS', payload: results });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setUserProfile = (profile) => {
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
  };

  const clearResults = () => {
    dispatch({ type: 'CLEAR_RESULTS' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const value = {
    ...state,
    setLoading,
    setPredictionData,
    setResults,
    setError,
    setUserProfile,
    clearResults,
    reset,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};
