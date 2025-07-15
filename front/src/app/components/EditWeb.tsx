'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../styles/login.css';

interface WebData {
  Ciudad: string;
  Actividad: string;
  Título: string;
  Resumen: string;
  textos: string[];
  imágenes: string[];
}

const EditWeb = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [formData, setFormData] = useState<WebData>({
    Ciudad: '',
    Actividad: '',
    Título: '',
    Resumen: '',
    textos: [''],
    imágenes: []
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWeb = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/comerceDetailsRoutes/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          setMessage('Error al cargar la web');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error de conexión al servidor');
      }
    };

    if (id) {
      fetchWeb();
    }
  }, [id]);

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
      const response = await fetch(`http://localhost:3000/api/comerceDetailsRoutes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Web actualizada exitosamente');
        setTimeout(() => router.push('/'), 2000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Error al actualizar la web');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión al servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Editar Web</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Guardar Cambios</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default EditWeb; 