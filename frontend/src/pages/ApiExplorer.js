import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ENDPOINTS = [
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    label: 'Health Check',
    desc: 'Check if the API is running and all models are loaded',
    color: '#10b981',
    hasFile: false,
  },
  {
    id: 'models',
    method: 'GET',
    path: '/api/models',
    label: 'List Models',
    desc: 'Get all available models with their details and status',
    color: '#6366f1',
    hasFile: false,
  },
  {
    id: 'text-classification',
    method: 'POST',
    path: '/api/predict/text-classification',
    label: 'Text Classification',
    desc: 'Classify texts as positive or negative using DistilBERT',
    color: '#6366f1',
    hasFile: true,
    fileType: 'csv',
    accepts: '.csv',
  },
  {
    id: 'sentiment-analysis',
    method: 'POST',
    path: '/api/predict/sentiment-analysis',
    label: 'Sentiment Analysis',
    desc: '3-class sentiment analysis using RoBERTa',
    color: '#8b5cf6',
    hasFile: true,
    fileType: 'csv',
    accepts: '.csv',
  },
  {
    id: 'image-caption',
    method: 'POST',
    path: '/api/predict/image-caption',
    label: 'Image Captioning',
    desc: 'Generate captions for images using BLIP',
    color: '#10b981',
    hasFile: true,
    fileType: 'image',
    accepts: 'image/*',
  },
];

function MethodBadge({ method }) {
  const colors = { GET: '#10b981', POST: '#6366f1', DELETE: '#ef4444' };
  return (
    <span style={{
      background: `${colors[method]||'#94a3b8'}22`,
      color: colors[method] || '#94a3b8',
      padding: '3px 10px', borderRadius: 6,
      fontSize: 11, fontWeight: 800, letterSpacing: 1,
      fontFamily: 'monospace',
    }}>{method}</span>
  );
}

function EndpointRow({ ep, active, onSelect }) {
  return (
    <div onClick={() => onSelect(ep.id)} style={{
      padding: '16px 20px', borderRadius: 12,
      cursor: 'pointer', marginBottom: 8,
      background: active ? `${ep.color}15` : 'rgba(255,255,255,0.03)',
      border: active ? `1px solid ${ep.color}55` : '1px solid rgba(255,255,255,0.06)',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <MethodBadge method={ep.method} />
        <code style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>{ep.path}</code>
      </div>
      <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{ep.desc}</p>
    </div>
  );
}

export default function ApiExplorer() {
  const [activeId, setActiveId] = useState('health');
  const [file,     setFile]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [response, setResponse] = useState(null);
  const [error,    setError]    = useState(null);
  const [timing,   setTiming]   = useState(null);

  const active = ENDPOINTS.find(e => e.id === activeId);

  function handleSelect(id) {
    setActiveId(id);
    setFile(null);
    setResponse(null);
    setError(null);
    setTiming(null);
  }

  async function handleExecute() {
    setLoading(true);
    setResponse(null);
    setError(null);
    const t0 = Date.now();

    try {
      let res;
      if (active.method === 'GET') {
        res = await axios.get(`${API_URL}${active.path}`);
      } else {
        if (!file) { setError('Please upload a file first'); setLoading(false); return; }
        const form = new FormData();
        form.append('file', file);
        res = await axios.post(`${API_URL}${active.path}`, form,
          { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setResponse(res.data);
      setTiming(Date.now() - t0);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      setTiming(Date.now() - t0);
    } finally {
      setLoading(false);
    }
  }

  // Build curl command
  const curl = active.method === 'GET'
    ? `curl -X GET '${API_URL}${active.path}' \\\n  -H 'accept: application/json'`
    : `curl -X POST '${API_URL}${active.path}' \\\n  -H 'accept: application/json' \\\n  -H 'Content-Type: multipart/form-data' \\\n  -F 'file=@your_file.${active.fileType === 'image' ? 'jpg' : 'csv'}'`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0a0f1e,#0f172a)',
      color: '#e2e8f0', padding: '40px 32px',
      fontFamily: '"Segoe UI",system-ui,sans-serif',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1',
                      textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
            Interactive API Explorer
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f8fafc', letterSpacing: -1 }}>
            Test API Endpoints
          </h1>
          <p style={{ fontSize: 15, color: '#475569', marginTop: 8 }}>
            Select an endpoint, upload a file if needed, and execute live requests
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>

          {/* LEFT — Endpoint list */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: 20,
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#334155',
                        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
              {ENDPOINTS.length} Endpoints
            </p>
            {ENDPOINTS.map(ep => (
              <EndpointRow key={ep.id} ep={ep}
                active={activeId === ep.id}
                onSelect={handleSelect} />
            ))}

            {/* Link to full docs */}
            <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/docs`} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                marginTop: 12, padding: '10px 0',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, fontSize: 13,
                color: '#475569', textDecoration: 'none',
              }}>
              Open Full Swagger Docs ↗
            </a>
          </div>

          {/* RIGHT — Request + Response */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Request panel */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 28,
            }}>
              {/* Endpoint title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <MethodBadge method={active.method} />
                <code style={{
                  fontSize: 15, color: '#f1f5f9', fontFamily: 'monospace',
                  background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: 8,
                }}>{API_URL}{active.path}</code>
              </div>
              <p style={{ fontSize: 14, color: '#475569', marginBottom: 24 }}>{active.desc}</p>

              {/* File upload for POST */}
              {active.hasFile && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#334155',
                              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                    Request Body
                  </p>
                  <label style={{
                    display: 'block',
                    border: `1px dashed ${file ? active.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 12, padding: '20px 16px',
                    textAlign: 'center', cursor: 'pointer',
                    background: file ? `${active.color}08` : 'rgba(255,255,255,0.02)',
                  }}>
                    <input type="file" style={{ display: 'none' }}
                      accept={active.accepts}
                      onChange={e => setFile(e.target.files[0])} />
                    {file ? (
                      <span style={{ color: active.color, fontWeight: 600, fontSize: 13 }}>
                        ✓ {file.name}
                      </span>
                    ) : (
                      <span style={{ color: '#475569', fontSize: 13 }}>
                        Upload {active.fileType === 'image' ? 'an image' : 'a CSV file'}
                      </span>
                    )}
                  </label>
                </div>
              )}

              {/* Curl command */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#334155',
                            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  cURL Command
                </p>
                <pre style={{
                  background: '#0a0f1e', borderRadius: 10,
                  padding: '14px 16px', fontSize: 12,
                  color: '#94a3b8', overflowX: 'auto',
                  border: '1px solid rgba(255,255,255,0.06)',
                  margin: 0, fontFamily: 'monospace', lineHeight: 1.6,
                }}>{curl}</pre>
              </div>

              {/* Execute button */}
              <button onClick={handleExecute} disabled={loading} style={{
                padding: '12px 32px', borderRadius: 10,
                border: 'none', fontWeight: 700, fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'rgba(255,255,255,0.06)'
                  : `linear-gradient(135deg, ${active.color}, ${active.color}cc)`,
                color: loading ? '#334155' : '#fff',
                boxShadow: !loading ? `0 8px 20px ${active.color}44` : 'none',
              }}>
                {loading ? '⏳ Executing…' : '▶ Execute Request'}
              </button>
            </div>

            {/* Response panel */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${response ? 'rgba(16,185,129,0.3)' : error ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 20, padding: 28,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1', margin: 0 }}>
                  Response
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {timing && (
                    <span style={{ fontSize: 12, color: '#475569' }}>⚡ {timing}ms</span>
                  )}
                  {response && (
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: '#10b981', background: 'rgba(16,185,129,0.1)',
                      padding: '3px 10px', borderRadius: 99,
                    }}>200 OK</span>
                  )}
                  {error && (
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: '#ef4444', background: 'rgba(239,68,68,0.1)',
                      padding: '3px 10px', borderRadius: 99,
                    }}>Error</span>
                  )}
                </div>
              </div>

              {!response && !error && !loading && (
                <div style={{ textAlign: 'center', padding: 40, color: '#334155' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
                  Click Execute Request to see response here
                </div>
              )}

              {loading && (
                <div style={{ textAlign: 'center', padding: 40, color: '#475569' }}>
                  <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⚙️</div>
                  Sending request…
                </div>
              )}

              {error && (
                <pre style={{
                  background: 'rgba(239,68,68,0.06)', borderRadius: 10,
                  padding: '14px 16px', fontSize: 13,
                  color: '#ef4444', overflowX: 'auto',
                  border: '1px solid rgba(239,68,68,0.2)',
                  margin: 0, fontFamily: 'monospace',
                }}>Error: {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}</pre>
              )}

              {response && (
                <pre style={{
                  background: '#0a0f1e', borderRadius: 10,
                  padding: '14px 16px', fontSize: 12,
                  color: '#94a3b8', overflowX: 'auto',
                  border: '1px solid rgba(16,185,129,0.15)',
                  margin: 0, fontFamily: 'monospace', lineHeight: 1.6,
                  maxHeight: 400, overflowY: 'auto',
                }}>{JSON.stringify(response, null, 2)}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

