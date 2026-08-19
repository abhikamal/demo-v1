import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { View } from '../AppContent';

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export interface UserProfile {
  name: string;
  email: string;
}

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
  user: UserProfile | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('croevo_auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentView, setCurrentView] = useState<View>('home');
  const [coinBalance, setCoinBalance] = useState<number>(100);
  
  const getInitialMessages = (userName?: string): Message[] => [
    { 
      id: '1', 
      sender: 'ai', 
      text: `Hello ${userName || 'Guest'}! I am Croevo AI. What kind of game would you like to create today?` 
    }
  ];

  const [chatMessages, setChatMessages] = useState<Message[]>(getInitialMessages(user?.name));
  const [showEstimateButton, setShowEstimateButton] = useState(false);
  const [isGeneratingGame, setIsGeneratingGame] = useState(false);

  const navigateTo = (view: View) => setCurrentView(view);
  const addMessage = (msg: Message) => setChatMessages(prev => [...prev, msg]);
  
  const resetProject = () => {
    setChatMessages(getInitialMessages(user?.name));
    setShowEstimateButton(false);
    setIsGeneratingGame(false);
    setCurrentView('home');
  };

  const login = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('croevo_auth_user', JSON.stringify(newUser));
    setChatMessages(getInitialMessages(name));
    setCurrentView('home');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('croevo_auth_user');
    setChatMessages(getInitialMessages('Guest'));
    setCurrentView('home');
  };

  return (
    <AppContext.Provider value={{
      currentView, navigateTo,
      coinBalance, setCoinBalance,
      chatMessages, addMessage,
      showEstimateButton, setShowEstimateButton,
      isGeneratingGame, setIsGeneratingGame,
      resetProject,
      user, login, logout
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
