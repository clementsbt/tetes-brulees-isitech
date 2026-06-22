'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/BackButton';


interface MeteoData {
  vent: string;
  direction: string;
  neige: string;
  prevision: string;
  risque: string;
  lastUpdate: string;
  forecast: {
    today: string;
    tomorrow: string;
  };
  chargement: boolean;
  erreur: string | null;
}

export default function ValfrejusPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [meteo, setMeteo] = useState<MeteoData>({
    vent: '',
    direction: '',
    neige: '',
    prevision: '',
    risque: '',
    lastUpdate: '',
    forecast: { today: '', tomorrow: '' },
    chargement: true,
    erreur: null,
  });

  useEffect(() => {
    // Check auth
    fetch('/api/auth/user')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  
    // Fetch meteo
    fetch('/api/meteo')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        
        const html = data.html;
        
        // Extract Punta Bagna data from the HTML structure
        // Look for the card with "Punta Bagna" - 2737m
        const puntaBagnaMatch = html.match(/Punta Bagna[\s\S]*?2737[\s\S]*?<div class="meteo">([\s\S]*?)<div class="avalanche">/);
        
        if (!puntaBagnaMatch) {
          throw new Error('Données non trouvées');
        }
        
        const puntaBagnaHtml = puntaBagnaMatch[1];
        
        // Extract vent speed
        const ventMatch = puntaBagnaHtml.match(/<img[^>]*wind\.svg[^>]*>[\s\S]*?<span class="subtext">(\d+km\/h)<\/span>/);
        const vent = ventMatch ? ventMatch[1] : 'Non spécifié';
        
        // Extract wind direction
        const dirMatch = puntaBagnaHtml.match(/<img[^>]*windDirection\/SE[^>]*>[\s\S]*?<span class="subtext">(Sud[\s-]*Est)<\/span>/);
        const direction = dirMatch ? dirMatch[1] : 'Non spécifié';
        
        // Extract snow amount
        const neigeMatch = puntaBagnaHtml.match(/<img[^>]*image_neige\.svg[^>]*>[\s\S]*?<span class="text">(\d+[\s]*cm)<\/span>/);
        const neige = neigeMatch ? neigeMatch[1].trim() : 'Non spécifié';
        
        // Extract snow forecast
        const previsionMatch = puntaBagnaHtml.match(/<img[^>]*calendrier_neige\.svg[^>]*>[\s\S]*?<span class="text">(\d+[\s]*cm)<\/span>[\s\S]*?<span class="text_italic">/);
        const prevision = previsionMatch ? previsionMatch[1].trim() : 'Non spécifié';
        
        // Extract avalanche risk - look for the risk in Punta Bagna section
        const risqueMatch = html.match(/<div class="avalanche_score"><span class="bold">(\d)<\/span>\/5<\/div>[\s\S]*?<img class="avalanche_image" src="image\/avalanche_risk\/R(\d)\.svg"/);
        const risque = risqueMatch ? `${risqueMatch[1]}/5` : 'Non spécifié';
        
        // Extract last update time
        const lastUpdateMatch = html.match(/Mis à jour le (\d{2}\/\d{2}\/\d{4} à \d{2}:\d{2})/);
        const lastUpdate = lastUpdateMatch ? lastUpdateMatch[1] : '';
        
        // Extract forecasts
        const forecastMatch = html.match(/Bulletin du jour[\s\S]*?<div class="text_prevision">([^<]+)<\/div>[\s\S]*?Bulletin du lendemain[\s\S]*?<div class="text_prevision">([^<]+)<\/div>/);
        const forecast = forecastMatch ? {
          today: forecastMatch[1].trim(),
          tomorrow: forecastMatch[2].trim()
        } : { today: '', tomorrow: '' };
        
        setMeteo({
          vent,
          direction,
          neige,
          prevision,
          risque,
          lastUpdate,
          forecast,
          chargement: false,
          erreur: null,
        });
      })
      .catch(() => {
        setMeteo({
          vent: '',
          direction: '',
          neige: '',
          prevision: '',
          risque: '',
          lastUpdate: '',
          forecast: { today: '', tomorrow: '' },
          chargement: false,
          erreur: 'Impossible de charger la météo',
        });
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Image de fond fixe pour toute la page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-full">
          <Image
            src="/hero-mountain.webp"
            alt="Montagne enneigée - Têtes Brûlées club de parapente"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.5 }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <BackButton />
        
        <h1 className="text-4xl font-bold text-white mb-8">
          🏔️ Punta Bagna - 2737m
          {meteo.lastUpdate && (
            <span className="text-lg font-normal text-gray-300 ml-2">
              (maj {meteo.lastUpdate})
            </span>
          )}
        </h1>
        
        {/* Meteo Cards - Only for connected users */}
        {user ? (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Vent */}
            <div className="bg-white/80 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                💨 Vent
              </h3>
              {meteo.chargement ? (
                <p className="text-gray-500">Chargement...</p>
              ) : (
                <p className="text-gray-700">
                  {meteo.vent} {meteo.direction && `(${meteo.direction})`}
                </p>
              )}
            </div>
            
            {/* Neige */}
            <div className="bg-white/80 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ❄️ Neige
              </h3>
              {meteo.chargement ? (
                <p className="text-gray-500">Chargement...</p>
              ) : (
                <p className="text-gray-700">{meteo.neige}</p>
              )}
            </div>
            
            {/* Risque avalanche */}
            <div className="bg-white/80 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ⚠️ Risque Avalanche
              </h3>
              {meteo.chargement ? (
                <p className="text-gray-500">Chargement...</p>
              ) : (
                <p className={`text-2xl font-bold ${
                  parseInt(meteo.risque) >= 4 ? 'text-red-600' :
                  parseInt(meteo.risque) >= 2 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {meteo.risque}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 rounded-lg shadow-lg p-6 mb-6 text-center">
            <p className="text-gray-600 mb-4">
              Connecte-toi pour voir les données météo !
            </p>
            <Link 
              href="/connexion" 
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Se connecter
            </Link>
          </div>
        )}
        
        {/* Source */}
        <p className="text-xs text-gray-400 mb-6">
          Source: Lumiplan
        </p>
        
        {/* Webcam */}
        <div className="bg-white/80 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📹 Webcam Punta Bagna</h2>
          <iframe
            src="https://www.skaping.com/valfrejus/puntabagna"
            className="w-full h-[400px] rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Spot Info */}
        <div className="bg-white/80 rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Description détaillée</h3>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-800">Assurances :</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>RCA obligatoire</li>
                  <li>Assurance individuelle obligatoire</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Port du casque obligatoire.</h4>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Niveau de pratique :</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>Les pilotes débutants (moins de 100 vols, brevet initial) doivent être encadrés par un moniteur.</li>
                  <li>Entre 100 et 500 vols (niveau brevet confirmé), la pratique peut être autonome mais sous le contrôle d'un moniteur directeur des vols.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Zone de pratique :</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>La pratique du speed riding est tolérée uniquement sur le domaine hors piste.</li>
                  <li>L'aire de décollage officielle est la piste aménagée sous le sommet du Punta Bagna. Il est possible de se positionner sur toute la longueur afin d'accéder aux différents plans de vol.</li>
                  <li>Tout autre lieu de décollage doit faire l'objet d'une autorisation spécifique à solliciter auprès de la direction des vols.</li>
                  <li>Toute pratique (décollage, ski sous voile, atterrissage ou gonflage...) doit se faire impérativement en dehors des pistes balisées.</li>
                  <li>Survol des pistes à 50 m : le pilote doit pouvoir à tout moment se poser hors piste.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Obstacles :</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>En vol, distance minimum de 50m horizontal et 50m vertical.</li>
                  <li>A ski sous voile, distance minimum de 20m. Passage sous obstacle interdit.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Utilisation des remontées mécaniques :</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>Seuls les élèves en stage accompagnés d'un moniteur sont autorisés à emprunter les couloirs réservés aux écoles de ski.</li>
                  <li>La voile doit être soigneusement rangée afin d'éviter tout désagrément dans la queue et pour l'embarquement dans les cabines (sac de contention demandé).</li>
                  <li>Il est vivement conseillé de se regrouper (4 personnes minimum) pour remplir une cabine.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Règles de vol à vue :</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>Décollage interdit après l'heure légale du coucher du soleil.</li>
                  <li>Visibilité minimale de 1,5km. Rester hors des nuages.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Règles de priorité :</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>skieurs</li>
                  <li>pilote aval</li>
                  <li>à droite.</li>
                  <li>Dépassement par la droite. Le pilote dépassé a la priorité.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ataka Speedriding */}
        <div className="bg-white/80 rounded-lg shadow-lg p-6 mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🪂 Apprendre le Speedriding</h2>
          <p className="text-gray-700 mb-4">
            Nichée au cœur du domaine de Valfréjus, l'<strong>école Ataka</strong> est reconnue comme l'une des meilleures écoles de Speedriding de France.
            Spécialisée dans l'enseignement de ce sport hybride entre parapente et ski, l'école vous accompagne depuis les premières glisses jusqu'aux vols les plus acrobatiques.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Pourquoi choisir Ataka ?</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Instructeurs expérimentés et certifiés</li>
              <li>Terrain de jeu idéal : Punta Bagna à 2737m</li>
              <li>Encadrement personnalisé et sécurité avant tout</li>
            </ul>
          </p>
          <Link 
            href="https://www.ecole-speedriding.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            En savoir plus sur Ataka →
          </Link>
        </div>
        
      </div>
    </div>
  );
}