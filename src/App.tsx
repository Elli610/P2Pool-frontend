import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Miners from "./components/Miners";
import Blocks from "./components/Blocks";
import Network from "./components/Network";
import Connections from "./components/Connections";
import GettingStarted from "./components/GettingStarted";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/miners" element={<Miners />} />
            <Route path="/blocks" element={<Blocks />} />
            <Route path="/network" element={<Network />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/getting-started" element={<GettingStarted />} />
          </Routes>
        </main>
        <footer className="footer">
          <span>P2Pool Monitor</span>
          <span className="text-muted">
            Auto-refresh: 30s | Monero Decentralized Mining
          </span>
        </footer>
      </div>
    </BrowserRouter>
  );
}
