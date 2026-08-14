import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Teams } from './pages/Teams';
import { TeamDetail } from './pages/TeamDetail';
import { Players } from './pages/Players';
import { Tefr } from './pages/Tefr';
import { AuctionPage } from './pages/AuctionPage';
import { AuctionRoom } from './pages/AuctionRoom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/squadre" element={<Teams />} />
          <Route path="/squadre/:id" element={<TeamDetail />} />
          <Route path="/giocatori" element={<Players />} />
          <Route path="/tefr" element={<Tefr />} />
          <Route path="/asta" element={<AuctionPage />} />
          <Route path="/asta/:id" element={<AuctionRoom />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
