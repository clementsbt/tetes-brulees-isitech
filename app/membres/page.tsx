'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';


const teamMembers = [
  {
    name: 'Clément Subtil',
    role: 'Secrétaire',
    description: 'Pilote de speedriding, speedflying et parapente depuis 2022. Secrétaire des têtes brûlées',
    image: '/clement-subtil.jpg',
  },
  {
    name: 'Frank Coupat',
    role: 'Moniteur de l\'école Ataka',
    description: 'Co-créateur du Speedriding et moniteur/Directeur de l\'école Ataka depuis 2006',
    image: '/frank-coupat.jpg',
  },
  {
    name: 'Léa Lou Simon',
    role: 'Présidente des Têtes Brûlées',
    description: 'Présidente des têtes brûlées',
    image: '/lea-lou-simon.jpg',
  },
];

export default function MembresPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effet de scroll sur l overlay
  const maxScroll = 400;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const overlayOpacity = 0.25 + (0.35 * scrollProgress);
  const blurAmount = 2 * (1 - scrollProgress);
  const zoomScale = 1 + (scrollProgress * 0.15);
  const heroOpacity = 1 - scrollProgress;

  return (
    <div className="min-h-screen">
      {/* Image de fond fixe */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomScale})` }}
        >
          <Image
            src="/hero-mountain-membres.webp"
            alt="Montagne enneigée"
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
      <div className="relative z-10 h-screen flex items-center justify-center">
        <div 
          className="text-center px-4 transition-opacity duration-300"
          style={{ opacity: heroOpacity }}
        >
          <h1 className="text-6xl md:text-7xl font-bold text-white drop-shadow-2xl mb-6">
            Nos Membres du club
          </h1>
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo Têtes Brûlées"
              width={180}
              height={180}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 mt-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-square relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {member.name}
                  </h2>
                  <p className="text-indigo-600 font-medium text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}