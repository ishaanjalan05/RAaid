import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Resident } from '../types/Resident';
import { v4 as uuidv4 } from 'uuid';

interface ResidentContextType {
  residents: Resident[];
  addResident: (resident: Omit<Resident, 'id'>) => void;
  updateResident: (resident: Resident) => void;
  deleteResident: (id: string) => void;
}

const ResidentContext = createContext<ResidentContextType | undefined>(
  undefined,
);

export const useResidents = () => {
  const context = useContext(ResidentContext);
  if (!context) {
    throw new Error('useResidents must be used within a ResidentProvider');
  }
  return context;
};

type ResidentProviderProps = PropsWithChildren<{
  initialResidents: Resident[];
}>;

export const ResidentProvider = ({
  children,
  initialResidents,
}: ResidentProviderProps) => {
  const [residents, setResidents] = useState<Resident[]>(initialResidents);

  const addResident = (resident: Omit<Resident, 'id'>) => {
    const newResident = { ...resident, id: uuidv4() };
    setResidents([...residents, newResident]);
  };

  const updateResident = (updatedResident: Resident) => {
    setResidents(
      residents.map((r) =>
        r.id === updatedResident.id ? updatedResident : r,
      ),
    );
  };

  const deleteResident = (id: string) => {
    setResidents(residents.filter((r) => r.id !== id));
  };

  return (
    <ResidentContext.Provider
      value={{ residents, addResident, updateResident, deleteResident }}
    >
      {children}
    </ResidentContext.Provider>
  );
};
