import React from 'react';
import { Link } from 'react-router-dom';

const MODELS = [
  {
    id: 'text-classification',
    name: 'Text Classification',
    model: 'DistilBERT',
    org: 'Hugging Face',
    type: 'NLP',
    color: '#6366f1',
    icon: '🔤',
    desc: 'Classify any text as positive or negative using DistilBERT fine-tuned on SST-2. Upload a CSV with a "text" column to classify multiple texts at once.',
    accepts: 'CSV file with "text" column',
    output: 'positive / negative + confidence score',
    speed: '~50ms per text',
    accuracy: '91.3%',
    useCases: ['Product reviews', 'Customer feedback', 'Social media posts', 'Survey responses'],
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    model: 'RoBERTa',
    org: 'Cardiff NLP',
    type: 'NLP',
    color: '#8b5cf6',
    icon: '💬',
    desc: 'Advanced 3-class sentiment analysis using RoBERTa trained on 124M tweets. Detects positive, negative, and neutral sentiment with high accuracy.',
    accepts: 'CSV file with "text" column',
    output: 'positive / negative / neutral + confidence score',
    speed: '~80ms per text',
    accuracy: '94.1%',
    useCases: ['Twitter/X analysis', 'Brand monitoring', 'News sentiment', 'Chat analysis'],
  },
  {
    id: 'image-captioning',
    name: 'Image Captioning',
    model: 'BLIP',
    org: 'Salesforce',
    type: 'Computer Vision',
    color: '#10b981',
    icon: '🖼️',
    desc: 'Generate natural language captions for any image using BLIP (Bootstrapped Language-Image Pre-training) from Salesforce Research.',
    accepts: 'Any image (JPG, PNG, WebP, AVIF)',
    output: 'Natural language caption describing the image',
    speed: '~200ms per image',
    accuracy: '85% caption accuracy',
    useCases: ['Image indexing', 'Accessibility', 'Content tagging', 'Visual search'],
  },
];

export default function Models() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1e 0%,#0f172a 100%)',
      color: '#e2e8f0', padding: '48px 32px',
      fontFamily: '"Segoe UI",system-ui,sans-serif',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontSize: 12, fontWeight: 700, color: '#6366f1',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12,
          }}>Available Models</p>
          <h1 style={{
            fontSize: 40, fontWeight: 800, color: '#f8fafc',
            letterSpacing: -1, marginBottom: 12,
          }}>3 Production AI Models</h1>
          <p style={{ fontSize: 16, color: '#475569' }}>
            Click any model to open its dedicated workspace
          </p>
        </div>

        {/* Model cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {MODELS.map((m, i) => (
            <div key={m.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${m.color}33`,
              borderRadius: 20, overflow: 'hidden',
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 0 }}>

                {/* Left info */}
                <div style={{ padding: '32px 36px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: `${m.color}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, flexShrink: 0,
                    }}>{m.icon}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>
                          {m.name}
                        </h2>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: m.color, background: `${m.color}22`,
                          padding: '3px 10px', borderRadius: 99,
                        }}>{m.type}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                        {m.model} · {m.org}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>
                    {m.desc}
                  </p>

                  {/* Specs row */}
                  <div style={{ display: 'flex', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Accepts', val: m.accepts },
                      { label: 'Output',  val: m.output },
                      { label: 'Speed',   val: m.speed },
                      { label: 'Accuracy',val: m.accuracy },
                    ].map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: 11, color: '#334155', textTransform: 'uppercase',
                                      letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{s.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Use cases */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {m.useCases.map(u => (
                      <span key={u} style={{
                        fontSize: 12, color: '#475569',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '4px 12px', borderRadius: 99,
                      }}>{u}</span>
                    ))}
                  </div>
                </div>

                {/* Right CTA */}
                <div style={{
                  background: `${m.color}0a`,
                  borderLeft: `1px solid ${m.color}22`,
                  padding: '32px 36px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 16, minWidth: 200,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#10b981', boxShadow: '0 0 8px #10b981',
                  }} />
                  <p style={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>
                    Model is live and ready
                  </p>
                  <Link to={`/models/${m.id}`} style={{
                    background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`,
                    color: '#fff', padding: '12px 28px',
                    borderRadius: 10, fontWeight: 700, fontSize: 14,
                    textDecoration: 'none', textAlign: 'center',
                    boxShadow: `0 8px 20px ${m.color}44`,
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}>
                    Use This Model →
                  </Link>
                  <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/docs`} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontSize: 12, color: '#475569',
                      textDecoration: 'none',
                    }}>
                    View API endpoint ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
