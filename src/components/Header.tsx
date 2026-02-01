import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <h1>P2Pool Monitor</h1>
        <span className="header-subtitle">Monero Decentralized Mining</span>
      </div>
      <nav className="header-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/miners">Miners</NavLink>
        <NavLink to="/payouts">Payouts</NavLink>
        <NavLink to="/blocks">Blocks</NavLink>
        <NavLink to="/network">Network</NavLink>
        <NavLink to="/connections">Connections</NavLink>
        <NavLink to="/getting-started">Getting Started</NavLink>
      </nav>
    </header>
  );
}
