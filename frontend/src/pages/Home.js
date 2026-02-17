import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">
          Deploy Your ML Models
          <br />
          <span className="gradient-text">With Ease</span>
        </h1>
        <p className="hero-subtitle">
          Upload your data, select a model, and get instant predictions.
          Visualize results and deploy to production.
        </p>
        <div className="hero-buttons">
          <Link to="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
          <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/docs`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            View API Docs
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Multiple Models</h3>
            <p>Text classification, sentiment analysis, image captioning, and more.</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Predictions</h3>
            <p>Get instant predictions with optimized model inference.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Visualizations</h3>
            <p>Interactive charts and graphs to understand results.</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon">🔌</div>
            <h3>REST API</h3>
            <p>Programmatic access to all models via REST API.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
