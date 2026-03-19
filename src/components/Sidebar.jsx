import { useAdmin } from '../context/AdminContext'

const NAV = [
  { key:'dashboard', icon:'📊', label:'Dashboard' },
  { key:'products',  icon:'🏀', label:'Products' },
  { key:'posts',     icon:'📝', label:'Blog Posts' },
  { key:'orders',    icon:'📦', label:'Orders' },
  { key:'profile',   icon:'👤', label:'Profile' },
]

export default function Sidebar({ active, setActive }) {
  const { logout, stats, user } = useAdmin()

  return (
    <aside style={{
      width:240, background:'#111', height:'100vh', position:'fixed',
      left:0, top:0, display:'flex', flexDirection:'column',
      borderRight:'1px solid #1e1e1e', zIndex:10,
    }}>
      <div style={{ padding:'22px 18px', borderBottom:'1px solid #1e1e1e' }}>
        <div style={{ fontFamily:'Oswald,sans-serif', fontSize:22, fontWeight:700, color:'#fff' }}>
          Sport<span style={{ color:'#e8401c' }}>Zone</span>
        </div>
        <div style={{ fontSize:10, color:'#444', marginTop:3, fontWeight:700, letterSpacing:1.5 }}>
          ADMIN PANEL
        </div>
      </div>

      <nav style={{ flex:1, padding:'14px 10px', overflowY:'auto' }}>
        {NAV.map(item => {
          const isActive = active === item.key
          const badge = item.key === 'posts' ? stats.pendingPosts
                      : item.key === 'orders' ? stats.pendingOrders : 0
          return (
            <button key={item.key} onClick={() => setActive(item.key)} style={{
              width:'100%', display:'flex', alignItems:'center', gap:10,
              padding:'10px 14px', borderRadius:8, marginBottom:3,
              background: isActive ? '#e8401c' : 'transparent',
              color: isActive ? '#fff' : '#666',
              border:'none', cursor:'pointer', fontSize:14, fontWeight:600,
              fontFamily:'inherit', transition:'all 0.2s', textAlign:'left',
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background='#1a1a1a'; e.currentTarget.style.color='#ccc' }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#666' }}}
            >
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {badge > 0 && (
                <span style={{
                  background: item.key === 'posts' ? '#f59e0b' : '#e8401c',
                  color: item.key === 'posts' ? '#000' : '#fff',
                  borderRadius:10, padding:'1px 7px', fontSize:11, fontWeight:800
                }}>{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div style={{ padding:'14px 10px', borderTop:'1px solid #1e1e1e' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', marginBottom:8 }}>
          <div style={{
            width:34, height:34, borderRadius:'50%', background:'#e8401c',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:13, fontWeight:800, color:'#fff', flexShrink:0
          }}>A</div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Admin</div>
            <div style={{ fontSize:11, color:'#444', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{
          width:'100%', padding:'9px 14px', borderRadius:8,
          background:'transparent', border:'1px solid #2e2e2e',
          color:'#666', fontSize:13, fontWeight:600, cursor:'pointer',
          fontFamily:'inherit', transition:'all 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#e24b4a'; e.currentTarget.style.color='#e24b4a' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='#2e2e2e'; e.currentTarget.style.color='#666' }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}
