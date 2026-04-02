// C:\Users\henri\Desktop\vaqueiro-store\frontend\src\services\api.ts

const API_URL = '/api/index.php';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchCoupons = async () => {
  try {
    const response = await fetch(`${API_URL}/coupons`);
    if (!response.ok) throw new Error('Failed to fetch coupons');
    return await response.json();
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    return { status: 'error', message: 'Connection error' };
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', name, email, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    return { status: 'error', message: 'Connection error' };
  }
};
