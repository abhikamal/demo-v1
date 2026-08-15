import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { View } from '../AppContent';

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

const INITIAL_MESSAGES: Message[] = [
  { 
    id: '1', 
    sender: 'ai', 
    text: 'Hello Abhinav! I am Croevo AI. What kind of game would you like to create today?' 
  }
];

interface AppContextType {
  currentView: View;
  navigateTo: (view: View) => void;
  coinBalance: number;
  setCoinBalance: (balance: number) => void;
  chatMessages: Message[];
  addMessage: (msg: Message) => void;
  showEstimateButton: boolean;
  setShowEstimateButton: (show: boolean) => void;
  isGeneratingGame: boolean;
  setIsGeneratingGame: (isGenerating: boolean) => void;
  resetProject: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [coinBalance, setCoinBalance] = useState<number>(100);
  const [chatMessages, setChatMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [showEstimateButton, setShowEstimateButton] = useState(false);
  const [isGeneratingGame, setIsGeneratingGame] = useState(false);

  const navigateTo = (view: View) => setCurrentView(view);
  const addMessage = (msg: Message) => setChatMessages(prev => [...prev, msg]);
  
  const resetProject = () => {
    setChatMessages(INITIAL_MESSAGES);
    setShowEstimateButton(false);
    setIsGeneratingGame(false);
    setCurrentView('home');
  };

  return (
    <AppContext.Provider value={{
      currentView, navigateTo,
      coinBalance, setCoinBalance,
      chatMessages, addMessage,
      showEstimateButton, setShowEstimateButton,
      isGeneratingGame, setIsGeneratingGame,
      resetProject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
