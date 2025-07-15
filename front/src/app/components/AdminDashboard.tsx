'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/dashboard.css';

interface Business {
  _id: string;
  Nombre_del_comercio: string;
  CIF: string;
  Direccion: string;
  email: string;
  Telefono_de_contacto: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [message, setMessage] = useState('');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const handleDeleteBusiness = async (businessId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comerce/delete/${businessId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage('Comercio eliminado correctamente');
        fetchBusinesses();
      } else {
        setMessage('Error al eliminar el comercio');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/comerce/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      } else {
        setMessage('Error al cargar los comercios');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
    window.location.reload();
  };

  const handleEditBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comerce/${editingBusiness._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingBusiness)
      });

      if (response.ok) {
        setMessage('Comercio actualizado correctamente');
        setEditingBusiness(null);
        fetchBusinesses();
      } else {
        setMessage('Error al actualizar el comercio');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h2>Panel de Control del Administrador</h2>
        <div className="auth-buttons">
          <button 
            className="add-review"
            onClick={() => router.push('/create-business')}
          >
            Crear Comercio
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <h3>Comercios Registrados</h3>
      <div className="webs-grid">
        {businesses.map(business => (
          <div key={business._id} className="web-card">
            {editingBusiness && editingBusiness._id === business._id ? (
              <form onSubmit={handleEditBusiness} className="edit-form">
                <input
                  type="text"
                  value={editingBusiness.Nombre_del_comercio || ''}
                  onChange={(e) => setEditingBusiness({...editingBusiness, Nombre_del_comercio: e.target.value})}
                  placeholder="Nombre del comercio"
                />
                <input
                  type="text"
                  value={editingBusiness.CIF || ''}
                  onChange={(e) => setEditingBusiness({...editingBusiness, CIF: e.target.value})}
                  placeholder="CIF"
                />
                <input
                  type="text"
                  value={editingBusiness.Direccion || ''}
                  onChange={(e) => setEditingBusiness({...editingBusiness, Direccion: e.target.value})}
                  placeholder="Dirección"
                />
                <input
                  type="email"
                  value={editingBusiness.email || ''}
                  onChange={(e) => setEditingBusiness({...editingBusiness, email: e.target.value})}
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editingBusiness.Telefono_de_contacto || ''}
                  onChange={(e) => setEditingBusiness({...editingBusiness, Telefono_de_contacto: e.target.value})}
                  placeholder="Teléfono de contacto"
                />
                <div className="button-group">
                  <button type="submit" className="save-button">Guardar</button>
                  <button type="button" className="cancel-button" onClick={() => setEditingBusiness(null)}>
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2>{business.Nombre_del_comercio}</h2>
                <p>CIF: {business.CIF}</p>
                <p>Dirección: {business.Direccion}</p>
                <p>Email: {business.email}</p>
                <p>Teléfono: {business.Telefono_de_contacto}</p>
                <div className="button-group">
                  <button 
                    className="edit-profile"
                    onClick={() => setEditingBusiness(business)}
                  >
                    Editar Comercio
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteBusiness(business._id)}
                  >
                    Eliminar Comercio
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {message && <p className="message error">{message}</p>}
    </div>
  );
};

export default AdminDashboard; 