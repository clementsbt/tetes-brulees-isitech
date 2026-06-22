import BackButton from '@/components/BackButton';


const annonces = [
  {
    id: 1,
    titre: "Appartement ski Savoie valfrejus",
    lieu: "Modane - Valfréjus (73500)",
    capacidade: "4 à 6 personnes",
    chambres: 2,
    superficie: "37 m²",
    prixNuit: "42 €",
    prixSemaine: "294 €",
    description: "« Le No&My » dans Les chalets d'arrondaz est un appartement de 37 m2 pour 4/6 personnes situé au 3ème et dernier étage avec balcon d'angle de 9m2 exposé sud-ouest et vue imprenable sur la Vanoise. Il est situé à 50 mètres du télésiège et piste du Charmasson et à 500 mètres du centre de la Station de ski familiale de VALFREJUS.",
    equipements: ["Télévision", "Parking gratuit", "Cuisine équipée", "Balcon 9m²", "Vue montagne"],
    distancePistes: "50m du télésiège",
    url: "https://www.leboncoin.fr/ad/locations_saisonnieres/3143971343",
    arrivee: "15:00",
    depart: "10:00",
    animaux: "Non acceptés",
    fumeur: "Non"
  },
  {
    id: 2,
    titre: "Location appart été/hiver à valfrejus",
    lieu: "Modane - Valfréjus (73500)",
    capacidade: "6 personnes",
    chambres: 3,
    superficie: "",
    prixNuit: "100 €",
    prixSemaine: "800 €",
    description: "Location appartement – Été – Station de Valfréjus ☀️🌲\n\nEnvie d'un séjour à la montagne en famille ou entre amis cet été ?\nProfitez du grand air, des paysages magnifiques et des nombreuses activités estivales ! 🌿\n\nAppartement chaleureux en duplex à Valfréjus. Station familiale située entre 1600 et 2700 m d'altitude, idéale pour des vacances conviviales et ressourçantes.",
    equipements: ["Télévision", "Parking gratuit", "Duplex"],
    distancePistes: "",
    url: "https://www.leboncoin.fr/ad/locations_saisonnieres/3187030632",
    arrivee: "16:00",
    depart: "10:00",
    animaux: "Non acceptés",
    fumeur: "Non"
  }
];

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏠 Locations à Valfréjus
          </h1>
          <p className="text-lg text-gray-700">
            Appartements au pied des pistes
          </p>
        </div>

        {/* Apartments Grid */}
        <div className="max-w-4xl mx-auto space-y-8">
          {annonces.map((annonce) => (
            <div key={annonce.id} className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Image placeholder */}
              <div className="h-48 md:h-56 bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl mb-2 block">🏔️</span>
                  <p className="text-gray-600 font-medium">Photo à venir</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                {/* Title & Price */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div className="md:w-2/3">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      {annonce.titre}
                    </h2>
                    <p className="text-gray-600">📍 {annonce.lieu}</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      {annonce.prixNuit}
                    </p>
                    <p className="text-gray-600">/ nuit</p>
                  </div>
                </div>

                {/* Key features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="font-semibold text-gray-800 text-sm">{annonce.capacidade}</p>
                    <p className="text-xs text-gray-600">Capacité</p>
                  </div>
                  {annonce.superficie && (
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="font-semibold text-gray-800 text-sm">{annonce.superficie}</p>
                      <p className="text-xs text-gray-600">Surface</p>
                    </div>
                  )}
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="font-semibold text-gray-800 text-sm">{annonce.chambres} chambres</p>
                    <p className="text-xs text-gray-600">Chambres</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <p className="font-semibold text-gray-800 text-sm">dès {annonce.prixSemaine}</p>
                    <p className="text-xs text-gray-600">/ semaine</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {annonce.description}
                </p>

                {/* Equipements */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {annonce.equipements.map((eq, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
                      {eq}
                    </span>
                  ))}
                </div>

                {/* Info pratiques */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Arrivée</p>
                      <p className="font-medium">{annonce.arrivee}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Départ</p>
                      <p className="font-medium">{annonce.depart}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Animaux</p>
                      <p className="font-medium">{annonce.animaux}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fumeur</p>
                      <p className="font-medium">{annonce.fumeur}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a 
                  href={annonce.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Voir sur Le Bon Coin →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Other options hint */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            D'autres annonces ?
            <a 
              href="https://www.leboncoin.fr/recherche/?locations_saisonnieres&city=valfrejus" 
              target="_blank"
              className="text-orange-600 hover:underline ml-1"
            >
              Chercher sur Le Bon Coin →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}