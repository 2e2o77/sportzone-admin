import { useAdmin } from '../context/AdminContext'

const fmt = n => `${Number(n).toLocaleString()} EGP`

const STATUS_MAP = {
  pending:   { cls:'badge-pending',   label:'Pending' },
  shipped:   { cls:'badge-shipped',   label:'Shipped' },
  delivered: { cls:'badge-delivered', label:'Delivered' },
  cancelled: { cls:'badge-cancelled', label:'Cancelled' },
  approved:  { cls:'badge-approved',  label:'Approved' },
  rejected:  { cls:'badge-rejected',  label:'Rejected' },
}

export function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}

export default function Dashboard({ setActive }) {
  const { stats, orders, products, seedData, loading } = useAdmin()

  const CARDS = [
    { label:'Total Revenue',  value:fmt(stats.totalRevenue), icon:'💰', color:'#22c55e' },
    { label:'Total Orders',   value:stats.totalOrders,       icon:'📦', color:'#3b82f6' },
    { label:'Pending Orders', value:stats.pendingOrders,     icon:'⏳', color:'#f59e0b' },
    { label:'Total Products', value:stats.totalProducts,     icon:'🏀', color:'#e8401c' },
    { label:'In Stock',       value:stats.inStock,           icon:'✅', color:'#22c55e' },
    { label:'Pending Posts',  value:stats.pendingPosts,      icon:'📝', color:'#a855f7' },
  ]

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff' }}>Dashboard</h1>
          <p style={{ color:'#555', fontSize:14, marginTop:2 }}>Welcome back, Admin 👋</p>
        </div>
        {products.length === 0 && (
          <button className="btn btn-primary" onClick={seedData} disabled={loading}>
            {loading ? '⏳ Loading...' : '🌱 Seed Sample Data'}
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {CARDS.map(c => (
          <div key={c.label} className="card" style={{ padding:'18px 20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:.5 }}>{c.label}</span>
              <span style={{ fontSize:18 }}>{c.icon}</span>
            </div>
            <div style={{ fontSize:26, fontWeight:900, color:c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:16 }}>
        {/* Recent Orders */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ color:'#fff', fontWeight:700, fontSize:15 }}>📦 Recent Orders</h3>
            <button onClick={() => setActive('orders')} style={{ color:'#e8401c', fontSize:13, background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>View all →</button>
          </div>
          {orders.length === 0 ? (
            <p style={{ color:'#444', fontSize:13 }}>No orders yet. Click "Seed Sample Data" to add sample orders.</p>
          ) : (
            <table>
              <thead><tr>
                <th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th>
              </tr></thead>
              <tbody>
                {orders.slice(0,6).map(o => (
                  <tr key={o.id}>
                    <td style={{ color:'#e8401c', fontWeight:700 }}>#{o.id}</td>
                    <td>{o.customer}</td>
                    <td style={{ color:'#fff', fontWeight:700 }}>{fmt(o.total)}</td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Out of Stock */}
        <div className="card">
          <h3 style={{ color:'#fff', fontWeight:700, fontSize:15, marginBottom:16 }}>⚠️ Out of Stock</h3>
          {products.filter(p => !p.stock).length === 0 ? (
            <p style={{ color:'#444', fontSize:13 }}>All products are in stock ✅</p>
          ) : (
            products.filter(p => !p.stock).map(p => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid #222' }}>
                <span style={{ fontSize:22 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#ccc' }}>{p.name_en}</div>
                  <div style={{ fontSize:11, color:'#e24b4a', marginTop:2 }}>Out of stock</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
