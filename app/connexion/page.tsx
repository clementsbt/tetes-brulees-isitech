'use client';


import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';


function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inscrit = searchParams.get('inscrit');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la connexion');
        return;
      }

      // User is stored in httpOnly cookie now
      window.dispatchEvent(new Event('auth-change'));
      router.push('/compte');
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {inscrit && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            ✓ Inscription réussie ! Vous pouvez maintenant vous connecter.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            placeholder="votre@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="text-center mt-4">
        <Link href="/mot-de-passe-oublie" className="text-sm text-indigo-600 hover:underline">
          Mot de passe oublié ?
        </Link>
      </div>

      <p className="text-center text-gray-600 text-sm mt-6">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-indigo-600 hover:underline">
          S'inscrire
        </Link>
      </p>
    </>
  );
}

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <BackButton />
        
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Connexion
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Suspense fallback={<p className="text-center">Chargement...</p>}>
              <ConnexionForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}