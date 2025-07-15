'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/dashboard.css';

interface User {
  _id: string;
  Nombre: string;
  email: string;
  Edad: number;
  Ciudad: string;
  Intereses: string[];
  aceptaOfertas: boolean;
}

interface Web {
  _id: string;
  Título: string;
  Actividad: string;
  Ciudad: string;
  Resumen: string;
}

const MerchantDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [webs, setWebs] = useState<Web[]>([]);
  const [message, setMessage] = useState('');
  const [merchantCity, setMerchantCity] = useState('');

  const fetchUsers = async (city: string) => {
    if (!city) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/userRoutes/users/offers/${city}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setMessage('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const handleDeleteWeb = async (webId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comerceDetailsRoutes/${webId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Web eliminada correctamente');
        fetchMerchantWebs();
      } else {
        setMessage('Error al eliminar la web');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const fetchMerchantWebs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenData.userId;
      
      const response = await fetch(`http://localhost:3000/api/comerceDetailsRoutes/merchant/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWebs(data);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al cargar las webs');
    }
  };

  const getUserDetails = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/userRoutes/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles del usuario');
      }

      const data = await response.json();
      setMessage(`
        Nombre: ${data.Nombre}
        Email: ${data.email}
        Edad: ${data.Edad}
        Ciudad: ${data.Ciudad}
        Intereses: ${data.Intereses.join(', ')}
        Acepta Ofertas: ${data.aceptaOfertas ? 'Sí' : 'No'}
      `);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al obtener los detalles del usuario');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
    window.location.reload();
  };

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.userId;
        
        const response = await fetch(`http://localhost:3000/api/userRoutes/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const merchantData = await response.json();
          const city = merchantData.Ciudad;
          setMerchantCity(city);
          if (city) {
            fetchUsers(city);
          }
        }
      } catch (error) {
        console.error('Error fetching merchant details:', error);
        setMessage('Error al cargar los datos del comerciante');
      }
    };

    fetchMerchantDetails();
    fetchMerchantWebs();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h2>Panel de Control del Comerciante</h2>
        <div className="auth-buttons">
          <button 
            className="add-review"
            onClick={() => router.push('/create-web')}
          >
            Crear Web
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <h3>Mis Webs</h3>
      <div className="webs-grid">
        {webs.map(web => (
          <div key={web._id} className="web-card">
            <h2>{web.Título}</h2>
            <p className="activity">{web.Actividad}</p>
            <p className="city">{web.Ciudad}</p>
            <p className="summary">{web.Resumen}</p>
            <div className="button-group">
              <button 
                className="edit-profile"
                onClick={() => router.push(`/edit-web/${web._id}`)}
              >
                Editar Web
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteWeb(web._id)}
              >
                Eliminar Web
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3>Usuarios que permiten recibir ofertas en {merchantCity}</h3>
      <div className="webs-grid">
        {users.map(user => (
          <div 
            key={user._id} 
            className="web-card" 
            onClick={() => getUserDetails(user._id)} 
            style={{ cursor: 'pointer' }}
          >
            <h2>{user.Nombre}</h2>
            <p className="activity">Email: {user.email}</p>
            <p className="city">Edad: {user.Edad}</p>
            <p className="summary">Intereses: {user.Intereses.join(', ') || 'No especificados'}</p>
          </div>
        ))}
      </div>
      {message && <p className="message error">{message}</p>}
    </div>
  );
};

export default MerchantDashboard; 