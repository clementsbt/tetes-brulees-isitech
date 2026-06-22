'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

interface User {
  email: string;
  name?: string;
  ffvlLicense?: string | null;
  phone?: string | null;
}

export default function ComptePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        
        if (!res.ok || !data.user) {
          router.push('/connexion');
          return;
        }
        
        setUser(data.user);
      } catch {
        router.push('/connexion');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/connexion', { method: 'DELETE' });
    } catch {
      // Ignore
    }
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const nameParts = user.name?.split(' ') || ['', ''];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Mon Compte
          </h1>
          
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    {nameParts[0]?.[0]}{nameParts[1]?.[0] || ''}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Membre du club
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Prénom</span>
                <span className="text-gray-900 font-medium">{nameParts[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nom</span>
                <span className="text-gray-900 font-medium">{nameParts[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-900 font-medium">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone</span>
                  <span className="text-gray-900 font-medium">{user.phone}</span>
                </div>
              )}
              {user.ffvlLicense && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Licence FFVL</span>
                  <span className="text-gray-900 font-medium">{user.ffvlLicense}</span>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}