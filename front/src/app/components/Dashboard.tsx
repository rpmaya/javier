'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/dashboard.css';
import MerchantDashboard from './MerchantDashboard';
import AdminDashboard from './AdminDashboard';

interface Web {
  _id: string;
  Título: string;
  Actividad: string;
  Ciudad: string;
  Resumen: string;
  imágenes: string[];
  reseñasUsuarios: {
    scoring: number;
    reseñas: string[];
    numeroPuntuacionesTotales: number;
  };
}

interface UserData {
  _id: string;
  Nombre: string;
  email: string;
  Edad: number;
  Ciudad: string;
  Intereses: string[];
  aceptaOfertas: boolean;
}

const Dashboard = () => {
  const router = useRouter();
  const [webs, setWebs] = useState<Web[]>([]);
  const [filteredWebs, setFilteredWebs] = useState<Web[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [reviewData, setReviewData] = useState({ rating: 0, reseña: '' });
  const [selectedWeb, setSelectedWeb] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMerchant, setIsMerchant] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleCityFilter = (city: string) => {
    setSelectedCity(city);
    if (city) {
      setFilteredWebs(webs.filter(web => web.Ciudad === city));
    } else {
      setFilteredWebs(webs);
    }
  };

  const handleActivityFilter = async (activity: string) => {
    setSelectedActivity(activity);
    if (activity) {
      try {
        const response = await fetch(`http://localhost:3000/api/comerceDetailsRoutes/activity/${activity}`, {
          headers: {
            'Authorization': localStorage.getItem('token') || ''
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFilteredWebs(data);
        }
      } catch (error) {
        console.error('Error fetching by activity:', error);
      }
    } else {
      setFilteredWebs(webs);
    }
  };

  const handleSortChange = async (order: string) => {
    setSortOrder(order);
    if (order) {
      try {
        const response = await fetch(`http://localhost:3000/api/comerceDetailsRoutes/sort/scoring/${order}`, {
          headers: {
            'Authorization': localStorage.getItem('token') || ''
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFilteredWebs(data);
        }
      } catch (error) {
        console.error('Error sorting webs:', error);
      }
    } else {
      setFilteredWebs(webs);
    }
  };

  const handleRatingChange = (value: number) => {
    setReviewData(prev => ({ ...prev, rating: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
    window.location.reload();
  };

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/userRoutes/users/${userData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        setMessage('Datos actualizados correctamente');
        setShowUserEdit(false);
      } else {
        setMessage('Error al actualizar los datos');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const handleReviewSubmit = async (webId: string) => {
    if (!isLoggedIn) {
      setMessage('Debes iniciar sesión para dejar una reseña');
      return;
    }
    
    // Encontrar la web actual para obtener las reseñas existentes
    const currentWeb = webs.find(web => web._id === webId);
    if (!currentWeb) {
      setMessage('Error: No se encontró la página web');
      return;
    }
    
    try {
      // Obtener las reseñas existentes
      const existingReviews = currentWeb.reseñasUsuarios.reseñas || [];
      const existingScoring = currentWeb.reseñasUsuarios.scoring || 0;
      const existingCount = currentWeb.reseñasUsuarios.numeroPuntuacionesTotales || 0;
      
      // Añadir la nueva reseña al array existente
      const newReviews = reviewData.reseña ? [...existingReviews, reviewData.reseña] : existingReviews;
      
      // Calcular el nuevo scoring promedio
      const newCount = existingCount + 1;
      const totalScore = (existingScoring * existingCount) + reviewData.rating;
      const newAverageScoring = totalScore / newCount;
      
      const response = await fetch(`http://localhost:3000/api/comerceDetailsRoutes/${webId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reseñasUsuarios: {
            scoring: newAverageScoring,
            reseñas: newReviews,
            numeroPuntuacionesTotales: newCount
          }
        })
      });

      if (response.ok) {
        setMessage('Reseña enviada con éxito');
        setReviewData({ rating: 0, reseña: '' });
        setSelectedWeb(null);
        fetchWebs();
      } else {
        setMessage('Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
    }
  };

  const fetchWebs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/comerceDetailsRoutes', {
        headers: {
          'Authorization': localStorage.getItem('token') || ''
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWebs(data);
        setFilteredWebs(data);
        const uniqueCities = [...new Set(data.map((web: Web) => web.Ciudad))] as string[];
        const uniqueActivities = [...new Set(data.map((web: Web) => web.Actividad))] as string[];
        setCities(uniqueCities);
        setActivities(uniqueActivities);
      } else {
        console.error('Error response:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching webs:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        
        const response = await fetch(`http://localhost:3000/api/userRoutes/users/${tokenData.userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    const checkMerchantStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsMerchant(false);
          return;
        }

        const response = await fetch('http://localhost:3000/api/userRoutes/checkMerchant', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsMerchant(data.isMerchant);
        } else {
          setIsMerchant(false);
        }
      } catch (error) {
        console.error('Error checking merchant status:', error);
        setIsMerchant(false);
      }
    };

    checkMerchantStatus();
  }, [isLoggedIn]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          return;
        }

        const response = await fetch('http://localhost:3000/api/userRoutes/checkAdmin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isLoggedIn]);

  useEffect(() => {
    fetchWebs();
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Show different dashboards based on user role
  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isMerchant) {
    return <MerchantDashboard />;
  }

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <div className="filter-section">
          <select 
            value={selectedCity} 
            onChange={(e) => handleCityFilter(e.target.value)}
            className="city-filter"
          >
            <option value="">Todas las ciudades</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select 
            value={selectedActivity} 
            onChange={(e) => handleActivityFilter(e.target.value)}
            className="activity-filter"
          >
            <option value="">Todas las actividades</option>
            {activities.map(activity => (
              <option key={activity} value={activity}>{activity}</option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="activity-filter"
          >
            <option value="">Ordenar por puntuación</option>
            <option value="asc">Menor a mayor puntuación</option>
            <option value="desc">Mayor a menor puntuación</option>
          </select>
        </div>
        <div className="auth-buttons">
          {isLoggedIn && !isMerchant && !isAdmin && (
            <button 
              className="edit-profile"
              onClick={() => setShowUserEdit(!showUserEdit)}
            >
              {showUserEdit ? 'Cancelar Edición' : 'Editar Perfil'}
            </button>
          )}
          {isLoggedIn ? (
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          ) : (
            <button className="login-button" onClick={() => router.push('/login')}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      {isLoggedIn && !isMerchant && !isAdmin && showUserEdit && userData && (
        <div className="modal-overlay">
          <div className="user-edit-section">
            <form onSubmit={handleUserUpdate} className="user-edit-form">
              <input
                type="text"
                value={userData.Nombre || ''}
                onChange={(e) => setUserData({...userData, Nombre: e.target.value})}
                placeholder="Nombre"
              />
              <input
                type="email"
                value={userData.email || ''}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                placeholder="Email"
              />
              <input
                type="number"
                value={userData.Edad || ''}
                onChange={(e) => setUserData({...userData, Edad: Number(e.target.value)})}
                placeholder="Edad"
              />
              <input
                type="text"
                value={userData.Ciudad || ''}
                onChange={(e) => setUserData({...userData, Ciudad: e.target.value})}
                placeholder="Ciudad"
              />
              <input
                type="text"
                value={userData.Intereses?.join(', ') || ''}
                onChange={(e) => setUserData({...userData, Intereses: e.target.value.split(', ')})}
                placeholder="Intereses (separados por comas)"
              />
              <div className="checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={userData.aceptaOfertas || false}
                    onChange={(e) => setUserData({...userData, aceptaOfertas: e.target.checked})}
                  />
                  Acepto recibir ofertas
                </label>
              </div>
              <button type="submit" className="save-button">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      <div className="webs-grid">
        {filteredWebs.map(web => (
          <div key={web._id} className="web-card">
            <h2>{web.Título}</h2>
            <p className="activity">{web.Actividad}</p>
            <p className="city">{web.Ciudad}</p>
            <p className="summary">{web.Resumen}</p>
            
            {web.imágenes && web.imágenes.length > 0 && (
              <img src={web.imágenes[0]} alt={web.Título} className="web-image" />
            )}
  
            <div className="rating-info">
              <p>Puntuación: {web.reseñasUsuarios.scoring.toFixed(1)} / 5</p>
              <p>Total de reseñas: {web.reseñasUsuarios.numeroPuntuacionesTotales}</p>
            </div>
  
            {selectedWeb === web._id ? (
              <div className="review-form">
                {isLoggedIn ? (
                  <>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          className={`star-button ${reviewData.rating >= num ? 'active' : ''}`}
                          onClick={() => handleRatingChange(num)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewData.reseña}
                      onChange={(e) => setReviewData(prev => ({ ...prev, reseña: e.target.value }))}
                      placeholder="Escribe tu reseña"
                    />
                    <div className="review-actions">
                      <button className="submit-review" onClick={() => handleReviewSubmit(web._id)}>
                        Enviar Reseña
                      </button>
                      <button className="cancel-review" onClick={() => setSelectedWeb(null)}>
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="login-prompt">
                    <p>Debes iniciar sesión para dejar una reseña</p>
                    <button className="cancel-review" onClick={() => setSelectedWeb(null)}>
                      Cerrar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  className="add-review"
                  onClick={() => {
                    if (isLoggedIn) {
                      setSelectedWeb(web._id);
                    } else {
                      setMessage('Debes iniciar sesión para dejar una reseña');
                    }
                  }}
                >
                  Añadir Reseña
                </button>

                {web.reseñasUsuarios.reseñas.length > 0 && (
                  <div className="reviews-section">
                    <h3>Reseñas:</h3>
                    <div className="reviews-list">
                      {web.reseñasUsuarios.reseñas.map((review, index) => (
                        <p key={index} className="review-item">{review}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {message && (
        <div className={`message ${message.includes('éxito') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 