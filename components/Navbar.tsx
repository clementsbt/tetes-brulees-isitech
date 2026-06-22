'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  name?: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for auth changes
    const handleAuthChange = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    // Check initial auth
    handleAuthChange();

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/connexion', { method: 'DELETE' });
    } catch {
      // Ignore
    }
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className="bg-orange-500 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="Têtes Brûlées" 
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-white text-2xl font-bold tracking-tight">
                Têtes Brûlées
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Accueil
              </Link>
              <Link href="/sorties-club" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Sorties club
              </Link>
              <Link href="/membres" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Membres
              </Link>
              <Link href="/valfrjus" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Valfréjus
              </Link>
              <Link href="/calendrier" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Calendrier
              </Link>
              <Link href="/location" className="text-white hover:text-yellow-200 transition-colors font-medium">
                Location
              </Link>
              <div className="flex items-center space-x-2 ml-4">
                {user ? (
                  <>
                    <Link 
                      href="/compte" 
                      className="text-white hover:text-yellow-200 transition-colors font-medium"
                    >
                      Mon compte
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-white hover:text-yellow-200 transition-colors font-medium"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/inscription" 
                      className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-100 transition-colors"
                    >
                      S'inscrire
                    </Link>
                    <Link 
                      href="/connexion" 
                      className="text-white hover:text-yellow-200 transition-colors font-medium"
                    >
                      Se connecter
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 right-0 h-screen w-64 bg-orange-500 shadow-2xl z-[60] md:hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 space-y-4">
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white mb-8 ml-auto block"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <Link 
            href="/" 
            className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
            onClick={() => setIsOpen(false)}
          >
            Accueil
          </Link>
          <Link 
            href="/sorties-club" 
            className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
            onClick={() => setIsOpen(false)}
          >
            Sorties club
          </Link>
          <Link 
            href="/membres" 
            className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
            onClick={() => setIsOpen(false)}
          >
            Membres
          </Link>
          <Link 
            href="/valfrjus" 
            className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
            onClick={() => setIsOpen(false)}
          >
            Valfréjus
          </Link>
          <Link 
            href="/calendrier" 
            className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
            onClick={() => setIsOpen(false)}
          >
            Calendrier
          </Link>
          <Link 
            href="/location" 
            className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
            onClick={() => setIsOpen(false)}
          >
            Location
          </Link>
          {user ? (
            <>
              <Link 
                href="/compte" 
                className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
                onClick={() => setIsOpen(false)}
              >
                Mon compte
              </Link>
              <button 
                onClick={handleLogout}
                className="block text-white hover:text-yellow-200 transition-colors font-medium py-3"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/inscription" 
                className="block text-white hover:text-yellow-200 transition-colors font-medium py-3 border-b border-white/20"
                onClick={() => setIsOpen(false)}
              >
                S'inscrire
              </Link>
              <Link 
                href="/connexion" 
                className="block text-white hover:text-yellow-200 transition-colors font-medium py-3"
                onClick={() => setIsOpen(false)}
              >
                Se connecter
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
