import { createContext, useContext, useState } from 'react';

const VJContext = createContext();

export function VJProvider({ children }) {
  const [selectedVj, setSelectedVj] = useState(() => localStorage.getItem('selectedVj') || '');

  const chooseVj = (vj) => {
    setSelectedVj(vj);
    if (vj) localStorage.setItem('selectedVj', vj);
    else localStorage.removeItem('selectedVj');
  };

  return (
    <VJContext.Provider value={{ selectedVj, chooseVj }}>
      {children}
    </VJContext.Provider>
  );
}

export const useVJ = () => useContext(VJContext);