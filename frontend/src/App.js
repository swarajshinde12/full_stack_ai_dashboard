import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import Visualizations from './pages/Visualizations';
import ApiExplorer from './pages/ApiExplorer';
import './App.css';

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const location = useLocation();
  const isHome   = location.pathname === '/';

  const links = [
    { to: '/dashboard',      label: 'Dashboard' },
    { to: '/models',         label: 'Models' },
    { to: '/visualizations', label: 'Visualizations' },
    { to: '/api-explorer',   label: 'API Explorer' },
  ];

  return (
    <nav style={{
      background: 'rgba(15,23,42,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 32px',
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      height: 60,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        textDecoration: 'none',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>🤖</div>
        <span style={{
          fontWeight: 800, fontSize: 16, color: '#f8fafc',
          letterSpacing: -0.5,
        }}>ML Dashboard</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(l => {
          const active = location.pathname === l.to ||
                         location.pathname.startsWith(l.to + '/');
          return (
            <Link key={l.to} to={l.to} style={{
              textDecoration: 'none',
              padding: '6px 14px', borderRadius: 8,
              fontSize: 14, fontWeight: 500,
              color:      active ? '#f1f5f9' : '#64748b',
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              transition: 'all 0.2s',
            }}>
              {l.label}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <a
        href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/docs`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)',
          color: '#818cf8', padding: '6px 16px',
          borderRadius: 8, fontSize: 13, fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        API Docs ↗
      </a>
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <Router>
      <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/"                          element={<Home />} />
          <Route path="/dashboard"                 element={<Dashboard />} />
          <Route path="/models"                    element={<Models />} />
          <Route path="/models/:modelId"           element={<ModelDetail />} />
          <Route path="/visualizations"            element={<Visualizations />} />
          <Route path="/api-explorer"              element={<ApiExplorer />} />
        </Routes>
      </div>
    </Router>
  );
}
