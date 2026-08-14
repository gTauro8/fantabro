import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Teams } from './pages/Teams';
import { TeamDetail } from './pages/TeamDetail';
import { Players } from './pages/Players';
import { Breakouts } from './pages/Breakouts';
import { Tefr } from './pages/Tefr';
import { AuctionPage } from './pages/AuctionPage';
import { AuctionRoom } from './pages/AuctionRoom';
import { GenerateSquad } from './pages/GenerateSquad';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/squadre" element={<Teams />} />
          <Route path="/squadre/:id" element={<TeamDetail />} />
          <Route path="/giocatori" element={<Players />} />
          <Route path="/sorprese" element={<Breakouts />} />
          <Route path="/tefr" element={<Tefr />} />
          <Route path="/asta" element={<AuctionPage />} />
          <Route path="/asta/:id" element={<AuctionRoom />} />
          <Route path="/genera-rosa" element={<GenerateSquad />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
