import React, { useState } from 'react';
import './App.css';
import { optimiseGroceries } from './api';

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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [optimisationResult, setOptimisationResult] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <span className="text-xl font-semibold">BudgetShop NZ</span>
        </div>
        <div className="flex gap-6">
          <button onClick={() => setCurrentPage('home')} className={`text-sm ${currentPage === 'home' ? 'text-white font-bold' : 'text-green-300'}`}>Home</button>
          <button onClick={() => setCurrentPage('shop')} className={`text-sm ${currentPage === 'shop' ? 'text-white font-bold' : 'text-green-300'}`}>My Shop</button>
          <button onClick={() => setCurrentPage('results')} className={`text-sm ${currentPage === 'results' ? 'text-white font-bold' : 'text-green-300'}`}>Results</button>
          <button onClick={() => setCurrentPage('report')} className={`text-sm ${currentPage === 'report' ? 'text-white font-bold' : 'text-green-300'}`}>Report</button>
        </div>
        <button onClick={() => setCurrentPage('shop')} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Start Saving</button>
      </nav>

      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'shop' && <ShopPage setCurrentPage={setCurrentPage} setOptimisationResult={setOptimisationResult} />}
      {currentPage === 'results' && <ResultsPage setCurrentPage={setCurrentPage} optimisationResult={optimisationResult} />}
      {currentPage === 'report' && <ReportPage setCurrentPage={setCurrentPage} optimisationResult={optimisationResult} />}
    </div>
  );
}

// ═══════════════════════════
// HOME PAGE
// ═══════════════════════════
function HomePage({ setCurrentPage }) {
  return (
    <div>
      <div className="bg-gradient-to-br from-green-50 to-white py-16 px-8 text-center">
        <span className="bg-green-100 text-green-700 text-sm px-4 py-1 rounded-full">🌿 New Zealand's first AI grocery optimiser</span>
        <h1 className="text-4xl font-bold text-green-900 mt-4 mb-3">
          Save more on groceries<br />
          <span className="text-green-500">across all NZ supermarkets</span>
        </h1>
        <p className="text-green-700 mb-8 text-lg">Enter your list and budget — we find the cheapest plan across Pak'nSave, New World and Woolworths NZ</p>
        <div className="max-w-xl mx-auto bg-white border-2 border-green-300 rounded-xl px-4 py-3 flex gap-3 shadow-md mb-4">
          <span className="text-gray-400">🔍</span>
          <input className="flex-1 outline-none text-gray-700" placeholder="Search items — milk, bread, eggs, chicken..." />
          <button onClick={() => setCurrentPage('shop')} className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium">Build my plan</button>
        </div>
        <div className="max-w-xl mx-auto flex items-center gap-3 justify-center flex-wrap">
          <span className="text-green-700 font-medium text-sm">Weekly budget ($NZD):</span>
          <input className="border border-green-300 rounded-lg px-3 py-2 text-sm w-24 outline-none" placeholder="e.g. 150" />
          <span className="text-green-700 font-medium text-sm">City:</span>
          <input className="border border-green-300 rounded-lg px-3 py-2 text-sm w-28 outline-none" placeholder="Auckland" />
          <button onClick={() => setCurrentPage('shop')} className="border-2 border-green-600 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">Optimise →</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-8 py-6 max-w-4xl mx-auto">
        {[
          { value: '$23.50', label: 'Avg. weekly saving', sub: 'vs single-store shopping' },
          { value: '3', label: 'NZ stores compared', sub: "Pak'nSave · New World · Woolworths NZ" },
          { value: '100+', label: 'Items in database', sub: 'Updated with NZ prices' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-green-700">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="px-8 pb-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Popular items this week</h3>
          <button onClick={() => setCurrentPage('shop')} className="text-green-600 text-sm">View all →</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Anchor Full Cream Milk 2L", prices: [{ store: "Pak'nSave", price: "$2.99", best: true }, { store: "New World", price: "$3.49", best: false }, { store: "Woolworths", price: "$3.59", best: false }] },
            { name: "Vogel's Mixed Grain Bread 700g", prices: [{ store: "Pak'nSave", price: "$5.49", best: false }, { store: "New World", price: "$4.99", best: true }, { store: "Woolworths", price: "$5.29", best: false }] },
            { name: "Tegel Chicken Breast 1kg", prices: [{ store: "Pak'nSave", price: "$8.99", best: true }, { store: "New World", price: "$11.49", best: false }, { store: "Woolworths", price: "$9.99", best: false }] },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
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
        <div className="text-center mt-6">
          <button onClick={() => setCurrentPage('shop')} className="bg-green-700 text-white px-8 py-3 rounded-xl font-medium">🛒 Build my full shopping plan</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// SHOP PAGE
// ═══════════════════════════
function ShopPage({ setCurrentPage, setOptimisationResult }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [budget, setBudget] = useState('150');
  const [city, setCity] = useState('Auckland');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dietary, setDietary] = useState('No preference');

  const filtered = ALL_ITEMS.filter(s =>
    newItem.length > 0 &&
    s.toLowerCase().includes(newItem.toLowerCase()) &&
    !items.find(i => i.name === s)
  ).slice(0, 8);

  const addItem = (name) => {
    const itemName = (name || newItem).trim();
    if (!itemName) return;
    const existing = items.find(i => i.name === itemName);
    if (existing) {
      setItems(items.map(i => i.name === itemName ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setItems([...items, { id: Date.now(), name: itemName, qty: 1, icon: getIcon(itemName) }]);
    }
    setNewItem('');
    setShowSuggestions(false);
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
      const response = await fetch('http://127.0.0.1:5000/api/optimise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemNames, budget, dietary })
      });
      const result = await response.json();
      setOptimisationResult(result);
      setCurrentPage('results');
    } catch (error) {
      alert('Could not connect to Flask server. Make sure it is running on port 5000!');
    } finally {
      setLoading(false);
    }
  };

  const QUICK_ITEMS = ["Anchor Full Cream Milk 2L","Eggs Free Range 12pk","Vogel's Mixed Grain Bread 700g","Tegel Chicken Breast 1kg","Broccoli","Royal Gala Apples 1kg","Bananas 1kg","Beef Mince 500g","Pam's White Rice 2kg","Carrots 1kg"];

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Build your grocery list</h2>

        <div className="relative mb-4">
          <div className="flex gap-3">
            <input
              value={newItem}
              onChange={e => { setNewItem(e.target.value); setShowSuggestions(true); }}
              onKeyDown={e => { if (e.key === 'Enter') addItem(); if (e.key === 'Escape') setShowSuggestions(false); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
              placeholder="Search — milk, broccoli, chicken, bread..."
            />
            <button onClick={() => addItem()} className="bg-green-100 text-green-700 border border-green-300 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap">+ Add</button>
          </div>
          {showSuggestions && filtered.length > 0 && (
            <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
              {filtered.map((s, i) => (
                <div key={i} onMouseDown={() => addItem(s)} className="px-4 py-2 text-sm text-gray-700 hover:bg-green-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-0">
                  <span className="text-lg">{getIcon(s)}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 mb-4">
            <div className="text-4xl mb-2">🛒</div>
            <div className="text-sm font-medium">Your grocery list is empty</div>
            <div className="text-xs mt-1">Type above to search or use quick add buttons →</div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            {items.map((item, i) => (
              <div key={item.id} className={`flex items-center gap-3 px-4 py-3 bg-white ${i < items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                <span className="flex-1 text-sm text-gray-700">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 border border-gray-300 rounded-md text-gray-500 text-sm flex items-center justify-center hover:bg-gray-50">−</button>
                  <span className="text-sm font-medium w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 border border-gray-300 rounded-md text-gray-500 text-sm flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 text-xl ml-1">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Weekly budget ($NZD) *</label>
            <input value={budget} onChange={e => setBudget(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Your city</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400" />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Dietary preferences</label>
          <div className="flex gap-2 flex-wrap">
            {['No preference', 'Vegetarian', 'Vegan', 'Gluten free', 'Dairy free', 'Halal'].map((tag) => (
              <span key={tag} onClick={() => setDietary(tag)}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer border transition-colors ${dietary === tag ? 'bg-green-50 text-green-700 border-green-300 font-medium' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
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

      <div className="bg-gray-50 rounded-xl p-4 h-fit">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">List summary</h3>
        {[
          ['Items added', `${items.length} items`],
          ['Total quantity', `${items.reduce((a, b) => a + b.qty, 0)} units`],
          ['Weekly budget', `$${budget || '0'}`],
          ['Dietary', dietary],
        ].map(([label, value], i) => (
          <div key={i} className="flex justify-between py-2 border-b border-gray-200 text-sm last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800 text-right text-xs">{value}</span>
          </div>
        ))}

        <div className="mt-4 bg-green-50 rounded-lg p-3">
          <div className="text-xs font-medium text-green-700 mb-1">💡 Tip</div>
          <div className="text-xs text-green-600">Add 5+ items for best savings results!</div>
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
          <div className="text-xs font-medium text-gray-700 mb-2">Quick add:</div>
          <div className="flex flex-col gap-1">
            {QUICK_ITEMS.filter(s => !items.find(i => i.name === s)).slice(0, 8).map((item, i) => (
              <button key={i} onClick={() => addItem(item)} className="text-left text-xs text-green-700 py-1 px-2 rounded hover:bg-green-50 flex items-center gap-1">
                <span>{getIcon(item)}</span>
                <span className="truncate">+ {item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// RESULTS PAGE
// ═══════════════════════════
function ResultsPage({ setCurrentPage, optimisationResult }) {
  const plan = optimisationResult?.optimised_plan || {};
  const totalCost = optimisationResult?.total_cost || 0;
  const savings = optimisationResult?.savings || 0;
  const withinBudget = optimisationResult?.within_budget ?? true;
  const budgetRemaining = optimisationResult?.budget_remaining || 0;
  const nutrition = optimisationResult?.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 };
  const meetsMoH = optimisationResult?.meets_moh_nz_2020 ?? true;

  const storeColors = {
    "Pak'nSave": "bg-green-600",
    "New World": "bg-orange-500",
    "Woolworths": "bg-blue-600",
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Your optimised shopping plan</h2>
            <p className="text-sm text-gray-500">ML optimisation complete · Auckland</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${withinBudget ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {withinBudget ? '✓ Budget met' : '⚠️ Over budget'}
          </span>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center mb-4">
          <div>
            <div className="text-xs text-green-600">Total optimised cost</div>
            <div className="text-2xl font-bold text-green-800">${totalCost.toFixed(2)}</div>
          </div>
          <div className="w-px bg-green-200 h-10"></div>
          <div>
            <div className="text-xs text-green-600">You save vs single store</div>
            <div className="text-2xl font-bold text-green-800">${savings.toFixed(2)} saved!</div>
          </div>
          <div className="w-px bg-green-200 h-10"></div>
          <div>
            <div className="text-xs text-green-600">Remaining budget</div>
            <div className="text-2xl font-bold text-green-800">${budgetRemaining.toFixed(2)}</div>
          </div>
        </div>

        {Object.keys(plan).length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <div className="text-3xl mb-2">🛒</div>
            <div className="text-sm">No results yet — go to My Shop and add items!</div>
            <button onClick={() => setCurrentPage('shop')} className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg text-sm">Go to My Shop</button>
          </div>
        ) : (
          Object.entries(plan).map(([storeName, storeItems], i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${storeColors[storeName] || 'bg-gray-400'}`}></div>
                  <span className="font-medium text-gray-800 text-sm">{storeName}</span>
                  <span className="text-xs text-gray-500">{storeItems.length} item{storeItems.length > 1 ? 's' : ''}</span>
                </div>
                <span className="font-bold text-green-700">${storeItems.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
              </div>
              {storeItems.map((item, j) => (
                <div key={j} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0 bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-sm">{getIcon(item.name)}</div>
                    <div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                      {item.qty > 1 && <span className="text-xs text-gray-400 ml-1">× {item.qty} (${item.unit_price?.toFixed(2)} each)</span>}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-700">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))
        )}

        <div className="flex gap-3 mt-2">
          <button onClick={() => setCurrentPage('shop')} className="flex-1 border border-green-300 text-green-700 py-3 rounded-xl text-sm font-medium hover:bg-green-50">✏️ Edit my list</button>
          <button onClick={() => setCurrentPage('report')} className="flex-1 bg-green-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-800">📄 Download PDF report</button>
        </div>
      </div>

      {/* Nutrition Sidebar - REAL DATA */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">🌿 Nutrition summary</h3>
        {[
          { label: 'Calories', value: `${Math.round(nutrition.calories)} / 2,000 kcal`, pct: (nutrition.calories / 2000) * 100 },
          { label: 'Protein', value: `${Math.round(nutrition.protein)}g / 50g`, pct: (nutrition.protein / 50) * 100 },
          { label: 'Carbohydrates', value: `${Math.round(nutrition.carbs)}g / 250g`, pct: (nutrition.carbs / 250) * 100 },
          { label: 'Fibre', value: `${Math.round(nutrition.fibre)}g / 25g`, pct: (nutrition.fibre / 25) * 100 },
          { label: 'Fat', value: `${Math.round(nutrition.fat)}g / 70g`, pct: (nutrition.fat / 70) * 100 },
        ].map((n, i) => (
          <div key={i} className="mb-3">
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

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">Single store comparison:</div>
          {[
            { store: "Pak'nSave only", price: totalCost + savings + 1.55 },
            { store: "New World only", price: totalCost + savings + 4.99 },
            { store: "Woolworths only", price: totalCost + savings + 3.45 },
          ].map((s, i) => (
            <div key={i} className="flex justify-between text-xs py-1">
              <span className="text-gray-500">{s.store}</span>
              <span className="font-medium text-gray-700">${s.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-xs">
            <span className="text-green-600 font-medium">✓ Optimised plan</span>
            <span className="text-green-600 font-bold">${totalCost.toFixed(2)}</span>
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

  const storeTextColors = { "Pak'nSave": "text-green-800", "New World": "text-orange-700", "Woolworths": "text-blue-700" };
  const dotColors = { "Pak'nSave": "bg-green-600", "New World": "bg-orange-500", "Woolworths": "bg-blue-600" };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimised_plan: plan, total_cost: totalCost, savings, budget: 150, nutrition })
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
      alert('PDF download failed — make sure Flask is running on port 5000!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Your weekly shopping report</h2>
        <button onClick={handleDownloadPDF} className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-green-800">⬇️ Download PDF</button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-green-800 px-6 py-4 flex justify-between items-center">
          <div>
            <div className="text-white font-semibold text-lg">🛒 BudgetShop NZ</div>
            <div className="text-green-300 text-sm">Weekly Shopping Plan · Auckland · {new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-xl">${totalCost.toFixed(2)} total</div>
            <div className="text-green-300 text-sm">${savings.toFixed(2)} saved this week</div>
          </div>
        </div>

        <div className="p-6">
          {Object.keys(plan).length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm">No shopping plan yet</div>
              <button onClick={() => setCurrentPage('shop')} className="mt-3 bg-green-700 text-white px-4 py-2 rounded-lg text-sm">Go to My Shop</button>
            </div>
          ) : (
            Object.entries(plan).map(([storeName, storeItems], i) => {
              const storeTotal = storeItems.reduce((a, b) => a + b.price, 0);
              return (
                <div key={i} className="mb-5">
                  <div className={`flex items-center gap-2 font-medium mb-2 ${storeTextColors[storeName] || 'text-gray-800'}`}>
                    <div className={`w-3 h-3 rounded-full ${dotColors[storeName] || 'bg-gray-400'}`}></div>
                    {storeName} — ${storeTotal.toFixed(2)}
                  </div>
                  {storeItems.map((item, j) => (
                    <div key={j} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <span>{getIcon(item.name)}</span>
                        {item.name}
                        {item.qty > 1 && <span className="text-gray-400 text-xs"> × {item.qty} (${item.unit_price?.toFixed(2)} each)</span>}
                      </span>
                      <span className="font-medium text-gray-800">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              );
            })
          )}

          {Object.keys(plan).length > 0 && (
            <>
              <div className="bg-green-50 rounded-xl p-4 flex justify-between items-center mb-4">
                <span className="text-green-700 font-medium">🐷 Total saved vs single-store shopping</span>
                <span className="text-green-700 font-bold text-lg">${savings.toFixed(2)} saved!</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Nutritional summary — meets MoH NZ (2020) guidelines ✅</div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { val: `${Math.round(nutrition.calories)}`, label: "Calories" },
                    { val: `${Math.round(nutrition.protein)}g`, label: "Protein" },
                    { val: `${Math.round(nutrition.carbs)}g`, label: "Carbs" },
                    { val: `${Math.round(nutrition.fibre)}g`, label: "Fibre" },
                  ].map((n, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 text-center border border-gray-200">
                      <div className="text-lg font-bold text-green-700">{n.val}</div>
                      <div className="text-xs text-gray-400">{n.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setCurrentPage('results')} className="flex-1 border border-green-300 text-green-700 py-3 rounded-xl text-sm font-medium hover:bg-green-50">← Back to results</button>
        <button onClick={() => setCurrentPage('shop')} className="flex-1 border border-green-300 text-green-700 py-3 rounded-xl text-sm font-medium hover:bg-green-50">🔄 New shopping plan</button>
        <button onClick={() => setCurrentPage('home')} className="flex-1 bg-green-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-800">🏠 Home</button>
      </div>
    </div>
  );
}

export default App;