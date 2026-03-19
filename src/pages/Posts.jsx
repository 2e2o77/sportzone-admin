import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

const CATS = ['Training','Nutrition','Fitness','Football','Recovery','Strength','Cycling','Swimming']
const EMOJIS = ['🏃','🥗','💪','⚽','🧘','🏋️','🚴','🏊','🎯','📖']
const EMPTY  = { emoji:'🏃', cat_en:'Training', cat_ar:'تدريب', title_en:'', title_ar:'', excerpt_en:'', excerpt_ar:'' }

export default function Posts() {
  const { posts, addPost, updatePostStatus, deletePost } = useAdmin()
  const [filter, setFilter]   = useState('all')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [confirmDel, setConfirmDel] = useState(null)

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)

  const handleSave = async () => {
    if (!form.title_en) return
    await addPost(form)
    setModal(false)
    setForm(EMPTY)
  }

  const FILTERS = [
    { key:'all',      label:`All (${posts.length})` },
    { key:'pending',  label:`⏳ Pending (${posts.filter(p=>p.status==='pending').length})` },
    { key:'approved', label:`✅ Approved (${posts.filter(p=>p.status==='approved').length})` },
    { key:'rejected', label:`❌ Rejected (${posts.filter(p=>p.status==='rejected').length})` },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Blog Posts</h1>
          <p className="page-sub">Manage and moderate blog content</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setModal(true) }}>+ Add Post</button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding:'7px 16px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer',
            border: filter===f.key ? 'none' : '1px solid #2e2e2e',
            background: filter===f.key ? '#e8401c' : 'transparent',
            color: filter===f.key ? '#fff' : '#666',
            fontFamily:'inherit', transition:'all .2s'
          }}>{f.label}</button>
        ))}
      </div>

      {/* Posts Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:14 }}>
        {filtered.map(post => (
          <div key={post.id} className="card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <span style={{ fontSize:32, background:'#111', borderRadius:8, padding:'6px 10px' }}>{post.emoji}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:'#e8401c', textTransform:'uppercase' }}>{post.cat_en}</span>
                  <span style={{ fontSize:11, color:'#444' }}>{post.date}</span>
                </div>
                <div style={{ fontWeight:700, color:'#fff', fontSize:14, lineHeight:1.4, marginBottom:4 }}>{post.title_en}</div>
                <div style={{ fontWeight:600, color:'#555', fontSize:13, direction:'rtl', textAlign:'right' }}>{post.title_ar}</div>
              </div>
            </div>

            <p style={{ fontSize:12, color:'#555', lineHeight:1.6 }}>{post.excerpt_en}</p>

            {/* Status */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span className={`badge badge-${post.status}`}>
                {post.status === 'approved' ? '✅ Approved' : post.status === 'rejected' ? '❌ Rejected' : '⏳ Pending'}
              </span>
              <span style={{ fontSize:11, color:'#444' }}>#{post.id?.slice(0,8)}</span>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:8, borderTop:'1px solid #222', paddingTop:12 }}>
              {post.status !== 'approved' && (
                <button className="btn btn-success" style={{ flex:1, padding:'7px 0', fontSize:12 }} onClick={() => updatePostStatus(post.id, 'approved')}>
                  ✅ Approve
                </button>
              )}
              {post.status !== 'rejected' && (
                <button className="btn btn-warning" style={{ flex:1, padding:'7px 0', fontSize:12 }} onClick={() => updatePostStatus(post.id, 'rejected')}>
                  ❌ Reject
                </button>
              )}
              <button className="btn btn-danger" style={{ padding:'7px 12px', fontSize:12 }} onClick={() => setConfirmDel(post.id)}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#444' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📝</div>
          <p>No posts found</p>
        </div>
      )}

      {/* Add Post Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth:560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">➕ Add New Post</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#666', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>Emoji</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {EMOJIS.map(em => (
                  <button key={em} onClick={() => setForm(f => ({...f, emoji:em}))} style={{
                    width:36, height:36, fontSize:20, borderRadius:8, border:'none',
                    background: form.emoji===em ? '#e8401c' : '#111', cursor:'pointer'
                  }}>{em}</button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.cat_en} onChange={e => setForm(f => ({...f, cat_en:e.target.value}))}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Category (AR)</label><input value={form.cat_ar} onChange={e => setForm(f => ({...f, cat_ar:e.target.value}))} dir="rtl" placeholder="تدريب" /></div>
            </div>
            <div className="form-group"><label>Title (EN)</label><input value={form.title_en} onChange={e => setForm(f => ({...f, title_en:e.target.value}))} placeholder="Post title in English" /></div>
            <div className="form-group"><label>Title (AR)</label><input value={form.title_ar} onChange={e => setForm(f => ({...f, title_ar:e.target.value}))} dir="rtl" placeholder="عنوان المقال بالعربي" /></div>
            <div className="form-group"><label>Excerpt (EN)</label><textarea value={form.excerpt_en} onChange={e => setForm(f => ({...f, excerpt_en:e.target.value}))} placeholder="Short description..." style={{ height:70, resize:'none' }} /></div>
            <div className="form-group"><label>Excerpt (AR)</label><textarea value={form.excerpt_ar} onChange={e => setForm(f => ({...f, excerpt_ar:e.target.value}))} dir="rtl" placeholder="وصف مختصر..." style={{ height:70, resize:'none' }} /></div>

            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={handleSave}>➕ Publish Post</button>
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
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
              <h3 style={{ color:'#fff', marginBottom:8 }}>Delete Post?</h3>
              <p style={{ color:'#666', fontSize:14 }}>This action cannot be undone.</p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-danger" style={{ flex:1 }} onClick={async () => { await deletePost(confirmDel); setConfirmDel(null) }}>Yes, Delete</button>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setConfirmDel(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
