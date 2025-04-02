
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Presentation, getSavedPresentations, savePresentation } from '@/services/presentationService';

interface PresentationContextType {
  presentations: Presentation[];
  currentPresentation: Presentation | null;
  setCurrentPresentation: (presentation: Presentation | null) => void;
  addPresentation: (presentation: Presentation) => void;
  loading: boolean;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load saved presentations on mount
  useEffect(() => {
    setPresentations(getSavedPresentations());
    setLoading(false);
  }, []);

  const addPresentation = (presentation: Presentation) => {
    setPresentations(prev => [...prev, presentation]);
    setCurrentPresentation(presentation);
    savePresentation(presentation);
  };

  return (
    <PresentationContext.Provider
      value={{
        presentations,
        currentPresentation,
        setCurrentPresentation,
        addPresentation,
        loading
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentations = () => {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentations must be used within a PresentationProvider');
  }
  return context;
};
