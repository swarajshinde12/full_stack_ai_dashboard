import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

// ── Single feature card ───────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, link, linkLabel, delay }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '32px 28px',
        cursor: 'pointer', height: '100%',
        transition: 'all 0.3s ease',
        animation: `fadeUp 0.6s ease ${delay}s both`,
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)';
          e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(99,102,241,0.15)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, marginBottom: 20,
        }}>{icon}</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 20 }}>
          {desc}
        </p>
        <span style={{
          fontSize: 13, color: '#6366f1', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {linkLabel} <span style={{ fontSize: 16 }}>→</span>
        </span>
      </div>
    </Link>
  );
}

// ── Model badge ───────────────────────────────────────────────────────────────
function ModelBadge({ name, type, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}33`,
      borderRadius: 12, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}`,
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{name}</div>
        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{type}</div>
      </div>
      <div style={{
        marginLeft: 'auto', fontSize: 11, fontWeight: 700,
        color: color, background: `${color}22`,
        padding: '3px 10px', borderRadius: 99,
      }}>LIVE</div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div style={{
      background: '#0a0f1e',
      minHeight: '100vh',
      color: '#e2e8f0',
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      overflowX: 'hidden',
    }}>

      {/* ── Gradient background blobs ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: 600, height: 600,
          borderRadius: '50%', top: -200, left: -200,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500,
          borderRadius: '50%', bottom: -100, right: -100,
          background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          borderRadius: '50%', top: '40%', left: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }} />
      </div>

      {/* ══════════ HERO ══════════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: '80px 32px 60px',
        textAlign: 'center',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 99, padding: '6px 16px',
          fontSize: 13, color: '#818cf8', fontWeight: 600,
          marginBottom: 32,
          animation: 'fadeDown 0.5s ease both',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 6px #10b981',
            display: 'inline-block',
          }} />
          3 AI Models Running Live
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 800, lineHeight: 1.1,
          color: '#f8fafc', marginBottom: 24,
          letterSpacing: -2,
          animation: 'fadeUp 0.6s ease 0.1s both',
        }}>
          Deploy ML Models.
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Get Instant Predictions.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 18, color: '#64748b', lineHeight: 1.8,
          maxWidth: 560, margin: '0 auto 40px',
          animation: 'fadeUp 0.6s ease 0.2s both',
        }}>
          Upload your data, run real AI models — DistilBERT, RoBERTa, BLIP —
          and visualize results instantly. No setup required.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex', gap: 14, justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeUp 0.6s ease 0.3s both',
        }}>
          <Link to="/dashboard" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', padding: '14px 32px',
            borderRadius: 12, fontWeight: 700, fontSize: 15,
            textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.35)';
            }}
          >
            🚀 Launch Dashboard
          </Link>

          <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/docs`} target="_blank" rel="noopener noreferrer"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8', padding: '14px 32px',
              borderRadius: 12, fontWeight: 600, fontSize: 15,
              textDecoration: 'none', display: 'inline-block',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#f1f5f9';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            📚 View API Docs
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 48, justifyContent: 'center',
          marginTop: 64, flexWrap: 'wrap',
          animation: 'fadeUp 0.6s ease 0.4s both',
        }}>
          {[
            { value: 3,   suffix: '',  label: 'AI Models' },
            { value: 95,  suffix: '%', label: 'Accuracy' },
            { value: 500, suffix: 'ms', label: 'Avg Response' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 36, fontWeight: 800, color: '#f8fafc',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ LIVE MODELS STRIP ══════════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: '0 32px 80px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20, padding: '28px 32px',
        }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20,
          }}>
            Live Models
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}>
            <ModelBadge name="DistilBERT" type="Text Classification · NLP" color="#6366f1" />
            <ModelBadge name="RoBERTa" type="Sentiment Analysis · NLP" color="#8b5cf6" />
            <ModelBadge name="BLIP" type="Image Captioning · Vision" color="#10b981" />
          </div>
        </div>
      </div>

      {/* ══════════ FEATURES ══════════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: '0 32px 100px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: '#6366f1',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12,
          }}>
            Everything You Need
          </p>
          <h2 style={{
            fontSize: 36, fontWeight: 800, color: '#f8fafc',
            letterSpacing: -1,
          }}>
            Built for Data Scientists
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          <FeatureCard
            icon="🧠"
            title="Multiple Models"
            desc="Run DistilBERT for text classification, RoBERTa for sentiment analysis, and BLIP for image captioning — all in one platform."
            link="/dashboard"
            linkLabel="Try the models"
            delay={0.1}
          />
          <FeatureCard
            icon="⚡"
            title="Fast Predictions"
            desc="Upload a CSV or image and get predictions in under a second. Optimized inference pipeline with real-time feedback."
            link="/dashboard"
            linkLabel="Run predictions"
            delay={0.2}
          />
          <FeatureCard
            icon="📊"
            title="Visualizations"
            desc="Automatic pie charts and bar graphs showing prediction distribution and confidence scores for every result."
            link="/dashboard"
            linkLabel="See charts"
            delay={0.3}
          />
          <FeatureCard
            icon="🔌"
            title="REST API"
            desc="Every model is exposed as a REST endpoint. Integrate directly into your app using standard HTTP requests."
            link="/dashboard"
            linkLabel="View API docs"
            delay={0.4}
          />
        </div>
      </div>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '80px 32px',
        marginBottom: 80,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: '#6366f1',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12,
          }}>
            Simple Workflow
          </p>
          <h2 style={{
            fontSize: 36, fontWeight: 800, color: '#f8fafc',
            letterSpacing: -1, marginBottom: 56,
          }}>
            How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32, position: 'relative',
          }}>
            {[
              { step: '01', icon: '🎯', title: 'Pick a Model', desc: 'Choose from Text Classification, Sentiment Analysis, or Image Captioning' },
              { step: '02', icon: '📁', title: 'Upload Data', desc: 'Upload a CSV file with a text column or any image file' },
              { step: '03', icon: '⚡', title: 'Run Inference', desc: 'Click Get Predictions and the real AI model processes your data' },
              { step: '04', icon: '📊', title: 'See Results', desc: 'View predictions in a table with charts and confidence scores' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: '#6366f1',
                  letterSpacing: 2, marginBottom: 16,
                }}>
                  STEP {item.step}
                </div>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, margin: '0 auto 16px',
                }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ CTA BANNER ══════════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: '0 32px 100px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 24, padding: '56px 40px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 32, fontWeight: 800, color: '#f8fafc',
            marginBottom: 16, letterSpacing: -1,
          }}>
            Ready to run your first prediction?
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>
            No sign up needed. Upload a CSV and get results in seconds.
          </p>
          <Link to="/dashboard" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', padding: '16px 40px',
            borderRadius: 12, fontWeight: 700, fontSize: 16,
            textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🚀 Launch Dashboard →
          </Link>
        </div>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '32px',
        textAlign: 'center',
        color: '#334155', fontSize: 13,
      }}>
        ML Dashboard · Built with FastAPI + React · 3 Real AI Models
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
