// API connection to Flask backend
const API_URL = 'http://127.0.0.1:5000';

// Get all prices
export const getPrices = async () => {
  const response = await fetch(`${API_URL}/api/prices`);
  const data = await response.json();
  return data;
};

// Optimise grocery list
export const optimiseGroceries = async (items, budget) => {
  const response = await fetch(`${API_URL}/api/optimise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, budget })
  });
  const data = await response.json();
  return data;
};

// Check nutrition
export const checkNutrition = async (items) => {
  const response = await fetch(`${API_URL}/api/nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  const data = await response.json();
  return data;
};