import React, { useState, useEffect } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_ab2jq8d';
const EMAILJS_TEMPLATE_ID = 'template_djk9447';
const EMAILJS_PUBLIC_KEY = 'UFSigQkUeu5jL599Y';

const API_URL = 'https://budgetshopnz-backend-production.up.railway.app';

const ALL_ITEMS = [
  "Anchor Full Cream Milk 2L","Anchor Trim Milk 2L","Anchor Blue Milk 1L",
  "Pam's Full Cream Milk 2L","Lewis Road Creamery Milk 1L",
  "Mainland Tasty Cheese 500g","Mainland Edam Cheese 500g","Pam's Cheddar Cheese 500g",
  "Anchor Butter 500g","Pam's Butter 500g",
  "Meadow Fresh Greek Yoghurt 500g","Chobani Greek Yoghurt 500g",
  "Anchor Cream Cheese 250g","Pam's Sour Cream 200g",
  "Eggs Free Range 12pk","Eggs Free Range 6pk","Pam's Eggs 12pk",
  "Vogel's Mixed Grain Bread 700g","Tip Top Sandwich White Bread",
  "Tip Top Wholegrain Bread","Pam's White Bread 700g",
  "Burgen Soy Lin Bread 700g","Wonder White Bread 700g",
  "Tegel Chicken Breast 1kg","Tegel Chicken Thighs 1kg","Tegel Chicken Wings 1kg",
  "Beef Mince 500g","Beef Mince 1kg","Lamb Mince 500g",
  "Pork Sausages 500g","Beef Sausages 500g","Bacon Rashers 250g",
  "Salmon Fillet 400g","Tuna Canned 185g",
  "Broccoli","Broccoli 1 head","Cauliflower","Carrots 1kg",
  "Potatoes 1.5kg","Potatoes 2kg","Kumara 1kg","Onion 1kg","Garlic Bulb",
  "Tomatoes 500g","Cherry Tomatoes 250g","Lettuce Iceberg","Spinach 100g",
  "Capsicum Red","Capsicum Green","Cucumber","Zucchini","Celery",
  "Corn Cob","Pumpkin 1kg","Mushrooms 200g","Avocado",
  "Royal Gala Apples 1kg","Bananas 1kg","Oranges 1kg","Strawberries 250g",
  "Blueberries 125g","Grapes 500g","Kiwifruit 4pk","Pears 1kg",
  "Lemon 3pk","Mango","Watermelon",
  "Pam's White Rice 2kg","Pam's Pasta 500g","San Remo Pasta 500g",
  "Rolled Oats 1kg","Pam's Flour 1.5kg","Pam's Sugar 1kg",
  "Wattie's Baked Beans 420g","Pam's Canned Tomatoes 400g",
  "Pam's Chickpeas 400g","Pam's Lentils 400g","Olive Oil 500ml","Sunflower Oil 2L",
  "Sanitarium Weet-Bix 750g","Kellogg's Corn Flakes 500g","Pam's Muesli 750g",
  "Anchor Peanut Butter 380g","Vegemite 220g","Nutella 400g",
  "Charlie's Orange Juice 1L","Pam's Apple Juice 1L",
  "Coca Cola 1.5L","Sprite 1.5L","Water 1.5L","Sparkling Water 1.5L",
  "Nescafe Instant Coffee 100g","Pam's Tea Bags 100pk",
  "Bluebird Chips 150g","Whittaker's Dark Chocolate 250g","Pam's Crackers 250g",
  "Wattie's Tomato Sauce 560g","Pam's Mayonnaise 385g",
  "Pam's Soy Sauce 250ml","Pam's Salt 1kg",
];

const ICONS = {
  "milk":"🥛","cheese":"🧀","butter":"🧈","yoghurt":"🥛","cream":"🥛",
  "egg":"🥚","bread":"🍞","chicken":"🍗","beef":"🥩","mince":"🥩",
  "lamb":"🥩","pork":"🥩","sausage":"🌭","bacon":"🥓",
  "salmon":"🐟","tuna":"🐟","broccoli":"🥦","cauliflower":"🥦",
  "carrot":"🥕","potato":"🥔","kumara":"🍠","onion":"🧅","garlic":"🧄",
  "tomato":"🍅","lettuce":"🥬","spinach":"🥬","capsicum":"🫑",
  "cucumber":"🥒","zucchini":"🥒","corn":"🌽","mushroom":"🍄",
  "pumpkin":"🎃","avocado":"🥑","apple":"🍎","banana":"🍌",
  "orange":"🍊","strawberr":"🍓","blueberr":"🫐","grape":"🍇",
  "kiwi":"🥝","pear":"🍐","lemon":"🍋","mango":"🥭","watermelon":"🍉",
  "rice":"🍚","pasta":"🍝","oat":"🌾","flour":"🌾","sugar":"🍚",
  "bean":"🫘","chickpea":"🫘","lentil":"🫘","oil":"🫙",
  "weet":"🌾","muesli":"🌾","peanut":"🥜","nutella":"🍫","vegemite":"🫙",
  "juice":"🧃","cola":"🥤","sprite":"🥤","water":"💧",
  "coffee":"☕","tea":"🍵","chip":"🍟","chocolate":"🍫",
  "cracker":"🍘","sauce":"🍅","mayo":"🫙","soy":"🫙","salt":"🧂",
};

function getIcon(name) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "🛒";
}

// ═══════════════════════════
// PER-USER DATA FUNCTIONS
// ═══════════════════════════
function getUserData(email) {
  return JSON.parse(localStorage.getItem(`budgetshop_data_${email}`) || '{}');
}

function saveUserData(email, data) {
  const existing = getUserData(email);
  localStorage.setItem(`budgetshop_data_${email}`, JSON.stringify({ ...existing, ...data }));
}

function getUserHistory(email) {
  const data = getUserData(email);
  return data.history || [];
}

function saveToHistory(email, itemName) {
  const data = getUserData(email);
  const history = data.history || [];
  const filtered = history.filter(h => h !== itemName);
  filtered.unshift(itemName);
  saveUserData(email, { history: filtered.slice(0, 20) });
}

function getSavedPlans(email) {
  const data = getUserData(email);
  return data.savedPlans || [];
}

function savePlan(email, plan) {
  const plans = getSavedPlans(email);
  plans.unshift({ ...plan, savedAt: new Date().toLocaleDateString('en-NZ') });
  saveUserData(email, { savedPlans: plans.slice(0, 10) });
}

// ═══════════════════════════
// APP
// ═══════════════════════════
function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [optimisationResult, setOptimisationResult] = useState(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('budgetshop_active_user');
    if (savedEmail) {
      const users = JSON.parse(localStorage.getItem('budgetshop_users') || '[]');
      const foundUser = users.find(u => u.email === savedEmail);
      if (foundUser) {
        setUser({ ...foundUser, isFirstTime: false });
        setCurrentPage('home');
      }
    }
  }, []);

  const handleLogin = (userData, isFirstTime = false) => {
    const userWithFlag = { ...userData, isFirstTime };
    setUser(userWithFlag);
    localStorage.setItem('budgetshop_active_user', userData.email);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('budgetshop_active_user');
    setCurrentPage('login');
    setMenuOpen(false);
  };

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-4 md:px-6 py-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <span className="text-xl md:text-2xl">🛒</span>
            <span className="text-base md:text-xl font-semibold">BudgetShop NZ</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {[
              { page: 'home', label: 'Home' },
              { page: 'shop', label: 'My Shop' },
              { page: 'results', label: 'Results' },
              { page: 'report', label: 'Report' },
              { page: 'history', label: 'History' },
            ].map(({ page, label }) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`text-sm ${currentPage === page ? 'text-white font-bold' : 'text-green-300 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => setCurrentPage('profile')}
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold hover:bg-green-400">
                  {user.name.charAt(0).toUpperCase()}
                </button>
                <span className="text-sm text-green-200">Hi, {user.name.split(' ')[0]}!</span>
                <button onClick={() => setCurrentPage('profile')} className="text-xs text-green-300 hover:text-white border border-green-600 px-2 py-1 rounded-lg">Profile</button>
                <button onClick={handleLogout} className="text-xs text-green-300 hover:text-white border border-green-600 px-2 py-1 rounded-lg">Logout</button>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl">☰</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-2 border-t border-green-700">
            {user && (
              <div className="px-4 py-2 flex items-center gap-2 border-b border-green-700 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{user.name}</div>
                  <div className="text-green-300 text-xs">{user.email}</div>
                </div>
              </div>
            )}
            {[
              { page: 'home', label: '🏠 Home' },
              { page: 'shop', label: '🛒 My Shop' },
              { page: 'results', label: '📊 Results' },
              { page: 'report', label: '📄 Report' },
              { page: 'history', label: '📋 History' },
              { page: 'profile', label: '👤 Profile' },
            ].map(({ page, label }) => (
              <button key={page} onClick={() => { setCurrentPage(page); setMenuOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-sm ${currentPage === page ? 'text-white font-bold' : 'text-green-300'}`}>
                {label}
              </button>
            ))}
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-300">🚪 Logout</button>
          </div>
        )}
      </nav>

      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} user={user} />}
      {currentPage === 'shop' && <ShopPage setCurrentPage={setCurrentPage} setOptimisationResult={setOptimisationResult} user={user} />}
      {currentPage === 'results' && <ResultsPage setCurrentPage={setCurrentPage} optimisationResult={optimisationResult} user={user} />}
      {currentPage === 'report' && <ReportPage setCurrentPage={setCurrentPage} optimisationResult={optimisationResult} />}
      {currentPage === 'profile' && <ProfilePage setCurrentPage={setCurrentPage} user={user} setUser={setUser} />}
      {currentPage === 'history' && <HistoryPage setCurrentPage={setCurrentPage} user={user} setOptimisationResult={setOptimisationResult} />}
    </div>
  );
}

// ═══════════════════════════
// LOGIN PAGE
// ═══════════════════════════
function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Auckland');
  const [budget, setBudget] = useState('150');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) { setError('Please enter your email!'); return; }
    if (isRegister && !name.trim()) { setError('Please enter your name!'); return; }
    if (!email.includes('@') || !email.includes('.')) { 
      setError('Please enter a valid email address!'); return; 
    }

    const users = JSON.parse(localStorage.getItem('budgetshop_users') || '[]');

    if (isRegister) {
      const existing = users.find(u => u.email === email);
      if (existing) { 
        setError('This email is already registered! Please login instead.'); 
        return; 
      }
      const newUser = { name, email, joinDate: new Date().toLocaleDateString('en-NZ') };
      users.push(newUser);
      localStorage.setItem('budgetshop_users', JSON.stringify(users));
      saveUserData(email, { city, budget, dietary: 'No preference' });

      // Send welcome email
      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_name: name,
          to_email: email,
          city: city,
          budget: budget,
        },
        EMAILJS_PUBLIC_KEY
      ).then(() => {
        console.log('Welcome email sent to:', email);
      }).catch((err) => {
        console.log('Email error:', err);
      });

      onLogin(newUser, true);
    } else {
      const foundUser = users.find(u => u.email === email);
      if (!foundUser) { 
        setError('Email not found! Please register first.'); 
        return; 
      }
      onLogin(foundUser, false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="text-3xl font-bold text-green-900">BudgetShop NZ</h1>
          <p className="text-green-600 mt-1">AI-Powered Grocery Budget Optimiser</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            {isRegister ? '📝 Create Account' : '👋 Login'}
          </h2>

          {isRegister && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                placeholder="e.g. Navneet Kaur" />
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
              placeholder="e.g. navneet@example.com" />
          </div>

          {isRegister && (
            <>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Your City *</label>
                <select value={city} onChange={e => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400">
                  {['Auckland','Wellington','Christchurch','Hamilton','Tauranga','Dunedin','Napier','Palmerston North','Nelson','Rotorua'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Weekly Grocery Budget ($NZD) *</label>
                <input value={budget} onChange={e => setBudget(e.target.value)} type="number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                  placeholder="e.g. 150" />
              </div>
            </>
          )}

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">⚠️ {error}</div>}

          <button onClick={handleSubmit}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-medium text-sm hover:bg-green-800 transition-colors mb-4">
            {isRegister ? '🚀 Create Account & Start Saving' : '🔑 Login'}
          </button>

          <div className="text-center text-sm text-gray-500">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-green-600 font-medium hover:underline">
              {isRegister ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">🔒 Your data is stored locally on your device only.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════
// HOME PAGE
// ═══════════════════════════
function HomePage({ setCurrentPage, user }) {
  const userData = user ? getUserData(user.email) : {};

  return (
    <div>
      <div className="bg-gradient-to-br from-green-50 to-white py-10 md:py-16 px-4 md:px-8 text-center">
        {user && (
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm mb-4">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {user.isFirstTime
              ? `Welcome, ${user.name.split(' ')[0]}! 🎉`
              : `Welcome back, ${user.name.split(' ')[0]}! 👋`}
          </div>
        )}
        <h1 className="text-2xl md:text-4xl font-bold text-green-900 mt-2 mb-3">
          Save more on groceries<br />
          <span className="text-green-500">across all NZ supermarkets</span>
        </h1>
        <p className="text-green-700 mb-4 text-sm md:text-lg px-4">
          Enter your list and budget — we find the cheapest plan across Pak'nSave, New World and Woolworths NZ
        </p>
        {user && userData.city && (
          <p className="text-green-600 text-sm mb-4">📍 {userData.city} · Budget: ${userData.budget}/week</p>
        )}
        <button onClick={() => setCurrentPage('shop')}
          className="bg-green-700 text-white px-8 py-3 rounded-xl font-medium text-base hover:bg-green-800">
          🛒 Build My Shopping Plan
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-4 px-4 md:px-8 py-4 md:py-6 max-w-4xl mx-auto">
        {[
          { value: '$23.50', label: 'Avg. weekly saving', sub: 'vs single-store shopping' },
          { value: '3', label: 'NZ stores compared', sub: "Pak'nSave · New World · Woolworths" },
          { value: '184', label: 'Items in database', sub: 'Real NZ grocery prices' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 md:p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</div>
            <div className="text-xl md:text-2xl font-bold text-green-700">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1 hidden md:block">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="px-4 md:px-8 pb-8 max-w-4xl mx-auto">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-4">Popular items this week</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { name: "Anchor Full Cream Milk 2L", prices: [{ store: "Pak'nSave", price: "$2.99", best: true }, { store: "New World", price: "$3.49", best: false }, { store: "Woolworths", price: "$3.59", best: false }] },
            { name: "Vogel's Mixed Grain Bread 700g", prices: [{ store: "Pak'nSave", price: "$5.49", best: false }, { store: "New World", price: "$4.99", best: true }, { store: "Woolworths", price: "$5.29", best: false }] },
            { name: "Tegel Chicken Breast 1kg", prices: [{ store: "Pak'nSave", price: "$8.99", best: true }, { store: "New World", price: "$11.49", best: false }, { store: "Woolworths", price: "$9.99", best: false }] },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
              <div className="font-medium text-gray-800 text-sm mb-3">{item.name}</div>
              {item.prices.map((p, j) => (
                <div key={j} className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{p.store}</span>
                  <span className={p.best ? 'text-green-600 font-bold' : 'text-gray-500'}>{p.price}</span>
                </div>
              ))}
              <div className="mt-2 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md inline-block">✓ Best: {item.prices.find(p => p.best)?.store}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// SHOP PAGE
// ═══════════════════════════
function ShopPage({ setCurrentPage, setOptimisationResult, user }) {
  const userData = user ? getUserData(user.email) : {};
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [budget, setBudget] = useState(userData.budget || '150');
  const [city, setCity] = useState(userData.city || 'Auckland');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dietary, setDietary] = useState(userData.dietary || 'No preference');
  const [filtered, setFiltered] = useState([]);
  const [userHistory, setUserHistory] = useState(user ? getUserHistory(user.email) : []);

  const handleBudgetChange = (val) => {
    setBudget(val);
    if (user?.email) saveUserData(user.email, { budget: val });
  };

  const handleCityChange = (val) => {
    setCity(val);
    if (user?.email) saveUserData(user.email, { city: val });
  };

  const handleDietaryChange = (val) => {
    setDietary(val);
    if (user?.email) saveUserData(user.email, { dietary: val });
  };

  useEffect(() => {
    if (newItem.length < 1) {
      const history = user?.email ? getUserHistory(user.email) : [];
      setFiltered(history.filter(s => !items.find(i => i.name === s)).slice(0, 8));
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(newItem)}`);
        const data = await res.json();
        const results = data.results.filter(s => !items.find(i => i.name === s));
        const history = user?.email ? getUserHistory(user.email) : [];
        const historyMatches = history.filter(h => results.includes(h));
        const otherResults = results.filter(r => !history.includes(r));
        setFiltered([...historyMatches, ...otherResults].slice(0, 8));
      } catch {
        setFiltered(ALL_ITEMS.filter(s =>
          s.toLowerCase().includes(newItem.toLowerCase()) &&
          !items.find(i => i.name === s)
        ).slice(0, 8));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [newItem, items, user]);

  const addItem = (name) => {
    const itemName = (name || newItem).trim();
    if (!itemName) return;
    if (user?.email) {
      saveToHistory(user.email, itemName);
      setUserHistory(getUserHistory(user.email));
    }
    const existing = items.find(i => i.name === itemName);
    if (existing) {
      setItems(items.map(i => i.name === itemName ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setItems([...items, { id: Date.now(), name: itemName, qty: 1, icon: getIcon(itemName) }]);
    }
    setNewItem('');
    setShowSuggestions(false);
    setFiltered([]);
  };

  const updateQty = (id, delta) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id) => setItems(items.filter(item => item.id !== id));

  const handleOptimise = async () => {
    if (items.length === 0) { alert('Please add at least one item!'); return; }
    setLoading(true);
    try {
      const itemNames = items.flatMap(item => Array(item.qty).fill(item.name));
      const response = await fetch(`${API_URL}/api/optimise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemNames, budget, dietary })
      });
      const result = await response.json();
      // Save plan to history
      if (user?.email) {
        savePlan(user.email, {
          total_cost: result.total_cost,
          savings: result.savings,
          items: items.map(i => i.name),
          budget,
          city,
        });
      }
      setOptimisationResult(result);
      setCurrentPage('results');
    } catch (error) {
      alert('Could not connect to server. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const QUICK_ITEMS = ["Anchor Full Cream Milk 2L","Eggs Free Range 12pk","Vogel's Mixed Grain Bread 700g","Tegel Chicken Breast 1kg","Broccoli","Royal Gala Apples 1kg","Bananas 1kg","Beef Mince 500g","Pam's White Rice 2kg","Carrots 1kg"];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="mb-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-800">Build your grocery list</h2>
        {user && <p className="text-xs text-gray-500 mt-1">{user.name} · {city} · Budget: ${budget}/week</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <div className="relative mb-4">
            <div className="flex gap-2 md:gap-3">
              <input
                value={newItem}
                onChange={e => { setNewItem(e.target.value); setShowSuggestions(true); }}
                onKeyDown={e => { if (e.key === 'Enter') addItem(); if (e.key === 'Escape') { setShowSuggestions(false); setFiltered([]); }}}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="flex-1 border border-gray-300 rounded-xl px-3 md:px-4 py-2 text-sm outline-none focus:border-green-400"
                placeholder="Search 184+ NZ grocery items..."
              />
              <button onClick={() => addItem()} className="bg-green-100 text-green-700 border border-green-300 px-3 md:px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap">+ Add</button>
            </div>
            {showSuggestions && filtered.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden max-h-64 overflow-y-auto">
                {newItem.length === 0 && userHistory.length > 0 && (
                  <div className="px-3 py-1 text-xs text-gray-400 bg-gray-50 border-b">🕐 Your recent items</div>
                )}
                {filtered.map((s, i) => {
                  const isHistory = userHistory.includes(s);
                  return (
                    <div key={i} onMouseDown={() => addItem(s)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-0">
                      <span>{getIcon(s)}</span>
                      <span className="flex-1">{s}</span>
                      {isHistory && <span className="text-xs text-green-500 bg-green-50 px-1 rounded">Recent</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 md:p-8 text-center text-gray-400 mb-4">
              <div className="text-3xl md:text-4xl mb-2">🛒</div>
              <div className="text-sm font-medium">Your grocery list is empty</div>
              <div className="text-xs mt-1">Search above or use quick add →</div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              {items.map((item, i) => (
                <div key={item.id} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 bg-white ${i < items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-green-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">{item.icon}</div>
                  <span className="flex-1 text-xs md:text-sm text-gray-700 truncate">{item.name}</span>
                  <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 border border-gray-300 rounded-md text-gray-500 text-sm flex items-center justify-center">−</button>
                    <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 border border-gray-300 rounded-md text-gray-500 text-sm flex items-center justify-center">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 text-lg flex-shrink-0">×</button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Weekly budget ($NZD) *</label>
              <input value={budget} onChange={e => handleBudgetChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 md:px-4 py-2 text-sm outline-none focus:border-green-400"
                placeholder="e.g. 150" />
            </div>
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-700 mb-1 block">Your city</label>
              <select value={city} onChange={e => handleCityChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 md:px-4 py-2 text-sm outline-none focus:border-green-400">
                {['Auckland','Wellington','Christchurch','Hamilton','Tauranga','Dunedin','Napier','Palmerston North','Nelson','Rotorua'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-2 block">Dietary preferences</label>
            <div className="flex gap-1 md:gap-2 flex-wrap">
              {['No preference', 'Vegetarian', 'Vegan', 'Gluten free', 'Dairy free', 'Halal'].map((tag) => (
                <span key={tag} onClick={() => handleDietaryChange(tag)}
                  className={`px-2 md:px-3 py-1 rounded-full text-xs cursor-pointer border transition-colors ${dietary === tag ? 'bg-green-50 text-green-700 border-green-300 font-medium' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleOptimise} disabled={loading}
            className={`w-full py-3 rounded-xl font-medium text-sm text-white transition-colors ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'}`}>
            {loading ? '⏳ Finding cheapest plan...' : '🤖 Find cheapest plan with ML'}
          </button>
        </div>

        {/* Sidebar */}
        <div className="bg-gray-50 rounded-xl p-4 h-fit">
          {user && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-green-800">{user.name}</div>
                  <div className="text-xs text-green-600">{city} · ${budget}/week</div>
                </div>
              </div>
            </div>
          )}

          <h3 className="font-semibold text-gray-800 mb-3 text-sm">List summary</h3>
          {[
            ['Items', `${items.length}`],
            ['Quantity', `${items.reduce((a, b) => a + b.qty, 0)} units`],
            ['Budget', `$${budget || '0'}`],
            ['City', city],
            ['Dietary', dietary],
          ].map(([label, value], i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-200 text-sm last:border-0">
              <span className="text-gray-500 text-xs">{label}</span>
              <span className="font-medium text-gray-800 text-xs">{value}</span>
            </div>
          ))}

          <div className="mt-4 bg-green-50 rounded-lg p-3">
            <div className="text-xs font-medium text-green-700 mb-1">💡 Tip</div>
            <div className="text-xs text-green-600">Add 5+ items for best savings!</div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Stores we compare:</div>
            {[
              { color: 'bg-green-600', name: "Pak'nSave" },
              { color: 'bg-orange-500', name: "New World" },
              { color: 'bg-blue-600', name: "Woolworths NZ" },
            ].map((store, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <div className={`w-2 h-2 rounded-full ${store.color}`}></div>
                {store.name}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-gray-700 mb-2">
              {userHistory.length > 0 ? '🕐 Your recent items:' : '⚡ Quick add:'}
            </div>
            <div className="flex flex-col gap-1">
              {(userHistory.length > 0 ? userHistory : QUICK_ITEMS)
                .filter(s => !items.find(i => i.name === s))
                .slice(0, 7)
                .map((item, i) => (
                  <button key={i} onClick={() => addItem(item)}
                    className="text-left text-xs text-green-700 py-1 px-2 rounded hover:bg-green-50 flex items-center gap-1">
                    <span>{getIcon(item)}</span>
                    <span className="truncate">+ {item}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// RESULTS PAGE
// ═══════════════════════════
function ResultsPage({ setCurrentPage, optimisationResult, user }) {
  const nutritionGuidelines = optimisationResult?.nutrition_guidelines || { calories: 14000, protein: 350, carbs: 1750, fat: 490, fibre: 175 };const plan = optimisationResult?.optimised_plan || {};
  const totalCost = optimisationResult?.total_cost || 0;
  const savings = optimisationResult?.savings || 0;
  const withinBudget = optimisationResult?.within_budget ?? true;
  const budgetRemaining = optimisationResult?.budget_remaining || 0;
  const nutrition = optimisationResult?.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
  const meetsMoH = optimisationResult?.meets_moh_nz_2020 ?? true;
  const singleStoreTotals = optimisationResult?.single_store_totals || {}; // NEW — real per-store totals from backend
  const [showNutrition, setShowNutrition] = useState(false);

  const storeColors = { "Pak'nSave": "bg-green-600", "New World": "bg-orange-500", "Woolworths": "bg-blue-600" };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Your optimised shopping plan</h2>
          <p className="text-xs md:text-sm text-gray-500">ML optimisation complete</p>
        </div>
        <span className={`text-xs px-2 md:px-3 py-1 rounded-full font-medium ${withinBudget ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {withinBudget ? '✓ Budget met' : '⚠️ Over budget'}
        </span>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4 grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <div className="text-xs text-green-600">Total cost</div>
          <div className="text-lg md:text-2xl font-bold text-green-800">${totalCost.toFixed(2)}</div>
        </div>
        <div className="text-center border-x border-green-200">
          <div className="text-xs text-green-600">You saved</div>
          <div className="text-lg md:text-2xl font-bold text-green-800">${savings.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-green-600">Remaining</div>
          <div className="text-lg md:text-2xl font-bold text-green-800">${budgetRemaining.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          {Object.keys(plan).length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">🛒</div>
              <button onClick={() => setCurrentPage('shop')} className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg text-sm">Go to My Shop</button>
            </div>
          ) : (
            Object.entries(plan).map(([storeName, storeItems], i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                <div className="flex justify-between items-center px-3 md:px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${storeColors[storeName] || 'bg-gray-400'}`}></div>
                    <span className="font-medium text-gray-800 text-sm">{storeName}</span>
                    <span className="text-xs text-gray-500">{storeItems.length} item{storeItems.length > 1 ? 's' : ''}</span>
                  </div>
                  <span className="font-bold text-green-700 text-sm">${storeItems.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
                </div>
                {storeItems.map((item, j) => (
                  <div key={j} className="flex justify-between items-center px-3 md:px-4 py-2 md:py-3 border-b border-gray-100 last:border-0 bg-white">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-6 h-6 md:w-7 md:h-7 bg-green-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{getIcon(item.name)}</div>
                      <div className="min-w-0">
                        <span className="text-xs md:text-sm text-gray-700 truncate block">{item.name}</span>
                        {item.qty > 1 && <span className="text-xs text-gray-400">× {item.qty} (${item.unit_price?.toFixed(2)} each)</span>}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-700 flex-shrink-0 ml-2">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))
          )}
          <div className="flex gap-2 md:gap-3 mt-2">
            <button onClick={() => setCurrentPage('shop')} className="flex-1 border border-green-300 text-green-700 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium">✏️ Edit list</button>
            <button onClick={() => setCurrentPage('report')} className="flex-1 bg-green-700 text-white py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium">📄 Download PDF</button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">🌿 Nutrition summary</h3>
            <button onClick={() => setShowNutrition(!showNutrition)} className="text-xs text-green-600 hover:underline">
              {showNutrition ? 'Hide' : 'Per item'}
            </button>
          </div>
          {[
            { label: 'Calories', value: `${Math.round(nutrition.calories)} / ${nutritionGuidelines.calories} kcal`, pct: (nutrition.calories / nutritionGuidelines.calories) * 100 },
            { label: 'Protein', value: `${Math.round(nutrition.protein)}g / ${nutritionGuidelines.protein}g`, pct: (nutrition.protein / nutritionGuidelines.protein) * 100 },
            { label: 'Carbs', value: `${Math.round(nutrition.carbs)}g / ${nutritionGuidelines.carbs}g`, pct: (nutrition.carbs / nutritionGuidelines.carbs) * 100 },
            { label: 'Fibre', value: `${Math.round(nutrition.fibre)}g / ${nutritionGuidelines.fibre}g`, pct: (nutrition.fibre / nutritionGuidelines.fibre) * 100 },
            { label: 'Fat', value: `${Math.round(nutrition.fat)}g / ${nutritionGuidelines.fat}g`, pct: (nutrition.fat / nutritionGuidelines.fat) * 100 },
          ].map((n, i) => (
            <div key={i} className="mb-2 md:mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{n.label}</span>
                <span className="text-green-600 font-medium">{n.value}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(n.pct, 100)}%` }}></div>
              </div>
            </div>
          ))}
          <div className={`rounded-lg p-2 text-xs mt-2 ${meetsMoH ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
            {meetsMoH ? '✓ Meets MoH NZ (2020) guidelines' : '⚠️ Add more variety to meet guidelines'}
          </div>

          {showNutrition && optimisationResult?.item_nutrition && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-700 mb-2">Per item:</div>
              {Object.entries(optimisationResult.item_nutrition).map(([itemName, nutr], i) => (
                <div key={i} className="mb-2 p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-700 truncate">{getIcon(itemName)} {itemName}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-gray-500">{Math.round(nutr.calories)} cal</span>
                    <span className="text-xs text-gray-500">{Math.round(nutr.protein)}g pro</span>
                    <span className="text-xs text-gray-500">{Math.round(nutr.fibre)}g fibre</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-700 mb-2">Single store comparison:</div>
            {Object.entries(singleStoreTotals).map(([store, price], i) => (
              <div key={i} className="flex justify-between text-xs py-1">
                <span className="text-gray-500">{store} only</span>
                <span className="font-medium text-gray-700">${price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-xs">
              <span className="text-green-600 font-medium">✓ Optimised plan</span>
              <span className="text-green-600 font-bold">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// REPORT PAGE
// ═══════════════════════════
function ReportPage({ setCurrentPage, optimisationResult }) {
  const totalCost = optimisationResult?.total_cost || 0;
  const savings = optimisationResult?.savings || 0;
  const plan = optimisationResult?.optimised_plan || {};
  const nutrition = optimisationResult?.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
  const budget = optimisationResult?.budget || 150; // NEW — use the real budget, not a hardcoded 150

  const storeTextColors = { "Pak'nSave": "text-green-800", "New World": "text-orange-700", "Woolworths": "text-blue-700" };
  const dotColors = { "Pak'nSave": "bg-green-600", "New World": "bg-orange-500", "Woolworths": "bg-blue-600" };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimised_plan: plan, total_cost: totalCost, savings, budget: budget, nutrition })
      });
      if (!response.ok) throw new Error('Server error');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BudgetShopNZ_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('PDF download failed. Please try again!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-800">Your weekly shopping report</h2>
        <button onClick={handleDownloadPDF} className="bg-green-700 text-white px-3 md:px-5 py-2 rounded-xl text-xs md:text-sm font-medium">⬇️ Download PDF</button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 md:mb-6">
        <div className="bg-green-800 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <div>
            <div className="text-white font-semibold text-base md:text-lg">🛒 BudgetShop NZ</div>
            <div className="text-green-300 text-xs md:text-sm">Weekly Shopping Plan · {new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-base md:text-xl">${totalCost.toFixed(2)} total</div>
            <div className="text-green-300 text-xs">${savings.toFixed(2)} saved</div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {Object.keys(plan).length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-3xl mb-2">📄</div>
              <button onClick={() => setCurrentPage('shop')} className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg text-sm">Go to My Shop</button>
            </div>
          ) : (
            Object.entries(plan).map(([storeName, storeItems], i) => {
              const storeTotal = storeItems.reduce((a, b) => a + b.price, 0);
              return (
                <div key={i} className="mb-4 md:mb-5">
                  <div className={`flex items-center gap-2 font-medium mb-2 text-sm ${storeTextColors[storeName] || 'text-gray-800'}`}>
                    <div className={`w-3 h-3 rounded-full ${dotColors[storeName] || 'bg-gray-400'}`}></div>
                    {storeName} — ${storeTotal.toFixed(2)}
                  </div>
                  {storeItems.map((item, j) => (
                    <div key={j} className="flex justify-between py-1 md:py-2 border-b border-gray-100 text-xs md:text-sm">
                      <span className="text-gray-600 flex items-center gap-1 flex-1 min-w-0">
                        <span>{getIcon(item.name)}</span>
                        <span className="truncate">{item.name}</span>
                        {item.qty > 1 && <span className="text-gray-400 flex-shrink-0"> × {item.qty}</span>}
                      </span>
                      <span className="font-medium text-gray-800 flex-shrink-0 ml-2">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              );
            })
          )}

          {Object.keys(plan).length > 0 && (
            <>
              <div className="bg-green-50 rounded-xl p-3 md:p-4 flex justify-between items-center mb-3 md:mb-4">
                <span className="text-green-700 font-medium text-xs md:text-sm">🐷 Total saved vs single-store</span>
                <span className="text-green-700 font-bold text-sm md:text-lg">${savings.toFixed(2)} saved!</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 md:p-4">
                <div className="text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Nutritional summary — MoH NZ (2020) ✅</div>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {[
                    { val: `${Math.round(nutrition.calories)}`, label: "Calories" },
                    { val: `${Math.round(nutrition.protein)}g`, label: "Protein" },
                    { val: `${Math.round(nutrition.carbs)}g`, label: "Carbs" },
                    { val: `${Math.round(nutrition.fibre)}g`, label: "Fibre" },
                  ].map((n, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 text-center border border-gray-200">
                      <div className="text-sm md:text-lg font-bold text-green-700">{n.val}</div>
                      <div className="text-xs text-gray-400">{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 md:gap-3">
        <button onClick={() => setCurrentPage('results')} className="flex-1 border border-green-300 text-green-700 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium">← Results</button>
        <button onClick={() => setCurrentPage('shop')} className="flex-1 border border-green-300 text-green-700 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium">🔄 New plan</button>
        <button onClick={() => setCurrentPage('home')} className="flex-1 bg-green-700 text-white py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium">🏠 Home</button>
      </div>
    </div>
  );
}

// ═══════════════════════════
// PROFILE PAGE
// ═══════════════════════════
function ProfilePage({ setCurrentPage, user, setUser }) {
  const userData = getUserData(user.email);
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(userData.city || 'Auckland');
  const [budget, setBudget] = useState(userData.budget || '150');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveUserData(user.email, { city, budget });
    const users = JSON.parse(localStorage.getItem('budgetshop_users') || '[]');
    const updated = users.map(u => u.email === user.email ? { ...u, name } : u);
    localStorage.setItem('budgetshop_users', JSON.stringify(updated));
    setUser({ ...user, name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-green-800 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-white text-xl font-semibold">{user.name}</div>
          <div className="text-green-300 text-sm">{user.email}</div>
          <div className="text-green-400 text-xs mt-1">Member since {user.joinDate}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-0 border-b border-gray-100">
          {[
            { value: getUserHistory(user.email).length, label: 'Items searched' },
            { value: getSavedPlans(user.email).length, label: 'Plans saved' },
            { value: `$${userData.budget || 150}`, label: 'Weekly budget' },
          ].map((stat, i) => (
            <div key={i} className="text-center py-4 border-r border-gray-100 last:border-0">
              <div className="text-xl font-bold text-green-700">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h3>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400" />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email (cannot change)</label>
            <input value={user.email} disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Your City</label>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400">
              {['Auckland','Wellington','Christchurch','Hamilton','Tauranga','Dunedin','Napier','Palmerston North','Nelson','Rotorua'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Weekly Budget ($NZD)</label>
            <input value={budget} onChange={e => setBudget(e.target.value)} type="number"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400" />
          </div>

          {saved && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg mb-4 text-center">
              ✅ Profile saved successfully!
            </div>
          )}

          <button onClick={handleSave}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-medium text-sm hover:bg-green-800 mb-3">
            💾 Save Changes
          </button>

          <button onClick={() => setCurrentPage('home')}
            className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-medium text-sm hover:bg-gray-50">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// HISTORY PAGE
// ═══════════════════════════
function HistoryPage({ setCurrentPage, user, setOptimisationResult }) {
  const plans = user ? getSavedPlans(user.email) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Shopping History</h2>
          <p className="text-xs text-gray-500 mt-1">Your previous shopping plans</p>
        </div>
        <button onClick={() => setCurrentPage('shop')} className="bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium">
          + New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-sm font-medium">No shopping history yet</div>
          <div className="text-xs mt-1">Your plans will appear here after optimisation</div>
          <button onClick={() => setCurrentPage('shop')} className="mt-4 bg-green-700 text-white px-6 py-2 rounded-xl text-sm">
            Build first plan
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{plan.savedAt}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{plan.city} · Budget: ${plan.budget}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-700">${plan.total_cost?.toFixed(2)}</div>
                  <div className="text-xs text-green-600">${plan.savings?.toFixed(2)} saved</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {plan.items?.slice(0, 5).map((item, j) => (
                  <span key={j} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                    {getIcon(item)} {item.split(' ')[0]}
                  </span>
                ))}
                {plan.items?.length > 5 && (
                  <span className="text-xs text-gray-400">+{plan.items.length - 5} more</span>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">Total cost</div>
                  <div className="font-bold text-green-700 text-sm">${plan.total_cost?.toFixed(2)}</div>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">Saved</div>
                  <div className="font-bold text-green-700 text-sm">${plan.savings?.toFixed(2)}</div>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-500">Items</div>
                  <div className="font-bold text-green-700 text-sm">{plan.items?.length}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;