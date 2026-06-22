'use client';

import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';


interface User {
  email: string;
  id: string;
  name?: string;
}

interface Evenement {
  id: string;
  nom: string;
  date: string;
  time?: string;
  location: string;
  createurEmail: string;
  createurNom: string;
  createurPhone?: string;
  createurId: string;
  participants: { email: string; name: string; phone?: string }[];
}

export default function EvenementsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<any>(null);
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newNom, setNewNom] = useState('');
  const [notifyOnNewEvent, setNotifyOnNewEvent] = useState(false);
  const [savingNotify, setSavingNotify] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          // Get notify preference from user object (includes notifyOnNewEvent)
          const notifyPref = data.user.notifyOnNewEvent ?? false;
          localStorage.setItem('notifyOnNewEvent', String(notifyPref));
          setNotifyOnNewEvent(notifyPref);
        }
      } catch {
        // Not logged in
      }
      setLoading(false);
    };

    const fetchEvenements = async () => {
      try {
        const res = await fetch('/api/evenements');
        const data = await res.json();
        setEvenements(data);
      } catch {
        // Ignore
      }
    };

    checkAuth();
    fetchEvenements();
  }, []);

  const refreshEvenements = async () => {
    const res = await fetch('/api/evenements');
    const data = await res.json();
    setEvenements(data);
  };

  const handleDayClick = (dateKey: string) => {
    setSelectedDate(dateKey);
    setNewNom('');
    setShowModal(true);
  };

  const createEvenement = async () => {
    if (!newNom || !selectedDate || creating) return;

    setCreating(true);
    try {
      const res = await fetch('/api/evenements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: newNom, date: selectedDate, time: newTime, location: newLocation }),
      });

      if (res.ok) {
        setShowModal(false);
        refreshEvenements();
      }
    } catch {
      // Ignore
    } finally {
      setCreating(false);
    }
  };

  const joinEvenement = async (evenementId: string) => {
    if (!user) return;

    setLoadingEventId(evenementId);
    try {
      const res = await fetch('/api/evenements/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evenementId }),
      });

      if (res.ok) {
        refreshEvenements();
      }
    } catch {
      // Ignore
    } finally {
      setLoadingEventId(null);
    }
  };

  const leaveEvenement = async (evenementId: string) => {
    if (!user) return;

    setLoadingEventId(evenementId);
    try {
      const res = await fetch(`/api/evenements/${evenementId}/leave`, {
        method: 'POST',
      });

      if (res.ok) {
        refreshEvenements();
      }
    } catch (err) {
      console.error('Error leaving event:', err);
    } finally {
      setLoadingEventId(null);
    }
  };

  // Generate calendar days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getEvenementsForDate = (dateKey: string) => {
    // dateKey is in YYYY-MM-DD format
    return evenements.filter(e => {
      // Extract YYYY-MM-DD from ISO string
      const eventDateKey = e.date.split('T')[0];
      return eventDateKey === dateKey;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <BackButton />
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
            <p className="text-gray-600 mb-4">
              Connecte-toi pour voir et créer des événements !
            </p>
            <a href="/connexion" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  const dayEvenements = selectedDate ? getEvenementsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🪂 Sorties Club
        </h1>
        <p className="text-gray-600 mb-6">
          Clique sur un jour pour créer ou rejoindre un événement
        </p>

        {/* Notification checkbox */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyOnNewEvent}
              onChange={async (e) => {
                const checked = e.target.checked;
                setNotifyOnNewEvent(checked);
                localStorage.setItem('notifyOnNewEvent', String(checked));
                setSavingNotify(true);
                try {
                  await fetch('/api/auth/preferences', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ notifyOnNewEvent: checked }),
                  });
                } finally {
                  setSavingNotify(false);
                }
              }}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700">
              M'avertir par email lors d'une nouvelle sortie club
            </span>
          </label>
          {savingNotify && <span className="text-sm text-gray-500 ml-8">Sauvegarde...</span>}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} aria-label="Mois précédent" className="text-gray-600 hover:text-gray-900">
              ← Précédent
            </button>
            <h2 className="text-xl font-bold text-black">
              {monthNames[month]} {year}
            </h2>
            <button onClick={nextMonth} aria-label="Mois suivant" className="text-gray-600 hover:text-gray-900">
              Suivant →
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium text-gray-700 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-24"></div>;

              const dateKey = formatDate(day);
              const dayEvts = getEvenementsForDate(dateKey);
              const isToday = day.toDateString() === new Date().toDateString();
              const isPast = day < new Date() && !isToday;

              return (
                <button
                  key={dateKey}
                  onClick={() => !isPast && handleDayClick(dateKey)}
                  disabled={isPast}
                  className={`
                    h-28 p-2 rounded text-left flex flex-col text-xs overflow-hidden
                    ${isPast ? 'opacity-40 bg-gray-50 cursor-not-allowed' : 'bg-white border border-gray-200 hover:bg-indigo-50 cursor-pointer'}
                    ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  `}
                >
                  <div className={`font-medium ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  {dayEvts.length > 0 ? (
                    <div className="mt-auto space-y-1">
                      {dayEvts.map((e) => (
                        <div key={e.id} className="bg-indigo-100 text-indigo-700 p-1 rounded truncate text-xs">
                          {e.nom}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600 truncate mt-auto text-xs">-</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <button onClick={() => setShowModal(false)} aria-label="Fermer" className="text-gray-700 hover:text-gray-700 text-2xl">
                  ×
                </button>
              </div>

              {/* Existing events */}
              {dayEvenements.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Sorties Club existants</h3>
                  <div className="space-y-2">
                    {dayEvenements.map((e) => (
                      <div key={e.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <button
                              onClick={() => setSelectedEventForDetails(e)}
                              className="font-medium text-indigo-600 hover:underline text-left"
                            >
                              {e.nom}
                            </button>
                            <p className="text-sm text-gray-900">Par {e.createurNom}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {e.createurId === user.id ? (
                              <button
                                onClick={async () => {
                                  if (!confirm('Supprimer cette sortie ?')) return;
                                  try {
                                    await fetch(`/api/evenements/${e.id}`, {
                                      method: 'DELETE',
                                      credentials: 'include',
                                    });
                                    refreshEvenements();
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200"
                              >
                                Supprimer
                              </button>
                            ) : e.participants.some(p => p.email === user.email) ? (
                              <button
                                onClick={() => leaveEvenement(e.id)}
                                disabled={loadingEventId === e.id}
                                className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                              >
                                Se désinscrire
                              </button>
                            ) : (
                              <button
                                onClick={() => joinEvenement(e.id)}
                                disabled={loadingEventId === e.id}
                                className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                              >
                                Rejoindre
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 mt-1">
                          {e.participants.length} participant{e.participants.length > 1 ? 's' : ''}: {e.participants.map(p => p.name).join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create new event */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Créer un nouvel événement</h3>
                <input
                  type="text"
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  placeholder="Session speed fly"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-2 text-gray-500 placeholder:text-gray-400"
                />
                <div className="mb-2">
                  <label className="block text-xs text-gray-600 mb-1">Heure</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 max-w-xs"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs text-gray-600 mb-1">Lieu</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-500 placeholder:text-gray-400"
                    placeholder="Lieu (ex: Valfréjus)"
                  />
                </div>
                <button
                  onClick={createEvenement}
                  disabled={!newNom || creating}
                  className="w-full bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Création...' : 'Créer l\'événement'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEventForDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedEventForDetails.nom}
                </h2>
                <button onClick={() => setSelectedEventForDetails(null)} className="text-gray-700 hover:text-gray-700 text-2xl">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Organisateur</h3>
                  <p className="text-gray-900">
                    {selectedEventForDetails.createurNom?.split(' ')[0]} {selectedEventForDetails.createurNom?.split(' ')[1]}
                  </p>
                  {selectedEventForDetails.createurPhone && (
                    <p className="text-gray-600 text-sm">{selectedEventForDetails.createurPhone}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Heure:</span>
                    <span className="text-gray-900 font-medium">{selectedEventForDetails.time || 'Non définie'}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Lieu:</span>
                    <span className="text-gray-900 font-medium">{selectedEventForDetails.location}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Participants ({selectedEventForDetails.participants?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {selectedEventForDetails.participants?.map((p: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-900">{p.name}</p>
                          {p.phone && <p className="text-gray-600 text-sm">{p.phone}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}