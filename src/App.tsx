import residentsData from './data/residents.json';
import type { Resident } from './types/Resident';
import { Header } from './components/Header';
import { BroadcastMessage } from './components/BroadcastMessage';
import { ResidentsList } from './components/ResidentsList';
import { ResidentProvider } from './components/ResidentProvider';

function App() {
  const residents = residentsData.residents as Resident[];
  const raName = residentsData.ra.name;

  return (
    <ResidentProvider initialResidents={residents}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Header raName={raName} residentCount={residents.length} />
          <BroadcastMessage residents={residents}/>
          <ResidentsList />
        </div>
      </div>
    </ResidentProvider>
  );
}

export default App;