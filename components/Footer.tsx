'use client';

import Link from 'next/link';
import InstagramIcon from './InstagramIcon';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Liens */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Liens</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/inscription" className="text-gray-400 hover:text-white transition-colors">
                  Inscription
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="text-gray-400 hover:text-white transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/calendrier" className="text-gray-400 hover:text-white transition-colors">
                  Calendrier
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact</h2>
            <ul className="space-y-2 text-gray-400">
              <li>contact@tetesbrulees.fr</li>
              <li>Valfréjus, Savoie</li>
            </ul>
          </div>

          {/* Réseaux */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Suivez-nous</h2>
            <a
              href="https://instagram.com/tetesbrulees"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <InstagramIcon className="w-6 h-6 mr-2" />
              <span>@tetesbrulees</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Têtes Brûlées. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}