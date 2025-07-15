'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/login.css';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    city: '',
    interests: '',
    receiveOffers: false,
    role: 'user'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.age || !formData.city) {
      setMessage('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (Number(formData.age) < 0) {
      setMessage('La edad debe ser un número positivo');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Por favor, ingrese un correo electrónico válido');
      return;
    }

    try {
      const interesesArray = formData.interests ? formData.interests.split(',').map(item => item.trim()) : [];
      
      const userData = {
        Nombre: formData.username,
        email: formData.email.toLowerCase(),
        Password: formData.password,
        Edad: parseInt(formData.age),
        Ciudad: formData.city,
        Intereses: interesesArray,
        PermiteRecibirOfertas: formData.receiveOffers,
        Role: formData.role
      };

      const response = await fetch('http://localhost:3000/api/userRoutes/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Registro exitoso');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage(data.error || data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Error de conexión al servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Registro</h1>
        <form onSubmit={handleRegister}>
          <div>
            <label>Usuario: *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email: *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Contraseña: *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Confirmar Contraseña: *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Edad: *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Ciudad: *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Intereses: *</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
            />
          </div>
          <div className="checkbox-container">
            <label>
              <span>Deseo recibir ofertas y novedades</span>
              <input
                type="checkbox"
                name="receiveOffers"
                checked={formData.receiveOffers}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="checkbox-container">
            <label>
              <span>Registrarse como comerciante</span>
              <input
                type="checkbox"
                name="role"
                checked={formData.role === 'merchant'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  role: e.target.checked ? 'merchant' : 'user'
                }))}
              />
            </label>
          </div>
          <button type="submit">Registrarse</button>
        </form>
        <p className="message">{message}</p>
        <div className="auth-link">
          <p>¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register; 