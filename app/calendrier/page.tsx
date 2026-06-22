'use client';


import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';


interface PresenceUser {
  email: string;
  name: string;
  phone?: string;
}

interface Presence {
  date: string;
  users: PresenceUser[];
}

interface User {
  email: string;
  name?: string;
}

export default function CalendrierPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [presences, setPresences] = useState<Presence[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 11, 1)); // December 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const MIN_MONTH = new Date(2026, 11, 1); // December 2026
  const MAX_MONTH = new Date(2027, 4, 1); // May 2027 (to allow showing April)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch {
        // Not logged in
      }
      setLoading(false);
    };

    const fetchPresences = async () => {
      try {
        const res = await fetch('/api/presence');
        const data = await res.json();
        
        const presenceList: Presence[] = Object.entries(data).map(([date, users]) => ({
          date,
          users: (users as PresenceUser[]) || [],
        }));
        
        setPresences(presenceList);
      } catch (e) {
        console.error('[DEBUG] Error fetching presences:', e);
      }
    };

    checkAuth();
    fetchPresences();
  }, []);

  const togglePresence = async (date: string) => {
    if (!user) return;
    
    const currentPresence = presences.find(p => p.date === date);
    const isPresent = currentPresence?.users?.some(u => u.email === user.email) || false;
    const newPresent = !isPresent;

    try {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, present: newPresent }),
      });

      window.location.reload();
    } catch (e) {
      // Ignore
    }
  };

  const getUsersForDate = (dateKey: string) => {
    return presences.find(p => p.date === dateKey)?.users || [];
  };

  // Generate calendar days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (Date | null)[] = [];
  // Fill empty slots before first day
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  // Fill actual days
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const prevMonth = () => {
    const newMonth = new Date(year, month - 1, 1);
    if (newMonth >= MIN_MONTH) {
      setCurrentMonth(newMonth);
    }
  };

  const nextMonth = () => {
    const newMonth = new Date(year, month + 1, 1);
    if (newMonth < MAX_MONTH) {
      setCurrentMonth(newMonth);
    }
  };

  // Use local date (yyyy-mm-dd) to avoid timezone issues
const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
  
  const isDatePast = (dateKey: string) => {
    const date = new Date(dateKey);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
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
              Connecte-toi pour voir et ajouter tes disponibilités !
            </p>
            <a 
              href="/connexion" 
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📅 Calendrier de présence
        </h1>
        <p className="text-gray-600 mb-6">
          Clique sur les jours où tu seras présent à Valfréjus pour indiquer ta présence
        </p>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={prevMonth}
              aria-label="Mois précédent"
              className="text-black hover:text-gray-900"
            >
              ← Précédent
            </button>
            <h2 className="text-xl font-bold text-black">
              {monthNames[month]} {year}
            </h2>
            <button 
              onClick={nextMonth}
              aria-label="Mois suivant"
              className="text-black hover:text-gray-900"
            >
              Suivant →
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium text-black text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="h-24"></div>;
              }

              const dateKey = formatDate(day);
              const dayUsers = getUsersForDate(dateKey);
              const isPresent = dayUsers.some(u => u.email === user.email);
              const isToday = day.toDateString() === new Date().toDateString();
              const isPast = day < new Date();
              const isFuture = day > new Date();

              return (
                <button
                  key={dateKey}
                  onClick={() => !isPast && setSelectedDate(dateKey)}
                  disabled={isPast}
                  className={`
                    h-28 p-2 rounded text-left transition-all flex flex-col text-xs
                    ${isPast ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}
                    ${isPresent ? 'bg-green-100 border-2 border-green-500' : 'bg-white border border-gray-200'}
                    ${isToday ? 'ring-2 ring-indigo-500' : ''}
                  `}
                >
                  <div className={`font-medium ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  {dayUsers.length > 0 ? (
                    <div className="text-green-600 truncate mt-auto font-semibold text-xs">
                      {dayUsers.slice(0, 2).map(u => u.name?.split(' ')[0]).join(', ')}
                      {dayUsers.length > 2 && ` +${dayUsers.length - 2}`}
                    </div>
                  ) : (
                    <div className="text-gray-400 truncate mt-auto text-xs">
                      -
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span className="text-gray-600">Tu es inscrit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
              <span className="text-gray-600">Non inscrit</span>
            </div>
          </div>
        </div>

        {/* Modal des membres */}
        {selectedDate && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedDate(null)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedDate}
                </h3>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              {(() => {
                const dayUsers = getUsersForDate(selectedDate);
                const isUserPresent = user && dayUsers.some(u => u.email === user.email);
                
                const handleToggle = async () => {
                  if (!user) return;
                  try {
                    await fetch('/api/presence', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ date: selectedDate, present: !isUserPresent }),
                    });
                    window.location.reload();
                  } catch {
                    // Ignore
                  }
                };
                
                return (
                  <>
                    {/* Bouton inscription */}
                    {!isDatePast(selectedDate) && (
                      <button
                        onClick={handleToggle}
                        className={`w-full py-3 rounded-lg font-semibold mb-4 ${
                          isUserPresent 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300'
                        }`}
                      >
                        {isUserPresent ? '🚫 Se désinscrire' : '✅ S\'inscrire'}
                      </button>
                    )}
                    
                    {/* Liste des participants */}
                    {dayUsers.length > 0 ? (
                      <div className="space-y-3">
                        <p className="font-medium text-gray-700 mb-2">
                          Participant{dayUsers.length > 1 ? 's' : ''} ({dayUsers.length})
                        </p>
                        {dayUsers.map((u, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-3">
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            {u.phone && (
                              <a 
                                href={`tel:${u.phone}`}
                                className="text-indigo-600 hover:underline text-sm"
                              >
                                📞 {u.phone}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-4">
                        {isDatePast(selectedDate) ? 'Personne n\'était inscrit ce jour' : 'Aucun participant pour le moment'}
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}