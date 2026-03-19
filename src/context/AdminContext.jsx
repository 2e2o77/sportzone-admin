import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'firebase/auth'
import { db, auth } from '../firebase'

const AdminContext = createContext(null)

const INIT_PRODUCTS = [
  { emoji:'⚽', name_en:'Pro Football',       name_ar:'كرة قدم احترافية',  cat_en:'Football',   cat_ar:'كرة القدم',  price:450, stock:true  },
  { emoji:'🏀', name_en:'Basketball Elite',   name_ar:'كرة سلة إليت',      cat_en:'Basketball', cat_ar:'كرة السلة', price:380, stock:true  },
  { emoji:'🎽', name_en:'Running Jersey',     name_ar:'قميص جري رياضي',   cat_en:'Clothing',   cat_ar:'ملابس',      price:220, stock:true  },
  { emoji:'👟', name_en:'Sport Shoes X7',     name_ar:'حذاء رياضي X7',    cat_en:'Footwear',   cat_ar:'أحذية',      price:850, stock:true  },
  { emoji:'🏋️', name_en:'Dumbbell Set 25kg', name_ar:'طقم دمبل 25 كجم',  cat_en:'Fitness',    cat_ar:'لياقة',      price:600, stock:true  },
  { emoji:'🎾', name_en:'Tennis Racket Pro',  name_ar:'مضرب تنس احترافي', cat_en:'Tennis',     cat_ar:'تنس',        price:720, stock:false },
  { emoji:'🚴', name_en:'Cycling Helmet',     name_ar:'خوذة دراجة هوائية',cat_en:'Cycling',    cat_ar:'دراجات',     price:340, stock:true  },
  { emoji:'🏊', name_en:'Swim Goggles UV',    name_ar:'نظارة سباحة UV',   cat_en:'Swimming',   cat_ar:'سباحة',      price:150, stock:true  },
  { emoji:'🥊', name_en:'Boxing Gloves Pro',  name_ar:'قفازات ملاكمة برو',cat_en:'Boxing',     cat_ar:'ملاكمة',     price:490, stock:true  },
  { emoji:'🏐', name_en:'Volleyball Official',name_ar:'كرة طائرة رسمية',  cat_en:'Volleyball', cat_ar:'الكرة الطائرة',price:290,stock:true },
  { emoji:'🧘', name_en:'Yoga Mat Premium',   name_ar:'مات يوجا بريميوم', cat_en:'Fitness',    cat_ar:'لياقة',      price:180, stock:true  },
  { emoji:'🎒', name_en:'Sport Bag XL',       name_ar:'حقيبة رياضية XL',  cat_en:'Accessories',cat_ar:'إكسسوار',    price:320, stock:true  },
]

const INIT_POSTS = [
  { emoji:'🏃', cat_en:'Training', cat_ar:'تدريب',  date:'Mar 10, 2025', status:'approved', title_en:'5 Tips to Improve Your Sprint Speed',     title_ar:'5 نصائح لتحسين سرعة العدو',          excerpt_en:'Discover training secrets used by pro athletes.', excerpt_ar:'اكتشف أسرار التدريب التي يستخدمها المحترفون.' },
  { emoji:'🥗', cat_en:'Nutrition',cat_ar:'تغذية',  date:'Mar 5, 2025',  status:'approved', title_en:'Best Pre-Workout Meals for Athletes',     title_ar:'أفضل وجبات ما قبل التمرين',           excerpt_en:'What you eat before training matters.',          excerpt_ar:'ما تأكله قبل التدريب يؤثر على أدائك.' },
  { emoji:'💪', cat_en:'Fitness',  cat_ar:'لياقة',  date:'Feb 28, 2025', status:'pending',  title_en:'Home Workout Guide: No Equipment Needed', title_ar:'دليل التمرين المنزلي بدون معدات',      excerpt_en:'Build strength from the comfort of your home.',  excerpt_ar:'بني قوة من منزلك بدون معدات.' },
  { emoji:'⚽', cat_en:'Football', cat_ar:'كرة القدم',date:'Feb 20, 2025',status:'pending',  title_en:'How to Choose the Right Football Boots',  title_ar:'كيف تختار حذاء كرة القدم المناسب',    excerpt_en:'A complete guide to selecting football boots.',   excerpt_ar:'دليل شامل لاختيار حذاء كرة القدم.' },
  { emoji:'🧘', cat_en:'Recovery', cat_ar:'تعافي',  date:'Feb 15, 2025', status:'approved', title_en:'Recovery Days: Your Secret Weapon',       title_ar:'أيام الراحة: سلاحك السري',             excerpt_en:'Learn why rest days are essential.',             excerpt_ar:'اعرف لماذا أيام الراحة ضرورية.' },
  { emoji:'🏋️', cat_en:'Strength', cat_ar:'قوة',    date:'Feb 10, 2025', status:'rejected', title_en:"Beginner's Guide to Weight Training",     title_ar:'دليل المبتدئ في تدريب الأثقال',        excerpt_en:'Start your strength journey safely.',            excerpt_ar:'ابدأ رحلة القوة بأمان.' },
]

const INIT_ORDERS = [
  { id:'SZ001', customer:'Ahmed Hassan', email:'ahmed@email.com', phone:'+20 100 111 2222', total:1280, status:'pending',   date:'2025-03-10', items:[{name:'Pro Football',   qty:2,price:450},{name:'Basketball Elite',qty:1,price:380}] },
  { id:'SZ002', customer:'Sara Nour',    email:'sara@email.com',  phone:'+20 100 333 4444', total:850,  status:'shipped',   date:'2025-03-09', items:[{name:'Sport Shoes X7', qty:1,price:850}] },
  { id:'SZ003', customer:'Omar Farid',   email:'omar@email.com',  phone:'+20 100 555 6666', total:600,  status:'delivered', date:'2025-03-08', items:[{name:'Dumbbell Set',   qty:1,price:600}] },
  { id:'SZ004', customer:'Nada Ali',     email:'nada@email.com',  phone:'+20 100 777 8888', total:370,  status:'pending',   date:'2025-03-11', items:[{name:'Running Jersey', qty:1,price:220},{name:'Swim Goggles',qty:1,price:150}] },
  { id:'SZ005', customer:'Karim Samir',  email:'karim@email.com', phone:'+20 100 999 0000', total:720,  status:'cancelled', date:'2025-03-07', items:[{name:'Tennis Racket Pro',qty:1,price:720}] },
]

export function AdminProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [posts, setPosts]       = useState([])
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [toast, setToast]       = useState({ msg:'', type:'success', show:false })

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // Realtime listeners when logged in
  useEffect(() => {
    if (!user) { setLoading(false); return }

    const unsubProducts = onSnapshot(collection(db, 'products'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setProducts(data.length ? data : [])
      setLoading(false)
    })
    const unsubPosts = onSnapshot(collection(db, 'posts'), snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubOrders = onSnapshot(collection(db, 'orders'), snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => { unsubProducts(); unsubPosts(); unsubOrders() }
  }, [user])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500)
  }

  // Auth
  const login = async (email, pass) => {
    await signInWithEmailAndPassword(auth, email, pass)
  }
  const logout = () => signOut(auth)

  // Seed data
  const seedData = async () => {
    setLoading(true)
    try {
      for (const p of INIT_PRODUCTS) await addDoc(collection(db, 'products'), p)
      for (const p of INIT_POSTS)    await addDoc(collection(db, 'posts'), p)
      for (const o of INIT_ORDERS)   await setDoc(doc(db, 'orders', o.id), o)
      showToast('Database seeded successfully!')
    } catch(e) { showToast('Seed failed: ' + e.message, 'danger') }
    setLoading(false)
  }

  // Products
  const addProduct = async (data) => {
    await addDoc(collection(db, 'products'), { ...data, stock: true })
    showToast('Product added!')
  }
  const updateProduct = async (id, data) => {
    await updateDoc(doc(db, 'products', id), data)
    showToast('Product updated!')
  }
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id))
    showToast('Product deleted!', 'danger')
  }
  const toggleStock = async (id, current) => {
    await updateDoc(doc(db, 'products', id), { stock: !current })
  }

  // Posts
  const addPost = async (data) => {
    await addDoc(collection(db, 'posts'), { ...data, status: 'approved', date: new Date().toLocaleDateString() })
    showToast('Post added!')
  }
  const updatePostStatus = async (id, status) => {
    await updateDoc(doc(db, 'posts', id), { status })
    showToast(status === 'approved' ? 'Post approved! ✅' : 'Post rejected!', status === 'approved' ? 'success' : 'danger')
  }
  const deletePost = async (id) => {
    await deleteDoc(doc(db, 'posts', id))
    showToast('Post deleted!', 'danger')
  }

  // Orders
  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status })
    showToast('Order updated!')
  }

  const stats = {
    totalProducts:  products.length,
    inStock:        products.filter(p => p.stock).length,
    totalOrders:    orders.length,
    pendingOrders:  orders.filter(o => o.status === 'pending').length,
    totalRevenue:   orders.filter(o => o.status !== 'cancelled').reduce((s,o) => s + (o.total||0), 0),
    approvedPosts:  posts.filter(p => p.status === 'approved').length,
    pendingPosts:   posts.filter(p => p.status === 'pending').length,
  }

  return (
    <AdminContext.Provider value={{
      user, authLoading, loading, toast, showToast,
      login, logout, seedData,
      products, addProduct, updateProduct, deleteProduct, toggleStock,
      posts, addPost, updatePostStatus, deletePost,
      orders, updateOrderStatus,
      stats,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
