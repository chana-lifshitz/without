import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WineContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const WineContext = createContext<WineContextType | null>(null);

export const useWineContext = () => {
  const context = useContext(WineContext);
  if (!context) throw new Error('useWineContext must be used within WineProvider');
  return context;
};

export const WineProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('היינות שלנו');

  return (
    <WineContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </WineContext.Provider>
  );
};
