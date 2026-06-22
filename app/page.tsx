'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface User {
  email: string;
  name?: string;
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    };
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  // Calcul de l'opacité, blur et zoom en fonction du scroll
  const maxScroll = 400;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const overlayOpacity = 0.25 + (0.35 * scrollProgress);
  const blurAmount = 2 * (1 - scrollProgress);
  const zoomScale = 1 + (scrollProgress * 0.15);
  const heroOpacity = 1 - scrollProgress;

  return (
    <div className="min-h-screen">
      {/* Image de fond fixe pour toute la page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomScale})` }}
        >
          <Image
            src="/hero-mountain.webp"
            alt="Montagne enneigée - Têtes Brûlées club de parapente"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{
            opacity: overlayOpacity,
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div 
          className="relative z-10 text-center px-4 transition-opacity duration-300"
          style={{ opacity: heroOpacity }}
        >
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Logo Têtes Brûlées"
              width={180}
              height={180}
              className="drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Les Têtes Brûlées
          </h1>
          <p className="text-3xl md:text-4xl text-white mb-4 drop-shadow-lg">
            Club de vol libre
          </p>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg">
            Speedriding • Speedflying • Parapente
          </p>
        </div>
      </div>

      {/* Section des cartes */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto auto-rows-fr">
          <Link href="/membres" className="group">
            <div className="bg-white/70 rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Nos Membres
              </h2>
              <p className="text-gray-600 mt-auto">
                Découvrez la communauté des Têtes Brûlées
              </p>
            </div>
          </Link>

          <Link href="/valfrjus" className="group">
            <div className="bg-white/70 rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <div className="text-5xl mb-4">🏔️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Valfréjus
              </h2>
              <p className="text-gray-600 mt-auto">
                Infos sur notre spot favorite
              </p>
            </div>
          </Link>

          <Link href="/sorties-club" className="group">
            <div className="bg-white/70 rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <div className="text-5xl mb-4">🪂</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sorties Club
              </h2>
              <p className="text-gray-600 mt-auto">
                Sessions et sorties du club
              </p>
            </div>
          </Link>

          <Link href="/calendrier" className="group">
            <div className="bg-white/70 rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <div className="text-5xl mb-4">📆</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Calendrier
              </h2>
              <p className="text-gray-600 mt-auto">
                Dis quand tu viens à Valfréjus
              </p>
            </div>
          </Link>

          <Link href="/location" className="group">
            <div className="bg-white/70 rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 h-full flex flex-col">
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Location
              </h2>
              <p className="text-gray-600 mt-auto">
                Appartements à Valfréjus
              </p>
            </div>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 mb-16">
          <div className="bg-white/70 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            {user ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Bon retour, {user.name || 'membre'} !
                </h3>
                <p className="text-gray-600 mb-6">
                  Gérez votre compte et consultez le calendrier des sessions.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/compte" 
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Mon compte
                  </Link>
                  <Link 
                    href="/calendrier" 
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                  >
                    Calendrier
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Rejoignez-nous !
                </h3>
                <p className="text-gray-600 mb-6">
                  Membre FFVL ? Inscrivez-vous pour accéder au calendrier de présence.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/inscription" 
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    S'inscrire
                  </Link>
                  <Link 
                    href="/connexion" 
                    className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Se connecter
                  </Link>
                  <a 
                    href="https://intranet.ffvl.fr/ffvl_licenceonline/pre_rempli/NEW/1431" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Prendre sa licence FFVL
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}