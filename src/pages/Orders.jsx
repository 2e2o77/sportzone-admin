import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { StatusBadge } from './Dashboard'

const fmt = n => `${Number(n).toLocaleString()} EGP`
const STATUSES = ['pending','shipped','delivered','cancelled']

export default function Orders() {
  const { orders, updateOrderStatus } = useAdmin()
  const [filter, setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)
  const [search, setSearch]   = useState('')

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter
    const matchSearch = !search ||
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const FILTERS = [
    { key:'all',       label:`All (${orders.length})` },
    { key:'pending',   label:`⏳ Pending (${orders.filter(o=>o.status==='pending').length})` },
    { key:'shipped',   label:`🚚 Shipped (${orders.filter(o=>o.status==='shipped').length})` },
    { key:'delivered', label:`✅ Delivered (${orders.filter(o=>o.status==='delivered').length})` },
    { key:'cancelled', label:`❌ Cancelled (${orders.filter(o=>o.status==='cancelled').length})` },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-sub">{orders.length} total orders</p>
        </div>
        <div style={{ fontSize:18, fontWeight:800, color:'#e8401c' }}>
          💰 {fmt(orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+(o.total||0),0))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:16 }}>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer, order ID or email..."
          style={{
            width:'100%', background:'#1a1a1a', border:'1px solid #2e2e2e',
            borderRadius:8, padding:'10px 12px 10px 36px', color:'#f0f0f0',
            fontSize:13, outline:'none', fontFamily:'inherit'
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#666', background:'none', border:'none', cursor:'pointer', fontSize:14 }}>✕</button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer',
            border: filter===f.key ? 'none' : '1px solid #2e2e2e',
            background: filter===f.key ? '#e8401c' : 'transparent',
            color: filter===f.key ? '#fff' : '#666',
            fontFamily:'inherit', transition:'all .2s'
          }}>{f.label}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table>
          <thead><tr>
            <th style={{ padding:'14px 16px' }}>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id}>
                <td style={{ padding:'12px 16px', color:'#e8401c', fontWeight:800 }}>#{order.id}</td>
                <td>
                  <div style={{ fontWeight:600, color:'#fff' }}>{order.customer}</div>
                  <div style={{ fontSize:11, color:'#555' }}>{order.email}</div>
                </td>
                <td style={{ color:'#666', fontSize:12 }}>{order.date}</td>
                <td style={{ fontWeight:800, color:'#fff' }}>{fmt(order.total)}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost" style={{ padding:'6px 10px', fontSize:12 }} onClick={() => setSelected(order)}>👁 View</button>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        background:'#111', border:'1px solid #2e2e2e', borderRadius:7,
                        color:'#888', fontSize:12, padding:'6px 8px', cursor:'pointer',
                        fontFamily:'inherit'
                      }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px', color:'#444' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>📦</div>
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth:480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📦 Order #{selected.id}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              {[
                { label:'Customer', value:selected.customer },
                { label:'Email',    value:selected.email },
                { label:'Phone',    value:selected.phone },
                { label:'Date',     value:selected.date },
              ].map(r => (
                <div key={r.label} style={{ background:'#111', borderRadius:8, padding:'10px 12px' }}>
                  <div style={{ fontSize:11, color:'#555', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>{r.label}</div>
                  <div style={{ fontSize:13, color:'#ccc', fontWeight:600 }}>{r.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#555', marginBottom:8, textTransform:'uppercase' }}>Items</div>
              {(selected.items||[]).map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #222', fontSize:13 }}>
                  <span style={{ color:'#ccc' }}>{item.name} × {item.qty}</span>
                  <span style={{ color:'#e8401c', fontWeight:700 }}>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, fontWeight:800, fontSize:15 }}>
                <span style={{ color:'#fff' }}>Total</span>
                <span style={{ color:'#e8401c' }}>{fmt(selected.total)}</span>
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#555', marginBottom:6, textTransform:'uppercase' }}>Update Status</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {STATUSES.map(s => (
                  <button key={s} className={`btn ${selected.status===s ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize:12, padding:'7px 14px' }}
                    onClick={() => { updateOrderStatus(selected.id, s); setSelected({...selected, status:s}) }}
                  >{s.charAt(0).toUpperCase()+s.slice(1)}</button>
                ))}
              </div>
            </div>

            <button className="btn btn-ghost" style={{ width:'100%' }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
