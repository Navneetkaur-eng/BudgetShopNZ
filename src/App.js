import React, { useState } from 'react';
import './App.css';
import { optimiseGroceries, checkNutrition } from './api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [optimisationResult, setOptimisationResult] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <span className="text-xl font-semibold">BudgetShop NZ</span>
        </div>
        <div className="flex gap-6">
          <button
            onClick={() => setCurrentPage('home')}
            className={`text-sm ${currentPage === 'home' ? 'text-white font-bold' : 'text-green-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('shop')}
            className={`text-sm ${currentPage === 'shop' ? 'text-white font-bold' : 'text-green-300'}`}
          >
            My Shop
          </button>
          <button
            onClick={() => setCurrentPage('results')}
            className={`text-sm ${currentPage === 'results' ? 'text-white font-bold' : 'text-green-300'}`}
          >
            Results
          </button>
          <button
            onClick={() => setCurrentPage('report')}
            className={`text-sm ${currentPage === 'report' ? 'text-white font-bold' : 'text-green-300'}`}
          >
            Report
          </button>
        </div>
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Start Saving
        </button>
      </nav>

      {/* Pages */}
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'shop' && <ShopPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'results' && <ResultsPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'report' && <ReportPage setCurrentPage={setCurrentPage} />}
    </div>
  );
}

// ═══════════════════════════
// HOME PAGE
// ═══════════════════════════
function HomePage({ setCurrentPage }) {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-50 to-white py-16 px-8 text-center">
        <span className="bg-green-100 text-green-700 text-sm px-4 py-1 rounded-full">
          🌿 New Zealand's first AI grocery optimiser
        </span>
        <h1 className="text-4xl font-bold text-green-900 mt-4 mb-3">
          Save more on groceries<br />
          <span className="text-green-500">across all NZ supermarkets</span>
        </h1>
        <p className="text-green-700 mb-8 text-lg">
          Enter your list and budget — we find the cheapest plan across
          Pak'nSave, New World and Woolworths NZ
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto bg-white border-2 border-green-300 rounded-xl px-4 py-3 flex gap-3 shadow-md mb-4">
          <span className="text-gray-400">🔍</span>
          <input
            className="flex-1 outline-none text-gray-700"
            placeholder="Search items — milk, bread, eggs, chicken..."
          />
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            Build my plan
          </button>
        </div>

        {/* Budget Row */}
        <div className="max-w-xl mx-auto flex items-center gap-3 justify-center">
          <span className="text-green-700 font-medium text-sm">Weekly budget ($NZD):</span>
          <input
            className="border border-green-300 rounded-lg px-3 py-2 text-sm w-24 outline-none"
            placeholder="e.g. 150"
          />
          <span className="text-green-700 font-medium text-sm">City:</span>
          <input
            className="border border-green-300 rounded-lg px-3 py-2 text-sm w-28 outline-none"
            placeholder="Auckland"
          />
          <button
            onClick={() => setCurrentPage('shop')}
            className="border-2 border-green-600 text-green-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Optimise →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 px-8 py-6 max-w-4xl mx-auto">
        {[
          { value: '$23.50', label: 'Avg. weekly saving', sub: 'vs single-store shopping' },
          { value: '4', label: 'NZ stores compared', sub: "Pak'nSave · New World · Woolworths · Supervalue" },
          { value: '2,400+', label: 'Items in database', sub: 'Updated weekly from NZ stores' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-green-700">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Popular Items */}
      <div className="px-8 pb-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Popular items this week</h3>
          <button onClick={() => setCurrentPage('shop')} className="text-green-600 text-sm">View all →</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              name: "Anchor Full Cream Milk 2L",
              prices: [
                { store: "Pak'nSave", price: "$2.99", best: true },
                { store: "New World", price: "$3.49", best: false },
                { store: "Woolworths", price: "$3.59", best: false },
              ]
            },
            {
              name: "Vogel's Mixed Grain Bread 700g",
              prices: [
                { store: "Pak'nSave", price: "$5.49", best: false },
                { store: "New World", price: "$4.99", best: true },
                { store: "Woolworths", price: "$5.29", best: false },
              ]
            },
            {
              name: "Tegel Chicken Breast 1kg",
              prices: [
                { store: "Pak'nSave", price: "$8.99", best: true },
                { store: "New World", price: "$11.49", best: false },
                { store: "Woolworths", price: "$9.99", best: false },
              ]
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="font-medium text-gray-800 text-sm mb-3">{item.name}</div>
              {item.prices.map((p, j) => (
                <div key={j} className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{p.store}</span>
                  <span className={p.best ? 'text-green-600 font-bold' : 'text-gray-500'}>{p.price}</span>
                </div>
              ))}
              <div className="mt-2 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md inline-block">
                ✓ Best: {item.prices.find(p => p.best)?.store}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-green-700 text-white px-8 py-3 rounded-xl font-medium"
          >
            🛒 Build my full shopping plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// SHOP PAGE
// ═══════════════════════════
function ShopPage({ setCurrentPage, setOptimisationResult }) {
  const [items, setItems] = useState([
    { id: 1, name: "Anchor Full Cream Milk 2L", qty: 2, icon: "🥛" },
    { id: 2, name: "Vogel's Mixed Grain Bread 700g", qty: 1, icon: "🍞" },
    { id: 3, name: "Eggs Free Range 12pk", qty: 1, icon: "🥚" },
    { id: 4, name: "Tegel Chicken Breast 1kg", qty: 1, icon: "🍗" },
    { id: 5, name: "Royal Gala Apples 1kg", qty: 1, icon: "🍎" },
  ]);
  const [newItem, setNewItem] = useState('');
  const [budget, setBudget] = useState('150');
  const [city, setCity] = useState('Auckland');
    const handleOptimise = async () => {
    const itemNames = items.map(item => item.name);
    const result = await optimiseGroceries(itemNames, budget);
    console.log('Optimisation result:', result);
    setCurrentPage('results');
  };
  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), name: newItem, qty: 1, icon: "🛒" }]);
      setNewItem('');
    }
  };

  const updateQty = (id, delta) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
      {/* Main */}
      <div className="col-span-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Build your grocery list</h2>

        {/* Add Item */}
        <div className="flex gap-3 mb-4">
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
            placeholder="Type an item — e.g. eggs, bread, apples..."
          />
          <button
        onClick={handleOptimise}
        className="w-full bg-green-700 text-white py-3 rounded-xl font-medium text-sm"
      >
        🤖 Find cheapest plan with ML
      </button>
        </div>

        {/* Grocery List */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
          {items.map((item, i) => (
            <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${i < items.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-lg">
                {item.icon}
              </div>
              <span className="flex-1 text-sm text-gray-700">{item.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 border border-gray-300 rounded-md text-gray-500 text-sm flex items-center justify-center">−</button>
                <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 border border-gray-300 rounded-md text-gray-500 text-sm flex items-center justify-center">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 text-lg ml-2">×</button>
            </div>
          ))}
        </div>

        {/* Budget & City */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Weekly budget ($NZD) *</label>
            <input
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Your city</label>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
            />
          </div>
        </div>

        {/* Dietary Tags */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Dietary preferences</label>
          <div className="flex gap-2 flex-wrap">
            {['No preference', 'Vegetarian', 'Vegan', 'Gluten free', 'Dairy free', 'Halal'].map((tag, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${i === 0 ? 'bg-green-50 text-green-700 border-green-300' : 'text-gray-500 border-gray-200'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('results')}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-medium text-sm"
        >
          🤖 Find cheapest plan with ML
        </button>
      </div>

      {/* Sidebar */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">List summary</h3>
        {[
          ['Items added', `${items.length} items`],
          ['Total quantity', `${items.reduce((a, b) => a + b.qty, 0)} units`],
          ['Estimated cost', '~$35.00'],
          ['Weekly budget', `$${budget || '0'}.00`],
        ].map(([label, value], i) => (
          <div key={i} className="flex justify-between py-2 border-b border-gray-200 text-sm last:border-0">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
          </div>
        ))}

        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Budget used</span>
            <span className="text-green-600 font-medium">23%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
          </div>
        </div>

        <div className="mt-4 bg-green-50 rounded-lg p-3">
          <div className="text-xs font-medium text-green-700 mb-1">💡 Tip</div>
          <div className="text-xs text-green-600">Add at least 8–10 items for the best optimisation results.</div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Stores we'll check</div>
          {[
            { color: 'bg-green-600', name: "Pak'nSave" },
            { color: 'bg-orange-500', name: "New World" },
            { color: 'bg-blue-600', name: "Woolworths NZ" },
            { color: 'bg-purple-600', name: "Supervalue" },
          ].map((store, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <div className={`w-2 h-2 rounded-full ${store.color}`}></div>
              {store.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// RESULTS PAGE
// ═══════════════════════════
function ResultsPage({ setCurrentPage, optimisationResult }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
      {/* Main Results */}
      <div className="col-span-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Your optimised shopping plan</h2>
            <p className="text-sm text-gray-500">5 items · Budget $150.00 · Auckland · ML optimisation complete</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">✓ Budget met</span>
        </div>

        {/* Savings Strip */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center mb-4">
          <div>
            <div className="text-xs text-green-600">Total optimised cost</div>
            <div className="text-2xl font-bold text-green-800">$28.44</div>
          </div>
          <div className="w-px bg-green-200 h-10"></div>
          <div>
            <div className="text-xs text-green-600">You save vs single store</div>
            <div className="text-2xl font-bold text-green-800">$6.55 saved</div>
          </div>
          <div className="w-px bg-green-200 h-10"></div>
          <div>
            <div className="text-xs text-green-600">Remaining budget</div>
            <div className="text-2xl font-bold text-green-800">$121.56</div>
          </div>
        </div>

        {/* Store Plans */}
        {[
          {
            store: "Pak'nSave", color: "bg-green-600", total: "$18.96",
            items: [
              { icon: "🥛", name: "Anchor Full Cream Milk 2L × 2", price: "$5.98" },
              { icon: "🍗", name: "Tegel Chicken Breast 1kg × 1", price: "$8.99" },
              { icon: "🍎", name: "Royal Gala Apples 1kg × 1", price: "$3.99" },
            ]
          },
          {
            store: "New World", color: "bg-orange-500", total: "$9.48",
            items: [
              { icon: "🍞", name: "Vogel's Mixed Grain Bread 700g × 1", price: "$4.99" },
              { icon: "🥚", name: "Eggs Free Range 12pk × 1", price: "$4.49" },
            ]
          }
        ].map((storeData, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${storeData.color}`}></div>
                <span className="font-medium text-gray-800 text-sm">{storeData.store}</span>
                <span className="text-xs text-gray-500">{storeData.items.length} items</span>
              </div>
              <span className="font-bold text-green-700">{storeData.total}</span>
            </div>
            {storeData.items.map((item, j) => (
              <div key={j} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center text-sm">{item.icon}</div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-green-700">{item.price}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="flex gap-3">
          <button onClick={() => setCurrentPage('shop')} className="flex-1 border border-green-300 text-green-700 py-3 rounded-xl text-sm font-medium">
            ✏️ Edit my list
          </button>
          <button onClick={() => setCurrentPage('report')} className="flex-1 bg-green-700 text-white py-3 rounded-xl text-sm font-medium">
            📄 Download PDF report
          </button>
        </div>
      </div>

      {/* Nutrition Sidebar */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">🌿 Nutrition summary</h3>
        {[
          { label: 'Calories', value: '1,840 / 2,000 kcal', pct: 92 },
          { label: 'Protein', value: '68g / 50g', pct: 100 },
          { label: 'Carbohydrates', value: '210g / 250g', pct: 84 },
          { label: 'Fibre', value: '22g / 25g', pct: 88 },
          { label: 'Fat', value: '45g / 70g', pct: 64 },
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
        <div className="bg-green-50 rounded-lg p-2 text-xs text-green-700 mt-2">
          ✓ Meets MoH NZ (2020) guidelines
        </div>

        {/* Price Comparison */}
        <div className="mt-6">
          <div className="text-xs font-medium text-gray-700 mb-2">If you bought at one store:</div>
          {[
            { store: "Pak'nSave only", price: "$32.14" },
            { store: "New World only", price: "$34.99" },
            { store: "Woolworths only", price: "$34.45" },
          ].map((s, i) => (
            <div key={i} className="flex justify-between text-xs py-1">
              <span className="text-gray-500">{s.store}</span>
              <span className="font-medium text-gray-700">{s.price}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-xs">
            <span className="text-green-600 font-medium">Optimised plan</span>
            <span className="text-green-600 font-bold">$28.44</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════
// REPORT PAGE
// ═══════════════════════════
function ReportPage({ setCurrentPage }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Your weekly shopping report</h2>
        <button className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
          ⬇️ Download PDF
        </button>
      </div>

      {/* PDF Preview */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        {/* PDF Header */}
        <div className="bg-green-800 px-6 py-4 flex justify-between items-center">
          <div>
            <div className="text-white font-semibold text-lg">🛒 BudgetShop NZ</div>
            <div className="text-green-300 text-sm">Weekly Shopping Plan · Auckland · 30 June 2026</div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-xl">$28.44 total</div>
            <div className="text-green-300 text-sm">$6.55 saved this week</div>
          </div>
        </div>

        {/* PDF Body */}
        <div className="p-6">
          {/* Store 1 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 font-medium text-green-800 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              Pak'nSave — $18.96
            </div>
            {[
              ["Anchor Full Cream Milk 2L × 2", "$5.98"],
              ["Tegel Chicken Breast 1kg × 1", "$8.99"],
              ["Royal Gala Apples 1kg × 1", "$3.99"],
            ].map(([name, price], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                <span className="text-gray-600">{name}</span>
                <span className="font-medium text-gray-800">{price}</span>
              </div>
            ))}
          </div>

          {/* Store 2 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 font-medium text-orange-700 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              New World — $9.48
            </div>
            {[
              ["Vogel's Mixed Grain Bread 700g × 1", "$4.99"],
              ["Eggs Free Range 12pk × 1", "$4.49"],
            ].map(([name, price], i) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                <span className="text-gray-600">{name}</span>
                <span className="font-medium text-gray-800">{price}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-xl p-4 flex justify-between items-center mb-4">
            <span className="text-green-700 font-medium">🐷 Total saved vs single-store</span>
            <span className="text-green-700 font-bold text-lg">$6.55 saved!</span>
          </div>

          {/* Nutrition */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">
              Nutritional summary — meets MoH NZ (2020) guidelines ✅
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { val: "1,840", label: "Calories" },
                { val: "68g", label: "Protein" },
                { val: "210g", label: "Carbs" },
                { val: "22g", label: "Fibre" },
              ].map((n, i) => (
                <div key={i} className="bg-white rounded-lg p-2 text-center border border-gray-200">
                  <div className="text-lg font-bold text-green-700">{n.val}</div>
                  <div className="text-xs text-gray-400">{n.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={() => setCurrentPage('results')} className="flex-1 border border-green-300 text-green-700 py-3 rounded-xl text-sm font-medium">
          ← Back to results
        </button>
        <button onClick={() => setCurrentPage('shop')} className="flex-1 border border-green-300 text-green-700 py-3 rounded-xl text-sm font-medium">
          🔄 New shopping plan
        </button>
        <button onClick={() => setCurrentPage('home')} className="flex-1 bg-green-700 text-white py-3 rounded-xl text-sm font-medium">
          🏠 Home
        </button>
      </div>
    </div>
  );
}

export default App;