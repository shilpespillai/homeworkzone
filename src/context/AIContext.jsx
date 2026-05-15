import React, { createContext, useContext, useState, useEffect } from 'react';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('hz_ai_key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('hz_ai_model') || 'gpt-4o');

  useEffect(() => {
    localStorage.setItem('hz_ai_key', apiKey);
    localStorage.setItem('hz_ai_model', model);
  }, [apiKey, model]);

  const hasKey = !!apiKey;

  return (
    <AIContext.Provider value={{ apiKey, setApiKey, model, setModel, hasKey }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
