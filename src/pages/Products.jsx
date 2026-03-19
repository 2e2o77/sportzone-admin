import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { StatusBadge } from './Dashboard'

const EMOJIS = ['⚽','🏀','🎽','👟','🏋️','🎾','🚴','🏊','🥊','🏐','🧘','🎒','🏑','🎿','🤸','🏄']
const CATS = ['Football','Basketball','Clothing','Footwear','Fitness','Tennis','Cycling','Swimming','Boxing','Volleyball','Accessories']

const EMPTY = { emoji:'⚽', name_en:'', name_ar:'', cat_en:'Football', cat_ar:'', price:'', stock:true }

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useAdmin()
  const [modal, setModal]   = useState(null) // null | 'add' | 'edit'
  const [form, setForm]     = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [confirmDel, setConfirmDel] = useState(null)

  const filtered = products.filter(p =>
    p.name_en?.toLowerCase().includes(search.toLowerCase()) ||
    p.name_ar?.includes(search)
  )

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('form') }
  const openEdit = (p) => { setForm({ emoji:p.emoji, name_en:p.name_en, name_ar:p.name_ar, cat_en:p.cat_en, cat_ar:p.cat_ar, price:p.price, stock:p.stock }); setEditing(p.id); setModal('form') }

  const handleSave = async () => {
    if (!form.name_en || !form.price) return
    const data = { ...form, price: Number(form.price) }
    if (editing) await updateProduct(editing, data)
    else await addProduct(data)
    setModal(null)
  }

  const handleDelete = async () => {
    await deleteProduct(confirmDel)
    setConfirmDel(null)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">{products.length} total products</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:20 }}>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{
            width:'100%', background:'#1a1a1a', border:'1px solid #2e2e2e',
            borderRadius:8, padding:'10px 12px 10px 36px', color:'#f0f0f0',
            fontSize:14, outline:'none'
          }}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table>
          <thead><tr>
            <th style={{ padding:'14px 16px' }}>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:28, background:'#111', borderRadius:8, padding:'4px 8px' }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontWeight:700, color:'#fff', fontSize:14 }}>{p.name_en}</div>
                      <div style={{ fontSize:12, color:'#555' }}>{p.name_ar}</div>
                    </div>
                  </div>
                </td>
                <td><span style={{ background:'#111', color:'#888', padding:'3px 10px', borderRadius:6, fontSize:12 }}>{p.cat_en}</span></td>
                <td style={{ color:'#e8401c', fontWeight:800, fontSize:14 }}>{Number(p.price).toLocaleString()} EGP</td>
                <td>
                  <button onClick={() => toggleStock(p.id, p.stock)} style={{ background:'none', border:'none', cursor:'pointer' }}>
                    <StatusBadge status={p.stock ? 'approved' : 'rejected'} />
                  </button>
                </td>
                <td>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => openEdit(p)}>✏️ Edit</button>
                    <button className="btn btn-danger" style={{ padding:'6px 12px', fontSize:12 }} onClick={() => setConfirmDel(p.id)}>🗑 Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px', color:'#444' }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🔍</div>
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal === 'form' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            {/* Emoji picker */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#666', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>Emoji</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {EMOJIS.map(em => (
                  <button key={em} onClick={() => setForm(f => ({ ...f, emoji:em }))} style={{
                    width:36, height:36, fontSize:20, borderRadius:8, border:'none',
                    background: form.emoji === em ? '#e8401c' : '#111',
                    cursor:'pointer'
                  }}>{em}</button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group"><label>Name (EN)</label><input value={form.name_en} onChange={e => setForm(f => ({...f, name_en:e.target.value}))} placeholder="Pro Football" /></div>
              <div className="form-group"><label>Name (AR)</label><input value={form.name_ar} onChange={e => setForm(f => ({...f, name_ar:e.target.value}))} placeholder="كرة قدم" dir="rtl" /></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.cat_en} onChange={e => setForm(f => ({...f, cat_en:e.target.value}))}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Category (AR)</label><input value={form.cat_ar} onChange={e => setForm(f => ({...f, cat_ar:e.target.value}))} placeholder="كرة القدم" dir="rtl" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Price (EGP)</label><input type="number" value={form.price} onChange={e => setForm(f => ({...f, price:e.target.value}))} placeholder="450" /></div>
              <div className="form-group">
                <label>Stock Status</label>
                <select value={form.stock ? 'true' : 'false'} onChange={e => setForm(f => ({...f, stock: e.target.value === 'true'}))}>
                  <option value="true">In Stock ✅</option>
                  <option value="false">Out of Stock ❌</option>
                </select>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={handleSave}>
                {editing ? '💾 Save Changes' : '➕ Add Product'}
              </button>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDel && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:360 }}>
            <div style={{ textAlign:'center', padding:'8px 0 20px' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
              <h3 style={{ color:'#fff', marginBottom:8 }}>Delete Product?</h3>
              <p style={{ color:'#666', fontSize:14 }}>This action cannot be undone.</p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-danger" style={{ flex:1 }} onClick={handleDelete}>Yes, Delete</button>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setConfirmDel(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
