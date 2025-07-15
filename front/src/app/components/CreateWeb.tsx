'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';

const CreateWeb = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Ciudad: '',
    Actividad: '',
    Título: '',
    Resumen: '',
    textos: [''],
    imágenes: [] as string[],
    id_comercio: '',
    id_merchant: '', 
    isArchived: false
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getMerchantId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const userId = tokenData.userId;

          setFormData(prev => ({
            ...prev,
            id_merchant: userId
          }));
        }
      } catch (error) {
        console.error('Error getting merchant ID:', error);
        setMessage('Error al obtener información del comerciante');
      }
    };

    getMerchantId();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleArrayChange = (index: number, field: 'textos' | 'imágenes', value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: prevState[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'textos' | 'imágenes') => {
    setFormData(prevState => ({
      ...prevState,
      [field]: [...prevState[field], '']
    }));
  };

  const removeArrayField = (field: 'textos' | 'imágenes', index: number) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: prevState[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...formData,
        textos: formData.textos.filter(texto => texto.trim() !== ''),
        imágenes: formData.imágenes.filter(imagen => imagen.trim() !== '')
      };

      const response = await fetch('http://localhost:3000/api/comerceDetailsRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cleanedData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Web creada exitosamente');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setMessage(data.message || 'Error al crear la web');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión al servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Crear Web</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>ID del Comercio: *</label>
            <input
              type="text"
              name="id_comercio"
              value={formData.id_comercio}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Ciudad: *</label>
            <input
              type="text"
              name="Ciudad"
              value={formData.Ciudad}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Actividad: *</label>
            <input
              type="text"
              name="Actividad"
              value={formData.Actividad}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Título: *</label>
            <input
              type="text"
              name="Título"
              value={formData.Título}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Resumen: *</label>
            <textarea
              name="Resumen"
              value={formData.Resumen}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Textos:</label>
            {formData.textos.map((texto, index) => (
              <div key={index} className="array-input">
                <input
                  type="text"
                  value={texto}
                  onChange={(e) => handleArrayChange(index, 'textos', e.target.value)}
                />
                <button type="button" onClick={() => removeArrayField('textos', index)}>
                  Eliminar
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('textos')}>
              Añadir Texto
            </button>
          </div>
          <div>
            <label>URLs de Imágenes:</label>
            {formData.imágenes.map((imagen, index) => (
              <div key={index} className="array-input">
                <input
                  type="text"
                  value={imagen}
                  onChange={(e) => handleArrayChange(index, 'imágenes', e.target.value)}
                />
                <button type="button" onClick={() => removeArrayField('imágenes', index)}>
                  Eliminar
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('imágenes')}>
              Añadir Imagen
            </button>
          </div>
          <button type="submit">Crear Web</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CreateWeb; 