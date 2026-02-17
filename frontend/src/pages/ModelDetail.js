import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MODEL_CONFIG = {
  'text-classification': {
    name: 'Text Classification',
    model: 'DistilBERT',
    color: '#6366f1',
    icon: '🔤',
    endpoint: 'text-classification',
    inputType: 'csv',
    desc: 'Classify texts as positive or negative',
    exampleFile: 'Upload a CSV with a "text" column',
    resultKey: 'prediction',
  },
  'sentiment-analysis': {
    name: 'Sentiment Analysis',
    model: 'RoBERTa',
    color: '#8b5cf6',
    icon: '💬',
    endpoint: 'sentiment-analysis',
    inputType: 'csv',
    desc: 'Detect positive, negative, or neutral sentiment',
    exampleFile: 'Upload a CSV with a "text" column',
    resultKey: 'sentiment',
  },
  'image-captioning': {
    name: 'Image Captioning',
    model: 'BLIP',
    color: '#10b981',
    icon: '🖼️',
    endpoint: 'image-caption',
    inputType: 'image',
    desc: 'Generate captions for any image',
    exampleFile: 'Upload any image (JPG, PNG, WebP)',
    resultKey: 'caption',
  },
};

const COLORS = { positive: '#10b981', negative: '#ef4444', neutral: '#f59e0b' };

function ConfidenceBar({ value }) {
  const pct = Math.round((value || 0) * 100);
  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: '#1e293b', borderRadius: 99, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 99, transition: 'width 0.6s' }} />
      </div>
      <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 34 }}>{pct}%</span>
    </div>
  );
}

function Badge({ label }) {
  const c = COLORS[label] || '#94a3b8';
  return (
    <span style={{
      background: `${c}22`, color: c,
      padding: '2px 10px', borderRadius: 99,
      fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
    }}>{label}</span>
  );
}

export default function ModelDetail() {
  const { modelId } = useParams();
  const config = MODEL_CONFIG[modelId];

  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);
  const [preview, setPreview] = useState(null);

  if (!config) {
    return (
      <div style={{ padding: 80, textAlign: 'center', color: '#475569' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h2>Model not found</h2>
        <Link to="/models" style={{ color: '#6366f1' }}>← Back to Models</Link>
      </div>
    );
  }

  function handleFile(e) {
    const f = e.target.files[0];
    setFile(f);
    setError(null);
    setResult(null);
    if (config.inputType === 'image' && f) {
      setPreview(URL.createObjectURL(f));
    }
  }

  async function handleRun() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const r = await axios.post(
        `${API_URL}/api/predict/${config.endpoint}`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResult(r.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  }

  const pieData = result?.summary
    ? Object.entries(result.summary).filter(([,v]) => v > 0).map(([name,value]) => ({ name, value }))
    : [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1e 0%,#0f172a 100%)',
      color: '#e2e8f0', padding: '40px 32px',
      fontFamily: '"Segoe UI",system-ui,sans-serif',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13 }}>
          <Link to="/models" style={{ color: '#475569', textDecoration: 'none' }}>Models</Link>
          <span style={{ color: '#334155' }}>›</span>
          <span style={{ color: '#94a3b8' }}>{config.name}</span>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40,
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${config.color}33`,
          borderRadius: 20, padding: '28px 32px',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `${config.color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, flexShrink: 0,
          }}>{config.icon}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>
              {config.name}
            </h1>
            <p style={{ fontSize: 14, color: '#475569' }}>
              Powered by <span style={{ color: config.color, fontWeight: 600 }}>{config.model}</span>
              &nbsp;·&nbsp;{config.desc}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>Live</span>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>

          {/* LEFT — Upload panel */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: 28,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#cbd5e1', marginBottom: 20 }}>
              Upload {config.inputType === 'image' ? 'Image' : 'CSV File'}
            </h3>

            {/* Upload box */}
            <label htmlFor="file-input" style={{
              display: 'block',
              border: `2px dashed ${file ? config.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 14, padding: '28px 20px',
              textAlign: 'center', cursor: 'pointer',
              background: file ? `${config.color}08` : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s', marginBottom: 20,
            }}>
              <input id="file-input" type="file" style={{ display: 'none' }}
                accept={config.inputType === 'image' ? 'image/*' : '.csv'}
                onChange={handleFile} />

              {/* Image preview */}
              {config.inputType === 'image' && preview ? (
                <div>
                  <img src={preview} alt="preview" style={{
                    maxWidth: '100%', maxHeight: 160, borderRadius: 10,
                    marginBottom: 10, objectFit: 'contain',
                  }} />
                  <p style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ {file?.name}</p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>
                    {config.inputType === 'image' ? '🖼️' : '📄'}
                  </div>
                  {file ? (
                    <p style={{ fontSize: 13, color: config.color, fontWeight: 600 }}>✓ {file.name}</p>
                  ) : (
                    <>
                      <p style={{ fontSize: 14, color: '#475569', marginBottom: 6 }}>
                        Click to upload
                      </p>
                      <p style={{ fontSize: 12, color: '#334155' }}>{config.exampleFile}</p>
                    </>
                  )}
                </>
              )}
            </label>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid #ef444444',
                borderRadius: 10, padding: '10px 14px',
                color: '#ef4444', fontSize: 13, marginBottom: 16,
              }}>⚠ {error}</div>
            )}

            {/* Run button */}
            <button onClick={handleRun} disabled={!file || loading} style={{
              width: '100%', padding: '13px 0', borderRadius: 12,
              border: 'none', fontWeight: 700, fontSize: 15, cursor: !file || loading ? 'not-allowed' : 'pointer',
              background: !file || loading
                ? 'rgba(255,255,255,0.06)'
                : `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
              color: !file || loading ? '#475569' : '#fff',
              boxShadow: file && !loading ? `0 8px 20px ${config.color}44` : 'none',
              transition: 'all 0.2s',
            }}>
              {loading ? '⏳ Running model…' : `🚀 Run ${config.model}`}
            </button>

            {/* Instructions */}
            <div style={{
              marginTop: 24, padding: 16,
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#334155',
                          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                How to use
              </p>
              {config.inputType === 'csv' ? (
                <>
                  <p style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                    1. Prepare a CSV file with a column named <code style={{ color: config.color }}>"text"</code>
                  </p>
                  <p style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                    2. Upload the CSV file above
                  </p>
                  <p style={{ fontSize: 12, color: '#475569' }}>
                    3. Click Run to get predictions for all rows
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                    1. Upload any image (JPG, PNG, WebP, AVIF)
                  </p>
                  <p style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>
                    2. Preview appears above
                  </p>
                  <p style={{ fontSize: 12, color: '#475569' }}>
                    3. Click Run to generate caption
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Empty state */}
            {!result && !loading && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20, padding: 80, textAlign: 'center',
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{config.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                  Ready to run {config.name}
                </h3>
                <p style={{ fontSize: 14, color: '#1e293b' }}>
                  Upload a file on the left and click Run
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${config.color}33`,
                borderRadius: 20, padding: 80, textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16, animation: 'spin 1s linear infinite' }}>⚙️</div>
                <p style={{ color: '#475569' }}>Running {config.model} inference…</p>
              </div>
            )}

            {/* Image caption result */}
            {result && config.inputType === 'image' && (
              <div style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 20, padding: 36, textAlign: 'center',
              }}>
                <p style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>Generated Caption</p>
                <p style={{
                  fontSize: 26, fontWeight: 700, color: '#10b981',
                  fontStyle: 'italic', marginBottom: 16, lineHeight: 1.4,
                }}>
                  "{result.caption}"
                </p>
                {preview && (
                  <img src={preview} alt="uploaded" style={{
                    maxHeight: 240, maxWidth: '100%',
                    borderRadius: 12, marginTop: 16, objectFit: 'contain',
                  }} />
                )}
                <p style={{ fontSize: 13, color: '#334155', marginTop: 16 }}>
                  Model: {result.model_name}
                </p>
              </div>
            )}

            {/* NLP results */}
            {result && config.inputType === 'csv' && result.summary && (
              <>
                {/* Summary + charts */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20, padding: 28,
                }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#cbd5e1', marginBottom: 20 }}>
                    📊 Results Summary — {result.total_predictions} predictions
                  </p>

                  {/* Stat pills */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
                    {Object.entries(result.summary).map(([k, v]) => (
                      <div key={k} style={{
                        background: `${COLORS[k] || '#94a3b8'}22`,
                        border: `1px solid ${COLORS[k] || '#94a3b8'}44`,
                        borderRadius: 12, padding: '16px 24px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: COLORS[k] || '#94a3b8' }}>{v}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 4, textTransform: 'capitalize' }}>{k}</div>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>Distribution</p>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" outerRadius={70}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                            labelLine={false}>
                            {pieData.map(e => <Cell key={e.name} fill={COLORS[e.name] || '#6366f1'} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#e2e8f0' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>Count by Label</p>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={pieData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#e2e8f0' }} />
                          <Bar dataKey="value" radius={[6,6,0,0]}>
                            {pieData.map(e => <Cell key={e.name} fill={COLORS[e.name] || '#6366f1'} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Predictions table */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20, padding: 28,
                }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#cbd5e1', marginBottom: 20 }}>
                    🔍 Individual Predictions ({result.predictions.length} shown)
                  </p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr>
                          {['#','Text','Label','Confidence'].map(h => (
                            <th key={h} style={{
                              textAlign: 'left', padding: '10px 14px',
                              color: '#334155', borderBottom: '1px solid rgba(255,255,255,0.06)',
                              fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.predictions.map(p => (
                          <tr key={p.id}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ padding: '10px 14px', color: '#334155', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{p.id}</td>
                            <td style={{ padding: '10px 14px', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: 300 }}>
                              <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.text}>{p.text}</span>
                            </td>
                            <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <Badge label={p.prediction || p.sentiment} />
                            </td>
                            <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', minWidth: 140 }}>
                              <ConfidenceBar value={p.confidence || p.score} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

