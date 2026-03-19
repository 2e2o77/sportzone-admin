import { useState } from 'react'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Posts from './pages/Posts'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import './index.css'

function AdminApp() {
  const { user, authLoading, toast } = useAdmin()
  const [active, setActive] = useState('dashboard')

  if (authLoading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
        <p style={{ color:'#555', fontSize:14 }}>Loading...</p>
      </div>
    </div>
  )

  if (!user) return <Login />

  const PAGES = { dashboard: Dashboard, products: Products, posts: Posts, orders: Orders, profile: Profile }
  const Page = PAGES[active] || Dashboard

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ marginLeft:240, flex:1, padding:28, minHeight:'100vh', background:'#0f0f0f' }}>
        <Page setActive={setActive} />
      </main>
      <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        {toast.type === 'success' ? '✅' : toast.type === 'danger' ? '❌' : 'ℹ️'} {toast.msg}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <AdminApp />
    </AdminProvider>
  )
}
