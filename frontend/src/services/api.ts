// C:\Users\henri\Desktop\vaqueiro-store\frontend\src\services\api.ts

// Usamos a rota configurada no Nginx. 
// A "outra IA" configurou /api para apontar para o backend.
const API_URL = '/api/';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const saveCategory = async (category: any, method: 'POST' | 'PUT') => {
  const res = await fetch(`${API_URL}categories`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(category) });
  if (!res.ok) throw new Error('Failed to save category');
  return res.json();
};

export const deleteCategory = async (id: number) => {
  const res = await fetch(`${API_URL}categories?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
};

export const fetchCoupons = async () => {
  try {
    const response = await fetch(`${API_URL}coupons`);
    if (!response.ok) throw new Error('Failed to fetch coupons');
    return await response.json();
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
};

export const saveProduct = async (product: any, method: 'POST' | 'PUT') => {
  const res = await fetch(`${API_URL}products`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
  if (!res.ok) throw new Error('Failed to save product');
  return res.json();
};

export const deleteProduct = async (id: number) => {
  const res = await fetch(`${API_URL}products?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
};

export const saveCoupon = async (coupon: any, method: 'POST' | 'PUT') => {
  const res = await fetch(`${API_URL}coupons`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(coupon) });
  if (!res.ok) throw new Error('Failed to save coupon');
  return res.json();
};

export const deleteCoupon = async (id: number) => {
  const res = await fetch(`${API_URL}coupons?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete coupon');
  return res.json();
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}auth`, {
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
    const response = await fetch(`${API_URL}auth`, {
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
