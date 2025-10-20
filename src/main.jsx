import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const initializeAdmin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const adminExists = users.find(u => u.email === 'admin@admin');
  
  if (!adminExists) {
    users.push({
      id: 'admin-001',
      name: 'Administrador',
      email: 'admin@admin',
      password: 'abc123',
      role: 'admin',
      createdAt: new Date().toISOString(),
      blocked: false
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
};

initializeAdmin();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);