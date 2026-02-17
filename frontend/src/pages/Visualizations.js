import React, { useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const COLORS  = { positive: '#10b981', negative: '#ef4444', neutral: '#f59e0b' };
const C_LIST  = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'];

export default function Visualizations() {
  const [model,   setModel]   = useState('text-classification');
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);
  const [chart,   setChart]   = useState('pie'); // pie | bar | line | radar

  async function handleRun() {
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    const form = new FormData();
    form.append('file', file);
    const endpoint = model === 'sentiment-analysis' ? 'sentiment-analysis' : 'text-classification';
    try {
      const r = await axios.post(`${API_URL}/api/predict/${endpoint}`, form,
        { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(r.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  // ── Derive chart datasets ──
  const pieData  = result?.summary
    ? Object.entries(result.summary).filter(([,v])=>v>0).map(([name,value])=>({name,value}))
    : [];

  const confData = result?.predictions?.map(p => ({
    id: p.id,
    confidence: +((p.confidence || p.score || 0) * 100).toFixed(1),
    label: p.prediction || p.sentiment,
  })) || [];

  const radarData = result?.summary
    ? Object.entries(result.summary).map(([label, count]) => ({
        label,
        count,
        pct: +((count / (result.total_predictions||1)) * 100).toFixed(1),
      }))
    : [];

  const card = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 28,
  };

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
          <p style={{ fontSize:12, fontWeight:700, color:'#6366f1',
                      textTransform:'uppercase', letterSpacing:2, marginBottom:10 }}>
            Data Visualization
          </p>
          <h1 style={{ fontSize:36, fontWeight:800, color:'#f8fafc', letterSpacing:-1 }}>
            Visualize Your Predictions
          </h1>
          <p style={{ fontSize:15, color:'#475569', marginTop:8 }}>
            Upload a CSV, run a model, and explore results with interactive charts
          </p>
        </div>

        {/* Controls bar */}
        <div style={{ ...card, marginBottom:28, display:'flex', gap:20, alignItems:'flex-end', flexWrap:'wrap' }}>

          {/* Model selector */}
          <div style={{ flex:1, minWidth:200 }}>
            <p style={{ fontSize:12, color:'#475569', marginBottom:8, fontWeight:600 }}>Select Model</p>
            <div style={{ display:'flex', gap:8 }}>
              {[
                { id:'text-classification', label:'DistilBERT', color:'#6366f1' },
                { id:'sentiment-analysis',  label:'RoBERTa',    color:'#8b5cf6' },
              ].map(m => (
                <button key={m.id} onClick={()=>setModel(m.id)} style={{
                  padding:'8px 18px', borderRadius:10, border:'none',
                  fontWeight:600, fontSize:13, cursor:'pointer',
                  background: model===m.id ? m.color : 'rgba(255,255,255,0.05)',
                  color:      model===m.id ? '#fff'   : '#64748b',
                  transition:'all 0.2s',
                }}>{m.label}</button>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div style={{ flex:1, minWidth:200 }}>
            <p style={{ fontSize:12, color:'#475569', marginBottom:8, fontWeight:600 }}>Upload CSV</p>
            <label style={{
              display:'block', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:10, padding:'8px 14px', cursor:'pointer',
              fontSize:13, color: file ? '#10b981' : '#475569',
            }}>
              <input type="file" accept=".csv" style={{ display:'none' }}
                onChange={e=>{ setFile(e.target.files[0]); setResult(null); setError(null); }} />
              {file ? `✓ ${file.name}` : '📄 Choose CSV file'}
            </label>
          </div>

          {/* Run button */}
          <button onClick={handleRun} disabled={!file||loading} style={{
            padding:'10px 28px', borderRadius:10, border:'none',
            fontWeight:700, fontSize:14, cursor: !file||loading ? 'not-allowed':'pointer',
            background: !file||loading
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: !file||loading ? '#334155' : '#fff',
            whiteSpace:'nowrap',
          }}>
            {loading ? '⏳ Running…' : '🚀 Generate Charts'}
          </button>
        </div>

        {error && (
          <div style={{
            background:'rgba(239,68,68,0.1)', border:'1px solid #ef444444',
            borderRadius:12, padding:'12px 16px', color:'#ef4444',
            fontSize:13, marginBottom:20,
          }}>⚠ {error}</div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div style={{ ...card, textAlign:'center', padding:80 }}>
            <div style={{ fontSize:56, marginBottom:16 }}>📊</div>
            <h3 style={{ fontSize:20, fontWeight:700, color:'#334155', marginBottom:8 }}>
              No data yet
            </h3>
            <p style={{ fontSize:14, color:'#1e293b' }}>
              Upload a CSV and click Generate Charts to visualize your predictions
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ ...card, textAlign:'center', padding:80 }}>
            <div style={{ fontSize:48, animation:'spin 1s linear infinite', marginBottom:16 }}>⚙️</div>
            <p style={{ color:'#475569' }}>Running model and generating charts…</p>
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <>
            {/* Summary strip */}
            <div style={{ display:'flex', gap:16, marginBottom:24, flexWrap:'wrap' }}>
              <div style={{ ...card, flex:1, minWidth:140, textAlign:'center', padding:'20px 16px' }}>
                <div style={{ fontSize:32, fontWeight:800, color:'#6366f1' }}>{result.total_predictions}</div>
                <div style={{ fontSize:12, color:'#475569', marginTop:4 }}>Total Predictions</div>
              </div>
              {Object.entries(result.summary).map(([k,v]) => (
                <div key={k} style={{ ...card, flex:1, minWidth:140, textAlign:'center', padding:'20px 16px',
                                       border:`1px solid ${COLORS[k]||'#94a3b8'}44` }}>
                  <div style={{ fontSize:32, fontWeight:800, color:COLORS[k]||'#94a3b8' }}>{v}</div>
                  <div style={{ fontSize:12, color:'#475569', marginTop:4, textTransform:'capitalize' }}>{k}</div>
                </div>
              ))}
              <div style={{ ...card, flex:1, minWidth:140, textAlign:'center', padding:'20px 16px' }}>
                <div style={{ fontSize:32, fontWeight:800, color:'#10b981' }}>
                  {confData.length > 0
                    ? (confData.reduce((a,p)=>a+p.confidence,0)/confData.length).toFixed(0)+'%'
                    : 'N/A'}
                </div>
                <div style={{ fontSize:12, color:'#475569', marginTop:4 }}>Avg Confidence</div>
              </div>
            </div>

            {/* Chart type selector */}
            <div style={{ display:'flex', gap:8, marginBottom:20 }}>
              {[
                { id:'pie',   label:'🥧 Pie Chart' },
                { id:'bar',   label:'📊 Bar Chart' },
                { id:'line',  label:'📈 Line Chart' },
                { id:'radar', label:'🕸 Radar' },
              ].map(c => (
                <button key={c.id} onClick={()=>setChart(c.id)} style={{
                  padding:'8px 18px', borderRadius:10, border:'none',
                  fontWeight:600, fontSize:13, cursor:'pointer',
                  background: chart===c.id ? '#6366f1' : 'rgba(255,255,255,0.05)',
                  color:      chart===c.id ? '#fff'    : '#64748b',
                  transition:'all 0.2s',
                }}>{c.label}</button>
              ))}
            </div>

            {/* Charts grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>

              {/* Main chart */}
              <div style={{ ...card }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#cbd5e1', marginBottom:20 }}>
                  {chart==='pie' && 'Label Distribution'}
                  {chart==='bar' && 'Count by Label'}
                  {chart==='line' && 'Confidence per Prediction'}
                  {chart==='radar' && 'Radar Overview'}
                </p>

                {chart === 'pie' && (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100}
                        dataKey="value"
                        label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                        {pieData.map(e=><Cell key={e.name} fill={COLORS[e.name]||'#6366f1'} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background:'#1e293b',border:'none',borderRadius:8,color:'#e2e8f0' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {chart === 'bar' && (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={pieData} margin={{top:5,right:10,left:-20,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{fill:'#94a3b8',fontSize:12}} />
                      <YAxis tick={{fill:'#94a3b8',fontSize:12}} />
                      <Tooltip contentStyle={{background:'#1e293b',border:'none',borderRadius:8,color:'#e2e8f0'}} />
                      <Bar dataKey="value" radius={[8,8,0,0]}>
                        {pieData.map(e=><Cell key={e.name} fill={COLORS[e.name]||'#6366f1'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chart === 'line' && (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={confData} margin={{top:5,right:10,left:-20,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="id" tick={{fill:'#94a3b8',fontSize:11}} label={{value:'Prediction #',position:'insideBottom',offset:-2,fill:'#475569',fontSize:11}} />
                      <YAxis tick={{fill:'#94a3b8',fontSize:12}} domain={[0,100]} unit="%" />
                      <Tooltip contentStyle={{background:'#1e293b',border:'none',borderRadius:8,color:'#e2e8f0'}}
                        formatter={v=>[`${v}%`,'Confidence']} />
                      <Line type="monotone" dataKey="confidence" stroke="#6366f1"
                        strokeWidth={2} dot={{fill:'#6366f1',r:4}} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {chart === 'radar' && (
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="label" tick={{fill:'#94a3b8',fontSize:12}} />
                      <Radar dataKey="pct" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                      <Tooltip contentStyle={{background:'#1e293b',border:'none',borderRadius:8,color:'#e2e8f0'}}
                        formatter={v=>[`${v}%`,'Percentage']} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Confidence distribution */}
              <div style={{ ...card }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#cbd5e1', marginBottom:20 }}>
                  Confidence Distribution
                </p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={[
                      { range:'90-100%', count: confData.filter(p=>p.confidence>=90).length },
                      { range:'70-90%',  count: confData.filter(p=>p.confidence>=70&&p.confidence<90).length },
                      { range:'50-70%',  count: confData.filter(p=>p.confidence>=50&&p.confidence<70).length },
                      { range:'<50%',    count: confData.filter(p=>p.confidence<50).length },
                    ]}
                    margin={{top:5,right:10,left:-20,bottom:5}}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="range" tick={{fill:'#94a3b8',fontSize:11}} />
                    <YAxis tick={{fill:'#94a3b8',fontSize:12}} />
                    <Tooltip contentStyle={{background:'#1e293b',border:'none',borderRadius:8,color:'#e2e8f0'}} />
                    <Bar dataKey="count" radius={[8,8,0,0]}>
                      {['#10b981','#6366f1','#f59e0b','#ef4444'].map((c,i)=>(
                        <Cell key={i} fill={c} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Full predictions table */}
            <div style={{ ...card }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#cbd5e1', marginBottom:20 }}>
                All Predictions
              </p>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr>
                      {['#','Text','Label','Confidence'].map(h=>(
                        <th key={h} style={{
                          textAlign:'left', padding:'10px 14px',
                          color:'#334155', borderBottom:'1px solid rgba(255,255,255,0.06)',
                          fontSize:11, textTransform:'uppercase', letterSpacing:1,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.predictions.map(p=>(
                      <tr key={p.id}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <td style={{padding:'10px 14px',color:'#334155',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>{p.id}</td>
                        <td style={{padding:'10px 14px',color:'#94a3b8',borderBottom:'1px solid rgba(255,255,255,0.04)',maxWidth:400}}>
                          <span style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={p.text}>{p.text}</span>
                        </td>
                        <td style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                          <span style={{
                            background:`${COLORS[p.prediction||p.sentiment]||'#94a3b8'}22`,
                            color:COLORS[p.prediction||p.sentiment]||'#94a3b8',
                            padding:'2px 10px',borderRadius:99,fontSize:12,fontWeight:600,textTransform:'capitalize',
                          }}>{p.prediction||p.sentiment}</span>
                        </td>
                        <td style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.04)',minWidth:160}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <div style={{flex:1,background:'#1e293b',borderRadius:99,height:6,overflow:'hidden'}}>
                              <div style={{
                                width:`${((p.confidence||p.score||0)*100).toFixed(0)}%`,
                                background: (p.confidence||p.score||0)>=0.8?'#10b981':(p.confidence||p.score||0)>=0.6?'#f59e0b':'#ef4444',
                                height:'100%',borderRadius:99,
                              }} />
                            </div>
                            <span style={{fontSize:12,color:'#475569',minWidth:34}}>
                              {((p.confidence||p.score||0)*100).toFixed(0)}%
                            </span>
                          </div>
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
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

