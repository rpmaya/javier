'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';

const CreateBusiness = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Nombre_del_comercio: '',
    CIF: '',
    Direccion: '',
    email: '',
    Telefono_de_contacto: ''
  });
  const [message, setMessage] = useState('');
  const [createdBusinessId, setCreatedBusinessId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdBusinessId);
    setMessage('ID copiado al portapapeles');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/comerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Comercio creado exitosamente');
        setCreatedBusinessId(data._id);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage(data.message || 'Error al crear el comercio');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión al servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Crear Comercio</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre del Comercio: *</label>
            <input
              type="text"
              name="Nombre_del_comercio"
              value={formData.Nombre_del_comercio}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>CIF: *</label>
            <input
              type="number"
              name="CIF"
              value={formData.CIF}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Dirección: *</label>
            <input
              type="text"
              name="Direccion"
              value={formData.Direccion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email: *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Teléfono de Contacto: *</label>
            <input
              type="number"
              name="Telefono_de_contacto"
              value={formData.Telefono_de_contacto}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Crear Comercio</button>
        </form>
        
        {createdBusinessId && (
          <div className="business-id-section">
            <h3>ID del Comercio:</h3>
            <div className="id-container">
              <input 
                type="text" 
                value={createdBusinessId} 
                readOnly 
                className="id-display"
              />
              <button 
                onClick={copyToClipboard}
                className="copy-button"
                type="button"
              >
                Copiar ID
              </button>
            </div>
          </div>
        )}
        
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateBusiness; 