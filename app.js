


/********************************************************************
 * 🔥  SYSTEME DE DATES (OBLIGATOIRE)
 * Format interne : YYYY-MM-DD
 * Format affiché : DD-MM-YYYY
 ********************************************************************/

// Vérifie si une date ISO YYYY-MM-DD est valide
function isISO(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

// Vérifie si une date FR DD-MM-YYYY est valide
function isFR(date) {
  return /^\d{2}-\d{2}-\d{4}$/.test(date);
}

// Convertit DD-MM-YYYY → YYYY-MM-DD
function toISO(fr) {
  if (!fr || !isFR(fr)) return fr;
  const [d, m, y] = fr.split("-");
  return `${y}-${m}-${d}`;
}

// Convertit YYYY-MM-DD → DD-MM-YYYY
function fromISO(iso) {
  if (!iso || !isISO(iso)) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

// Ajoute N mois à une date ISO
function addMonths(iso, n) {
  if (!isISO(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
}

// Renvoie la date de fin de mois
function endOfMonthISO(iso) {
  if (!isISO(iso)) return iso;
  const d = new Date(iso + "T00:00:00");
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return d.toISOString().slice(0, 10);
}

function compareISO(a, b) {
  const diff =
    new Date(a + "T00:00:00") - new Date(b + "T00:00:00");
  return diff < 0 ? -1 : diff > 0 ? 1 : 0;
}


// Date d’aujourd’hui au format ISO
function todayISO() {
  return formatDateYMD(new Date());
}

// ================== PARAMÈTRES ENTREPRISE ==================

const COMPANY_SETTINGS_KEY = "acp_company_settings_v1";

function getDefaultCompanySettings() {
  return {
    companyName: "AquaClim Prestige",
    subtitle: "Entretien & Dépannage - Climatisations & Piscines",
    legalName: "Le Blevennec Loïc",
    address: "2 avenue Cauvin, 06100 Nice",
    phone: "06 03 53 77 73",
    email: "aquaclimprestige@gmail.com",
    siret: "XXXXXXXXXXXXX",
    vatNumber: "", // ex: FRxx123456789

    ribHolder: "AquaClim Prestige – Le Blevennec Loïc",
    bankName: "Banque Fictive",
    iban: "FR76 1234 5678 9012 3456 7890 123",
    bic: "FICTFRPPXXX",
  };
}

function getCompanySettings() {
  try {
    const raw = localStorage.getItem(COMPANY_SETTINGS_KEY);
    if (!raw) return getDefaultCompanySettings();
    const parsed = JSON.parse(raw);
    return { ...getDefaultCompanySettings(), ...parsed };
  } catch (e) {
    return getDefaultCompanySettings();
  }
}

// ================== CONSTANTES / MODÈLES ==================

// Modèles de prestations (Particulier / Syndic + descriptions + types)
const PRESTATION_TEMPLATES = [
  {
    label: "— Choisir un modèle —",
    kind: "",
    title: "",
    priceParticulier: null,
    priceSyndic: null,
    descParticulier: "",
    descSyndic: "",
  },

  // 1. Entretien climatisation
  {
    label: "Entretien climatisation",
    kind: "entretien_clim",
    title: "Entretien climatisation",
    priceParticulier: 100,
    priceSyndic: 120,
    descParticulier:
      "Nettoyage filtres, turbine, évaporateur et bac à condensats. Contrôle évacuation et nettoyage groupe extérieur.",
    descSyndic:
      "Nettoyage complet intérieur/extérieur, contrôle évacuation, désinfection et vérification installation. Contrôle températures et rapport gestionnaire.",
  },

  // 2. Entretien piscine chlore
  {
    label: "Entretien piscine chlore",
    kind: "piscine_chlore",
    title: "Entretien piscine chlore",
    priceParticulier: 80,
    priceSyndic: 120,
    descParticulier:
      "Analyse de l’eau, nettoyage bassin, contrôle filtration, rinçage et ajustement traitement.",
    descSyndic:
      "Analyse complète, nettoyage bassin, contrôle local technique, pression filtre, rinçage, vérification pompe et rapport gestionnaire.",
  },

  // 3. Entretien piscine sel
  {
    label: "Entretien piscine sel",
    kind: "piscine_sel",
    title: "Entretien piscine sel",
    priceParticulier: 80,
    priceSyndic: 100,
    descParticulier:
      "Analyse eau, nettoyage bassin, contrôle cellule électrolyse, pompe et filtration. Réglage production de sel.",
    descSyndic:
      "Analyse complète, nettoyage, contrôle cellule et production, vérification filtration, réglages boîtier et rapport gestionnaire.",
  },

  // 4. Entretien jacuzzi
  {
    label: "Entretien jacuzzi / spa",
    kind: "entretien_jacuzzi",
    title: "Entretien jacuzzi / spa",
    priceParticulier: 80,
    priceSyndic: 100,
    descParticulier:
      "Nettoyage spa, filtres, contrôle eau, désinfection buses et vérification pompe/chauffage.",
    descSyndic:
      "Nettoyage complet, analyse eau, désinfection, contrôle installation, pompes/chauffage et rapport gestionnaire.",
  },

  // 5. Hivernage piscine
  {
    label: "Hivernage piscine",
    kind: "hivernage_piscine",
    title: "Hivernage piscine",
    priceParticulier: 100,
    priceSyndic: 120,
    descParticulier:
      "Nettoyage, baisse niveau eau, ajout produit d’hivernage et sécurisation local technique.",
    descSyndic:
      "Nettoyage complet, abaissement contrôlé, purge éventuelle, sécurisation local technique et rapport gestionnaire.",
  },

  // 6. Remise en service piscine
  {
    label: "Remise en service piscine",
    kind: "remise_service_piscine",
    title: "Remise en service piscine",
    priceParticulier: 100,
    priceSyndic: 120,
    descParticulier:
      "Nettoyage, remise en route filtration, analyse eau et réglages nécessaires.",
    descSyndic:
      "Redémarrage complet, analyse et réglages, contrôle local technique, étanchéité et rapport gestionnaire.",
  },

  // 7. Vidange + nettoyage jacuzzi
  {
    label: "Vidange + nettoyage jacuzzi",
    kind: "vidange_jacuzzi",
    title: "Vidange et nettoyage jacuzzi / spa",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier:
      "Vidange complète, nettoyage cuve/buses, nettoyage filtre, remise en eau et équilibrage.",
    descSyndic:
      "Vidange complète, nettoyage cuve/buses, remise en eau, équilibrage et rapport gestionnaire.",
  },

  // 8. Traitement choc piscine
  {
    label: "Traitement choc piscine",
    kind: "traitement_choc",
    title: "Traitement choc piscine",
    priceParticulier: 70,
    priceSyndic: 90,
    descParticulier:
      "Application traitement choc, remise en route filtration et rinçage après clarification.",
    descSyndic:
      "Traitement adapté, suivi filtration, analyse après traitement, rinçage filtre et rapport gestionnaire.",
  },

  // 9. Changement sable / charge filtre
  {
    label: "Changement sable / charge filtre",
    kind: "changement_sable",
    title: "Changement sable / charge filtre",
    priceParticulier: 300,
    priceSyndic: 360,
    descParticulier:
      "Vidange filtre, remplacement charge, rinçage et remise en service.",
    descSyndic:
      "Vidange complète, nettoyage cuve, contrôle crépines, remplacement charge, rinçage et rapport gestionnaire.",
  },

  // 10. Remplacement roulement pompe piscine
  {
    label: "Remplacement roulement pompe piscine",
    kind: "remplacement_roulement",
    title: "Remplacement roulement pompe piscine",
    priceParticulier: 180,
    priceSyndic: 220,
    descParticulier: "Remplacement roulements pompe.",
    descSyndic:
      "Démontage, extraction, remplacement roulement, remontage, test et rapport technicien.",
  },

  // 11. Remplacement pompe piscine 
  {
    label: "Remplacement pompe piscine ",
    kind: "remplacement_pompe_mo",
    title: "Remplacement pompe piscine",
    priceParticulier: 150,
    priceSyndic: 180,
    descParticulier: "Remplacement pompe",
    descSyndic:
      "Dépose/installation, raccordement, réglages et rapport technicien.",
  },

  // 12. Remplacement cellule électrolyseur
  {
    label: "Remplacement cellule électrolyseur",
    kind: "remplacement_cellule_mo",
    title: "Remplacement cellule électrolyseur",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier: "Remplacement cellule, contrôle étanchéité.",
    descSyndic:
      "Dépose/installation, test production, réglages, contrôle étanchéité et rapport.",
  },

  // 13. Nettoyage local technique
  {
    label: "Nettoyage local technique",
    kind: "nettoyage_local",
    title: "Nettoyage local technique",
    priceParticulier: 50,
    priceSyndic: 70,
    descParticulier:
      "Nettoyage local technique, dépoussiérage et contrôle humidité.",
    descSyndic:
      "Nettoyage complet, dégagement accès appareils, contrôle matériel, ventilation et rapport gestionnaire.",
  },

  // 14. Déplacement
  {
    label: "Déplacement",
    kind: "deplacement",
    title: "Déplacement",
    priceParticulier: 50,
    priceSyndic: 50,
    descParticulier: "Forfait déplacement.",
    descSyndic: "Forfait déplacement.",
  },

  // 15. Dépannage climatisation
  {
    label: "Dépannage climatisation",
    kind: "depannage_clim",
    title: "Diagnostic et dépannage climatisation",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier:
      "Diagnostic, tests électriques, vérification soufflage et remise en service si possible. Hors pièces.",
    descSyndic:
      "Diagnostic complet, contrôle composants, sécurités, soufflage et rapport gestionnaire. Hors pièces.",
  },

  // 16. Dépannage piscine
  {
    label: "Dépannage piscine",
    kind: "depannage_piscine",
    title: "Diagnostic et dépannage piscine",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier:
      "Diagnostic installation, filtration, pompe, vanne et accessoires. Hors pièces.",
    descSyndic:
      "Diagnostic complet : pompe, filtration, électrolyse, tests fuite/pression et rapport gestionnaire. Hors pièces.",
  },

  // 17. Dépannage jacuzzi
  {
    label: "Dépannage jacuzzi",
    kind: "depannage_jacuzzi",
    title: "Diagnostic et dépannage jacuzzi / spa",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier:
      "Diagnostic panne : pompe, chauffage, fuite, carte. Tests électriques et hydrauliques. Hors pièces.",
    descSyndic:
      "Diagnostic complet, tests électriques/hydrauliques, recherche fuite/défaut et rapport gestionnaire. Hors pièces.",
  },

  // 18. Produits
  {
    label: "Produits",
    kind: "produits",
    title: "",
    priceParticulier: 0,
    priceSyndic: 0,
    descParticulier: "",
    descSyndic: "",
  },

  // 19. Fournitures
  {
    label: "Fournitures",
    kind: "fournitures",
    title: "",
    priceParticulier: 0,
    priceSyndic: 0,
    descParticulier: "",
    descSyndic: "",
  },
];

/* ================== RAPPORTS (TEMPLATES) ================== */

const RAPPORT_TEMPLATES = [
  {
    id: "entretien_clim",
    label: "Entretien climatisation",
    showAnalysis: false,
    sections: [
      {
        title: "Unité intérieure",
        items: [
          "Nettoyage et désinfection des filtres",
          "Nettoyage des batteries (évaporateur)",
          "Nettoyage des turbines",
          "Nettoyage du carter / façade",
          "Vérification de l’écoulement des condensats",
          "Contrôle des fixations",
        ],
      },
      {
        title: "Unité extérieure",
        items: [
          "Nettoyage du condenseur",
          "Dépoussiérage complet",
          "Contrôle du ventilateur externe",
          "Contrôle des fixations et silentblocs",
          "Contrôle des liaisons frigorifiques",
        ],
      },
      {
        title: "Contrôles électriques & fonctionnement",
        items: [
          "Contrôle des connexions électriques",
          "Contrôle du serrage des borniers",
          "Vérification tensions / intensités",
          "Test des différents modes chaud / froid",
          "Mesure soufflage / reprise",
          "Test global de fonctionnement",
        ],
      },
    ],
  },
  {
    id: "depannage_clim",
    label: "Dépannage / diagnostic climatisation",
    showAnalysis: false,
    sections: [
      {
        title: "Constats & diagnostic",
        items: [
          "Prise en compte du problème signalé",
          "Contrôle visuel des unités intérieure et extérieure",
          "Lecture codes défauts / voyants",
          "Contrôle des flux d'air",
          "Recherche de bruits anormaux",
          "Contrôle de la température soufflée",
        ],
      },
      {
        title: "Tests électriques & composants",
        items: [
          "Contrôle de l’alimentation électrique",
          "Contrôle des protections / disjoncteurs",
          "Test du ventilateur",
          "Vérification du compresseur",
          "Vérification des sondes",
        ],
      },
      {
        title: "Actions réalisées",
        items: [
          "Remise à zéro du système",
          "Nettoyage partiel si nécessaire",
          "Correction du paramétrage",
          "Réparation / remplacement d’éléments",
          "Tests finaux de fonctionnement",
        ],
      },
      {
        title: "Recommandations",
        items: [
          "Conseils d'entretien",
          "Recommandation d'un entretien complet",
          "Conseils d'utilisation optimale",
        ],
      },
    ],
  },

  {
    id: "entretien_piscine",
    label: "Entretien piscine – visite",
    showAnalysis: true,
    sections: [
      {
        title: "Type de traitement",
        items: ["Piscine au chlore", "Piscine au sel"],
      },
      {
        title: "Préfiltration & skimmers",
        items: [
          "Nettoyage du panier de skimmer",
          "Nettoyage du panier de pompe",
          "Nettoyage du filtre de skimmer",
          "Contrôle du niveau d’eau",
        ],
      },
      {
        title: "Nettoyage du bassin",
        items: [
          "Épuisette surface",
          "Épuisette fond",
          "Brossage des parois",
          "Brossage ligne d’eau",
          "Passage aspirateur manuel / robot",
        ],
      },
      {
        title: "Filtration",
        items: [
          "Contrôle pression manomètre",
          "Contre-lavage du filtre (si sable)",
          "Rinçage filtre",
          "Nettoyage filtre cartouche (si applicable)",
          "Contrôle absence de fuites hydraulique",
        ],
      },
      {
        title: "Traitement & analyse",
        items: [
          "Mesure du pH",
          "Mesure du chlore libre / redox",
          "Correction du pH si nécessaire",
          "Correction du désinfectant si nécessaire",
          "Contrôle du stabilisant (si chlore)",
          "Contrôle du TAC",
          "Réglage électrolyseur (si piscine au sel)",
        ],
      },
      {
        title: "Local technique & sécurité",
        items: [
          "Contrôle visuel local technique",
          "Contrôle coffret électrique",
          "Contrôle programmation filtration",
          "Contrôle général de sécurité",
        ],
      },
    ],
  },

  {
    id: "traitement_choc",
    label: "Traitement choc piscine",
    showAnalysis: true,
    sections: [
      {
        title: "Préparation du bassin",
        items: [
          "Contrôle qualité d’eau avant traitement",
          "Nettoyage paniers skimmer",
          "Nettoyage panier pompe",
          "Épuisette surface / fond",
          "Brossage des parois",
        ],
      },
      {
        title: "Traitement choc",
        items: [
          "Ajout du produit choc (chlore / sel / oxygène actif)",
          "Ajout de floculant si nécessaire",
          "Augmentation temps de filtration",
          "Activation filtration manuelle",
        ],
      },
      {
        title: "Analyse & corrections",
        items: [
          "Contrôle du pH avant treatment",
          "Correction du pH",
          "Contrôle redox / chlore après traitement",
          "Contrôle salinité (si sel)",
        ],
      },
      {
        title: "Suivi",
        items: [
          "Conseils au client post-traitement",
          "Planification d’un contrôle de suivi si nécessaire",
        ],
      },
    ],
  },

  {
    id: "diagnostic_filtration",
    label: "Diagnostic filtration piscine",
    showAnalysis: false,
    sections: [
      {
        title: "Hydraulique générale",
        items: [
          "Contrôle circulation eau",
          "Contrôle refoulements / skimmers",
          "Recherche de fuites hydrauliques",
          "Contrôle des niveaux",
        ],
      },
      {
        title: "Préfiltre & aspiration",
        items: [
          "Vérification panier pompe",
          "Contrôle étanchéité du couvercle",
          "Contrôle tuyauterie aspiration",
          "Recherche prise d’air éventuelle",
        ],
      },
      {
        title: "Filtration",
        items: [
          "Contrôle pression manomètre",
          "Évaluation état du média filtrant",
          "Contrôle crépines (si possible)",
          "Contrôle filtre cartouche (si applicable)",
          "Contrôle vanne 6 voies",
          "Contrôle absence de fuites",
        ],
      },
      {
        title: "Pompe de filtration",
        items: [
          "Contrôle bruit / vibration",
          "Contrôle débit",
          "Contrôle présence bulles d’air",
          "Vérification amorçage",
        ],
      },
      {
        title: "Équipements annexes",
        items: [
          "Contrôle électrolyseur",
          "Contrôle régulation pH",
          "Contrôle PAC (si présente)",
          "Contrôle coffret électrique",
        ],
      },
      {
        title: "Recommandations",
        items: [
          "Actions suggérées au client",
          "Remplacement / entretien recommandé",
          "Conseils sécurité / usage",
        ],
      },
    ],
  },

  {
    id: "depannage_piscine",
    label: "Dépannage piscine",
    showAnalysis: false,
    sections: [
      {
        title: "Constat & premiers contrôles",
        items: [
          "Prise en compte du problème signalé",
          "Contrôle local technique",
          "Analyse bruit / vibration",
          "Contrôle coffret électrique",
        ],
      },
      {
        title: "Recherche de panne",
        items: [
          "Contrôle pompe filtration",
          "Contrôle absence de fuite",
          "Contrôle vanne 6 voies",
          "Contrôle pression filtre",
          "Tests aspiration / refoulement",
        ],
      },
      {
        title: "Actions réalisées",
        items: [
          "Purge de l’air",
          "Nettoyage préfiltre",
          "Réparation hydraulique mineure",
          "Correction câblage / connexion",
          "Remplacement élément défectueux",
        ],
      },
      {
        title: "Recommandations",
        items: [
          "Conseils d’usage",
          "Avertissement sur usure",
          "Recommandation d’un entretien régulier",
        ],
      },
    ],
  },

  {
    id: "remplacement_roulements",
    label: "Remplacement roulements pompe",
    showAnalysis: false,
    sections: [
      {
        title: "Dépose ancienne pompe",
        items: [
          "Coupure alimentation",
          "Déconnexion hydraulique",
          "Déconnexion électrique",
          "Démontage pompe / moteur",
        ],
      },
      {
        title: "Remplacement des roulements",
        items: [
          "Extraction des anciens roulements",
          "Nettoyage arbre moteur",
          "Mise en place nouveaux roulements",
          "Graissage si nécessaire",
        ],
      },
      {
        title: "Remontage & tests",
        items: [
          "Remontage moteur",
          "Raccordements hydrauliques",
          "Raccordements électriques",
          "Test en charge",
          "Contrôle absence de vibration",
          "Contrôle absence de fuite",
        ],
      },
    ],
  },

  {
    id: "remplacement_pompe",
    label: "Remplacement pompe filtration",
    showAnalysis: false,
    sections: [
      {
        title: "Dépose ancienne pompe",
        items: [
          "Coupure alimentation",
          "Vidange partielle si nécessaire",
          "Démontage raccords hydrauliques",
          "Déconnexion électrique",
        ],
      },
      {
        title: "Installation nouvelle pompe",
        items: [
          "Mise en place pompe neuve",
          "Alignement et réglages",
          "Collage / raccordement PVC",
          "Branchement électrique",
          "Sécurisation installation",
        ],
      },
      {
        title: "Essais",
        items: [
          "Mise en route installation",
          "Contrôle débit",
          "Contrôle fuite / suintement",
          "Contrôle bruit / vibration",
          "Contrôle fonctionnement filtration",
        ],
      },
    ],
  },

  {
    id: "travaux_pvc",
    label: "Travaux PVC / Local technique",
    showAnalysis: false,
    sections: [
      {
        title: "Dépose & préparation",
        items: [
          "Vidange partielle installation",
          "Découpe PVC existant",
          "Nettoyage zone de travail",
          "Mise en sécurité",
        ],
      },
      {
        title: "Pose & collage PVC",
        items: [
          "Mise en place nouvelles vannes / raccords",
          "Collage PVC sous pression",
          "Respect temps de séchage",
          "Mise en pression progressive",
        ],
      },
      {
        title: "Ventilation / aménagement local",
        items: [
          "Installation grille / extracteur d’air",
          "Aération améliorée du local technique",
          "Nettoyage & organisation local",
          "Contrôle sécurité électrique",
        ],
      },
      {
        title: "Tests finaux",
        items: [
          "Contrôle absence de fuite",
          "Contrôle circulation eau",
          "Validation fonctionnement complet",
        ],
      },
    ],
  },

  {
    id: "entretien_jacuzzi",
    label: "Entretien jacuzzi / spa",
    showAnalysis: false,
    sections: [
      {
        title: "Nettoyage & entretien courant",
        items: [
          "Nettoyage de la ligne d’eau",
          "Nettoyage de la cuve",
          "Nettoyage du couvercle / capot",
          "Nettoyage des filtres",
          "Nettoyage des repose-têtes",
        ],
      },
      {
        title: "Hydromassage & circulation",
        items: [
          "Contrôle fonctionnement buses hydromassage",
          "Contrôle pompe de circulation",
          "Contrôle absence de fuites",
          "Contrôle niveau d’eau",
        ],
      },
      {
        title: "Traitement & désinfection",
        items: [
          "Mesure pH",
          "Correction pH",
          "Traitement désinfectant (chlore / brome)",
          "Ajout produit anti-calcaire / clarifiant si nécessaire",
        ],
      },
      {
        title: "Contrôles techniques",
        items: [
          "Contrôle tableau de commande",
          "Contrôle chauffage",
          "Contrôle capteurs / sondes",
          "Contrôle éclairage",
        ],
      },
    ],
  },
  {
    id: "vidange_jacuzzi",
    label: "Vidange + nettoyage jacuzzi",
    showAnalysis: false,
    sections: [
      {
        title: "Vidange & préparation",
        items: [
          "Arrêt installation",
          "Vidange complète du spa",
          "Vidange canalisations si nécessaire",
          "Nettoyage complet de la cuve",
          "Nettoyage ligne d’eau",
        ],
      },
      {
        title: "Entretien & remise en eau",
        items: [
          "Nettoyage filtres",
          "Remplissage du spa",
          "Purge circulation eau",
          "Traitement désinfectant initial",
          "Réglage température",
        ],
      },
      {
        title: "Contrôles finaux",
        items: [
          "Test fonctionnement hydromassage",
          "Test pompe de circulation",
          "Test chauffage",
          "Test éclairage",
        ],
      },
    ],
  },
  {
    id: "installation_electrolyseur",
    label: "Installation électrolyseur au sel",
    showAnalysis: false,
    sections: [
      {
        title: "Préparation installation",
        items: [
          "Dépose ancienne cellule si présente",
          "Nettoyage zone de travail",
          "Découpe PVC existant",
          "Mise en sécurité électrique",
        ],
      },
      {
        title: "Pose électrolyseur",
        items: [
          "Installation nouvelle cellule",
          "Raccordements PVC",
          "Collage et séchage",
          "Branchement électrique sécurisée",
          "Paramétrage de la production",
        ],
      },
      {
        title: "Tests & réglages",
        items: [
          "Test de production de chlore",
          "Contrôle absence de fuite",
          "Contrôle circulation eau",
          "Réglage horloge / mode boost",
          "Explication de fonctionnement au client",
        ],
      },
    ],
  },
  {
    id: "installation_pompe_pac",
    label: "Installation pompe + PAC",
    showAnalysis: false,
    sections: [
      {
        title: "Dépose ancien matériel",
        items: [
          "Coupure alimentation",
          "Vidange partielle installation",
          "Dépose ancienne pompe",
          "Déconnexion hydraulique et électrique",
        ],
      },
      {
        title: "Installation nouvelle pompe",
        items: [
          "Installation pompe neuve",
          "Alignement et niveau",
          "Raccordements PVC",
          "Branchement électrique",
          "Contrôle débit",
        ],
      },
      {
        title: "Installation PAC",
        items: [
          "Installation PAC à l’extérieur",
          "Raccordements hydrauliques By-pass",
          "Raccordements électriques",
          "Mise en service PAC",
          "Contrôle montée en température",
        ],
      },
      {
        title: "Tests finaux",
        items: [
          "Contrôle absence de fuite",
          "Contrôle bruit / vibration",
          "Contrôle fonctionnement global",
          "Explication client",
        ],
      },
    ],
  },
];

const MARGIN_MULTIPLIER = 1.4;
// ================== VARIABLES GLOBALES ==================

let currentDocumentId = null;
let prestationCount = 0;
let currentListType = "devis"; // "devis", "facture" ou "contrat"
// Source éventuelle d'une attestation (facture liée)
let currentAttestationSource = null;

// Firebase Firestore
let db = null;
let unsubDocs = null;
let unsubContracts = null;
let unsubClients = null;
let manualPlanningItems = [];
let editingManualPlanningId = null;
let contractPlanningOverrides = [];

// ================== OFFLINE / SYNC QUEUE ==================

const SYNC_QUEUE_KEY = "acp_sync_queue_v1";
const DEVICE_ID_KEY = "acp_device_id_v1";


function getSyncQueue() {
  try {
    return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || "[]");
  } catch (e) {
    console.error("Queue sync corrompue :", e);
    localStorage.removeItem(SYNC_QUEUE_KEY);
    return [];
  }
}

function saveSyncQueue(queue) {
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue || []));
  } catch (e) {
    console.error("Erreur save sync queue :", e);
  }
}

function enqueueSync(op) {
  const queue = getSyncQueue();
  queue.push({
    ...op,
    ts: Date.now(),
  });
  saveSyncQueue(queue);
  updateOfflineBadge();
}

/**
 * Met à jour le badge en bas à droite
 */
function updateOfflineBadge() {
  const badge = document.getElementById("offlineBadge");
  if (!badge) return;

  const queue = getSyncQueue();
  const pending = queue.length;
  const online = navigator.onLine;

  if (!online) {
    badge.textContent = "Hors ligne – données en local";
    badge.className = "offline-badge offline";
    badge.style.display = "flex";
    return;
  }

  if (pending > 0) {
    badge.textContent = `Synchronisation en attente (${pending})…`;
    badge.className = "offline-badge syncing";
    badge.style.display = "flex";
    return;
  }

  // tout est OK → petit message puis on masque
  badge.textContent = "✅ Données synchronisées";
  badge.className = "offline-badge online";
  badge.style.display = "flex";

  setTimeout(() => {
    badge.style.display = "none";
  }, 2000);
}

/**
 * Rejoue la file d’attente vers Firestore
 */
async function processSyncQueue() {
  if (!db || !navigator.onLine) {
    updateOfflineBadge();
    return;
  }

  let queue = getSyncQueue();
const queueSnapshot = queue.slice(); // copie pour backup

  if (!queue.length) {
    updateOfflineBadge();
    return;
  }

  const stillPending = [];

  for (const op of queue) {
    try {
      const colRef = db.collection(op.collection);
      if (op.action === "set") {
        await colRef.doc(op.docId).set(op.data, { merge: true });
      } else if (op.action === "delete") {
        await colRef.doc(op.docId).delete();
      }
      // ok, on ne le remet pas
    } catch (e) {
      console.error("Erreur sync op Firestore :", op, e);
      stillPending.push(op); // restera en attente
    }
  }

  saveSyncQueue(stillPending);

// ✅ Backup cloud de la queue (audit) quand on est online
try {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = "dev-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  // On log seulement si on avait des ops
  if (queueSnapshot.length) {
    const logId = deviceId + "-" + Date.now();
    await db.collection("syncOutbox").doc(logId).set({
      id: logId,
      deviceId,
      createdAt: new Date().toISOString(),
      totalOps: queueSnapshot.length,
      failedOps: stillPending.length,
      ops: queueSnapshot,
    }, { merge: true });
  }
} catch (e) {
  console.warn("Backup syncOutbox impossible:", e);
}

  updateOfflineBadge();
}

/// ================== FIREBASE / SYNC ==================

async function initFirebase() {
  if (!window.firebase) {
    console.error("Firebase non disponible");
    return;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyDLrNwmfmbpmGkJYdswlOP3qSgFMbCjy0k",
    authDomain: "aquaclim-prestige-e70d6.firebaseapp.com",
    projectId: "aquaclim-prestige-e70d6",
    storageBucket: "aquaclim-prestige-e70d6.firebasestorage.app",
    messagingSenderId: "305566055348",
    appId: "1:305566055348:web:175c174c115ca457bd50e1",
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  db = firebase.firestore();

  // ✅ Offline persistence (cache IndexedDB) — sans multi-onglet
  try {
    await db.enablePersistence(); // <-- sans synchronizeTabs
    console.log("[Firestore] Persistence ENABLED");
  } catch (e) {
    console.warn("[Firestore] Persistence not enabled:", e?.code || e);
  }

// =================== SETTINGS (company) ===================
db.collection("config").doc("companySettings").onSnapshot((doc) => {
  const data = doc.exists ? doc.data() : null;
  if (!data) return;

  localStorage.setItem("acp_company_settings_v1", JSON.stringify(data));

  applyCompanySettingsToUI(data);
  fillCompanySettingsForm();

  // ✅ TVA toujours recalculée depuis le CA (pas imposée par le cache/settings)
  if (typeof refreshMicroTVAState === "function") {
    refreshMicroTVAState(false);
  }
});



// =================== PLANNING MANUEL ===================
db.collection("planningManual").onSnapshot((snap) => {
  const arr = [];
  snap.forEach((d) => arr.push(d.data()));
  manualPlanningItems = arr;

  // cache local (optionnel)
  localStorage.setItem("manualPlanningItems", JSON.stringify(arr));

  try { renderPlanningWeek(); } catch(e) {}
  try { renderPlanningSidebar(); } catch(e) {}
});

// =================== OVERRIDES CONTRATS ===================
db.collection("contractPlanningOverrides").onSnapshot((snap) => {
  const arr = [];
  snap.forEach((d) => arr.push(d.data()));
  contractPlanningOverrides = arr;

  // cache local (optionnel)
  localStorage.setItem("contractPlanningOverrides", JSON.stringify(arr));

  try { renderPlanningWeek(); } catch(e) {}
});


// =================== ATTESTATIONS (LIVE) ===================
db.collection("attestations").onSnapshot((snap) => {
  const arr = [];
  snap.forEach((d) => arr.push(d.data()));

  // Firestore = vérité -> on écrase le local
  localStorage.setItem("attestations", JSON.stringify(arr));

  try { if (typeof loadAttestationsList === "function") loadAttestationsList(); } catch(e) {}
  updateOfflineBadge();
});

// =================== RAPPORTS (LIVE) ===================
db.collection("rapports").onSnapshot((snap) => {
  const arr = [];
  snap.forEach((d) => arr.push(d.data()));

  // Firestore = vérité -> on écrase le local
  localStorage.setItem("rapports", JSON.stringify(arr));

  try { if (typeof loadRapportsList === "function") loadRapportsList(); } catch(e) {}
  updateOfflineBadge();
});



  // ✅ Bind online/offline listeners une seule fois
  if (!window.__netListenersBound) {
    window.__netListenersBound = true;

    window.addEventListener("online", () => {
      updateOfflineBadge();
      if (typeof processSyncQueue === "function") processSyncQueue();
    });

    window.addEventListener("offline", () => {
      updateOfflineBadge();
    });
  }

  try {
    // 1️⃣ LIVE DOCUMENTS (devis / factures)
    if (unsubDocs) unsubDocs();
    unsubDocs = db.collection("documents").onSnapshot(
      (snapshot) => {
        const cloudDocs = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data) cloudDocs.push(data);
        });

        localStorage.setItem("documents", JSON.stringify(cloudDocs));

        // ⚠️ mets un guard si jamais sanitizeManualPlanningItems n’existe pas
        if (typeof sanitizeManualPlanningItems === "function") {
          sanitizeManualPlanningItems();
        }

        // 🔄 UI refresh (documents)
        if (typeof loadDocumentsList === "function") loadDocumentsList();
        if (typeof loadYearFilter === "function") loadYearFilter();
        if (typeof refreshHomeStats === "function") refreshHomeStats();
        if (typeof computeCA === "function") computeCA();
        if (typeof refreshMicroTVAState === "function") refreshMicroTVAState(false);

        updateOfflineBadge();
      },
      (err) => console.error("Erreur onSnapshot documents :", err)
    );

    // 2️⃣ LIVE CONTRATS
    if (typeof syncContractsWithFirestore === "function") {
      await syncContractsWithFirestore();
    }

    // 3️⃣ LIVE CLIENTS
    if (typeof syncClientsWithFirestore === "function") {
      await syncClientsWithFirestore();
    }
  } catch (e) {
    console.error("Erreur de synchronisation Firestore :", e);
  }

  // Badge + queue
  updateOfflineBadge();
if (navigator.onLine && typeof processSyncQueue === "function") {
  await processSyncQueue();
}

}


// ================== GESTION CLIENTS ==================
function getClients() {
  try {
    return JSON.parse(localStorage.getItem("clients") || "[]");
  } catch (e) {
    return [];
  }
}

// Génère un ID stable basé sur nom + adresse
function getClientDocId(client) {
  const name = (client.name || "").toLowerCase().trim();
  const address = (client.address || "").toLowerCase().trim();

  let base = (name + "_" + address).replace(/[^a-z0-9]+/g, "_");
  base = base.replace(/^_+|_+$/g, "");

  if (!base) base = "client_" + Date.now().toString();

  return base;
}

function saveClients(list) {
  try {
    localStorage.setItem("clients", JSON.stringify(list || []));
  } catch (e) {}
}

// Recharge la datalist des clients (devis + contrats)
function refreshClientDatalist() {
  const clients = getClients();

  // 🔤 Tri alphabétique
  clients.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const list = document.getElementById("clientsList");
  if (!list) return;

  list.innerHTML = "";

  clients.forEach((c) => {
    if (!c.name) return;
    const opt = document.createElement("option");
    opt.value = c.name;
    list.appendChild(opt);
  });
}

// ================== FICHE CLIENT (POPUP 360) ==================

function _normName(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function _escapeHtml(str) {
  return (str || "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function _fmtEUR(n) {
  const x = Number(n || 0);
  if (!isFinite(x)) return "0,00 €";
  return x.toFixed(2).replace(".", ",") + " €";
}

function _fmtDateFRSafe(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("fr-FR");
  } catch (e) {}
  return String(iso);
}

function withDeOrDApostrophe(word) {
  if (!word) return "";
  return /^[aeiouhàâéèêëîïôùûü]/i.test(word)
    ? "d’" + word
    : "de " + word;
}


function _getClientByName(name) {
  const n = _normName(name);
  if (!n) return null;
  const clients = getClients();
  return clients.find((c) => _normName(c.name) === n) || null;
}

function _getDocsByClientName(name) {
  const n = _normName(name);
  if (!n) return [];
  return (getAllDocuments() || []).filter(
    (d) => _normName(d?.client?.name) === n,
  );
}

function _getContractsByClientName(name) {
  const n = _normName(name);
  if (!n) return [];
  return (getAllContracts() || []).filter(
    (c) => _normName(c?.client?.name) === n,
  );
}

function closeClientSheet() {
  const el = document.getElementById("clientSheetOverlay");
  if (el) el.remove();
}
function _cleanPhoneForTel(phone) {
  return (phone || "")
    .toString()
    .trim()
    .replace(/[.\-\s]/g, "");
}

function openGoogleMapsItinerary(address) {
  const a = (address || "").toString().trim();
  if (!a) return;

  if (!navigator.geolocation) {
    // fallback simple
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=My+Location` +
      `&destination=${encodeURIComponent(a)}` +
      `&travelmode=driving`;
    openExternalLink(url);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${encodeURIComponent(origin)}` +
        `&destination=${encodeURIComponent(a)}` +
        `&travelmode=driving`;
      openExternalLink(url);
    },
    () => {
      // si le GPS refuse → fallback "My Location"
      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=My+Location` +
        `&destination=${encodeURIComponent(a)}` +
        `&travelmode=driving`;
      openExternalLink(url);
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}



function _normalizePhoneForWA(phone) {
  if (!phone) return "";
  let p = String(phone)
    .trim()
    .replace(/[.\-\s]/g, "");
  if (p.startsWith("0")) p = "33" + p.slice(1);
  p = p.replace(/^\+/, "");
  return p;
}


// Calcule le retard en mois (basé sur date d'échéance réelle)
// ✅ Particulier : date facture + délai
// ✅ Syndic/Agence : 30 jours fin de mois + délai

function _lateMonthsFromInvoiceDate(fOrDate, delaiJours = 30) {
  let due = null;

  // Si on passe une facture complète -> on peut appliquer la vraie règle syndic
  if (fOrDate && typeof fOrDate === "object") {
    due = _dueDateFromInvoice(fOrDate, delaiJours);
  } else {
    // fallback : si on passe juste une date ISO
    const invoiceDateISO = fOrDate;
    if (!invoiceDateISO) return 0;
    const invDate = new Date(invoiceDateISO);
    if (isNaN(invDate.getTime())) return 0;

    due = new Date(invDate);
    due.setDate(due.getDate() + delaiJours);
    due.setHours(0, 0, 0, 0);
  }

  if (!due) return 0;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - due.getTime();
  if (diffMs <= 0) return 0;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(diffDays / 30));
}

/** ✅ Enregistre une relance dans la facture (meta.relances[]) */
function _addRelanceToInvoice(invoiceNumber, canal) {
  const docs = getAllDocuments() || [];
  const idx = docs.findIndex(
    (d) => d.type === "facture" && d.number === invoiceNumber,
  );
  if (idx < 0) return;

  const f = docs[idx];
  f.meta = f.meta || {};
  f.meta.relances = Array.isArray(f.meta.relances) ? f.meta.relances : [];

  f.meta.relances.push({
    date: new Date().toISOString().slice(0, 10),
    canal,
  });

  if (typeof saveDocuments === "function") {
    saveDocuments(docs);
  } else if (typeof saveAllDocuments === "function") {
    saveAllDocuments(docs);
  }
}

/** ✅ Ajoute l'indemnité forfaitaire 40€ (L441-10) UNE SEULE FOIS */
function _addIndemnite40(invoiceNumber) {
  const docs = getAllDocuments() || [];
  const idx = docs.findIndex(
    (d) => d.type === "facture" && d.number === invoiceNumber,
  );
  if (idx < 0) return;

  const f = docs[idx];

  f.prestations = Array.isArray(f.prestations) ? f.prestations : [];

  const already = f.prestations.some(
    (p) => p.kind === "indemnite_40" || p.code === "INDEMNITE_40",
  );
  if (already) return;

  // ===============================
  // 1️⃣ AJOUT IMMÉDIAT DANS L’UI
  // ===============================
  if (
    currentDocumentId === f.id &&
    typeof _ensureIndemnite40InFormUI === "function"
  ) {
    _ensureIndemnite40InFormUI(); // 👈 C'EST ÇA LA CLÉ
  }

  // ===============================
  // 2️⃣ AJOUT DANS LES DONNÉES
  // ===============================
  f.prestations.push({
    code: "INDEMNITE_40",
    kind: "indemnite_40",
    desc: "Indemnité forfaitaire (art. L441-10 C. commerce)",
    detail: "Indemnité forfaitaire de 40 € pour frais de recouvrement",
    qty: 1,
    price: 40,
    total: 40,
    unit: "forfait",
    dates: [],
  });

  delete f.subtotal;
  delete f.totalTTC;

  // ===============================
  // 3️⃣ SAUVEGARDE
  // ===============================
  if (typeof saveDocuments === "function") {
    saveDocuments(docs);
  } else if (typeof saveAllDocuments === "function") {
    saveAllDocuments(docs);
  }
}

/** ✅ Message auto selon retard + texte légal */
function _buildRelanceMessageAuto({
  factureNumber,
  factureDate,
  amountTTC,
  lateMonths,
}) {
  const dateFR = _fmtDateFRSafe(factureDate);
  const montant = _fmtEUR(amountTTC);

  // Relance 1
  if (lateMonths < 1) {
    return `Bonjour,

Sauf erreur de notre part, la facture ${factureNumber || ""} du ${dateFR}, d’un montant de ${montant}, arrivée à échéance, reste impayée à ce jour.

Merci de nous indiquer la date prévue de règlement.
Je reste disponible si vous avez besoin du RIB.

Cordialement,
Loïc – AquaClim Prestige`;
  }

  // Relance 2
  if (lateMonths < 2) {
    return `Bonjour,

Malgré notre précédente relance, la facture ${factureNumber || ""} du ${dateFR}, d’un montant de ${montant}, reste impayée.

Merci de procéder au règlement dans les meilleurs délais, conformément à nos conditions de règlement (30 jours fin de mois).
Je reste disponible si vous avez besoin du RIB.

Cordialement,
Loïc – AquaClim Prestige`;
  }

  // Relance 3+
  return `Bonjour,

La facture ${factureNumber || ""} du ${dateFR}, d’un montant de ${montant}, demeure impayée malgré nos relances.

Conformément à l’article L441-10 du Code de commerce, des pénalités de retard ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement sont applicables.

Merci de régulariser la situation sous 7 jours.
Je reste disponible si vous avez besoin du RIB.

Cordialement,
Loïc – AquaClim Prestige`;
}

function openClientSheet(name) {
  const n = (name || "").trim();
  if (!n) {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Fiche client",
        message: "Aucun nom client.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️",
      });
    }
    return;
  }

  const client = _getClientByName(n);
  const docsAll = _getDocsByClientName(n);
  const contratsAll = _getContractsByClientName(n);

  const factures = docsAll.filter((d) => d.type === "facture");
  const impayees = factures.filter((f) => !f.paid);

  const caTTC = factures.reduce((sum, f) => sum + Number(f.totalTTC || 0), 0);
  const impayesTTC = impayees.reduce(
    (sum, f) => sum + Number(f.totalTTC || 0),
    0,
  );

  const lastFactures = [...factures]
    .sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return db - da;
    })
    .slice(0, 10);

  const contratsSorted = [...contratsAll].sort((a, b) => {
    const da = new Date(a?.pricing?.startDate || 0).getTime();
    const db = new Date(b?.pricing?.startDate || 0).getTime();
    return db - da;
  });

  const address = client?.address || "";
  const phone = client?.phone || "";
  const email = client?.email || "";
  const type = client?.type || client?.clientType || "";
const privateNotes = client?.privateNotes || "";


  const html = `
<div id="clientSheetOverlay" class="popup-overlay">
  <div style="
    width: min(980px, 100%); max-height: 92vh; overflow: auto;
    background: #fff; border-radius: 14px; box-shadow: 0 10px 40px rgba(0,0,0,.25);
    padding: 16px;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  ">
    <div style="display:flex; gap:12px; align-items:center; justify-content:space-between;">
      <div>
        <div style="font-size: 20px; font-weight: 800;">Fiche client — ${_escapeHtml(n)}</div>
    <div style="opacity:.75; margin-top:2px;">
  ${
    address
      ? `<a
           href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}"
           target="_blank"
           style="text-decoration:none;color:#1f6fe5;font-weight:700;"
           title="Ouvrir l’itinéraire Google Maps"
         >📍 ${_escapeHtml(address)}</a>`
      : ""
  }
  ${type ? " • " + _escapeHtml(type) : ""}
</div>


        <div style="margin-top:6px; display:flex; gap:10px; flex-wrap:wrap;">
         ${phone ? `<a style="text-decoration:none;font-weight:700;" href="tel:${_cleanPhoneForTel(phone)}" title="Appeler le client">📞 ${_escapeHtml(phone)}</a>` : ""}

          ${email ? `<a style="text-decoration:none;" href="mailto:${_escapeHtml(email)}">✉️ ${_escapeHtml(email)}</a>` : ""}
          ${phone ? `<a style="text-decoration:none;" target="_blank" href="https://wa.me/${encodeURIComponent(String(phone).replaceAll(" ", "").replaceAll(".", "").replaceAll("-", "").replaceAll("+", ""))}">💬 WhatsApp</a>` : ""}
        </div>
      </div>

<div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
  <button class="btn btn-primary btn-small" type="button"
          onclick="createDocForClient('devis', decodeURIComponent('${encodeURIComponent(n)}'))"
>
    ➕ Créer devis
  </button>

  <button class="btn btn-success btn-small" type="button"
     onclick="createDocForClient('facture', decodeURIComponent('${encodeURIComponent(n)}'))"
    ➕ Créer facture
  </button>

  <button class="btn btn-secondary btn-small" type="button"
       onclick="openPlanningForClient(decodeURIComponent('${encodeURIComponent(n)}'))"
    🗓️ Ouvrir planning client
  </button>
</div>


      <button id="clientSheetCloseBtn" style="
        border:0; background:#1f6fe5; color:#fff; padding:10px 12px;
        border-radius:10px; cursor:pointer; font-weight:700;
      ">Fermer</button>
    </div>

    <div style="display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; margin-top: 14px;">
      <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
        <div style="opacity:.7; font-size:12px;">CA facturé (TTC)</div>
        <div style="font-size:22px; font-weight:900; margin-top:4px; color:#1e7f43;">
          ${_fmtEUR(caTTC)}
        </div>
      </div>

      <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
        <div style="opacity:.7; font-size:12px;">Impayés (TTC)</div>
        <div style="font-size:22px; font-weight:900; margin-top:4px; color:#c62828;">
          ${_fmtEUR(impayesTTC)}
        </div>
        <div style="opacity:.75; margin-top:2px;">
          ${impayees.length} facture(s)
        </div>
      </div>

      <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
        <div style="opacity:.7; font-size:12px;">Contrats liés</div>
        <div style="font-size:22px; font-weight:900; margin-top:4px;">
          ${contratsAll.length}
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap: 12px; margin-top: 12px;">
      <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
        <div style="font-weight:800; margin-bottom: 8px;">Dernières factures</div>

        ${
          lastFactures.length
            ? `
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${lastFactures
              .map((f) => {
                const isPaid = !!f.paid;
                const delai =
                  typeof DELAI_REGLEMENT_JOURS !== "undefined"
                    ? DELAI_REGLEMENT_JOURS
                    : 30;
                const lateMonths = isPaid
                  ? 0
                  : _lateMonthsFromInvoiceDate(f.date, delai);
                const statusColor = isPaid ? "#1e7f43" : "#c62828";
                const bg = isPaid ? "transparent" : "rgba(198,40,40,0.05)";
                return `
                <div style="
                  display:flex; justify-content:space-between; gap:12px;
                  border-bottom:1px dashed #eee; padding:8px; border-radius:8px;
                  background:${bg}; align-items:center;
                ">
                  <div style="min-width:0;">
                    <div style="font-weight:800;">
                      ${_escapeHtml(f.number || "Facture")}
                    </div>

                    <div style="font-size:12px; margin-top:3px; font-weight:700; color:${statusColor};">
                      ${_fmtDateFRSafe(f.date)} • ${isPaid ? "✔ payée" : "✖ impayée"}
                      ${
                        !isPaid && lateMonths > 0
                          ? `
                        <span style="
                          margin-left:8px; display:inline-block; padding:2px 8px;
                          border-radius:999px; font-weight:800; font-size:11px;
                          color:#c62828; border:1px solid rgba(198,40,40,.25);
                          background: rgba(198,40,40,.08);
                        ">
                          ${lateMonths} mois de retard
                        </span>
                      `
                          : ``
                      }
                    </div>
                  </div>

                  <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
                    <div style="font-weight:900; white-space:nowrap; color:${statusColor};">
                      ${_fmtEUR(f.totalTTC)}
                    </div>

                    ${
                      !isPaid
                        ? `
                      <button
                        class="btn btn-primary btn-small"
                        type="button"
                        data-relance="1"
                        data-client="${_escapeHtml(n)}"
                        data-number="${_escapeHtml(f.number || "")}"
                        data-date="${_escapeHtml(f.date || "")}"
                        data-amount="${_escapeHtml(f.totalTTC || 0)}"
                        data-latemonths="${_escapeHtml(lateMonths)}"
                        data-phone="${_escapeHtml(phone || "")}"
                        data-email="${_escapeHtml(email || "")}"
                      >💬 Relancer</button>

                      <button
                        class="btn btn-danger btn-small"
                        type="button"
                        data-indemnite="40"
                        data-number="${_escapeHtml(f.number || "")}"
                      >➕ 40 €</button>
                    `
                        : ``
                    }
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        `
            : `
          <div style="opacity:.7;">Aucune facture trouvée pour ce client.</div>
        `
        }
      </div>

      <div style="border:1px solid #eee; border-radius:12px; padding:12px;">
        <div style="font-weight:800; margin-bottom: 8px;">Contrats</div>
        ${
          contratsSorted.length
            ? `
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${contratsSorted
              .slice(0, 8)
              .map((c) => {
                const ref = c?.client?.reference || c?.id || "Contrat";
                const start = c?.pricing?.startDate || "";
                const endLabel = c?.pricing?.endDateLabel || "";
                const total = c?.pricing?.totalTTC;
                return `
                <div style="border-bottom:1px dashed #eee; padding-bottom:6px;">
                  <div style="font-weight:700;">${_escapeHtml(ref)}</div>
                  <div style="opacity:.7; font-size:12px;">
                    Début: ${_fmtDateFRSafe(start)} ${endLabel ? "• " + _escapeHtml(endLabel) : ""}
                  </div>
                  ${total != null ? `<div style="font-weight:800; margin-top:2px;">${_fmtEUR(total)}</div>` : ""}
                </div>
              `;
              })
              .join("")}
          </div>
        `
            : `<div style="opacity:.7;">Aucun contrat trouvé.</div>`
        }
      </div>
    </div>
  </div>
</div>
  `;

  closeClientSheet();
  document.body.insertAdjacentHTML("beforeend", html);

  // ---------- Bind: fermer ----------
  const btnClose = document.getElementById("clientSheetCloseBtn");
  if (btnClose) btnClose.addEventListener("click", closeClientSheet);

  const overlay = document.getElementById("clientSheetOverlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeClientSheet();
    });
  }

  // ---------- Bind: indemnité 40€ ----------
  document
    .querySelectorAll('#clientSheetOverlay [data-indemnite="40"]')
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const invoiceNumber = btn.getAttribute("data-number") || "";
        if (!invoiceNumber) return;

        showConfirmDialog({
          title: "Ajouter l’indemnité 40 € ?",
          message:
            "Ajouter l’indemnité forfaitaire de 40 € (art. L441-10) sur cette facture ?",
          confirmLabel: "Ajouter",
          cancelLabel: "Annuler",
          variant: "danger",
          icon: "⚠️",
          onConfirm: () => {
            _addIndemnite40(invoiceNumber);
            showConfirmDialog({
              title: "Indemnité ajoutée",
              message: "La ligne de 40 € a été ajoutée à la facture.",
              confirmLabel: "OK",
              cancelLabel: "",
              variant: "success",
              icon: "✅",
            });
          },
        });
      });
    });

  // ---------- Bind: relance ----------
  document
    .querySelectorAll('#clientSheetOverlay [data-relance="1"]')
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const invoiceNumber = btn.getAttribute("data-number") || "";
        const invoiceDate = btn.getAttribute("data-date") || "";
        const amountTTC = Number(btn.getAttribute("data-amount") || 0);
        const lateMonths = Number(btn.getAttribute("data-latemonths") || 0);

        const phoneBtn = btn.getAttribute("data-phone") || "";
        const emailBtn = btn.getAttribute("data-email") || "";

        const hasPhone = !!phoneBtn.trim();
        const hasEmail = !!emailBtn.trim();

        const message = _buildRelanceMessageAuto({
          factureNumber: invoiceNumber,
          factureDate: invoiceDate,
          amountTTC,
          lateMonths,
        });

        // aucun contact => copier
        if (!hasPhone && !hasEmail) {
          if (navigator.clipboard?.writeText)
            navigator.clipboard.writeText(message);
          showConfirmDialog({
            title: "Relance copiée",
            message:
              "Aucun téléphone/email pour ce client. Le message a été copié, tu peux le coller où tu veux.",
            confirmLabel: "OK",
            cancelLabel: "",
            variant: "info",
            icon: "📋",
          });
          return;
        }

        showConfirmDialog({
          title: "Relancer le client",
          message: "Comment souhaitez-vous relancer ce client ?",
          confirmLabel: "💬 WhatsApp",
          cancelLabel: "✉️ Email",
          variant: "info",
          icon: "📨",
          showCloseButton: true,
          onConfirm: () => {
            const wa = _normalizePhoneForWA(phoneBtn);
            if (!wa) {
              showConfirmDialog({
                title: "WhatsApp indisponible",
                message: "Aucun numéro WhatsApp valide pour ce client.",
                confirmLabel: "OK",
                cancelLabel: "",
                variant: "warning",
                icon: "⚠️",
              });
              return;
            }

            _addRelanceToInvoice(invoiceNumber, "whatsapp");
            const url = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;
            openExternalLink(url);
  
          },
          onCancel: () => {
            // 1) email depuis le bouton
            let email = (emailBtn || "").toString().trim();

            // 2) fallback : email depuis la fiche client (si dispo)
            if ((!email || !email.includes("@")) && client?.email) {
              email = String(client.email).trim();
            }

            // 3) fallback : email depuis la facture elle-même (hyper fiable)
            if ((!email || !email.includes("@")) && invoiceNumber) {
              const inv = (getAllDocuments() || []).find(
                (d) => d?.type === "facture" && d?.number === invoiceNumber,
              );
              const invMail = inv?.client?.email;
              if (invMail) email = String(invMail).trim();
            }

            if (!email || !email.includes("@")) {
              showConfirmDialog({
                title: "Email indisponible",
                message: "Aucune adresse email valide pour ce client.",
                confirmLabel: "OK",
                cancelLabel: "",
                variant: "warning",
                icon: "⚠️",
              });
              return;
            }

            _addRelanceToInvoice(invoiceNumber, "email");
            const subject = `Relance facture ${invoiceNumber}`;
            const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

            // ✅ IMPORTANT : ne pas “naviguer” dans ton app (évite l’effet “ça efface”)
            openExternalLink(url);

          },
        });
      });
    });
}

function exportBackupJSON() {
  const backup = {
    version: "backup_v1",
    ts: new Date().toISOString(),
    localStorage: {},
  };

  // ✅ on embarque TOUT le localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    backup.localStorage[k] = localStorage.getItem(k);
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_app.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importBackupJSON(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      if (!data || !data.localStorage) throw new Error("Format invalide");

      // ⚠️ on remplace le localStorage par le backup
      localStorage.clear();
      Object.keys(data.localStorage).forEach((k) => {
        localStorage.setItem(k, data.localStorage[k]);
      });

      // ✅ reload app
      location.reload();
    } catch (e) {
      alert("Import impossible : fichier backup invalide.");
    }
  };
  reader.readAsText(file);
}


// ================== CLIENT (DEVIS / FACTURES) ==================

function onClientNameChange() {
  const input = document.getElementById("clientName");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients();
  const client = clients.find(
    (c) => (c.name || "").trim().toLowerCase() === value,
  );
  if (!client) return;

  const addr = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");
  const email = document.getElementById("clientEmail");

  if (addr) addr.value = client.address || "";
  if (phone) phone.value = client.phone || "";
  if (email) email.value = client.email || "";

  const civ = document.getElementById("clientCivility");
  if (civ && !civ.value && client.civility) {
    civ.value = client.civility;
  }
}

function onPlanningPopupClientChange() {
  const input = document.getElementById("planningPopupClient");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients();
  const client = clients.find(
    (c) => (c.name || "").trim().toLowerCase() === value
  );

  if (!client) return;

  const addr = document.getElementById("planningPopupAddress");
  const phone = document.getElementById("planningPopupPhone");
  const email = document.getElementById("planningPopupEmail");
  const privateNotes = document.getElementById("planningPopupPrivateNotes");

  if (addr) addr.value = client.address || "";
  if (phone) phone.value = client.phone || "";
  if (email) email.value = client.email || "";
  if (privateNotes) privateNotes.value = client.privateNotes || "";
}

// --- Attestation clim : remplir adresse depuis la liste de clients ---

function onAttClientNameChange() {
  const input = document.getElementById("attClientName");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients ? getClients() : [];
  const client = clients.find(
    (c) => (c.name || "").trim().toLowerCase() === value,
  );
  if (!client) return;

  const addr = document.getElementById("attClientAddress");
  if (addr) {
    addr.value = client.address || "";
  }
}

// --- Rapport d'intervention : remplir nom + adresse ---

function fillRapportClientFromObject(client) {
  if (!client) return;

  const nameEl = document.getElementById("rapClientName");
  const addrEl = document.getElementById("rapClientAddress");

  if (nameEl) nameEl.value = client.name || "";
  if (addrEl) addrEl.value = client.address || "";
}

function onRapportClientNameChange() {
  const input = document.getElementById("rapClientName");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients ? getClients() : [];
  const client = clients.find(
    (c) => (c.name || "").trim().toLowerCase() === value,
  );
  if (!client) return;

  fillRapportClientFromObject(client);
}

let currentAttestationId = null;
let currentRapportId = null;
let currentRapportPhotosTemp = []; // [{name,type,dataUrl}]
let currentRapportAttachmentsTemp = []; // [{name,type,dataUrl}]

/* ================== ATTESTATIONS & RAPPORTS ================== */

function showAttestations() {
  // ===== Onglets =====
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  const tabAttest = document.getElementById("tabAttest");
  if (tabAttest) tabAttest.classList.add("active");

  // ===== Vues =====
  const viewsToHide = ["homeView", "listView", "formView", "contractView"];
  viewsToHide.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const attestationView = document.getElementById("attestationView");
  if (attestationView) attestationView.classList.remove("hidden");
  const settingsView = document.getElementById("settingsView");
  settingsView && settingsView.classList.add("hidden");

  // ===== Listes attestations + rapports =====
  if (typeof loadAttestationsList === "function") {
    loadAttestationsList();
  }
  if (typeof loadRapportsList === "function") {
    loadRapportsList();
  }
}

// ================== VUE PARAMÈTRES ==================

function showSettings() {
  // onglets
  const tabHome = document.getElementById("tabHome");
  const tabDevis = document.getElementById("tabDevis");
  const tabContrats = document.getElementById("tabContrats");
  const tabFactures = document.getElementById("tabFactures");
  const tabAttest = document.getElementById("tabAttest");
  const tabCA = document.getElementById("tabCA");
  const tabSettings = document.getElementById("tabSettings");

  tabHome && tabHome.classList.remove("active");
  tabDevis && tabDevis.classList.remove("active");
  tabContrats && tabContrats.classList.remove("active");
  tabFactures && tabFactures.classList.remove("active");
  tabAttest && tabAttest.classList.remove("active");
  tabCA && tabCA.classList.remove("active");
  tabSettings && tabSettings.classList.add("active");

  // vues
  const views = [
    "homeView",
    "listView",
    "formView",
    "contractView",
    "attestationView",
    "settingsView",
  ];
  views.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === "settingsView") el.classList.remove("hidden");
    else el.classList.add("hidden");
  });

  // remplissage du formulaire
  fillCompanySettingsForm();
}

function fillCompanySettingsForm() {
  const s = getCompanySettings();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  setVal("confCompanyName", s.companyName);
  setVal("confSubtitle", s.subtitle);
  setVal("confLegalName", s.legalName);
  setVal("confSiret", s.siret);
  setVal("confVatNumber", s.vatNumber);
  setVal("confAddress", s.address);
  setVal("confPhone", s.phone);
  setVal("confEmail", s.email);
  setVal("confRibHolder", s.ribHolder);
  setVal("confBankName", s.bankName);
  setVal("confIban", s.iban);
  setVal("confBic", s.bic);
}

async function saveCompanySettingsFromForm() {
  const getVal = (id) => (document.getElementById(id)?.value || "").trim();

  const settings = {
    companyName: getVal("confCompanyName"),
    subtitle: getVal("confSubtitle"),
    legalName: getVal("confLegalName"),
    siret: getVal("confSiret"),
    vatNumber: getVal("confVatNumber"),
    address: getVal("confAddress"),
    phone: getVal("confPhone"),
    email: getVal("confEmail"),
    ribHolder: getVal("confRibHolder"),
    bankName: getVal("confBankName"),
    iban: getVal("confIban"),
    bic: getVal("confBic"),
  };

  try {
    // 1️⃣ Sauvegarde Firestore
    await saveCompanySettingsToFirestore(settings);

    // 2️⃣ Mise à jour immédiate de l’UI (IMPORTANT)
    applyCompanySettingsToUI(settings);

  } catch (e) {
    console.error("saveCompanySettingsToFirestore error:", e);
  }

  showConfirmDialog({
    title: "Paramètres enregistrés",
    message: "Les informations de l’entreprise ont été mises à jour.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });
}


async function saveCompanySettingsToFirestore(settings) {
  if (!db) return;
  await db.collection("config").doc("companySettings").set(settings, { merge: true });
}

function getTVALineForDocuments() {
  const s = getCompanySettings();
  const status = getMicroTVAStatus(); // doit renvoyer { mode: "franchise"|"obligatoire" }

  if (status?.mode === "obligatoire") {
    // TVA active => on affiche le numéro
    return s.vatNumber
      ? `TVA intracom : ${s.vatNumber}`
      : `TVA intracom : (numéro manquant)`;
  }

  // Franchise => mention obligatoire
  return "TVA non applicable, article 293B du CGI";
}

/* ========== ATTESTATION CLIM ========== */

function openClimAttestationGenerator() {
  const overlay = document.getElementById("attestationPopup");
  if (!overlay) return;

  // 👉 on est en création, pas en édition
  currentAttestationId = null;

  // on vide / remet les champs
  const name = document.getElementById("attClientName");
  const addr = document.getElementById("attClientAddress");
  const date = document.getElementById("attDate");
  const units = document.getElementById("attUnits");
  const notes = document.getElementById("attNotes");

  if (name) name.value = "";
  if (addr) addr.value = "";
  if (date) date.value = "";
  if (units) units.value = 1;
  if (notes) notes.value = "";

  overlay.classList.remove("hidden");

  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth; // petit reflow pour l’animation
    popup.classList.add("show");
  }
}

function openAttestationPopupForEdit(attId) {
  const list = getAllAttestations();
  const rec = list.find((a) => a.id === attId);
  if (!rec) return;

  currentAttestationId = rec.id;

  const name = document.getElementById("attClientName");
  const addr = document.getElementById("attClientAddress");
  const date = document.getElementById("attDate");
  const units = document.getElementById("attUnits");
  const notes = document.getElementById("attNotes");

  if (name) name.value = rec.clientName || "";
  if (addr) addr.value = rec.clientAddress || "";
  if (date) date.value = rec.date || "";
  if (units) units.value = rec.units != null ? rec.units : 1;
  if (notes) notes.value = rec.notes || "";

  const overlay = document.getElementById("attestationPopup");
  if (!overlay) return;
  overlay.classList.remove("hidden");

  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth;
    popup.classList.add("show");
  }
}

function closeAttestationPopup() {
  const overlay = document.getElementById("attestationPopup");
  if (!overlay) return;

  const popup = overlay.querySelector(".popup");
  if (popup) popup.classList.remove("show");

  overlay.classList.add("hidden");
}

function saveAttestationFromForm() {
  const name = document.getElementById("attClientName")?.value || "";
  const addr = document.getElementById("attClientAddress")?.value || "";
  const date = document.getElementById("attDate")?.value || "";
  const units = document.getElementById("attUnits")?.value || "1";
  const notes = document.getElementById("attNotes")?.value || "";

  const list = getAllAttestations();
  let record;

  if (currentAttestationId) {
    // ✏️ MODE ÉDITION
    const idx = list.findIndex((a) => a.id === currentAttestationId);
    if (idx !== -1) {
      record = {
        ...list[idx],
        clientName: name,
        clientAddress: addr,
        date,
        units: Number(units) || 1,
        notes,
      };
      list[idx] = record;
    } else {
      // sécurité : si pas trouvé, on recrée
      record = {
        id: generateId("ATT"),
        type: "attestation_clim",
        clientName: name,
        clientAddress: addr,
        date,
        units: Number(units) || 1,
        notes,
        createdAt: new Date().toISOString(),
        sourceDocId:
          (currentAttestationSource && currentAttestationSource.id) || null,
        sourceDocNumber:
          (currentAttestationSource && currentAttestationSource.number) || null,
      };
      list.push(record);
    }
  } else {
    // ➕ MODE CRÉATION
    record = {
      id: generateId("ATT"),
      type: "attestation_clim",
      clientName: name,
      clientAddress: addr,
      date,
      units: Number(units) || 1,
      notes,
      createdAt: new Date().toISOString(),
      sourceDocId:
        (currentAttestationSource && currentAttestationSource.id) || null,
      sourceDocNumber:
        (currentAttestationSource && currentAttestationSource.number) || null,
    };
    list.push(record);
  }

  saveAttestations(list);
  currentAttestationId = record.id;
  currentAttestationSource = null;

  if (typeof loadAttestationsList === "function") {
    loadAttestationsList();
  }
}

function generatePDFAttestation(mode = "print") {
  const name = document.getElementById("attClientName")?.value || "";
  const addr = document.getElementById("attClientAddress")?.value || "";
  const date = document.getElementById("attDate")?.value || "";
  const units = document.getElementById("attUnits")?.value || "1";
  const notes = document.getElementById("attNotes")?.value || "";

  // 1) on sauvegarde / met à jour dans le localStorage
  saveAttestationFromForm();

  // 2) on récupère l’enregistrement à jour
  const list = getAllAttestations();
  const rec = list
    .slice()
    .reverse()
    .find(
      (a) =>
        (a.clientName || "") === name &&
        (a.clientAddress || "") === addr &&
        (a.date || "") === date,
    ) || {
    clientName: name,
    clientAddress: addr,
    date,
    units: Number(units) || 1,
    notes,
  };

  rec.units = Number(units) || 1;

  // 3) on génère le PDF premium
  generatePDFAttestationFromRecord(rec, mode);

  // on ferme la popup
  closeAttestationPopup();
}

function detectRapportTypeFromDevis(devis) {
  const text = JSON.stringify(devis.prestations || []).toLowerCase();
  // ✅ Détection fiable via "kind"
  if (text.includes('"kind":"entretien_clim"')) return "entretien_clim";
  if (text.includes('"kind":"depannage_clim"')) return "depannage_clim";


  if (text.includes("entretien piscine")) return "entretien_piscine";
  if (text.includes("piscine sel")) return "entretien_piscine";
  if (text.includes("chlore")) return "entretien_piscine";
  if (text.includes("traitement choc")) return "traitement_choc";
  if (text.includes("diagnostic filtration")) return "diagnostic_filtration";

  if (text.includes("electrolyseur")) return "installation_electrolyseur";
  if (text.includes("pompe filtration")) return "installation_pompe_pac";
  if (text.includes("roulement")) return "remplacement_roulements";

  if (text.includes("clim") && text.includes("entretien"))
    return "entretien_clim";
  if (text.includes("clim") && text.includes("diag")) return "depannage_clim";

  // fallback si rien trouvé
  return null;
}

function generateAutoChecklist(rapportType, devis) {
  const template = RAPPORT_TEMPLATES.find((t) => t.id === rapportType);
  if (!template) return [];

  const txt = JSON.stringify(devis.prestations || []).toLowerCase();
  let checklist = [];

  template.sections.forEach((section) => {
    section.items.forEach((item) => {
      const keywords = item.toLowerCase().split(" ").slice(0, 2).join(" ");

      const checked = txt.includes(keywords);

      checklist.push({
        text: item,
        checked,
      });
    });
  });

  return checklist;
}

function createRapportFromDevis(devis) {
  if (!devis) {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Aucun devis fourni",
        message:
          "Sélectionne d’abord un devis avant de générer un rapport d’intervention.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️",
      });
    } else {
      alert("Aucun devis fourni pour générer le rapport.");
    }
    return null;
  }

  const typeId = detectRapportTypeFromDevis(devis);
  if (!typeId) {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Type de rapport non détecté",
        message:
          "Impossible de déterminer automatiquement le type de rapport à partir de ce devis.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "⚠️",
      });
    } else {
      alert("Impossible de déterminer automatiquement le type de rapport.");
    }
    return null;
  }

  const tpl = RAPPORT_TEMPLATES.find((t) => t.id === typeId) || null;

  // ✅ Checklist "intelligente" à partir du devis
  const flatChecklist = generateAutoChecklist(typeId, devis);

  // on mappe ça sur la structure `sections` utilisée par les rapports
  const checkedSet = new Set(
    flatChecklist.filter((it) => it.checked).map((it) => it.text),
  );

  const sectionsData = [];
  if (tpl) {
    tpl.sections.forEach((section) => {
      const items = section.items.filter((item) => {
        // si aucune info → on coche tout
        if (checkedSet.size === 0) return true;
        return checkedSet.has(item);
      });

      if (items.length) {
        sectionsData.push({
          title: section.title,
          items,
        });
      }
    });
  }

  const id =
    typeof generateId === "function" ? generateId("RAP") : "RAP-" + Date.now();

  const rapport = {
    id,
    typeId,
    typeLabel: tpl ? tpl.label : "",
    clientName: devis.client?.name || "",
    clientAddress: devis.client?.address || "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    sections: sectionsData,
    analysis: {
      ph: null,
      chlore: null,
    },
    autoGenerated: true,
    createdAt: new Date().toISOString(),
    sourceDocId: devis.id || null,
    sourceDocNumber: devis.number || null,
  };

  const all = getAllRapports();
  all.push(rapport);
  saveRapports(all);

  return rapport;
}

function onGenerateRapportFromCurrent() {
  // Vérifie qu’on a bien un document ouvert
  if (!currentDocumentId) {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Aucun devis ouvert",
        message:
          "Ouvre d’abord un devis avant de générer un rapport d’intervention.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️",
      });
    } else {
      alert(
        "Aucun devis ouvert. Ouvre d’abord un devis avant de générer un rapport.",
      );
    }
    return;
  }

  const doc = getDocument(currentDocumentId);
  if (!doc) {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Document introuvable",
        message: "Impossible de retrouver ce document dans la base.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "danger",
        icon: "⚠️",
      });
    } else {
      alert("Document introuvable dans la base.");
    }
    return;
  }

  // Only devis
  if (doc.type !== "devis") {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Action impossible",
        message:
          "Le rapport d’intervention ne peut être généré qu’à partir d’un devis.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "🧾",
      });
    } else {
      alert("Le rapport technique ne peut être généré qu’à partir d’un devis.");
    }
    return;
  }

  // ✅ Génère le rapport intelligent à partir de ce devis (sans ouvrir de popup)
  const rapport = createRapportFromDevis(doc);
  if (!rapport) return;

  const numero = doc.number || doc.id || "";

  // 🔔 Message pro de confirmation
  if (typeof showConfirmDialog === "function") {
    showConfirmDialog({
      title: "Rapport d’intervention créé",
      message:
        `Un rapport technique a été créé pour le devis ${numero}.\n` +
        `Tu pourras le consulter et l’imprimer depuis l’onglet "Attestations & Rapports".`,
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "success",
      icon: "📝",
    });
  } else {
    alert("Un rapport d’intervention a été créé pour le devis " + numero + ".");
  }
}

function openPiscineRapportGenerator(docId = null) {
  // 👉 on est en mode "nouveau"
  currentRapportId = null;
  currentRapportPhotosTemp = [];
  currentRapportAttachmentsTemp = [];
  renderRapportPhotosPreview();
  renderRapportFilesList();

  const sel = document.getElementById("rapportType");
  if (!sel) return;

  sel.innerHTML = `<option value="">— Choisir —</option>`;
  RAPPORT_TEMPLATES.forEach((t) => {
    sel.innerHTML += `<option value="${t.id}">${t.label}</option>`;
  });

  // on vide les champs
  const name = document.getElementById("rapClientName");
  const addr = document.getElementById("rapClientAddress");
  const date = document.getElementById("rapDate");
  const notes = document.getElementById("rapNotes");
  const ph = document.getElementById("rapPH");
  const chl = document.getElementById("rapChlore");

  if (name) name.value = "";
  if (addr) addr.value = "";
  if (date) date.value = "";
  if (notes) notes.value = "";
  if (ph) ph.value = "";
  if (chl) chl.value = "";

  const checklist = document.getElementById("rapportChecklist");
  if (checklist) checklist.innerHTML = "";

  // 🔹 cacher l’analyse tant qu’on n’a pas choisi "entretien_piscine"
  updateRapportAnalyseVisibility("");

  const overlay = document.getElementById("rapportPopup");
  if (!overlay) return;

  overlay.classList.remove("hidden");
  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth; // pour l’animation
    popup.classList.add("show");
  }
}

function closeRapportPopup() {
  const overlay = document.getElementById("rapportPopup");
  if (!overlay) return;

  const popup = overlay.querySelector(".popup");
  if (popup) popup.classList.remove("show");

  overlay.classList.add("hidden");
  currentRapportId = null; // 🧹
}

function rebuildRapportChecklist() {
  const type = document.getElementById("rapportType").value;

  // gère affichage bloc analyse
  updateRapportAnalyseVisibility(type);

  const tpl = RAPPORT_TEMPLATES.find((t) => t.id === type);
  const box = document.getElementById("rapportChecklist");
  if (!box) return;

  box.innerHTML = "";
  if (!tpl) return;

  // 🔎 si on édite un rapport existant, on récupère ses items cochés
  let checkedSet = null;
  if (currentRapportId) {
    const list = getAllRapports();
    const rec = list.find((r) => r.id === currentRapportId);
    if (rec && Array.isArray(rec.sections)) {
      checkedSet = new Set();
      rec.sections.forEach((sec) => {
        (sec.items || []).forEach((text) => checkedSet.add(text));
      });
    }
  }

  tpl.sections.forEach((section) => {
    const div = document.createElement("div");
    div.className = "rapport-section";

    const h = document.createElement("h4");
    h.textContent = section.title;
    div.appendChild(h);

    section.items.forEach((item) => {
      const isChecked =
        !checkedSet || checkedSet.size === 0
          ? true // nouveau rapport → tout coché
          : checkedSet.has(item);

      const row = document.createElement("label");
      row.className = "rapport-item";
      row.innerHTML = `
        <input type="checkbox" ${isChecked ? "checked" : ""} data-text="${item}">
        <span class="rapport-item-text">${item}</span>
      `;
      div.appendChild(row);
    });

    box.appendChild(div);
  });
}

function updateRapportAnalyseVisibility(typeId) {
  const bloc = document.getElementById("rapportAnalyse");
  if (!bloc) return;

  // On montre l'analyse uniquement pour "entretien_piscine"
  const show = typeId === "entretien_piscine";

  bloc.style.display = show ? "block" : "none";

  // Si on cache, on vide les champs
  if (!show) {
    const ph = document.getElementById("rapPH");
    const chl = document.getElementById("rapChlore");
    if (ph) ph.value = "";
    if (chl) chl.value = "";
  }
}

function openCA() {
  // Ouvre la popup CA existante
  openCAReport();

  // Met le bouton CA en bleu (actif)
  const tabCA = document.getElementById("tabCA");
  if (tabCA) tabCA.classList.add("active");
}

// ================== CLIENTS POUR CONTRATS ==================

function fillContractClientFromObject(client) {
  if (!client) return;

  const civ = document.getElementById("ctClientCivility");
  const name = document.getElementById("ctClientName");
  const addr = document.getElementById("ctClientAddress");
  const phone = document.getElementById("ctClientPhone");
  const email = document.getElementById("ctClientEmail");

  if (civ && !civ.value && client.civility) {
    civ.value = client.civility;
  }
  if (name) name.value = client.name || "";
  if (addr) addr.value = client.address || "";
  if (phone) phone.value = client.phone || "";
  if (email) email.value = client.email || "";
}

// Auto-remplissage quand on choisit un client dans ctClientName
function onContractClientNameChange() {
  const input = document.getElementById("ctClientName");
  if (!input) return;

  const name = (input.value || "").trim();
  if (!name) return;

  const clients = getClients();
  const found = clients.find(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase(),
  );

  if (found) {
    fillContractClientFromObject(found);
  }
}

// Ajoute / met à jour le client depuis un contrat
function addCurrentClientFromContract() {
  const name = (document.getElementById("ctClientName")?.value || "").trim();
  const address = (
    document.getElementById("ctClientAddress")?.value || ""
  ).trim();
  const phone = (document.getElementById("ctClientPhone")?.value || "").trim();
  const email = (document.getElementById("ctClientEmail")?.value || "").trim();
  const civ = (document.getElementById("ctClientCivility")?.value || "").trim();

  if (!name || !address) {
    showConfirmDialog({
      title: "Client incomplet",
      message: "Nom et adresse sont obligatoires pour enregistrer le client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  const clients = getClients();
  const existingIdx = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase(),
  );

  let clientObj;
  if (existingIdx >= 0) {
    const old = clients[existingIdx];
    clientObj = {
      ...old,
      civility: civ,
      name,
      address,
      phone,
      email,
    };
    clients[existingIdx] = clientObj;
  } else {
    const tmp = { civility: civ, name, address, phone, email };
    const id = getClientDocId(tmp);
    clientObj = { ...tmp, id };
    clients.push(clientObj);
  }

  saveClients(clients);
  refreshClientDatalist();
  if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();

  if (typeof saveSingleClientToFirestore === "function") {
    saveSingleClientToFirestore(clientObj);
  }

  showConfirmDialog({
    title: "Client enregistré",
    message: "Ce client a été enregistré dans la base.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });
}

// Supprime le client courant (depuis l'onglet contrat)

function deleteCurrentClientFromContract() {
  const name = (document.getElementById("ctClientName")?.value || "").trim();
  if (!name) return;

  const clients = getClients();

  const existingIdx = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase(),
  );
  if (existingIdx < 0) return;

  const clientToDelete = clients[existingIdx];

  showConfirmDialog({
    title: "Supprimer ce client ?",
    message: `Voulez-vous vraiment supprimer "${clientToDelete.name}" de la base clients ?`,
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      // 🔴 1. Suppression locale
      clients.splice(existingIdx, 1);
      saveClients(clients);
      refreshClientDatalist();
      if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();

      // 🔴 2. Suppression Firestore (si possible)
      if (
        typeof deleteClientFromFirestore === "function" &&
        clientToDelete.id
      ) {
        deleteClientFromFirestore(clientToDelete);
      }

      // ✅ Confirmation utilisateur
      showConfirmDialog({
        title: "Client supprimé",
        message: "Le client a été supprimé de la base.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "success",
        icon: "✅",
      });
    },
  });
}

// Ajouter le client actuel à la base

function addCurrentClient() {
  const name = document.getElementById("clientName").value.trim();
  const address = document.getElementById("clientAddress").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const email = document.getElementById("clientEmail").value.trim();
  const civility = document.getElementById("clientCivility")?.value.trim();

  if (!name) {
    showConfirmDialog({
      title: "Nom obligatoire",
      message: "Merci de renseigner au minimum le nom du client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  const clients = getClients();
  const existingIndex = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase(),
  );

  let clientObj;

  if (existingIndex === -1) {
    // ➕ Nouveau client (avec id)
    const tmp = { civility, name, address, phone, email };
    const id = getClientDocId(tmp);
    clientObj = { ...tmp, id };
    clients.push(clientObj);
  } else {
    // ✏️ Mise à jour en conservant l'id
    const old = clients[existingIndex];
    clientObj = {
      ...old,
      civility,
      name,
      address,
      phone,
      email,
    };
    clients[existingIndex] = clientObj;
  }

  saveClients(clients);
  refreshClientDatalist();
  if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();

  if (typeof saveSingleClientToFirestore === "function") {
    saveSingleClientToFirestore(clientObj);
  }

  const isUpdate = existingIndex !== -1;

  showConfirmDialog({
    title: isUpdate ? "Client mis à jour" : "Client ajouté",
    message: isUpdate
      ? "Les informations du client ont été mises à jour."
      : "Le client a été ajouté à la base.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });
}

let pendingRenewId = null;

function openRenewPopup(id) {
  pendingRenewId = id;
  const popup = document.getElementById("renewPopup");
  popup.classList.remove("hidden");
  void popup.offsetWidth;
  popup.classList.add("show");
}

function closeRenewPopup() {
  const popup = document.getElementById("renewPopup");
  popup.classList.remove("show");
  setTimeout(() => popup.classList.add("hidden"), 150);
  pendingRenewId = null;
}

function confirmRenewPopup() {
  if (!pendingRenewId) return;

  renewContract(pendingRenewId);

  closeRenewPopup();
}

function rebuildClientsPopupList(searchText = "") {
  const all = getClients();

  // On garde l'index d'origine pour chaque client
  const mapped = all.map((client, index) => ({ client, index }));

  // On trie seulement pour l'affichage, sans casser les index d'origine
  const sorted = mapped.sort((a, b) =>
    (a.client.name || "")
      .toLowerCase()
      .localeCompare((b.client.name || "").toLowerCase(), "fr", {
        sensitivity: "base",
      }),
  );

  if (searchText && searchText.trim() !== "") {
const q = _normName(searchText);
clientsPopupList = sorted.filter((item) =>
  _normName(item.client.name).includes(q) ||
  _normName(item.client.address || "").includes(q) ||
  _normName(item.client.phone || "").includes(q)
);

  } else {
    // Pas de filtre : on garde toute la liste triée
    clientsPopupList = sorted;
  }
}

function openClientsListPopup() {
  const searchInput = document.getElementById("clientSearchInput");
  if (searchInput) searchInput.value = "";

  currentClientPage = 1;
  rebuildClientsPopupList("");

  // on masque le formulaire d’édition
  const editForm = document.getElementById("editClientForm");
  if (editForm) editForm.classList.add("hidden");

  // on affiche l’overlay
  const overlay = document.getElementById("clientsPopup");
  if (!overlay) return;
  overlay.classList.remove("hidden");

  // 👉 on active la popup à l’intérieur
  const popup = overlay.querySelector(".popup");
  if (popup) {
    // petit reflow si tu veux que l’anim soit propre
    void popup.offsetWidth;
    popup.classList.add("show");
  }

  renderClientsList();
}

function filterClientsList() {
  const searchInput = document.getElementById("clientSearchInput");
  const q = searchInput ? searchInput.value : "";
  currentClientPage = 1;
  rebuildClientsPopupList(q);
  renderClientsList();
}

function renderClientsList() {
  const container = document.getElementById("clientsListContainer");
  const pageInfoEl = document.getElementById("clientsPageInfo");
  if (!container) return;

  container.innerHTML = "";

  const total = clientsPopupList.length;
  if (total === 0) {
    container.innerHTML = "<p>Aucun client trouvé.</p>";
    if (pageInfoEl) pageInfoEl.textContent = "Page 0 / 0";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(total / CLIENTS_PER_PAGE));
  if (currentClientPage > totalPages) currentClientPage = totalPages;

  const start = (currentClientPage - 1) * CLIENTS_PER_PAGE;
  const pageItems = clientsPopupList.slice(start, start + CLIENTS_PER_PAGE);

  pageItems.forEach(({ client, index }) => {
    const item = document.createElement("div");
    item.className = "client-item";
    item.innerHTML = `
  <strong>${client.name}</strong><br>
  ${client.address || ""}<br>
  Tel : ${client.phone || "—"}<br>
  Mail : ${client.email || "—"}<br>
  <div style="margin-top:6px; display:flex; gap:10px;">
    <button class="modify-btn" onclick="editClient(${index})">✏️ Modifier</button>
    <button class="delete-btn" onclick="deleteClientFromList(${index})">🗑️ Supprimer</button>
  </div>
`;

    item.style.cursor = "pointer";
    item.title = "Ouvrir la fiche client";

    item.addEventListener("click", (e) => {
      if (e.target.closest("button")) return; // ne pas ouvrir si clic sur un bouton
      openClientSheet(client.name);
    });

    container.appendChild(item);
  });

  if (pageInfoEl) {
    pageInfoEl.textContent = `Page ${currentClientPage} / ${totalPages}`;
  }
}
function prevClientsPage() {
  if (currentClientPage > 1) {
    currentClientPage--;
    renderClientsList();
  }
}

function nextClientsPage() {
  const total = clientsPopupList.length;
  const totalPages = Math.max(1, Math.ceil(total / CLIENTS_PER_PAGE));
  if (currentClientPage < totalPages) {
    currentClientPage++;
    renderClientsList();
  }
}

function deleteClientFromList(index) {
  const clients = getClients();
  const c = clients[index];
  if (!c) return;

  showConfirmDialog({
    title: "Supprimer ce client ?",
    message: `Voulez-vous vraiment supprimer '${c.name}' ?`,
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "🗑️",
    onConfirm: () => {
      clients.splice(index, 1);
      saveClients(clients);
      refreshClientDatalist();
      if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();
      filterClientsList(); // pour recharger la liste avec tri + pagination

      showConfirmDialog({
        title: "Client supprimé",
        message: "Le client a bien été supprimé.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "success",
        icon: "✅",
      });
    },
  });
}

function exportClientsCSV() {
  const clients = getClients();
 let csv = "Nom;Adresse;Téléphone;Email;Notes privées\n";


  clients.forEach((c) => {
csv += `${c.name};${c.address};${c.phone || ""};${c.email || ""};${(c.privateNotes || "").replaceAll("\n"," ") }\n`;

  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "clients.csv";
  a.click();

  URL.revokeObjectURL(url);
}

let editingClientIndex = null;

function editClient(index) {
  const clients = getClients();
  const c = clients[index];
  editingClientIndex = index;

  document.getElementById("editClientName").value = c.name;
  document.getElementById("editClientAddress").value = c.address;
  document.getElementById("editClientPhone").value = c.phone;
  document.getElementById("editClientEmail").value = c.email;
document.getElementById("editClientPrivateNotes").value = c.privateNotes || "";


  document.getElementById("editClientForm").classList.remove("hidden");
}
function openAddClientFromList() {
  // Vide les champs
  document.getElementById("editClientName").value = "";
  document.getElementById("editClientAddress").value = "";
  document.getElementById("editClientPhone").value = "";
  document.getElementById("editClientEmail").value = "";
document.getElementById("editClientPrivateNotes").value = "";


  editingClientIndex = null; // mode création

  // Affiche le formulaire d'édition
  document.getElementById("editClientForm").classList.remove("hidden");
}

function cancelEditClient() {
  document.getElementById("editClientForm").classList.add("hidden");
}

function saveEditedClient() {
  const clients = getClients();

  const name = document.getElementById("editClientName").value.trim();
  const address = document.getElementById("editClientAddress").value.trim();
  const phone = document.getElementById("editClientPhone").value.trim();
  const email = document.getElementById("editClientEmail").value.trim();
  const privateNotes = document.getElementById("editClientPrivateNotes").value.trim();

  if (!name) {
    showConfirmDialog({
      title: "Nom obligatoire",
      message: "Merci de renseigner au minimum le nom du client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  let title, message;
  let clientObj;

  if (editingClientIndex === null || typeof editingClientIndex === "undefined") {
    // ➕ Nouveau client
    clientObj = {
      id: getClientDocId({ name, address }),
      name,
      address,
      phone,
      email,
      privateNotes,
    };
    clients.push(clientObj);
    title = "Client ajouté";
    message = "Le client a été ajouté à la base.";
  } else {
    // ✏️ Modif client existant (on garde l'ancien id + champs)
    const old = clients[editingClientIndex] || {};
    clientObj = {
      ...old,
      name,
      address,
      phone,
      email,
      privateNotes,
    };
    // sécurité : si old n’avait pas d’id
    if (!clientObj.id) clientObj.id = getClientDocId({ name, address });

    clients[editingClientIndex] = clientObj;
    title = "Client modifié";
    message = "Les informations du client ont été mises à jour.";
  }

  // ✅ Save local
  saveClients(clients);
  refreshClientDatalist();
  if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();
  openClientsListPopup();

  // ✅ Save Firestore (IMPORTANT pour ne plus perdre les notes)
  try {
    if (typeof saveSingleClientToFirestore === "function") {
      saveSingleClientToFirestore(clientObj);
    }
  } catch (e) {}

  showConfirmDialog({
    title,
    message,
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });
}


function closeClientsListPopup() {
  const overlay = document.getElementById("clientsPopup");
  const popup = overlay.querySelector(".popup");
  popup.classList.remove("show");
  overlay.classList.add("hidden");
}

function generatePDFRapport() {
  const type = document.getElementById("rapportType").value;
  const tpl = RAPPORT_TEMPLATES.find((t) => t.id === type);
  if (!tpl) return alert("Sélectionne un modèle.");

  const doc = new jspdf.jsPDF();

  doc.setFontSize(18);
  doc.text(tpl.label, 10, 20);

  doc.setFontSize(12);

  let y = 40;
  document.querySelectorAll(".rapport-section").forEach((section) => {
    const title = section.querySelector("h4").textContent;
    doc.text(title, 10, y);
    y += 6;

    section.querySelectorAll("input:checked").forEach((cb) => {
      doc.text("• " + cb.dataset.text, 14, y);
      y += 6;
    });

    y += 4;
  });

  doc.save("rapport.pdf");
  closeRapportPopup();
}

function saveSingleDocumentToFirestore(doc) {
  if (!doc || !doc.id) {
    console.warn("Document sans id, impossible de sauvegarder dans Firestore.");
    return;
  }

  // 🔒 Si Firestore n'est pas initialisé → queue de secours
  if (!db) {
    enqueueSync({
      collection: "documents",
      action: "set",
      docId: doc.id,
      data: doc,
    });
    return;
  }

  // ✅ Écriture Firestore (online ou offline → Firestore gère)
  db.collection("documents")
    .doc(doc.id)
    .set(doc, { merge: true })
    .catch((err) => {
      console.error("Erreur Firestore (saveSingleDocumentToFirestore) :", err);

      // 🔁 En ultime secours seulement
      enqueueSync({
        collection: "documents",
        action: "set",
        docId: doc.id,
        data: doc,
      });
    });

  // 🔄 Lien devis → contrats (logique métier, OK ici)
  if (typeof syncContractsWithDevis === "function") {
    syncContractsWithDevis(doc);
  }
}


// ================== LISTE CLIENTS (popup) ==================
let clientsPopupList = []; // liste courante affichée dans le popup
let currentClientPage = 1;
const CLIENTS_PER_PAGE = 10;

// ================== HELPERS GÉNÉRAUX ==================

function formatEuro(value) {
  return (
    (Number(value) || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  );
}


/* ================== CHIFFRE D'AFFAIRES – DASHBOARD PRO ================== */

function formatEuroCA(v) {
  const n = Number(v) || 0;
  return n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
}

function getCAAvailableYears() {
  const docs = getAllDocuments().filter((d) => d.type === "facture" && d.date);
  if (docs.length === 0) {
    return [new Date().getFullYear()];
  }
  let minYear = 9999;
  let maxYear = 0;

  docs.forEach((d) => {
    const dt = new Date(d.date);
    const y = dt.getFullYear();
    if (!isNaN(y)) {
      if (y < minYear) minYear = y;
      if (y > maxYear) maxYear = y;
    }
  });

  const years = [];
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y);
  }
  return years;
}

/**
 * Retourne les stats par mois pour une année donnée.
 * year = null => toutes années confondues (utile pour "Toutes").
 */
function computeCAMonthsForYear(year) {
  const docs = getAllDocuments().filter((d) => d.type === "facture" && d.date);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
    paidTTC: 0,
    unpaidTTC: 0,
    paidCount: 0,
    unpaidCount: 0,
  }));

  docs.forEach((d) => {
    if (!d.date) return;

    const dt = new Date(d.date);
    const y = dt.getFullYear();
    if (!isNaN(y) && year && y !== year) return; // si année précise

    const mIndex = dt.getMonth(); // 0..11
    const month = months[mIndex];

    const ht = Number(d.subtotal || 0) || 0;
    const tva = Number(d.tvaAmount || 0) || 0;
    const ttc = Number(d.totalTTC || 0) || 0;

    month.totalHT += ht;
    month.totalTVA += tva;
    month.totalTTC += ttc;

    if (d.paid) {
      month.paidTTC += ttc;
      month.paidCount += 1;
    } else {
      month.unpaidTTC += ttc;
      month.unpaidCount += 1;
    }
  });

  return months;
}

/**
 * Bilan global sur une année (ou toutes).
 */
function buildCAReport(year) {
  const months = computeCAMonthsForYear(year);

  const totals = months.reduce(
    (acc, m) => {
      acc.totalHT += m.totalHT;
      acc.totalTVA += m.totalTVA;
      acc.totalTTC += m.totalTTC;
      acc.paidTTC += m.paidTTC;
      acc.unpaidTTC += m.unpaidTTC;
      acc.paidCount += m.paidCount;
      acc.unpaidCount += m.unpaidCount;
      return acc;
    },
    {
      totalHT: 0,
      totalTVA: 0,
      totalTTC: 0,
      paidTTC: 0,
      unpaidTTC: 0,
      paidCount: 0,
      unpaidCount: 0,
    },
  );

  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentMonth = months[currentMonthIndex];

  return {
    year,
    months,
    totals,
    currentMonth,
    availableYears: getCAAvailableYears(),
  };
}

/* ----- UI ----- */

function initCAYearSelect() {
  const select = document.getElementById("caYearSelect");
  if (!select) return;

  const years = getCAAvailableYears();
  const currentYear = new Date().getFullYear();

  select.innerHTML = "";

  // Option "Toutes"
  const optAll = document.createElement("option");
  optAll.value = "all";
  optAll.textContent = "Toutes";
  select.appendChild(optAll);

  years.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    select.appendChild(opt);
  });

  // Sélection par défaut : année courante si elle existe, sinon "Toutes"
  if (years.includes(currentYear)) {
    select.value = String(currentYear);
  } else {
    select.value = "all";
  }
}

function renderCAReport() {
  const yearSelect = document.getElementById("caYearSelect");
  const compareCheckbox = document.getElementById("caComparePrevYear");
  if (!yearSelect) return;

  const value = yearSelect.value || "all";
  const selectedYear = value === "all" ? null : parseInt(value, 10) || null;

  const report = buildCAReport(selectedYear);
  const comparePrev = !!(compareCheckbox && compareCheckbox.checked);

  let prevReport = null;
  if (comparePrev && selectedYear) {
    prevReport = buildCAReport(selectedYear - 1);
  }

  // ===== Résumé =====
  const t = report.totals;
  const totalTTC = t.totalTTC;
  const totalHT = t.totalHT;
  const totalTVA = t.totalTVA;
  const paidTTC = t.paidTTC;
  const unpaidTTC = t.unpaidTTC;

  const totalCount = t.paidCount + t.unpaidCount;
  const paidPct = totalTTC > 0 ? (paidTTC / totalTTC) * 100 : 0;

  const summaryTotal = document.getElementById("caSummaryTotalTTC");
  const summaryTotalHT = document.getElementById("caSummaryTotalHT");
  const summaryPaid = document.getElementById("caSummaryPaidTTC");
  const summaryPaidPct = document.getElementById("caSummaryPaidPct");
  const summaryUnpaid = document.getElementById("caSummaryUnpaidTTC");
  const summaryUnpaidCount = document.getElementById("caSummaryUnpaidCount");
  const summaryTVA = document.getElementById("caSummaryTVA");
  const summaryTVARate = document.getElementById("caSummaryTVARate");
  const summaryCurMonth = document.getElementById("caSummaryCurrentMonth");
  const summaryCurMonthLabel = document.getElementById(
    "caSummaryCurrentMonthLabel",
  );
  const prevCard = document.getElementById("caSummaryPrevYearCard");
  const summaryDelta = document.getElementById("caSummaryDelta");
  const summaryDeltaPct = document.getElementById("caSummaryDeltaPct");

  if (summaryTotal) summaryTotal.textContent = formatEuroCA(totalTTC);
  if (summaryTotalHT)
    summaryTotalHT.textContent = "HT : " + formatEuroCA(totalHT);

  if (summaryPaid) summaryPaid.textContent = formatEuroCA(paidTTC);
  if (summaryPaidPct) {
    summaryPaidPct.textContent =
      totalTTC > 0 ? `${paidPct.toFixed(1)} % du CA payé` : "Aucune facture";
  }

  if (summaryUnpaid) summaryUnpaid.textContent = formatEuroCA(unpaidTTC);
  if (summaryUnpaidCount) {
    summaryUnpaidCount.textContent =
      t.unpaidCount > 0
        ? `${t.unpaidCount} facture(s) impayée(s)`
        : "0 facture impayée";
  }

  if (summaryTVA) summaryTVA.textContent = formatEuroCA(totalTVA);
  if (summaryTVARate) {
    const rate = totalHT > 0 ? (totalTVA / totalHT) * 100 : 0;
    summaryTVARate.textContent =
      totalHT > 0 ? `TVA moyenne : ${rate.toFixed(1)} %` : "TVA moyenne : –";
  }

  const now = new Date();
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const curMonth = report.currentMonth || null;

  if (summaryCurMonth) {
    summaryCurMonth.textContent = curMonth
      ? formatEuroCA(curMonth.totalTTC)
      : "–";
  }
  if (summaryCurMonthLabel) {
    const labelYear = selectedYear || now.getFullYear();
    summaryCurMonthLabel.textContent = `${monthNames[now.getMonth()]} ${labelYear}`;
  }

  // Écart vs N-1
  if (prevCard && summaryDelta && summaryDeltaPct) {
    if (prevReport && prevReport.totals.totalTTC > 0) {
      const prev = prevReport.totals.totalTTC;
      const delta = totalTTC - prev;
      const deltaPct = (delta / prev) * 100;

      summaryDelta.textContent = (delta >= 0 ? "+" : "") + formatEuroCA(delta);
      summaryDeltaPct.textContent =
        (delta >= 0 ? "▲ " : "▼ ") +
        deltaPct.toFixed(1) +
        " % vs " +
        (selectedYear - 1);

      prevCard.style.display = "";
    } else {
      summaryDelta.textContent = "–";
      summaryDeltaPct.textContent = "Pas de données N-1";
      prevCard.style.display = comparePrev ? "" : "none";
    }
  }

  // ===== Tableau mensuel =====
  const tbody = document.getElementById("caTableBody");
  if (tbody) {
    tbody.innerHTML = "";

    report.months.forEach((m, idx) => {
      const tr = document.createElement("tr");

      const monthLabel = monthNames[idx].slice(0, 3); // abréviation

      const total = m.totalTTC;
      const paid = m.paidTTC;
      const unpaid = m.unpaidTTC;
      const count = m.paidCount + m.unpaidCount;
      const pct = total > 0 ? (paid / total) * 100 : 0;

      tr.innerHTML =
        `<td>${monthLabel}</td>` +
        `<td class="text-right">${formatEuroCA(m.totalHT)}</td>` +
        `<td class="text-right">${formatEuroCA(m.totalTVA)}</td>` +
        `<td class="text-right">${formatEuroCA(total)}</td>` +
        `<td class="text-right">${formatEuroCA(paid)}</td>` +
        `<td class="text-right">${formatEuroCA(unpaid)}</td>` +
        `<td class="text-right">${total > 0 ? pct.toFixed(1) + " %" : "–"}</td>` +
        `<td class="text-right">${count} (${m.paidCount} / ${m.unpaidCount})</td>`;

      tbody.appendChild(tr);
    });
  }

  // ===== Graphique barres =====
  const chart = document.getElementById("caChartBars");
  if (chart) {
    chart.innerHTML = "";

    const currentValues = report.months.map((m) => m.totalTTC);
    const prevValues = prevReport
      ? prevReport.months.map((m) => m.totalTTC)
      : [];
    const maxVal = Math.max(
      1,
      ...currentValues,
      ...(prevReport ? prevValues : [0]),
    );

    report.months.forEach((m, idx) => {
      const group = document.createElement("div");
      group.className = "ca-bar-group";

      const bar = document.createElement("div");
      bar.className = "ca-bar";
      const h = (m.totalTTC / maxVal) * 140; // 140px max
      bar.style.height = `${Math.round(h)}px`;

      group.appendChild(bar);

      if (prevReport) {
        const prevMonth = prevReport.months[idx];
        const barPrev = document.createElement("div");
        barPrev.className = "ca-bar-prev";
        const hp = (prevMonth.totalTTC / maxVal) * 140;
        barPrev.style.height = `${Math.round(hp)}px`;
        group.appendChild(barPrev);
      }

      const label = document.createElement("div");
      label.textContent = monthNames[idx].charAt(0); // J, F, M...
      group.appendChild(label);

      chart.appendChild(group);
    });

    const legendPrev = document.getElementById("caLegendPrevYear");
    if (legendPrev) {
      legendPrev.style.visibility = prevReport ? "visible" : "hidden";
    }
  }

  // ===== TVA annuelle =====
  const baseHTCell = document.getElementById("caTVABaseHT");
  const tvaCell = document.getElementById("caTVACollectee");
  const caTTCCell = document.getElementById("caTVACATTC");

  if (baseHTCell) baseHTCell.textContent = formatEuroCA(totalHT);
  if (tvaCell) tvaCell.textContent = formatEuroCA(totalTVA);
  if (caTTCCell) caTTCCell.textContent = formatEuroCA(totalTTC);
}

/* ===== Ouverture / fermeture ===== */

function openCAReport() {
  const overlay = document.getElementById("caReportOverlay");
  if (!overlay) return;

  initCAYearSelect();
  renderCAReport();

  overlay.classList.remove("hidden");
}

function closeCAReport() {
  const overlay = document.getElementById("caReportOverlay");
  if (!overlay) return;
  overlay.classList.add("hidden");

  // Désactive le bouton CA
  const tabCA = document.getElementById("tabCA");
  if (tabCA) tabCA.classList.remove("active");
}

/* ===== Exports CSV ===== */

function exportCAURSSAFCSV() {
  const yearSelect = document.getElementById("caYearSelect");
  if (!yearSelect) return;
  const value = yearSelect.value || "all";
  const year = value === "all" ? null : parseInt(value, 10) || null;

  // URSSAF = CA encaissé (factures payées) par mois
  const months = computeCAMonthsForYear(year);

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  let csv = "Mois;CA encaissé TTC\n";

  months.forEach((m, idx) => {
    csv += `${monthNames[idx]};${m.paidTTC.toFixed(2).replace(".", ",")}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = year ? `CA_URSSAF_${year}.csv` : "CA_URSSAF_toutes_annees.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportCAFullCSV() {
  const yearSelect = document.getElementById("caYearSelect");
  if (!yearSelect) return;
  const value = yearSelect.value || "all";
  const year = value === "all" ? null : parseInt(value, 10) || null;

  const docs = getAllDocuments().filter((d) => d.type === "facture" && d.date);

  let csv = "Numero;Date;Client;HT;TVA;TTC;Payee;Date_reglement;Mode\n";

  docs.forEach((d) => {
    const dt = new Date(d.date);
    const y = dt.getFullYear();
    if (year && y !== year) return;

    const dateStr = dt.toLocaleDateString("fr-FR");
    const statut = d.paid ? "OUI" : "NON";
    const dateReg = d.paymentDate
      ? new Date(d.paymentDate).toLocaleDateString("fr-FR")
      : "";
    const mode = d.paymentMode || "";

    const clientName = (d.client?.name || "").replace(/;/g, ",");

    csv +=
      [
        d.number || "",
        dateStr,
        clientName,
        Number(d.subtotal || 0)
          .toFixed(2)
          .replace(".", ","),
        Number(d.tvaAmount || 0)
          .toFixed(2)
          .replace(".", ","),
        Number(d.totalTTC || 0)
          .toFixed(2)
          .replace(".", ","),
        statut,
        dateReg,
        mode,
      ].join(";") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = year ? `CA_detail_${year}.csv` : "CA_detail_toutes_annees.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function isDevisExpired(docType, validityDate) {
  if (docType !== "devis" || !validityDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const v = new Date(validityDate);
  v.setHours(0, 0, 0, 0);
  return v.getTime() < today.getTime();
}

function refreshDevisStatusUI(docType, validityDate) {
  const info = document.getElementById("devisStatusInfo");
  if (!info) return;
  if (docType !== "devis" || !validityDate) {
    info.style.display = "none";
    info.textContent = "";
    return;
  }
  if (isDevisExpired(docType, validityDate)) {
    info.style.display = "block";
    info.textContent =
      "⚠ Ce devis est expiré en fonction de la date de validité.";
  } else {
    info.style.display = "none";
    info.textContent = "";
  }
}

// ================== LOCALSTORAGE DOCUMENTS ==================

function getAllDocuments() {
  const data = localStorage.getItem("documents");
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(
      "Données 'documents' corrompues dans localStorage, réinitialisation :",
      e,
    );
    localStorage.removeItem("documents");
    return [];
  }
}

function getDocument(id) {
  return getAllDocuments().find((d) => d.id === id) || null;
}

function saveDocuments(docs) {
  localStorage.setItem("documents", JSON.stringify(docs));

  // ✅ Refresh global après toute modification de documents
  if (typeof refreshAfterDocsChange === "function") {
    refreshAfterDocsChange();
    return;
  }

  // 🔁 Fallback (au cas où)
  if (typeof computeCA === "function") computeCA();
  if (typeof refreshMicroTVAState === "function") refreshMicroTVAState(false);
  if (typeof refreshHomeStats === "function") refreshHomeStats();

  // Popup CA ouverte ? → on rerender
  const overlay = document.getElementById("caReportOverlay");
  const isOpen = overlay && !overlay.classList.contains("hidden");
  if (isOpen && typeof renderCAReport === "function") {
    renderCAReport();
  }
}

function refreshAfterDocsChange() {
  if (typeof computeCA === "function") computeCA();
  if (typeof refreshMicroTVAState === "function") refreshMicroTVAState(false);
  if (typeof refreshHomeStats === "function") refreshHomeStats();

  // Si le menu CA est ouvert, on le met à jour
  const overlay = document.getElementById("caReportOverlay");
  const isOpen = overlay && !overlay.classList.contains("hidden");
  if (isOpen && typeof renderCAReport === "function") {
    renderCAReport();
  }
}

// ✅ Crée un nouveau devis/facture pré-rempli pour ce client
function createDocForClient(type, clientName) {
  try { closeClientSheetOverlay(); } catch (e) {}

  // 1) Aller dans la bonne vue (devis / factures)
  if (typeof openFromHome === "function") openFromHome(type);

  // 2) Créer un nouveau doc
  if (typeof resetForm === "function") resetForm(type);

  // 3) Pré-remplir client
  const c = _getClientByName(clientName);
  if (!c) return;

  const n = document.getElementById("clientName");
  const a = document.getElementById("clientAddress");
  const p = document.getElementById("clientPhone");
  const m = document.getElementById("clientEmail");

  if (n) n.value = c.name || "";
  if (a) a.value = c.address || "";
  if (p) p.value = c.phone || "";
  if (m) m.value = c.email || "";

  // (optionnel) déclenche les auto-fill si tu en as
  try { if (typeof onClientNameChange === "function") onClientNameChange(); } catch(e){}
}

// ✅ Ouvre planning et "saute" sur le 1er jour de la semaine où ce client apparaît
function openPlanningForClient(clientName) {
  try { closeClientSheetOverlay(); } catch (e) {}

  if (typeof showHome === "function") showHome();

  // laisse le temps au planning de se rendre
  setTimeout(() => {
    try { if (typeof renderPlanningWeek === "function") renderPlanningWeek(); } catch(e){}

    const name = (clientName || "").trim().toLowerCase();
    if (!name) return;

    // cherche dans la semaine courante
    const found = (window.currentPlanningData || []).find((d) =>
      (d.items || []).some((it) =>
        ((it.clientName || "") + "").trim().toLowerCase() === name
      )
    );

    if (found && typeof openPlanningDayDetails === "function") {
      openPlanningDayDetails(found.date);
    }

    // scroll planning
    const grid = document.getElementById("planningGrid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}



// ===== ENVOI EMAIL / WHATSAPP (DEVIS / FACTURE / CONTRAT) =====

let currentSendDoc = null;

// ---------- Helpers format ----------

// ========= FORMAT MONNAIE GLOBAL =========

function fmtMoney(v) {
  return typeof formatEuro === "function"
    ? formatEuro(v)
    : Number(v || 0).toFixed(2) + " €";
}

function _fmtDateFR(iso) {
  if (!iso) return "";
  try {
    if (typeof fromISO === "function") return fromISO(iso).replace(/-/g, "/");
  } catch (e) {}
  return String(iso);
}

// ---------- Helpers client ----------
function _getClientFromEntity(entity) {
  // Devis/Facture => entity.client
  if (entity?.client) return entity.client;

  // Contrat => pricing.client
  if (entity?.pricing?.client) return entity.pricing.client;

  // fallback
  return {
    name: entity?.clientName || entity?.pricing?.clientName || "",
    civility:
      entity?.clientCivility ||
      entity?.pricing?.clientCivility ||
      entity?.civility ||
      "",
    email: entity?.clientEmail || entity?.pricing?.clientEmail || "",
    phone: entity?.clientPhone || entity?.pricing?.clientPhone || "",
    type: entity?.clientType || entity?.pricing?.clientType || "",
  };
}

function _pickCivility(client = {}) {
  return (
    client.civility ||
    client.civilite ||
    client.civ ||
    client.title ||
    client.civilityLabel ||
    ""
  )
    .toString()
    .trim();
}

function _normalizeCivility(civRaw) {
  const v = (civRaw || "").toString().toLowerCase().trim();
  if (!v) return ""; // inconnu

  // Monsieur/Madame (y compris variantes)
  if (v.includes("monsieur et madame") || v.includes("madame et monsieur"))
    return "couple";
  if (v === "m" || v === "mr" || v === "m." || v.includes("monsieur"))
    return "monsieur";
  if (v === "mme" || v === "mrs" || v === "ms" || v.includes("madame"))
    return "madame";

  // Entreprise / Société
  if (
    v.includes("soc") ||
    v.includes("soci") ||
    v.includes("entreprise") ||
    v.includes("sarl") ||
    v.includes("sas") ||
    v.includes("sasu") ||
    v.includes("eurl") ||
    v.includes("sci") ||
    v.includes("agence") ||
    v.includes("syndic")
  )
    return "societe";

  return "";
}

function _buildGreeting(client = {}) {
  const name = (client?.name || "").toString().trim();
  const civNorm = _normalizeCivility(_pickCivility(client));

  // Pas de nom -> neutre
  if (!name) return "Bonjour,";

  // Couple
  if (civNorm === "couple") return "Bonjour Madame, Monsieur,";

  // Société -> pas de Monsieur/Madame
  if (civNorm === "societe") return `Bonjour ${name},`;

  if (civNorm === "monsieur") return `Bonjour Monsieur ${name},`;
  if (civNorm === "madame") return `Bonjour Madame ${name},`;

  return `Bonjour ${name},`;
}

// ---------- Helpers délai de paiement ----------

function _normalizeClientType(raw) {
  const v = (raw || "").toString().toLowerCase().trim();
  if (!v) return "particulier";

  if (
    v.includes("syndic") ||
    v.includes("agence") ||
    v.includes("pro") ||
    v.includes("profession") ||
    v.includes("immobilier") ||
    v.includes("soc") ||
    v.includes("entreprise")
  )
    return "pro";

  return "particulier";
}

function _getClientTypeFromEntity(entity, client) {
  return _normalizeClientType(
    entity?.clientType ||
      entity?.conditionsType ||
      entity?.client?.type ||
      entity?.pricing?.clientType ||
      entity?.pricing?.client?.type ||
      entity?.typeClient ||
      entity?.ctClientType ||
      client?.type,
  );
}

// ================== FACTURE : FORMAT CLIENT ==================

function _formatInvoiceServiceLabel(raw) {
  if (!raw) return "";

  let s = String(raw);

  // Supprime le nom à la fin (– Noclain Karine)
  s = s.replace(/\s*[-–]\s*[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?$/i, "");

  // Nettoyage technique
  s = s.replace(/entretien piscine/gi, "Entretien de piscine");
  s = s.replace(/prestations du/gi, "Prestations du");

  // Supprime les échéances techniques
  s = s.replace(/échéance\s+\d{1,2}\/\d{1,2}/gi, "");

  // Nettoyage espaces
  s = s.replace(/\s{2,}/g, " ").trim();

  return s;
}

function _detectInvoiceFrequency(raw) {
  const s = (raw || "").toLowerCase();

  if (s.includes("mensuel") || s.includes("échéance")) return "mensuelle";
  if (s.includes("trimestr")) return "trimestrielle";
  if (s.includes("semestr")) return "semestrielle";
  if (s.includes("annuel") || s.includes("année")) return "annuelle";

  return "";
}

// ---------- Builder message ----------
function buildSendMessage(entity) {
  const kind = entity?._kind || entity?.type || "document"; // "devis" | "facture" | "contrat"
  const client = _getClientFromEntity(entity);

  const greeting = _buildGreeting(client);
  const clientNameSafe =
    (client?.name || "").toString().trim() || "Madame, Monsieur";

  // Champs communs
  const number = (entity?.number || "").toString().trim();
  const subject = (entity?.subject || "").toString().trim();

  // Montant (TTC si dispo, sinon HT)
  const totalTTC =
    typeof entity?.totalTTC === "number"
      ? entity.totalTTC
      : typeof entity?.pricing?.totalTTC === "number"
        ? entity.pricing.totalTTC
        : typeof entity?.pricing?.totalHT === "number"
          ? entity.pricing.totalHT
          : null;

 const totalTxt = totalTTC != null ? fmtMoney(totalTTC) : "";


  // Dates devis
  const validity =
    kind === "devis" && entity?.validityDate
      ? _fmtDateFR(entity.validityDate)
      : "";

  // Contrat : période
  const periodStart = entity?.pricing?.startDate
    ? _fmtDateFR(entity.pricing.startDate)
    : "";
  const durationMonths =
    entity?.pricing?.durationMonths || entity?.durationMonths || "";
  const period =
    periodStart && durationMonths
      ? `à partir du ${periodStart} (durée ${durationMonths} mois)`
      : periodStart
        ? `à partir du ${periodStart}`
        : "";

  // Type client => délai paiement facture
  const clientType = _getClientTypeFromEntity(entity, client);

  const paymentDelayTxt =
    clientType === "pro"
      ? "sous 30 jours, conformément à nos conditions de règlement"
      : "sous 7 jours";

  // Signature
  const signature = `Cordialement,\nLoïc – AquaClim Prestige\n06 03 53 77 73`;

  let mailSubject = "";
  let body = "";

  // =========================
  // 1) DEVIS
  // =========================
  if (kind === "devis") {
    mailSubject = `Devis ${number}${subject ? " – " + subject : ""}`;
    const status = (entity?.status || "en_attente").toString();

    body = `${greeting}

Je vous adresse le devis ${number}${subject ? ` relatif à : ${subject}` : ""}${totalTxt ? `, pour un montant de ${totalTxt} TTC.` : "."}
${validity ? `\nValidité : jusqu’au ${validity}.` : ""}

Je reste à votre disposition pour toute précision ou ajustement.

${signature}`;

    if (status === "accepte") {
      body = `${greeting}

Suite à votre accord, je vous confirme l’envoi du devis ${number}${subject ? ` relatif à : ${subject}` : ""}${totalTxt ? `, pour un montant de ${totalTxt} TTC.` : "."}

Nous pouvons planifier l’intervention selon vos disponibilités.

${signature}`;
    }

    if (status === "expire") {
      body = `${greeting}

Je vous renvoie le devis ${number}${subject ? ` relatif à : ${subject}` : ""}${totalTxt ? `, pour un montant de ${totalTxt} TTC.` : "."}

Si vous souhaitez une mise à jour (dates / prestations / tarifs), je peux vous le rééditer rapidement.

${signature}`;
    }

    return { mailSubject, body };
  }

  // =========================
  // 2) FACTURE
  // =========================
  if (entity?.type === "facture") {
    const rawSubject = entity?.subject || "";
    const cleanLabel = _formatInvoiceServiceLabel(rawSubject);
    const frequency = _detectInvoiceFrequency(rawSubject);

    mailSubject = `Facture ${number}${cleanLabel ? " – " + cleanLabel : ""}`;

    const paid = !!entity?.paid;
    const freqTxt = frequency ? ` (facturation ${frequency})` : "";

    if (paid) {
      body = `${greeting}

Je vous transmets la facture acquittée ${number}${cleanLabel ? ` relative à ${cleanLabel}` : ""}${freqTxt}.
${totalTxt ? `Montant : ${totalTxt} TTC.` : ""}

Je vous remercie pour votre règlement et reste à votre disposition.

${signature}`;
    } else {
      body = `${greeting}

Je vous adresse la facture ${number}${cleanLabel ? ` relative à ${cleanLabel}` : ""}${freqTxt}.
${totalTxt ? `Montant : ${totalTxt} TTC.` : ""}

Je vous remercie de bien vouloir procéder au règlement ${paymentDelayTxt}.
Si vous souhaitez le RIB ou toute information complémentaire, je vous l’envoie immédiatement.

${signature}`;
    }

    return { mailSubject, body };
  }

  // =========================
  // 3) CONTRAT (fallback)
  // =========================
  mailSubject = `Contrat d’entretien${number ? " " + number : ""} – ${clientNameSafe}`;

  body = `${greeting}

Je vous transmets le contrat d’entretien${number ? " " + number : ""}${period ? ` (${period})` : ""}${totalTxt ? `, pour un montant total de ${totalTxt} TTC.` : "."}

Pour validation, merci de me confirmer votre accord (signature électronique ou mention “Bon pour accord”).
Dès validation, je vous confirme le planning d’intervention et, si nécessaire, l’échéancier de paiement.

${signature}`;

  return { mailSubject, body };
}

// ---------- Popup ----------
function openSendPopup() {
  if (!currentDocumentId) {
    showConfirmDialog({
      title: "Aucun document ouvert",
      message: "Ouvre d’abord un devis ou une facture avant de l’envoyer.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️",
    });
    return;
  }

  const doc = getDocument(currentDocumentId);
  if (!doc) return;

  currentSendDoc = doc;
  const { body } = buildSendMessage(doc);

  const infoEl = document.getElementById("sendDocInfo");
  const txtArea = document.getElementById("sendMessagePreview");
  const overlay = document.getElementById("sendPopup");

  if (infoEl) {
    const typeLabel =
      doc.type === "facture"
        ? "Facture"
        : doc.type === "devis"
          ? "Devis"
          : "Document";
    const clientName = doc?.client?.name || "";
    infoEl.textContent = `${typeLabel} ${doc.number || ""} – ${clientName}`;
  }

  if (txtArea) txtArea.value = body;

  if (overlay) {
    overlay.classList.remove("hidden");
    const popup = overlay.querySelector(".popup");
    if (popup) {
      void popup.offsetWidth;
      popup.classList.add("show");
    }
  }
}

function openSendPopupContract() {
  if (!currentContractId) {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Aucun contrat ouvert",
        message: "Ouvre d’abord un contrat avant de l’envoyer.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️"
      });
    } else {
      alert("Aucun contrat ouvert.");
    }
    return;
  }

  const contract = getContract(currentContractId);
  if (!contract) return;

  const popup = document.getElementById("sendPopup");
  const info = document.getElementById("sendPopupInfo");
  const textarea = document.getElementById("sendMessage");

  const company = getCompanySettings?.() || {};
  const clientName =
    contract.client?.name ||
    contract.pricing?.clientName ||
    "";

  const body =
`Bonjour,

Veuillez trouver ci-joint le contrat.

Cordialement,
${company.companyName || "AquaClim Prestige"}`;

  if (info) info.textContent = `Contrat – ${clientName}`;
  if (textarea) textarea.value = body;

  if (popup) {
    popup.classList.remove("hidden");

    // animation (si présente)
    const box = popup.querySelector(".popup");
    if (box) {
      void box.offsetWidth;
      box.classList.add("show");
    }
  }
}

function closeSendPopup() {
  const overlay = document.getElementById("sendPopup");
  if (!overlay) return;
  const popup = overlay.querySelector(".popup");
  if (popup) popup.classList.remove("show");
  overlay.classList.add("hidden");
  currentSendDoc = null;
}

// ---------- Email / WhatsApp ----------
function sendByEmail() {
  if (!currentSendDoc) return;

  const client = _getClientFromEntity(currentSendDoc);
  const email = client?.email ? client.email.trim() : "";

  if (!email) {
    showConfirmDialog({
      title: "Email manquant",
      message: "Aucune adresse email n’est renseignée pour ce client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  const { mailSubject } = buildSendMessage(currentSendDoc);
  const body =
    document.getElementById("sendMessagePreview")?.value || "";

  const url =
    "mailto:" +
    encodeURIComponent(email) +
    "?subject=" +
    encodeURIComponent(mailSubject) +
    "&body=" +
    encodeURIComponent(body);

  window.open(url, "_blank");

  closeSendPopup();
}


function _normalizePhoneToWhatsApp(phoneRaw) {
  if (!phoneRaw) return "";
  let p = String(phoneRaw).trim();

  // Retire tout sauf chiffres + +
  p = p.replace(/[^\d+]/g, "");

  // Si commence par 0 -> FR +33
  if (p.startsWith("0")) p = "+33" + p.slice(1);

  // Si pas de +, on suppose FR
  if (!p.startsWith("+")) p = "+33" + p;

  return p;
}

function sendByWhatsApp() {
  if (!currentSendDoc) return;

  const client = _getClientFromEntity(currentSendDoc);
  const phone = _normalizePhoneToWhatsApp(client?.phone || "");

  if (!phone) {
    showConfirmDialog({
      title: "Téléphone manquant",
      message: "Aucun numéro n’est renseigné pour ce client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  const body = document.getElementById("sendMessagePreview")?.value || "";

  // WhatsApp: wa.me ne prend pas le "+" => on enlève le +
  const waPhone = phone.replace("+", "");
  const url =
    "https://wa.me/" +
    encodeURIComponent(waPhone) +
    "?text=" +
    encodeURIComponent(body);

  openExternalLink(url);

  closeSendPopup();
}

// ================== LOCALSTORAGE ATTESTATIONS ==================

function getAllAttestations() {
  const data = localStorage.getItem("attestations");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Données 'attestations' corrompues, reset :", e);
    localStorage.removeItem("attestations");
    return [];
  }
}

function saveAttestations(list) {
  localStorage.setItem("attestations", JSON.stringify(list || []));

  // ✅ push Firestore (ou queue si offline)
  if (!db || !navigator.onLine) {
    (list || []).forEach((att) => {
      if (!att || !att.id) return;
      enqueueSync({
        collection: "attestations",
        action: "set",
        docId: att.id,
        data: att,
      });
    });
    updateOfflineBadge();
    return;
  }

  // online -> envoi direct
  (list || []).forEach((att) => {
    if (!att || !att.id) return;
    db.collection("attestations").doc(att.id).set(att, { merge: true }).catch((e)=> {
      console.error("Erreur Firestore attestation set:", e);
      enqueueSync({
        collection: "attestations",
        action: "set",
        docId: att.id,
        data: att,
      });
    });
  });

  processSyncQueue();
}


function saveAttestationOnly() {
  saveAttestationFromForm();
  closeAttestationPopup();
}

function autoCreateClimAttestationForInvoice(doc) {
  if (!doc) return;

  const list = getAllAttestations();

  // ⚠️ Si une attestation existe déjà pour cette facture, on ne recrée pas
  if (doc.id && list.some((att) => att.sourceDocId === doc.id)) {
    return;
  }

  // Données de base depuis la facture
  const name = (doc.client && doc.client.name) || "";
  const addr = (doc.client && doc.client.address) || "";
  const date = doc.date || new Date().toISOString().slice(0, 10);

  // 🔢 Nombre d’unités = somme des quantités sur les lignes de clim
  let units = 1;
  if (Array.isArray(doc.prestations)) {
    const climLines = doc.prestations.filter(
      (p) => p && ["entretien_clim", "depannage_clim"].includes(p.kind),
    );

    if (climLines.length) {
      const totalQty = climLines.reduce((sum, p) => {
        const q = Number(p.qty);
        return sum + (isNaN(q) ? 0 : q);
      }, 0);

      if (totalQty > 0) {
        units = totalQty; // ex : 3 splits → 3 unités
      }
    }
  }

  const record = {
    id: generateId("ATT"),
    type: "attestation_clim",
    clientName: name,
    clientAddress: addr,
    date,
    units,
    notes: "",
    createdAt: new Date().toISOString(),
    sourceDocId: doc.id || null,
    sourceDocNumber: doc.number || null,
  };

  list.push(record);
  saveAttestations(list);

  // Si tu es sur l’onglet Attestations, on rafraîchit la liste
  if (typeof loadAttestationsList === "function") {
    loadAttestationsList();
  }
}

// ================== PHOTOS RAPPORT ==================
let currentRapportPhotos = []; // [{ dataUrl, name, ts }]

function _isImageFile(file) {
  return file && file.type && file.type.startsWith("image/");
}

function _resizeImageFileToDataUrl(
  file,
  maxW = 1400,
  maxH = 1400,
  quality = 0.78,
) {
  return new Promise((resolve, reject) => {
    if (!_isImageFile(file)) return reject(new Error("Fichier non image"));

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture fichier impossible"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image invalide"));
      img.onload = () => {
        let w = img.width;
        let h = img.height;

        const ratio = Math.min(maxW / w, maxH / h, 1);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function _renderRapportPhotosPreview() {
  const box = document.getElementById("rapPhotosPreview");
  if (!box) return;

  if (
    !Array.isArray(currentRapportPhotos) ||
    currentRapportPhotos.length === 0
  ) {
    box.innerHTML = `<div style="opacity:.7;font-size:12px;">Aucune photo ajoutée.</div>`;
    return;
  }

  box.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:10px;">
      ${currentRapportPhotos
        .map(
          (p, idx) => `
        <div style="width:120px;border:1px solid #e6e6e6;border-radius:10px;padding:8px;background:#fff;">
          <img src="${p.dataUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;display:block;">
          <button
            type="button"
            class="btn btn-danger btn-small"
            style="width:100%;margin-top:8px;"
            onclick="removeRapportPhoto(${idx})"
          >🗑️ Supprimer</button>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

async function onRapportPhotosSelected(evt) {
  const files = Array.from(evt.target.files || []);
  if (!files.length) return;

  for (const f of files) {
    if (!_isImageFile(f)) continue;

    try {
      const dataUrl = await _resizeImageFileToDataUrl(f, 1400, 1400, 0.78);
      currentRapportPhotos.push({
        dataUrl,
        name: f.name || "photo",
        ts: Date.now(),
      });
    } catch (e) {
      console.error("Erreur resize photo rapport:", e);
    }
  }

  evt.target.value = "";
  _renderRapportPhotosPreview();
}

// ============ LOCALSTORAGE RAPPORTS ============

function getAllRapports() {
  const data = localStorage.getItem("rapports");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Données 'rapports' corrompues, reset :", e);
    localStorage.removeItem("rapports");
    return [];
  }
}

function saveRapports(list) {
  localStorage.setItem("rapports", JSON.stringify(list || []));

  // ✅ push Firestore (ou queue si offline)
  if (!db || !navigator.onLine) {
    (list || []).forEach((r) => {
      if (!r || !r.id) return;
      enqueueSync({
        collection: "rapports",
        action: "set",
        docId: r.id,
        data: r,
      });
    });
    updateOfflineBadge();
    return;
  }

  // online -> envoi direct
  (list || []).forEach((r) => {
    if (!r || !r.id) return;
    db.collection("rapports").doc(r.id).set(r, { merge: true }).catch((e)=> {
      console.error("Erreur Firestore rapport set:", e);
      enqueueSync({
        collection: "rapports",
        action: "set",
        docId: r.id,
        data: r,
      });
    });
  });

  processSyncQueue();
}


function _fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function _onRapportPhotosChange() {
  const input = document.getElementById("rapPhotosInput");
  if (!input || !input.files) return;

  const files = Array.from(input.files || []);
  for (const f of files) {
    const dataUrl = await _fileToDataUrl(f);
    currentRapportPhotosTemp.push({
      name: f.name,
      type: f.type || "image/jpeg",
      dataUrl,
    });
  }

  input.value = "";
  renderRapportPhotosPreview();
}

function removeRapportPhoto(index) {
  // Supporte les 2 structures (ancienne + nouvelle)
  if (Array.isArray(window.currentRapportPhotosTemp)) {
    currentRapportPhotosTemp.splice(index, 1);
  } else if (Array.isArray(window.currentRapportPhotos)) {
    currentRapportPhotos = currentRapportPhotos.filter((_, i) => i !== index);
  }

  // Supporte les 2 renderers
  if (typeof renderRapportPhotosPreview === "function") {
    renderRapportPhotosPreview();
  } else if (typeof _renderRapportPhotosPreview === "function") {
    _renderRapportPhotosPreview();
  }
}


function renderRapportPhotosPreview() {
  const box = document.getElementById("rapPhotosPreview");
  if (!box) return;

  if (!currentRapportPhotosTemp.length) {
    box.innerHTML = `<div style="color:#888;font-size:13px;">Aucune photo</div>`;
    return;
  }

  box.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:10px;">
      ${currentRapportPhotosTemp
        .map(
          (p, i) => `
        <div style="width:140px;border:1px solid #e5e7eb;border-radius:10px;padding:8px;">
          <img src="${p.dataUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;display:block;">
          <div style="font-size:11px;color:#555;margin-top:6px;word-break:break-word;">${escapeHtml(p.name || "")}</div>
          <button type="button" class="btn btn-danger btn-small" style="margin-top:6px;width:100%;"
            onclick="removeRapportPhoto(${i})">Supprimer</button>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

async function _onRapportFilesChange() {
  const input = document.getElementById("rapFilesInput");
  if (!input || !input.files) return;

  const files = Array.from(input.files || []);
  for (const f of files) {
    const dataUrl = await _fileToDataUrl(f);
    currentRapportAttachmentsTemp.push({
      name: f.name,
      type: f.type || "application/octet-stream",
      dataUrl,
    });
  }

  input.value = "";
  renderRapportFilesList();
}

function removeRapportFile(index) {
  currentRapportAttachmentsTemp.splice(index, 1);
  renderRapportFilesList();
}

function renderRapportFilesList() {
  const box = document.getElementById("rapFilesList");
  if (!box) return;

  if (!currentRapportAttachmentsTemp.length) {
    box.innerHTML = `<div style="color:#888;font-size:13px;">Aucun document joint</div>`;
    return;
  }

  box.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${currentRapportAttachmentsTemp
        .map(
          (f, i) => `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #e5e7eb;border-radius:10px;padding:8px 10px;">
          <div style="font-size:13px;color:#333;word-break:break-word;">
            📎 ${escapeHtml(f.name || "document")}
          </div>
          <button type="button" class="btn btn-danger btn-small" onclick="removeRapportFile(${i})">Supprimer</button>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function saveRapportFromForm() {
  const name = document.getElementById("rapClientName")?.value || "";
  const addr = document.getElementById("rapClientAddress")?.value || "";
  const date = document.getElementById("rapDate")?.value || "";
  const notes = document.getElementById("rapNotes")?.value || "";
  const typeId = document.getElementById("rapportType")?.value || "";

  const tpl = RAPPORT_TEMPLATES.find((t) => t.id === typeId) || null;

  const phInput = document.getElementById("rapPH");
  const chloreInput = document.getElementById("rapChlore");
  const phValue = phInput ? phInput.value.trim() : "";
  const chloreValue = chloreInput ? chloreInput.value.trim() : "";

  // Items cochés
  const sectionsData = [];
  document
    .querySelectorAll("#rapportChecklist .rapport-section")
    .forEach((sectionEl) => {
      const title = sectionEl.querySelector("h4")?.textContent || "";
      const items = [];
      sectionEl.querySelectorAll("input[type='checkbox']").forEach((cb) => {
        if (cb.checked) items.push(cb.dataset.text || "");
      });
      if (items.length) sectionsData.push({ title, items });
    });

  const list = getAllRapports();
  let record;

  if (currentRapportId) {
    // ✏️ on met à jour
    const idx = list.findIndex((r) => r.id === currentRapportId);
    if (idx !== -1) {
      record = {
        ...list[idx],
        typeId,
        typeLabel: tpl ? tpl.label : "",
        clientName: name,
        clientAddress: addr,
        date,
        notes,
        sections: sectionsData,
        photos: Array.isArray(currentRapportPhotosTemp)
          ? currentRapportPhotosTemp
          : [],
        attachments: Array.isArray(currentRapportAttachmentsTemp)
          ? currentRapportAttachmentsTemp
          : [],
        analysis: {
          ph: phValue || null,
          chlore: chloreValue || null,
        },
      };
      list[idx] = record;
    } else {
      // fallback création
      record = {
        id: generateId("RAP"),
        typeId,
        typeLabel: tpl ? tpl.label : "",
        clientName: name,
        clientAddress: addr,
        date,
        notes,
        sections: sectionsData,
        photos: Array.isArray(currentRapportPhotosTemp)
          ? currentRapportPhotosTemp
          : [],

        attachments: Array.isArray(currentRapportAttachmentsTemp)
          ? currentRapportAttachmentsTemp
          : [],

        analysis: {
          ph: phValue || null,
          chlore: chloreValue || null,
        },
        createdAt: new Date().toISOString(),
        sourceDocId:
          (currentAttestationSource && currentAttestationSource.id) || null,
        sourceDocNumber:
          (currentAttestationSource && currentAttestationSource.number) || null,
      };
      list.push(record);
    }
  } else {
    // ➕ création
    record = {
      id: generateId("RAP"),
      typeId,
      typeLabel: tpl ? tpl.label : "",
      clientName: name,
      clientAddress: addr,
      date,
      notes,
      sections: sectionsData,
      photos: Array.isArray(currentRapportPhotosTemp)
        ? currentRapportPhotosTemp
        : [],

      attachments: Array.isArray(currentRapportAttachmentsTemp)
        ? currentRapportAttachmentsTemp
        : [],

      analysis: {
        ph: phValue || null,
        chlore: chloreValue || null,
      },
      createdAt: new Date().toISOString(),
      sourceDocId:
        (currentAttestationSource && currentAttestationSource.id) || null,
      sourceDocNumber:
        (currentAttestationSource && currentAttestationSource.number) || null,
    };
    list.push(record);
  }

  saveRapports(list);
  currentRapportId = record.id;

  if (typeof loadRapportsList === "function") {
    loadRapportsList();
  }
}

function saveRapportOnly() {
  saveRapportFromForm();
  closeRapportPopup();
}

function loadRapportsList() {
  const tbody = document.getElementById("rapportsTableBody");
  if (!tbody) return;

  const list = getAllRapports()
    .slice()
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="no-docs-cell">
          Aucun rapport enregistré pour le moment
        </td>
      </tr>
    `;
    return;
  }

  list.forEach((r) => {
    const tr = document.createElement("tr");

    const frDate = r.date ? r.date.split("-").reverse().join("/") : "";
    const source = r.sourceDocNumber ? `Facture ${r.sourceDocNumber}` : "";

    tr.innerHTML = `
      <td>${frDate}</td>
      <td>${escapeHtml(r.clientName || "")}</td>
      <td>${escapeHtml(r.typeLabel || "")}</td>
      <td>${escapeHtml(source)}</td>
      <td class="col-actions"></td>
    `;

    const tdActions = tr.querySelector(".col-actions");

    const btnOpen = document.createElement("button");
    btnOpen.className = "btn btn-small btn-primary";
    btnOpen.textContent = "Ouvrir";
    btnOpen.onclick = () => openRapportPopupForEdit(r.id);

    const btnPreview = document.createElement("button");
    btnPreview.className = "btn btn-small btn-secondary";
    btnPreview.textContent = "Aperçu";
    btnPreview.onclick = () => openRapportPreview(r.id);

    const btnPrint = document.createElement("button");
    btnPrint.className = "btn btn-small btn-success";
    btnPrint.textContent = "Imprimer";
    btnPrint.onclick = () => printRapport(r.id);

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn btn-small btn-danger";
    btnDelete.textContent = "Supprimer";
    btnDelete.onclick = () => deleteRapport(r.id);

    tdActions.appendChild(btnOpen);
    tdActions.appendChild(btnPreview);
    tdActions.appendChild(btnPrint);
    tdActions.appendChild(btnDelete);

    tbody.appendChild(tr);
  });
}
function _escapeTextForWord(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function exportRapportWord(rapId) {
  const record = (getAllRapports() || []).find((r) => r.id === rapId);
  if (!record) return;

  const frDate = record.date ? record.date.split("-").reverse().join("/") : "";
  const company = getCompanySettings();

  const sectionsHtml = (record.sections || [])
    .map((sec) => {
      const items = (sec.items || [])
        .map((it) => `<li>${_escapeTextForWord(it)}</li>`)
        .join("");
      return `
      <h3 style="color:#1976d2;margin:16px 0 8px;">${_escapeTextForWord(sec.title || "")}</h3>
      <ul>${items}</ul>
    `;
    })
    .join("");

  const notesHtml = record.notes
    ? `<h3 style="color:#1976d2;margin:16px 0 8px;">Remarques / anomalies</h3><p>${_escapeTextForWord(record.notes).replace(/\n/g, "<br>")}</p>`
    : "";

  const photosHtml = (record.photos || [])
    .filter((p) => p && p.dataUrl)
    .map(
      (p) => `
      <div style="margin:10px 0;">
        <img src="${p.dataUrl}" style="max-width:650px;width:100%;height:auto;border:1px solid #ddd;border-radius:8px;">
        <div style="font-size:11px;color:#666;margin-top:4px;">${_escapeTextForWord(p.name || "")}</div>
      </div>
    `,
    )
    .join("");

  const attachmentsHtml = (record.attachments || []).length
    ? `
      <h3 style="color:#1976d2;margin:16px 0 8px;">Documents joints</h3>
      <ul>
        ${(record.attachments || []).map((a) => `<li>${_escapeTextForWord(a.name || "document")}</li>`).join("")}
      </ul>
    `
    : "";

  const html = `
  <html><head><meta charset="utf-8"></head>
  <body style="font-family:Calibri,Arial;">
    <h1 style="margin:0;color:#1976d2;">Rapport d’intervention</h1>
    <p style="margin:6px 0 12px;color:#444;">
      <strong>${_escapeTextForWord(company.companyName || "AquaClim Prestige")}</strong><br>
      ${_escapeTextForWord(company.legalName || "")} – ${_escapeTextForWord(company.address || "")}<br>
      Tél : ${_escapeTextForWord(company.phone || "")} – Email : ${_escapeTextForWord(company.email || "")}
    </p>

    <hr>

    <h2 style="margin:12px 0 6px;">Client</h2>
    <p style="margin:0 0 10px;">
      <strong>${_escapeTextForWord(record.clientName || "")}</strong><br>
      ${_escapeTextForWord(record.clientAddress || "")}
    </p>

    <h2 style="margin:12px 0 6px;">Intervention</h2>
    <p style="margin:0 0 10px;">
      Date : ${_escapeTextForWord(frDate)}<br>
      Type : ${_escapeTextForWord(record.typeLabel || "")}
    </p>

    ${sectionsHtml}
    ${notesHtml}

    ${photosHtml ? `<h3 style="color:#1976d2;margin:16px 0 8px;">Photos</h3>${photosHtml}` : ""}

    ${attachmentsHtml}
  </body></html>`;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);

  const safeName = record.clientName
    ? record.clientName.replace(/[^a-z0-9\-]+/gi, "_")
    : "intervention";
  const a = document.createElement("a");
  a.href = url;
  a.download = `rapport-${safeName}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportRapportWordCurrent() {
  // si pas encore sauvegardé, on sauvegarde d'abord pour avoir un id + stocker photos/docs
  saveRapportFromForm();
  exportRapportWord(currentRapportId);
}

function transferRapportToClient(rapId) {
  const record = (getAllRapports() || []).find((r) => r.id === rapId);
  if (!record) return;

  // on tente de récupérer email/tel depuis ta base clients via le nom
  const client = (getClients() || []).find(
    (c) => (c.name || "") === (record.clientName || ""),
  );
  const phone = client?.phone || "";
  const email = client?.email || "";

  const frDate = record.date ? record.date.split("-").reverse().join("/") : "";
  const company = getCompanySettings();

  const msg = `Bonjour,

Je vous transmets le rapport d’intervention du ${frDate}.

Cordialement,
${company.companyName || "AquaClim Prestige"}`;

  showConfirmDialog({
    title: "Transférer au client",
    message:
      "Comment souhaitez-vous envoyer ce rapport ? (Le PDF va s’ouvrir, tu pourras l’ajouter en pièce jointe.)",
    confirmLabel: "💬 WhatsApp",
    cancelLabel: "✉️ Email",
    variant: "info",
    icon: "📤",
    showCloseButton: true,
    onConfirm: () => {
      if (!phone) {
        showConfirmDialog({
          title: "WhatsApp indisponible",
          message:
            "Aucun numéro trouvé pour ce client (vérifie la fiche client).",
          confirmLabel: "OK",
          cancelLabel: "",
          variant: "warning",
          icon: "⚠️",
        });
        return;
      }
      // ouvre le PDF
      generatePDFRapportFromRecord(record, "preview");

      // ouvre WhatsApp
      const wa = phone.replace(/\D/g, "");
      const url = `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
      openExternalLink(url);
 
    },
    onCancel: () => {
      if (!email) {
        showConfirmDialog({
          title: "Email indisponible",
          message:
            "Aucune adresse email trouvée pour ce client (vérifie la fiche client).",
          confirmLabel: "OK",
          cancelLabel: "",
          variant: "warning",
          icon: "⚠️",
        });
        return;
      }
      // ouvre le PDF
      generatePDFRapportFromRecord(record, "preview");

      // ouvre l’email
      const subject = `Rapport d’intervention - ${record.clientName || ""} - ${frDate}`;
      const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
      window.location.href = mailto;
    },
  });
}

function transferRapportToClientCurrent() {
  saveRapportFromForm();
  transferRapportToClient(currentRapportId);
}

// =====================================
// PDF VIEWER – iPhone / PWA (FUSION)
// =====================================
let lastAppViewBeforePDF = null;

function getCurrentAppView() {
  const views = [
    "homeView",
    "listView",
    "formView",
    "contractView",
    "attestationView",
    "settingsView"
  ];

  return views.find(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("hidden");
  });
}

function openPdfViewer(url) {
  const ios = isIOS();
  const pwa = isStandalonePWA();

  // ✅ PC / Android => comportement inchangé : nouvel onglet
  if (!ios) {
    window.open(url, "_blank");
    return;
  }

  // ✅ Safari iPhone (pas PWA) => nouvel onglet
  if (ios && !pwa) {
    window.open(url, "_blank");
    return;
  }

  // ✅ PWA iOS => overlay / iframe ONLY (JAMAIS window.open)
  const overlay = document.getElementById("pdfViewerOverlay");
  const frame = document.getElementById("pdfViewerFrame");

  if (!overlay || !frame) {
    alert("Aperçu PDF indisponible (viewer manquant). Ouvre depuis Safari.");
    return;
  }

  lastAppViewBeforePDF = getCurrentAppView();

  frame.src = "about:blank";
  setTimeout(() => {
    frame.src = url;
    overlay.classList.remove("hidden");
    overlay.scrollTop = 0;
  }, 30);

  try {
    history.pushState({ pdfOpen: true }, "", location.href);
  } catch (e) {}
}

function openExternalLink(url) {
  // PWA iOS => on "sort" proprement via location (pas d'iframe)
  if (isIOS() && isStandalonePWA()) {
    window.open(url, "_blank");

    return;
  }
  // Sinon nouvel onglet
  window.open(url, "_blank");
}



function bindPdfViewerCloseUX() {
  const overlay = document.getElementById("pdfViewerOverlay");
  if (!overlay || window.__pdfViewerUXBound) return;
  window.__pdfViewerUXBound = true;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePdfViewer();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const ov = document.getElementById("pdfViewerOverlay");
      if (ov && !ov.classList.contains("hidden")) closePdfViewer();
    }
  });
}

document.addEventListener("DOMContentLoaded", bindPdfViewerCloseUX);



function closePdfViewer() {
  const overlay = document.getElementById("pdfViewerOverlay");
  const frame = document.getElementById("pdfViewerFrame");

  if (frame) frame.src = "about:blank";
  if (overlay) overlay.classList.add("hidden");

  // si on a pushState → back ferme l’état PDF
  try {
    if (history.state && history.state.pdfOpen) {
      history.back();
      return;
    }
  } catch (e) {}

  // fallback : retour vue précédente
  if (lastAppViewBeforePDF && typeof showView === "function") {
    showView(lastAppViewBeforePDF);
  } else if (typeof showHome === "function") {
    showHome();
  }
}

// Bind popstate UNE seule fois
if (!window.__pdfViewerPopstateBound) {
  window.__pdfViewerPopstateBound = true;

  window.addEventListener("popstate", () => {
    const overlay = document.getElementById("pdfViewerOverlay");
    if (overlay && !overlay.classList.contains("hidden")) {
      // fermeture "soft" (sans reboucler sur history.back)
      const frame = document.getElementById("pdfViewerFrame");
      if (frame) frame.src = "about:blank";
      overlay.classList.add("hidden");

      if (lastAppViewBeforePDF && typeof showView === "function") {
        showView(lastAppViewBeforePDF);
      } else if (typeof showHome === "function") {
        showHome();
      }
    }
  });
}



function _pdfUrlForViewer(doc) {
  return getPdfUrl(doc);
}



function generatePDFRapportFromRecord(record, mode = "print") {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("Librairie jsPDF manquante.");
    return;
  }

  const doc = new window.jspdf.jsPDF();

  // ========= BANDEAU HAUT =========
  doc.setFillColor(25, 118, 210);
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AquaClim Prestige", 12, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Entretien & Dépannage – Climatisation & Piscine", 12, 22);

  // Cartouche titre à droite
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(130, 8, 70, 14, 2, 2, "F");
  doc.setTextColor(25, 118, 210);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RAPPORT TECHNIQUE", 133, 17);

  // ========= INFOS SOCIÉTÉ =========
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let y = 34;
  const company = getCompanySettings();
  doc.text(`${company.legalName} – ${company.address}`, 12, y);
  y += 5;
  doc.text(`Tél : ${company.phone} – Email : ${company.email}`, 12, y);
  // ========= TITRE DOCUMENT =========
  y += 10;
  const title = record.typeLabel || "Rapport d’intervention";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text(title, 12, y);
  y += 6;

  doc.setDrawColor(220);
  doc.line(12, y, 198, y);
  y += 8;

  // ========= ENCAR CLIENT / INTERVENTION =========
  const frDate = record.date ? record.date.split("-").reverse().join("/") : "";

  // Bloc client
  doc.setFillColor(248, 249, 252);
  doc.roundedRect(12, y, 90, 30, 2, 2, "F");
  doc.setDrawColor(225, 228, 234);
  doc.roundedRect(12, y, 90, 30, 2, 2);

  let yy = y + 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(33, 33, 33);
  doc.text("Client", 16, yy);
  yy += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (record.clientName) {
    doc.text(record.clientName, 16, yy);
    yy += 4;
  }
  if (record.clientAddress) {
    const addrLines = doc.splitTextToSize(record.clientAddress, 80);
    addrLines.forEach((line) => {
      doc.text(line, 16, yy);
      yy += 4;
    });
  }

  // Bloc intervention
  doc.setFillColor(248, 249, 252);
  doc.roundedRect(110, y, 88, 30, 2, 2, "F");
  doc.setDrawColor(225, 228, 234);
  doc.roundedRect(110, y, 88, 30, 2, 2);

  yy = y + 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(33, 33, 33);
  doc.text("Intervention", 114, yy);
  yy += 5;

  doc.setFont("helvetica", "normal");
  if (frDate) {
    doc.text("Date : " + frDate, 114, yy);
    yy += 4;
  }
  if (record.typeLabel) {
    doc.text("Type : " + record.typeLabel, 114, yy);
    yy += 4;
  }

  y += 38;

  // ========= BLOC ANALYSE DE L’EAU (SI PRÉSENT) =========
  if (record.analysis && (record.analysis.ph || record.analysis.chlore)) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(25, 118, 210);
    doc.text("Analyse de l’eau", 12, y);
    y += 5;
    doc.setDrawColor(230);
    doc.line(12, y, 198, y);
    y += 5;

    doc.setFillColor(249, 250, 252);
    doc.roundedRect(12, y, 186, 20, 2, 2, "F");
    doc.setDrawColor(230);
    doc.roundedRect(12, y, 186, 20, 2, 2);

    let ax = 16;
    let ay = y + 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    if (record.analysis.ph) {
      doc.text(`pH mesuré : ${record.analysis.ph}`, ax, ay);
      ay += 5;
      doc.setTextColor(120, 120, 120);
      doc.text("Plage recommandée : 7,2 – 7,6", ax, ay);
      doc.setTextColor(50, 50, 50);
    }

    if (record.analysis.chlore) {
      let ax2 = 110;
      let ay2 = y + 7;
      doc.setTextColor(50, 50, 50);
      doc.text(`Chlore libre : ${record.analysis.chlore} mg/L`, ax2, ay2);
      ay2 += 5;
      doc.setTextColor(120, 120, 120);
      doc.text("Plage recommandée : 1,0 – 3,0 mg/L", ax2, ay2);
      doc.setTextColor(50, 50, 50);
    }

    y += 26;
  }

  // ========= CHECKLIST / SECTIONS =========
  (record.sections || []).forEach((sec) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(25, 118, 210);
    doc.text(sec.title || "", 12, y);
    y += 5;
    doc.setDrawColor(230);
    doc.line(12, y, 198, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    (sec.items || []).forEach((txtRaw) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      // 🔧 on enlève les éventuelles puces déjà présentes dans le texte ("• ", "-", etc.)
      const clean = (txtRaw || "").replace(/^[•●\-–]\s*/, "");

      // pastille bleue
      doc.setFillColor(25, 118, 210);
      doc.circle(14, y - 1.5, 1, "F");

      const wrapped = doc.splitTextToSize(clean, 178);
      wrapped.forEach((line) => {
        doc.text(line, 18, y);
        y += 5;
      });
      y += 1;
    });

    y += 3;
  });

  // ========= REMARQUES =========
  if (record.notes) {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(25, 118, 210);
    doc.text("Remarques / anomalies", 12, y);
    y += 5;
    doc.setDrawColor(230);
    doc.line(12, y, 198, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const wrapped = doc.splitTextToSize(record.notes, 180);
    wrapped.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 14, y);
      y += 5;
    });
  }
  // ========= PHOTOS =========
  const photos = Array.isArray(record.photos) ? record.photos : [];
  if (photos.length) {
    // ✅ Anti-titre orphelin : si titre + 1ère ligne de photos ne tient pas, on saute page AVANT "Photos"
    const imgH = 58; // (garde la même valeur que plus bas)
    const titleH = 6; // hauteur du titre "Photos"
    const rowGap = 6; // marge après une ligne de photos
    const pageBottom = 275; // ta limite actuelle (tu l'utilises plus bas)
    const topY = 20;

    const minBlock = titleH + imgH + rowGap; // titre + au moins 1 photo dessous

    if (y + minBlock > pageBottom) {
      doc.addPage();
      y = topY;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(25, 118, 210);
    doc.text("Photos", 12, y);
    y += 6;

    const pageW = 210;
    const marginX = 12;
    const gap = 6;
    const colW = (pageW - marginX * 2 - gap) / 2;

    let col = 0;

    for (const p of photos) {
      if (!p || !p.dataUrl) continue;

      if (y + imgH > 275) {
        doc.addPage();
        y = 20;
        col = 0;
      }

      const x = marginX + (col === 0 ? 0 : colW + gap);
      try {
        doc.addImage(p.dataUrl, "JPEG", x, y, colW, imgH, undefined, "FAST");
      } catch (e) {
        console.error("addImage photo rapport error:", e);
      }

      col = (col + 1) % 2;
      if (col === 0) y += imgH + 6;
    }

    if (col !== 0) y += imgH + 6;
  }

  // ========= PIED =========
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "AquaClim Prestige – SIRET XXXXXXXXXXXXX – Entretien & Dépannage climatisation / piscine",
    105,
    287,
    { align: "center" },
  );

  const fileName =
    "rapport-" +
    (record.clientName
      ? record.clientName.replace(/[^a-z0-9\-]+/gi, "_")
      : "intervention") +
    ".pdf";

  if (mode === "download") {
    doc.save(fileName);
  } else {
if (mode === "print" && !isIOS()) {
  doc.autoPrint();
}

const url = getPdfUrl(doc);
openPdfViewer(url);


  }
}

function openRapportPreview(rapportId) {
  const list = getAllRapports();
  const rec = list.find((r) => r.id === rapportId);
  if (!rec) return;
  generatePDFRapportFromRecord(rec, "preview");
}

function printRapport(rapportId) {
  const list = getAllRapports();
  const rec = list.find((r) => r.id === rapportId);
  if (!rec) return;
  generatePDFRapportFromRecord(rec, "print");
}

function downloadRapport(rapId) {
  const list = getAllRapports();
  const record = list.find((r) => r.id === rapId);
  if (!record) return;
  generatePDFRapportFromRecord(record);
}

function deleteRapport(rapId) {
  showConfirmDialog({
    title: "Supprimer ce rapport",
    message: "Voulez-vous vraiment supprimer ce rapport d’intervention ?",
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "🗑️",
    onConfirm: () => {
      const list = getAllRapports().filter((r) => r.id !== rapId);
      saveRapports(list);
      loadRapportsList();

      // ✅ delete Firestore (ou queue)
      if (!db || !navigator.onLine) {
        enqueueSync({
          collection: "rapports",
          action: "delete",
          docId: rapId,
        });
        updateOfflineBadge();
        return;
      }

      db.collection("rapports").doc(rapId).delete().catch((e) => {
        console.error("Erreur Firestore delete rapport:", e);
        enqueueSync({
          collection: "rapports",
          action: "delete",
          docId: rapId,
        });
      });

      processSyncQueue();
    },
  });
}


function openRapportPopupForEdit(rapportId) {
  const list = getAllRapports();
  const rec = list.find((r) => r.id === rapportId);
  if (!rec) return;

  currentRapportId = rec.id;

  document.getElementById("rapClientName").value = rec.clientName || "";
  document.getElementById("rapClientAddress").value = rec.clientAddress || "";
  document.getElementById("rapDate").value = rec.date || "";
  document.getElementById("rapNotes").value = rec.notes || "";
  document.getElementById("rapportType").value = rec.typeId || "";

  // 🔹 on affiche/cache l’analyse selon le type du rapport
  updateRapportAnalyseVisibility(rec.typeId || "");

  rebuildRapportChecklist();

  if (rec.analysis) {
    const phEl = document.getElementById("rapPH");
    const chlEl = document.getElementById("rapChlore");
    if (phEl) phEl.value = rec.analysis.ph || "";
    if (chlEl) chlEl.value = rec.analysis.chlore || "";
  }
  // ===== PHOTOS RAPPORT (EDIT) =====

  currentRapportPhotosTemp = Array.isArray(rec.photos)
    ? rec.photos.slice()
    : [];
  currentRapportAttachmentsTemp = Array.isArray(rec.attachments)
    ? rec.attachments.slice()
    : [];
  renderRapportPhotosPreview();
  renderRapportFilesList();

  const overlay = document.getElementById("rapportPopup");
  if (!overlay) return;
  overlay.classList.remove("hidden");

  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth;
    popup.classList.add("show");
  }
}

// ================== NUMÉROTATION DOCUMENTS ==================

function getNextNumber(type) {
  const year = new Date().getFullYear();
  const prefix = type === "devis" ? "DEV" : "FAC";
  const docs = getAllDocuments().filter(
    (d) => d.type === type && typeof d.number === "string",
  );

  const used = [];
  docs.forEach((d) => {
    const m = d.number.match(/^([A-Z]{3})-(\d{4})-(\d{3})$/);
    if (!m) return;
    if (m[1] !== prefix) return;
    const docYear = parseInt(m[2], 10);
    const num = parseInt(m[3], 10);
    if (docYear === year && !isNaN(num)) used.push(num);
  });

  used.sort((a, b) => a - b);
  let next = 1;
  for (let i = 0; i < used.length; i++) {
    if (used[i] === next) next++;
    else if (used[i] > next) break;
  }
  return prefix + "-" + year + "-" + String(next).padStart(3, "0");
}

function generateId(prefix) {
  // ID du style "FAC-1735665123456-042381"
  const rnd = Math.floor(Math.random() * 1e6)
    .toString()
    .padStart(6, "0");
  return `${prefix}-${Date.now()}-${rnd}`;
}

function getNextContractReference() {
  const year = new Date().getFullYear();
  const prefix = "CTR"; // comme DEV / FAC mais pour les contrats

  const contracts = getAllContracts();
  const used = [];

  contracts.forEach((c) => {
    const ref = c?.client?.reference;
    if (typeof ref !== "string") return;

    const m = ref.match(/^([A-Z]{3})-(\d{4})-(\d{3})$/);
    if (!m) return;
    if (m[1] !== prefix) return;

    const refYear = parseInt(m[2], 10);
    const num = parseInt(m[3], 10);
    if (refYear === year && !isNaN(num)) used.push(num);
  });

  used.sort((a, b) => a - b);

  let next = 1;
  for (let i = 0; i < used.length; i++) {
    if (used[i] === next) next++;
    else if (used[i] > next) break;
  }

  return prefix + "-" + year + "-" + String(next).padStart(3, "0");
}

// ================== TABS DEVIS / FACTURES / CONTRATS ==================

function switchListType(type) {
  // On cache la vue Accueil quand on passe à une liste
  const homeView = document.getElementById("homeView");
  if (homeView) homeView.classList.add("hidden");

  currentListType = type;

  const tabDevis = document.getElementById("tabDevis");
  const tabFactures = document.getElementById("tabFactures");
  const tabContrats = document.getElementById("tabContrats");
  const tabCA = document.getElementById("tabCA");

  if (tabDevis) tabDevis.classList.toggle("active", type === "devis");
  if (tabFactures) tabFactures.classList.toggle("active", type === "facture");
  if (tabContrats) tabContrats.classList.toggle("active", type === "contrat");
  if (tabCA) tabCA.classList.remove("active");

  const listView = document.getElementById("listView");
  const formView = document.getElementById("formView");
  const contractView = document.getElementById("contractView");

  const yearFilterContainer = document.getElementById("yearFilterContainer");
  const exportContainer = document.getElementById("exportContainer");
  const unpaidFilterContainer = document.getElementById(
    "unpaidFilterContainer",
  );

  const btnDevis = document.getElementById("createDevis");
  const btnFacture = document.getElementById("createFacture");
  const btnContract = document.getElementById("createContract");

  // 🔵 MODE CONTRATS
  if (type === "contrat") {
    if (listView) listView.classList.remove("hidden");
    if (formView) formView.classList.add("hidden");
    if (contractView) contractView.classList.add("hidden"); // on ouvre le form seulement sur "Modifier" / "Nouveau"

    // Titre de la liste
    const listTitle = document.getElementById("listTitle");
    if (listTitle) listTitle.textContent = "Liste des contrats";

    // Pas de filtres factures en mode contrat
    if (yearFilterContainer) yearFilterContainer.classList.add("hidden");
    if (exportContainer) exportContainer.classList.add("hidden");
    if (unpaidFilterContainer) unpaidFilterContainer.classList.add("hidden");

    // Bandeau contrats : on le laissera géré par updateContractsAlert()
    const alertBox = document.getElementById("contractsAlert");
    if (alertBox) alertBox.classList.remove("hidden");
    if (tabContrats) tabContrats.textContent = "📘 Contrats";

    // Boutons
    if (btnDevis) {
      btnDevis.disabled = true;
      btnDevis.classList.add("disabled-btn");
    }
    if (btnFacture) {
      btnFacture.disabled = true;
      btnFacture.classList.add("disabled-btn");
    }
    if (btnContract) {
      btnContract.disabled = false;
      btnContract.classList.remove("disabled-btn");
    }

    resetTarifsPanel();
    currentDocumentId = null;

    if (typeof refreshContractsStatuses === "function") {
      refreshContractsStatuses();
    }
    if (typeof updateContractsAlert === "function") {
      updateContractsAlert();
    }

    loadContractsList();
    return;
  }

  // 🟡 MODE DEVIS / FACTURES
  if (contractView) contractView.classList.add("hidden");
  if (listView) listView.classList.remove("hidden");
  if (formView) formView.classList.add("hidden");

  // Reset bandeau contrats quand on quitte l’onglet

  const alertBox = document.getElementById("contractsAlert");
  if (alertBox) {
    alertBox.classList.add("hidden");
    alertBox.textContent = "";
  }
  if (tabContrats) {
    tabContrats.textContent = "📘 Contrats";
  }

  // Titre liste
  const listTitle = document.getElementById("listTitle");
  if (listTitle) {
    listTitle.textContent =
      type === "devis" ? "Liste des devis" : "Liste des factures";
  }

  // Filtres visibles uniquement pour les factures
  if (yearFilterContainer) {
    yearFilterContainer.classList.toggle("hidden", type !== "facture");
  }
  if (exportContainer) {
    exportContainer.classList.toggle("hidden", type !== "facture");
  }
  if (unpaidFilterContainer) {
    unpaidFilterContainer.classList.toggle("hidden", type !== "facture");
  }

  // Boutons haut
  if (btnDevis && btnFacture) {
    if (type === "devis") {
      btnDevis.disabled = false;
      btnDevis.classList.remove("disabled-btn");
      btnFacture.disabled = true;
      btnFacture.classList.add("disabled-btn");
    } else {
      btnFacture.disabled = false;
      btnFacture.classList.remove("disabled-btn");
      btnDevis.disabled = true;
      btnDevis.classList.add("disabled-btn");
    }
  }
  if (btnContract) {
    btnContract.disabled = true;
    btnContract.classList.add("disabled-btn");
  }

  resetTarifsPanel();
  currentDocumentId = null;

  loadYearFilter();
  loadDocumentsList();
}

function onDocumentsSearchChange() {
  loadDocumentsList();
}

function adjustPriceHTMargin(line) {
  const kind = line.dataset.kind || "";
  const price = line.querySelector(".prestation-price")?.closest("div");

  if (!price) return;

  if (kind === "produits" || kind === "fournitures") {
    price.classList.add("priceht-lower");
  } else {
    price.classList.remove("priceht-lower");
  }
}

function getAllInvoices() {
  // On renvoie toutes les factures stockées dans "documents"
  return getAllDocuments().filter((d) => d.type === "facture");
}

// ================== FILTRE ANNÉE FACTURES ==================

function loadYearFilter() {
  const select = document.getElementById("yearFilter");
  if (!select) return;

  // On remet la valeur par défaut
  select.innerHTML = '<option value="all">Toutes</option>';

  // On prend toutes les FACTURES stockées
  const docs = getAllDocuments().filter((d) => d.type === "facture");

  const years = new Set();

  docs.forEach((d) => {
    if (!d.date) return;

    // On force un vrai ISO avec heure neutre pour éviter les bugs de parsing
    const dt = new Date(d.date + "T00:00:00");
    if (isNaN(dt.getTime())) return;

    years.add(dt.getFullYear());
  });

  // On remplit le select avec les années trouvées
  Array.from(years)
    .sort()
    .forEach((y) => {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = y;
      select.appendChild(opt);
    });

  // Sécurité : le conteneur du filtre ne s'affiche que sur "Factures"
  const container = document.getElementById("yearFilterContainer");
  if (container) {
    container.classList.toggle("hidden", currentListType !== "facture");
  }
}
// ================== TVA & TYPE DOCUMENT ==================

function getCurrentClientType() {
  const part = document.getElementById("clientParticulier");
  const syn = document.getElementById("clientSyndic");
  if (syn && syn.checked) return "syndic";
  return "particulier";
}

function setTVA(rate, opts = {}) {
  const requested = Number(rate) || 0;

  // showAlert = true uniquement sur action utilisateur
  const showAlert = opts.showAlert === true;

  // ✅ VERROU MICRO TVA
  try {
    if (typeof getMicroTVAStatus === "function") {
      const status = getMicroTVAStatus(); // { mode: "franchise" | "obligatoire", ... }

      // 1) Sous seuil => interdit de passer à 20
      if (status?.mode === "franchise" && requested > 0) {
        if (showAlert && typeof showConfirmDialog === "function") {
          showConfirmDialog({
            title: "TVA impossible",
            message:
              "Tu es encore sous le seuil micro (CA encaissé < 37 500 €).\n" +
              "Tu ne peux pas passer à 20 % pour le moment.",
            confirmLabel: "OK",
            variant: "warning",
            icon: "⚠️",
          });
        }
        // ⛔ On force l'UI à rester à 0
        return setTVA(0, { showAlert: false, _internal: true });
      }

      // 2) TVA obligatoire => interdit de repasser à 0
      if (status?.mode === "obligatoire" && requested === 0) {
        if (showAlert && typeof showConfirmDialog === "function") {
          showConfirmDialog({
            title: "TVA obligatoire",
            message:
              "Le seuil micro a été dépassé.\n" +
              "La TVA de 20 % est désormais obligatoire, tu ne peux plus revenir à 0 %.",
            confirmLabel: "OK",
            variant: "warning",
            icon: "⚠️",
          });
        }
        // ⛔ On force l'UI à rester à 20
        return setTVA(20, { showAlert: false, _internal: true });
      }
    }
  } catch (e) {
    console.warn("[MicroTVA] setTVA lock error:", e);
  }

  // 1) Radios devis/facture
  const tva0 = document.getElementById("tva0");
  const tva20 = document.getElementById("tva20");
  if (tva0) tva0.checked = requested === 0;
  if (tva20) tva20.checked = requested === 20;

  // 2) Radios contrat (si présents)
  const ct0 = document.getElementById("ctTva0");
  const ct20 = document.getElementById("ctTva20");
  if (ct0) ct0.checked = requested === 0;
  if (ct20) ct20.checked = requested === 20;

  // 3) Valeur utilisée par calculs
  const tvaInput = document.getElementById("tvaRate");
  if (tvaInput) tvaInput.value = String(requested);

  // 4) Texte TVA / 293B
  const tvaNote = document.getElementById("tvaNote");
  if (tvaNote) {
    if (typeof getTVALineForDocuments === "function") {
      tvaNote.textContent = getTVALineForDocuments();
    } else {
      tvaNote.textContent =
        requested === 0
          ? "TVA non applicable, article 293 B du CGI."
          : "TVA 20 % applicable.";
    }
  }

  // 5) Recalcul
  if (typeof calculateTotals === "function") calculateTotals();
  if (typeof recomputeContract === "function") recomputeContract();
}


function updateButtonColors() {
  const type = document.getElementById("docType").value;
  const isDevis = type === "devis";

  const buttons = document.querySelectorAll(".action-button");
  buttons.forEach((btn) => {
    btn.classList.remove("btn-devis", "btn-facture");
    btn.classList.add(isDevis ? "btn-devis" : "btn-facture");
  });

  const addBtn = document.getElementById("addPrestationBtn");
  if (addBtn) {
    addBtn.classList.remove("btn-devis", "btn-facture");
    addBtn.classList.add(isDevis ? "btn-devis" : "btn-facture");
  }
}

function updateDocType() {
  const type = document.getElementById("docType").value;
  const validityGroup = document.getElementById("validityDateGroup");
  const paymentSection = document.getElementById("paymentSection");
  const docDate = document.getElementById("docDate").value;
  const validityInput = document.getElementById("validityDate");

  // 👉 bloc "Bon pour accord – signer électroniquement" (devis seulement)
  const approveRadio = document.getElementById("approveDevis");
  let devisSignatureWrapper = null;
  if (approveRadio) {
    // on remonte au parent qui a la classe .devis-signature-trigger
    devisSignatureWrapper = approveRadio.closest(".devis-signature-trigger");
  }

  if (type === "devis") {
    validityGroup.style.display = "block";
    const base = docDate ? new Date(docDate) : new Date();
    const validity = new Date(base);
    validity.setDate(validity.getDate() + 30);
    validityInput.value = validity.toISOString().split("T")[0];
    paymentSection.classList.add("hidden");

    // ✅ on AFFICHE le bouton de signature pour les devis
    if (devisSignatureWrapper) {
      devisSignatureWrapper.style.display = "block";
    }
  } else {
    validityGroup.style.display = "none";
    validityInput.value = "";
    paymentSection.classList.remove("hidden");

    // ❌ on CACHE le bouton de signature pour les factures
    if (devisSignatureWrapper) {
      devisSignatureWrapper.style.display = "none";
    }
  }

  refreshDevisStatusUI(type, validityInput.value);
  updateButtonColors();
}

function updateTransformButtonVisibility() {
  const transformBtn = document.getElementById("transformButton");
  const contractBtn = document.getElementById("contractFromDevisButton");
  const rapportBtn = document.getElementById("rapportFromDevisButton");
  const typeSelect = document.getElementById("docType");
  const type = typeSelect ? typeSelect.value : "devis";

  const canTransform = type === "devis" && !!currentDocumentId;
  const isDevis = type === "devis";

  if (transformBtn) {
    transformBtn.style.display = canTransform ? "inline-block" : "none";
  }
  if (contractBtn) {
    contractBtn.style.display = canTransform ? "inline-block" : "none";
  }
  // 🔥 Ici : le bouton rapport n’apparaît que pour les devis
  if (rapportBtn) {
    rapportBtn.style.display = isDevis ? "inline-block" : "none";
  }
}

function onDocDateChange() {
  if (document.getElementById("docType").value === "devis") {
    updateDocType();
  }
}

function onValidityChange() {
  const type = document.getElementById("docType").value;
  const validityDate = document.getElementById("validityDate").value;
  refreshDevisStatusUI(type, validityDate);
}

// ================== PAIEMENT ==================

function resetPaymentForm() {
  const none = document.getElementById("payNone");
  if (none) none.checked = true;
  ["payEspeces", "payCB", "payVirement", "payCheque"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  const dateEl = document.getElementById("paymentDate");
  if (dateEl) dateEl.value = "";
  const wrapper = document.getElementById("paymentDateWrapper");
  if (wrapper) wrapper.style.display = "none";
}

function onPayModeChange() {
  const sel = document.querySelector('input[name="payMode"]:checked');
  const wrapper = document.getElementById("paymentDateWrapper");
  const dateInput = document.getElementById("paymentDate");

  if (!wrapper || !dateInput) return;

  // Si "Facture non réglée"
  if (!sel || !sel.value) {
    wrapper.style.display = "none";
    dateInput.value = "";
    return;
  }

  // Sinon : on affiche la date de règlement
  wrapper.style.display = "block";

  // On pré-remplit avec la date de doc ou aujourd’hui
  if (!dateInput.value) {
    const docDateInput = document.getElementById("docDate");
    const today = new Date().toISOString().slice(0, 10);
    dateInput.value = (docDateInput && docDateInput.value) || today;
  }
}

// ================== RÉDUCTION ==================

function onDiscountToggle() {
  const cb = document.getElementById("discountEnabled");
  const input = document.getElementById("discountPercentInput");
  const line = document.getElementById("discountLine");
  if (!cb || !input || !line) return;

  if (cb.checked) {
    input.disabled = false;
  } else {
    input.disabled = true;
    input.value = 0;
    line.style.display = "none";
  }
  calculateTotals();
}

function onDiscountPercentChange() {
  calculateTotals();
}

function autoFillSubjectFromFirstPrestation() {
  const subjectInput = document.getElementById("docSubject");
  if (!subjectInput) return;

  // ❌ Si l'utilisateur a modifié l'objet à la main, on ne le touche plus
  if (subjectInput.dataset.manualEdited === "1") {
    return;
  }

  // On prend la première ligne de prestation
  const firstDescInput = document.querySelector(".prestation-desc");
  if (!firstDescInput) return;

  const val = firstDescInput.value.trim();
  // Même si l'objet contient déjà quelque chose, tant qu'il n'est pas "manuel",
  // on le met à jour pour rester synchro avec la prestation
  subjectInput.value = val;
}

// ================== PRESTATIONS ==================
function addPassageDate(btn) {
  // On part du bouton "➕ Ajouter une date"
  // et on récupère le bloc .prestation-dates juste au-dessus
  const container = btn.previousElementSibling;
  if (!container || !container.classList.contains("prestation-dates")) {
    return;
  }

  const row = document.createElement("div");
  row.className = "prestation-date-row";

  const input = document.createElement("input");
  input.type = "date";
  input.className = "prestation-date";

  const docDate = document.getElementById("docDate")?.value;
  input.value = docDate || new Date().toISOString().slice(0, 10);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-danger btn-small date-remove-btn no-print";
  removeBtn.textContent = "✖";
  removeBtn.onclick = function () {
    removePassageDate(removeBtn);
  };

  row.appendChild(input);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

function removePassageDate(btn) {
  const row = btn.closest(".prestation-date-row");
  if (!row) return;

  const container = row.parentElement;
  const rows = container.querySelectorAll(".prestation-date-row");

  // ✅ Si c'est la dernière ligne : on VIDE la date (on ne recrée rien)
  if (rows.length <= 1) {
    const input = row.querySelector(".prestation-date");
    if (input) input.value = "";
    return;
  }

  // ✅ Sinon : on supprime juste la ligne
  row.remove();
}

function addPrestation() {
  prestationCount++;
  const container = document.getElementById("prestationsContainer");
  const line = document.createElement("div");
  line.className = "prestation-line";
  line.id = "prestation-" + prestationCount;
  line.dataset.kind = "";
  line.dataset.detail = "";
  line.dataset.basePrice = "0";
  line.dataset.autoPrice = "1"; // prix auto actif par défaut

  const optionsHtml = PRESTATION_TEMPLATES.map((t, idx) => {
    if (!t || t._deleted) return "";
    return `<option value="${idx}">${t.label}</option>`;
  }).join("");

  line.innerHTML = `
    <div class="form-group">
      <label>Modèle</label>
      <select class="prestation-template" onchange="applyTemplate(this)">
        ${optionsHtml}
      </select>
      <label style="margin-top:6px;">Intitulé</label>
      <input
        type="text"
        class="prestation-desc"
        placeholder="Ex: Entretien piscine, Dépannage clim..."
        onchange="calculateTotals()"
      />
      <label style="margin-top:6px;">Dates de passage</label>
      <div class="prestation-dates">
        <div class="prestation-date-row">
          <input
            type="date"
            class="prestation-date"
          />
<button
  type="button"
  class="btn btn-danger btn-small date-remove-btn no-print"
  onclick="removePassageDate(this)"
  title="Supprimer cette date"
>
  ✖
</button>

        </div>
      </div>
      <button
        type="button"
        class="btn btn-secondary btn-small dates-add-btn no-print"
        onclick="addPassageDate(this)"
      >
        ➕ Ajouter une date
      </button>
    </div>
    <div class="form-group">
      <div class="qty-price-group">
        <div>
          <label>Quantité</label>
          <input
            type="number"
            class="prestation-qty"
            value="1"
            min="0"
            step="1"
            onchange="calculateTotals()"
          />
        </div>
        <div>
          <label>Unité</label>
          <input
            type="text"
            class="prestation-unit"
            placeholder="ex : forfait, heure, unité"
          />
        </div>
        <div>
          <label>Prix HT</label>
          <input
            type="number"
            class="prestation-price"
            value="0"
            min="0"
            step="0.01"
            onchange="onPriceChange(this)"
          />
        </div>
        <div class="purchase-wrapper" style="display:none;">
          <label style="margin-top:6px;font-size:12px;">Prix d'achat *</label>
          <input
            type="number"
            class="prestation-purchase"
            value=""
            min="0"
            step="0.01"
            oninput="onPurchaseChange(this)"
          />
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Total</label>
      <input
        type="text"
        class="prestation-total"
        readonly
      />
    </div>
    <div class="form-group no-print prestation-remove-wrapper">
      <button
        type="button"
        class="btn btn-danger btn-small date-remove-btn no-print"
        onclick="removePrestation(${prestationCount})"
        title="Supprimer cette prestation"
      >
        ✖
      </button>
    </div>
  `;

  container.appendChild(line);

  // 🧠 Quand on tape l’intitulé, on propose de remplir l’objet automatiquement
  const descInput = line.querySelector(".prestation-desc");
  if (descInput) {
    descInput.addEventListener("input", autoFillSubjectFromFirstPrestation);
  }

  calculateTotals();
}

function _ensureIndemnite40InFormUI() {
  const container = document.getElementById("prestationsContainer");
  if (!container) return;

  // ✅ évite doublon côté UI
  const lines = container.querySelectorAll(".prestation-line");
  const alreadyUI = Array.from(lines).some(
    (line) => (line.dataset.kind || "") === "indemnite_40",
  );
  if (alreadyUI) {
    // au cas où : recalcul pour être sûr que le total est bien à jour
    try {
      calculateTotals();
    } catch (e) {}
    return;
  }

  // ✅ crée une nouvelle ligne UI
  addPrestation();

  // récupère la dernière ligne ajoutée
  const newLines = container.querySelectorAll(".prestation-line");
  const line = newLines[newLines.length - 1];
  if (!line) return;

  // ✅ marque la ligne comme indemnité
  line.dataset.kind = "indemnite_40";
  line.dataset.detail =
    "Indemnité forfaitaire de 40 € pour frais de recouvrement";
  line.dataset.autoPrice = "0"; // important : évite que ton système de prix auto écrase 40

  // ✅ remplit les champs
  const descInput = line.querySelector(".prestation-desc");
  const qtyInput = line.querySelector(".prestation-qty");
  const unitInput = line.querySelector(".prestation-unit");
  const priceInput = line.querySelector(".prestation-price");

  if (descInput)
    descInput.value = "Indemnité forfaitaire (art. L441-10 C. commerce)";
  if (qtyInput) qtyInput.value = 1;
  if (unitInput) unitInput.value = "forfait";
  if (priceInput) priceInput.value = 40;

  // ✅ déclenche la logique de ton app (totaux + total ligne)
  try {
    onPriceChange(priceInput);
  } catch (e) {}
  try {
    calculateTotals();
  } catch (e) {}

  _lockIndemnite40Line(line);
}

function _lockIndemnite40Line(line) {
  if (!line) return;
  if ((line.dataset.kind || "") !== "indemnite_40") return;

  // champs
  const tplSelect = line.querySelector(".prestation-template");
  const descInput = line.querySelector(".prestation-desc");
  const qtyInput = line.querySelector(".prestation-qty");
  const unitInput = line.querySelector(".prestation-unit");
  const priceInput = line.querySelector(".prestation-price");

  // verrous
  if (tplSelect) tplSelect.disabled = true;

  if (descInput) {
    descInput.readOnly = true;
    descInput.style.opacity = "0.85";
  }
  if (qtyInput) {
    qtyInput.readOnly = true;
    qtyInput.style.opacity = "0.85";
  }
  if (unitInput) {
    unitInput.readOnly = true;
    unitInput.style.opacity = "0.85";
  }
  if (priceInput) {
    priceInput.readOnly = true;
    priceInput.style.opacity = "0.85";
  }

  // empêche la suppression (bouton X)
  line.querySelectorAll('[onclick^="removePrestation("]').forEach((btn) => {
    btn.style.display = "none";
  });

  // optionnel : empêche l'ajout de dates
  const addDateBtn = line.querySelector(".dates-add-btn");
  if (addDateBtn) addDateBtn.style.display = "none";

  // optionnel : grise la section dates
  const datesBlock = line.querySelector(".prestation-dates");
  if (datesBlock) datesBlock.style.opacity = "0.7";
}

function removePrestation(id) {
  const line = document.getElementById("prestation-" + id);
  if (!line) return;
  line.remove();
  calculateTotals();
}
function reorderPriceFields(line) {
  const kind = line.dataset.kind || "";
  const purchase = line.querySelector(".purchase-wrapper");
  const price = line.querySelector(".prestation-price")?.closest("div");

  if (!purchase || !price) return;

  // uniquement produits & fournitures
  if (kind === "produits" || kind === "fournitures") {
    // on met Prix d'achat au dessus
    price.parentNode.insertBefore(purchase, price);
  } else {
    // sinon on remet Prix d'achat en bas
    price.parentNode.appendChild(purchase);
  }
}

function updatePriceLayout(line) {
  const group = line.querySelector(".qty-price-group");
  const priceWrapper = line.querySelector(".price-wrapper");
  const purchaseWrapper = line.querySelector(".purchase-wrapper");
  if (!group || !priceWrapper || !purchaseWrapper) return;

  const kind = line.dataset.kind || "";

  if (kind === "produits" || kind === "fournitures") {
    // Prix d'achat AVANT Prix HT
    if (purchaseWrapper.nextSibling !== priceWrapper) {
      group.insertBefore(purchaseWrapper, priceWrapper);
    }
  } else {
    // Prix HT avant Prix d'achat (ordre normal)
    if (priceWrapper.nextSibling !== purchaseWrapper) {
      group.insertBefore(priceWrapper, purchaseWrapper);
    }
  }
}
function updatePurchaseVisibility(line) {
  const kind = line.dataset.kind || "";
  const block = line.querySelector(".purchase-wrapper");

  if (!block) return;

  if (kind === "produits" || kind === "fournitures") {
    block.style.display = "block";
    reorderPriceFields(line);
    adjustPriceHTMargin(line); // ➜ AJOUT ICI
  } else {
    block.style.display = "none";
    adjustPriceHTMargin(line); // retire la classe si besoin
  }
}

function applyTemplate(selectEl) {
  const index = parseInt(selectEl.value, 10);
  const line = selectEl.closest(".prestation-line");

  if (
    !line ||
    isNaN(index) ||
    index < 0 ||
    index >= PRESTATION_TEMPLATES.length
  ) {
    return;
  }

  const template = PRESTATION_TEMPLATES[index];
  const clientType = getCurrentClientType();

  line.dataset.kind = template.kind || "";
  updatePriceLayout(line);

  const descInput = line.querySelector(".prestation-desc");
  const qtyInput = line.querySelector(".prestation-qty");
  const priceInput = line.querySelector(".prestation-price");
  const unitInput = line.querySelector(".prestation-unit");

  // Description détaillée pour PDF
  const detailHidden =
    clientType === "particulier"
      ? template.descParticulier
      : template.descSyndic;
  line.dataset.detail = detailHidden || "";

  // Unité par défaut
  if (unitInput) {
    let unitVal = "";
    if (
      template.kind === "depannage_clim" ||
      template.kind === "depannage_piscine" ||
      template.kind === "depannage_jacuzzi"
    ) {
      unitVal = "heure";
    } else if (
      template.kind === "produits" ||
      template.kind === "fournitures"
    ) {
      unitVal = "unité";
    } else {
      unitVal = "forfait";
    }
    unitInput.value = unitVal;
  }

  // Intitulé
  if (descInput) {
    if (template.kind === "produits" || template.kind === "fournitures") {
      descInput.value = "";
    } else {
      let title = template.title || template.label || "";
      if (template.kind === "entretien_clim") {
        const qty = qtyInput ? parseFloat(qtyInput.value) || 1 : 1;
        const plural = qty >= 2 ? "s" : "";
        title = `Entretien${plural} climatisation`;
      }
      descInput.value = title;
    }

    // 🎯 Après avoir mis l’intitulé depuis le modèle,
    // on remplit l'objet si besoin
    autoFillSubjectFromFirstPrestation();
  }

  // Prix (avec prise en compte des tarifs personnalisés)
  if (priceInput) {
    const custom = getCustomPrices();
    let price = 0;

    if (template.kind) {
      const key =
        template.kind +
        "_" +
        (clientType === "syndic" ? "syndic" : "particulier");

      // Si un prix modifié existe → on l'utilise
      if (custom[key] != null) {
        price = custom[key];
      } else {
        // Sinon → prix d'origine du template
        price =
          clientType === "syndic"
            ? template.priceSyndic || 0
            : template.priceParticulier || 0;
      }
    }

    priceInput.value = price.toFixed(2);
    line.dataset.basePrice = price.toFixed(2);
    line.dataset.autoPrice = "1";
  }

  if (qtyInput) qtyInput.value = 1;

  updatePurchaseVisibility(line);
  calculateTotals();
} // <- fin de applyTemplate


function onPriceChange(input) {
  const line = input.closest(".prestation-line");
  if (line) {
    const kind = line.dataset.kind || "";
    const qtyInput = line.querySelector(".prestation-qty");
    const qty = qtyInput ? parseFloat(qtyInput.value) || 0 : 0;

    // On met à jour le prix de base (1 clim)
    line.dataset.basePrice = input.value || "0";

    if (kind === "entretien_clim") {
      if (qty <= 1) {
        // Tu modifies le prix pour 1 clim → ça devient le nouveau "prix de base"
        // et on laisse l'auto actif pour gérer la dégressivité
        line.dataset.autoPrice = "1";
      } else {
        // Si tu changes le prix alors que tu es déjà à 2 ou 3 clims,
        // on considère que tu veux forcer un prix manuel
        line.dataset.autoPrice = "0";
      }
    }
  }
  calculateTotals();
}

function onPurchaseChange(input) {
  const line = input.closest(".prestation-line");
  if (!line) return;
  const kind = line.dataset.kind || "";
  if (kind !== "produits" && kind !== "fournitures") return;

  const purchase = parseFloat(input.value) || 0;
  const priceInput = line.querySelector(".prestation-price");
  if (!priceInput) return;

  if (purchase > 0) {
    const sale = purchase * MARGIN_MULTIPLIER;
    priceInput.value = sale.toFixed(2);
    line.dataset.basePrice = priceInput.value;
  } else {
    priceInput.value = "0.00";
    line.dataset.basePrice = "0";
  }

  calculateTotals();
}

// ================== CALCUL DES TOTAUX ==================

function calculateTotals() {
  const lines = document.querySelectorAll(".prestation-line");
  let subtotal = 0;

  lines.forEach((line) => {
    const qtyInput = line.querySelector(".prestation-qty");
    const priceInput = line.querySelector(".prestation-price");
    const descInput = line.querySelector(".prestation-desc");
    if (!qtyInput || !priceInput) return;

    let qty = parseFloat(qtyInput.value) || 0;
    let price = parseFloat(priceInput.value) || 0;
    const kind = line.dataset.kind || "";
    const autoPrice = line.dataset.autoPrice !== "0";

    // Entretien clim : gestion du tarif dégressif 100 / 85 / 70
    if (kind === "entretien_clim") {
      const n = qty <= 0 ? 1 : qty;

      // Libellé au pluriel
      if (descInput) {
        const plural = n >= 2 ? "s" : "";
        descInput.value = "Entretien climatisation" + plural;
      }

      const clientType = getCurrentClientType();

      if (autoPrice) {
        // Prix de base = prix pour 1 clim (issu des tarifs persos ou de la saisie)
        let base = parseFloat(line.dataset.basePrice) || 0;

        // Sécurité : si base pas défini, on met un défaut logique
        if (!base) {
          base = clientType === "syndic" ? 120 : 100;
        }

        // 💰 Nouvelle grille : 1 = 100 %, 2 = 85 %, 3+ = 70 %
        if (clientType === "particulier") {
          if (n === 1) {
            price = base; // 1 clim → 100 %
          } else if (n === 2) {
            price = base * 0.85; // 2 clims → 85 %
          } else {
            price = base * 0.7; // 3+ clims → 70 %
          }
        } else {
          // Grille syndic
          if (n === 1) {
            price = base;
          } else if (n === 2) {
            price = base * 0.85;
          } else {
            price = base * 0.75;
          }
        }

        // 🔥 Arrondi au multiple de 5 € supérieur
        price = Math.ceil(price / 5) * 5;

        priceInput.value = price.toFixed(2);
      } else {
        // Mode manuel
        price = parseFloat(priceInput.value) || 0;
      }
    }

    const total = qty * price;
    const totField = line.querySelector(".prestation-total");
    if (totField) totField.value = formatEuro(total);
    subtotal += total;
  });

  // Réduction
  const discountCb = document.getElementById("discountEnabled");
  const discountInput = document.getElementById("discountPercentInput");
  const discountLine = document.getElementById("discountLine");
  const discountAmountSpan = document.getElementById("discountAmount");
  const discountLabel = document.getElementById("discountLabel");

  let discountRate = 0;
  let discountAmount = 0;

  if (discountCb && discountInput && discountCb.checked) {
    discountRate = parseFloat(discountInput.value) || 0;
    if (discountRate < 0) discountRate = 0;
    if (discountRate > 100) discountRate = 100;
    discountInput.value = discountRate;
    discountAmount = subtotal * (discountRate / 100);
  }

  let subtotalAfterDiscount = subtotal - discountAmount;
  if (subtotalAfterDiscount < 0) subtotalAfterDiscount = 0;

  if (discountLine && discountAmountSpan && discountLabel) {
    if (discountCb && discountRate > 0 && discountAmount > 0) {
      discountLine.style.display = "flex";
      discountLabel.textContent =
        "Réduction (" + discountRate.toFixed(2).replace(/\.00$/, "") + " %) :";
      discountAmountSpan.textContent = "- " + formatEuro(discountAmount);
    } else {
      discountLine.style.display = "none";
    }
  }

  // TVA
  const tvaRate = parseFloat(document.getElementById("tvaRate").value) || 0;
  const tvaAmount = subtotalAfterDiscount * (tvaRate / 100);
  const totalTTC = subtotalAfterDiscount + tvaAmount;

  document.getElementById("subtotalHT").textContent = formatEuro(subtotal);
  document.getElementById("tvaAmount").textContent = formatEuro(tvaAmount);
  document.getElementById("totalTTC").textContent = formatEuro(totalTTC);

  const totalLabelEl = document.getElementById("totalLabel");
  if (totalLabelEl) {
    const clientType = getCurrentClientType();
    if (tvaRate === 0) {
      totalLabelEl.textContent =
        clientType === "syndic" ? "TOTAL HT :" : "NET À PAYER :";
    } else {
      totalLabelEl.textContent = "TOTAL TTC :";
    }
  }
}

// ================== TYPE CLIENT / CONDITIONS ==================

function onClientTypeChange() {
  const clientType = getCurrentClientType();

  const lines = document.querySelectorAll(".prestation-line");
  lines.forEach((line) => {
    const selectEl = line.querySelector(".prestation-template");
    const descInput = line.querySelector(".prestation-desc");
    const priceInput = line.querySelector(".prestation-price");
    const qtyInput = line.querySelector(".prestation-qty");

    if (!selectEl) return;
    const index = parseInt(selectEl.value, 10);
    if (isNaN(index) || index <= 0 || index >= PRESTATION_TEMPLATES.length)
      return;

    // 🔒 On mémorise la quantité actuelle
    const prevQty = qtyInput ? qtyInput.value : null;

    const template = PRESTATION_TEMPLATES[index];
    line.dataset.kind = template.kind || "";
    updatePurchaseVisibility(line);
    updatePriceLayout(line);

    const detailHidden =
      clientType === "particulier"
        ? template.descParticulier
        : template.descSyndic;
    line.dataset.detail = detailHidden || "";

    if (descInput) {
      let title = template.title || template.label || "";
      if (template.kind === "entretien_clim") {
        const qty = qtyInput ? parseFloat(qtyInput.value) || 1 : 1;
        const plural = qty >= 2 ? "s" : "";
        title = "Entretien climatisation" + plural;
      }
      descInput.value = title;
    }

    if (priceInput) {
      const custom = getCustomPrices();
      let price = 0;

      if (template.kind) {
        const key =
          template.kind +
          "_" +
          (clientType === "syndic" ? "syndic" : "particulier");

        if (custom[key] != null) {
          price = custom[key];
        } else {
          price =
            clientType === "syndic"
              ? template.priceSyndic || 0
              : template.priceParticulier || 0;
        }
      }

      priceInput.value = price.toFixed(2);
      line.dataset.basePrice = price.toFixed(2);
      line.dataset.autoPrice = "1";
    }

    // 🔒 On remet la quantité d’origine si on l’avait
    if (qtyInput && prevQty !== null) {
      qtyInput.value = prevQty;
    }
  });

  calculateTotals();
}

function selectClientType(type) {
  const part = document.getElementById("clientParticulier");
  const syn = document.getElementById("clientSyndic");
  const siteBlock = document.getElementById("siteBlock");
  const siteNameInp = document.getElementById("siteName");
  const siteAddrInp = document.getElementById("siteAddress");

  if (type === "particulier") {
    if (part) part.checked = true;
    if (syn) syn.checked = false;
    setConditions("particulier");

    if (siteBlock) siteBlock.style.display = "none";
    if (siteNameInp) siteNameInp.value = "";
    if (siteAddrInp) siteAddrInp.value = "";
  } else {
    if (syn) syn.checked = true;
    if (part) part.checked = false;
    setConditions("agence");

    if (siteBlock) siteBlock.style.display = "block";
  }

  onClientTypeChange();

  const tvaInput = document.getElementById("tvaRate");
  const rate = tvaInput ? parseFloat(tvaInput.value) || 0 : 0;
  setTVA(rate);
}

function setConditions(type) {
  const notesEl = document.getElementById("notes");
  const cbClientPart = document.getElementById("clientParticulier");
  const cbClientSyn = document.getElementById("clientSyndic");

  if (type === "particulier") {
    if (cbClientPart) cbClientPart.checked = true;
    if (cbClientSyn) cbClientSyn.checked = false;

    if (notesEl) {
      notesEl.value =
        "Règlement à réception de facture.\n" +
        "Aucun escompte pour paiement anticipé.";
      // ✅ pas d'indemnité 40€ en B2C
    }
  } else if (type === "agence") {
    // chez toi "agence" = syndic/pro
    if (cbClientSyn) cbClientSyn.checked = true;
    if (cbClientPart) cbClientPart.checked = false;

    if (notesEl) {
      notesEl.value =
        "Paiement à 30 jours fin de mois.\n" +
        "Aucun escompte pour paiement anticipé.\n" +
        "En cas de retard de paiement : pénalités de retard calculées sur la base de trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire pour frais de recouvrement de 40 € (articles L441-10 et D441-5 du Code de commerce).";

    }
  }

  onClientTypeChange();

  const tvaInput = document.getElementById("tvaRate");
  const currentRate = tvaInput ? parseFloat(tvaInput.value) || 0 : 0;
  setTVA(currentRate);
}

// ================== CRÉATION / CHARGEMENT DOCUMENT ==================

function newDocument(type) {
  currentDocumentId = null;
  document.getElementById("listView").classList.add("hidden");
  document.getElementById("formView").classList.remove("hidden");

  document.getElementById("docType").value = type;
  document.getElementById("clientName").value = "";
  document.getElementById("clientAddress").value = "";
  document.getElementById("clientPhone").value = "";
  document.getElementById("clientEmail").value = "";
  document.getElementById("notes").value = "";

  const clientCivilityEl = document.getElementById("clientCivility");
  if (clientCivilityEl) clientCivilityEl.value = "";

  const siteBlock = document.getElementById("siteBlock");
  const siteNameInp = document.getElementById("siteName");
  const siteAddrInp = document.getElementById("siteAddress");
  if (siteNameInp) siteNameInp.value = "";
  if (siteAddrInp) siteAddrInp.value = "";
  if (siteBlock) siteBlock.style.display = "none";

  const siteCivilityEl = document.getElementById("siteCivility");
  if (siteCivilityEl) siteCivilityEl.value = "";

  const subjectInput = document.getElementById("docSubject");
  if (subjectInput) subjectInput.value = "";

  const cbClientPart = document.getElementById("clientParticulier");
  const cbClientSyn = document.getElementById("clientSyndic");
  if (cbClientPart) cbClientPart.checked = true;
  if (cbClientSyn) cbClientSyn.checked = false;
  setConditions("particulier");

  resetPaymentForm();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("docDate").value = today;
  document.getElementById("docNumber").value = getNextNumber(type);

  const discountCb = document.getElementById("discountEnabled");
  const discountInput = document.getElementById("discountPercentInput");
  const discountLine = document.getElementById("discountLine");
  if (discountCb) discountCb.checked = false;
  if (discountInput) {
    discountInput.value = 0;
    discountInput.disabled = true;
  }
  if (discountLine) discountLine.style.display = "none";

  setTVA(0);
  updateDocType();
  updateTransformButtonVisibility();
  updateButtonColors();

  prestationCount = 0;
  document.getElementById("prestationsContainer").innerHTML = "";
  addPrestation();

  document.getElementById("formTitle").textContent =
    type === "devis" ? "Nouveau devis" : "Nouvelle facture";

  calculateTotals();

  // 🔁 IMPORTANT : recharge de la datalist clients
  if (typeof refreshClientDatalist === "function") {
    refreshClientDatalist();
    if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();
  }
}

function loadDocument(id) {
  const doc = getDocument(id);
  if (!doc) return;
  currentDocumentId = id;

  document.getElementById("listView").classList.add("hidden");
  document.getElementById("formView").classList.remove("hidden");

  document.getElementById("docType").value = doc.type;
  document.getElementById("docNumber").value = doc.number;
  document.getElementById("docDate").value = doc.date;
  document.getElementById("validityDate").value = doc.validityDate || "";
  document.getElementById("clientName").value = doc.client.name;
  document.getElementById("clientAddress").value = doc.client.address;
  document.getElementById("clientPhone").value = doc.client.phone;
  document.getElementById("clientEmail").value = doc.client.email;

  const civilitySelect = document.getElementById("clientCivility");
  if (civilitySelect) civilitySelect.value = doc.client.civility || "";

  const siteCivilityEl = document.getElementById("siteCivility");
  if (siteCivilityEl) siteCivilityEl.value = doc.siteCivility || "";

  document.getElementById("notes").value = doc.notes || "";

  const subjectInput = document.getElementById("docSubject");
  if (subjectInput) subjectInput.value = doc.subject || "";

  // 🚫 Ne pas afficher le nom du client dans l'objet (quel que soit le client)
  if (subjectInput && doc?.client?.name) {
    const clientName = String(doc.client.name).trim();
    if (clientName) {
      subjectInput.value = String(subjectInput.value || "")
        .replace(new RegExp(`\\s*[–-]\\s*${clientName}\\s*$`, "i"), "")
        .trim();
    }
  }
  doc.subject = subjectInput?.value || doc.subject || "";

  const siteBlock = document.getElementById("siteBlock");
  const siteNameInp = document.getElementById("siteName");
  const siteAddrInp = document.getElementById("siteAddress");
  if (siteNameInp) siteNameInp.value = doc.siteName || "";
  if (siteAddrInp) siteAddrInp.value = doc.siteAddress || "";
  if (siteBlock) siteBlock.style.display = doc.conditionsType === "agence" ? "block" : "none";

  updateButtonColors();

  const cbClientPart = document.getElementById("clientParticulier");
  const cbClientSyn = document.getElementById("clientSyndic");
  if (cbClientPart && cbClientSyn) {
    cbClientPart.checked = doc.conditionsType === "particulier";
    cbClientSyn.checked = doc.conditionsType === "agence";
  }

  onClientTypeChange();

  resetPaymentForm();
  if (doc.type === "facture") {
    if (doc.paymentMode) {
      const modeId =
        doc.paymentMode === "especes"
          ? "payEspeces"
          : doc.paymentMode === "cb"
            ? "payCB"
            : doc.paymentMode === "virement"
              ? "payVirement"
              : doc.paymentMode === "cheque"
                ? "payCheque"
                : "payNone";
      const el = document.getElementById(modeId);
      if (el) el.checked = true;
    }
    const dateEl = document.getElementById("paymentDate");
    if (dateEl) dateEl.value = doc.paymentDate || "";
    onPayModeChange();
  }

  setTVA(doc.tvaRate === 20 ? 20 : 0);

  // ✅ Nettoyage sécurité : si TVA = 0, on force TVAAmount = 0 et on supprime les traces TVA
  if (Number(doc.tvaRate || 0) === 0) {
    doc.tvaAmount = 0;
    delete doc.vatNumber;
    delete doc.companyVat;
    delete doc.companyVatNumber;
  }

  updateDocType();
  updateTransformButtonVisibility();
  refreshDevisStatusUI(doc.type, doc.validityDate || "");

  // Réduction
  const discountCb = document.getElementById("discountEnabled");
  const discountInput = document.getElementById("discountPercentInput");
  const discountLine = document.getElementById("discountLine");
  const discRate = doc.discountRate != null ? doc.discountRate : 0;

  if (discountCb && discountInput) {
    if (discRate > 0) {
      discountCb.checked = true;
      discountInput.disabled = false;
      discountInput.value = discRate;
      if (discountLine) discountLine.style.display = "flex";
    } else {
      discountCb.checked = false;
      discountInput.disabled = true;
      discountInput.value = 0;
      if (discountLine) discountLine.style.display = "none";
    }
  }

  // helper affichage purchase
  const _fmtPurchase = (v) => {
    if (v == null) return "";
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return "";
    // affiche "70" au lieu de "70.00"
    return (Math.round(n * 100) / 100).toString();
  };

  // Prestations
  prestationCount = 0;
  const prestationsContainer = document.getElementById("prestationsContainer");
  prestationsContainer.innerHTML = "";

  doc.prestations.forEach((p) => {
    addPrestation();
    const lines = document.querySelectorAll(".prestation-line");
    const line = lines[lines.length - 1];

    line.dataset.kind = p.kind || "";
    line.dataset.detail = p.detail || "";

    if ((p.kind || "") === "indemnite_40") {
      line.dataset.autoPrice = "0";
    }

    // layout / visibilité
    updatePurchaseVisibility(line);
    updatePriceLayout(line);

    const descInput = line.querySelector(".prestation-desc");
    const qtyInput = line.querySelector(".prestation-qty");
    const priceInput = line.querySelector(".prestation-price");
    const unitInput = line.querySelector(".prestation-unit");
    const templateSelect = line.querySelector(".prestation-template");

    if (descInput) descInput.value = p.desc;
    if (qtyInput) qtyInput.value = p.qty;
    if (priceInput) priceInput.value = p.price;
    if (unitInput) unitInput.value = p.unit || "";

    // ==============================
    // 🎯 Choix du "modèle" (template)
    // ==============================
    let effectiveKind = p.kind || "";

    let hasTemplateForKind = PRESTATION_TEMPLATES.some((t) => t.kind === effectiveKind);

    if (!hasTemplateForKind && doc.type === "facture" && doc.contractId) {
      const linkedContract = getContract(doc.contractId);
      const inferredKind = getTemplateKindForContract(linkedContract);
      if (inferredKind) {
        effectiveKind = inferredKind;
        hasTemplateForKind = PRESTATION_TEMPLATES.some((t) => t.kind === effectiveKind);
      }
    }

    if (templateSelect) {
      const idx = PRESTATION_TEMPLATES.findIndex((t) => t.kind === effectiveKind);
      templateSelect.value = idx >= 0 ? String(idx) : "0";
    }

    const template = PRESTATION_TEMPLATES.find((t) => t.kind === effectiveKind);
    if (template) {
      const custom = getCustomPrices();
      const clientType = document.getElementById("clientSyndic")?.checked ? "syndic" : "particulier";
      const key = template.kind + "_" + clientType;

      let base =
        custom[key] != null
          ? custom[key]
          : clientType === "syndic"
            ? template.priceSyndic || 0
            : template.priceParticulier || 0;

      line.dataset.basePrice = Number(base || 0).toFixed(2);
    }

    // ✅ IMPORTANT : on remet le purchase APRÈS tous les updates (visibility/layout)
    const purchaseInput = line.querySelector(".prestation-purchase");
    if (purchaseInput) {
      purchaseInput.value = _fmtPurchase(p.purchase);
    }

    // ⚙️ Dates…
    const datesContainer = line.querySelector(".prestation-dates");
    if (datesContainer) {
      datesContainer.innerHTML = "";
      const dates = p.dates && p.dates.length ? p.dates : [""];
      dates.forEach((dv) => {
        const row = document.createElement("div");
        row.className = "prestation-date-row";

        const inp = document.createElement("input");
        inp.type = "date";
        inp.className = "prestation-date";
        inp.value = dv || "";

        row.appendChild(inp);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "prestation-date-remove";
        btn.textContent = "✕";
        btn.addEventListener("click", () => removePassageDate(btn));

        row.appendChild(btn);
        datesContainer.appendChild(row);
      });
    }
  });

  calculateTotals();

  // ✅ On resauvegarde si on a nettoyé un doc ancien
  try {
    const docsAll = getAllDocuments();
    const idx2 = docsAll.findIndex((d) => d.id === doc.id);
    if (idx2 >= 0) {
      docsAll[idx2] = doc;
      saveDocuments(docsAll);
      if (typeof saveSingleDocumentToFirestore === "function") {
        saveSingleDocumentToFirestore(doc);
      }
    }
  } catch (e) {}

  document.getElementById("formTitle").textContent =
    (doc.type === "devis" ? "Devis " : "Facture ") + doc.number;

  try {
    renderHistory(doc);
  } catch (e) {
    console.error("Erreur renderHistory:", e);
  }

  // 🔘 Empêcher le bouton "Bon pour accord" d'être coché si aucune signature n'existe
  const sigRadio = document.getElementById("signatureRadio");
  if (sigRadio) sigRadio.checked = !!doc.signature;

  if (typeof refreshDocumentHealthUI === "function") {
    refreshDocumentHealthUI(doc);
  }

  // 🔒 verrouille automatiquement la ligne indemnité si présente
  if (typeof _lockIndemnite40Line === "function") {
    document.querySelectorAll(".prestation-line").forEach(_lockIndemnite40Line);
  }
}

// ================== SAUVEGARDE / SUPPRESSION / DUPLICATION ==================

function saveDocument() {
  // ==== BLOCAGE TVA MICRO ====
  try {
    const status = getMicroTVAStatus();
    const selectedRate = Number(document.getElementById("tvaRate")?.value || 0);

    if (status?.mode === "franchise" && selectedRate > 0) {
      showConfirmDialog({
        title: "TVA impossible",
        message:
          "Tu es encore sous le seuil micro (moins de 37 500 €).\n" +
          "Les devis et factures DOIVENT rester en TVA 0 %.",
        confirmLabel: "OK",
        variant: "warning",
        icon: "⚠️",
      });
      return;
    }

    if (status?.mode === "obligatoire" && selectedRate === 0) {
      showConfirmDialog({
        title: "TVA obligatoire",
        message:
          "Le seuil micro a été dépassé.\n" +
          "La TVA de 20 % est désormais obligatoire sur les nouveaux documents.",
        confirmLabel: "OK",
        variant: "warning",
        icon: "⚠️",
      });
      return;
    }
  } catch (e) {
    console.error("Erreur contrôle TVA :", e);
  }

  // === Champs client + objet ===
  const clientName =
    document.getElementById("clientName")?.value?.trim() || "";
  const clientAddress =
    document.getElementById("clientAddress")?.value?.trim() || "";
  const clientCivility = document.getElementById("clientCivility")?.value || "";
  const clientPhone =
    document.getElementById("clientPhone")?.value?.trim() || "";
  const clientEmail =
    document.getElementById("clientEmail")?.value?.trim() || "";
  const docSubject =
    document.getElementById("docSubject")?.value?.trim() || "";

  if (!clientName || !clientAddress) {
    showConfirmDialog({
      title: "Informations client manquantes",
      message: "Merci de renseigner au minimum le nom et l'adresse du client.",
      confirmLabel: "OK",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  if (!docSubject) {
    showConfirmDialog({
      title: "Objet manquant",
      message: "Veuillez saisir l'objet du devis ou de la facture.",
      confirmLabel: "OK",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  // === Prestations ===
  const prestations = [];
  let missingPurchase = false;

  // helper: parse nombre FR "70,50" -> 70.5
  const _num = (v) => {
    const s = String(v ?? "").trim().replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

document.querySelectorAll(".prestation-line").forEach((line) => {
  // helper: parse nombre FR "70,50" -> 70.5
  const _num = (v) => {
    const s = String(v ?? "").trim().replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  // 1) kind robuste : dataset.kind OU kind du template sélectionné
  let kind = line.dataset.kind || "";
  const templateSelect = line.querySelector(".prestation-template");
  const tplIdx = templateSelect ? parseInt(templateSelect.value || "0", 10) : -1;
  const tpl = (tplIdx >= 0 && PRESTATION_TEMPLATES[tplIdx]) ? PRESTATION_TEMPLATES[tplIdx] : null;

  if (!kind && tpl && tpl.kind) kind = tpl.kind;

  // 2) champs de base
  let desc = line.querySelector(".prestation-desc")?.value?.trim() || "";
  const qty = _num(line.querySelector(".prestation-qty")?.value);
  const price = _num(line.querySelector(".prestation-price")?.value);
  const unit = line.querySelector(".prestation-unit")?.value || "";

  // 3) si desc vide, on met au minimum le label du modèle (évite "disparition")
  if (!desc && tpl && tpl.label) desc = String(tpl.label).trim();

  // 4) prix d’achat (uniquement produits/fournitures)
  const isProduct = (kind === "produits" || kind === "fournitures");
  const purchase = isProduct ? _num(line.querySelector(".prestation-purchase")?.value) : 0;

  if (isProduct) {
    if (!purchase || purchase <= 0) missingPurchase = true;
  }

  // 5) on sauvegarde la ligne si on a au moins une desc
  if (desc) {
    prestations.push({
      desc,
      qty,
      price,
      total: qty * price,
      unit,
      kind,
      purchase, // ✅ stocké => ne disparaît plus
    });
  }
});


  if (missingPurchase) {
    showConfirmDialog({
      title: "Prix d'achat manquant",
      message: "Merci de renseigner le prix d'achat pour tous les produits.",
      confirmLabel: "OK",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  if (!prestations.length) {
    showConfirmDialog({
      title: "Aucune prestation",
      message: "Ajoute au moins une prestation avant d'enregistrer.",
      confirmLabel: "OK",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  // === Infos document ===
  const docType = document.getElementById("docType")?.value || "devis";
  const docNumber = document.getElementById("docNumber")?.value || "";
  const docDate = document.getElementById("docDate")?.value || "";
  const validityDate = document.getElementById("validityDate")?.value || "";
  const tvaRate = _num(document.getElementById("tvaRate")?.value);
  const notes = document.getElementById("notes")?.value || "";

  const existing = currentDocumentId ? getDocument(currentDocumentId) : null;

  // ✅ Type client (pour popup devis obligatoire)
  const conditionsType = document.getElementById("clientSyndic")?.checked
    ? "agence"
    : "particulier";

  // === Totaux ===
  const subtotal = prestations.reduce((s, p) => s + (Number(p.total) || 0), 0);
  const tvaAmount = subtotal * (tvaRate / 100);
  const totalTTC = subtotal + tvaAmount;

  // ✅ Paiement (factures)
  const payMode =
    document.querySelector('input[name="payMode"]:checked')?.value || "";
  const paymentDateInput = document.getElementById("paymentDate");
  const paymentDate = paymentDateInput ? (paymentDateInput.value || "") : "";

  const doc = {
    id: currentDocumentId || Date.now().toString(),
    type: docType,
    number: docNumber,
    date: docDate,
    validityDate,
    subject: docSubject,

    client: {
      civility: clientCivility,
      name: clientName,
      address: clientAddress,
      phone: clientPhone,
      email: clientEmail,
    },

    prestations,
    subtotal,
    tvaRate,
    tvaAmount,
    totalTTC,
    notes,
    conditionsType,

    paymentMode:
      docType === "facture"
        ? (payMode !== "" ? payMode : (existing?.paymentMode || ""))
        : (existing?.paymentMode || ""),

    paid:
      docType === "facture"
        ? (payMode !== "" ? true : false)
        : (existing?.paid || false),

    paymentDate:
      docType === "facture"
        ? (payMode !== ""
            ? (paymentDate ||
               existing?.paymentDate ||
               new Date().toISOString().slice(0, 10))
            : "")
        : (existing?.paymentDate || ""),

    createdAt: existing ? existing.createdAt : new Date().toISOString(),
  };

  // ✅ Devis obligatoire >150€
  if (typeof maybeForceDevisInsteadOfSavingInvoice === "function") {
    const blocked = maybeForceDevisInsteadOfSavingInvoice(doc);
    if (blocked) return;
  }

  // === Save local ===
  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) docs[idx] = doc;
  else docs.push(doc);
  saveDocuments(docs);

  // === Save Firestore (si dispo) ===
  try {
    if (typeof saveSingleDocumentToFirestore === "function") {
      saveSingleDocumentToFirestore(doc);
    }
  } catch (e) {
    console.warn("Firestore save failed:", e);
  }

  // ✅ Recalcule TVA/CA après encaissement / sauvegarde
  try {
    if (typeof refreshMicroTVAState === "function") refreshMicroTVAState(false);
  } catch (e) {}

  showConfirmDialog({
    title: "Enregistrement réussi",
    message: `La ${doc.type} ${doc.number || ""} a été enregistrée.`,
    confirmLabel: "OK",
    variant: "success",
    icon: "✅",
  });

  currentDocumentId = doc.id;
  loadDocumentsList();
}


// Supprimer depuis la LISTE (bouton "Supprimer" dans le tableau)

function deleteDocument(id) {
  const docs = getAllDocuments();
  const doc = docs.find((d) => d.id === id);
  if (!doc) return;

  const typeLabel = doc.type === "devis" ? "DEVIS" : "FACTURE";
  const subject =
    doc.subject && doc.subject.trim() ? doc.subject.trim() : "Sans objet";

  const title = `Supprimer le ${typeLabel}`;
  const message =
    `Êtes-vous sûr de vouloir supprimer le ${typeLabel} ${doc.number} :\n` +
    `« ${subject} » ?\n\n` +
    `Cette action est définitive.`;

  showConfirmDialog({
    title,
    message,
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      const newDocs = docs.filter((d) => d.id !== id);
      saveDocuments(newDocs);

      if (db) {
        db.collection("documents")
          .doc(id)
          .delete()
          .catch((err) => console.error("Erreur Firestore delete :", err));
      }

      // ✅ Refresh UI (liste + stats)
      if (typeof loadDocumentsList === "function") loadDocumentsList();
      if (typeof refreshHomeStats === "function") refreshHomeStats();

      // ✅ Recalcule CA + resynchronise immédiatement le statut micro TVA + badge
      if (typeof computeCA === "function") computeCA();
      if (typeof refreshMicroTVAState === "function") refreshMicroTVAState(false);
    },
  });
}


// Supprimer depuis le FORMULAIRE (bouton rouge en haut du devis/facture)
function deleteCurrent() {
  const typeSelect = document.getElementById("docType");
  const type = typeSelect ? typeSelect.value : "devis";
  const docNumber = document.getElementById("docNumber")?.value || "";
  const subject =
    (document.getElementById("docSubject")?.value || "").trim() || "Sans objet";

  // 1) Document pas encore enregistré
  if (!currentDocumentId) {
    const typeLabel = type === "devis" ? "DEVIS" : "FACTURE";

    const title = `Effacer le ${typeLabel} en cours`;
    const message =
      `Ce ${typeLabel} (${docNumber || "non numéroté"}) n'a pas encore été enregistré.\n\n` +
      `Voulez-vous effacer tout le contenu et repartir sur un nouveau ${typeLabel.toLowerCase()} vierge ?`;

    showConfirmDialog({
      title,
      message,
      confirmLabel: "Réinitialiser",
      cancelLabel: "Annuler",
      onConfirm: function () {
        newDocument(type);
      },
    });

    return;
  }

  // 2) Document déjà enregistré -> vraie suppression
  const typeLabel = type === "devis" ? "DEVIS" : "FACTURE";
  const title = `Supprimer le ${typeLabel}`;
  const message =
    `Êtes-vous sûr de vouloir supprimer le ${typeLabel} ${docNumber} :\n` +
    `« ${subject} » ?\n\nCette action est définitive.`;

  showConfirmDialog({
    title,
    message,
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      const idToDelete = currentDocumentId;
      const docs = getAllDocuments().filter((d) => d.id !== idToDelete);
      saveDocuments(docs);
  if (typeof refreshMicroTVAState === "function") {
    refreshMicroTVAState(false);
  }

      if (db) {
        db.collection("documents")
          .doc(idToDelete)
          .delete()
          .catch((err) => console.error("Erreur Firestore delete :", err));
      }

      backToList();
    },
  });
}

function duplicateDocument(id) {
  const original = getDocument(id);
  if (!original) return;

  const docs = getAllDocuments();
  const copy = JSON.parse(JSON.stringify(original));

  copy.id = Date.now().toString();
  copy.number = getNextNumber(original.type);
  const today = new Date().toISOString().split("T")[0];
  copy.date = today;

  if (copy.type === "devis") {
    const base = new Date(today);
    base.setDate(base.getDate() + 30);
    copy.validityDate = base.toISOString().split("T")[0];
    copy.status = "en_attente";
  } else {
    copy.validityDate = "";
    copy.paid = false;
    copy.paymentMode = "";
    copy.paymentDate = "";
    copy.status = "";
  }

  copy.createdAt = new Date().toISOString();
  docs.push(copy);
  saveDocuments(docs);
  loadDocumentsList();
  loadDocument(copy.id);
}
function duplicateCurrent() {
  if (!currentDocumentId) {
    showConfirmDialog({
      title: "Impossible de dupliquer",
      message:
        "Tu dois d’abord enregistrer le devis ou la facture avant de pouvoir la dupliquer.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️",
    });
    return;
  }

  duplicateDocument(currentDocumentId);
}

function backToList() {
hideHealthCardsEverywhere();
  document.getElementById("formView").classList.add("hidden");
  document.getElementById("listView").classList.remove("hidden");
  currentDocumentId = null;
  resetTarifsPanel();
  loadYearFilter();
  loadDocumentsList();
  updateTransformButtonVisibility();
}

function syncMicroTVAStatusWithCurrentCA() {
  return refreshMicroTVAState(false);
}


// =====================================
// 📊 CALCUL CA ANNUEL / MENSUEL
// =====================================

function computeCA() {
  const docs = getAllDocuments().filter((d) => d.type === "facture" && d.date);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  let totalYear = 0; // CA annuel (affiché)
  let totalPaidYear = 0; // CA réellement encaissé → micro-entreprise
  let totalUnpaid = 0;
  let monthTotal = 0;

  docs.forEach((f) => {
    const amount = Number(f.totalTTC || 0);
    if (!amount) return;

    const isPaid = !!f.paid;
    const payDate = f.paymentDate || f.date;

    // --------------------------
    // CA affiché = basé sur la DATE FACTURE
    // --------------------------
    if (f.date.startsWith(String(year))) {
      totalYear += amount;

      if (isPaid) totalPaidYear += amount;
      else totalUnpaid += amount;

      // mois courant
      if (f.date.startsWith(`${year}-${month}`)) {
        monthTotal += amount;
      }
    }
  });

  // Surveiller le seuil TVA micro
  if (typeof checkMicroTVAThreshold === "function") {
    if (typeof refreshMicroTVAState === "function") {
  refreshMicroTVAState(false);
}

  }

  // TRÈS IMPORTANT : renvoyer le CA encaissé (micro)
  return totalPaidYear;
}

// =====================================
// TVA MICRO-ENTREPRISE – SURVEILLANCE SEUIL
// =====================================

// Seuils légaux prestations de services (micro, franchise en base TVA)
// Source officielle : 37 500 € (seuil de base) / 41 250 € (seuil majoré)
const MICRO_TVA_THRESHOLD_BASE = 37500; // déclenche l'obligation de TVA
const MICRO_TVA_THRESHOLD_TOLERANCE = 41250; // pour info, non utilisé ici
const MICRO_TVA_THRESHOLD_TTC = MICRO_TVA_THRESHOLD_BASE;

const MICRO_TVA_STATUS_KEY = "micro_tva_status";

function getMicroTVAStatus() {
  try {
    const raw = localStorage.getItem(MICRO_TVA_STATUS_KEY);
    if (!raw) {
      return { mode: "franchise", activatedYear: null, activatedCA: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode || "franchise", // "franchise" ou "obligatoire"
      activatedYear: parsed.activatedYear || null,
      activatedCA: parsed.activatedCA || 0,
    };
  } catch (e) {
    console.error("Erreur lecture statut TVA micro :", e);
    return { mode: "franchise", activatedYear: null, activatedCA: 0 };
  }
}

function getMicroTvaStatus() {
  // Petit wrapper pour compatibilité avec le reste du code
  const st = getMicroTVAStatus();
  return st && st.mode ? st.mode : "franchise";
}

// ✅ SOURCE DE VÉRITÉ UNIQUE : statut micro TVA + UI + badge
// RÈGLE : une fois "obligatoire", ON NE REVIENT PAS en arrière automatiquement.
function refreshMicroTVAState(showAlert = false) {
  const { year, caTTC } = computeCurrentYearCAForMicro();
  const status = getMicroTVAStatus(); // { mode, activatedYear, activatedCA }

  const alreadyObligatoire = status && status.mode === "obligatoire";

  // ✅ Retour possible en franchise (2 ans sous seuil)
// On PROPOSE, on ne force pas automatiquement.
if (alreadyObligatoire) {
  const back = canReturnToFranchiseTVA();

  if (back.ok && showAlert && typeof showConfirmDialog === "function") {
    showConfirmDialog({
      title: "TVA : retour possible",
      message:
        `Tu es sous le seuil ${MICRO_TVA_THRESHOLD_BASE} € sur 2 ans :\n` +
        `- ${back.year - 1} : ${formatEuroFallback(back.caLastYear)}\n` +
        `- ${back.year} : ${formatEuroFallback(back.caThisYear)}\n\n` +
        `➡️ Veux-tu repasser en franchise (TVA 0 %) ?`,
      confirmLabel: "Oui, repasser en 0%",
      cancelLabel: "Non, je garde TVA 20%",
      variant: "info",
      icon: "ℹ️",
      onConfirm: () => {
        saveMicroTVAStatus({
          mode: "franchise",
          returnedYear: back.year,
          returnedCA: back.caThisYear,
        });

        // refresh UI direct
        refreshMicroTVAState(false);
      },
    });
  }
}


// ✅ Règles micro TVA (prestations de services) :
// - si CA encaissé année N > seuil MAJORÉ => TVA en cours d'année
// - si CA encaissé année N-1 > seuil BASE (mais <= majoré) => TVA depuis le 01/01 de N
const caLastYear = computeYearCAForMicro(year - 1);

const exceedToleranceThisYear = caTTC > MICRO_TVA_THRESHOLD_TOLERANCE; // ex: 41250
const exceedBaseLastYear = caLastYear > MICRO_TVA_THRESHOLD_BASE;      // ex: 37500

// Mode final : si déjà obligatoire => reste obligatoire
// sinon => obligatoire si (seuil majoré dépassé cette année) OU (seuil base dépassé l'an dernier)
// ✅ MODE AUTOMATIQUE : si tu es sous le seuil -> franchise ; sinon -> obligatoire
const nextMode =
  exceedToleranceThisYear || exceedBaseLastYear
    ? "obligatoire"
    : "franchise";


// Activation (sauvegarde) seulement si on passe de franchise -> obligatoire
const shouldActivateNow = !alreadyObligatoire && nextMode === "obligatoire";

if (shouldActivateNow) {
  saveMicroTVAStatus({
    mode: "obligatoire",
    activatedYear: year,
    activatedCA: caTTC,
  });

  if (showAlert && typeof showConfirmDialog === "function") {
    const message = exceedToleranceThisYear
      ? `Seuil majoré dépassé.\nCA encaissé ${year} : ${formatEuroFallback(caTTC)}\n` +
        `Seuil majoré : ${formatEuroFallback(MICRO_TVA_THRESHOLD_TOLERANCE)}\n\n` +
        `➡️ TVA 20 % obligatoire en cours d'année.`
      : `Seuil dépassé l'an dernier.\nCA encaissé ${year - 1} : ${formatEuroFallback(caLastYear)}\n` +
        `Seuil base : ${formatEuroFallback(MICRO_TVA_THRESHOLD_BASE)}\n\n` +
        `➡️ TVA 20 % obligatoire depuis le 01/01/${year}.`;

    showConfirmDialog({
      title: "TVA obligatoire",
      message,
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
  }
}


  // 4) Badge dashboard
  const badge = document.getElementById("dashTVAMicroBadge");
  if (badge) {
    if (nextMode === "obligatoire") {
      badge.textContent = "TVA activée (20 %)";
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }

  // 5) Forcer la TVA dans l'UI (devis/facture/contrat) selon le statut
  const forcedRate = nextMode === "obligatoire" ? 20 : 0;

  if (typeof setTVA === "function") setTVA(forcedRate);

  const tva0 = document.getElementById("tva0");
  const tva20 = document.getElementById("tva20");
  if (tva0 && tva20) {
    tva0.checked = forcedRate === 0;
    tva20.checked = forcedRate === 20;
  }

  const ct0 = document.getElementById("ctTva0");
  const ct20 = document.getElementById("ctTva20");
  if (ct0 && ct20) {
    ct0.checked = forcedRate === 0;
    ct20.checked = forcedRate === 20;
  }

  // 6) Si popup CA ouvert => refresh
  const overlay = document.getElementById("caReportOverlay");
  const isOpen = overlay && !overlay.classList.contains("hidden");
  if (isOpen && typeof renderCAReport === "function") renderCAReport();

  // IMPORTANT : on renvoie le mode final
  return { year, caTTC, mode: nextMode };
}

function resetMicroTVAStatusUI() {
  showConfirmDialog({
    title: "Réinitialiser TVA micro",
    message:
      "Ça remet la TVA en mode franchise (0%) et enlève le badge.\n" +
      "À utiliser seulement si tu avais activé la TVA par erreur / test.",
    confirmLabel: "Oui, réinitialiser",
    cancelLabel: "Annuler",
    variant: "warning",
    icon: "🧹",
    onConfirm: () => {
      // ✅ met explicitement le statut en franchise
      saveMicroTVAStatus({ mode: "franchise", resetAt: Date.now() });

      // ✅ refresh UI + badge
      refreshMicroTVAState(false);
    },
  });
}




function saveMicroTVAStatus(status) {
  try {
    localStorage.setItem(MICRO_TVA_STATUS_KEY, JSON.stringify(status));
  } catch (e) {
    console.error("Erreur sauvegarde statut TVA micro :", e);
  }
}

// CA TTC de l'année civile en cours (simple, à partir des factures)

function computeCurrentYearCAForMicro() {
  const docs = getAllDocuments().filter((d) => d.type === "facture" && d.date);
  const now = new Date();
  const currentYear = now.getFullYear();

  let totalTTC = 0;

  docs.forEach((f) => {
    // 🔎 Micro-entreprise = on compte le CA ENCAISSÉ seulement !
    if (!f.paid) return;

    // Date de paiement si présente, sinon date facture
    const refDate = f.paymentDate || f.date;
    const d = new Date(refDate + "T00:00:00");
    if (isNaN(d.getTime()) || d.getFullYear() !== currentYear) return;

    const val = Number(f.totalTTC || 0);
    if (!isNaN(val)) totalTTC += val;
  });

  return { year: currentYear, caTTC: totalTTC };
}

function computeYearCAForMicro(year) {
  const docs = getAllDocuments().filter(
    (d) => d.type === "facture" && (d.date || d.paymentDate)
  );

  let totalTTC = 0;

  docs.forEach((f) => {
    if (!f.paid) return;

    // ✅ CA encaissé = date de paiement si dispo, sinon date facture (fallback)
    const refDate = (f.paymentDate || f.date || "").slice(0, 10); // "YYYY-MM-DD"
    if (!refDate) return;

    const d = new Date(refDate + "T00:00:00");
    if (isNaN(d.getTime()) || d.getFullYear() !== year) return;

    const val = Number(f.totalTTC || 0);
    if (!isNaN(val)) totalTTC += val;
  });

  return totalTTC;
}

function canReturnToFranchiseTVA() {
  const now = new Date();
  const y = now.getFullYear();

  const caThisYear = computeYearCAForMicro(y);
  const caLastYear = computeYearCAForMicro(y - 1);

  // ✅ règle simplifiée (celle que tu veux) : 2 années sous le seuil de base
  const under2Years =
    caThisYear < MICRO_TVA_THRESHOLD_BASE &&
    caLastYear < MICRO_TVA_THRESHOLD_BASE;

  return {
    ok: under2Years,
    caThisYear,
    caLastYear,
    year: y,
  };
}


function formatEuroFallback(v) {
  if (typeof formatEuro === "function") return formatEuro(v);
  return Number(v || 0).toFixed(2) + " €";
}



/**
 * Surveille le seuil micro :
 * - si CA >= 37 500 € sur l'année en cours → bascule en "TVA obligatoire"
 * - pas de retour automatique en arrière
 * @param {boolean} showAlert - true = popup d'alerte
 */

function checkMicroTVAThreshold(showAlert = false) {
  return refreshMicroTVAState(!!showAlert);
}


// ================== HISTORIQUE DOCUMENTS ==================

function ensureHistoryArray(doc) {
  if (!doc) return null;
  if (!Array.isArray(doc.history)) {
    doc.history = [];
  }
  return doc.history;
}

function formatHistoryTimestamp(ts) {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    const date = d.toLocaleDateString("fr-FR");
    const time = d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  } catch (e) {
    return "";
  }
}

function mapHistoryTypeLabel(type) {
  switch (type) {
    case "create":
      return "Création";
    case "delete":
      return "Suppression";
    case "status":
      return "Statut";
    case "payment":
      return "Paiement";
    case "prest_add":
      return "Prestation ajoutée";
    case "prest_delete":
      return "Prestation supprimée";
    case "prest_update":
      return "Prestation modifiée";
    case "field_update":
      return "Modification";
    default:
      return "Mise à jour";
  }
}

/**
 * addHistoryEntry
 * - docOrId : soit l'objet doc (en mémoire), soit son id (string)
 * - payload : { type, detail }
 * - options : { skipSave } → true si on ne veut pas sauvegarder localStorage/Firestore (cas saveDocument)
 */
function addHistoryEntry(docOrId, payload, options) {
  const opts = options || {};
  const ts = Date.now();
  const type = payload.type || "update";
  const detail = payload.detail || "";
  let doc = null;

  if (!docOrId) return;

  // 1) Cas : on donne directement l'objet document (saveDocument)
  if (typeof docOrId === "object") {
    doc = docOrId;
    ensureHistoryArray(doc);
    doc.history.push({
      ts,
      type,
      detail,
      docId: doc.id,
    });
    // Pas de save ici → le caller sauvegarde le doc complet
    return;
  }

  // 2) Cas : on donne un id → on va chercher le document et on persiste nous-mêmes
  if (typeof docOrId === "string") {
    const docs = getAllDocuments();
    const idx = docs.findIndex((d) => d.id === docOrId);
    if (idx === -1) return;

    doc = docs[idx];
    ensureHistoryArray(doc);
    doc.history.push({
      ts,
      type,
      detail,
      docId: doc.id,
    });

    if (!opts.skipSave) {
      saveDocuments(docs);
      if (typeof saveSingleDocumentToFirestore === "function") {
        saveSingleDocumentToFirestore(doc);
      }
    }
  }
}

function renderHistory(currentDocument) {
  const container = document.getElementById("historyList");
  if (!container) return;

  container.innerHTML = "";

  if (
    !currentDocument ||
    !Array.isArray(currentDocument.history) ||
    currentDocument.history.length === 0
  ) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "Aucune modification pour le moment.";
    container.appendChild(empty);
    return;
  }

  // ✅ Correction ici : le spread [...]
  const entries = [...currentDocument.history].sort(
    (a, b) => (b.ts || 0) - (a.ts || 0),
  );

  entries.forEach((entry) => {
    const wrapper = document.createElement("div");
    wrapper.className = "history-entry";

    const meta = document.createElement("div");
    meta.className = "history-meta";
    const tsLabel = formatHistoryTimestamp(entry.ts);
    const typeLabel = mapHistoryTypeLabel(entry.type);
    meta.innerHTML = `${tsLabel} · <span class="history-type">${escapeHtml(typeLabel)}</span>`;

    const detail = document.createElement("div");
    detail.className = "history-detail";
    detail.textContent = entry.detail || "";

    wrapper.appendChild(meta);
    wrapper.appendChild(detail);
    container.appendChild(wrapper);
  });
}

// ================== DIFF DOCUMENT ==================

function computeDocumentDiff(before, after) {
  if (!before || !after) return [];

  const diffs = [];

  function addFieldDiff(label, oldVal, newVal) {
    if (oldVal == null) oldVal = "";
    if (newVal == null) newVal = "";
    if (String(oldVal) === String(newVal)) return;

    diffs.push({
      type: "field_update",
      detail: `${label} : ${oldVal || "—"} → ${newVal || "—"}`,
    });
  }

  function euroDiff(label, oldVal, newVal) {
    const o = Number(oldVal || 0);
    const n = Number(newVal || 0);
    if (Math.abs(o - n) < 0.005) return;

    const oLabel = formatEuroFallback(o);
    const nLabel = formatEuroFallback(n);
    diffs.push({
      type: "field_update",
      detail: `${label} : ${oLabel} → ${nLabel}`,
    });
  }

  // ================== INFOS GÉNÉRALES ==================
  addFieldDiff("Numéro", before.number, after.number);
  addFieldDiff("Type", before.type, after.type);
  addFieldDiff("Date", before.date, after.date);
  addFieldDiff("Date de validité", before.validityDate, after.validityDate);
  addFieldDiff("Objet", before.subject, after.subject);
  addFieldDiff("Notes", before.notes, after.notes);
  addFieldDiff("Conditions", before.conditionsType, after.conditionsType);

  // TVA
  if ((before.tvaRate || 0) !== (after.tvaRate || 0)) {
    diffs.push({
      type: "field_update",
      detail: `TVA : ${before.tvaRate || 0} % → ${after.tvaRate || 0} %`,
    });
  }

  // Réduction : activation / désactivation / changement de %
  const bDiscountRate = Number(before.discountRate || 0);
  const aDiscountRate = Number(after.discountRate || 0);
  const bDiscountActive =
    bDiscountRate > 0 && Number(before.discountAmount || 0) > 0;
  const aDiscountActive =
    aDiscountRate > 0 && Number(after.discountAmount || 0) > 0;

  if (!bDiscountActive && aDiscountActive) {
    diffs.push({
      type: "field_update",
      detail: `Réduction activée : ${aDiscountRate}%`,
    });
  } else if (bDiscountActive && !aDiscountActive) {
    diffs.push({
      type: "field_update",
      detail: "Réduction désactivée",
    });
  } else if (
    bDiscountActive &&
    aDiscountActive &&
    bDiscountRate !== aDiscountRate
  ) {
    diffs.push({
      type: "field_update",
      detail: `Réduction modifiée : ${bDiscountRate}% → ${aDiscountRate}%`,
    });
  }

  // ================== CLIENT ==================
  const bc = before.client || {};
  const ac = after.client || {};

  addFieldDiff("Client – Civilité", bc.civility, ac.civility);
  addFieldDiff("Client – Nom", bc.name, ac.name);
  addFieldDiff("Client – Adresse", bc.address, ac.address);
  addFieldDiff("Client – Téléphone", bc.phone, ac.phone);
  addFieldDiff("Client – Email", bc.email, ac.email);

  // Type de client via conditionsType (particulier / agence)
  if ((before.conditionsType || "") !== (after.conditionsType || "")) {
    const oldType =
      before.conditionsType === "agence" ? "Agence / Syndic" : "Particulier";
    const newType =
      after.conditionsType === "agence" ? "Agence / Syndic" : "Particulier";
    diffs.push({
      type: "field_update",
      detail: `Type de client : ${oldType} → ${newType}`,
    });
  }

  // ================== SITE ==================
  addFieldDiff("Site – Civilité", before.siteCivility, after.siteCivility);
  addFieldDiff("Site – Nom sur place", before.siteName, after.siteName);
  addFieldDiff("Site – Adresse", before.siteAddress, after.siteAddress);

  // ================== PRESTATIONS ==================
  function buildPrestKey(p, idx) {
    const desc = (p && p.desc ? p.desc : "").toLowerCase().trim();
    const unit = (p && p.unit ? p.unit : "").toLowerCase().trim();
    return desc || unit ? `${desc}|${unit}` : `#idx_${idx}`;
  }

  const beforePrest = Array.isArray(before.prestations)
    ? before.prestations
    : [];
  const afterPrest = Array.isArray(after.prestations) ? after.prestations : [];

  const beforeMap = new Map();
  beforePrest.forEach((p, idx) => {
    beforeMap.set(buildPrestKey(p, idx), { p, idx });
  });

  const afterMap = new Map();
  afterPrest.forEach((p, idx) => {
    afterMap.set(buildPrestKey(p, idx), { p, idx });
  });

  // Prestations supprimées
  beforeMap.forEach((val, key) => {
    if (!afterMap.has(key)) {
      const p = val.p || {};
      diffs.push({
        type: "prest_delete",
        detail: `Prestation supprimée : ${p.desc || "(sans intitulé)"}`,
      });
    }
  });

  // Prestations ajoutées
  afterMap.forEach((val, key) => {
    if (!beforeMap.has(key)) {
      const p = val.p || {};
      const total = Number(p.total || (p.qty || 0) * (p.price || 0));
      const lines = [];
      lines.push(`Prestation ajoutée : ${p.desc || "(sans intitulé)"}`);
      if (p.qty != null) lines.push(`Quantité : ${p.qty}`);
      if (p.price != null)
        lines.push(`Prix unitaire : ${formatEuroFallback(p.price || 0)}`);
      lines.push(`Total : ${formatEuroFallback(total)}`);

      diffs.push({
        type: "prest_add",
        detail: lines.join("\n"),
      });
    }
  });

  // Prestations modifiées
  afterMap.forEach((val, key) => {
    if (!beforeMap.has(key)) return;

    const pBefore = beforeMap.get(key).p || {};
    const pAfter = val.p || {};
    const lines = [];

    function prestField(label, prop, formatMode) {
      const ov = pBefore[prop];
      const nv = pAfter[prop];
      if (ov == null && nv == null) return;
      if (String(ov) === String(nv)) return;

      if (formatMode === "euro") {
        lines.push(
          `${label} : ${formatEuroFallback(ov || 0)} → ${formatEuroFallback(nv || 0)}`,
        );
      } else {
        lines.push(`${label} : ${ov ?? "—"} → ${nv ?? "—"}`);
      }
    }

    prestField("Intitulé", "desc");
    prestField("Quantité", "qty");
    prestField("Prix unitaire", "price", "euro");
    prestField("Total", "total", "euro");
    prestField("Description", "detail");

    if (lines.length > 0) {
      diffs.push({
        type: "prest_update",
        detail:
          `Prestation modifiée : ${
            pAfter.desc || pBefore.desc || "(sans intitulé)"
          }\n` + lines.join("\n"),
      });
    }
  });

  // ================== TOTAUX ==================
  euroDiff("Sous-total HT", before.subtotal, after.subtotal);

  const oldBase =
    Number(before.subtotal || 0) - Number(before.discountAmount || 0);
  const newBase =
    Number(after.subtotal || 0) - Number(after.discountAmount || 0);
  euroDiff("Base après réduction", oldBase, newBase);

  euroDiff("Montant réduction", before.discountAmount, after.discountAmount);
  euroDiff("TVA", before.tvaAmount, after.tvaAmount);
  euroDiff("Total TTC", before.totalTTC, after.totalTTC);

  // ================== STATUT ==================
  if ((before.status || "") !== (after.status || "")) {
    diffs.push({
      type: "status",
      detail: `Statut modifié : ${before.status || "—"} → ${after.status || "—"}`,
    });
  }

  // ================== PAIEMENT ==================
  const bPaid = !!before.paid;
  const aPaid = !!after.paid;

  if (
    bPaid !== aPaid ||
    (before.paymentMode || "") !== (after.paymentMode || "")
  ) {
    let detail;
    if (!bPaid && aPaid) {
      const mode = after.paymentMode || "inconnu";
      const date = after.paymentDate || after.date || "";
      detail = `Paiement enregistré : ${mode.toUpperCase()} le ${date || "date non renseignée"}`;
    } else if (bPaid && !aPaid) {
      detail = "Retour à impayé";
    } else {
      detail = `Mode de paiement modifié : ${before.paymentMode || "—"} → ${after.paymentMode || "—"}`;
    }
    diffs.push({
      type: "payment",
      detail,
    });
  }

  return diffs;
}

// =====================================
// MICRO TVA – GARDE-FOU 0 % / 20 %
// =====================================

function onMainTvaRadioChange(rate) {
  const status = getMicroTvaStatus();
  const tva0 = document.getElementById("tva0");
  const tva20 = document.getElementById("tva20");

  // 🟦 Cas 1 : tu es encore en franchise (CA ≤ 37 500) -> TVA 0% obligatoire
  if (status === "franchise" && rate > 0) {
    if (tva0 && tva20) {
      tva0.checked = true;
      tva20.checked = false;
    }

    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "TVA non applicable",
        message:
          "Tu es encore sous le seuil micro (" +
          MICRO_TVA_THRESHOLD_BASE.toLocaleString("fr-FR") +
          " € encaissés TTC).\n\n" +
          "On reste automatiquement en TVA 0 %.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️",
      });
    }
    setTVA(0);
    return;
  }

  // 🔴 Cas 2 : seuil dépassé -> TVA 20 % obligatoire, pas de retour à 0 %
  if (status === "obligatoire" && rate === 0) {
    if (tva0 && tva20) {
      tva0.checked = false;
      tva20.checked = true;
    }

    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "TVA obligatoire",
        message:
          "Le seuil micro de " +
          MICRO_TVA_THRESHOLD_TTC.toLocaleString("fr-FR") +
          " € encaissés TTC a été dépassé.\n\n" +
          "Les nouvelles factures doivent être émises avec une TVA de 20 %. " +
          "Les contrats déjà en place, eux, ne sont pas modifiés automatiquement.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "⚠️",
      });
    }
    setTVA(20);
    return;
  }

  // ✅ Cas normal : on applique ce que tu as choisi
  setTVA(rate);
}

// =====================================
// 🚫 CONTRAT – Interdire TVA 20% si micro
// =====================================
function enforceContractMicroTVA(showAlert = false) {
  const status = getMicroTvaStatus(); // "franchise" ou "obligatoire"

  const tvaInput = document.getElementById("tvaRate");
  if (!tvaInput) return true;

  const ct0 = document.getElementById("ctTva0");
  const ct20 = document.getElementById("ctTva20");

  // taux actuel
  const currentRate = Number(tvaInput.value || 0);

  // Règle micro : franchise => 0, obligatoire => 20
  const forcedRate = status === "obligatoire" ? 20 : 0;

  // Si on doit forcer et que ce n'est pas déjà le bon taux
  if (currentRate !== forcedRate) {
    if (showAlert) {
      const msg =
        forcedRate === 0
          ? "Tu es en franchise micro : TVA 20% interdite.\n➡️ TVA remise à 0%."
          : "Seuil micro dépassé : TVA 20% obligatoire.\n➡️ TVA forcée à 20%.";

      if (typeof showConfirmDialog === "function") {
        showConfirmDialog({
          title: forcedRate === 0 ? "TVA non applicable" : "TVA obligatoire",
          message: msg,
          confirmLabel: "OK",
          cancelLabel: "",
          variant: forcedRate === 0 ? "info" : "warning",
          icon: forcedRate === 0 ? "ℹ️" : "⚠️",
        });
      } else {
        alert(msg);
      }
    }

    // ✅ Force via setTVA pour garder toute ta logique (note, labels, totaux)
    if (typeof setTVA === "function") {
      setTVA(forcedRate);
    } else {
      tvaInput.value = String(forcedRate);
    }

    // 🔘 radios contrat
    if (ct0 && ct20) {
      ct0.checked = forcedRate === 0;
      ct20.checked = forcedRate === 20;

      // verrouillage (impossible de choisir l'autre)
      ct0.disabled = forcedRate === 20;
      ct20.disabled = forcedRate === 0;
    }

    // (optionnel) sync radios devis/facture si présents
    const tva0 = document.getElementById("tva0");
    const tva20 = document.getElementById("tva20");
    if (tva0 && tva20) {
      tva0.checked = forcedRate === 0;
      tva20.checked = forcedRate === 20;
      tva0.disabled = forcedRate === 20;
      tva20.disabled = forcedRate === 0;
    }

    // recalculs
    if (typeof calculateTotals === "function") calculateTotals();
    if (typeof recomputeContract === "function") recomputeContract();

    return false;
  }

  // Même si pas de changement, on met les locks cohérents
  if (ct0 && ct20) {
    ct0.disabled = forcedRate === 20;
    ct20.disabled = forcedRate === 0;
  }

  return true;
}

/* =======================================================
   MODULE 3 — AUDIT INTELLIGENT
======================================================= */

function auditDocument(doc) {
  const results = [];

  if (!doc) return results;

  // Helpers
  const add = (cat, status, detail) => {
    results.push({ cat, status, detail });
  };

  const today = new Date().toISOString().split("T")[0];
  const subtotal = Number(doc.subtotal || 0);
  const tvaRate = Number(doc.tvaRate || 0);
  const tvaAmount = Number(doc.tvaAmount || 0);
  const discountAmount = Number(doc.discountAmount || 0);
  const totalTTC = Number(doc.totalTTC || 0);

  const calcCheck = (subtotal - discountAmount) * (1 + tvaRate / 100);

  // ================== TVA ==================
  if (doc.microBIC === true && tvaRate > 0) {
    add(
      "TVA",
      "warn",
      "TVA activée alors que vous êtes en micro-BIC (devrait être 0%).",
    );
  } else {
    add("TVA", "ok", `TVA : ${tvaRate}%`);
  }

  // ================== Dates ==================
  if (doc.type === "devis") {
    if (doc.validityDate && doc.validityDate < doc.date) {
      add(
        "Dates",
        "crit",
        "La date de validité est antérieure à la date du devis.",
      );
    } else {
      add("Dates", "ok", "Dates cohérentes.");
    }
  }

  if (doc.type === "facture") {
    if (doc.paymentDate && doc.paymentDate > today) {
      add("Paiement", "warn", "La date de paiement est dans le futur.");
    }
  }

  // ================== Prestations ==================
  if (!doc.prestations || doc.prestations.length === 0) {
    add("Prestations", "crit", "Aucune prestation dans le document.");
  } else {
    add("Prestations", "ok", `${doc.prestations.length} prestation(s).`);
  }

  // ================== Totaux ==================
  if (Math.abs(totalTTC - calcCheck) > 0.5) {
    add("Totaux", "crit", "Les totaux HT/TVA/TTC ne correspondent pas.");
  } else {
    add("Totaux", "ok", "Totaux cohérents.");
  }

  // ================== Réduction ==================
  if (doc.discountRate > 100) {
    add("Réduction", "crit", "La réduction dépasse 100%.");
  } else if (doc.discountRate > 0 && doc.discountRate <= 100) {
    add("Réduction", "ok", `Réduction : ${doc.discountRate}%`);
  } else {
    add("Réduction", "ok", "Pas de réduction.");
  }

  // ================== Analyse comportementale ==================
  if (doc.type === "devis") {
    if (doc.status === "signé") {
      const daysSince = daysBetween(doc.date, today);
      if (daysSince >= 7) {
        add(
          "Comportement",
          "warn",
          `Devis signé depuis ${daysSince} jours : aucune facture créée.`,
        );
      }
    }
    if (doc.status === "en_attente") {
      const wait = daysBetween(doc.date, today);
      if (wait >= 30) {
        add("Comportement", "warn", `Devis en attente depuis ${wait} jours.`);
      }
    }
  }

  if (doc.type === "facture") {
    if (!doc.paid) {
      const age = daysBetween(doc.date, today);
      if (age >= 30) {
        add("Paiement", "crit", `Facture impayée depuis ${age} jours.`);
      }
    }
  }

  return results;
}

function daysBetween(d1, d2) {
  try {
    const a = new Date(d1);
    const b = new Date(d2);
    return Math.round((b - a) / 86400000);
  } catch {
    return 0;
  }
}

function hideHealthCardsEverywhere() {
  document.getElementById("documentHealthCard")?.classList.add("hidden");
  document.getElementById("contractDocumentHealthCard")?.classList.add("hidden");
}

function showHealthCardForCurrentView(view) {
  hideHealthCardsEverywhere();
  if (view === "doc") document.getElementById("documentHealthCard")?.classList.remove("hidden");
  if (view === "contract") document.getElementById("contractDocumentHealthCard")?.classList.remove("hidden");
}


/* =======================  ===========================
   Module d’analyse automatique de la santé d’un document
   ================================================================ */

function refreshDocumentHealthUI(doc) {
  if (!doc) return;

  let tbody = null;
  const contractView = document.getElementById("contractView");
  const contractViewVisible = contractView && !contractView.classList.contains("hidden");

  // ✅ FORCER l'affichage de la bonne carte (sinon elle peut rester cachée)
  const cardId = contractViewVisible ? "contractDocumentHealthCard" : "documentHealthCard";
  const card = document.getElementById(cardId);
  if (card) {
    card.classList.remove("hidden");
    card.style.display = ""; // laisse le CSS décider
  }

  if (contractViewVisible) {
    tbody = document.getElementById("contractDocumentHealthBody");
  } else {
    tbody = document.getElementById("documentHealthBody");
  }

  if (!tbody) return;
  tbody.innerHTML = "";
  const rows = [];

  // Contexte
  const docType = doc.type || "";
  const isContract = contractViewVisible; // showing contract screen = contract context
  const isInvoice = !isContract && docType === "facture";
  const isQuote = !isContract && docType === "devis";

  /* -------- 1. STATUT FACTURE (factures seulement) -------- */
  if (isInvoice) {
    const isPaid = !!doc.paid;
    const paymentDate = doc.paymentDate || null;
    const docDate = doc.date ? new Date(doc.date) : null;

    if (!isPaid) {
      let daysLate = "";
      if (docDate) {
        const now = new Date();
        const diff = Math.floor((now - docDate) / (1000 * 60 * 60 * 24));
        daysLate = diff;
      }

      if (daysLate >= 30) {
        rows.push({
          cat: "Facture impayée",
          status: "🔴 Critique",
          detail: `En retard de ${daysLate} jours`,
        });
      } else {
        rows.push({
          cat: "Facture impayée",
          status: "🟠 À surveiller",
          detail: daysLate ? `${daysLate} jours depuis émission` : "—",
        });
      }
    } else {
      rows.push({
        cat: "Paiement",
        status: "🟢 Payée",
        detail: paymentDate
          ? `Réglée le ${paymentDate}`
          : "Date non renseignée",
      });
    }
  }

  /* -------- 2. VALIDITÉ DEVIS (devis seulement) -------- */
  if (isQuote) {
    if (doc.validityDate) {
      const today = new Date();
      const validity = new Date(doc.validityDate);

      if (validity < today) {
        rows.push({
          cat: "Validité devis",
          status: "🔴 Expiré",
          detail: `Devis expiré le ${doc.validityDate}`,
        });
      } else {
        const diff = Math.floor((validity - today) / (1000 * 60 * 60 * 24));
        rows.push({
          cat: "Validité devis",
          status: "🟢 Valide",
          detail: `Expire dans ${diff} jours`,
        });
      }
    } else {
      rows.push({
        cat: "Validité devis",
        status: "⚠️ Manquante",
        detail: "Aucune date de validité définie",
      });
    }
  }

  /* -------- 3. INFORMATIONS CLIENT (tous les types) -------- */
  const clientName = (doc.client && doc.client.name) || doc.clientName || "";
  const clientAddress =
    (doc.client && doc.client.address) || doc.clientAddress || "";

  if (!clientName || !clientAddress) {
    rows.push({
      cat: "Client",
      status: "⚠️ Incomplet",
      detail: "Nom ou adresse manquants",
    });
  } else {
    rows.push({
      cat: "Client",
      status: "🟢 OK",
      detail: clientName,
    });
  }

  /* -------- 4. PRESTATIONS + TVA (devis + factures uniquement) -------- */
  if (!isContract) {
    // Prestations
    if (!doc.prestations || doc.prestations.length === 0) {
      rows.push({
        cat: "Prestations",
        status: "⚠️ Vide",
        detail: "Aucune prestation ajoutée",
      });
    } else {
      rows.push({
        cat: "Prestations",
        status: "🟢 OK",
        detail: `${doc.prestations.length} prestation(s)`,
      });
    }

    // TVA
    const rate = typeof doc.tvaRate === "number" ? doc.tvaRate : 0;
    if (rate === 0) {
      rows.push({
        cat: "TVA",
        status: "🟢 0 %",
        detail: "TVA non applicable",
      });
    } else if (rate === 20) {
      rows.push({
        cat: "TVA",
        status: "🟢 20 %",
        detail: "Taux standard",
      });
    } else {
      rows.push({
        cat: "TVA",
        status: "⚠️ Atypique",
        detail: `${rate} %`,
      });
    }
  }

  /* -------- 5. SPÉCIFIQUE CONTRATS -------- */
  if (isContract) {
    const pr = doc.pricing || {};

    // 5.1 Statut du contrat
    if (typeof computeContractStatus === "function") {
      const st = computeContractStatus(doc);
      let label = "En cours";
      let icon = "🟢";

      if (st === CONTRACT_STATUS.A_RENOUVELER) {
        label = "À renouveler";
        icon = "🟠";
      } else if (st === CONTRACT_STATUS.TERMINE) {
        label = "Terminé";
        icon = "⚪";
      } else if (st === CONTRACT_STATUS.RESILIE) {
        label = "Résilié";
        icon = "🔴";
      }

      rows.push({
        cat: "Contrat",
        status: `${icon} ${label}`,
        detail: pr.periodLabel || "",
      });
    }

    // 5.2 Période
    const start = pr.startDate || "";
    const endLabel = pr.endDateLabel || "";

    if (start || endLabel) {
      let detail = "";
      if (start && endLabel) {
        detail = `Du ${start} au ${endLabel}`;
      } else if (start && pr.durationMonths) {
        detail = `Débute le ${start} – durée ${pr.durationMonths} mois`;
      } else if (start) {
        detail = `Débute le ${start}`;
      } else {
        detail = endLabel;
      }

      rows.push({
        cat: "Période",
        status: "🟢 OK",
        detail,
      });
    } else {
      rows.push({
        cat: "Période",
        status: "⚠️ Incomplète",
        detail: "Dates de début / fin manquantes",
      });
    }

    // 5.3 Visites / prix
    if (typeof pr.totalPassages === "number" && pr.totalPassages > 0) {
      const unit =
        typeof pr.unitPrice === "number"
          ? pr.unitPrice.toFixed(2)
          : pr.unitPrice || "?";
      rows.push({
        cat: "Visites",
        status: "🟢 OK",
        detail: `${pr.totalPassages} visites à ${unit} €`,
      });
    } else {
      rows.push({
        cat: "Visites",
        status: "⚠️ Manquantes",
        detail: "Total de visites non défini",
      });
    }

    // 5.4 Facturation
    const billingMode = pr.billingMode || "";
    if (billingMode) {
      const mapBilling = {
        mensuel: "Mensuel",
        annuel_50_50: "Annuel en deux fois",
        trimestriel: "Trimestriel",
        semestriel: "Semestriel",
        annuel: "Annuel",
      };
      const bLabel = mapBilling[billingMode] || billingMode;
      let detail = bLabel;

      if (pr.nextInvoiceDate) {
        detail += ` – prochaine facture le ${pr.nextInvoiceDate}`;
      }

      rows.push({
        cat: "Facturation",
        status: "🟢 OK",
        detail,
      });
    } else {
      rows.push({
        cat: "Facturation",
        status: "⚠️ Non définie",
        detail: "Aucun mode de facturation choisi",
      });
    }

    // 5.5 Options
    const opts = pr.options || {};
    const optList = [];
    if (opts.airbnb || pr.airbnbOption) optList.push("Usage Airbnb +20 %");
    if (opts.openingIncluded || pr.includeOpening)
      optList.push("Mise en service incluse");
    if (opts.winterIncluded || pr.includeWinter)
      optList.push("Hivernage inclus");

    rows.push({
      cat: "Options",
      status: optList.length ? "🟢 OK" : "—",
      detail: optList.length
        ? optList.join(" · ")
        : "Aucune option particulière",
    });

    // 5.6 TVA contrat (si tu veux la remonter ici aussi)
    const rateC =
      typeof pr.tvaRate === "number"
        ? pr.tvaRate
        : typeof doc.tvaRate === "number"
          ? doc.tvaRate
          : 0;
    if (rateC === 0) {
      rows.push({
        cat: "TVA",
        status: "🟢 0 %",
        detail: "TVA non applicable",
      });
    } else if (rateC === 20) {
      rows.push({
        cat: "TVA",
        status: "🟢 20 %",
        detail: "Taux standard",
      });
    } else {
      rows.push({
        cat: "TVA",
        status: "⚠️ Atypique",
        detail: `${rateC} %`,
      });
    }
  }

  /* -------- RENDU HTML -------- */
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.cat}</td>
      <td>${r.status}</td>
      <td>${r.detail}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ================== LISTE DOCUMENTS & STATUTS ==================

function loadDocumentsList() {
  // Cas spécial : onglet Contrats
  if (currentListType === "contrat") {
    loadContractsList();
    return;
  }

  // 🔎 Récupération des documents AVANT les filtres
  const docs = getAllDocuments();

  // On garde seulement le type courant (devis / facture)
  let filtered = docs.filter((d) => d.type === currentListType);

  // 🔎 FILTRE ANNÉE (AUTO)
  const selectedYear = document.getElementById("yearMenu")?.value || "all";

  if (selectedYear !== "all") {
    filtered = filtered.filter((d) => {
      if (!d.date) return false;
      return String(d.date).startsWith(selectedYear);
    });
  }

  // 🔵 Filtres spécifiques aux FACTURES
  if (currentListType === "facture") {
    // Filtre année
    const yearSel = document.getElementById("yearFilter");
    if (yearSel && yearSel.value !== "all") {
      const y = parseInt(yearSel.value, 10);
      filtered = filtered.filter(
        (d) => d.date && new Date(d.date).getFullYear() === y,
      );
    }

    // Filtre "seulement les factures impayées"
    const unpaidToggle = document.getElementById("filterUnpaid");
    if (unpaidToggle && unpaidToggle.checked) {
      filtered = filtered.filter((d) => !d.paid);
    }
  }

  // 🔍 Filtre recherche (numéro, client, objet, statut, montant)
  const searchInput = document.getElementById("docSearchInput");
  const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
  if (q) {
    filtered = filtered.filter((d) => {
      const number = (d.number || "").toLowerCase();
      const clientName = (d.client?.name || "").toLowerCase();
      const subject = (d.subject || "").toLowerCase();
      const status = (d.status || "").toLowerCase();
      const totalStr =
        d.totalTTC != null ? d.totalTTC.toFixed(2).replace(".", ",") : "";

      return (
        number.includes(q) ||
        clientName.includes(q) ||
        subject.includes(q) ||
        status.includes(q) ||
        totalStr.includes(q)
      );
    });
  }

  // 🔽 Tri : date ou numéro selon le select
  const sortSel = document.getElementById("sortDocumentsBy");
  const sortMode = sortSel ? sortSel.value : "date_desc";

  filtered.sort((a, b) => {
    if (sortMode === "number_desc") {
      const na = (a.number || "").toString();
      const nb = (b.number || "").toString();
      // On compare en chaîne, mais comme tes numéros sont normalisés ça passe très bien
      return nb.localeCompare(na, "fr", { numeric: true });
    }

    // défaut : date décroissante
    const da = a.date ? new Date(a.date) : new Date(a.createdAt || 0);
    const db = b.date ? new Date(b.date) : new Date(b.createdAt || 0);
    return db - da;
  });

  const tbody = document.getElementById("documentsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="no-docs-cell">Aucun document pour le moment</td></tr>';
    return;
  }

  filtered.forEach((doc) => {
    const tr = document.createElement("tr");
    const typeLabel = doc.type === "devis" ? "Devis" : "Facture";

    // Badge type (Devis / Facture payée / non payée)
    let badgeClass;
    if (doc.type === "devis") {
      badgeClass = "badge-devis";
    } else {
      badgeClass = doc.paid ? "badge-facture-paid" : "badge-facture-unpaid";
    }

    // ====== STATUT (colonne) ======

    let statutHTML = "";

    // --- FACTURE ---

    if (doc.type === "facture") {
      const mode = doc.paymentMode || "";
      const modeLabel =
        mode === "especes"
          ? "Espèces"
          : mode === "cb"
            ? "CB"
            : mode === "virement"
              ? "Virement"
              : mode === "cheque"
                ? "Chèque"
                : "";

      const DELAI_REGLEMENT_JOURS = 30;

      let badgeStatus;
      let statusText;

      if (doc.paid) {
        // ✅ Facture payée
        badgeStatus = "badge-paid";
        statusText = "🟢 Payée" + (modeLabel ? " (" + modeLabel + ")" : "");
      } else {
        // ❌ Facture non payée -> on regarde si elle est en retard ou non
        badgeStatus = "badge-unpaid";

        let isLate = false;

        if (doc.date) {
          const d = new Date(doc.date);
          const today = new Date();
          d.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          const diffDays = Math.floor(
            (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (!isNaN(diffDays) && diffDays > DELAI_REGLEMENT_JOURS) {
            isLate = true;
          }
        }

        if (isLate) {
          badgeStatus = "badge-unpaid"; // rouge (déjà existant)
          statusText = "🔴 En retard";
        } else {
          badgeStatus = "badge-pending"; // 👉 notre nouvelle classe orange
          statusText = "🟡 En attente";
        }
      }

      statutHTML =
        `<span class="badge ${badgeStatus}">${statusText}</span>` +
        (doc.paymentDate && doc.paid
          ? `<div class="status-sub">le ${new Date(
              doc.paymentDate,
            ).toLocaleDateString("fr-FR")}</div>`
          : "");

      // + radios en dessous (Non réglée / Espèces / CB / Virement / Chèque)
      const modeRadio =
        `<div class="pay-line">` +
        `<label><input type="radio" name="mode-${doc.id}" value="" ${
          !mode ? "checked" : ""
        } onchange="setPaymentMode('${doc.id}', '')"> Non réglée</label> ` +
        `<label><input type="radio" name="mode-${doc.id}" value="especes" ${
          mode === "especes" ? "checked" : ""
        } onchange="setPaymentMode('${doc.id}', 'especes')"> Espèces</label> ` +
        `<label><input type="radio" name="mode-${doc.id}" value="cb" ${
          mode === "cb" ? "checked" : ""
        } onchange="setPaymentMode('${doc.id}', 'cb')"> CB</label> ` +
        `<label><input type="radio" name="mode-${doc.id}" value="virement" ${
          mode === "virement" ? "checked" : ""
        } onchange="setPaymentMode('${doc.id}', 'virement')"> Virement</label> ` +
        `<label><input type="radio" name="mode-${doc.id}" value="cheque" ${
          mode === "cheque" ? "checked" : ""
        } onchange="setPaymentMode('${doc.id}', 'cheque')"> Chèque</label>` +
        `</div>`;

      statutHTML += "<br>" + modeRadio;
    }

    // --- DEVIS ---
    if (doc.type === "devis") {
      let storedStatus = doc.status || "en_attente";
      let displayStatus = storedStatus;

      if (
        isDevisExpired("devis", doc.validityDate) &&
        storedStatus === "en_attente"
      ) {
        displayStatus = "expire";
      }

      let badgeDevisClass = "badge-devis-en-attente";
      let text = "En attente";

      if (displayStatus === "accepte") {
        badgeDevisClass = "badge-devis-accepte";
        text = "Accepté";
      } else if (displayStatus === "cloture") {
        badgeDevisClass = "badge-devis-cloture";
        text = "Clôturé";
      } else if (displayStatus === "refuse") {
        badgeDevisClass = "badge-devis-refuse";
        text = "Refusé";
      } else if (displayStatus === "expire") {
        badgeDevisClass = "badge-devis-expire";
        text = "Expiré";
      }

      const selectHtml =
        `<select style="font-size:11px;margin-top:4px;" ` +
        `onchange="setDevisStatus('${doc.id}', this.value)">` +
        `<option value="en_attente" ${
          storedStatus === "en_attente" ? "selected" : ""
        }>En attente</option>` +
        `<option value="accepte" ${
          storedStatus === "accepte" ? "selected" : ""
        }>Accepté</option>` +
        `<option value="cloture" ${
          storedStatus === "cloture" ? "selected" : ""
        }>Clôturé</option>` +
        `<option value="refuse" ${
          storedStatus === "refuse" ? "selected" : ""
        }>Refusé</option>` +
        `<option value="expire" ${
          storedStatus === "expire" ? "selected" : ""
        }>Expiré</option>` +
        `</select>`;

      statutHTML =
        `<span class="badge ${badgeDevisClass}">${text}</span><br>` +
        selectHtml;
    }

    // ====== BOUTONS (Modifier / Imprimer / Aperçu / Supprimer) ======
    let openBtnClass = "btn btn-primary btn-small";
    let printBtnClass = "btn btn-primary btn-small";

    if (doc.type === "facture") {
      if (doc.paid) {
        openBtnClass = "btn btn-success btn-small";
        printBtnClass = "btn btn-success btn-small";
      } else {
        openBtnClass = "btn btn-danger btn-small";
        printBtnClass = "btn btn-danger btn-small";
      }
    }

    const previewBtnClass = printBtnClass;
    const deleteBtnClass = "btn btn-danger btn-small";

    const actionsHtml =
      `<div class="actions-btns">` +
      `<div class="actions-btns-row">
           <button class="${openBtnClass}" type="button"
                   onclick="loadDocument('${doc.id}')">Modifier</button>
           <button class="${printBtnClass}" type="button"
                   onclick="openPrintable('${doc.id}')">Imprimer</button>
         </div>` +
      `<div class="actions-btns-row">
           <button class="${previewBtnClass}" type="button"
                   onclick="openPrintable('${doc.id}', true)">Aperçu</button>
           <button class="${deleteBtnClass}" type="button"
                   onclick="deleteDocument('${doc.id}')">Supprimer</button>
         </div>` +
      `</div>`;

    // ====== LIGNE DU TABLEAU ======
    const clientName = doc.client?.name || "";
    const subject = (doc.subject || "").trim();
    const safeClient = escapeHtml(clientName);
    const safeSubject = escapeHtml(subject);
    const dateText = doc.date
      ? new Date(doc.date).toLocaleDateString("fr-FR")
      : "";

    tr.innerHTML =
      `<td><span class="badge ${badgeClass}">${typeLabel}</span></td>` +
      `<td class="number-cell">
         <div class="doc-number">${escapeHtml(doc.number || "")}</div>` +
      (subject
        ? `<div class="client-subject" title="${safeSubject}">${safeSubject}</div>`
        : "") +
      `</td>` +
      `<td class="client-cell">
         <div class="client-main" title="${safeClient}">${safeClient || "-"}</div>
      </td>` +
      `<td>${dateText}</td>` +
      `<td><strong>${formatEuro(doc.totalTTC)}</strong></td>` +
      `<td class="status-cell">${statutHTML}</td>` +
      `<td>${actionsHtml}</td>`;

    tbody.appendChild(tr);
  });
}

function loadAttestationsList() {
  const tbody = document.getElementById("attestationsTableBody");
  if (!tbody) return;

  const list = getAllAttestations()
    .slice()
    .sort((a, b) => {
      const ad = a.date || "";
      const bd = b.date || "";
      return ad.localeCompare(bd);
    });

  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="no-docs-cell">
          Aucune attestation enregistrée pour le moment
        </td>
      </tr>
    `;
    return;
  }

  list.forEach((att) => {
    const frDate = att.date ? att.date.split("-").reverse().join("/") : "";
    const source = att.sourceDocNumber ? `Facture ${att.sourceDocNumber}` : "";
    const units = att.units != null ? att.units : "";

    tbody.innerHTML += `
      <tr>
        <td>${frDate}</td>
        <td>${att.clientName || ""}</td>
        <td>${att.clientAddress || ""}</td>
        <td>${units}</td>
        <td>${source}</td>
        <td class="col-actions">
          <button
            class="btn btn-small btn-primary"
            onclick="openAttestationPopupForEdit('${att.id}')">
            Ouvrir
          </button>
          <button
            class="btn btn-small btn-secondary"
            onclick="openAttestationPreview('${att.id}')">
            Aperçu
          </button>
          <button
            class="btn btn-small btn-success"
            onclick="printAttestation('${att.id}')">
            Imprimer
          </button>
          <button
            class="btn btn-danger btn-small"
            onclick="deleteAttestation('${att.id}')">
            Supprimer
          </button>
        </td>
      </tr>
    `;
  });
}

function deleteAttestation(attId) {
  showConfirmDialog({
    title: "Supprimer cette attestation",
    message: "Voulez-vous vraiment supprimer cette attestation ?",
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "🗑️",
    onConfirm: () => {
      const list = getAllAttestations().filter((a) => a.id !== attId);
      saveAttestations(list);
      loadAttestationsList();

      // ✅ delete Firestore (ou queue)
      if (!db || !navigator.onLine) {
        enqueueSync({
          collection: "attestations",
          action: "delete",
          docId: attId,
        });
        updateOfflineBadge();
        return;
      }

      db.collection("attestations").doc(attId).delete().catch((e) => {
        console.error("Erreur Firestore delete attestation:", e);
        enqueueSync({
          collection: "attestations",
          action: "delete",
          docId: attId,
        });
      });

      processSyncQueue();
    },
  });
}


function openAttestationForInvoice(doc) {
  if (!doc) return;

  // On mémorise la facture source
  if (typeof currentAttestationSource === "undefined") {
    window.currentAttestationSource = null;
  }

  currentAttestationSource = {
    id: doc.id || null,
    number: doc.number || null,
  };

  // Pré-remplissage des champs de la popup
  const attName = document.getElementById("attClientName");
  const attAddr = document.getElementById("attClientAddress");
  const attDate = document.getElementById("attDate");
  const attUnits = document.getElementById("attUnits");
  const attNotes = document.getElementById("attNotes");

  if (attName) attName.value = (doc.client && doc.client.name) || "";
  if (attAddr) attAddr.value = (doc.client && doc.client.address) || "";
  if (attDate)
    attDate.value = doc.date || new Date().toISOString().slice(0, 10);
  if (attUnits && !attUnits.value) attUnits.value = 1;
  if (attNotes) attNotes.value = "";

  // On ouvre la popup (elle garde ce qu’on vient de mettre)
  openClimAttestationGenerator();
}

// Utilisé par Aperçu / Imprimer
function generatePDFAttestationFromRecord(record, mode = "print") {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("Librairie jsPDF manquante pour générer le PDF.");
    return;
  }

  const doc = new window.jspdf.jsPDF("p", "mm", "a4");

  const blue = { r: 26, g: 116, b: 217 }; // #1a74d9
  const light = { r: 248, g: 250, b: 252 }; // fond cartes
  const margin = 15;

  /* ================= HEADER ================= */

  // bandeau bleu en haut
  doc.setFillColor(blue.r, blue.g, blue.b);
  doc.rect(0, 0, 210, 30, "F");

  // titre AquaClim en blanc
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AquaClim Prestige", margin, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Entretien & Dépannage – Climatisation & Piscine", margin, 24);

  // Petit badge "ATTESTATION D'ENTRETIEN / CLIMATISATION" en haut à droite

  const pageWidth = doc.internal.pageSize.getWidth();

  const pillW = 90; // <<< beaucoup plus petit
  const pillH = 16;
  const pillRight = 10; // marge à droite
  const pillY = 16;

  const pillX = pageWidth - pillRight - pillW;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.roundedRect(pillX, pillY, pillW, pillH, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7); // plus petit pour tenir dans un petit badge
  doc.setTextColor(blue.r, blue.g, blue.b);

  // texte sur 2 lignes, centré dans le petit badge
  doc.text("ATTESTATION D'ENTRETIEN", pillX + pillW / 2, pillY + 6, {
    align: "center",
  });
  doc.text("CLIMATISATION", pillX + pillW / 2, pillY + 12, { align: "center" });

  /* ================= COORDONNÉES ================= */

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  let y = 38;

  const company = getCompanySettings();
  doc.text(`${company.legalName} – ${company.address}`, margin, y);
  y += 5;
  doc.text(`Tél : ${company.phone} – Email : ${company.email}`, margin, y);
  y += 8;
  /* ================= TITRE DOCUMENT ================= */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(blue.r, blue.g, blue.b);
  doc.text("Attestation d’entretien de climatisation", margin, y);
  y += 6;

  doc.setDrawColor(230, 233, 239);
  doc.line(margin, y, 210 - margin, y);
  y += 10;

  /* ================= CARTES CLIENT / INTERVENTION ================= */

  const cardW = (210 - 2 * margin - 10) / 2; // deux cartes côte à côte
  const cardH = 30;
  const cardY = y;

  // CLIENT
  doc.setFillColor(light.r, light.g, light.b);
  doc.setDrawColor(230, 233, 239);
  doc.roundedRect(margin, cardY, cardW, cardH, 3, 3, "FD");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Client", margin + 5, cardY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let clientTextY = cardY + 12;

  if (record.clientName) {
    const lines = doc.splitTextToSize(record.clientName, cardW - 10);
    doc.text(lines, margin + 5, clientTextY);
    clientTextY += lines.length * 4;
  }
  if (record.clientAddress) {
    const lines = doc.splitTextToSize(record.clientAddress, cardW - 10);
    doc.text(lines, margin + 5, clientTextY);
  }

  // INTERVENTION
  const card2X = margin + cardW + 10;
  doc.setFillColor(light.r, light.g, light.b);
  doc.setDrawColor(230, 233, 239);
  doc.roundedRect(card2X, cardY, cardW, cardH, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Intervention", card2X + 5, cardY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let interY = cardY + 12;

  if (record.date) {
    const frDate = record.date.split("-").reverse().join("/");
    doc.text("Date : " + frDate, card2X + 5, interY);
    interY += 5;
  }

  const unitsText =
    "Unités entretenues : " + (record.units != null ? record.units : 1);
  doc.text(unitsText, card2X + 5, interY);

  y = cardY + cardH + 12;

  /* ================= DÉTAIL OPÉRATIONS ================= */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(blue.r, blue.g, blue.b);
  doc.text("Détail des opérations effectuées", margin, y);
  y += 6;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const ops = [
    "Nettoyage des filtres intérieurs",
    "Nettoyage des batteries (évaporateur + condenseur)",
    "Application d’un traitement antibactérien",
    "Nettoyage des turbines",
    "Vérification des écoulements et du bac à condensats",
    "Contrôle des connexions électriques",
    "Contrôle du soufflage et test de fonctionnement",
  ];

  ops.forEach((line) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const txt = "• " + line;
    doc.text(txt, margin, y);
    y += 5;
  });

  /* ================= REMARQUES ================= */

  if (record.notes) {
    y += 8;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(blue.r, blue.g, blue.b);
    doc.text("Remarques :", margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const wrapped = doc.splitTextToSize(record.notes, 210 - 2 * margin);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 4;
  }

  /* ================= FORMULE FINALE ================= */

  if (y < 260) y = 260;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Fait pour servir et valoir ce que de droit.", margin, y);

  const fileName =
    "attestation-clim-" +
    (record.clientName
      ? record.clientName.replace(/[^a-z0-9\-]+/gi, "_")
      : "client") +
    ".pdf";

  // Sortie : print / preview / download
  if (mode === "download") {
    doc.save(fileName);
  } else {
if (mode === "print" && !isIOS()) {
  if (doc.autoPrint) doc.autoPrint();
}

const url = getPdfUrl(doc);
openPdfViewer(url);


  }
}

function openAttestationPreview(attId) {
  const list = getAllAttestations();
  const rec = list.find((a) => a.id === attId);
  if (!rec) return;
  generatePDFAttestationFromRecord(rec, "preview");
}

function printAttestation(attId) {
  const list = getAllAttestations();
  const rec = list.find((a) => a.id === attId);
  if (!rec) return;
  generatePDFAttestationFromRecord(rec, "print");
}

// ================= STATUTS + RÉSILIATION + RENOUVELLEMENT =================

function refreshContractsStatuses() {
  const list = getAllContracts();
  let changed = false;

  const updated = list.map((c) => {
    c.meta = c.meta || {};

    const oldStatus = c.status;
    const newStatus = computeContractStatus(c);

    // 1) Mettre à jour le statut du contrat si besoin
    if (newStatus !== oldStatus) {
      c.status = newStatus;
      changed = true;
    }

    // 2) Si le contrat est en "Terminé" ET lié à un devis non encore clôturé
    if (
      newStatus === CONTRACT_STATUS.TERMINE &&
      c.meta.sourceDevisId &&
      typeof setDevisStatus === "function" &&
      c.meta.sourceDevisStatus !== "cloture"
    ) {
      // On clôture le devis SANS rapport technique
      setDevisStatus(c.meta.sourceDevisId, "cloture", true);
      c.meta.sourceDevisStatus = "cloture";
      changed = true;
    }

    return c;
  });

  if (changed) {
    saveContracts(updated);
    if (db) {
      updated.forEach((c) => {
        saveSingleContractToFirestore(c);
      });
    }
  }
}

function isContractSigned(contract) {
  return !!(contract && (contract.signature || contract._inheritedSignature));
}



function updateContractsAlert() {
  const alertBox = document.getElementById("contractsAlert");
  const tabBtn = document.getElementById("tabContrats");
  if (!alertBox || !tabBtn) return;

  const all = getAllContracts();
  const toRenewCount = all.filter(
    (c) => computeContractStatus(c) === CONTRACT_STATUS.A_RENOUVELER,
  ).length;

  if (toRenewCount > 0) {
    alertBox.classList.remove("hidden");
    alertBox.innerHTML =
      `🔔 <strong>${toRenewCount}</strong> contrat` +
      (toRenewCount > 1 ? "s" : "") +
      " à renouveler dans les 30 jours.";
    tabBtn.textContent = `📘 Contrats (${toRenewCount})`;
  } else {
    alertBox.classList.add("hidden");
    alertBox.textContent = "";
    tabBtn.textContent = "📘 Contrats";
  }
}


function renderContractStatusBadge(contract) {
  const meta = contract.meta || {};
  const devisStatus = (meta.sourceDevisStatus || "").toLowerCase();

  // ✅ Statut "réel" basé sur les dates et la résiliation
  const cst = computeContractStatus(contract);

  // 🔴 Priorité absolue : Terminé / Résilié
  if (cst === CONTRACT_STATUS.TERMINE) {
    return `<span class="status-badge status-terminated">Terminé</span>`;
  }

  if (cst === CONTRACT_STATUS.RESILIE) {
    return `<span class="status-badge status-refused">Résilié</span>`;
  }

  // 🧭 Statut manuel prioritaire (utile si signature papier, etc.)
  const manual = contract?.meta?.manualStatus || "";
  if (manual === "pending_signature") {
    return `<span class="status-badge status-pending">En attente signature</span>`;
  }
  if (manual === "in_progress") {
    return `<span class="status-badge status-accepted">En cours</span>`;
  }

  // ✅ Signature réelle (contrat signé OU signature héritée du devis)
  const isSigned =
    typeof isContractSigned === "function"
      ? isContractSigned(contract)
      : !!contract.signature;

  // ✍️ Si pas signé → En attente signature
  if (!isSigned) {
    return `<span class="status-badge status-pending">En attente signature</span>`;
  }

  // 🎯 Cas contrat lié à un devis
  if (meta.sourceDevisNumber) {
    if (devisStatus === "accepte" || devisStatus === "accepted") {
      return `<span class="status-badge status-accepted">En cours</span>`;
    }

    if (devisStatus === "cloture" || devisStatus === "closed") {
      return `<span class="status-badge status-terminated">Terminé</span>`;
    }

    if (devisStatus === "en_attente" || devisStatus === "pending") {
      return `<span class="status-badge status-pending">En attente</span>`;
    }

    if (
      devisStatus === "refuse" ||
      devisStatus === "refused" ||
      devisStatus === "expire" ||
      devisStatus === "expired"
    ) {
      return `<span class="status-badge status-refused">Non validé</span>`;
    }

    return `<span class="status-badge status-pending">En attente</span>`;
  }

  // 🎯 Contrat sans devis → statut normal
  if (cst === CONTRACT_STATUS.EN_COURS)
    return `<span class="status-badge status-accepted">En cours</span>`;

  if (cst === CONTRACT_STATUS.A_RENOUVELER)
    return `<span class="status-badge status-pending">À renouveler</span>`;

  return `<span class="status-badge status-pending">En attente</span>`;
}

function renderContractStatusCell(contract) {
  const badge = renderContractStatusBadge(contract);
  const manual = contract?.meta?.manualStatus || "";

  return `
    <div class="contract-status-cell">
      ${badge}
      <select class="contract-status-select"
              title="Forcer le statut (utile si signature papier)"
              onchange="setContractManualStatusFromList('${contract.id}', this.value)">
        <option value="" ${manual === "" ? "selected" : ""}>Auto</option>
        <option value="pending_signature" ${manual === "pending_signature" ? "selected" : ""}>
          En attente signature
        </option>
        <option value="in_progress" ${manual === "in_progress" ? "selected" : ""}>
          En cours
        </option>
      </select>
    </div>
  `;
}

function setContractManualStatusFromList(contractId, value) {
  const list = getAllContracts();
  const idx = list.findIndex((c) => c.id === contractId);
  if (idx === -1) return;

  list[idx].meta = list[idx].meta || {};
  list[idx].meta.manualStatus = value || ""; // "" => retour en Auto

  saveContracts(list);

  // si tu as une sauvegarde Firestore par contrat
  if (typeof saveSingleContractToFirestore === "function") {
    saveSingleContractToFirestore(list[idx]);
  }

  // refresh liste
  if (typeof loadContractsList === "function") {
    loadContractsList();
  }
}


// ---- Popup résiliation ----

let resiliationContractId = null;

function openResiliationPopup(id) {
  resiliationContractId = id;

  const popup = document.getElementById("resiliationPopup");
  if (!popup) return;

  const whoEl = document.getElementById("resiliationWho");
  const motifEl = document.getElementById("resiliationMotif");
  const dateEl = document.getElementById("resiliationDate");

  const todayISO = new Date().toISOString().slice(0, 10);

  const contract = getContract(id);
  if (contract && contract.meta) {
    if (whoEl) whoEl.value = contract.meta.resiliationWho || "client";
    if (motifEl) motifEl.value = contract.meta.resiliationMotif || "";
    if (dateEl) dateEl.value = contract.meta.resiliationDate || "";
  } else {
    if (whoEl) whoEl.value = "client";
    if (motifEl) motifEl.value = "";
    if (dateEl) dateEl.value = ""; // vide => utilisera todayISO si rien saisi
  }

  // 🔥 affichage propre : on enlève hidden, puis on ajoute show
  popup.classList.remove("hidden");

  // force un reflow pour que le navigateur prenne bien en compte la position
  // avant d'appliquer la transition (évite le petit "saut")
  void popup.offsetWidth;

  popup.classList.add("show");
}

function closeResiliationPopup() {
  const popup = document.getElementById("resiliationPopup");
  if (!popup) return;

  // on enlève la classe d’animation
  popup.classList.remove("show");

  // on remet hidden après la fin de la transition (150 ms)
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 150);

  resiliationContractId = null;
}

function confirmResiliationPopup() {
  if (!resiliationContractId) {
    closeResiliationPopup();
    return;
  }

  const contract = getContract(resiliationContractId);
  if (!contract) {
    closeResiliationPopup();
    return;
  }

  const whoSelect = document.getElementById("resiliationWho");
  const motifInput = document.getElementById("resiliationMotif");
  const dateInput = document.getElementById("resiliationDate");

  const who = whoSelect ? whoSelect.value || "client" : "client";
  const motif = motifInput ? motifInput.value.trim() : "";

  // 🔹 Date de réception du recommandé
  let resDateISO = new Date().toISOString().slice(0, 10); // par défaut : aujourd'hui

  if (dateInput) {
    const raw = (dateInput.value || "").trim();

    if (raw) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        // format AAAA-MM-JJ (type="date")
        resDateISO = raw;
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
        // format JJ/MM/AAAA accepté aussi
        const parsed = parseFrenchDate(raw); // ta fonction existante
        if (parsed) {
          resDateISO = parsed;
        } else {
          alert("Format de date invalide. Utilise AAAA-MM-JJ ou JJ/MM/AAAA.");
          return;
        }
      } else {
        alert("Format de date invalide. Utilise AAAA-MM-JJ ou JJ/MM/AAAA.");
        return;
      }
    }
  }

  // 🔹 Mise à jour du contrat
  contract.status = CONTRACT_STATUS.RESILIE;
  if (!contract.meta) contract.meta = {};
  contract.meta.resiliationWho = who;
  contract.meta.resiliationMotif = motif;
  contract.meta.resiliationDate = resDateISO;

  // 🔹 Sauvegarde
  const list = getAllContracts();
  const idx = list.findIndex((c) => c.id === contract.id);
  if (idx >= 0) list[idx] = contract;
  else list.push(contract);

  saveContracts(list);
  saveSingleContractToFirestore(contract);

  // 🔹 Facture de clôture automatique (prorata + préavis)
  const facture = createTerminationInvoiceForContract(contract);

  closeResiliationPopup();

  if (typeof loadContractsList === "function") {
    loadContractsList();
  }

  if (facture) {
    // On propose d’ouvrir la facture
    showConfirmDialog({
      title: "Contrat résilié",
      message:
        `Le contrat a été résilié et une facture de clôture ${facture.number || ""} a été créée.\n\n` +
        `Souhaites-tu ouvrir cette facture maintenant ?`,
      confirmLabel: "Ouvrir la facture",
      cancelLabel: "Plus tard",
      variant: "success",
      icon: "✅",
      onConfirm: function () {
        if (typeof switchListType === "function") {
          switchListType("facture");
        }

        const contractView = document.getElementById("contractView");
        const formView = document.getElementById("formView");
        if (contractView) contractView.classList.add("hidden");
        if (formView) formView.classList.remove("hidden");

        if (typeof loadDocument === "function") {
          loadDocument(facture.id);
        }
        if (typeof loadDocumentsList === "function") {
          loadDocumentsList();
        }
      },
    });
  } else {
    // Rien à facturer
    showConfirmDialog({
      title: "Contrat résilié",
      message:
        "Le contrat a été résilié.\nAucun montant restant dû n’a été détecté, " +
        "aucune facture de clôture n’a été générée.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "success",
      icon: "✅",
    });
  }
}

// Bouton utilisé dans la liste + dans le formulaire

function resiliateContractFromList(id) {
  // simplement ouvrir la popup, la logique finale est dans confirmResiliationPopup()
  openResiliationPopup(id);
}

// === Helpers contrats ===

function getContractListTitle(c) {
  const pr = c.pricing || {};
  const pool = c.pool || {};
  const mainService = pr.mainService || pool.type || "";

  let label = "Contrat d’entretien";

  if (mainService === "piscine_sel" || mainService === "piscine_chlore") {
    label += " piscine";
  } else if (
    mainService === "spa" ||
    mainService === "spa_jacuzzi" ||
    mainService === "entretien_jacuzzi"
  ) {
    label += " spa / jacuzzi";
  }

  if (pr.periodLabel) {
    label += " – " + pr.periodLabel;
  }

  return label;
}

// ---- Liste des contrats (onglet "Contrats") ----

function loadContractsList() {
  // on met à jour les statuts d'abord
  refreshContractsStatuses();

  // 🔔 Met à jour le bandeau + le compteur sur l’onglet
  updateContractsAlert();

  const contracts = getAllContracts();

  const searchInput = document.getElementById("docSearchInput");
  const q = (searchInput ? searchInput.value : "").trim().toLowerCase();

  let filtered = contracts;

  // Filtre "À renouveler"
  const renewalToggle = document.getElementById("filterRenewal");
  if (renewalToggle && renewalToggle.checked) {
    filtered = filtered.filter(
      (c) =>
        computeContractStatus(c) === CONTRACT_STATUS.A_RENOUVELER ||
        computeContractStatus(c) === CONTRACT_STATUS.TERMINE,
    );
  }

  // Filtre recherche
  if (q) {
    filtered = filtered.filter((c) => {
      const ref = (c.client?.reference || "").toLowerCase();
      const name = (c.client?.name || "").toLowerCase();
      const addr = (c.client?.address || "").toLowerCase();
      const period = (c.pricing?.periodLabel || "").toLowerCase();
      return (
        ref.includes(q) ||
        name.includes(q) ||
        addr.includes(q) ||
        period.includes(q)
      );
    });
  }

  // Tri
  const sortSel = document.getElementById("sortDocumentsBy");
  const sortMode = sortSel ? sortSel.value : "date_desc";

  filtered.sort((a, b) => {
    if (sortMode === "number_desc") {
      const ra = (a.client?.reference || a.id || "").toString();
      const rb = (b.client?.reference || b.id || "").toString();
      return rb.localeCompare(ra, "fr", { numeric: true });
    }

    const da = a.pricing?.startDate || a.createdAt || "";
    const db = b.pricing?.startDate || b.createdAt || "";
    return db.localeCompare(da);
  });

  // Affichage dans le tableau
  const tbody = document.getElementById("documentsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="no-docs-cell">Aucun contrat pour le moment</td></tr>';
    return;
  }

  filtered.forEach((c) => {
    const tr = document.createElement("tr");

    const ref = c.client?.reference || "";
    const clientName = c.client?.name || "";

    // 🔵 conversion ISO → DD/MM/YYYY
    const startDateISO = c.pricing?.startDate || "";
    const startDateFR = startDateISO ? formatDateFr(startDateISO) : "";

    const totalHT = c.pricing?.totalHT != null ? c.pricing.totalHT : 0;

    const statutHTML = renderContractStatusCell(c);


    let renewedLink = "";
    if (c.meta && c.meta.renewedTo) {
      renewedLink = `
        <div class="renew-link">
          <a href="#" onclick="openContractFromList('${c.meta.renewedTo}')">
            Voir nouveau contrat →
          </a>
        </div>
      `;
    }

    const status = computeContractStatus(c);

    const renewBtn =
      status === CONTRACT_STATUS.A_RENOUVELER ||
      status === CONTRACT_STATUS.TERMINE
        ? `
        <button class="btn btn-primary btn-small" onclick="openRenewPopup('${c.id}')">
          Renouveler
        </button>
        `
        : "";

    const resiliationRow =
      status === CONTRACT_STATUS.EN_COURS ||
      status === CONTRACT_STATUS.A_RENOUVELER
        ? `
          <div class="actions-btns-row actions-btns-row--single">
            <button class="btn btn-danger btn-small"
                    type="button"
                    onclick="resiliateContractFromList('${c.id}')">
              Résilier
            </button>
          </div>
        `
        : "";

    const actionsHtml = `
      <div class="actions-btns">

        <div class="actions-btns-row">
          <button class="btn btn-primary btn-small" type="button"
                  onclick="openContractFromList('${c.id}')">Modifier</button>
          <button class="btn btn-primary btn-small" type="button"
                  onclick="printContractFromList('${c.id}')">Imprimer</button>
        </div>

        <div class="actions-btns-row">
          <button class="btn btn-primary btn-small" type="button"
                  onclick="previewContractFromList('${c.id}')">Aperçu</button>
          <button class="btn btn-success btn-small" type="button"
                  onclick="transformContractFromList('${c.id}')">Facturer</button>
        </div>

        ${
          renewBtn
            ? `<div class="actions-btns-row actions-btns-row--single">${renewBtn}</div>`
            : ""
        }

        ${resiliationRow}

        <div class="actions-btns-row actions-btns-row--single">
          <button class="btn btn-danger btn-small" type="button"
                  onclick="deleteContractFromList('${c.id}')">Supprimer</button>
        </div>

      </div>
    `;

    const title = getContractListTitle(c);
    const safeTitle = escapeHtml(title);

    tr.innerHTML =
      `<td>Contrat</td>` +
      `<td class="number-cell">
         <div class="doc-number">${escapeHtml(ref || c.id)}</div>` +
      (title
        ? `<div class="client-subject" title="${safeTitle}">${safeTitle}</div>`
        : "") +
      `</td>` +
      `<td>${escapeHtml(clientName)}</td>` +
      `<td>${escapeHtml(startDateFR || "")}</td>` +
      `<td><strong>${formatEuro(totalHT)}</strong></td>` +
      `<td class="status-cell">
        ${statutHTML}
        ${renewedLink}
      </td>` +
      `<td>${actionsHtml}</td>`;

    tbody.appendChild(tr);
  });
}

/**
 * Lorsqu'une facture vient d'être marquée comme PAYÉE,
 * on déclenche automatiquement la génération d'attestation / rapport
 * en fonction des prestations présentes dans la facture.
 */

function handleAfterInvoicePaid(doc) {
  try {
    if (!doc || doc.type !== "facture") return;

    // 1) On regarde les prestations
    const hasClimKind =
      Array.isArray(doc.prestations) &&
      doc.prestations.some(
        (p) => p && ["entretien_clim", "depannage_clim"].includes(p.kind),
      );

    // 2) On regarde aussi l'objet, au cas où tu écris "Entretien clim"
    const subj = (doc.subject || "").toLowerCase();
    const looksLikeClim =
      subj.includes("clim") || subj.includes("climatisation");

    // ❌ Si ce n’est pas une facture de clim → on ne fait rien
    if (!hasClimKind && !looksLikeClim) {
      return;
    }

    // ✅ Facture de clim payée → on génère l’attestation automatiquement
    if (typeof autoCreateClimAttestationForInvoice === "function") {
      autoCreateClimAttestationForInvoice(doc);
    }
  } catch (e) {
    console.warn("handleAfterInvoicePaid error:", e);
  }
}

// ===============================
// 🧾 Création d'une facture à partir d'un devis accepté
// ===============================
function createInvoiceFromDevis(devis) {
  if (!devis || devis.type !== "devis") return null;

  const todayISO = new Date().toISOString().slice(0, 10);

  // Numérotation facture
  let number = "";
  if (typeof getNextNumber === "function") {
    number = getNextNumber("facture");
  } else if (devis.number) {
    // petit fallback : remplace le préfixe D par F si besoin
    number = devis.number.replace(/^D/i, "F");
  } else {
    number = "FAC-" + Date.now();
  }

  // Id interne
  const id =
    typeof generateId === "function"
      ? generateId("FAC")
      : Date.now().toString();

  // Sujet : on reprend celui du devis ou on en fabrique un
  const subject =
    devis.subject || `Facture suite au devis ${devis.number || ""}`;

  // Copie profonde des prestations pour ne pas modifier le devis par erreur
  const prestations = Array.isArray(devis.prestations)
    ? devis.prestations.map((p) => ({ ...p }))
    : [];

  const tvaRate = Number(devis.tvaRate) || 0;
  const subtotal = Number(devis.subtotal) || 0;
  const discountRate = Number(devis.discountRate) || 0;
  const discountAmount = Number(devis.discountAmount) || 0;
  const tvaAmount = Number(devis.tvaAmount) || 0;
  const totalTTC = Number(devis.totalTTC) || 0;

  const notesBase = devis.notes || "";
  const notesSuffix = devis.number
    ? `\n\nFacture générée automatiquement à partir du devis ${devis.number}.`
    : `\n\nFacture générée automatiquement à partir d’un devis accepté.`;

  const invoice = {
    id,
    type: "facture",
    number,
    date: todayISO,
    validityDate: "",

    subject,

    // Client (même structure que dans saveDocument)
    client: {
      civility: devis.client?.civility || "",
      name: devis.client?.name || "",
      address: devis.client?.address || "",
      phone: devis.client?.phone || "",
      email: devis.client?.email || "",
    },

    // Lieu
    siteCivility: devis.siteCivility || "",
    siteName: devis.siteName || "",
    siteAddress: devis.siteAddress || "",

    prestations,
    tvaRate,
    subtotal,
    discountRate,
    discountAmount,
    tvaAmount,
    totalTTC,

    notes: (notesBase + notesSuffix).trim(),

    paid: false,
    paymentMode: "",
    paymentDate: "",
    status: "",

    conditionsType: devis.conditionsType || "",

    // Lien vers le devis d'origine (pratique pour filtrer plus tard)
    sourceDevisId: devis.id || null,
    sourceDevisNumber: devis.number || null,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Sauvegarde locale
  const docs = getAllDocuments();
  docs.push(invoice);
  saveDocuments(docs);

  // Firestore si dispo
  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(invoice);
  }

  // Option : vérifier le seuil micro-entreprise
  if (typeof checkMicroTVAThreshold === "function") {
    try {
      checkMicroTVAThreshold(true);
    } catch (e) {
      console.warn("Erreur checkMicroTVAThreshold sur facture auto :", e);
    }
  }

  return invoice;
}
function setPaymentMode(id, mode) {
  const docs = getAllDocuments();
  const doc = docs.find((d) => d.id === id);
  if (!doc) return;

 const wasPaid = !!doc.paid; // état avant modification

if (!mode) {
  // 🔴 Non réglée
  doc.paymentMode = "";
  doc.paid = false;
  doc.paymentDate = "";
} else {
  // 🟢 Réglée
  doc.paymentMode = mode;
  doc.paid = true;

  // Date de paiement
  const todayISO = new Date().toISOString().slice(0, 10);

  // ✅ Date de paiement = AUJOURD’HUI (sauf si déjà renseignée à la main)
  doc.paymentDate = doc.paymentDate || todayISO;
}

// 💾 On sauvegarde d'abord la facture modifiée
saveDocuments(docs);
  if (typeof refreshMicroTVAState === "function") refreshMicroTVAState(true);


  // ⚠️ Sécurité : on sauvegarde aussi dans Firestore si dispo
  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(doc);
  }

  // -------------------------------------------------------------------
  // 🔗 MISE À JOUR AUTOMATIQUE DU DEVIS LIÉ
  // -------------------------------------------------------------------
  if (
    doc.type === "facture" &&
    doc.sourceDevisId &&
    typeof setDevisStatus === "function"
  ) {
    // Passage NON PAYÉ → PAYÉ
    if (!wasPaid && doc.paid) {
      setDevisStatus(doc.sourceDevisId, "cloture");
    }

    // Passage PAYÉ → NON PAYÉ
    if (wasPaid && !doc.paid) {
      setDevisStatus(doc.sourceDevisId, "accepte");
    }
  }

  // -------------------------------------------------------------------
  // 🚀 SI FACTURE DE CLIM RÉGLÉE → génération automatique attestation
  // -------------------------------------------------------------------
  if (
    doc.type === "facture" &&
    !wasPaid &&
    doc.paid &&
    typeof handleAfterInvoicePaid === "function"
  ) {
    handleAfterInvoicePaid(doc);
  }

  // -------------------------------------------------------------------
  // 🔄 Rafraîchissement interface
  // -------------------------------------------------------------------
  if (typeof loadDocumentsList === "function") {
    loadDocumentsList();
  }
  if (typeof computeCA === "function") {
    computeCA();
  }
}

function isClimDevis(doc) {
  const list = Array.isArray(doc?.prestations) ? doc.prestations : [];
  return list.some((p) => {
    const k = String(p?.kind || "").toLowerCase();
    return k === "entretien_clim" || k === "depannage_clim";
  });
}


function setDevisStatus(id, status, skipRapport = false) {
  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === id);
  if (idx === -1) return;

  const doc = docs[idx];
  if (doc.type !== "devis") return;

  const oldStatus = doc.status || "";

  // 1) Mise à jour du devis
  doc.status = status;
  doc.updatedAt = new Date().toISOString();

  saveDocuments(docs);

  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(doc);
  }

  if (typeof loadDocumentsList === "function") {
    loadDocumentsList();
  }

// 2) Si on vient de passer à "cloture" → créer un rapport technique auto
//    (sauf si skipRapport = true, ex : fin de contrat)
if (
  status === "cloture" &&
  oldStatus !== "cloture" &&
  !skipRapport &&
  typeof createRapportFromDevis === "function"
) {
  try {
    const rapports =
      (typeof getAllRapports === "function" ? getAllRapports() : []) || [];

    // évite de générer plusieurs rapports pour le même devis
    const already = rapports.find(
      (r) => r?.source?.type === "devis" && r?.source?.id === doc.id
    );

    // ✅ STOP : si devis CLIM → pas de rapport technique auto (attestation seulement)
    const skipAutoRapport = (typeof isClimDevis === "function") ? isClimDevis(doc) : false;

    if (!already && !skipAutoRapport) {
      const rapport = createRapportFromDevis(doc); // ⚠️ doit juste créer + sauver, pas ouvrir de popup
      const numero = doc.number || doc.id || "";

      if (typeof showConfirmDialog === "function") {
        showConfirmDialog({
          title: "Rapport d’intervention créé",
          message:
            `Le devis ${numero} a été clôturé et un rapport technique d’intervention ` +
            `a été généré automatiquement.`,
          confirmLabel: "OK",
          cancelLabel: "",
          variant: "success",
          icon: "📝",
        });
      } else {
        console.log(
          "[Devis] Rapport technique créé pour le devis",
          numero,
          rapport && rapport.id
        );
      }
    }
  } catch (e) {
    console.error(
      "Erreur lors de la création automatique du rapport depuis un devis clôturé :",
      e
    );
  }
}


  // 3) Si on vient de passer à "accepte" → logique contrats + facture auto (comme avant)
  if (status === "accepte" && oldStatus !== "accepte") {
// ✅ SOLO MODE : dès qu'un devis est accepté, on force une "prochaine action"
try { setTimeout(() => maybeOpenDevisAcceptedPlanner(doc), 0); } catch(e) {}

    const contracts =
      (typeof getAllContracts === "function" ? getAllContracts() : []) || [];

    const linkedContracts = contracts.filter(
      (c) => c.meta && c.meta.sourceDevisId === doc.id,
    );

    // 🟦 CAS 1 : il y a un contrat lié → on laisse la logique actuelle (échéances, etc.)
    linkedContracts.forEach((contract) => {
      contract.meta = contract.meta || {};
      contract.meta.sourceDevisStatus = "accepte";

      // ⭐ IMPORTANT : transmettre la signature du devis au contrat particulier
      if (doc.signature) {
        contract._inheritedSignature = doc.signature;
        contract._inheritedSignatureDate =
          doc.signatureDate || new Date().toLocaleDateString("fr-FR");
      }

      // ====================
      // Gestion facturation contrat
      // ====================
      if (!contract.pricing || !contract.pricing.billingMode) return;
      if (contract.pricing.nextInvoiceDate) return;

      if (typeof rebuildContractInvoices === "function") {
        rebuildContractInvoices(contract);
      } else {
        contract.pricing.nextInvoiceDate =
          computeNextInvoiceDate(contract) || "";

        const all = getAllContracts().map((c) =>
          c.id === contract.id ? contract : c,
        );

        saveContracts(all);
        if (typeof saveSingleContractToFirestore === "function") {
          saveSingleContractToFirestore(contract);
        }
      }

      const updated = getAllContracts().map((c) =>
        c.id === contract.id ? contract : c,
      );
      saveContracts(updated);
      if (typeof saveSingleContractToFirestore === "function") {
        saveSingleContractToFirestore(contract);
      }
    });

    // 🟥 CAS 2 : aucun contrat lié → on génère une facture "classique" automatiquement
    if (
      linkedContracts.length === 0 &&
      typeof createInvoiceFromDevis === "function"
    ) {
      const factureAuto = createInvoiceFromDevis(doc);
      if (factureAuto) {
        console.log(
          "[Devis] Facture auto créée à l'acceptation :",
          factureAuto.number,
        );
      }
    }
  }

  // 4) Historique de changement de statut
  try {
    addHistoryEntry(id, {
      type: "status",
      detail: `Statut modifié : ${oldStatus || "—"} → ${status || "—"}`,
    });
  } catch (e) {
    console.error("Erreur historique statut devis:", e);
  }
}

// ================== EXPORT CSV FACTURES ==================

function exportFacturesCSV() {
  const docs = getAllDocuments().filter((d) => d.type === "facture");
  if (docs.length === 0) {
    showConfirmDialog({
      title: "Aucune facture",
      message: "Il n'y a aucune facture à exporter pour le moment.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️",
    });
    return;
  }

  let csv =
    "Numero;Date;Client;MontantHT;TVA;MontantTotal;Statut;DateReglement;ModeReglement\n";
  docs.forEach((d) => {
    const dateStr = d.date ? new Date(d.date).toLocaleDateString("fr-FR") : "";
    const statut = d.paid ? "Facture payée" : "Non payée";
    const dateReg = d.paymentDate
      ? new Date(d.paymentDate).toLocaleDateString("fr-FR")
      : d.paid && d.date
        ? new Date(d.date).toLocaleDateString("fr-FR")
        : "";
    const mode = d.paymentMode || "";
    csv +=
      [
        d.number,
        dateStr,
        (d.client?.name || "").replace(/;/g, ","),
        d.subtotal.toFixed(2),
        d.tvaAmount.toFixed(2),
        d.totalTTC.toFixed(2),
        statut,
        dateReg,
        mode,
      ].join(";") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "factures_aquaclim_prestige.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ================== TARIFS PERSONNALISÉS ==================

function getCustomPrices() {
  try {
    const raw = localStorage.getItem("customTarifs");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erreur lecture customTarifs :", e);
    return {};
  }
}

function saveCustomPrices(obj) {
  try {
    localStorage.setItem("customTarifs", JSON.stringify(obj || {}));
  } catch (e) {
    console.error("Erreur sauvegarde customTarifs :", e);
  }
}
// ================== MODÈLES PERSONNALISÉS DE PRESTATIONS ==================

function getCustomTemplates() {
  try {
    const raw = localStorage.getItem("customTemplates");
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("Erreur lecture customTemplates :", e);
    return [];
  }
}

function saveCustomTemplates(arr) {
  try {
    localStorage.setItem("customTemplates", JSON.stringify(arr || []));
  } catch (e) {
    console.error("Erreur sauvegarde customTemplates :", e);
  }
}

// Textes détaillés personnalisés (Particulier / Syndic)
function getCustomTexts() {
  try {
    const raw = localStorage.getItem("customDescTemplates");
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch (e) {
    console.error("Erreur lecture customDescTemplates :", e);
    return {};
  }
}

function saveCustomTexts(obj) {
  try {
    localStorage.setItem("customDescTemplates", JSON.stringify(obj || {}));
  } catch (e) {
    console.error("Erreur sauvegarde customDescTemplates :", e);
  }
}

/**
 * Charge les modèles personnalisés depuis le localStorage
 * et les ajoute dans PRESTATION_TEMPLATES.
 */
function loadCustomTemplates() {
  const list = getCustomTemplates();
  if (!Array.isArray(list) || !list.length) return;

  list.forEach((tpl) => {
    if (!tpl || !tpl.kind || !tpl.label) return;
    PRESTATION_TEMPLATES.push({
      label: tpl.label,
      kind: tpl.kind,
      title: tpl.title || tpl.label,
      priceParticulier: tpl.priceParticulier || 0,
      priceSyndic: tpl.priceSyndic || 0,
      descParticulier: tpl.descParticulier || "",
      descSyndic: tpl.descSyndic || "",
    });
  });
}

/**
 * Applique les textes détaillés personnalisés (Particulier / Syndic)
 * aux modèles existants (y compris ceux du code).
 */
function loadCustomTexts() {
  const map = getCustomTexts();
  const keys = Object.keys(map || {});
  if (!keys.length) return;

  keys.forEach((kind) => {
    const tpl = PRESTATION_TEMPLATES.find((t) => t.kind === kind);
    if (!tpl) return;
    const data = map[kind] || {};
    if (typeof data.descParticulier === "string") {
      tpl.descParticulier = data.descParticulier;
    }
    if (typeof data.descSyndic === "string") {
      tpl.descSyndic = data.descSyndic;
    }
  });
}

// Variables pour les éditeurs de prestations
let currentPrestationPopupKind = null; // null = ajout
let currentDescKind = null;

function syncTarifRow(input) {
  const row = input.closest("tr");
  const part = row.querySelector(".tarif-part");
  const syn = row.querySelector(".tarif-syn");
  const kind = input.dataset.kind || "";
  const coef = 1.25;

  // CAS SPÉCIAL : DÉPLACEMENT
  // => Particulier = Syndic, aucun coefficient
  if (kind === "deplacement") {
    const v = parseFloat(input.value) || 0;
    const val = v > 0 ? v : 0;
    if (part) part.value = val;
    if (syn) syn.value = val;
    return;
  }

  // CAS GÉNÉRAL : on garde ton coefficient 1,25
  if (input.classList.contains("tarif-part")) {
    const p = parseFloat(part.value) || 0;
    let newSyn = p * coef;
    newSyn = Math.ceil(newSyn / 10) * 10;
    syn.value = newSyn;
  } else {
    const s = parseFloat(syn.value) || 0;
    let newPart = s / coef;
    part.value = Math.round(newPart * 100) / 100;
  }
}

function _isSyndicInvoice(f) {
  const t = (
    f?.client?.type ||
    f?.client?.clientType ||
    f?.conditionsType ||
    ""
  )
    .toString()
    .toLowerCase();
  return t.includes("syndic") || t.includes("agence");
}

function _dueDateFromInvoice(f, delaiJours = 30) {
  if (!f?.date) return null;

  const inv = new Date(f.date + "T00:00:00");
  if (isNaN(inv.getTime())) return null;

  // ✅ Syndic/Agence : 30 jours fin de mois
  if (_isSyndicInvoice(f)) {
    const endMonth = new Date(inv);
    endMonth.setMonth(endMonth.getMonth() + 1);
    endMonth.setDate(0); // dernier jour du mois
    endMonth.setHours(0, 0, 0, 0);

    const due = new Date(endMonth);
    due.setDate(due.getDate() + delaiJours);
    return due;
  }

  // ✅ Particulier : date facture + délai
  const due = new Date(inv);
  due.setDate(due.getDate() + delaiJours);
  due.setHours(0, 0, 0, 0);
  return due;
}

function openTarifsPanelAny() {
  const listView = document.getElementById("listView");
  const homeView = document.getElementById("homeView");

  const needShowList =
    (homeView && !homeView.classList.contains("hidden")) ||
    (listView && listView.classList.contains("hidden"));

  if (needShowList && typeof openFromHome === "function") {
    openFromHome("devis"); // affiche la vue liste

    // ✅ attendre que le DOM/affichage se mette à jour, puis ouvrir le panel
    setTimeout(() => {
      openTarifsPanel();
      const panel = document.getElementById("tarifsPanel");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);

    return;
  }

  // si déjà sur listView
  openTarifsPanel();
  const panel = document.getElementById("tarifsPanel");
  if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openTarifsPanel() {
  const panel = document.getElementById("tarifsPanel");
  const tbody = document.getElementById("tarifsTableBody");
  const prestationsSection = document.querySelector(".prestations-section");
  if (!panel || !tbody) return;

  const isHidden = panel.classList.contains("hidden");

  if (isHidden) {
    panel.classList.remove("hidden");
    panel.style.display = "block";

    tbody.innerHTML = "";
    const custom = getCustomPrices();

    PRESTATION_TEMPLATES.forEach((t, idx) => {
      // ⛔ On ignore Produits & Fournitures dans le tableau des tarifs
      if (
        !t ||
        t._deleted ||
        !t.kind ||
        t.kind === "produits" ||
        t.kind === "fournitures"
      ) {
        return;
      }

      const keyPart = t.kind + "_particulier";
      const keySyn = t.kind + "_syndic";

      const valPart =
        custom[keyPart] != null ? custom[keyPart] : (t.priceParticulier ?? "");
      const valSyn =
        custom[keySyn] != null ? custom[keySyn] : (t.priceSyndic ?? "");

      const isCustom = t.kind.indexOf("custom_") === 0;

      const deleteCellHtml = isCustom
        ? `<td class="tarif-delete-cell">
       <button
         type="button"
         class="btn btn-danger btn-small date-remove-btn no-print"
         onclick="deleteCustomPrestation('${t.kind}')"
         title="Supprimer cette prestation"
       >
         ✖
       </button>
     </td>`
        : `<td></td>`;

      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td class="tarif-label-cell" onclick="toggleDescEditor('${t.kind}')">` +
        `<span class="tarif-label-text">${t.label}</span>` +
        `<span class="tarif-desc-icon" title="Afficher le texte détaillé">📝</span>` +
        `</td>` +
        `<td><input type="number" step="0.01" class="tarif-part" ` +
        `oninput="syncTarifRow(this)" data-kind="${t.kind}" data-type="particulier" value="${valPart}"></td>` +
        `<td><input type="number" step="0.01" class="tarif-syn" ` +
        `oninput="syncTarifRow(this)" data-kind="${t.kind}" data-type="syndic" value="${valSyn}"></td>` +
        deleteCellHtml;

      tbody.appendChild(tr);
    });

    document.querySelectorAll(".tarifs-button").forEach((btn) => {
      btn.textContent = "⬆️ Revenir aux prestations";
    });
  } else {
    resetTarifsPanel();
    if (prestationsSection) {
      prestationsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function resetTarifsPanel() {
  const panel = document.getElementById("tarifsPanel");
  if (!panel) return;

  panel.classList.add("hidden");
  panel.style.display = "";
  document.querySelectorAll(".tarifs-button").forEach((btn) => {
    btn.textContent = "📋 Prestations";
  });
}

function closeTarifsPanel() {
  resetTarifsPanel();
}

function saveTarifsFromUI() {
  const tbody = document.getElementById("tarifsTableBody");
  if (!tbody) return;

  const inputs = tbody.querySelectorAll("input[type='number']");
  const custom = {};

  inputs.forEach((inp) => {
    const kind = inp.dataset.kind;
    const type = inp.dataset.type;
    if (!kind || !type) return;

    const v = inp.value;
    if (v !== "") {
      const n = parseFloat(v);
      if (!isNaN(n)) {
        custom[kind + "_" + type] = n;
      }
    }
  });

  saveCustomPrices(custom);

  showConfirmDialog({
    title: "Tarifs enregistrés",
    message:
      "Les tarifs ont été sauvegardés et seront utilisés pour les prochaines prestations ajoutées.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });
}

function resetTarifs() {
  showConfirmDialog({
    title: "Réinitialiser les tarifs",
    message:
      "Voulez-vous vraiment réinitialiser tous les tarifs personnalisés et revenir aux valeurs par défaut ?",
    confirmLabel: "Réinitialiser",
    cancelLabel: "Annuler",
    variant: "warning",
    icon: "⚠️",
    onConfirm: function () {
      saveCustomPrices({});
      showConfirmDialog({
        title: "Tarifs réinitialisés",
        message:
          "Les tarifs ont été remis à zéro. Les valeurs par défaut seront utilisées.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "success",
        icon: "✅",
      });
      openTarifsPanel();
    },
  });
}
// ================== POPUP AJOUT DE PRESTATION (TARIFS) ==================

function openAddPrestationPopup() {
  currentPrestationPopupKind = null;

  const overlay = document.getElementById("prestationPopup");
  if (!overlay) return;

  const titleEl = document.getElementById("popupTitle");
  const nameInput = document.getElementById("popupName");
  const partInput = document.getElementById("popupPricePart");
  const synInput = document.getElementById("popupPriceSyn");

  if (titleEl) titleEl.textContent = "Nouvelle prestation";
  if (nameInput) nameInput.value = "";
  if (partInput) partInput.value = "";
  if (synInput) synInput.value = "";

  overlay.classList.remove("hidden");
}

function closePrestationPopup() {
  const overlay = document.getElementById("prestationPopup");
  if (!overlay) return;
  overlay.classList.add("hidden");
}

/**
 * Quand on saisit le prix Particulier dans la popup,
 * on calcule automatiquement le prix Syndic avec le coef 1,25
 * et arrondi au 10 € supérieur.
 */
function onPopupPricePartChange() {
  const partInput = document.getElementById("popupPricePart");
  const synInput = document.getElementById("popupPriceSyn");
  if (!partInput || !synInput) return;

  const coef = 1.25;
  const p = parseFloat(partInput.value) || 0;
  let syn = p * coef;
  syn = Math.ceil(syn / 10) * 10;
  synInput.value = syn ? syn.toFixed(2) : "";
}

/**
 * Validation de la popup : crée un nouveau modèle de prestation.
 * La fenêtre NE se ferme pas tant que tout n'est pas correct.
 */
function confirmPrestationPopup() {
  const overlay = document.getElementById("prestationPopup");
  const nameInput = document.getElementById("popupName");
  const partInput = document.getElementById("popupPricePart");
  const synInput = document.getElementById("popupPriceSyn");

  if (!overlay || !nameInput || !partInput || !synInput) return;

  const label = nameInput.value.trim();
  const pricePart = parseFloat(partInput.value || "0");
  const priceSyn = parseFloat(synInput.value || "0");

  if (!label) {
    showConfirmDialog({
      title: "Nom manquant",
      message: "Merci de saisir un nom de prestation.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  if (!pricePart || pricePart <= 0) {
    showConfirmDialog({
      title: "Prix Particulier manquant",
      message: "Merci de saisir un prix Particulier supérieur à 0.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  let finalSyn = priceSyn;
  if (!finalSyn || finalSyn <= 0) {
    const coef = 1.25;
    let syn = pricePart * coef;
    syn = Math.ceil(syn / 10) * 10;
    finalSyn = syn;
  }

  const kind = "custom_" + Date.now();

  const newTemplate = {
    label: label,
    kind: kind,
    title: label,
    priceParticulier: pricePart,
    priceSyndic: finalSyn,
    descParticulier: "",
    descSyndic: "",
  };
  PRESTATION_TEMPLATES.push(newTemplate);

  const existing = getCustomTemplates();
  existing.push(newTemplate);
  saveCustomTemplates(existing);

  // Ajout de la ligne dans le tableau des tarifs
  const tbody = document.getElementById("tarifsTableBody");
  if (tbody) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td class="tarif-label-cell" onclick="toggleDescEditor('${kind}')">` +
      `<span class="tarif-label-text">${label}</span>` +
      `<span class="tarif-desc-icon" title="Afficher le texte détaillé">📝</span>` +
      `</td>` +
      `<td><input type="number" step="0.01" class="tarif-part" ` +
      `oninput="syncTarifRow(this)" data-kind="${kind}" data-type="particulier" value="${pricePart.toFixed(2)}"></td>` +
      `<td><input type="number" step="0.01" class="tarif-syn" ` +
      `oninput="syncTarifRow(this)" data-kind="${kind}" data-type="syndic" value="${finalSyn.toFixed(2)}"></td>` +
      `<td class="tarif-delete-cell">
   <button
     type="button"
     class="btn btn-danger btn-small date-remove-btn no-print"
     onclick="deleteCustomPrestation('${kind}')"
     title="Supprimer cette prestation"
   >
     ✖
   </button>
 </td>`;

    tbody.appendChild(tr);
  }

  // Ajout dans tous les menus "Modèle"
  const newIndex = PRESTATION_TEMPLATES.length - 1;
  document.querySelectorAll(".prestation-template").forEach((select) => {
    const opt = document.createElement("option");
    opt.value = String(newIndex);
    opt.textContent = label;
    select.appendChild(opt);
  });

  overlay.classList.add("hidden");
}
function toggleDescEditor(kind) {
  const editor = document.getElementById("descEditor");
  if (!editor) return;

  const isVisible = !editor.classList.contains("hidden");

  // Si on clique à nouveau sur la même prestation → on referme
  if (isVisible && currentDescKind === kind) {
    closeDescEditor();
  } else {
    openDescEditor(kind);
  }
}

// ================== ÉDITION DES TEXTES DÉTAILLÉS ==================

function openDescEditor(kind) {
  if (!kind) return;
  const editor = document.getElementById("descEditor");
  const partInput = document.getElementById("descPartInput");
  const synInput = document.getElementById("descSynInput");
  if (!editor || !partInput || !synInput) return;

  currentDescKind = kind;

  const tpl = PRESTATION_TEMPLATES.find((t) => t.kind === kind);
  let descPart = "";
  let descSyn = "";

  if (tpl) {
    descPart = tpl.descParticulier || "";
    descSyn = tpl.descSyndic || "";
  }

  partInput.value = descPart;
  synInput.value = descSyn;

  editor.classList.remove("hidden");
}

function closeDescEditor() {
  const editor = document.getElementById("descEditor");
  if (!editor) return;
  editor.classList.add("hidden");
  currentDescKind = null;
}

function saveDescEditor() {
  if (!currentDescKind) {
    closeDescEditor();
    return;
  }

  const partInput = document.getElementById("descPartInput");
  const synInput = document.getElementById("descSynInput");
  if (!partInput || !synInput) return;

  const partText = partInput.value.trim();
  const synText = synInput.value.trim();

  const tpl = PRESTATION_TEMPLATES.find((t) => t.kind === currentDescKind);
  if (tpl) {
    tpl.descParticulier = partText;
    tpl.descSyndic = synText;
  }

  // on mémorise dans le localStorage séparé
  const map = getCustomTexts();
  map[currentDescKind] = {
    descParticulier: partText,
    descSyndic: synText,
  };
  saveCustomTexts(map);

  showConfirmDialog({
    title: "Texte détaillé mis à jour",
    message: "Ces textes seront utilisés dans les prochains devis et factures.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });

  closeDescEditor();
}

function getClientText(x){
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number") return String(x);

  if (typeof x === "object") {
    // ton format principal: client: { name, address, ... }
    if (typeof x.name === "string") return x.name;
    // fallback possibles
    if (typeof x.clientName === "string") return x.clientName;
    if (typeof x.label === "string") return x.label;
  }

  return "";
}



// ================== SUPPRESSION DES MODÈLES PERSONNALISÉS ==================

function deleteCustomPrestation(kind) {
  if (!kind || kind.indexOf("custom_") !== 0) return;

  showConfirmDialog({
    title: "Supprimer la prestation",
    message: "Voulez-vous vraiment supprimer cette prestation personnalisée ?",
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      // 1) marquer le modèle comme supprimé
      const tpl = PRESTATION_TEMPLATES.find((t) => t.kind === kind);
      if (tpl) {
        tpl._deleted = true;
      }

      // 2) mettre à jour la liste des modèles personnalisés
      let list = getCustomTemplates();
      list = list.filter((item) => item.kind !== kind);
      saveCustomTemplates(list);

      // 3) retirer la ligne du tableau des tarifs
      const tbody = document.getElementById("tarifsTableBody");
      if (tbody) {
        const rows = Array.from(tbody.querySelectorAll("tr"));
        rows.forEach((tr) => {
          const partInput = tr.querySelector(".tarif-part");
          if (partInput && partInput.dataset.kind === kind) {
            tr.remove();
          }
        });
      }

      // 4) retirer l'option des menus "Modèle"
      document.querySelectorAll(".prestation-template").forEach((select) => {
        const opts = Array.from(select.options);
        opts.forEach((opt) => {
          const idx = parseInt(opt.value, 10);
          if (isNaN(idx)) return;
          const t = PRESTATION_TEMPLATES[idx];
          if (t && t.kind === kind) {
            opt.remove();
          }
        });
      });
    },
  });
}

// ================== MODAL DE CONFIRMATION ==================

function showConfirmDialog({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  variant = "info", // "default" | "info" | "warning" | "danger" | "success"
  icon, // ex: "⚠️", "ℹ️", "✅", "🧾"
  showCloseButton = false,
}) {
  const overlay = document.getElementById("confirmOverlay");
  const box = overlay ? overlay.querySelector(".confirm-box") : null;
  const titleEl = document.getElementById("confirmTitle");
  const msgEl = document.getElementById("confirmMessage");
  const btnOk = document.getElementById("confirmOk");
  const btnCancel = document.getElementById("confirmCancel");
  const iconEl = document.getElementById("confirmIcon");

  // Fallback : si jamais le HTML n'est pas là -> confirm() natif
  if (!overlay || !box || !titleEl || !msgEl || !btnOk || !btnCancel) {
    if (window.confirm(message || "")) {
      if (typeof onConfirm === "function") onConfirm();
    }
    return;
  }

  // ✅ Nettoyage bouton Fermer custom (évite doublons / persistance)
  document.getElementById("confirmClose")?.remove();

  // Normalisation du variant ("warning" → "danger", "default" → "info")
  let v = variant || "info";
  if (v === "warning") v = "danger";
  if (v === "default") v = "info";

  // ✅ Règles UI globales
  // - jamais de bouton Fermer sur success
  if (v === "success") showCloseButton = false;

  // - sur success : OK seul par défaut
  if (v === "success" && (cancelLabel === "Annuler" || cancelLabel == null)) {
    cancelLabel = "";
  }

  // Texte titre + message
  titleEl.textContent = title || "";
  msgEl.textContent = message || "";

  // Reset classes de variante
  box.classList.remove("danger", "success", "info");
  if (iconEl) iconEl.classList.remove("danger", "success", "info");

  // Appliquer la variante + icône par défaut si non fournie
  if (v === "danger") {
    box.classList.add("danger");
    if (iconEl) iconEl.classList.add("danger");
    if (!icon) icon = "⚠️";
  } else if (v === "success") {
    box.classList.add("success");
    if (iconEl) iconEl.classList.add("success");
    if (!icon) icon = "✅";
  } else {
    box.classList.add("info");
    if (iconEl) iconEl.classList.add("info");
    if (!icon) icon = "ℹ️";
  }

  // Icône
  if (iconEl) {
    if (icon) {
      iconEl.textContent = icon;
      iconEl.style.display = "flex";
    } else {
      iconEl.style.display = "none";
    }
  }

  // Libellés des boutons
  btnOk.textContent = confirmLabel || "OK";

  if (cancelLabel === "" || cancelLabel == null) {
    btnCancel.style.display = "none";
  } else {
    btnCancel.style.display = "inline-block";
    btnCancel.textContent = cancelLabel;
  }

  // 🎨 Couleurs globales (FIABLE, même sans CSS)
  btnOk.style.background = "#1a74d9";
  btnOk.style.borderColor = "#1a74d9";
  btnOk.style.color = "#fff";

  btnCancel.style.background = "#e5533d";
  btnCancel.style.borderColor = "#e5533d";
  btnCancel.style.color = "#fff";

  // Nettoyage des anciens handlers
  btnOk.onclick = null;
  btnCancel.onclick = null;

  // Cancel = fermer + callback
  btnCancel.onclick = function () {
    overlay.classList.add("hidden");
    if (typeof onCancel === "function") onCancel();
  };

  // OK = fermer + callback
  btnOk.onclick = function () {
    overlay.classList.add("hidden");
    if (typeof onConfirm === "function") onConfirm();
  };

  // ➕ Bouton Fermer optionnel (uniquement si demandé, et jamais en success)
  if (showCloseButton) {
    const row = overlay.querySelector(".confirm-buttons");
    if (row) {
      const closeBtn = document.createElement("button");
      closeBtn.id = "confirmClose";
      closeBtn.type = "button";
      closeBtn.className = "btn";
      closeBtn.textContent = "✖ Fermer";
      closeBtn.style.background = "#e5533d";
      closeBtn.style.borderColor = "#e5533d";
      closeBtn.style.color = "#fff";
      closeBtn.onclick = () => overlay.classList.add("hidden");
      row.appendChild(closeBtn);
    }
  }

  // Afficher la popup
  overlay.classList.remove("hidden");
}

const signatureClientTitle = "Bon pour accord";
const signatureClientText = "Bon pour accord, lu et approuvé.";

// =========================================================
// PLAN DE FACTURATION (affichage PRO dans Contrat + Devis)
// =========================================================

function buildBillingPlanLine(pr) {
  if (!pr) return "";

  const mode = (pr.billingMode || "").trim();
  if (!mode) return "";

  const clientType = pr.clientType || "particulier";
  const isSyndic = clientType === "syndic";

  // ---- Helpers dates
  const toFR = (iso) => (typeof fromISO === "function" ? fromISO(iso) : iso);
  const startISO = pr.startDate || "";
  const nextISO = pr.nextInvoiceDate || "";

  // ---- Libellés PRO
  const wording = {
    mensuel: "Facturation mensuelle",
    trimestriel: "Facturation trimestrielle",
    semestriel: "Facturation semestrielle",
    annuel: "Facturation annuelle",
    annuel_50_50: "Facturation annuelle en deux échéances",
  };

  const echeanceWord = {
    mensuel: "mensuelle",
    trimestriel: "trimestrielle",
    semestriel: "semestrielle",
    annuel: "annuelle",
  };

  // =========================================================
  // ✅ SYNDIC = POST-PAYÉ (terme échu)
  // 1ère facture = nextInvoiceDate (ou calcul affichage si vide)
  // =========================================================
  if (isSyndic) {
    let firstISO = nextISO;

    // fallback calcul affichage si nextInvoiceDate vide
    if (!firstISO && startISO) {
      const start = new Date(startISO + "T00:00:00");
      let step = 0;
      if (mode === "mensuel") step = 1;
      else if (mode === "trimestriel") step = 3;
      else if (mode === "semestriel") step = 6;
      else if (mode === "annuel") step = 12;

      if (step) {
        start.setMonth(start.getMonth() + step);
        firstISO = start.toISOString().slice(0, 10);
      }
    }

    const firstFR = firstISO ? toFR(firstISO) : "—";
    const label = wording[mode] || "Facturation";
    const ech = echeanceWord[mode] || "";

    // sécurité : syndic ne devrait pas être en 50/50
    if (mode === "annuel_50_50") {
      return `${label} : 1er paiement le ${firstFR}, puis 2e paiement à mi-contrat.`;
    }

    return ech
      ? `${label} : facture émise le ${firstFR}, puis à échéance ${ech}.`
      : `${label} : facture émise le ${firstFR}.`;
  }

  // =========================================================
  // ✅ PARTICULIER = ANTICIPÉ (payable d’avance)
  // Date affichée = startDate (sinon nextInvoiceDate)
  // =========================================================
  const refISO = startISO || nextISO || "";
  const refFR = refISO ? toFR(refISO) : "—";

  if (mode === "annuel_50_50") {
    return "Facturation annuelle en deux échéances : 50 % à la souscription, puis 50 % à mi-contrat.";
  }

  const label = wording[mode] || "Facturation";
  return `${label} : payable d’avance, à compter du ${refFR}.`;
}

// ================== IMPRESSION / PDF ==================

function openPrintable(id, previewOnly) {
  const targetId = id || currentDocumentId;
  if (!targetId) {
    showConfirmDialog({
      title: "Enregistrement requis",
      message:
        "Veuillez d'abord enregistrer le devis ou la facture avant d'imprimer ou d'afficher l'aperçu.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️",
    });
    return;
  }

  const doc = getDocument(targetId);
  if (!doc) return;

  // ✅ Facture initiale d'un contrat : on ne veut PAS afficher les dates de passage
  const isFirstContractInvoice =
    doc.type === "facture" &&
    !!doc.contractId &&
    Array.isArray(doc.prestations) &&
    doc.prestations.some((p) => p && p.kind === "contrat_echeance_initiale");


  const hasPiscine = doc.prestations.some((p) =>
    [
      "piscine_chlore",
      "piscine_sel",
      "hivernage_piscine",
      "remise_service_piscine",
      "traitement_choc",
      "changement_sable",
      "remplacement_roulement",
      "remplacement_pompe_mo",
      "remplacement_cellule_mo",
      "depannage_piscine",
    ].includes(p.kind),
  );

  const hasClim = doc.prestations.some((p) =>
    ["entretien_clim", "depannage_clim"].includes(p.kind),
  );

  const hasProduitsOuFournitures = doc.prestations.some(
    (p) => p.kind === "produits" || p.kind === "fournitures",
  );

  const isDevis = doc.type === "devis";
  const isPaidInvoice = !isDevis && doc.paid;
  const isUnpaidInvoice = !isDevis && !doc.paid;

  const titleColor = isDevis ? "#1a74d9" : doc.paid ? "#1b5e20" : "#1a74d9";

  const formatEuroFR = (value) =>
    (Number(value) || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";

  // Lignes prestations
  let prestationsHTML = "";
  doc.prestations.forEach((p) => {
    let extraHtml = "";
        if (!isFirstContractInvoice && p.dates && p.dates.length) {

      extraHtml += `<div class="sub-info">`;
      extraHtml += `<div class="sub-info-line"><span class="dates-label">Dates de passage :</span></div>`;
      p.dates.forEach((dv) => {
        extraHtml += `<div class="sub-info-line">${dv}</div>`;
      });
      extraHtml += `</div>`;
    }

    const detailHtml = p.detail
      ? `<div class="desc-detail">${p.detail}</div>`
      : "";

    const qtyText = p.qty;
    let unitText = p.unit || "";
    if (!unitText) {
      if (
        p.kind === "depannage_clim" ||
        p.kind === "depannage_piscine" ||
        p.kind === "depannage_jacuzzi"
      ) {
        unitText = "heure";
      } else if (p.kind === "produits" || p.kind === "fournitures") {
        unitText = "unité";
      } else {
        unitText = "forfait";
      }
    }

    const priceText = formatEuroFR(p.price);
    const totalText = formatEuroFR(p.total);

    prestationsHTML += `
      <tr>
        <td>
          <div class="desc-main">${p.desc}</div>
          ${detailHtml}
          ${extraHtml}
        </td>
        <td class="qty-col">${qtyText}</td>
        <td class="unit-col">${unitText}</td>
        <td class="price-col text-right">${priceText}</td>
        <td class="total-col text-right"><strong>${totalText}</strong></td>
      </tr>
    `;
  });

  // Informations importantes devis
  let importantHtml = "";
  if (isDevis) {
    const items = [];

items.push(
  "Le présent devis vaut ordre d’intervention dès acceptation écrite (signature, mention « Bon pour accord », email ou message).",
);


    if (hasPiscine && !hasProduitsOuFournitures) {
      items.push(
        "Les produits de traitement piscine (chlore choc, sel, produits d’équilibrage, etc.) ne sont pas inclus, sauf mention contraire sur le devis, et seront facturés en supplément le cas échéant.",
      );
    }

    if (hasPiscine && hasClim) {
items.push(
  "Les tarifs des pièces détachées (piscine et climatisation) peuvent évoluer selon les prix fournisseurs. Toute modification sera justifiée et fera l’objet d’un accord préalable écrit (email/SMS) avant commande et/ou installation.",
);

    } else if (hasPiscine) {
items.push(
  "Les tarifs des pièces détachées piscine peuvent évoluer selon les prix fournisseurs. Toute modification sera justifiée et fera l’objet d’un accord préalable écrit (email/SMS) avant commande et/ou installation.",
);

    } else if (hasClim) {
items.push(
  "Les tarifs des pièces détachées climatisation peuvent évoluer selon les prix fournisseurs. Toute modification sera justifiée et fera l’objet d’un accord préalable écrit (email/SMS) avant commande et/ou installation.",
);

    }

    items.push(
      "Les prix indiqués comprennent la main-d’œuvre et, le cas échéant, les frais de déplacement mentionnés au devis.",
    );

if (hasPiscine) {
  items.push(
    "Le client garantit l’accès libre et sécurisé au bassin et au local technique. En cas d’accès impossible, le déplacement reste dû.",
  );
}


    items.push(
      "Toute prestation non mentionnée dans le présent devis fera l’objet d’un devis complémentaire ou d’un avenant écrit avant réalisation.",
    );

    items.push(
      "L’entreprise est titulaire d’une assurance responsabilité civile professionnelle.",
    );
items.push(
  "Le présent devis est valable jusqu’à la date de validité indiquée. Passé ce délai, les prix sont susceptibles d’être révisés."
);

    importantHtml = `
      <div class="important-block">
        <div class="important-title">Informations importantes</div>
        <ul>
          ${items.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  const tvaRate = doc.tvaRate || 0;
  const discountAmountDoc = doc.discountAmount || 0;
  const discountRateDoc = doc.discountRate || 0;

  let tvaNoteHtml = "";
  if (tvaRate === 0) {
    tvaNoteHtml =
      '<div class="tva-note">TVA non applicable, article 293 B du CGI.</div>';
  }

  let totalLabel = "";
  if (isDevis) {
    totalLabel = "Montant total :";
  } else if (tvaRate === 0) {
    totalLabel = doc.paid ? "NET PAYÉ :" : "NET À PAYER :";
  } else {
    totalLabel = doc.paid ? "TOTAL PAYÉ TTC :" : "TOTAL TTC :";
  }

  const subtotalText = formatEuroFR(doc.subtotal || 0);
  const discountAmountText = formatEuroFR(discountAmountDoc || 0);
  const tvaAmountText = formatEuroFR(doc.tvaAmount || 0);
  const totalTTCText = formatEuroFR(doc.totalTTC || 0);

  let totalsRows = `
    <tr>
      <td>Sous-total HT :</td>
      <td class="text-right">${subtotalText}</td>
    </tr>
  `;

  if (discountAmountDoc > 0 && discountRateDoc > 0) {
    const rateLabel = discountRateDoc.toFixed(2).replace(/\.00$/, "");
    totalsRows += `
      <tr>
        <td>Réduction (${rateLabel} %) :</td>
        <td class="text-right">- ${discountAmountText}</td>
      </tr>
    `;
  }

  if (tvaRate > 0) {
    totalsRows += `
      <tr>
        <td>TVA (${tvaRate} %) :</td>
        <td class="text-right">${tvaAmountText}</td>
      </tr>
    `;
  }

  totalsRows += `
    <tr class="grand-total">
      <td>${totalLabel}</td>
      <td class="text-right">${totalTTCText}</td>
    </tr>
  `;

  const dateStr = doc.date
    ? new Date(doc.date).toLocaleDateString("fr-FR")
    : "";
  const logoSrc =
    "https://raw.githubusercontent.com/Tzaneesh/Aquaclim-Prestige/main/logo.png";
  const signSrc =
    "https://raw.githubusercontent.com/Tzaneesh/Aquaclim-Prestige/main/signature.png";
  const stampSrc =
    "https://raw.githubusercontent.com/Tzaneesh/Aquaclim-Prestige/main/tampon.png";
  const paidStampSrc =
    "https://raw.githubusercontent.com/Tzaneesh/Aquaclim-Prestige/main/facture_payée.png";

  let reglementHtml = "";
  if (!isDevis && doc.paid && doc.paymentMode) {
    const payDate = doc.paymentDate || doc.date;
    const payDateStr = payDate
      ? new Date(payDate).toLocaleDateString("fr-FR")
      : dateStr;
    let modePhrase = "";
    if (doc.paymentMode === "especes") modePhrase = "en espèces";
    else if (doc.paymentMode === "cb") modePhrase = "par carte bancaire";
    else if (doc.paymentMode === "virement") modePhrase = "par virement";
    else if (doc.paymentMode === "cheque") modePhrase = "par chèque";

   reglementHtml = `
  <div class="reglement-block">
    <div class="reg-title">Règlement</div>
    <p>Facture réglée ${modePhrase} le ${payDateStr}.</p>
  </div>

  <div class="paid-stamp-big-wrapper">
    <img src="${paidStampSrc}" alt="Facture payée" class="paid-stamp-big">
  </div>
`;

  }

  let ribHtml = "";
  if (!isDevis && !doc.paid) {
    ribHtml = `
      <div class="rib-block">
        <div class="rib-title">Coordonnées bancaires pour virement</div>
        <p>Titulaire : ${getCompanySettings().ribHolder}</p>
        <p>Banque : ${getCompanySettings().bankName}</p>
        <p>IBAN : ${getCompanySettings().iban}</p>
        <p>BIC : ${getCompanySettings().bic}</p>
      </div>
    `;
  }

const isSyndic =
  doc.conditionsType === "agence" ||
  doc.clientType === "syndic" ||
  doc.client?.type === "syndic";

const TERMS_PARTICULIER =
  "Règlement à réception de facture.\n" +
  "Aucun acompte demandé sauf mention contraire.\n" +
  "Aucun escompte pour paiement anticipé.";

const TERMS_SYNDIC =
  "Paiement à 30 jours fin de mois.\n" +
  "Aucun acompte demandé sauf mention contraire.\n" +
  "Aucun escompte pour paiement anticipé.\n" +
  "En cas de retard de paiement : pénalités de retard calculées sur la base de trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire pour frais de recouvrement de 40 € (articles L441-10 et D441-5 du Code de commerce).";


  let notesHtml = "";
  if (isDevis) {
    let billingLine = "";

    try {
      // 1) Si le devis contient déjà les infos
      if (doc.billingMode) {
        billingLine =
          typeof buildBillingPlanLine === "function"
            ? buildBillingPlanLine({
                billingMode: doc.billingMode || "",
                nextInvoiceDate: doc.nextInvoiceDate || "",
                startDate: doc.contractStartDate || "",
                clientType:
                  doc.conditionsType === "agence" ? "syndic" : "particulier",
              })
            : "";
      }

      // 2) Sinon, si le devis est lié à un contrat, on récupère la pricing du contrat
      if (!billingLine && doc.contractId && typeof getContract === "function") {
        const ct = getContract(doc.contractId);
        if (ct && ct.pricing && typeof buildBillingPlanLine === "function") {
          billingLine = buildBillingPlanLine(ct.pricing);
        }
      }
    } catch (e) {
      console.error("Erreur billingLine:", e);
      billingLine = "";
    }

    // ✅ Conditions devis = mêmes règles que factures (cohérence totale)
    const isSyndic = doc.conditionsType === "agence"; // chez toi "agence" = syndic/pro

    const TERMS_PARTICULIER =
      "Règlement à réception de facture.\n" +
      "Aucun acompte demandé sauf mention contraire.\n" +
      "Aucun escompte pour paiement anticipé.";

    const TERMS_SYNDIC =
      "Paiement à 30 jours fin de mois.\n" +
      "Aucun acompte demandé sauf mention contraire.\n" +
      "Aucun escompte pour paiement anticipé.\n" +
      "En cas de retard de paiement : pénalités de retard calculées sur la base de trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire pour frais de recouvrement de 40 € (articles L441-10 et D441-5 du Code de commerce).";


    const devisConditions =
      (billingLine ? "Mode de facturation : " + billingLine + "\n\n" : "") +
      (isSyndic ? TERMS_SYNDIC : TERMS_PARTICULIER);

    notesHtml = `
  <div class="conditions-block">
    <div class="conditions-title">Conditions de règlement</div>
    <p>${devisConditions.replace(/\n/g, "<br>")}</p>
  </div>
`;
  } else {
    let notesText = doc.notes || "";
// ✅ Si aucune note enregistrée, on met les conditions par défaut
if (!notesText || !String(notesText).trim()) {
  notesText = isSyndic ? TERMS_SYNDIC : TERMS_PARTICULIER;
}

    if (doc.paid && notesText) {
      const removeLines = [
        "Paiement à 30 jours date de facture.",
        "Paiement à 30 jours fin de mois.",
        "Règlement à réception de facture.",
        "Aucun acompte demandé sauf mention contraire.",
        "Aucun escompte pour paiement anticipé.",
        "En cas de retard de paiement : pénalités au taux légal en vigueur et indemnité forfaitaire de 40 € pour frais de recouvrement (article L441-10 du Code de commerce).",
        "Pénalités de retard : taux légal en vigueur et indemnité forfaitaire de 40 € pour frais de recouvrement (article L441-10 du Code de commerce).",
        "En cas de retard de paiement : pénalités de retard calculées sur la base de trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire pour frais de recouvrement de 40 € (articles L441-10 et D441-5 du Code de commerce).",

      ];

      removeLines.forEach((line) => {
        notesText = notesText.replace(line + "\n", "");
        notesText = notesText.replace(line, "");
      });
      notesText = notesText.trim();
    }

    // ❌ Si facture payée → on supprime totalement le bloc conditions
    if (!isDevis && doc.paid) {
      notesHtml = "";
      notesText = "";
    }

    notesHtml = notesText
      ? `
      <div class="conditions-block">
        <div class="conditions-title">Conditions de règlement</div>
        <p>${notesText.replace(/\n/g, "<br>")}</p>
      </div>
    `
      : "";
  }

  const validityStr =
    isDevis && doc.validityDate
      ? new Date(doc.validityDate).toLocaleDateString("fr-FR")
      : "";

  const topDatesHtml = `
    <div class="doc-info-block">
      <div class="doc-info-row">
        <span class="doc-info-label">Date d’émission :</span>
        <span class="doc-info-value">${dateStr}</span>
      </div>
      ${
        validityStr
          ? `
      <div class="doc-info-row">
        <span class="doc-info-label">Validité :</span>
        <span class="doc-info-value">${validityStr}</span>
      </div>`
          : ""
      }
      <div class="doc-info-row">
        <span class="doc-info-label">Lieu d’émission :</span>
        <span class="doc-info-value">Nice</span>
      </div>
    </div>
  `;

  // ✅ Sécurité : si ces variables n'existent pas, on met des valeurs par défaut
  const signatureClientTitle =
    (typeof window.signatureClientTitle !== "undefined" &&
      window.signatureClientTitle) ||
    "Bon pour accord";

  const signatureClientText =
    (typeof window.signatureClientText !== "undefined" &&
      window.signatureClientText) ||
    "Bon pour accord, lu et approuvé.";

  // Date à afficher sous la signature client
  const signatureDisplayDate = doc.signatureDate
    ? doc.signatureDate
    : new Date().toLocaleDateString("fr-FR");

  // Bloc signatures (différent si devis signé ou non)
  let signatureClientHTML = "";

  if (isDevis && doc.signature) {
    // ✅ Devis signé : on affiche tout ce que tu veux en bas à gauche
    signatureClientHTML = `
    ${notesHtml}
    ${importantHtml}
    <div class="signatures">
      <div class="signature-block">
        <div class="signature-title">Bon pour accord</div>
        <p>Bon pour accord, lu et approuvé.</p>
        <p>Date : ${signatureDisplayDate}</p>
        <p>Signature du client :</p>
    <img src="${doc.signature}" class="sig sig-client" alt="Signature du client">

      </div>
           <div class="signature-block">
        <div class="signature-title">AquaClim Prestige</div>
        <p>Signature et tampon de l’entreprise</p>
        <img src="${signSrc}" class="sig" alt="Signature AquaClim Prestige">
        <img src="${stampSrc}" class="sig" alt="Tampon AquaClim Prestige">
      </div>

    </div>
  `;
  } else if (isDevis) {
    // 📝 Devis non signé : texte classique, sans image
    signatureClientHTML = `
    ${notesHtml}
    ${importantHtml}
    <div class="signatures">
      <div class="signature-block">
        <div class="signature-title">${signatureClientTitle}</div>
        <p>${signatureClientText}</p>
        <p style="margin-top:6px; margin-bottom:16px;">Date :</p>
        <p>Signature du client :</p>
      </div>
      <div class="signature-block">
        <div class="signature-title">AquaClim Prestige</div>
        <p>Signature et tampon de l’entreprise</p>
        <img src="${signSrc}" class="sig" alt="Signature AquaClim Prestige">
        <img src="${stampSrc}" class="sig" alt="Tampon AquaClim Prestige">
      </div>

    </div>
  `;
  }

 const printWindow = window.open("", "_blank");

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${isDevis ? "Devis " : "Facture "}${doc.number}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}

    html, body{
      margin:0;
      padding:0;
      background:#fff;
      color:#333;
      font-family: Arial, sans-serif;
      font-size:10.5px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ===== STRUCTURE PAGE (stable iOS) ===== */
    .page{ display:block; }
    .page-main{ display:block; }
    .page-footer{ display:block; margin-top: 8mm; }

    /* ===== HEADER ===== */
    .header{
      text-align:center;
      margin-bottom:6px;
      border-bottom:1.5px solid #1a74d9;
      padding-bottom:7px;
    }
    img.logo{ height:55px; margin-bottom:4px; }

    .header h1{
      color:#1a74d9;
      font-size:21px;
      margin-bottom:3px;
      font-weight:700;
    }
    .header p{
      color:#444;
      font-size:10.5px;
      line-height:1.25;
    }
    .subtitle{ font-weight:600; font-size:11px; }
    .contact{ font-size:10.5px; font-weight:500; }
    .contact strong{ font-weight:700; }

    /* ===== TITRE DEVIS / FACTURE ===== */
    .doc-header-center{ margin:8px 0 12px 0; }
    .doc-title-main{
      display:block;
      font-size:11px;
      text-transform:uppercase;
      letter-spacing:0.18em;
      font-weight:600;
      opacity:0.9;
    }
    .doc-title-number{
      display:block;
      margin-top:2px;
      font-size:21px;
      font-weight:800;
      letter-spacing:0.04em;
      color:inherit;
    }
    .doc-subject{
      margin-top:8px;
      font-size:12.5px;
      font-weight:700;
    }

    /* ===== INFOS DATES ===== */
    .doc-info-block{
      display:inline-block;
      border:1px solid #cbd3e1;
      border-radius:6px;
      padding:6px 8px;
      font-size:10px;
      background:#f6f8fc;
      margin-top:4px;
    }
    .doc-info-row{ display:flex; gap:4px; margin:1px 0; }
    .doc-info-label{ min-width:95px; font-weight:bold; }
    .doc-info-value{ flex:1; }

    /* ===== BLOC CLIENT / SITE ===== */
    .client-block{
      margin-bottom:8px;
      font-size:10px;
      border:1px solid #dde4ee;
      border-radius:8px;
      padding:8px 10px;
      background:#f5f7fb;
    }
    .client-title{
      font-weight:700;
      font-size:10.5px;
      margin-bottom:4px;
      color:#1a74d9;
    }
    .client-line{ margin:2px 0; }
    .client-inner-row{ display:flex; gap:18px; }
    .client-col{ flex:1 1 auto; }
    .client-col.right{ flex:0 0 auto; margin-left:auto; }

    /* ===== TABLE PRESTATIONS ===== */
    table{
      width:100%;
      border-collapse:collapse;
      margin:10px 0;
    }
    thead th{
      background:#1a74d9;
      color:#fff;
      padding:6px 6px;
      text-align:left;
      font-weight:600;
      font-size:11px;
      border-bottom:2px solid #cbd3e1;
    }
    tbody td{
      padding:4px 6px;
      border-bottom:1px solid #dde4ee;
      font-size:10px;
      vertical-align:top;
    }
    tbody tr:nth-child(odd){ background:#f9fbff; }
    tbody tr:nth-child(even){ background:#ffffff; }

    th:first-child, td:first-child{ width:55%; }

    .text-right{ text-align:right; }
    .qty-col, .unit-col{ text-align:center; white-space:nowrap; }
    .price-col, .total-col{ white-space:nowrap; text-align:right; }

    .desc-main{ font-size:11px; font-weight:600; margin-bottom:2px; }
    .desc-detail{ font-size:10px; color:#555; margin-top:2px; }
    .sub-info{ margin-top:3px; font-size:9.5px; color:#555; }
    .sub-info-line{ margin-top:1px; }

    /* ===== TOTAUX ===== */
    .totals{
      margin-left:auto;
      width:230px;
      margin-top:6px;
      border:1px solid #cbd3e1;
      border-radius:8px;
      padding:8px 10px;
      background:#f3f6fc;
    }
    .totals table{ width:100%; border-collapse:collapse; margin:0; }
    .totals td{ padding:3px 0; font-size:10px; }
    .totals .grand-total td{
      padding-top:6px;
      border-top:1px solid #cbd3e1;
      font-weight:800;
      font-size:11px;
      background:#e3edff;
      color:#0d3b66;
    }
    .tva-note{
      margin-top:4px;
      font-size:9px;
      font-style:italic;
      color:#555;
    }

    /* ===== BLOCS ANNEXES ===== */
    .reglement-block{
      margin-top:6px;
      font-size:10px;
      border:1px solid #1b5e20;
      padding:8px;
      border-radius:6px;
      background:#e8f5e9;
    }
    .reg-title{
      font-weight:bold;
      margin-bottom:3px;
      color:#1b5e20;
      font-size:10px;
    }

    .paid-stamp-big-wrapper{
      text-align:center;
      margin-top:20px;
      margin-bottom:30px;
      page-break-inside:avoid;
      break-inside:avoid;
    }
    .paid-stamp-big{
      height:240px;
      width:auto;
      opacity:0.95;
    }

    .rib-block{
      margin-top:6px;
      font-size:10px;
      border:1px solid #cbd3e1;
      padding:8px;
      border-radius:6px;
      background:#ffffff;
      page-break-inside:avoid;
      break-inside:avoid;
    }
    .rib-title{ font-weight:bold; margin-bottom:3px; font-size:10px; }

    .important-block{
      margin-top:8px;
      font-size:10px;
      border:1px solid #1a74d9;
      padding:8px;
      border-radius:6px;
      background:#f3f7ff;
    }
    .important-title{
      font-weight:bold;
      margin-bottom:4px;
      font-size:10px;
      color:#1a74d9;
    }
    .important-block ul{ margin-left:14px; }
    .important-block li{ margin-bottom:3px; }

    .conditions-block{
      margin-top:6px;
      font-size:10px;
      border:1px solid #cbd3e1;
      border-radius:6px;
      padding:8px;
      background:#ffffff;
    }
    .conditions-title{ font-weight:bold; margin-bottom:3px; font-size:10px; }

    /* ===== SIGNATURES ===== */
    .signatures{
      margin-top:10px;
      display:flex;
      justify-content:space-between;
      gap:22px;
      page-break-inside:avoid;
      break-inside:avoid;
    }
    .signature-block{
      flex:1;
      border-top:1px solid #333;
      padding-top:4px;
      font-size:10px;
      min-height:55px;
      page-break-inside:avoid;
      break-inside:avoid;
    }
    .signature-title{ font-weight:bold; margin-bottom:3px; }

    img.sig{ height:100px; width:auto; margin-top:3px; }
    img.sig-client{ height:100px; width:auto; margin-top:12px; }

    /* Optionnel: atténue le “carré” si le tampon n’est pas transparent (pas magique) */
    img.sig, img.sig-client{
      background: transparent;
      mix-blend-mode: multiply;
    }

    /* ===== PRINT (iOS SAFE) ===== */
    @media print{
      /* marges ici = plus stable iOS */
      @page{ size:A4; margin:10mm 12mm 14mm 12mm; }

      /* SHRINK léger = évite souvent la 2e page sur iPhone */
      body{ zoom:0.90; }

      /* pas de padding en print (marges gérées par @page) */
      .page{ padding:0 !important; }

      /* IMPORTANT: le footer ne doit PAS être “avoid” sinon iOS pousse page 2 */
      .page-footer,
      .bottom-block{
        page-break-inside:auto !important;
        break-inside:auto !important;
      }

      /* on garde avoid seulement sur les signatures / rib / gros tampon payé */
      .rib-block,
      .signatures,
      .signature-block,
      .paid-stamp-big-wrapper{
        page-break-inside:avoid !important;
        break-inside:avoid !important;
      }
    }
  </style>
</head>

<body>
  <div class="page">
    <div class="page-main">
      <div class="header">
        <img src="${logoSrc}" class="logo" alt="AquaClim Prestige">
        <h1>${getCompanySettings().companyName}</h1>
        <p class="subtitle">${getCompanySettings().subtitle}</p>
        <p class="contact">
          ${getCompanySettings().legalName} – ${getCompanySettings().address}<br>
          Tél : ${getCompanySettings().phone} – Email : ${getCompanySettings().email}<br>
          SIRET : <strong>${getCompanySettings().siret}</strong><br>
          ${
            (!isDevis && Number(doc.tvaRate || 0) > 0 && getCompanySettings().vatNumber)
              ? `N° TVA : <strong>${getCompanySettings().vatNumber}</strong><br>`
              : ""
          }
        </p>
      </div>

      <div class="doc-header-center">
        <h2 style="color:${titleColor};">
          <span class="doc-title-main">${isDevis ? "DEVIS" : "FACTURE"}</span>
          <span class="doc-title-number">N° ${doc.number}</span>
        </h2>

        ${topDatesHtml}
        ${doc.subject ? `<div class="doc-subject">Objet : ${doc.subject}</div>` : ``}
      </div>

      <div class="client-block">
        <div class="client-inner-row">
          <div class="client-col">
            <div class="client-title">Client</div>
            ${
              doc.client?.name || doc.client?.civility
                ? `<p class="client-line">${[doc.client?.civility, doc.client?.name].filter(Boolean).join(" ")}</p>`
                : ""
            }
            ${doc.client?.address ? `<p class="client-line">${doc.client.address}</p>` : ""}
            ${doc.client?.phone ? `<p class="client-line">${doc.client.phone}</p>` : ""}
            ${doc.client?.email ? `<p class="client-line">${doc.client.email}</p>` : ""}
          </div>

          ${
            doc.siteName || doc.siteAddress
              ? `
          <div class="client-col right">
            <div class="client-title">Lieu d’intervention</div>
            ${
              doc.siteCivility || doc.siteName
                ? `<p class="client-line">${[doc.siteCivility, doc.siteName].filter(Boolean).join(" ")}</p>`
                : ""
            }
            ${doc.siteAddress ? `<p class="client-line">Adresse : ${doc.siteAddress}</p>` : ""}
          </div>`
              : ""
          }
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="qty-col">Quantité</th>
            <th class="unit-col">Unité</th>
            <th class="price-col text-right">Prix HT</th>
            <th class="total-col text-right">Total HT</th>
          </tr>
        </thead>
        <tbody>
          ${prestationsHTML}
        </tbody>
      </table>

      <div class="totals">
        <table>
          ${totalsRows}
        </table>
        ${tvaNoteHtml}
      </div>

      ${isPaidInvoice ? reglementHtml : ""}
      ${isPaidInvoice ? notesHtml : ""}
    </div>

    <div class="page-footer">
      ${
        isDevis
          ? signatureClientHTML
          : isUnpaidInvoice
            ? `
              ${ribHtml}
              ${notesHtml}
            `
            : ``
      }
    </div>
  </div>
</body>
</html>`;

printWindow.document.open();
printWindow.document.write(html);
printWindow.document.close();

/* Optionnel: titre vide (n’enlève pas "about:blank" mais évite un titre long) */
try { printWindow.document.title = ""; } catch(e){}

printWindow.onload = function () {
  printWindow.focus();
  if (!previewOnly) {
    printWindow.print();
  }
};

  }

// ================== CONTRATS PISCINE / SPA ==================

// --- Statuts de contrat ---
const CONTRACT_STATUS = {
  EN_COURS: "en_cours",
  A_RENOUVELER: "a_renouveler",
  TERMINE: "termine",
  RESILIE: "resilie",
};

// Fonction d'échappement HTML

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
// Calcul du statut en fonction de la date de fin

function computeContractStatus(contract) {
  // ✅ Statuts forcés (prioritaires sur les dates)
  if (contract?.meta?.forceStatus === "termine_renouvele") {
    return CONTRACT_STATUS.TERMINE;
  }
  if (contract?.meta?.forceStatus === "termine_sans_renouvellement") {
    return CONTRACT_STATUS.TERMINE;
  }

  if (!contract || !contract.pricing) return CONTRACT_STATUS.EN_COURS;

  // Si déjà résilié, on ne touche pas
  if (contract.status === CONTRACT_STATUS.RESILIE) {
    return CONTRACT_STATUS.RESILIE;
  }

  const pr = contract.pricing;
  let endDateObj = null;

  // 1) priorité : startDate + durationMonths
  if (pr.startDate && pr.durationMonths) {
    const start = new Date(pr.startDate + "T00:00:00");
    if (!isNaN(start.getTime())) {
      const end = new Date(start);
      end.setMonth(end.getMonth() + pr.durationMonths);
      end.setDate(end.getDate() - 1);
      endDateObj = end;
    }
  }

  // 2) fallback : pr.endDateLabel (jj/mm/aaaa)
  if (!endDateObj && pr.endDateLabel) {
    const iso = parseFrenchDate(pr.endDateLabel); // ta fonction existe déjà
    if (iso) {
      const d = new Date(iso + "T00:00:00");
      if (!isNaN(d.getTime())) endDateObj = d;
    }
  }

  if (!endDateObj) return CONTRACT_STATUS.EN_COURS;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((endDateObj - today) / 86400000);

  if (diffDays < 0) return CONTRACT_STATUS.TERMINE;
  if (diffDays <= 30) return CONTRACT_STATUS.A_RENOUVELER;
  return CONTRACT_STATUS.EN_COURS;
}

// Normalisation avant sauvegarde
function normalizeContractBeforeSave(contract) {
  if (!contract.meta) contract.meta = {};

  const forced = contract.meta.forceStatus;

  // ✅ 0) ForceStatus = priorité absolue
  if (
    forced === "termine_renouvele" ||
    forced === "termine_sans_renouvellement"
  ) {
    contract.status = CONTRACT_STATUS.TERMINE;

    // ✅ 1) Résilié = on n'écrase jamais
  } else if (contract.status === CONTRACT_STATUS.RESILIE) {
    contract.status = CONTRACT_STATUS.RESILIE;

    // ✅ 2) Sinon statut calculé depuis les dates
  } else {
    contract.status = computeContractStatus(contract);
  }

  const pr = contract.pricing || {};
  const cl = contract.client || {};

  // 2️⃣ Rétrocompat : recopie du type client si ancien schéma
  if (!pr.clientType && cl.type) {
    pr.clientType = cl.type;
  }

  // 3️⃣ Sécurisation : un SYNDIC ne doit jamais être en 50/50
  if (pr.clientType === "syndic" && pr.billingMode === "annuel_50_50") {
    pr.billingMode = "annuel";
  }

  contract.pricing = pr;
  return contract;
}

function computeNextInvoiceDate(contract) {
  const pr = contract.pricing || {};
  const clientType = pr.clientType || "particulier";
  const mode = pr.billingMode || "annuel";

  const startISO = pr.startDate;
  const duration = Number(pr.durationMonths || 0);
  if (!startISO || !duration) return "";

  const start = new Date(startISO + "T00:00:00");
  if (isNaN(start.getTime())) return "";

  // 🔧 Fin de mois propre (utilisé pour certains cas particuliers)
  function endOfMonth(d) {
    const x = new Date(d);
    x.setMonth(x.getMonth() + 1);
    x.setDate(0);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  // Date de fin de contrat (fin du dernier mois)
  const contractEnd = new Date(start);
  contractEnd.setMonth(contractEnd.getMonth() + duration);
  contractEnd.setDate(contractEnd.getDate() - 1);
  contractEnd.setHours(0, 0, 0, 0);

  // =======================================================
  // 🔵 SYNDIC = POST-PAYÉ, À LA DATE D’ANNIVERSAIRE
  // =======================================================
  if (clientType === "syndic") {
    // Pour mensuel / trimestriel / semestriel → 1, 3, 6
    // Pour ANNUEL → on retombe sur la durée totale du contrat
    let stepMonths = getBillingStepMonths(mode);
    if (!stepMonths) {
      stepMonths = duration; // ex : 12 mois pour un annuel
    }
    if (!stepMonths) return "";

    const totalInstallments = getNumberOfInstallments(pr);
    const already = countContractInstallmentInvoices(contract.id);

    // Si on a déjà toutes les factures prévues → rien à faire
    if (already >= totalInstallments) {
      return "";
    }

    // index = numéro d’échéance à générer (1ère, 2ème, ...)
    const index = already + 1;

    const d = new Date(start);
    d.setMonth(d.getMonth() + stepMonths * index);

    // Patch anti-déplacement de jour (28/29/30/31)
    const startDay = start.getDate();
    const daysInMonth = new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0,
    ).getDate();
    d.setDate(Math.min(startDay, daysInMonth));

    // On laisse la limite “fin de contrat” gérée par:
    // - totalInstallments
    // - checkScheduledInvoices (qui ne crée que ≤ today)

    return d.toISOString().slice(0, 10);
  }

  // =======================================================
  // 🔴 PARTICULIER = FACTURATION ANTICIPÉE
  // =======================================================

  // Cas "annuel" simple → pas d'échéancier ici
  if (mode === "annuel") {
    return "";
  }

  // 🟣 PARTICULIER ANNÉE 50/50
  if (mode === "annuel_50_50") {
    // 1ʳᵉ facture = immédiate (acompte)
    // Ici on ne calcule que la 2e facture (solde 50 %)
    if (!pr.nextInvoiceDate) {
      const half = duration > 0 ? Math.round(duration / 2) : 6; // 6 mois si 12 mois
      const second = new Date(start);
      second.setMonth(second.getMonth() + half); // ex : 12/06/2024 → 12/12/2024

      if (second > contractEnd) {
        return contractEnd.toISOString().slice(0, 10);
      }
      return second.toISOString().slice(0, 10);
    }

    // 2e facture déjà émise
    return "";
  }

  // =============================
  // 🟢 PARTICULIER MENSUEL
  // → 1 facture initiale (déjà faite)
  // → puis 1 facture / mois à la date d'anniversaire
  // =============================
  if (clientType === "particulier" && mode === "mensuel") {
    const totalInstallments = getNumberOfInstallments(pr);
    const already = countContractInstallmentInvoices(contract.id);
    // (inclut l’échéance initiale)

    // Toutes les échéances prévues sont déjà facturées
    if (already >= totalInstallments) {
      return "";
    }

    // index 0 = 1ère facture (déjà émise à startISO)
    // index 1 = +1 mois, etc.
    const index = already;

    const d = new Date(start);
    d.setMonth(d.getMonth() + index);

    if (d > contractEnd) {
      return "";
    }

    return d.toISOString().slice(0, 10);
  }

  // =============================
  // Autres cas particuliers
  // (trimestriel / semestriel particulier, si tu t’en sers un jour)
  // =============================

  const stepMonths = getBillingStepMonths(mode);
  if (!stepMonths) return "";

  let base;
  if (pr.nextInvoiceDate) {
    base = new Date(pr.nextInvoiceDate + "T00:00:00");
  } else {
    base = new Date(start);
  }

  const next = new Date(base);
  next.setMonth(next.getMonth() + stepMonths);

  if (next > contractEnd) {
    return "";
  }

  return next.toISOString().slice(0, 10);
}
function getContractLabel(type) {
  if (type === "piscine_chlore" || type === "piscine_sel") {
    return "Contrat d’entretien Piscine";
  }
  if (type === "spa") {
    return "Contrat d’entretien Spa / Jacuzzi";
  }
  if (type === "piscine+spa") {
    return "Contrat d’entretien Piscine + Spa / Jacuzzi";
  }
  return "Contrat d’entretien Piscine / Spa";
}

let currentContractId = null;

function getTemplateKindForContract(contract) {
  if (!contract) return "";
  const p = contract.pool || {};
  const pr = contract.pricing || {};

  const poolType = pr.mainService || p.type || "";

  if (poolType === "piscine_sel") {
    return "piscine_sel";
  }

  if (
    poolType === "spa" ||
    poolType === "spa_jacuzzi" ||
    poolType === "entretien_jacuzzi"
  ) {
    return "entretien_jacuzzi";
  }

  // défaut : entretien piscine chlore
  return "piscine_chlore";
}

// Masque toutes les sections principales (home, devis, contrats, factures, attestations)
function hideAllSections() {
  const views = [
    "homeView",
    "devisView",
    "factureView",
    "contratView",
    "attestationView",
    "settingsView",
  ];

  views.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

/* ============================
   ACCUEIL / MENU PRINCIPAL
============================ */

function showHome() {
  hideHealthCardsEverywhere();
  const tabHome = document.getElementById("tabHome");
  const tabDevis = document.getElementById("tabDevis");
  const tabContrats = document.getElementById("tabContrats");
  const tabFactures = document.getElementById("tabFactures");
  const tabAttest = document.getElementById("tabAttest");
  const tabCA = document.getElementById("tabCA");
   const tabSettings = document.getElementById("tabSettings"); 

  const homeView = document.getElementById("homeView");
  const listView = document.getElementById("listView");
  const formView = document.getElementById("formView");
  const contractView = document.getElementById("contractView");
  const attestationView = document.getElementById("attestationView");
  const settingsView = document.getElementById("settingsView");
  settingsView && settingsView.classList.add("hidden");

  // Onglets
  tabHome && tabHome.classList.add("active");
  tabDevis && tabDevis.classList.remove("active");
  tabContrats && tabContrats.classList.remove("active");
  tabFactures && tabFactures.classList.remove("active");
  tabAttest && tabAttest.classList.remove("active");
  tabCA && tabCA.classList.remove("active");
  tabSettings && tabSettings.classList.remove("active");

  // Vues
  homeView && homeView.classList.remove("hidden");
  listView && listView.classList.add("hidden");
  formView && formView.classList.add("hidden");
  contractView && contractView.classList.add("hidden");
  attestationView && attestationView.classList.add("hidden");

  refreshHomeStats();
}

function openFromHome(type) {
  // Onglets
  const tabHome = document.getElementById("tabHome");
  const tabDevis = document.getElementById("tabDevis");
  const tabContrats = document.getElementById("tabContrats");
  const tabFactures = document.getElementById("tabFactures");
  const tabAttest = document.getElementById("tabAttest");
  const tabCA = document.getElementById("tabCA");
    const tabSettings = document.getElementById("tabSettings");

  // On quitte l’accueil et les attestations
  tabHome && tabHome.classList.remove("active");
  tabAttest && tabAttest.classList.remove("active");
  tabCA && tabCA.classList.remove("active");
  tabSettings && tabSettings.classList.remove("active");

  if (type === "devis") {
    tabDevis && tabDevis.classList.add("active");
    tabContrats && tabContrats.classList.remove("active");
    tabFactures && tabFactures.classList.remove("active");
  } else if (type === "contrat") {
    tabContrats && tabContrats.classList.add("active");
    tabDevis && tabDevis.classList.remove("active");
    tabFactures && tabFactures.classList.remove("active");
  } else if (type === "facture") {
    tabFactures && tabFactures.classList.add("active");
    tabDevis && tabDevis.classList.remove("active");
    tabContrats && tabContrats.classList.remove("active");
  }

  const homeView = document.getElementById("homeView");
  const listView = document.getElementById("listView");
  const formView = document.getElementById("formView");
  const contractView = document.getElementById("contractView");
  const attestationView = document.getElementById("attestationView");
  const settingsView = document.getElementById("settingsView");

  // On affiche la liste (devis/factures/contrats)
  homeView && homeView.classList.add("hidden");
  attestationView && attestationView.classList.add("hidden");
  listView && listView.classList.remove("hidden");
  formView && formView.classList.add("hidden");
  contractView && contractView.classList.add("hidden");
  settingsView && settingsView.classList.add("hidden");

  // logique existante
  if (typeof switchListType === "function") {
    switchListType(type);
  }
}

function refreshHomeStats() {
  // Sécu : si pas de dashboard sur la page, on ne fait rien
  if (!document.getElementById("homeView")) return;

  const docs = typeof getAllDocuments === "function" ? getAllDocuments() : [];
  const contracts =
    typeof getAllContracts === "function" ? getAllContracts() : [];

  // ========= DEVIS =========
  const devis = docs.filter((d) => d.type === "devis");

  const devisCount = devis.length;
  const devisPending = devis.filter(
    (d) => !d.status || d.status === "en_attente",
  ).length;
  const devisAccepted = devis.filter((d) => d.status === "accepte").length;
  const devisClosed = devis.filter((d) => d.status === "cloture").length;
  const devisRefused = devis.filter((d) => d.status === "refuse").length;
  const devisExpired = devis.filter((d) => d.status === "expire").length;

  const lastDevis = devis
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];

  const elDevisCount = document.getElementById("dashDevisCount");
  const elDevisStatus = document.getElementById("dashDevisStatus");
  const elDevisLast = document.getElementById("dashDevisLast");

  if (elDevisCount) {
    elDevisCount.textContent =
      devisCount +
      (devisCount > 1 ? " devis enregistrés" : " devis enregistré");
  }

  if (elDevisStatus) {
    elDevisStatus.textContent =
      `${devisPending} en attente · ` +
      `${devisAccepted} acceptés · ` +
      `${devisClosed} clôturés · ` +
      `${devisRefused} refusés · ` +
      `${devisExpired} expirés`;
  }

  if (elDevisLast) {
    if (lastDevis) {
      const num = lastDevis.number || lastDevis.id || "";
      const date = lastDevis.date || "";
      elDevisLast.textContent = `Dernier devis : ${num} (${date})`;
    } else {
      elDevisLast.textContent = "Dernier devis : –";
    }
  }

  // ========= CONTRATS (ROBUSTE) =========
  // ⚠️ On ne se base JAMAIS sur c.status ici : tout vient de computeContractStatus()
  const activeContracts = contracts.filter((c) => {
    const st = computeContractStatus(c);
    return (
      st === CONTRACT_STATUS.EN_COURS || st === CONTRACT_STATUS.A_RENOUVELER
    );
  });

  const toRenew = contracts.filter(
    (c) => computeContractStatus(c) === CONTRACT_STATUS.A_RENOUVELER,
  );

  const elCtCount = document.getElementById("dashContractCount");
  const elCtRenew = document.getElementById("dashContractRenew");

  if (elCtCount) {
    elCtCount.textContent =
      activeContracts.length +
      (activeContracts.length > 1 ? " contrats actifs" : " contrat actif");
  }

  if (elCtRenew) {
    elCtRenew.textContent = `À renouveler : ${toRenew.length}`;
  }

  // ========= FACTURES =========
  const factures = docs.filter((d) => d.type === "facture");
  const unpaid = factures.filter((f) => !f.paid);

  const unpaidAmount = unpaid.reduce((sum, f) => {
    const val = Number(f.totalTTC || 0);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const elInvCount = document.getElementById("dashInvoiceCount");
  const elInvUnpaid = document.getElementById("dashInvoiceUnpaid");
  const elInvAmt = document.getElementById("dashInvoiceAmount");
  const elInvHealth = document.getElementById("dashInvoiceHealth");

  if (elInvCount) {
    elInvCount.textContent =
      factures.length +
      (factures.length > 1 ? " factures créées" : " facture créée");
  }

  if (elInvUnpaid) {
    elInvUnpaid.textContent = `Impayées : ${unpaid.length}`;
  }

  if (elInvAmt) {
    const fmtUnpaid =
      typeof formatEuro === "function"
        ? formatEuro(unpaidAmount)
        : unpaidAmount.toFixed(2) + " €";
    elInvAmt.textContent = `Montant impayé : ${fmtUnpaid}`;
  }

  // 🧠 Analyse "santé" facturation
  if (elInvHealth) {
    const DELAI_REGLEMENT_JOURS = 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    unpaid.forEach((f) => {
      const val = Number(f.totalTTC || 0) || 0;

      const due = _dueDateFromInvoice(f, DELAI_REGLEMENT_JOURS);

      // pas de date => on considère "en attente"
      if (!due) {
        pendingCount++;
        pendingAmount += val;
        return;
      }

      if (today.getTime() > due.getTime()) {
        lateCount++;
        lateAmount += val;
      } else {
        pendingCount++;
        pendingAmount += val;
      }
    });

      const fmtMoney = (v) =>
    typeof formatEuro === "function"
      ? formatEuro(v)
      : Number(v || 0).toFixed(2) + " €";

  if (unpaid.length === 0) {
    elInvHealth.textContent = "Santé facturation : ✅ RAS, tout est payé";
  } else if (lateCount > 0) {
    elInvHealth.textContent = `Santé facturation : ⚠️ ${lateCount} en retard (${fmtMoney(
      lateAmount,
    )})`;
  } else {
    elInvHealth.textContent = `Santé facturation : 🟡 ${pendingCount} en attente (${fmtMoney(
      pendingAmount,
    )})`;
  }
}

// ========= CHIFFRE D'AFFAIRES (CARTE DASHBOARD) =========
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0-11

let caTotal = 0;
let caPaid = 0;
let caUnpaid = 0;
let caThisMonth = 0;

factures.forEach((f) => {
  const val = Number(f.totalTTC || 0);
  if (isNaN(val)) return;

  caTotal += val;
  if (f.paid) caPaid += val;
  else caUnpaid += val;

  if (f.date) {
    const d = new Date(f.date + "T00:00:00");
    if (
      !isNaN(d.getTime()) &&
      d.getFullYear() === currentYear &&
      d.getMonth() === currentMonth
    ) {
      caThisMonth += val;
    }
  }
});

const elCaTotal = document.getElementById("dashCATotal");
const elCaPaid = document.getElementById("dashCAPaid");
const elCaUnpaid = document.getElementById("dashCAUnpaid");
const elCaMonth = document.getElementById("dashCAMonth");

if (elCaTotal) elCaTotal.textContent = "CA total : " + fmtMoney(caTotal);
if (elCaPaid) elCaPaid.textContent = "Payé : " + fmtMoney(caPaid);
if (elCaUnpaid) elCaUnpaid.textContent = "Impayé : " + fmtMoney(caUnpaid);
if (elCaMonth) elCaMonth.textContent = "Mois en cours : " + fmtMoney(caThisMonth);

// ========= TABLEAU SANTÉ GLOBAL =========
const rowFacturesLate = document.getElementById("healthRowFacturesLate");
const rowFacturesPending = document.getElementById("healthRowFacturesPending");
const rowDevis = document.getElementById("healthRowDevis");
const rowContrats = document.getElementById("healthRowContrats");

function setHealthRow(row, status, text) {
  if (!row) return;

  const statusCell = row.querySelector(".health-status");
  const detailCell = row.querySelector(".health-detail");

  if (statusCell) {
    statusCell.classList.remove("health-ok", "health-warn", "health-bad");

    let cls = "";
    if (status === "ok") cls = "health-ok";
    if (status === "warn") cls = "health-warn";
    if (status === "bad") cls = "health-bad";

    if (cls) statusCell.classList.add(cls);

    if (status === "ok") statusCell.textContent = "✅ OK";
    else if (status === "warn") statusCell.textContent = "⚠️ Attention";
    else if (status === "bad") statusCell.textContent = "⛔ Urgent";
    else statusCell.textContent = "–";
  }

  if (detailCell && typeof text === "string") {
    detailCell.textContent = text;
  }
}

// ---- Factures (séparées : critiques / en attente)
if (rowFacturesLate || rowFacturesPending) {
  const DELAI_REGLEMENT_JOURS = 30;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let lateCount = 0;
  let lateAmount = 0;
  let pendingCount = 0;
  let pendingAmount = 0;

  unpaid.forEach((f) => {
    const val = Number(f.totalTTC || 0) || 0;

    const due = _dueDateFromInvoice(f, DELAI_REGLEMENT_JOURS);

    // pas de date = on met en "attente"
    if (!due) {
      pendingCount++;
      pendingAmount += val;
      return;
    }

    // ✅ retard basé sur l’échéance (fin de mois + 30j pour syndics)
    if (today.getTime() > due.getTime()) {
      lateCount++;
      lateAmount += val;
    } else {
      pendingCount++;
      pendingAmount += val;
    }
  });

  if (rowFacturesLate) {
    if (lateCount > 0) {
      setHealthRow(
        rowFacturesLate,
        "bad",
        `${lateCount} facture(s) en retard (${fmtMoney(lateAmount)})`,
      );
    } else {
      setHealthRow(rowFacturesLate, "ok", "Aucune facture critique");
    }
  }

  if (rowFacturesPending) {
    if (pendingCount > 0) {
      setHealthRow(
        rowFacturesPending,
        "warn",
        `${pendingCount} facture(s) non payée(s) (${fmtMoney(pendingAmount)})`,
      );
    } else {
      setHealthRow(rowFacturesPending, "ok", "Aucune facture en attente");
    }
  }
}

// ---- Devis
if (rowDevis) {
  if (devisExpired > 0) {
    setHealthRow(rowDevis, "bad", `${devisExpired} devis expiré(s) à traiter`);
  } else if (devisPending > 0) {
    setHealthRow(rowDevis, "warn", `${devisPending} devis en attente de réponse`);
  } else {
    setHealthRow(rowDevis, "ok", "Aucun devis en attente critique");
  }
}

// ---- Contrats (FIX FINAL)
// Seul toRenew déclenche l'urgence.
if (rowContrats) {
  if (toRenew.length > 0) {
    setHealthRow(rowContrats, "bad", `${toRenew.length} contrat(s) à renouveler`);
  } else if (contracts.length === 0) {
    setHealthRow(rowContrats, "ok", "Aucun contrat enregistré");
  } else {
    setHealthRow(rowContrats, "ok", "Tous les contrats sont à jour");
  }
}

if (typeof renderPlanningWeek === "function") {
  renderPlanningWeek();
}
}

async function saveDocumentToFirestore(docObj) {
  if (!db || !docObj?.id) return;
  await db.collection("documents").doc(docObj.id).set(docObj, { merge: true });
}

async function upsertManualPlanningItemToFirestore(item) {
  if (!db || !item?.id) return;
  await db.collection("planningManual").doc(item.id).set(item, { merge: true });
}


// ====== PLANNING HEBDO ======

let planningWeekOffset = 0;
let currentPlanningData = [];
let manualPopupDate = null;

// ✅ OVERRIDES CONTRAT + DND INSTANCES

let planningSortables = [];

function loadContractPlanningOverrides() {
  try {
    return (
      JSON.parse(localStorage.getItem("contractPlanningOverrides") || "[]") || []
    );
  } catch (e) {
    return [];
  }
}

function saveContractPlanningOverrides() {
  try {
    localStorage.setItem(
      "contractPlanningOverrides",
      JSON.stringify(contractPlanningOverrides),
    );
  } catch (e) {}
}


function getOverriddenContractDate(contractId, originalDateISO) {
  const ov = contractPlanningOverrides.find(
    (o) => o.contractId === contractId && o.originalDate === originalDateISO,
  );
  return ov ? ov.newDate : originalDateISO;
}

async function applyContractPlanningOverride(contractId, originalDate, newDate) {
  try {
    if (!db) return;

    const id = `${contractId}__${originalDate}`; // ID stable (important)
    await db.collection("contractPlanningOverrides").doc(id).set({
      id,
      contractId,
      originalDate,
      newDate,
      updatedAt: Date.now(),
    }, { merge: true });

    // Pas besoin de renderPlanningWeek() : ton onSnapshot contractPlanningOverrides le fera.
  } catch (e) {
    console.error("applyContractPlanningOverride error:", e);
  }
}

function applyCompanySettingsToUI(settings) {
  const s = settings || {};

  document.querySelectorAll(".js-company-name").forEach((el) => {
    el.textContent = s.companyName || "";
  });

  document.querySelectorAll(".js-company-subtitle").forEach((el) => {
    el.textContent = s.subtitle || "";
  });

  document.querySelectorAll(".js-company-legal").forEach((el) => {
    el.textContent = s.legalName || "";
  });

  document.querySelectorAll(".js-company-address").forEach((el) => {
    el.textContent = s.address || "";
  });

  document.querySelectorAll(".js-company-phone").forEach((el) => {
    el.textContent = s.phone || "";
  });

  document.querySelectorAll(".js-company-email").forEach((el) => {
    el.textContent = s.email || "";
  });

  document.querySelectorAll(".js-company-siret").forEach((el) => {
    el.textContent = s.siret || "";
  });

  document.querySelectorAll(".js-company-vat").forEach((el) => {
    el.textContent = s.vatNumber || "";
  });

  document.querySelectorAll(".js-company-vat-line").forEach((line) => {
    if (s.vatNumber && s.vatNumber.trim() !== "") {
      line.classList.remove("hidden");
    } else {
      line.classList.add("hidden");
    }
  });
}

function initPlanningDnD() {
  // ✅ Sortable pas chargé => pas de drag
  if (typeof Sortable === "undefined") {
    console.warn(
      "❌ SortableJS manquant. Ajoute le <script Sortable.min.js> dans index.html.",
    );
    return;
  }

  // ✅ reset anciennes instances
  planningSortables.forEach((s) => {
    try {
      s.destroy();
    } catch (e) {}
  });
  planningSortables = [];

  document.querySelectorAll(".day-visits").forEach((listEl) => {
    const sortable = new Sortable(listEl, {
      group: "planning",
      animation: 150,
      draggable: ".visit-entry",
      filter: ".visit-empty",

  // ✅ Rend le drag + facile (surtout sur touchpad / mobile)
  forceFallback: true,
  fallbackOnBody: true,
  fallbackTolerance: 8,         // 👈 clé: évite "micro drag" qui sélectionne
  touchStartThreshold: 8,       // 👈 clé: il faut bouger un peu avant que ça drag
  delay: 80,                    // 👈 petit délai pour éviter les clics / sélections
  delayOnTouchOnly: true,       // 👈 uniquement sur mobile / tactile

  onStart() {
    document.body.classList.add("is-dragging");
  },

      onEnd(evt) {
        const itemEl = evt.item;

        const newDateISO = evt.to.closest(".day-column")?.dataset?.date;
        const oldDateISO = evt.from.closest(".day-column")?.dataset?.date;
        if (!newDateISO || newDateISO === oldDateISO) return;

        // 🟢 MANUEL
        if (itemEl.classList.contains("visit-manual")) {
          const manualId = itemEl.dataset.manualId;
          if (!manualId) return;
          moveManualPlanningItemToDate(manualId, newDateISO);
          return;
        }

        // 🔵 CONTRAT
        if (itemEl.classList.contains("visit-contract")) {
          const contractId = itemEl.dataset.contractId;
          const originalDate = itemEl.dataset.originalDate;
          if (!contractId || !originalDate) return;

          applyContractPlanningOverride(contractId, originalDate, newDateISO);
        }
      },
    });

    planningSortables.push(sortable);
  });
}

function getServiceLabelForContract(contract) {
  const pr = contract.pricing || {};
  const mainService = (
    pr.mainService ||
    contract.pool?.type ||
    ""
  ).toLowerCase();

  if (!mainService) return "Intervention";

  if (mainService.includes("spa") || mainService.includes("jacuzzi")) {
    return "Entretien spa / jacuzzi";
  }

  if (mainService.includes("clim")) {
    return "Entretien / dépannage clim";
  }

  if (
    mainService.includes("piscine") ||
    mainService.includes("sel") ||
    mainService.includes("chlore")
  ) {
    return "Entretien piscine (contrat)";
  }

  return "Intervention (contrat)";
}

// ================== PLANNING HEBDOMADAIRE ==================

function changePlanningWeek(delta) {
  planningWeekOffset = (planningWeekOffset || 0) + delta;
  renderPlanningWeek();
}


function getMondayOfWeek(offset) {
  const today = new Date();
  const day = today.getDay(); // 0 = dimanche, 1 = lundi...
  const monday = new Date(today);
  const diffToMonday = (day + 6) % 7; // transforme lundi en 0
  monday.setDate(today.getDate() - diffToMonday + offset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getContractEndDate(contract) {
  const pr = contract.pricing || {};

  // 1) si endDateLabel est renseigné
  if (pr.endDateLabel) {
    const d = new Date(pr.endDateLabel + "T00:00:00");
    if (!isNaN(d.getTime())) return d;
  }

  // 2) sinon : startDate + durationMonths
  if (pr.startDate && pr.durationMonths) {
    const start = new Date(pr.startDate + "T00:00:00");
    if (!isNaN(start.getTime())) {
      const end = new Date(start);
      end.setMonth(end.getMonth() + Number(pr.durationMonths || 0));
      end.setDate(end.getDate() - 1);
      end.setHours(0, 0, 0, 0);
      return end;
    }
  }

  return null;
}

function contractIsActiveDuringWeek(contract, monday, sunday) {
  const pr = contract.pricing || {};
  if (!pr.startDate) return false;

  const start = new Date(pr.startDate + "T00:00:00");
  if (isNaN(start.getTime())) return false;

  const end = getContractEndDate(contract) || new Date(start.getTime());

  // chevauchement des périodes
  return !(end < monday || start > sunday);
}

// Nombre de passages "en moyenne" par semaine pour cette période
function getVisitsPerWeekForDate(contract, refDate) {
  const pr = contract.pricing || {};
  const month = refDate.getMonth() + 1;

  // Mai à septembre = été, le reste = hiver (simplifié)
  const perMonth =
    month >= 5 && month <= 9
      ? Number(pr.passEte || 0)
      : Number(pr.passHiver || 0);

  if (!perMonth) return 0;

  let visits = Math.round(perMonth / 4); // approx 4 semaines / mois
  if (visits < 1) visits = 1; // s’il y a des passages, au moins 1

  return visits;
}

function getPlanningColorClass(service) {
  const s = (service || "").toLowerCase();

  if (s.includes("clim")) return "planning-kind-clim";
  if (s.includes("jacuzzi") || s.includes("spa")) return "planning-kind-jacuzzi";
  if (s.includes("dépannage") || s.includes("depannage")) return "planning-kind-depannage";
  if (s.includes("piscine")) return "planning-kind-piscine";

  return "planning-kind-default";
}

function renderPlanningWeek() {
  const grid = document.getElementById("planningGrid");
  const labelEl = document.getElementById("planningWeekLabel");
  const detailsEl = document.getElementById("planningDetails");
  if (!grid || !labelEl) return;

  const monday = getMondayOfWeek(planningWeekOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  labelEl.textContent =
    monday.toLocaleDateString("fr-FR") +
    " → " +
    sunday.toLocaleDateString("fr-FR");

  grid.innerHTML = "";
  if (detailsEl) {
    detailsEl.classList.add("hidden");
    detailsEl.innerHTML = "";
  }

  const dayShort = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const todayISO = formatDateYMD(new Date());

  const dayColumns = [];
  currentPlanningData = [];

  // ===========================
  // 1) Colonnes semaine
  // ===========================
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = formatDateYMD(date);

    const col = document.createElement("div");
    col.className = "day-column";
    col.dataset.date = dateStr;

    if (dateStr === todayISO && planningWeekOffset === 0) {
      col.classList.add("is-today");
    }
    if (i >= 5) {
      col.classList.add("is-weekend");
    }

    const header = document.createElement("div");
    header.className = "day-column-header";
    header.innerHTML = `<span>${dayShort[i]} ${date.toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "2-digit",
      },
    )}</span>
      <button type="button"
              class="planning-add-btn"
              data-date="${dateStr}">+</button>`;

    // ✅ bouton + (ajout manuel)
    const addBtn = header.querySelector(".planning-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openManualPlanningPopup(addBtn.dataset.date);
      });
    }

    const list = document.createElement("div");
    list.className = "day-visits";

    col.appendChild(header);
    col.appendChild(list);
    grid.appendChild(col);

    // ✅ click colonne = détails du jour (sauf sur +)
    col.addEventListener("click", function (e) {
      if (e.target.closest(".planning-add-btn")) return;
      openPlanningDayDetails(this.dataset.date);
    });

    dayColumns.push({ date, dateStr, list });
    currentPlanningData.push({ date: dateStr, items: [] });
  }

  // ===========================
  // 2) Prestations CONTRAT (déplaçables via overrides)
  // ===========================
  const contracts =
    typeof getAllContracts === "function" ? getAllContracts() : [];

  contracts.forEach((contract) => {
    const status = computeContractStatus(contract);
    if (
      status !== CONTRACT_STATUS.EN_COURS &&
      status !== CONTRACT_STATUS.A_RENOUVELER
    ) {
      return;
    }

    if (!contractIsActiveDuringWeek(contract, monday, sunday)) return;

    const visits = getVisitsPerWeekForDate(contract, monday);
    if (!visits) return;

    const clientName =
      (contract.client && contract.client.name) ||
      (contract.client && contract.client.reference) ||
      "Client";

    const phone = contract.client?.phone || "";
    const address = contract.client?.address || "";
    const serviceLabel = getServiceLabelForContract(contract);

    for (let i = 0; i < visits; i++) {
      // date originale "prévue" pour cette visite (répartition dans la semaine)
   // 👉 jour du contrat (lundi, mardi, etc.)
const startISO = contract?.pricing?.startDate;
const d = startISO ? new Date(startISO + "T00:00:00") : null;

// convertit getDay() (dim=0) → lun=0
const preferredIndex =
  d && !isNaN(d) ? (d.getDay() + 6) % 7 : 3; // 3 = jeudi secours

let dayIndexOriginal;

// ✅ 1 passage = même jour que le contrat
if (visits === 1) {
  dayIndexOriginal = preferredIndex;
} else {
  // ✅ plusieurs passages = logique existante
  dayIndexOriginal = Math.min(
    6,
    Math.floor(((i + 0.5) * 7) / visits),
  );
}

      const originalDateISO = dayColumns[dayIndexOriginal].dateStr;

      // ✅ override éventuel (si déplacée)
      const finalDateISO = getOverriddenContractDate(
        contract.id,
        originalDateISO,
      );

      const dayIndexFinal = currentPlanningData.findIndex(
        (d) => d.date === finalDateISO,
      );
      if (dayIndexFinal === -1) continue;

      const column = dayColumns[dayIndexFinal];
      const info = currentPlanningData[dayIndexFinal];

      const div = document.createElement("div");
      div.className = "visit-entry visit-contract " + getPlanningColorClass(serviceLabel);
      div.dataset.contractId = contract.id;
      div.dataset.originalDate = originalDateISO;

      div.innerHTML =
        "<strong>" +
        escapeHtml(serviceLabel) +
        "</strong>" +
        "<br><span class='visit-pool'>" +
        escapeHtml(clientName) +
        "</span>";

      column.list.appendChild(div);

      info.items.push({
        type: "contract",
        clientName,
        serviceLabel,
        phone,
        address,
        contractId: contract.id,
        originalDate: originalDateISO,
        date: finalDateISO,
      });
    }
  });

  // ===========================
  // 3) Ajouts MANUELS (déplaçables)
  // ===========================
  manualPlanningItems.forEach((item) => {
    const index = currentPlanningData.findIndex((d) => d.date === item.date);
    if (index === -1) return;

    const column = dayColumns[index];
    const info = currentPlanningData[index];

    const service = item.service || item.label || "Intervention";
    const clientName = item.clientName || "";

    const div = document.createElement("div");
    div.className = "visit-entry visit-manual " + getPlanningColorClass(service);
if (item.isDone) div.classList.add("is-done");

    div.dataset.manualId = item.id;

    div.innerHTML =
      "<strong>" +
      escapeHtml(service) +
      "</strong>" +
      (clientName
        ? "<br><span class='visit-pool'>" + escapeHtml(clientName) + "</span>"
        : "");

    column.list.appendChild(div);

info.items.push({
  id: item.id,
  type: "manual",
  service,
  clientName,
  address: item.address || "",
  phone: item.phone || "",
  notes: item.notes || "",
  sourceId: item.sourceId || "",       // ✅ AJOUT
  sourceType: item.sourceType || "",   // ✅ (optionnel mais utile)
});

  });

  // ===========================
  // 4) Colonnes vides
  // ===========================
  currentPlanningData.forEach((d, idx) => {
    if (!dayColumns[idx].list.children.length) {
      const empty = document.createElement("div");
      empty.className = "visit-empty";
      empty.textContent = "—";
      dayColumns[idx].list.appendChild(empty);
    }
  });

  // ✅ IMPORTANT : activer drag&drop après rendu
  initPlanningDnD();
}

function openPlanningTour(dateStr) {
  const day = currentPlanningData.find((d) => d.date === dateStr);
  const items = (day && day.items) ? day.items : [];

  // 1) récupérer les adresses valides (contract + manual)
  const addresses = items
    .map((it) => (it.address || "").toString().trim())
    .filter((a) => a.length > 0);

  // dédoublonner en gardant l'ordre
  const uniq = [];
  const seen = new Set();
  for (const a of addresses) {
    const key = a.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(a);
    }
  }

  if (!uniq.length) {
    showConfirmDialog({
      title: "Tournée impossible",
      message: "Aucune adresse trouvée sur ce jour.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️",
    });
    return;
  }

  // ✅ IMPORTANT : départ = ma position
  const origin = "My+Location";

  // 2) construire l’URL Google Maps (multi-stop)
  if (uniq.length === 1) {
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${origin}` +
      `&destination=${encodeURIComponent(uniq[0])}` +
      `&travelmode=driving`;
    openExternalLink(url);
    return;
  }

  const destination = uniq[uniq.length - 1];
  const waypoints = uniq.slice(0, -1);

  const url =
    "https://www.google.com/maps/dir/?api=1" +
    "&origin=" + origin +
    "&destination=" + encodeURIComponent(destination) +
    (waypoints.length
      ? "&waypoints=" + waypoints.map(encodeURIComponent).join("%7C")
      : "") +
    "&travelmode=driving";

  openExternalLink(url);
}


function openPlanningDayDetails(dateStr) {
  const detailsEl = document.getElementById("planningDetails");
  if (!detailsEl) return;

  // 🔵 déplace le cadre bleu sur la case cliquée
  document.querySelectorAll(".day-column").forEach((col) => {
    col.classList.remove("is-selected");
  });
  const selectedCol = document.querySelector(
    `.day-column[data-date="${dateStr}"]`
  );
  if (selectedCol) selectedCol.classList.add("is-selected");

  const day = currentPlanningData.find((d) => d.date === dateStr);
  const frDate = new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

  let html = `
    <div class="planning-details-header">
      <h3>Détails pour ${frDate}</h3>
      <button type="button"
              class="btn btn-small btn-secondary"
              onclick="openPlanningTour('${dateStr}')">
        🗺️ Ouvrir la tournée
      </button>
    </div>
  `;

  if (!day || !day.items.length) {
    html += `<div class="visit-empty">Aucun passage prévu.</div>`;
  } else {
    day.items.forEach((item) => {
      // 🔒 notes privées depuis la fiche client
      const c = item.clientName ? _getClientByName(item.clientName) : null;
      const notes = (c?.privateNotes || "").trim();
      const notesHtml = notes
        ? `<div style="margin-top:6px; padding:6px 8px; border-radius:10px; background:#fff8e5; border:1px solid #f3d08a;">
             <strong>🔒 Notes privées</strong><br>
             <span style="white-space:pre-line;">${escapeHtml(notes)}</span>
           </div>`
        : "";

      const addressHtml = item.address
        ? `<a
             href="https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodeURIComponent(
               item.address
             )}"
             target="_blank"
             style="text-decoration:none;color:#1f6fe5;font-weight:700;"
             title="Ouvrir l’itinéraire Google Maps"
           >📍 ${escapeHtml(item.address)}</a><br>`
        : "";

      const phoneHtml = item.phone
        ? `<a
             href="tel:${_cleanPhoneForTel(item.phone)}"
             style="text-decoration:none;font-weight:700;"
             title="Appeler le client"
           >📞 ${escapeHtml(item.phone)}</a><br>`
        : "";

      if (item.type === "contract") {
        html += `
          <div class="planning-details-entry">
            <strong>${escapeHtml(item.clientName)}</strong><br>
            ${addressHtml}
            ${notesHtml}
            ${phoneHtml}
            ${
              item.serviceLabel
                ? `<span class="visit-pool">${escapeHtml(item.serviceLabel)}</span>`
                : ""
            }
          </div>
        `;
      }

      if (item.type === "manual") {
        const service = item.service || item.label || "Intervention";

        // ✅ on permet l'édition seulement pour les manuels "normaux"
        const canEdit = !item.sourceId;

        html += `
          <div class="planning-details-entry">
            <strong>${escapeHtml(service)}</strong><br>
            ${item.clientName ? escapeHtml(item.clientName) + "<br>" : ""}
            ${addressHtml}
            ${notesHtml}
            ${phoneHtml}

            <div class="planning-actions">
              ${
                canEdit
                  ? `<button class="btn btn-small btn-secondary"
                      onclick="openEditManualPlanningItem('${item.id}', '${dateStr}')">
                      ✏️ Modifier
                    </button>`
                  : ""
              }

              <button class="btn btn-small btn-secondary"
                onclick="${
                  item.sourceId
                    ? `openDevisAcceptedActionPopup('${item.sourceId}')`
                    : `showConfirmDialog({
                        title:'Replanifier',
                        message:'Pour déplacer un passage manuel : glisse-dépose la carte sur un autre jour ✅',
                        confirmLabel:'OK',
                        cancelLabel:'',
                        variant:'info',
                        icon:'ℹ️'
                      })`
                }">
                🔁 Replanifier
              </button>

              <button class="btn btn-small btn-secondary"
                onclick="toggleManualPlanningDone('${item.id}', '${dateStr}')">
                ${
                  manualPlanningItems.find((x) => x.id === item.id)?.isDone
                    ? "↩ Annuler"
                    : "✅ Fait"
                }
              </button>

              <button class="btn btn-small btn-danger"
                onclick="deleteManualPlanningItem('${item.id}', '${dateStr}')">
                🗑️ Supprimer
              </button>
            </div>
          </div>
        `;
      }
    });
  }

  detailsEl.innerHTML = html;
  detailsEl.classList.remove("hidden");
}

function openEditManualPlanningItem(manualId, dateStr) {
  const it = (manualPlanningItems || []).find(x => x.id === manualId);
  if (!it) return;

  openManualPlanningPopup(dateStr, null, manualId);
}


function openManualPlanningPopup(dateStr, ev, manualIdToEdit = null) {
  if (ev) ev.stopPropagation();
  manualPopupDate = dateStr;

  const overlay = document.getElementById("planningPopup");
  if (!overlay) return;

  // mode édition (si tu l'utilises)
  editingManualPlanningId = manualIdToEdit || null;

  // titre + bouton
  const titleEl = overlay.querySelector("h3");
  const primaryBtn = overlay.querySelector(".popup-buttons .btn.btn-primary");
  if (titleEl) {
    titleEl.textContent = editingManualPlanningId
      ? "Modifier une intervention"
      : "Ajouter une intervention";
  }
  if (primaryBtn) {
    primaryBtn.textContent = editingManualPlanningId ? "Enregistrer" : "Ajouter";
  }

  const frDate = new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dateLabel = document.getElementById("planningPopupDate");
  if (dateLabel) dateLabel.textContent = "Pour le " + frDate;

  // reset champs
const select = document.getElementById("planningPopupPrestation");
const custom = document.getElementById("planningPopupPrestationCustom");
const clientInput = document.getElementById("planningPopupClient");
const addrInput = document.getElementById("planningPopupAddress");
const phoneInput = document.getElementById("planningPopupPhone");
const emailInput = document.getElementById("planningPopupEmail");
const privateNotesInput = document.getElementById("planningPopupPrivateNotes");
const notesInput = document.getElementById("planningPopupNotes");
const repeatPerMonthInput = document.getElementById("planningPopupRepeatPerMonth");
const repeatMonthsInput = document.getElementById("planningPopupRepeatMonths");

if (select) select.value = "";
if (custom) custom.value = "";
if (clientInput) clientInput.value = "";
if (addrInput) addrInput.value = "";
if (phoneInput) phoneInput.value = "";
if (emailInput) emailInput.value = "";
if (privateNotesInput) privateNotesInput.value = "";
if (notesInput) notesInput.value = "";
if (repeatPerMonthInput) repeatPerMonthInput.value = "0";
if (repeatMonthsInput) repeatMonthsInput.value = "6";

  // remplit la liste déroulante
  loadPlanningPrestations();

  // pré-remplissage si édition
  if (editingManualPlanningId) {
    const it = (manualPlanningItems || []).find((x) => x.id === editingManualPlanningId);
    if (it) {
      // si tu avais stocké customPrestation, on le remet
      if (custom) custom.value = it.customPrestation || "";
      if (select) select.value = it.prestation || "";

      if (clientInput) clientInput.value = it.clientName || "";
      if (addrInput) addrInput.value = it.address || "";
      if (phoneInput) phoneInput.value = it.phone || "";
      if (notesInput) notesInput.value = it.notes || "";
      if (emailInput) emailInput.value = it.email || "";
if (privateNotesInput) privateNotesInput.value = it.privateNotes || "";
    }
  }

  // ✅ bonus simple : si tu tapes du texte libre -> on vide le select
  if (custom && select) {
    custom.oninput = () => {
      if (custom.value.trim()) select.value = "";
    };
    select.onchange = () => {
      if (select.value) custom.value = "";
    };
  }

  // affiche
  overlay.classList.remove("hidden");
  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth;
    popup.classList.add("show");
  }
}

function closeManualPlanningPopup() {
  const overlay = document.getElementById("planningPopup");
  if (!overlay) return;

  const popup = overlay.querySelector(".popup");
  if (popup) popup.classList.remove("show");

  overlay.classList.add("hidden");

  // ✅ reset mode édition
  editingManualPlanningId = null;

  // remet le titre/bouton par défaut
  const titleEl = overlay.querySelector("h3");
  const primaryBtn = overlay.querySelector(".popup-buttons .btn.btn-primary");
  if (titleEl) titleEl.textContent = "Ajouter une intervention";
  if (primaryBtn) primaryBtn.textContent = "Ajouter";
}

function getPlanningColorClass(service) {
  const s = (service || "").toLowerCase();

  if (s.includes("clim")) return "planning-kind-clim";
  if (s.includes("jacuzzi") || s.includes("spa")) return "planning-kind-jacuzzi";
  if (s.includes("dépannage") || s.includes("depannage")) return "planning-kind-depannage";
  if (s.includes("piscine")) return "planning-kind-piscine";

  return "planning-kind-default";
}

function addMonthsSafe(dateISO, monthsToAdd) {
  const d = new Date(dateISO + "T00:00:00");
  d.setMonth(d.getMonth() + monthsToAdd);
  return d.toISOString().slice(0, 10);
}

function makeMonthlyDates(baseDateISO, visitsPerMonth, monthsCount) {
  const dates = [];

  const templates = {
    1: [0],
    2: [0, 14],
    3: [0, 10, 20],
    4: [0, 7, 14, 21],
  };

  const offsets = templates[Number(visitsPerMonth)] || [0];

  for (let m = 0; m < Number(monthsCount || 1); m++) {
    const monthBase = addMonthsSafe(baseDateISO, m);

    offsets.forEach((dayOffset) => {
      const d = new Date(monthBase + "T00:00:00");
      d.setDate(d.getDate() + dayOffset);
      dates.push(d.toISOString().slice(0, 10));
    });
  }

  return dates;
}

async function confirmManualPlanningPopup() {
  const overlay = document.getElementById("planningPopup");
  if (!overlay || !manualPopupDate) return;

  const prestationSelect =
    document.getElementById("planningPopupPrestation")?.value || "";

  const prestationCustom =
    document.getElementById("planningPopupPrestationCustom")?.value.trim() || "";

  const prestation = prestationCustom || prestationSelect;

  const client =
    document.getElementById("planningPopupClient")?.value.trim() || "";
  const address =
    document.getElementById("planningPopupAddress")?.value.trim() || "";
  const phone =
    document.getElementById("planningPopupPhone")?.value.trim() || "";
  const email =
    document.getElementById("planningPopupEmail")?.value.trim() || "";
  const privateNotes =
    document.getElementById("planningPopupPrivateNotes")?.value.trim() || "";
  const notes =
    document.getElementById("planningPopupNotes")?.value.trim() || "";

  const repeatPerMonth = Number(
    document.getElementById("planningPopupRepeatPerMonth")?.value || 0
  );
  const repeatMonths = Number(
    document.getElementById("planningPopupRepeatMonths")?.value || 1
  );

  if (!prestation && !client) {
    alert("Merci de renseigner au moins une prestation ou un nom de client 🙂");
    return;
  }

  const label = prestation || client;

  try {
    if (!db) throw new Error("Firestore db non initialisé");

    // ✅ MODE ÉDITION = on modifie seulement UNE intervention
    if (editingManualPlanningId) {
      const payload = {
        id: editingManualPlanningId,
        date: manualPopupDate,
        label,
        prestation,
        customPrestation: prestationCustom,
        clientName: client,
        address,
        phone,
        email,
        privateNotes,
        notes,
        updatedAt: Date.now(),
      };

      await db.collection("planningManual").doc(editingManualPlanningId).set(payload, {
        merge: true,
      });
    } else {
      // ✅ MODE CRÉATION
      const dates =
        repeatPerMonth > 0
          ? makeMonthlyDates(manualPopupDate, repeatPerMonth, repeatMonths)
          : [manualPopupDate];

      for (const dateISO of dates) {
        const id = Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);

        const payload = {
          id,
          date: dateISO,
          label,
          prestation,
          customPrestation: prestationCustom,
          clientName: client,
          address,
          phone,
          email,
          privateNotes,
          notes,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await db.collection("planningManual").doc(id).set(payload, { merge: true });
      }
    }

    closeManualPlanningPopup();

    const elPresta = document.getElementById("planningPopupPrestation");
    const elPrestaCustom = document.getElementById("planningPopupPrestationCustom");
    const elClient = document.getElementById("planningPopupClient");
    const elAddress = document.getElementById("planningPopupAddress");
    const elPhone = document.getElementById("planningPopupPhone");
    const elEmail = document.getElementById("planningPopupEmail");
    const elPrivateNotes = document.getElementById("planningPopupPrivateNotes");
    const elNotes = document.getElementById("planningPopupNotes");
    const elRepeatPerMonth = document.getElementById("planningPopupRepeatPerMonth");
    const elRepeatMonths = document.getElementById("planningPopupRepeatMonths");

    if (elPresta) elPresta.value = "";
    if (elPrestaCustom) elPrestaCustom.value = "";
    if (elClient) elClient.value = "";
    if (elAddress) elAddress.value = "";
    if (elPhone) elPhone.value = "";
    if (elEmail) elEmail.value = "";
    if (elPrivateNotes) elPrivateNotes.value = "";
    if (elNotes) elNotes.value = "";
    if (elRepeatPerMonth) elRepeatPerMonth.value = "0";
    if (elRepeatMonths) elRepeatMonths.value = "6";

  } catch (e) {
    console.error("Erreur enregistrement planning manuel:", e);
    alert("Impossible d’enregistrer l’intervention (vérifie ta connexion).");
  } finally {
    editingManualPlanningId = null;
  }
}

function loadPlanningPrestations() {
  const select = document.getElementById("planningPopupPrestation");
  if (!select) return;

  // On vide d'abord
  select.innerHTML = "";

  // Libellés à exclure
  const excluded = ["produits", "fournitures", "déplacement"];

  // On part des PRESTATION_TEMPLATES
  const list = (PRESTATION_TEMPLATES || [])
    // on ignore le premier modèle "— Choisir un modèle —"
    .filter((t) => t && t.label && t.label !== "— Choisir un modèle —")
    // on exclut Produits / Fournitures / Déplacement
    .filter((t) => !excluded.includes(t.label.toLowerCase()));

  // Option vide par défaut
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "— Choisir une prestation —";
  select.appendChild(defaultOpt);

  // On remplit avec les modèles
  list.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.label;
    opt.textContent = t.label;
    select.appendChild(opt);
  });
}

function toggleManualPlanningDone(manualId, dateStr) {
  const it = (manualPlanningItems || []).find(x => x.id === manualId);
  if (!it) return;

  it.isDone = !it.isDone;
  it.doneAt = it.isDone ? new Date().toISOString() : "";

  upsertManualPlanningItemToFirestore(it).catch(()=>{});

  try { renderPlanningWeek(); } catch(e){}
  try { if (dateStr) openPlanningDayDetails(dateStr); } catch(e){}
}


async function deleteManualPlanningItem(id, dateStr) {
  try {
    if (db) await db.collection("planningManual").doc(id).delete();
    // Pas besoin de render ici : le onSnapshot planningManual va refresh tout.
    // Si tu veux garder le panneau du jour à jour instant :
    if (dateStr) openPlanningDayDetails(dateStr);
  } catch (e) {
    console.error("deleteManualPlanningItem error:", e);
  }
}

async function moveManualPlanningItemToDate(manualId, newDateISO) {
  try {
    // update local (si tu as un tableau en mémoire)
    if (Array.isArray(manualPlanningItems)) {
      const it = manualPlanningItems.find((x) => x.id === manualId);
      if (it) it.date = newDateISO;
    }

    if (!db) return;
    await db.collection("planningManual").doc(manualId).set(
      { date: newDateISO },
      { merge: true }
    );
  } catch (e) {
    console.error("moveManualPlanningItemToDate error:", e);
  }
}





/* =========================================================
   ✅ SOLO MODE : Devis accepté → Action → Planning + Sidebar
   ========================================================= */

function _iso(d){
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth()+1).padStart(2,'0');
  const da = String(x.getDate()).padStart(2,'0');
  return `${y}-${m}-${da}`;
}
function _addDays(d, n){
  const x = new Date(d);
  x.setDate(x.getDate()+n);
  return x;
}
function _nextBusinessDay(d){
  let x = new Date(d);
  x = _addDays(x, 1);
  while (x.getDay() === 0 || x.getDay() === 6) x = _addDays(x, 1);
  return x;
}
function _ensureMeta(doc){
  doc.meta = doc.meta || {};
  return doc.meta;
}
function _toast(title, msg){
  const box = document.getElementById('toastContainer');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="t1">${escapeHtml(title||'')}</div><div class="t2">${escapeHtml(msg||'')}</div>`;
  box.appendChild(el);
  setTimeout(()=>{ try{ el.remove(); }catch(e){} }, 3500);
}

function _createManualItemFromDevis(devis, dateISO, labelPrefix) {
  if (!devis || !dateISO) return null;

  const meta = _ensureMeta(devis);
  manualPlanningItems = manualPlanningItems || [];

  // ✅ Client SAFE (jamais object)
  const client = String(
    getClientText(
      devis.clientName ??
        devis.client?.name ??
        devis.client?.clientName ??
        devis.client ??
        meta.clientName ??
        ""
    ) ?? ""
  ).trim();

  // ✅ TITRE = OBJET du devis (ton "objet" affiché en liste)
  // fallback si vide : 1ère prestation desc
  const firstDesc = Array.isArray(devis.prestations) && devis.prestations[0]?.desc
    ? String(devis.prestations[0].desc).trim()
    : "";

// ✅ TITRE = TITRE DE LA PRESTATION (pas le devis)
const title = String(
  devis.prestations?.[0]?.title ??
  devis.prestations?.[0]?.desc ??
  meta.prestation ??
  ""
).trim();


  // ✅ LABEL = prefix + titre (le GROS du planning)
  const label = `${labelPrefix} ${title}`.trim();

  const address = String(
    devis.address ?? meta.address ?? devis.client?.address ?? ""
  ).trim();

  const phone = String(
    devis.phone ?? meta.phone ?? devis.client?.phone ?? ""
  ).trim();

  const notes = String(devis.notes ?? meta.notes ?? "").trim();

  // ✅ Anti-doublon : si déjà lié à un item, on met à jour + Firestore
  if (meta.planningItemId) {
    const existing = manualPlanningItems.find((x) => x.id === meta.planningItemId);
    if (existing) {
      existing.date = dateISO;
      existing.label = label;          // gros = objet devis
      existing.clientName = client;    // petit = client
      existing.address = address;
      existing.phone = phone;
      existing.notes = notes;
      existing.sourceType = "devis";
      existing.sourceId = devis.id;
      existing.sourceNumber = devis.number || "";

      meta.planningDate = dateISO;

      // ✅ sync Firestore
      try { upsertManualPlanningItemToFirestore(existing).catch(()=>{}); } catch(e){}

      return meta.planningItemId;
    }
  }

  // ✅ Nouveau item
  const itemId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const item = {
    id: itemId,
    date: dateISO,
    label,             // gros (objet devis)
    clientName: client,// petit (client)
    address,
    phone,
    notes,
    sourceType: "devis",
    sourceId: devis.id,
    sourceNumber: devis.number || "",
  };

  // ✅ Firestore d'abord
  try { upsertManualPlanningItemToFirestore(item).catch(()=>{}); } catch(e){}

  manualPlanningItems.push(item);

  meta.planningItemId = itemId;
  meta.planningDate = dateISO;

  return itemId;
}

function sanitizeManualPlanningItems() {
  const docs = JSON.parse(localStorage.getItem("documents") || "[]");
  let changed = false;

  docs.forEach(d => {
    // ❌ Date invalide / objet
    if (d.planningDate && typeof d.planningDate !== "string") {
      delete d.planningDate;
      changed = true;
    }

    // ❌ Mauvais format
    if (typeof d.planningDate === "string" && !isISO(d.planningDate)) {
      delete d.planningDate;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem("documents", JSON.stringify(docs));
    console.log("🧹 Planning nettoyé (dates invalides supprimées)");
  }
}


function removePlanningDuplicates() {
  const seen = new Set();
  const cleaned = [];

  for (const it of manualPlanningItems) {
    const key = [
      it.date || "",
      it.sourceType || "",
      it.sourceId || "",
      (it.label || "").replace(/\s+/g, " ").trim(),
    ].join("|");

    if (seen.has(key)) continue;
    seen.add(key);
    cleaned.push(it);
  }

  if (cleaned.length !== manualPlanningItems.length) {
    manualPlanningItems = cleaned;

  }

  try { renderPlanningWeek(); } catch (e) {}
  try { renderPlanningSidebar(); } catch (e) {}
  console.log("✅ Doublons planning supprimés:", cleaned.length);
}



function maybeOpenDevisAcceptedPlanner(devis){
  if (!devis || devis.type !== 'devis') return;
  if ((devis.status||'') !== 'accepte') return;

  const meta = _ensureMeta(devis);
  // Si déjà une action, on ne re-popup pas
  if (meta.nextAction) return;

  openDevisAcceptedActionPopup(devis.id);
}

function openDevisAcceptedActionPopup(devisId){
  const docs = getAllDocuments();
  const devis = docs.find(d=>d.id===devisId);
  if (!devis) return;

  // kill ancien overlay
  const old = document.getElementById('acceptPlannerOverlay');
  if (old) old.remove();

  const meta = _ensureMeta(devis);
const client = getClientText(devis.clientName || devis.client || meta.clientName).trim() || "Client";

  const overlay = document.createElement('div');
  overlay.id = 'acceptPlannerOverlay';
  overlay.className = 'popup-overlay';

  overlay.innerHTML = `
  <div style="width:min(720px, 100%); max-height:92vh; overflow:auto; background:#fff; border-radius:14px; box-shadow:0 10px 40px rgba(0,0,0,.25); padding:16px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
      <div>
        <div style="font-weight:900; font-size:22px;">✅ Devis accepté</div>
  
      </div>
      <button class="btn btn-secondary" type="button" id="acceptPlannerClose">✖</button>
    </div>

    <div style="margin-top:12px; padding:10px; border:1px solid rgba(0,0,0,.08); border-radius:12px; background:rgba(0,0,0,.02);">
      <div style="font-weight:800;">${escapeHtml(client)}</div>
      ${(() => {
  const p0 = Array.isArray(devis.prestations) ? devis.prestations[0] : null;
  const presta = String(p0?.title ?? p0?.desc ?? meta?.prestation ?? "").trim();
  const num = String(devis.number || devis.id || "").trim();

  // ✅ Affiche la prestation en priorité
  return `
    <div style="opacity:.9; font-size:13px;">
      ${presta ? `Prestation : <strong>${escapeHtml(presta)}</strong>` : `Devis : ${escapeHtml(num)}`}
    </div>
  `;
})()}

    </div>

      <div style="border:1px solid rgba(0,0,0,.08); border-radius:12px; padding:12px;">
        <div style="font-weight:900;">0) 🛒 Commande</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
          <button id="acceptPlannerBtnOrder" class="btn btn-secondary" type="button">🛒 À commander</button>
          <button id="acceptPlannerBtnOrdered" class="btn btn-secondary" type="button">✅ Commande passée</button>
        </div>
      </div>


    <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-top:14px;">


      <div style="border:1px solid rgba(0,0,0,.08); border-radius:12px; padding:12px;">
        <div style="font-weight:900;">1) 📅 Planifier une intervention</div>
        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:10px;">
          <input id="acceptPlannerDate" type="date" style="padding:8px; border-radius:10px; border:1px solid rgba(0,0,0,.2);" />
          <button id="acceptPlannerBtnPlan" class="btn btn-primary" type="button">Ajouter</button>
        </div>
      </div>

      <div style="border:1px solid rgba(0,0,0,.08); border-radius:12px; padding:12px;">
        <div style="font-weight:900;">2) 📦 En attente de réception du matériel</div>
        <div style="margin-top:10px;">
          <button id="acceptPlannerBtnWait" class="btn btn-secondary" type="button">Mettre en attente</button>
        </div>
      </div>

      <div style="border:1px solid rgba(0,0,0,.08); border-radius:12px; padding:12px;">
        <div style="font-weight:900;">3) 📞 À appeler / à caler</div>
        <div style="margin-top:10px;">
          <button id="acceptPlannerBtnCall" class="btn btn-secondary" type="button">Créer "À appeler"</button>
        </div>
      </div>

    </div>
  </div>`;

  document.body.appendChild(overlay);

  // date défaut = prochain jour ouvré
  const d0 = _nextBusinessDay(new Date());
  const dateInput = overlay.querySelector('#acceptPlannerDate');
  if (dateInput) dateInput.value = _iso(d0);

  overlay.querySelector('#acceptPlannerClose')?.addEventListener('click', ()=> overlay.remove());
  overlay.addEventListener('click', (e)=>{ if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#acceptPlannerBtnOrder')?.addEventListener('click', ()=>{
    setDevisOrderState(devisId, "a_commander");
    overlay.remove();
  });

  overlay.querySelector('#acceptPlannerBtnOrdered')?.addEventListener('click', ()=>{
    setDevisOrderState(devisId, "commande_passee");
    overlay.remove();
  });


  overlay.querySelector('#acceptPlannerBtnPlan')?.addEventListener('click', ()=>{
    const dateISO = (overlay.querySelector('#acceptPlannerDate')?.value || _iso(d0));
    _applyNextAction(devisId, 'planifie', dateISO);
    overlay.remove();
  });

  overlay.querySelector('#acceptPlannerBtnWait')?.addEventListener('click', ()=>{
    const dateISO = _iso(_addDays(new Date(), 3)); // simple: J+3
    _applyNextAction(devisId, 'attente_reception', dateISO);
    overlay.remove();
  });

  overlay.querySelector('#acceptPlannerBtnCall')?.addEventListener('click', ()=>{
    const dateISO = _iso(_nextBusinessDay(new Date()));
    _applyNextAction(devisId, 'a_appeler', dateISO);
    overlay.remove();
  });
}


function _applyNextAction(devisId, action, dateISO) {
  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === devisId);
  if (idx === -1) return;

  const devis = docs[idx];
  const meta = _ensureMeta(devis);

  meta.nextAction = action;
  meta.nextActionUpdatedAt = new Date().toISOString();

  // ✅ La grille planning = UNIQUEMENT les RDV planifiés
  const actionUsesDate = (action === "planifie");
  meta.planningDate = actionUsesDate ? (dateISO || "") : "";

  // ✅ Si on quitte "planifie", on enlève du planning (sinon illogique)
  try { _removePlanningItemForDevis(devis); } catch(e) {}

  // ✅ Seul "planifie" crée un item dans la grille
  if (action === "planifie") {
    _createManualItemFromDevis(devis, dateISO, "📅");
  }

  saveDocumentToFirestore(devis).catch(() => {});
  saveDocuments(docs);

  try { renderPlanningWeek(); } catch (e) {}
  try { if (typeof loadDocumentsList === "function") loadDocumentsList(); } catch (e) {}
  try { renderPlanningSidebar(); } catch (e) {}
}

// ===============================
// ✅ COMMANDE (SANS SOUS-MENU)
// ===============================
function setDevisOrderState(devisId, state) {
  const docs = getAllDocuments();
  const idx = docs.findIndex(d => d.id === devisId);
  if (idx === -1) return;

  const d = docs[idx];
  const meta = _ensureMeta(d);

  // state = "" | "a_commander" | "commande_passee"
  meta.orderState = state || "";
  meta.orderUpdatedAt = new Date().toISOString();

  if (meta.orderState === "commande_passee") {
    meta.orderDate = meta.orderDate || new Date().toISOString().slice(0, 10);
  } else {
    meta.orderDate = meta.orderDate || "";
  }

  saveDocuments(docs);
  saveDocumentToFirestore(d).catch(()=>{});

  try { renderPlanningSidebar(); } catch(e){}
  try { if (typeof loadDocumentsList === "function") loadDocumentsList(); } catch(e){}

  _toast("Commande", state ? "Statut commande mis à jour ✅" : "Commande réinitialisée ✅");
}


function _getAcceptedTodos(){
  const docs = getAllDocuments();
const devis = docs
  .filter(d => d.type === 'devis' && (d.status||'') === 'accepte')
  .filter(d => !isContractMaintenanceDevis(d));


  const out = { non_planifie:[], attente_reception:[], a_appeler:[] };

  for (const d of devis){
    const meta = d.meta || {};
    const a = meta.nextAction || 'non_planifie';
    if (a === 'planifie') continue;
    (out[a] || out.non_planifie).push(d);
  }
  return out;
}

function closeDevisAndAutoInvoice(devisId){
  const docs0 = getAllDocuments();
  const devis0 = docs0.find(d => d.id === devisId && d.type === "devis");
  if (!devis0) return;

  // ✅ 1) Ne pas gérer ici les devis d’entretien qui viennent d’un contrat
  if (isContractMaintenanceDevis(devis0)) {
    try { renderPlanningSidebar(); } catch(e){}
    return;
  }

  // ✅ 2) Clôturer le devis (ta logique existante)
  if (typeof setDevisStatus === "function") {
    setDevisStatus(devisId, "cloture");
  }

  // ✅ 3) Eviter doublon facture
  const docs = getAllDocuments();
  const already = docs.find(d => d.type === "facture" && d.sourceDevisId === devisId);
  if (already) {
    try { renderPlanningSidebar(); } catch(e){}
    return;
  }

  // ✅ 4) Créer la facture auto
  const devis = docs.find(d => d.id === devisId && d.type === "devis");
  if (!devis) return;

  const invoice = createInvoiceFromDevis(devis);

  // ✅ 5) Refresh UI
  try { if (typeof refreshHomeStats === "function") refreshHomeStats(); } catch(e){}
  try { if (typeof loadDocumentsList === "function") loadDocumentsList(); } catch(e){}
  try { renderPlanningWeek(); } catch(e){}
  try { renderPlanningSidebar(); } catch(e){}

  // petit log
  console.log("[SIDEBAR] Devis clôturé + facture créée:", invoice?.number);
}



function renderPlanningSidebar(){
  const el = document.getElementById('planningSidebar');
  if (!el) return;

  const todos = _getAcceptedTodos();

const mkItem = (d, actionsHtml) => {
  const meta = d.meta || {};
  const client = getClientText(d.clientName ?? d.client ?? meta.clientName).trim() || "Client";

  const number = d.number || d.id;
  const date = meta.planningDate || "";
  const order = meta.orderState || "";
  const orderTxt =
    order === "a_commander" ? "🛒 À commander" :
    order === "commande_passee" ? "✅ Commande passée" :
    "";

  // ✅ TITRE = PRESTATION (priorité)
  const p0 = Array.isArray(d.prestations) ? d.prestations[0] : null;
  const presta = String(p0?.title ?? p0?.desc ?? meta.prestation ?? "").trim();

  return `
    <div class="todo-item">
      <div class="line1">${escapeHtml(client)}</div>
      <div class="line2">
        ${presta ? escapeHtml(presta) : "Devis: " + escapeHtml(number)}
        ${date ? " • " + escapeHtml(date) : ""}
        ${orderTxt ? ' • <span style="font-weight:800;">' + escapeHtml(orderTxt) + "</span>" : ""}
      </div>
      <div class="todo-actions">${actionsHtml}</div>
    </div>
  `;
};



  const section = (title, list, buildActions) => {
    const items = (list||[]).map(d=>mkItem(d, buildActions(d))).join('')
      || `<div style="opacity:.65; font-size:13px; margin-top:8px;">Rien ici ✅</div>`;
    return `
      <div class="todo-section">
        <div class="todo-title">
          <span>${escapeHtml(title)}</span>
          <span class="todo-badge">${(list||[]).length}</span>
        </div>
        ${items}
      </div>`;
  };

  el.innerHTML = `
    <h3>📅 À plannifier</h3>

    ${section('⚠️ Acceptés mais non planifiés', todos.non_planifie, (d)=>`
      <button class="btn btn-primary" type="button" onclick="openDevisAcceptedActionPopup('${d.id}')">Choisir action</button>
    `)}

    ${section('📦 En attente de réception', todos.attente_reception, (d)=>`
      <button class="btn btn-primary" type="button" onclick="_openPlanDateOnly('${d.id}')">📅 Planifier</button>
<button class="btn btn-secondary" type="button" onclick="closeDevisAndAutoInvoice('${d.id}')">✅ Fait</button>

    `)}

    ${section('📞 À appeler / à caler', todos.a_appeler, (d)=>`
      <button class="btn btn-primary" type="button" onclick="_markCalled('${d.id}')">✅ Appelé</button>
      <button class="btn btn-secondary" type="button" onclick="_openPlanDateOnly('${d.id}')">📅 Planifier</button>
    `)}
  `;
}


function isContractMaintenanceDevis(d){
  if (!d || d.type !== "devis") return false;

  // vient d’un contrat (selon ton modèle)
  const fromContract = !!d.contractId || !!d.meta?.contractId || !!d.sourceContractId;
  if (!fromContract) return false;

  // On détecte entretien piscine/jacuzzi
  const prestations = Array.isArray(d.prestations) ? d.prestations : [];
  const kinds = prestations.map(p => p?.kind).filter(Boolean);

  const isMaintenance =
    kinds.includes("piscine_chlore") ||
    kinds.includes("piscine_sel") ||
    kinds.includes("entretien_jacuzzi") ||
    kinds.includes("entretien_piscine");

  return isMaintenance;
}


function _openPlanDateOnly(devisId){
  const docs = getAllDocuments();
  const devis = docs.find(d=>d.id===devisId);
  if (!devis) return;

  const old = document.getElementById('planDateOnlyOverlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'planDateOnlyOverlay';
  overlay.className = 'popup-overlay';
  overlay.innerHTML = `
  <div style="width:min(520px, 100%); background:#fff; border-radius:14px; box-shadow:0 10px 40px rgba(0,0,0,.25); padding:16px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div style="font-weight:900;">📅 Planifier</div>
      <button class="btn btn-secondary" type="button" id="planDateOnlyClose">✖</button>
    </div>
    <div style="opacity:.75; margin-top:6px;">Choisis une date, terminé.</div>
    <div style="display:flex; gap:10px; align-items:center; margin-top:12px;">
      <input id="planDateOnlyInput" type="date" style="padding:8px; border-radius:10px; border:1px solid rgba(0,0,0,.2);" />
      <button id="planDateOnlyOk" class="btn btn-primary" type="button">OK</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const d0 = _nextBusinessDay(new Date());
  overlay.querySelector('#planDateOnlyInput').value = _iso(d0);

  overlay.querySelector('#planDateOnlyClose')?.addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', (e)=>{ if (e.target===overlay) overlay.remove(); });

  overlay.querySelector('#planDateOnlyOk')?.addEventListener('click', ()=>{
    const dateISO = overlay.querySelector('#planDateOnlyInput')?.value || _iso(d0);
    _applyNextAction(devisId, 'planifie', dateISO);
    overlay.remove();
  });
}

function _markDone(devisId){
  const docs = getAllDocuments();
  const idx = docs.findIndex(d=>d.id===devisId);
  if (idx===-1) return;
  const d = docs[idx];
  const meta=_ensureMeta(d);

  meta.nextAction = 'planifie';
  meta.nextActionUpdatedAt = new Date().toISOString();
  saveDocuments(docs);

  _toast('OK', 'Marqué comme fait ✅');
  try{ renderPlanningWeek(); }catch(e){}
}

function _markCalled(devisId){
  const docs = getAllDocuments();
  const idx = docs.findIndex(d=>d.id===devisId);
  if (idx===-1) return;
  const d = docs[idx];
  const meta=_ensureMeta(d);

  // après "appelé" → on force planification ensuite
  meta.nextAction = 'non_planifie';
  meta.nextActionUpdatedAt = new Date().toISOString();
  saveDocuments(docs);

  _toast('Appel', 'Marqué comme appelé. Maintenant: planifier 📅');
  try{ renderPlanningWeek(); }catch(e){}
}

/* Hook : à chaque rendu planning → refresh sidebar */
if (typeof renderPlanningWeek === 'function') {
  const _oldRenderPlanningWeek = renderPlanningWeek;
  renderPlanningWeek = function(){
    try{ _oldRenderPlanningWeek(); }catch(e){}
    try{ renderPlanningSidebar(); }catch(e){}
  };
}


// ----- LocalStorage contrats -----

function getAllContracts() {
  const raw = localStorage.getItem("contracts");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Données 'contracts' corrompues, reset.", e);
    localStorage.removeItem("contracts");
    return [];
  }
}

function getContract(id) {
  const list = getAllContracts();
  return list.find((c) => c.id === id) || null;
}

function saveContracts(list) {
  localStorage.setItem("contracts", JSON.stringify(list));
}

function createContractFromDevis() {
  // 1) Vérifs de base
  if (!currentDocumentId) {
    showConfirmDialog({
      title: "Aucun devis ouvert",
      message:
        "Ouvre et enregistre d'abord un devis avant de créer un contrat.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️",
    });
    return;
  }

  const devis = getDocument(currentDocumentId);
  if (!devis || devis.type !== "devis") {
    showConfirmDialog({
      title: "Action impossible",
      message: "La création de contrat ne fonctionne qu'à partir d'un devis.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  // 2) Mapping Devis → Client / Site pour le contrat
  const client = {
    civility: devis.client?.civility || "",
    name: devis.client?.name || "",
    address: devis.client?.address || "",
    phone: devis.client?.phone || "",
    email: devis.client?.email || "",
    // On récupère le numéro de devis en référence de contrat (modifiable ensuite)
    reference: devis.number || "",
  };

  const site = {
    civility: devis.siteCivility || "",
    name: devis.siteName || "",
    address: devis.siteAddress || "",
  };

  // 3) Pool par défaut (à ajuster dans le contrat)
  const pool = {
    type: "piscine_chlore", // par défaut, tu pourras changer en sel / spa
    equipment: "",
    volume: "",
    notes: "",
  };

  // 4) Type de client en fonction des conditions du devis
  // devis.conditionsType = "particulier" / "agence"
  const clientType =
    devis.conditionsType === "agence" ? "syndic" : "particulier";

  const todayISO = new Date().toISOString().split("T")[0];

  // 5) Pricing de base : on récupère totals du devis, le reste sera ajusté par le contrat
  const pricing = {
    clientType,
    mainService: "piscine_chlore", // tu pourras changer ensuite
    mode: "standard",
    passHiver: 1,
    passEte: 2,

    startDate: todayISO,
    durationMonths: 12,
    endDateLabel: "",
    periodLabel: "",

    totalPassages: 0,
    unitPrice: 0,

    totalHT: typeof devis.subtotal === "number" ? devis.subtotal : 0,
    tvaRate: typeof devis.tvaRate === "number" ? devis.tvaRate : 0,
    tvaAmount: typeof devis.tvaAmount === "number" ? devis.tvaAmount : 0,
    totalTTC:
      typeof devis.totalTTC === "number"
        ? devis.totalTTC
        : typeof devis.subtotal === "number"
          ? devis.subtotal
          : 0,

    airbnbOption: false,
  };

  // 6) Objet contrat complet
  const contract = {
    id: Date.now().toString(),
    client,
    site,
    pool,
    pricing,
    status: CONTRACT_STATUS.EN_COURS,
    meta: {
      sourceDevisId: devis.id,
      sourceDevisNumber: devis.number || "",
    },
    createdAt: new Date().toISOString(),
  };

  // 7) Bascule UI : onglet Contrats + ouverture du formulaire pré-rempli
  switchListType("contrat");

  const listView = document.getElementById("listView");
  const contractView = document.getElementById("contractView");
  if (listView) listView.classList.add("hidden");
  if (contractView) contractView.classList.remove("hidden");

  fillContractForm(contract);

  showConfirmDialog({
    title: "Contrat préparé",
    message:
      "Un contrat a été pré-rempli à partir de ce devis. Tu peux maintenant ajuster les passages, les dates et enregistrer le contrat.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });
}

function generateDevisFromInvoice(invoice) {
  if (!invoice) return null;

  const now = new Date();
  const nowISO = now.toISOString();
  const todayISO = nowISO.slice(0, 10);

  const number = getNextNumber("devis");

  // Deep copy prestations + normalisation
  const prestations = (invoice.prestations || []).map((p) => {
    const qty = Number(p.qty);
    const price = Number(p.price);
    const total = Number(p.total);

    const safeQty = isFinite(qty) && qty > 0 ? qty : 1;
    const safePrice = isFinite(price) ? price : 0;
    const safeTotal = isFinite(total) ? total : safeQty * safePrice;

    return {
      desc: p.desc || "",
      detail: p.detail || "",
      qty: safeQty,
      price: safePrice,
      total: safeTotal,
      unit: p.unit || "forfait",
      dates: Array.isArray(p.dates) ? [...p.dates] : [],
      kind: p.kind || "",
    };
  });

  // Totaux (si pas présents, on retombe sur 0)
  const tvaRate = Number(invoice.tvaRate);
  const subtotal = Number(invoice.subtotal);
  const discountRate = Number(invoice.discountRate);
  const discountAmount = Number(invoice.discountAmount);
  const tvaAmount = Number(invoice.tvaAmount);
  const totalTTC = Number(invoice.totalTTC);

  const safeTvaRate = isFinite(tvaRate) ? tvaRate : 0;
  const safeSubtotal = isFinite(subtotal) ? subtotal : 0;
  const safeDiscountRate = isFinite(discountRate) ? discountRate : 0;
  const safeDiscountAmount = isFinite(discountAmount) ? discountAmount : 0;
  const safeTvaAmount = isFinite(tvaAmount) ? tvaAmount : 0;
  const safeTotalTTC = isFinite(totalTTC) ? totalTTC : 0;

  const subjectBase = String(invoice.subject || "").trim();
  const subject = subjectBase ? subjectBase : "Devis";

  const devis = {
    id: generateId("DEV"),
    type: "devis",
    number,
    date: todayISO,
    validityDate: invoice.validityDate || "",

    subject,

    client: {
      civility: invoice.client?.civility || "",
      name: invoice.client?.name || "",
      address: invoice.client?.address || "",
      phone: invoice.client?.phone || "",
      email: invoice.client?.email || "",
    },

    siteCivility: invoice.siteCivility || "",
    siteName: invoice.siteName || "",
    siteAddress: invoice.siteAddress || "",

    prestations,

    tvaRate: safeTvaRate,
    subtotal: safeSubtotal,
    discountRate: safeDiscountRate,
    discountAmount: safeDiscountAmount,
    tvaAmount: safeTvaAmount,
    totalTTC: safeTotalTTC,

    notes: invoice.notes || "",

    // Devis = jamais "paid"
    paid: false,
    paymentMode: "",
    paymentDate: "",

    // Statut devis
    status: invoice.status && invoice.type === "devis" ? invoice.status : "",

    // Type client (utile pour règles devis/facture)
    conditionsType: invoice.conditionsType || "particulier",

    // ✅ IMPORTANT : on ne lie PAS à une facture (car on veut éviter le doublon)
    sourceFactureId: null,
    sourceFactureNumber: null,

    // (Optionnel) origine pratique
    source: "invoice_to_devis",

    createdAt: nowISO,
    updatedAt: nowISO,
  };

  return devis;
}


function maybeForceDevisInsteadOfSavingInvoice(invoiceDraft) {
  if (!invoiceDraft) return false;
  if (invoiceDraft.type !== "facture") return false;

  const clientType = String(invoiceDraft.conditionsType || "particulier").trim().toLowerCase();
  const totalTTC = Number(invoiceDraft.totalTTC);

  if (clientType !== "particulier") return false;
  if (!isFinite(totalTTC) || totalTTC < 150) return false;

  showConfirmDialog({
    title: "Devis obligatoire",
    message:
      `Cette intervention dépasse 150 € TTC (particulier).\n\n` +
      `✅ Un devis doit être créé et accepté AVANT de facturer.\n\n` +
      `Créer le devis maintenant ?\n` +
      `(La facture sera générée automatiquement quand le devis sera "Accepté".)`,
    confirmLabel: "Créer le devis",
    cancelLabel: "Annuler",
    variant: "warning",
    icon: "🧾",
    onConfirm: function () {
      const devis = generateDevisFromInvoice(invoiceDraft);
      if (!devis) return;

      // ✅ Important : on NE lie PAS une facture (car elle n'existe pas et on veut éviter doublon)
      devis.sourceFactureId = null;
      devis.sourceFactureNumber = null;

      const all = getAllDocuments();
      all.push(devis);
      saveDocuments(all);

      if (typeof saveSingleDocumentToFirestore === "function") {
        saveSingleDocumentToFirestore(devis);
      }

      // Ouvrir le devis
      if (typeof switchListType === "function") switchListType("devis");
      if (typeof loadDocumentsList === "function") loadDocumentsList();
      if (typeof loadDocument === "function") loadDocument(devis.id);
    },
  });

  // ✅ On bloque la sauvegarde de la facture
  return true;
}





function generateDevisFromContract(contract) {
  if (!contract) return null;

  const c = contract.client || {};
  const s = contract.site || {};
  const p = contract.pool || {};
  const pr = contract.pricing || {};

  const todayISO = new Date().toISOString().slice(0, 10);
  const number = getNextNumber("devis");

  const poolType = pr.mainService || p.type || "";
  const label = getContractLabel(poolType);

  const globalPeriod = formatContractGlobalPeriod(pr);
  const suffixClient = "";

  const subjectBase = globalPeriod
    ? `${label} – saison ${globalPeriod}`
    : label;

  const subject = subjectBase + suffixClient;

  const lineDesc = globalPeriod
    ? `${label} pour la période ${globalPeriod}`
    : label;

  // ----- Données prix venant du contrat -----
  const totalHTContract = Number(pr.totalHT) || 0;
  const tvaRate = Number(pr.tvaRate) || 0;

  const clientType = pr.clientType || "particulier";
  const conditionsType = clientType === "syndic" ? "agence" : "particulier";

  const baseNotesLines =
    clientType === "syndic"
      ? [
          "Règlement à 30 jours fin de mois.",
          "Aucun escompte pour paiement anticipé.",
          "En cas de retard de paiement : pénalités + indemnité forfaitaire de 40 € (art. L441-10 du Code de commerce).",
        ]
      : [
          "Paiement à réception de facture.",
          "Aucun acompte demandé sauf mention contraire.",
          "Aucun escompte pour paiement anticipé.",
        ];

  const notesBase = baseNotesLines
    .concat([
      "Les produits de traitement piscine (chlore choc, sel, produits d’équilibrage, etc.) ne sont pas inclus sauf mention contraire.",
      "Les tarifs des pièces détachées et produits sont susceptibles d’évoluer selon les fournisseurs.",
      "Toute prestation non mentionnée fera l’objet d’un devis complémentaire.",
      "L’entreprise est titulaire d’une assurance responsabilité civile professionnelle.",
    ])
    .join("\n");

  // ===== 1. Prestation principale (entretiens réguliers) =====
  const totalPassages = Number(pr.totalPassages || 0) || 1;
  let unitPrice = Number(pr.unitPrice || 0);

  if (!unitPrice && totalPassages > 0 && totalHTContract > 0) {
    unitPrice = totalHTContract / totalPassages;
  }
  if (!unitPrice) {
    unitPrice = totalHTContract;
  }

  let lineQty = totalPassages;
  let lineTotal = unitPrice * lineQty;

  if (!lineTotal && totalHTContract > 0) {
    lineQty = 1;
    lineTotal = totalHTContract;
    unitPrice = totalHTContract;
  }

  const mainService = pr.mainService || poolType;
  let prestationKind;
  if (mainService === "piscine_sel") {
    prestationKind = "piscine_sel";
  } else if (
    mainService === "spa" ||
    mainService === "spa_jacuzzi" ||
    mainService === "entretien_jacuzzi"
  ) {
    prestationKind = "entretien_jacuzzi";
  } else {
    prestationKind = "piscine_chlore";
  }

  const prestations = [
    {
      desc: lineDesc,
      detail: "",
      qty: lineQty,
      price: unitPrice,
      total: lineTotal,
      unit: "forfait",
      dates: [],
      kind: prestationKind,
    },
  ];

  // ===== 2. Options forfaitaires (remise en service / hivernage) =====
  let optionsExtraTotal = 0;

  const includeOpening = !!pr.includeOpening;
  const includeWinter = !!pr.includeWinter;
  const airbnbOption = !!pr.airbnbOption;

  // Remise en service
  if (includeOpening) {
    const kindOpening =
      mainService === "entretien_jacuzzi" || mainService === "spa_jacuzzi"
        ? "vidange_jacuzzi"
        : "remise_service_piscine";

    const openingPrice = getTarifFromTemplates(kindOpening, clientType) || 0;

    if (openingPrice > 0) {
      prestations.push({
        desc: "Remise en service de la piscine en début de saison",
        detail:
          "Remise en eau, redémarrage de la filtration, équilibrage, traitement choc et contrôle complet du bassin.",
        qty: 1,
        price: openingPrice,
        total: openingPrice,
        unit: "forfait",
        dates: [],
        // 🔴 ICI : on met le *vrai* kind du modèle
        kind: kindOpening,
      });
      optionsExtraTotal += openingPrice;
    }
  }

  // Hivernage
  if (includeWinter) {
    const winterKind = "hivernage_piscine";
    const winterPrice = getTarifFromTemplates(winterKind, clientType) || 0;

    if (winterPrice > 0) {
      prestations.push({
        desc: "Hivernage complet de la piscine",
        detail:
          "Nettoyage, traitement choc, abaissement du niveau d’eau, purge des équipements et sécurisation du bassin.",
        qty: 1,
        price: winterPrice,
        total: winterPrice,
        unit: "forfait",
        dates: [],
        // 🔴 idem, on utilise le kind du modèle
        kind: winterKind,
      });
      optionsExtraTotal += winterPrice;
    }
  }

  // ===== 3. Majoration Airbnb +20 % =====
  let airbnbExtra = 0;
  if (airbnbOption) {
    const baseForAirbnb = lineTotal + optionsExtraTotal;
    airbnbExtra = baseForAirbnb * 0.2;

    if (airbnbExtra > 0.01) {
      prestations.push({
        desc: "Majoration usage location saisonnière / Airbnb (+20%)",
        detail:
          "Fréquence accrue, niveau d’exigence renforcé et nettoyage approfondi après chaque rotation de locataires.",
        qty: 1,
        price: airbnbExtra,
        total: airbnbExtra,
        unit: "forfait",
        dates: [],
        kind: "airbnb_extra",
      });
    }
  }

  // ===== 4. Totaux =====
  const subtotal = prestations.reduce(
    (sum, p) => sum + (Number(p.total) || 0),
    0,
  );
  const tvaAmount = tvaRate > 0 ? subtotal * (tvaRate / 100) : 0;
  const totalTTC = subtotal + tvaAmount;

  const notes =
    notesBase +
    (airbnbOption
      ? "\n\nMajoration 20% appliquée en raison de l’usage en location saisonnière / Airbnb."
      : "");

  // ===== 5. Objet devis final =====
  return {
    id: Date.now().toString(),
    type: "devis",
    number,
    date: todayISO,
    validityDate: "",

    subject,

    // ✅ Facturation (copiée depuis le contrat) — pour affichage PRO dans le devis PDF
    contractId: contract.id || null,
    billingMode: pr.billingMode || "",
    nextInvoiceDate: pr.nextInvoiceDate || "",
    contractStartDate: pr.startDate || "",

    client: {
      civility: c.civility || "",
      name: c.name || "",
      address: c.address || "",
      phone: c.phone || "",
      email: c.email || "",
    },

    siteCivility: s.civility || "",
    siteName: s.name || "",
    siteAddress: s.address || "",

    prestations,

    tvaRate,
    subtotal,
    discountRate: 0,
    discountAmount: 0,
    tvaAmount,
    totalTTC,

    notes,
    paid: false,
    paymentMode: "",
    paymentDate: "",
    status: "",
    conditionsType,

    createdAt: todayISO,
    updatedAt: todayISO,
  };
}

function maybeProposeDevisForContract(contract) {
  if (!contract || !contract.pricing) {
    console.log("[Devis] Pas de pricing sur le contrat, pas de popup.");
    return false;
  }

  const pr = contract.pricing;
  const clientType = pr.clientType || "particulier";

  let totalTTCraw = pr.totalTTC != null ? pr.totalTTC : pr.totalHT;
  if (typeof totalTTCraw === "string") {
    totalTTCraw = totalTTCraw.replace(",", ".");
  }
  const totalTTC = Number(totalTTCraw) || 0;

  console.log(
    "[Devis] maybeProposeDevisForContract → clientType=",
    clientType,
    " totalTTC=",
    totalTTC,
  );

  if (clientType !== "particulier") {
    console.log("[Devis] Client pas particulier → pas de popup.");
    return false;
  }
  if (totalTTC < 150) {
    console.log("[Devis] Total TTC < 150€ → pas de popup.");
    return false;
  }

  const meta = contract.meta || {};
  if (meta.sourceDevisId) {
    console.log(
      "[Devis] Contrat déjà lié au devis",
      meta.sourceDevisNumber,
      "→ pas de popup.",
    );
    return false;
  }

  const message =
    "Ce contrat dépasse 150 € pour un particulier.\n\n" +
    "Un devis est obligatoire.\n\n" +
    "Souhaites-tu créer un devis à partir de ce contrat ?";

  showConfirmDialog({
    title: "Créer un devis ?",
    message,
    confirmLabel: "Créer un devis",
    cancelLabel: "Fermer",
    variant: "warning",
    icon: "🧾",
    onConfirm: function () {
      const devis = generateDevisFromContract(contract);
      if (!devis) return;

      console.log(
        "[Devis] Création du devis depuis contrat",
        contract.id,
        "→",
        devis.number,
      );

      const docs = getAllDocuments();
      docs.push(devis);
      saveDocuments(docs);

      if (typeof saveSingleDocumentToFirestore === "function") {
        saveSingleDocumentToFirestore(devis);
      }

      const allContracts = getAllContracts();
      const idx = allContracts.findIndex((c) => c.id === contract.id);
      if (idx >= 0) {
        const updated = allContracts[idx];
        if (!updated.meta) updated.meta = {};
        updated.meta.sourceDevisId = devis.id;
        updated.meta.sourceDevisNumber = devis.number;

        allContracts[idx] = updated;
        saveContracts(allContracts);

        if (typeof saveSingleContractToFirestore === "function") {
          saveSingleContractToFirestore(updated);
        }
      }

      if (typeof switchListType === "function") switchListType("devis");

      const contractView = document.getElementById("contractView");
      const formView = document.getElementById("formView");
      if (contractView) contractView.classList.add("hidden");
      if (formView) formView.classList.remove("hidden");

      if (typeof loadDocumentsList === "function") loadDocumentsList();
      if (typeof loadDocument === "function") loadDocument(devis.id);
    },
  });

  console.log("[Devis] Popup 'Créer un devis ?' affichée.");
  return true;
}

function getLinkedDevisForContract(contract) {
  if (!contract) return null;
  const meta = contract.meta || {};
  if (!meta.sourceDevisId) return null;

  const docs = getAllDocuments();
  return (
    docs.find((d) => d.type === "devis" && d.id === meta.sourceDevisId) || null
  );
}

function isDevisObligatoireForContract(contract) {
  if (!contract || !contract.pricing) return false;

  const pr = contract.pricing;
  const clientType = pr.clientType || "particulier";

  let totalTTCraw = pr.totalTTC != null ? pr.totalTTC : pr.totalHT;
  if (typeof totalTTCraw === "string") {
    totalTTCraw = totalTTCraw.replace(",", ".");
  }
  const totalTTC = Number(totalTTCraw) || 0;

  return clientType === "particulier" && totalTTC >= 150;
}

function isDevisAcceptedForContract(contract) {
  const devis = getLinkedDevisForContract(contract);
  if (!devis) return false;

  const status = devis.status || "en_attente";
  return status === "accepte" || status === "cloture";
}

function newContract() {
  currentContractId = null;
  // 🧽 on nettoie le bandeau "Contrat lié au devis"
  const banner = document.getElementById("ctDevisBanner");
  if (banner) {
    banner.style.display = "none";
    banner.textContent = "";
  }

  const listView = document.getElementById("listView");
  const contractView = document.getElementById("contractView");
  if (listView) listView.classList.add("hidden");
  if (contractView) contractView.classList.remove("hidden");

  const root = document.getElementById("contractView");
  if (root) {
    root.querySelectorAll("input, textarea, select").forEach((el) => {
      const id = el.id || "";
      if (id === "tvaRate") return;

      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      } else if (el.type !== "button" && el.type !== "submit") {
        el.value = "";
      }
    });
  }

  // Type client par défaut : PARTICULIER
  const ctClientType = document.getElementById("ctClientType");
  if (ctClientType) ctClientType.value = "particulier";

  // 👉 forcer aussi les radios en cohérence
  const ctPartRadio = document.getElementById("ctClientParticulier");
  const ctSynRadio = document.getElementById("ctClientSyndic");
  if (ctPartRadio) ctPartRadio.checked = true;
  if (ctSynRadio) ctSynRadio.checked = false;

  // 👉 et appliquer toute la logique UI (billing modes, section site, etc.)
  updateContractClientType("particulier");

  const ctMode = document.getElementById("ctMode");
  if (ctMode) ctMode.value = "standard";

  const ctPassHiver = document.getElementById("ctPassHiver");
  if (ctPassHiver) ctPassHiver.value = "1";

  const ctPassEte = document.getElementById("ctPassEte");
  if (ctPassEte) ctPassEte.value = "2";

  const ctDuration = document.getElementById("ctDuration");
  if (ctDuration) ctDuration.value = "12";

  const ctPoolType = document.getElementById("ctPoolType");
  if (ctPoolType) ctPoolType.value = "piscine_chlore";

  const ctMainService = document.getElementById("ctMainService");
  if (ctMainService) ctMainService.value = "piscine_chlore";

  const openingEl = document.getElementById("ctIncludeOpening");
  if (openingEl) openingEl.checked = false;

  const winterEl = document.getElementById("ctIncludeWinter");
  if (winterEl) winterEl.checked = false;

  const ctRef = document.getElementById("ctReference");
if (ctRef && typeof getNextContractReference === "function") {
  ctRef.value = getNextContractReference();
}

// --- TVA CONTRAT (micro) ---
const status = getMicroTvaStatus(); // "franchise" ou "obligatoire"
const forcedRate = status === "obligatoire" ? 20 : 0;

// 1️⃣ Applique la TVA (UI + calculs)
if (typeof setTVA === "function") {
  setTVA(forcedRate);
}

// 2️⃣ Force / verrouille selon statut micro
enforceContractMicroTVA(false);

// 🔁 datalist clients
if (typeof refreshClientDatalist === "function") {
  refreshClientDatalist();
  if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();
}


  // 🔢 recalcul du contrat
  if (typeof recomputeContract === "function") {
    recomputeContract();
  }
}


function openContractFromList(id) {
  const contract = getContract(id);
  if (!contract) return;

  const listView = document.getElementById("listView");
  const contractView = document.getElementById("contractView");
  if (listView) listView.classList.add("hidden");
  if (contractView) contractView.classList.remove("hidden");

  // ✅ IMPORTANT : afficher la bonne carte "Santé du document" (contrat)
  showHealthCardForCurrentView("contract");

  fillContractForm(contract);

  // ✅ Mets à jour la santé DU CONTRAT (et pas celle des devis/factures)
  if (typeof refreshDocumentHealthUI === "function") {
    refreshDocumentHealthUI(contract, { target: "contract" });
  }
}


function deleteContractFromList(id) {
  const contracts = getAllContracts();
  const contract = contracts.find((c) => c.id === id);
  if (!contract) return;

  const ref = (contract.client && contract.client.reference) || id;
  const name = (contract.client && contract.client.name) || "Sans nom";

  showConfirmDialog({
    title: "Supprimer le contrat",
    message:
      `Voulez-vous vraiment supprimer le contrat ${ref} pour « ${name} » ?\n\n` +
      `Cette action est définitive.`,
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      const newList = contracts.filter((c) => c.id !== id);
      saveContracts(newList);

      // Si tu synchronises aussi les contrats dans Firestore :
      if (db) {
        db.collection("contracts")
          .doc(id)
          .delete()
          .catch((err) =>
            console.error("Erreur Firestore delete contrat :", err),
          );
      }

      loadContractsList();

      // 🩺 met à jour la « santé » du contrat actuellement ouvert
      if (typeof refreshDocumentHealthUI === "function" && currentContractId) {
        const current = getContract(currentContractId);
        if (current) {
          refreshDocumentHealthUI(current);
        }
      }

      // 📊 met à jour les stats de l’accueil
      if (typeof refreshHomeStats === "function") {
        refreshHomeStats();
      }
    },
  });
}

function openContractPdfFromList(id, previewOnly) {
  const contract = getContract(id);
  if (!contract) return;

  // On remplit le formulaire contrat en arrière-plan
  fillContractForm(contract);

  // On génère le PDF (avec ou sans impression auto)
  openContractPDF(previewOnly);
}

function printContractFromList(id) {
  const contract = getContract(id);
  if (!contract) return;

  fillContractForm(contract);
  openContractPDF(false); // impression directe
}

function previewContractFromList(id) {
  const contract = getContract(id);
  if (!contract) return;

  fillContractForm(contract);
  openContractPDF(true); // aperçu seulement
}
function transformContractFromList(id) {
  const contract = getContract(id);
  if (!contract) return;

  // On charge le contrat dans le formulaire
  fillContractForm(contract);

  // Et on utilise le moteur existant
  transformContractToInvoice();
}

function backToContracts() {
  hideHealthCardsEverywhere();
  const contractView = document.getElementById("contractView");
  const listView = document.getElementById("listView");
  if (contractView) contractView.classList.add("hidden");
  if (listView) listView.classList.remove("hidden");

  switchListType("contrat");
}

// ----- Firestore contrats -----

async function saveSingleContractToFirestore(contract) {
  if (!contract || !contract.id) return;

  if (!db || !navigator.onLine) {
    enqueueSync({
      collection: "contracts",
      action: "set",
      docId: contract.id,
      data: contract,
    });
    return;
  }

  try {
    await db
      .collection("contracts")
      .doc(contract.id)
      .set(contract, { merge: true });
    processSyncQueue();
  } catch (e) {
    console.error("Erreur Firestore (save contract)", e);
  }
}

async function deleteContractFromFirestore(id) {
  if (!id) return;

  // 🔒 Si Firestore pas prêt -> queue secours
  if (!db) {
    enqueueSync({
      collection: "contracts",
      action: "delete",
      docId: id,
    });
    return;
  }

  try {
    // ✅ Firestore gère offline/online avec persistence
    await db.collection("contracts").doc(id).delete();
  } catch (e) {
    console.error("Erreur Firestore (delete contract)", e);

    // 🔁 Secours : on met en queue si ça échoue
    enqueueSync({
      collection: "contracts",
      action: "delete",
      docId: id,
    });
  }
}


async function syncContractsWithFirestore() {
  if (!db) return;

  // ✅ évite d'avoir plusieurs listeners si initFirebase est relancé
  if (unsubContracts) unsubContracts();

  try {
    unsubContracts = db.collection("contracts").onSnapshot(
      (snap) => {
        const cloudContracts = [];
        snap.forEach((doc) => {
          const data = doc.data();
          if (data && data.id) cloudContracts.push(data);
        });

        console.log("[Contracts] Live depuis Firestore :", cloudContracts.length, "contrats");

        // ✅ Firestore = vérité -> on écrase le local
        saveContracts(cloudContracts);

        // ✅ 1) Mets à jour les badges/alertes (même si pas dans l’onglet)
        try { if (typeof updateContractsAlert === "function") updateContractsAlert(); } catch(e) {}

        // ✅ 2) Si l’onglet contrats est ouvert -> recharge la liste
        if (typeof loadContractsList === "function" && currentListType === "contrat") {
          try { loadContractsList(); } catch(e) {}
        }

        // ✅ 3) Home / stats (si tu es sur l’accueil)
        try { if (typeof refreshHomeStats === "function") refreshHomeStats(); } catch(e) {}

        // ✅ 4) Planning (si tes contrats impactent planning / sidebar)
        try { if (typeof renderPlanningWeek === "function") renderPlanningWeek(); } catch(e) {}
        try { if (typeof renderPlanningSidebar === "function") renderPlanningSidebar(); } catch(e) {}

        updateOfflineBadge();
      },
      (e) => {
        console.error("Erreur onSnapshot contrats Firestore :", e);
      }
    );
  } catch (e) {
    console.error("Erreur sync contrats Firestore :", e);
  }
}


// ----- Firestore clients -----

async function saveSingleClientToFirestore(client) {
  if (!client) return;

  const id = client.id || getClientDocId(client);
  client.id = id;

  if (!db || !navigator.onLine) {
    enqueueSync({
      collection: "clients",
      action: "set",
      docId: id,
      data: client,
    });
    return;
  }

  try {
    await db.collection("clients").doc(id).set(client, { merge: true });
    processSyncQueue();
  } catch (e) {
    console.error("Erreur Firestore (save client)", e);
  }
}

async function deleteClientFromFirestore(client) {
  if (!client) return;
  const id = client.id || getClientDocId(client);
  if (!id) return;

  // 🔒 Si Firestore pas prêt -> queue secours
  if (!db) {
    enqueueSync({
      collection: "clients",
      action: "delete",
      docId: id,
    });
    return;
  }

  try {
    // ✅ Firestore gère offline/online avec persistence
    await db.collection("clients").doc(id).delete();
  } catch (e) {
    console.error("Erreur Firestore (delete client)", e);

    // 🔁 Secours : on met en queue si ça échoue
    enqueueSync({
      collection: "clients",
      action: "delete",
      docId: id,
    });
  }
}

async function syncClientsWithFirestore() {
  if (!db) return;

  // ✅ évite les abonnements multiples
  if (unsubClients) unsubClients();

  try {
    unsubClients = db.collection("clients").onSnapshot(
      (snap) => {
        const cloudClients = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.name) cloudClients.push(data);
        });

        console.log(
          "[Clients] Live depuis Firestore :",
          cloudClients.length,
          "clients",
        );

        // ✅ Firestore = vérité → on écrase le local
   // ✅ Firestore = vérité → MAIS on évite d'écraser les notes privées locales par accident
const local = getClients();

cloudClients.forEach((cc) => {
  const match =
    local.find((lc) => lc.id && cc.id && lc.id === cc.id) ||
    local.find((lc) => (lc.name || "").toLowerCase() === (cc.name || "").toLowerCase());

  if (match && (!cc.privateNotes || String(cc.privateNotes).trim() === "")) {
    if (match.privateNotes && String(match.privateNotes).trim() !== "") {
      cc.privateNotes = match.privateNotes;
    }
  }
});

saveClients(cloudClients);


        if (typeof refreshClientDatalist === "function") {
          refreshClientDatalist();
          if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();
        }

        updateOfflineBadge();
      },
      (e) => {
        console.error("Erreur onSnapshot clients Firestore :", e);
      }
    );
  } catch (e) {
    console.error("Erreur sync clients Firestore :", e);
  }
}


// ----- Récupération d'un tarif dans PRESTATION_TEMPLATES -----

function getTarifFromTemplates(kind, clientType) {
  if (!kind) return 0;

  const tpl = PRESTATION_TEMPLATES.find((t) => t.kind === kind);
  if (!tpl) return 0;

  const custom = typeof getCustomPrices === "function" ? getCustomPrices() : {};
  const key = kind + "_" + (clientType === "syndic" ? "syndic" : "particulier");

  if (custom && custom[key] != null) {
    return Number(custom[key]) || 0;
  }

  return clientType === "syndic"
    ? tpl.priceSyndic || 0
    : tpl.priceParticulier || 0;
}

// ----- Prix unitaire pour le contrat (entretien régulier) -----

function getContractUnitPrice() {
  const clientType =
    document.getElementById("ctClientType")?.value || "particulier";
  const mainService =
    document.getElementById("ctMainService")?.value || "piscine_chlore";

  return getTarifFromTemplates(mainService, clientType);
}

// ----- Distribution des mois été / hiver -----

function computeContractMonths(startDateStr, durationMonths) {
  if (!startDateStr || !durationMonths) {
    return { monthsEte: 0, monthsHiver: 0, endDateISO: null };
  }

  const start = new Date(startDateStr + "T00:00:00");
  const end = new Date(start);
  end.setMonth(end.getMonth() + durationMonths);
  end.setDate(end.getDate() - 1); // fin inclusive

  let y = start.getFullYear();
  let m = start.getMonth(); // 0-11

  let monthsEte = 0;
  let monthsHiver = 0;

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const MIN_DAYS = 15; // au moins 15 jours pour compter le mois

  while (
    y < end.getFullYear() ||
    (y === end.getFullYear() && m <= end.getMonth())
  ) {
    const monthStart = new Date(y, m, 1);
    const monthEnd = new Date(y, m + 1, 0);

    const effStart = monthStart < start ? start : monthStart;
    const effEnd = monthEnd > end ? end : monthEnd;

    const days = Math.floor((effEnd - effStart) / ONE_DAY) + 1;

    if (days >= MIN_DAYS) {
      // Mai (4) à Octobre (9) = été
      if (m >= 4 && m <= 9) monthsEte++;
      else monthsHiver++;
    }

    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }

  return {
    monthsEte,
    monthsHiver,
    endDateISO: end.toISOString().slice(0, 10),
  };
}

function computeMonthsEteHiverBetween(startISO, endISO) {
  if (!startISO || !endISO) {
    return { monthsEte: 0, monthsHiver: 0 };
  }

  const start = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { monthsEte: 0, monthsHiver: 0 };
  }

  let y = start.getFullYear();
  let m = start.getMonth(); // 0-11

  let monthsEte = 0;
  let monthsHiver = 0;

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const MIN_DAYS = 15; // au moins 15 jours dans le mois

  while (
    y < end.getFullYear() ||
    (y === end.getFullYear() && m <= end.getMonth())
  ) {
    const monthStart = new Date(y, m, 1);
    const monthEnd = new Date(y, m + 1, 0);

    // chevauchement réel entre le contrat et ce mois
    const effStart = monthStart < start ? start : monthStart;
    const effEnd = monthEnd > end ? end : monthEnd;

    const days = Math.floor((effEnd - effStart) / ONE_DAY) + 1;

    if (days >= MIN_DAYS) {
      // Mai (4) à Octobre (9) = été
      if (m >= 4 && m <= 9) monthsEte++;
      else monthsHiver++;
    }

    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }

  return { monthsEte, monthsHiver };
}

// ----- Recalcul global du contrat -----

function recomputeContract() {
  // 1) Récup des champs
  const modeEl = document.getElementById("ctMode");
  const passHiverEl = document.getElementById("ctPassHiver");
  const passEteEl = document.getElementById("ctPassEte");
  const startDateEl = document.getElementById("ctStartDate");
  const durationEl = document.getElementById("ctDuration");
  const endDateEl = document.getElementById("ctEndDate");
  const periodEl = document.getElementById("ctPeriod");
  const totalPassEl = document.getElementById("ctTotalPassages");
  const recapSummary = document.getElementById("ctRecapSummary");
  const warnBox = document.getElementById("ctWarning");

  if (
    !modeEl ||
    !passHiverEl ||
    !passEteEl ||
    !startDateEl ||
    !durationEl ||
    !totalPassEl
  ) {
    return;
  }

  // 2) Mode entretien
  let mode = modeEl.value || "standard";
  let passHiver = parseInt(passHiverEl.value || "0", 10) || 0;
  let passEte = parseInt(passEteEl.value || "0", 10) || 0;

  if (mode === "standard") {
    passHiver = 1;
    passEte = 2;
    passHiverEl.value = "1";
    passEteEl.value = "2";
  } else if (mode === "intensif") {
    passHiver = 2;
    passEte = 4;
    passHiverEl.value = "2";
    passEteEl.value = "4";
  }

  const startISO = startDateEl.value || "";
  const duration = parseInt(durationEl.value || "0", 10) || 0;

  let monthsEte = 0;
  let monthsHiver = 0;

  // 3) Calcul des mois + date de fin via computeContractMonths()
  let endISO = "";
  if (startISO && duration > 0) {
    const info = computeContractMonths(startISO, duration);
    monthsEte = info.monthsEte;
    monthsHiver = info.monthsHiver;
    endISO = info.endDateISO;

    if (endDateEl) endDateEl.value = endISO;

    if (periodEl) {
      const debutFr = new Date(startISO + "T00:00:00").toLocaleDateString(
        "fr-FR",
      );
      const finFr = new Date(endISO + "T00:00:00").toLocaleDateString("fr-FR");
      periodEl.value = `${debutFr} → ${finFr}`;
    }
  } else {
    if (endDateEl) endDateEl.value = "";
    if (periodEl) periodEl.value = "";
  }

  // 4) Total passages
  const totalPassages = monthsHiver * passHiver + monthsEte * passEte;
  totalPassEl.value = String(totalPassages);

  if (recapSummary) {
    if (monthsEte + monthsHiver === 0 || (passEte === 0 && passHiver === 0)) {
      recapSummary.textContent = "";
    } else {
      const parts = [];
      if (monthsHiver > 0 && passHiver > 0) {
        parts.push(`${monthsHiver} mois hiver × ${passHiver}/mois`);
      }
      if (monthsEte > 0 && passEte > 0) {
        parts.push(`${monthsEte} mois été × ${passEte}/mois`);
      }
      recapSummary.textContent = parts.join(" + ");
    }
  }

  // 5) Warnings
  if (warnBox) {
    const warnings = [];
    if (!startISO || !duration) {
      warnings.push(
        "Merci de renseigner une date de début et une durée de contrat.",
      );
    } else {
      if (monthsEte === 0 && passEte > 0) {
        warnings.push(
          "La période ne contient aucun mois d’été alors que des passages d’été sont définis.",
        );
      }
      if (monthsHiver === 0 && passHiver > 0) {
        warnings.push(
          "La période ne contient aucun mois d’hiver alors que des passages d’hiver sont définis.",
        );
      }
      if (totalPassages === 0 && (passHiver > 0 || passEte > 0)) {
        warnings.push(
          "Avec ces paramètres, le total de passages calculé est de 0. Vérifie la date de début, la durée et la fréquence.",
        );
      }
    }

    if (warnings.length > 0) {
      warnBox.innerHTML =
        `<span style="font-size:18px;line-height:1;">⚠️</span>` +
        `<div><strong>Attention à la configuration du contrat :</strong><br>${warnings.join("<br>")}</div>`;
      warnBox.classList.remove("hidden");
    } else {
      warnBox.classList.add("hidden");
      warnBox.innerHTML = "";
    }
  }

  // 6) Calcul prix (inchangé)
  const clientType =
    document.getElementById("ctClientType")?.value || "particulier";
  const mainService =
    document.getElementById("ctMainService")?.value || "piscine_chlore";
  const includeOpen =
    document.getElementById("ctIncludeOpening")?.checked || false;
  const includeWinter =
    document.getElementById("ctIncludeWinter")?.checked || false;
  const airbnbOption = document.getElementById("ctAirbnb")?.checked || false;

  const unitPrice = getTarifFromTemplates(mainService, clientType) || 0;

  let extra = 0;
  if (includeOpen) {
    const kindOpening =
      mainService === "entretien_jacuzzi" || mainService === "spa_jacuzzi"
        ? "vidange_jacuzzi"
        : "remise_service_piscine";
    extra += getTarifFromTemplates(kindOpening, clientType) || 0;
  }
  if (includeWinter) {
    extra += getTarifFromTemplates("hivernage_piscine", clientType) || 0;
  }

  let totalHT = totalPassages * unitPrice + extra;
  let airbnbExtra = 0;
  if (airbnbOption && totalHT > 0) {
    airbnbExtra = totalHT * 0.2;
    totalHT += airbnbExtra;
  }

  const tvaRateInput = document.getElementById("tvaRate");
  const tvaRate = tvaRateInput
    ? parseFloat(String(tvaRateInput.value).replace(",", ".")) || 0
    : 0;

  const tvaAmount = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + tvaAmount;

  const unitInput = document.getElementById("ctUnitPrice");
  const totalHTInput = document.getElementById("ctTotalHT");
  const recapPass = document.getElementById("ctRecapPassages");
  const recapPrice = document.getElementById("ctRecapPrice");
  const recapTotal = document.getElementById("ctRecapTotal");

  const format =
    typeof formatEuro === "function"
      ? formatEuro
      : (v) => (v.toFixed ? v.toFixed(2) + " €" : v + " €");

  if (unitInput) unitInput.value = unitPrice ? format(unitPrice) : "0,00 €";
  if (totalHTInput) totalHTInput.value = format(totalHT);
  if (recapPass) recapPass.textContent = totalPassages.toString();
  if (recapPrice)
    recapPrice.textContent = unitPrice ? format(unitPrice) : "0,00 €";

  let labelAmount = "";
  let displayAmount = 0;
  if (tvaRate === 0) {
    displayAmount = totalHT;
    labelAmount = clientType === "syndic" ? "Montant HT" : "Net à payer";
  } else {
    displayAmount = totalTTC;
    labelAmount = "Montant TTC";
  }

  if (recapTotal) {
    let txt = labelAmount + " : " + format(displayAmount);
    if (airbnbOption && airbnbExtra > 0) {
      txt += " (dont majoration Airbnb : " + format(airbnbExtra) + ")";
    }
    recapTotal.textContent = txt;
  }
}

// ----- Construction d'un objet contrat depuis le formulaire -----

function buildContractFromForm(showErrors) {
  const clientName = (
    document.getElementById("ctClientName")?.value || ""
  ).trim();
  const clientAddress = (
    document.getElementById("ctClientAddress")?.value || ""
  ).trim();

  if (showErrors && (!clientName || !clientAddress)) {
    showConfirmDialog({
      title: "Infos client manquantes",
      message: "Merci de renseigner au minimum le nom et l'adresse du client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return null;
  }
  // Type de client obligatoire (Particulier / Syndic)
  const clientTypeHiddenEl = document.getElementById("ctClientType");
  const clientTypeValue = (clientTypeHiddenEl?.value || "").trim();

  if (showErrors && !clientTypeValue) {
    showConfirmDialog({
      title: "Type de client manquant",
      message:
        "Merci de sélectionner un type de client (Particulier ou Syndic / Agence).",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return null;
  }

  const client = {
    civility: (document.getElementById("ctClientCivility")?.value || "").trim(),
    name: clientName,
    address: clientAddress,
    phone: (document.getElementById("ctClientPhone")?.value || "").trim(),
    email: (document.getElementById("ctClientEmail")?.value || "").trim(),
    reference: (document.getElementById("ctReference")?.value || "").trim(),
  };

  const site = {
    civility: (document.getElementById("ctSiteCivility")?.value || "").trim(),
    name: (document.getElementById("ctSiteName")?.value || "").trim(),
    address: (document.getElementById("ctSiteAddress")?.value || "").trim(),
  };

  const pool = {
    type: (document.getElementById("ctPoolType")?.value || "").trim(),
    equipment: (document.getElementById("ctEquipment")?.value || "").trim(),
    volume: (document.getElementById("ctVolume")?.value || "").trim(),
    notes: (document.getElementById("ctNotes")?.value || "").trim(),
  };

  const startDate = (
    document.getElementById("ctStartDate")?.value || ""
  ).trim();
  const duration =
    parseInt(document.getElementById("ctDuration")?.value || "0", 10) || 0;

  const totalPassagesStr = (
    document.getElementById("ctTotalPassages")?.value || "0"
  ).trim();
  const totalPassages = parseInt(totalPassagesStr || "0", 10) || 0;

  // Reprendre les valeurs numériques des champs formatés
  const unitPriceStr = (document.getElementById("ctUnitPrice")?.value || "0")
    .replace(/\s|€|€/g, "")
    .replace(",", ".");
  const totalHTStr = (document.getElementById("ctTotalHT")?.value || "0")
    .replace(/\s|€|€/g, "")
    .replace(",", ".");

  // 🚫 Blocage TVA micro pour CONTRAT
  if (!enforceContractMicroTVA()) {
    return; // ❌ on empêche la sauvegarde du contrat
  }

  // TVA pour le contrat (on lit le même champ que devis/factures)
  const tvaRateInput = document.getElementById("tvaRate");
  const tvaRate = tvaRateInput ? parseFloat(tvaRateInput.value) || 0 : 0;
  const totalHTNum = parseFloat(totalHTStr) || 0;
  const tvaAmount = totalHTNum * (tvaRate / 100);
  const totalTTC = totalHTNum + tvaAmount;

  const pricing = {
    clientType: clientTypeValue || "particulier",

    mainService: (
      document.getElementById("ctMainService")?.value || "piscine_chlore"
    ).trim(),
    mode: (document.getElementById("ctMode")?.value || "standard").trim(),
    passHiver:
      parseInt(document.getElementById("ctPassHiver")?.value || "0", 10) || 0,
    passEte:
      parseInt(document.getElementById("ctPassEte")?.value || "0", 10) || 0,
    startDate,
    durationMonths: duration,
    endDateLabel: (document.getElementById("ctEndDate")?.value || "").trim(),
    periodLabel: (document.getElementById("ctPeriod")?.value || "").trim(),
    totalPassages,
    unitPrice: parseFloat(unitPriceStr) || 0,
    totalHT: totalHTNum,
    tvaRate,
    tvaAmount,
    totalTTC,

    // 🔹 NOUVEAUX CHAMPS FACTURATION

    billingMode: document.getElementById("ctBillingMode")?.value || "annuel",
    nextInvoiceDate: "",

    // ---------- Options forfaitaires ----------

    includeOpening:
      document.getElementById("ctIncludeOpening")?.checked || false,
    includeWinter: document.getElementById("ctIncludeWinter")?.checked || false,

    // ---------- Usage Airbnb ----------

    airbnbOption: document.getElementById("ctAirbnb")?.checked || false,
  };

  // On récupère l'existant si on édite un contrat déjà sauvegardé

  let existing = null;
  if (currentContractId) {
    existing = getContract(currentContractId);
  }

  const contract = {
    id: currentContractId || Date.now().toString(),
    client,
    site,
    pool,
    pricing,
    // on garde status/meta si ça existe déjà
    status: existing?.status || null,
    meta: existing?.meta || {},
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  return contract;
}

// ----- Remplir le formulaire depuis un contrat -----

function fillContractForm(contract) {
  if (!contract) return;

  currentContractId = contract.id;

  const c = contract.client || {};
  const s = contract.site || {};
  const p = contract.pool || {};
  const pr = contract.pricing || {};
  const meta = contract.meta || {};

  // ---------- 1. CLIENT ----------
  const ctClientCiv = document.getElementById("ctClientCivility");
  if (ctClientCiv) ctClientCiv.value = c.civility || "";

  const ctClientName = document.getElementById("ctClientName");
  if (ctClientName) ctClientName.value = c.name || "";

  const ctClientAddress = document.getElementById("ctClientAddress");
  if (ctClientAddress) ctClientAddress.value = c.address || "";

  const ctClientPhone = document.getElementById("ctClientPhone");
  if (ctClientPhone) ctClientPhone.value = c.phone || "";

  const ctClientEmail = document.getElementById("ctClientEmail");
  if (ctClientEmail) ctClientEmail.value = c.email || "";

  const ctRef = document.getElementById("ctReference");
  if (ctRef) ctRef.value = c.reference || "";

  // ---------- 2. LIEU ----------
  const ctSiteCiv = document.getElementById("ctSiteCivility");
  if (ctSiteCiv) ctSiteCiv.value = s.civility || "";

  const ctSiteName = document.getElementById("ctSiteName");
  if (ctSiteName) ctSiteName.value = s.name || "";

  const ctSiteAddress = document.getElementById("ctSiteAddress");
  if (ctSiteAddress) ctSiteAddress.value = s.address || "";

  // ---------- 3. BASSIN ----------
  const ctPoolType = document.getElementById("ctPoolType");
  if (ctPoolType) ctPoolType.value = p.type || "piscine_chlore";

  const ctEquip = document.getElementById("ctEquipment");
  if (ctEquip) ctEquip.value = p.equipment || "";

  const ctVolume = document.getElementById("ctVolume");
  if (ctVolume) ctVolume.value = p.volume || "";

  const ctNotes = document.getElementById("ctNotes");
  if (ctNotes) ctNotes.value = p.notes || "";

  // ---------- 4. TYPE CLIENT ----------
  const ctHiddenType = document.getElementById("ctClientType");
  const ctPartRadio = document.getElementById("ctClientParticulier");
  const ctSynRadio = document.getElementById("ctClientSyndic");

  const type = pr.clientType === "syndic" ? "syndic" : "particulier";

  if (ctHiddenType) ctHiddenType.value = type;
  if (type === "syndic" && ctSynRadio) {
    ctSynRadio.checked = true;
  } else if (ctPartRadio) {
    ctPartRadio.checked = true;
  }

  // 🔁 Restituer le mode de facturation enregistré
  const ctBillingMode = document.getElementById("ctBillingMode");
  if (ctBillingMode && pr.billingMode) {
    ctBillingMode.value = pr.billingMode;
  }

  // Met à jour l’UI selon le type (désactivation des modes interdits, etc.)
  updateContractClientType(type);

  // ---------- 5. FRÉQUENCE & DATES ----------
  const ctMode = document.getElementById("ctMode");
  if (ctMode) ctMode.value = pr.mode || "standard";

  const ctPassHiver = document.getElementById("ctPassHiver");
  if (ctPassHiver) {
    const valH = pr.passHiver != null ? pr.passHiver : 1;
    ctPassHiver.value = String(valH) || "1";
  }

  const ctPassEte = document.getElementById("ctPassEte");
  if (ctPassEte) {
    const valE = pr.passEte != null ? pr.passEte : 2;
    ctPassEte.value = String(valE) || "2";
  }

  const ctStartDate = document.getElementById("ctStartDate");
  if (ctStartDate) ctStartDate.value = pr.startDate || "";

  const ctDuration = document.getElementById("ctDuration");
  if (ctDuration) {
    const dur = pr.durationMonths || 12;
    ctDuration.value = String(dur) || "12";
  }

  const ctEndDate = document.getElementById("ctEndDate");
  if (ctEndDate) ctEndDate.value = pr.endDateLabel || "";

  const ctPeriod = document.getElementById("ctPeriod");
  if (ctPeriod) ctPeriod.value = pr.periodLabel || "";

  const ctTotalPass = document.getElementById("ctTotalPassages");
  if (ctTotalPass) {
    ctTotalPass.value =
      pr.totalPassages != null ? String(pr.totalPassages) : "0";
  }

  // ---------- 6. OPTIONS ----------
  const openingEl = document.getElementById("ctIncludeOpening");
  if (openingEl) openingEl.checked = !!pr.includeOpening;

  const winterEl = document.getElementById("ctIncludeWinter");
  if (winterEl) winterEl.checked = !!pr.includeWinter;

  const airbnbEl = document.getElementById("ctAirbnb");
  if (airbnbEl) airbnbEl.checked = !!pr.airbnbOption;
  
// ---------- 7. TVA ----------

  const status = getMicroTvaStatus(); // "franchise" ou "obligatoire"

  // TVA sauvegardée dans le contrat (si présente)
  const savedRate =
    typeof pr.tvaRate === "number" ? Number(pr.tvaRate) : 0;

  // 🔒 Règle micro : franchise => 0 ; obligatoire => 20
  const forcedRate = status === "obligatoire" ? 20 : 0;

  // Si micro oblige, on force 20. Sinon on garde la TVA du contrat (normalement 0).
  const finalRate = status === "obligatoire" ? forcedRate : savedRate;

  // ✅ toujours passer par setTVA (met à jour UI + notes + totaux)
  if (typeof setTVA === "function") {
    setTVA(finalRate);
  }

  // ✅ synchroniser les radios du contrat
  const ct0 = document.getElementById("ctTva0");
  const ct20 = document.getElementById("ctTva20");
  if (ct0 && ct20) {
    ct0.checked = finalRate === 0;
    ct20.checked = finalRate === 20;
  }

  // 🔒 garde-fou (empêche 20 si franchise)
  enforceContractMicroTVA(false);


// ---------- 8. BANDEAU DEVIS LIÉ (COULEUR) ----------
  let linkedDevis = null;
  if (typeof getAllDocuments === "function" && meta.sourceDevisId) {
    const docs = getAllDocuments();
    linkedDevis = docs.find((d) => d.id === meta.sourceDevisId) || null;
  }
  updateCtDevisBanner(linkedDevis, meta);

  // ---------- 9. PRIX ----------
  const unitInput = document.getElementById("ctUnitPrice");
  const totalHTInp = document.getElementById("ctTotalHT");

  if (unitInput) {
    unitInput.value = pr.unitPrice != null ? pr.unitPrice : "";
  }
  if (totalHTInp) {
    totalHTInp.value = pr.totalHT != null ? pr.totalHT : "";
  }

  // ---------- 10. Type de bassin -> prestation ----------
  const ctMainService = document.getElementById("ctMainService");
  const ctPoolTypeEl = document.getElementById("ctPoolType");
  if (ctPoolTypeEl && ctMainService) {
    ctPoolTypeEl.dispatchEvent(new Event("change"));
  }

  // ---------- 11. Recalcul complet ----------
  if (typeof recomputeContract === "function") {
    recomputeContract();
  }

  // ---------- 12. Mise à jour bouton "Facturer" ----------
  if (typeof updateContractTransformButtonVisibility === "function") {
    updateContractTransformButtonVisibility();
  }

  // ---------- 13. STATUT CONTRAT (lié au devis) ----------

const ctStatus = document.getElementById("ctStatus");
if (ctStatus) {
  const meta = contract.meta || {};

  let statusCode = (
    meta.sourceDevisStatus ||
    meta.devisStatus ||
    contract.status ||
    ""
  ).toLowerCase();

  let displayStatus = "En attente";

  // 🧭 1) Statut manuel prioritaire (AFFICHAGE UNIQUEMENT)
  const manual = meta.manualStatus || "";
  if (manual === "pending_signature") {
    displayStatus = "En attente signature";
  } else if (manual === "in_progress") {
    displayStatus = "En cours";
  } else {
    // 🧠 2) Sinon, logique auto actuelle
    const isSigned = isContractSigned(contract);

    if (!isSigned) {
      displayStatus = "En attente signature";
    } else {
      if (statusCode === "accepte" || statusCode === "accepted") {
        displayStatus = "En cours";
      } else if (
        statusCode === "refuse" ||
        statusCode === "refused" ||
        statusCode === "expire" ||
        statusCode === "expired"
      ) {
        displayStatus = "Non validé";
      } else {
        displayStatus = "En attente";
      }
    }
  }

  ctStatus.textContent = displayStatus;
}

// ✅ Synchroniser le select manuel (hors du bloc ctStatus, mais dans fillContractForm)
const ctManual = document.getElementById("ctManualStatus");
if (ctManual) {
  ctManual.value = contract.meta?.manualStatus || "";
}

  }


/* ============================================================
   BANDEAU COULEUR POUR CONTRAT LIÉ AU DEVIS
   (mêmes couleurs que les badges devis)
============================================================ */
function updateCtDevisBanner(devis, metaFallback) {
  const banner = document.getElementById("ctDevisBanner");
  if (!banner) return;

  metaFallback = metaFallback || {};

  // ----- Numéro & statut -----
  let number = "";
  let statusCode = "";

  if (devis) {
    number = devis.number || "";
    statusCode = devis.status || "";
  } else {
    number = metaFallback.sourceDevisNumber || "";
    statusCode =
      metaFallback.sourceDevisStatus || metaFallback.devisStatus || "";
  }

  // Pas de devis → rien à afficher
  if (!number) {
    banner.style.display = "none";
    banner.textContent = "";
    return;
  }

  const norm = (statusCode || "").toLowerCase();

  let bg, color, border, label;

  if (norm === "accepted" || norm === "accepte") {
    bg = "#E8F7E8";
    color = "#1E7C1E";
    border = "#3CB43C";
    label = "Accepté";
  } else if (norm === "closed" || norm === "cloture") {
    bg = "#E0E0E0";
    color = "#424242";
    border = "#BDBDBD";
    label = "Clôturé";
  } else if (norm === "refused" || norm === "refuse") {
    bg = "#FFE5E5";
    color = "#C62828";
    border = "#E57373";
    label = "Refusé";
  } else if (norm === "expired" || norm === "expire") {
    bg = "#FFECD9";
    color = "#E67E22";
    border = "#FFB56A";
    label = "Expiré";
  } else {
    // En attente / inconnu
    bg = "#FFF6D8";
    color = "#8E6C00";
    border = "#EBCB66";
    label = "En attente";
  }

  banner.style.display = "block";
  banner.style.background = bg;
  banner.style.borderLeft = `4px solid ${border}`;
  banner.style.color = color;

  banner.textContent = `Contrat lié au devis ${number} (${label})`;
}

function capitalizeStatus(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function rebuildContractInvoices(contract) {
  const pr = contract.pricing || {};
  let docs = getAllDocuments();
  const todayISO = new Date().toISOString().slice(0, 10);
  const todayObj = new Date(todayISO + "T00:00:00");

  // Nombre d'échéances prévues au total
  const totalInstallments = getNumberOfInstallments(pr);

  // 1️⃣ Supprimer toutes les factures liées à ce contrat
  docs = docs.filter((doc) => doc.contractId !== contract.id);

  // 2️⃣ Réinitialiser la prochaine échéance
  pr.nextInvoiceDate = "";

  // Compteur de factures d'échéance déjà créées
  let installmentsCount = 0;

  // 3️⃣ Re-créer la facture initiale (PARTICULIER uniquement)
  const immediate = generateImmediateBilling(contract);
  if (immediate) {
    docs.push(immediate);
    if (typeof saveSingleDocumentToFirestore === "function") {
      saveSingleDocumentToFirestore(immediate);
    }
    installmentsCount = 1;
    saveDocuments(docs);
  }

  // 4️⃣ Calculer la 1re prochaine échéance (particulier + syndic)
  pr.nextInvoiceDate = computeNextInvoiceDate(contract);

  // 5️⃣ Rattraper toutes les échéances manquantes jusqu'à aujourd'hui
  while (pr.nextInvoiceDate && installmentsCount < totalInstallments) {
    const nextISO = pr.nextInvoiceDate;
    const nextDate = new Date(nextISO + "T00:00:00");

    // stop si date invalide ou dans le futur
    if (isNaN(nextDate.getTime()) || nextDate > todayObj) {
      break;
    }

    const inv = createAutomaticInvoice(contract);

    // si createAutomaticInvoice refuse (anti-doublon), on évite boucle infinie
    if (!inv) {
      const newNext = computeNextInvoiceDate(contract) || "";
      if (!newNext || newNext === pr.nextInvoiceDate) break;
      pr.nextInvoiceDate = newNext;
      continue;
    }

    // On force la date de la facture à la vraie échéance
    inv.date = nextISO;

    docs.push(inv);

    if (typeof saveSingleDocumentToFirestore === "function") {
      saveSingleDocumentToFirestore(inv);
    }

    // Important : sauvegarde pour que numérotation + compteur voient la nouvelle facture
    saveDocuments(docs);

    installmentsCount++;

    // Recalcul de la prochaine échéance après cette facture
    const newNext = computeNextInvoiceDate(contract) || "";

    // Sécurité anti-boucle infinie : si la date ne bouge pas, on stop
    if (!newNext || newNext === pr.nextInvoiceDate) {
      pr.nextInvoiceDate = "";
      break;
    }

    pr.nextInvoiceDate = newNext;
  }

  // 6️⃣ Sauvegarde finale des documents & du contrat
  saveDocuments(docs);

  contract.pricing = pr;

  const allContracts = getAllContracts().map((c) =>
    c.id === contract.id ? contract : c
  );
  saveContracts(allContracts);

  // 7️⃣ Mise à jour du bouton "Facturer ce contrat"
  if (typeof updateContractTransformButtonVisibility === "function") {
    updateContractTransformButtonVisibility();
  }

  return true;
}


function updateContractTransformButtonVisibility() {
  const btnTop = document.getElementById("contractTransformButtonTop");
  const btnBottom = document.getElementById("contractTransformButtonBottom");
  const visible = !!currentContractId;

  if (btnTop) {
    btnTop.style.display = visible ? "inline-block" : "none";
  }
  if (btnBottom) {
    btnBottom.style.display = visible ? "inline-block" : "none";
  }
}

// ----- Sauvegarde -----

function saveContract() {
  // 🔒 Vérification des champs obligatoires
  const startDateEl = document.getElementById("ctStartDate");
  const billingModeEl = document.getElementById("ctBillingMode");

  if (!startDateEl.value) {
    showConfirmDialog({
      title: "Champ manquant",
      message: "Veuillez renseigner la date de début du contrat.",
      confirmLabel: "OK",
      variant: "error",
      icon: "⚠️",
    });
    return;
  }

  if (!billingModeEl.value) {
    showConfirmDialog({
      title: "Mode de facturation manquant",
      message: "Merci de sélectionner un mode de facturation.",
      confirmLabel: "OK",
      variant: "error",
      icon: "⚠️",
    });
    return;
  }

  // 1️⃣ Recalcul préalable (passages, total, labels)
  recomputeContract();

  // 2️⃣ Construction complète depuis le formulaire
  let contract = buildContractFromForm(true);
  if (!contract) return;

  // Sécurité supplémentaire modes client
  const pr = contract.pricing || {};
  if (pr.clientType === "particulier") {
    if (!["mensuel", "annuel_50_50"].includes(pr.billingMode)) {
      pr.billingMode = "mensuel";
    }
  }
  if (pr.clientType === "syndic") {
    if (
      !["mensuel", "trimestriel", "semestriel", "annuel"].includes(
        pr.billingMode,
      )
    ) {
      pr.billingMode = "annuel";
    }
  }

  if (pr.clientType === "syndic") {
    if (
      !["mensuel", "trimestriel", "semestriel", "annuel"].includes(
        pr.billingMode,
      )
    ) {
      pr.billingMode = "annuel";
    }
  }

  // 3️⃣ Normalisation du contrat (statut, meta, etc.)
  contract = normalizeContractBeforeSave(contract);

  const list = getAllContracts();
  const idx = list.findIndex((c) => c.id === contract.id);

  const isNew = idx === -1;

  // 4️⃣ Insert ou update local
  if (isNew) {
    list.push(contract);
  } else {
    list[idx] = contract;
  }

  saveContracts(list);

  // 5️⃣ Sauvegarde Firestore
  if (typeof saveSingleContractToFirestore === "function") {
    saveSingleContractToFirestore(contract);
  }

  currentContractId = contract.id;

  // -----------------------------------------------------
  // 🔵 FACTURATION & DEVIS OBLIGATOIRE
  // -----------------------------------------------------

  // ⚠️ pr est DÉJÀ défini plus haut dans saveContract()
  // on ne le redéclare pas ici, on se contente de lire clientType
  const clientType =
    (contract.pricing && contract.pricing.clientType) || "particulier";
  const devisNeeded = isDevisObligatoireForContract(contract);
  const devisOK = isDevisAcceptedForContract(contract);
  const linkedDevis = getLinkedDevisForContract(contract);

  // ️⛔ Cas 1 : devis OBLIGATOIRE mais PAS encore accepté
  if (devisNeeded && !devisOK) {
    const devisNum = linkedDevis ? linkedDevis.number : null;

    let msg;
    if (linkedDevis && devisNum) {
      msg =
        `Le devis ${devisNum} est obligatoire pour ce contrat ` +
        `et n’est pas marqué comme "Accepté".\n\n` +
        `Le contrat a été enregistré, mais aucune facture ne sera générée tant que ce devis n’aura pas été accepté.`;
    } else {
      msg =
        `Ce contrat dépasse 150 € TTC pour un particulier.\n\n` +
        `Un devis est obligatoire avant toute facturation.\n\n` +
        `Le contrat a été enregistré, mais aucune facture ne sera générée tant qu’un devis n’aura pas été créé puis accepté.`;
    }

    showConfirmDialog({
      title: "Devis obligatoire non accepté",
      message: msg,
      confirmLabel: linkedDevis ? "Ouvrir le devis" : "Créer un devis",
      cancelLabel: "OK",
      variant: "warning",
      icon: "🧾",
      onConfirm: function () {
        // 👉 S'il y a déjà un devis lié : on l'ouvre
        if (linkedDevis) {
          if (typeof switchListType === "function") {
            switchListType("devis");
          }

          const contractView = document.getElementById("contractView");
          const formView = document.getElementById("formView");
          if (contractView) contractView.classList.add("hidden");
          if (formView) formView.classList.remove("hidden");

          if (typeof loadDocumentsList === "function") {
            loadDocumentsList();
          }
          if (typeof loadDocument === "function") {
            loadDocument(linkedDevis.id);
          }
        } else {
          // 👉 Sinon : on crée un devis pré-rempli à partir du contrat
          if (typeof createDevisFromCurrentContract === "function") {
            createDevisFromCurrentContract();
          } else if (typeof maybeProposeDevisForContract === "function") {
            // fallback si jamais tu renommes la fonction
            maybeProposeDevisForContract(contract);
          }
        }
      },
    });

    // ❗Important : pas de facturation tant que devis pas accepté
    return;
  }

  // ✅ Cas 2 : Pas de devis obligatoire OU devis déjà accepté

  // ✅ VERROU : pas de facturation tant que le contrat n'est pas signé
  const isSigned = isContractSigned(contract);


  if (!isSigned) {
    // On neutralise l’échéancier tant que pas signé
    contract.pricing.nextInvoiceDate = "";

    // Re-sauvegarde (local + firestore) pour être sûr que nextInvoiceDate reste vide
    saveContracts(list);
    if (typeof saveSingleContractToFirestore === "function") {
      saveSingleContractToFirestore(contract);
    }

    showConfirmDialog({
      title: "Contrat enregistré",
      message:
        "Contrat enregistré ✅\n\n" +
        "⛔ Aucune facture ne sera générée tant que le client n’a pas signé (Bon pour accord).",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "✍️",
    });

    // On sort : surtout ne pas générer / rebuild / rattraper
    return;
  }

  // ✅ À partir d’ici : contrat signé → on peut facturer
  if (isNew) {
    // 1️⃣ Facture initiale (PARTICULIER uniquement)
    const invoice = generateImmediateBilling(contract);

    if (invoice) {
      const docs = getAllDocuments();
      docs.push(invoice);
      saveDocuments(docs);

      if (typeof saveSingleDocumentToFirestore === "function") {
        saveSingleDocumentToFirestore(invoice);
      }
    }

    // 2️⃣ Définition de la première échéance (particulier + syndic)
    contract.pricing.nextInvoiceDate = computeNextInvoiceDate(contract) || "";

    // 3️⃣ Re-sauvegarde du contrat mis à jour
    saveContracts(list);
    if (typeof saveSingleContractToFirestore === "function") {
      saveSingleContractToFirestore(contract);
    }

    // 4️⃣ Rattrapage éventuel (contrats dans le passé)
    if (typeof checkScheduledInvoices === "function") {
      checkScheduledInvoices();
    }
  } else {
    // Contrat existant, déjà signé → recalcul facturation
    rebuildContractInvoices(contract);

    showConfirmDialog({
      title: "Contrat mis à jour",
      message: "Le contrat signé et toute la facturation ont été recalculés ✔️",
      confirmLabel: "OK",
      variant: "success",
      icon: "🔁",
    });

    return;
  }


  // 🔟 Popup de confirmation standard (si on n’est pas sorti avant)
  showConfirmDialog({
    title: "Contrat enregistré",
    message: "Le contrat d'entretien a été enregistré avec succès.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });

  if (typeof refreshHomeStats === "function") {
    refreshHomeStats();
  }

  if (typeof refreshDocumentHealthUI === "function") {
    refreshDocumentHealthUI(contract);
  }
}

function resetContractFormToDefaults() {
  const root = document.getElementById("contractView");
  if (root) {
    root.querySelectorAll("input, textarea, select").forEach((el) => {
      if (el.type === "select-one") {
        // on garde la valeur par défaut définie dans le HTML
        return;
      } else if (
        el.type === "date" ||
        el.type === "text" ||
        el.type === "email" ||
        el.type === "tel" ||
        el.type === "number"
      ) {
        if (!el.readOnly) el.value = "";
      } else if (el.tagName === "TEXTAREA") {
        el.value = "";
      } else if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      }
    });
  }

  // Valeurs par défaut principales
  const ctClientType = document.getElementById("ctClientType");
  if (ctClientType) ctClientType.value = "particulier";

  const ctMainService = document.getElementById("ctMainService");
  if (ctMainService) ctMainService.value = "piscine_chlore";
  const ctPartRadio = document.getElementById("ctClientParticulier");
  const ctSynRadio = document.getElementById("ctClientSyndic");
  if (ctPartRadio) ctPartRadio.checked = true;
  if (ctSynRadio) ctSynRadio.checked = false;

  updateContractClientType("particulier");
  const ctMode = document.getElementById("ctMode");
  if (ctMode) ctMode.value = "standard";

  const ctPassHiver = document.getElementById("ctPassHiver");
  if (ctPassHiver) ctPassHiver.value = "1";

  const ctPassEte = document.getElementById("ctPassEte");
  if (ctPassEte) ctPassEte.value = "2";

  const ctDuration = document.getElementById("ctDuration");
  if (ctDuration) ctDuration.value = "12";

  const ctStartDate = document.getElementById("ctStartDate");
  if (ctStartDate) ctStartDate.value = "";

  // Options
  const openingEl = document.getElementById("ctIncludeOpening");
  if (openingEl) openingEl.checked = false;
  const winterEl = document.getElementById("ctIncludeWinter");
  if (winterEl) winterEl.checked = false;

  // Nouvelle référence de contrat
  const ctRef = document.getElementById("ctReference");
  if (ctRef && typeof getNextContractReference === "function") {
    ctRef.value = getNextContractReference();
  }

  // recalcul
  if (typeof recomputeContract === "function") {
    recomputeContract();
  }
}
function parseFrenchDate(str) {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function firstDayOfMonthISO(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function monthYearFr(isoDate) {
  if (!isoDate) return "";
  // On force en ISO + heure neutre pour éviter les décalages
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return "";

  // Exemple : "mai 2026"
  return d.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

// ----- Suppression -----

function deleteCurrentContract() {
  const ref = (document.getElementById("ctReference")?.value || "").trim();
  const clientName = (
    document.getElementById("ctClientName")?.value || ""
  ).trim();
  const label = clientName || ref || "Contrat";

  // 1) Aucun contrat enregistré (pas encore sauvegardé)
  if (!currentContractId) {
    showConfirmDialog({
      title: "Effacer le contrat en cours",
      message:
        `Ce contrat (${label}) n'a pas encore été enregistré.\n\n` +
        "Voulez-vous effacer tout le contenu et repartir sur un contrat vierge ?",
      confirmLabel: "Réinitialiser",
      cancelLabel: "Annuler",
      variant: "danger",
      icon: "⚠️",
      onConfirm: function () {
        resetContractFormToDefaults();
      },
    });
    return;
  }

  // 2) Contrat déjà enregistré -> vraie suppression
  const list = getAllContracts();
  const existing = list.find((c) => c.id === currentContractId);

  showConfirmDialog({
    title: "Supprimer le contrat",
    message: `Es-tu sûr de vouloir supprimer le contrat pour :\n« ${existing?.client?.name || label} » ?`,
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      const newList = list.filter((c) => c.id !== currentContractId);
      saveContracts(newList);
      deleteContractFromFirestore(currentContractId);
      currentContractId = null;

      resetContractFormToDefaults();
    },
  });
  if (typeof refreshHomeStats === "function") {
    refreshHomeStats();
  }
}

function formatNicePeriod(startISO, endRaw) {
  if (!startISO || !endRaw) return "";

  // endRaw peut être soit un ISO, soit un "dd/mm/yyyy"
  let endISO = endRaw;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(endRaw)) {
    const parsed = parseFrenchDate(endRaw); // ta fonction déjà définie plus haut
    if (parsed) endISO = parsed;
  }

  const start = new Date(startISO);
  const end = new Date(endISO);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

  const opts = { day: "numeric", month: "long", year: "numeric" };

  const startFR = start.toLocaleDateString("fr-FR", opts);
  const endFR = end.toLocaleDateString("fr-FR", opts);

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;

  return `du ${startFR} au ${endFR} (${months} mois)`;
}

const RESILIATION_PREAVIS_DAYS = 30; // adapte si besoin (45, 60...)

function createTerminationInvoiceForContract(contract) {
  const c = contract.client || {};
  const s = contract.site || {};
  const pr = contract.pricing || {};
  const meta = contract.meta || {};

  const totalContractHT = Number(pr.totalHT) || 0;
  const tvaRate = Number(pr.tvaRate) || 0;

  // Si on n'a pas de date de début ou de fréquence, on retombe sur l'ancienne logique "reste du contrat"
  const hasPassHiver = pr.passHiver !== undefined && pr.passHiver !== null;
  const hasPassEte = pr.passEte !== undefined && pr.passEte !== null;

  if (!pr.startDate || !pr.durationMonths || (!hasPassHiver && !hasPassEte)) {
    return createTerminationInvoiceSimple(contract);
  }

  // 1) Déterminer la date de fin "théorique" du contrat
  let contractEnd = null;

  if (pr.startDate && pr.durationMonths) {
    const start = new Date(pr.startDate + "T00:00:00");
    if (!isNaN(start.getTime())) {
      const end = new Date(start);
      end.setMonth(end.getMonth() + pr.durationMonths);
      end.setDate(end.getDate() - 1);
      contractEnd = end;
    }
  }

  if (!contractEnd && pr.endDateLabel) {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(pr.endDateLabel)) {
      const iso = parseFrenchDate(pr.endDateLabel);
      if (iso) {
        const d = new Date(iso + "T00:00:00");
        if (!isNaN(d.getTime())) contractEnd = d;
      }
    } else {
      const d = new Date(pr.endDateLabel);
      if (!isNaN(d.getTime())) contractEnd = d;
    }
  }

  // 2) Date de résiliation + préavis
  let resISO = meta.resiliationDate || new Date().toISOString().slice(0, 10);
  let resDate = new Date(resISO + "T00:00:00");
  if (isNaN(resDate.getTime())) {
    resDate = new Date();
    resDate.setHours(0, 0, 0, 0);
    resISO = resDate.toISOString().slice(0, 10);
  }

  const who = meta.resiliationWho || "client";

  // Si résiliation par le client -> on applique un préavis
  // Si résiliation par le prestataire -> pas de préavis
  let effectiveEnd = new Date(resDate);
  if (who === "client") {
    effectiveEnd.setDate(effectiveEnd.getDate() + RESILIATION_PREAVIS_DAYS);
  }

  // On ne dépasse jamais la fin théorique du contrat
  if (contractEnd && effectiveEnd > contractEnd) {
    effectiveEnd = contractEnd;
  }

  const startISO = pr.startDate;
  const effectiveEndISO = effectiveEnd.toISOString().slice(0, 10);

  // 3) Calcul du nombre de mois été / hiver sur la période début -> résiliation+préavis
  const { monthsEte, monthsHiver } = computeMonthsEteHiverBetween(
    startISO,
    effectiveEndISO,
  );

  // 4) Passages théoriques sur cette période
  const passHiver = Number(pr.passHiver) || 0;
  const passEte = Number(pr.passEte) || 0;
  const unitPrice =
    Number(pr.unitPrice) ||
    (pr.totalPassages ? (Number(pr.totalHT) || 0) / pr.totalPassages : 0);

  let theoreticalPassages = monthsEte * passEte + monthsHiver * passHiver;

  if (pr.totalPassages && theoreticalPassages > pr.totalPassages) {
    theoreticalPassages = pr.totalPassages;
  }

  let htDue = theoreticalPassages * unitPrice;

  if (htDue > totalContractHT) {
    htDue = totalContractHT;
  }

  // 5) Montant déjà facturé pour ce contrat
  const docs = getAllDocuments();
  const alreadyBilledHT = docs
    .filter((d) => d.type === "facture" && d.contractId === contract.id)
    .reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0);

  // 6) Solde à facturer
  const remainingHT = Math.max(0, htDue - alreadyBilledHT);
  if (remainingHT <= 0) {
    return null; // rien à facturer
  }

  const tvaAmount = tvaRate > 0 ? remainingHT * (tvaRate / 100) : 0;
  const totalTTC = remainingHT + tvaAmount;

  const number = getNextNumber("facture");
  const todayISO = new Date().toISOString().slice(0, 10);

  // 💡 Date de facture = fin effective du contrat (sans aller dans le futur)
  const invoiceDateISO =
    effectiveEndISO <= todayISO ? effectiveEndISO : todayISO;

  const baseLabel = "Facture de clôture – Contrat d’entretien";
  const formattedPeriod = formatNicePeriod(startISO, effectiveEndISO);
  const subject = formattedPeriod
    ? `${baseLabel} ${formattedPeriod}`
    : baseLabel;

  const lineDesc = subject;

  const notes = [
    `Facture de clôture émise suite à la résiliation du contrat d’entretien.`,
    `Montant calculé au prorata des passages prévus entre le ${startISO} et le ${effectiveEndISO}` +
      (who === "client"
        ? `, en incluant un préavis de ${RESILIATION_PREAVIS_DAYS} jours.`
        : `. `),
    `Le montant tient compte des factures déjà émises pour ce contrat.`,
    `Les conditions générales restent applicables.`,
  ].join("\n");

  const prestations = [
    {
      desc: lineDesc,
      detail:
        "Solde restant dû au titre du contrat d’entretien (prorata + préavis).",
      qty: 1,
      price: remainingHT,
      total: remainingHT,
      unit: "forfait",
      dates: [],
      kind: "contrat_resiliation",
    },
  ];

  const facture = {
    id: generateId("FAC"),
    type: "facture",
    number,
    date: invoiceDateISO, // 🔥 ICI : fin de contrat, plus todayISO
    validityDate: "",
    subject,

    contractId: contract.id || null,
    contractReference: c.reference || "",

    client: {
      civility: c.civility || "",
      name: c.name || "",
      address: c.address || "",
      phone: c.phone || "",
      email: c.email || "",
    },

    siteCivility: s.civility || "",
    siteName: s.name || "",
    siteAddress: s.address || "",

    prestations,
    tvaRate,
    subtotal: remainingHT,
    discountRate: 0,
    discountAmount: 0,
    tvaAmount,
    totalTTC,

    notes,

    paid: false,
    paymentMode: "",
    paymentDate: "",

    status: "",
    conditionsType: pr.clientType === "syndic" ? "agence" : "particulier",

    createdAt: new Date().toISOString(),
  };

  docs.push(facture);
  saveDocuments(docs);
  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(facture);
  }

  return facture;
}

function createTerminationInvoiceSimple(contract) {
  const c = contract.client || {};
  const s = contract.site || {};
  const pr = contract.pricing || {};

  const totalContractHT = Number(pr.totalHT) || 0;
  const tvaRate = Number(pr.tvaRate) || 0;

  // Montant déjà facturé pour ce contrat
  const docs = getAllDocuments();
  const alreadyBilledHT = docs
    .filter((d) => d.type === "facture" && d.contractId === contract.id)
    .reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0);

  const remainingHT = Math.max(0, totalContractHT - alreadyBilledHT);
  if (remainingHT <= 0) return null;

  const tvaAmount = tvaRate > 0 ? remainingHT * (tvaRate / 100) : 0;
  const totalTTC = remainingHT + tvaAmount;

  const number = getNextNumber("facture");

  const todayISO = new Date().toISOString().slice(0, 10);

  const subject = "Facture de clôture – Contrat d’entretien";

  const prestations = [
    {
      desc: subject,
      detail: "Montant restant dû au titre du contrat d’entretien.",
      qty: 1,
      price: remainingHT,
      total: remainingHT,
      unit: "forfait",
      dates: [],
      kind: "contrat_resiliation",
    },
  ];

  const notes = [
    "Facture de clôture émise suite à la résiliation du contrat d’entretien.",
    "Le montant facturé correspond au solde restant dû conformément aux conditions contractuelles.",
  ].join("\n");

  const facture = {
    id: generateId("FAC"),
    type: "facture",
    number,
    date: todayISO,
    validityDate: "",
    subject,

    contractId: contract.id || null,
    contractReference: c.reference || "",

    client: {
      civility: c.civility || "",
      name: c.name || "",
      address: c.address || "",
      phone: c.phone || "",
      email: c.email || "",
    },

    siteCivility: s.civility || "",
    siteName: s.name || "",
    siteAddress: s.address || "",

    prestations,
    tvaRate,
    subtotal: remainingHT,
    discountRate: 0,
    discountAmount: 0,
    tvaAmount,
    totalTTC,

    notes,

    paid: false,
    paymentMode: "",
    paymentDate: "",
    status: "",
    conditionsType: pr.clientType === "syndic" ? "agence" : "particulier",

    createdAt: new Date().toISOString(),
  };

  docs.push(facture);
  saveDocuments(docs);
  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(facture);
  }
  return facture;
}

function resiliateCurrentContract() {
  // On s'assure que le contrat est bien à jour
  recomputeContract();
  let contract = buildContractFromForm(true);
  if (!contract) return;

  const clientName =
    (contract.client && contract.client.name) ||
    (contract.client && contract.client.reference) ||
    contract.id;

  // 📅 Date proposée par défaut = aujourd'hui
  const todayISO = new Date().toISOString().slice(0, 10);

  // On demande la vraie date de réception du recommandé
  // Formats acceptés :
  //  - YYYY-MM-DD (2025-03-12)
  //  - JJ/MM/AAAA (12/03/2025)
  let inputDate = window.prompt(
    "Date de réception du courrier recommandé (format AAAA-MM-JJ ou JJ/MM/AAAA).\n" +
      "Laisse vide pour utiliser la date d'aujourd'hui : " +
      todayISO,
    todayISO,
  );

  if (inputDate === null) {
    // L'utilisateur a cliqué sur Annuler dans le prompt -> on annule toute la résiliation
    return;
  }

  inputDate = (inputDate || "").trim();

  let resISO = todayISO;

  if (inputDate) {
    // Format ISO ?
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      resISO = inputDate;
    }
    // Format français JJ/MM/AAAA ?
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(inputDate)) {
      const iso = parseFrenchDate(inputDate);
      if (iso) {
        resISO = iso;
      } else {
        alert("Date invalide. Résiliation annulée.");
        return;
      }
    } else {
      alert("Format de date invalide. Utilise AAAA-MM-JJ ou JJ/MM/AAAA.");
      return;
    }
  }

  // On prépare un petit label lisible pour l'affichage dans le message
  const [y, m, d] = resISO.split("-");
  const resFR = d + "/" + m + "/" + y;

  showConfirmDialog({
    title: "Résilier le contrat",
    message:
      `Es-tu sûr de vouloir résilier le contrat pour :\n« ${clientName} » ?\n\n` +
      `Date légale de réception du recommandé prise en compte : ${resFR}.\n` +
      `Le préavis de ${RESILIATION_PREAVIS_DAYS} jours sera calculé à partir de cette date.\n\n` +
      `Une facture de clôture sera générée automatiquement pour le montant restant dû (prorata + préavis si applicable).`,
    confirmLabel: "Résilier et facturer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      // 1) Met à jour le statut + meta résiliation AVEC la bonne date
      contract.status = CONTRACT_STATUS.RESILIE;
      if (!contract.meta) contract.meta = {};
      contract.meta.resiliationDate = resISO;
      contract.meta.resiliationWho = "prestataire"; // ou "client"

      // 🧹 On arrête l'échéancier : plus de prochaine facture
      if (contract.pricing) {
        contract.pricing.nextInvoiceDate = "";
      }

      // 2) Sauvegarde du contrat modifié
      const list = getAllContracts();
      const idx = list.findIndex((c) => c.id === contract.id);
      if (idx >= 0) {
        list[idx] = contract;
      } else {
        list.push(contract);
      }
      saveContracts(list);
      saveSingleContractToFirestore(contract);

      // 3) Création de la facture de résiliation (qui utilisera resiliationDate + préavis)
      const facture = createTerminationInvoiceForContract(contract);

      // Recharge la liste des contrats (statut RESILIE visible)
      if (typeof loadContractsList === "function") {
        loadContractsList();
      }

      if (facture) {
        // Propose d’ouvrir la facture
        showConfirmDialog({
          title: "Contrat résilié",
          message:
            `Le contrat a été résilié et une facture de clôture ${facture.number} a été créée.\n\n` +
            `Souhaites-tu ouvrir cette facture maintenant ?`,
          confirmLabel: "Ouvrir la facture",
          cancelLabel: "Plus tard",
          variant: "success",
          icon: "✅",
          onConfirm: function () {
            // On passe sur les factures
            if (typeof switchListType === "function") {
              switchListType("facture");
            }

            const contractView = document.getElementById("contractView");
            const formView = document.getElementById("formView");
            if (contractView) contractView.classList.add("hidden");
            if (formView) formView.classList.remove("hidden");

            if (typeof loadDocument === "function") {
              loadDocument(facture.id);
            }
            if (typeof loadDocumentsList === "function") {
              loadDocumentsList();
            }
          },
        });
      } else {
        // Rien à facturer
        showConfirmDialog({
          title: "Contrat résilié",
          message:
            "Le contrat a été résilié.\nAucun montant restant dû n’a été détecté, aucune facture n’a été générée automatiquement.",
          confirmLabel: "OK",
          cancelLabel: "",
          variant: "success",
          icon: "✅",
        });
      }
    },
  });
}

function transformContractToInvoice() {
  // On recalcule d'abord le contrat depuis le formulaire
  recomputeContract();
  const contract = buildContractFromForm(true);
  if (!contract) return;

  // 🔒 Blocage si devis obligatoire mais non accepté
  const devisNeeded = isDevisObligatoireForContract(contract);
  const devisOK = isDevisAcceptedForContract(contract);

  if (devisNeeded && !devisOK) {
    const linkedDevis = getLinkedDevisForContract(contract);
    const devisNum = linkedDevis ? linkedDevis.number : null;

    let msg;
    if (linkedDevis && devisNum) {
      msg =
        `Ce contrat est lié au devis ${devisNum} qui n’est pas encore marqué "Accepté".\n\n` +
        `Impossible de générer une facture tant que ce devis n’est pas accepté.`;
    } else {
      msg =
        `Ce contrat nécessite un devis accepté avant facturation (particulier > 150 € TTC).\n\n` +
        `Impossible de générer une facture tant qu’un devis n’a pas été créé puis accepté.`;
    }

    showConfirmDialog({
      title: "Devis obligatoire non accepté",
      message: msg,
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "🧾",
    });
    return;
  }

  // --- 🧾 Partie d'origine : on garde tout comme avant ---

  const c = contract.client || {};
  const s = contract.site || {};
  const p = contract.pool || {};
  const pr = contract.pricing || {};

  // Détermination du libellé service
  const poolType = pr.mainService || p.type || "";
  let serviceLabel = "";

  if (poolType === "piscine_sel" || poolType === "piscine_chlore") {
    serviceLabel = "piscine";
  } else if (
    poolType === "spa" ||
    poolType === "spa_jacuzzi" ||
    poolType === "entretien_jacuzzi"
  ) {
    serviceLabel = "spa / jacuzzi";
  } else {
    serviceLabel = "piscine / spa";
  }

  const baseLabel = `Contrat d’entretien ${serviceLabel}`;
  const formattedPeriod = formatNicePeriod(pr.startDate, pr.endDateLabel);
  const subject = formattedPeriod
    ? `${baseLabel} – ${formattedPeriod}`
    : baseLabel;

  // Montants normaux du contrat
  const subtotal = Number(pr.totalHT) || 0;
  const tvaRate = Number(pr.tvaRate) || 0;
  const tvaAmount = tvaRate > 0 ? subtotal * (tvaRate / 100) : 0;
  const totalTTC = subtotal + tvaAmount;

  const number = getNextNumber("facture");
  const todayISO = new Date().toISOString().slice(0, 10);

  // LIGNE NORMALE DE FACTURE — pas de prorata/preavis ici
  const prestations = [
    {
      desc: subject,
      detail: `Facturation du contrat d’entretien sur la période prévue.`,
      qty: 1,
      price: subtotal,
      total: subtotal,
      unit: "forfait",
      dates: [],
      kind: "contrat_normal",
    },
  ];

  const baseNotesLines =
    pr.clientType === "syndic"
      ? [
          "Règlement à 30 jours fin de mois.",
          "Aucun escompte pour paiement anticipé. En cas de retard de paiement, des pénalités pourront être appliquées conformément aux conditions générales.",
        ]
      : [
          "Règlement comptant à réception de la facture.",
          "Aucun escompte pour paiement anticipé. En cas de retard de paiement, des pénalités pourront être appliquées conformément aux conditions générales.",
        ];

  const notes = baseNotesLines.join("\n");

  const facture = {
    id: generateId(),
    type: "facture",
    number,
    date: todayISO,
    client: {
      name: c.name || "",
      address: c.address || "",
      email: c.email || "",
      phone: c.phone || "",
      reference: c.reference || "",
    },
    site: {
      name: s.name || "",
      address: s.address || "",
    },
    subject,
    prestations,
    subtotal,
    tvaRate,
    tvaAmount,
    total: totalTTC,
    notes,
    paid: false,
    paymentMode: "",
    paymentDate: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contractId: contract.id || currentContractId || null,
  };

  const docs = getAllDocuments();
  docs.push(facture);
  saveDocuments(docs);

  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(facture);
  }

  if (typeof switchListType === "function") {
    switchListType("facture");
  }

  const contractView = document.getElementById("contractView");
  const formView = document.getElementById("formView");
  if (contractView) contractView.classList.add("hidden");
  if (formView) formView.classList.remove("hidden");

  if (typeof loadDocument === "function") {
    loadDocument(facture.id);
  }
  if (typeof loadDocumentsList === "function") {
    loadDocumentsList();
  }
}

function openContractPDF(previewOnly = false) {
  // On s'assure que tout est bien à jour
  recomputeContract();
  const contract = buildContractFromForm(true);
  if (!contract) return;
  // 🔗 On récupère la version enregistrée du contrat pour garder la signature
  if (currentContractId && typeof getContract === "function") {
    const stored = getContract(currentContractId);
    if (stored) {
      if (stored.signature) {
        contract.signature = stored.signature;
      }
      if (stored.signatureDate) {
        contract.signatureDate = stored.signatureDate;
      }
      if (stored._inheritedSignature) {
        contract._inheritedSignature = stored._inheritedSignature;
      }
      if (stored._inheritedSignatureDate) {
        contract._inheritedSignatureDate = stored._inheritedSignatureDate;
      }
    }
  }

  const c = contract.client || {};
  const s = contract.site || {};
  const p = contract.pool || {};
  const pr = contract.pricing || {};
  const meta = contract.meta || {};

  const poolType = pr.mainService || p.type || "";

  const isPiscine = poolType === "piscine_sel" || poolType === "piscine_chlore";

  const isSpa =
    poolType === "entretien_jacuzzi" ||
    poolType === "spa" ||
    poolType === "spa_jacuzzi";

  // Helper date FR
  const formatDateFR = (str) => {
    if (!str) return "";
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("fr-FR");
    }
    // si c'est déjà "jj/mm/aaaa"
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str;
    return "";
  };

  const format =
    typeof formatEuro === "function"
      ? formatEuro
      : (v) => (v && v.toFixed ? v.toFixed(2) + " €" : (v || 0) + " €");

  const logoSrc = "logo.png";
  const today = new Date();
  const pdfDateStr = today.toLocaleDateString("fr-FR");

  const startDateFR = formatDateFr(pr.startDate);
  const endDateFR = formatDateFr(pr.endDateLabel);

  // Libellé du bassin

  // Libellé du bassin
  const poolLabel =
    p.type === "piscine_sel"
      ? "Piscine au sel"
      : p.type === "piscine_chlore"
        ? "Piscine au chlore"
        : "Spa / Jacuzzi";

  // Titre et sous-titre d’en-tête
  const headerTitle = `CONTRAT D’ENTRETIEN – ${poolLabel.toUpperCase()}`;
  const headerPeriod =
    startDateFR && endDateFR ? `Période : ${startDateFR} → ${endDateFR}` : "";

  // ---------- 💰 Montants sécurisés ----------
  const rawTotalHT = Number(pr.totalHT) || 0;
  const computedHT = (pr.totalPassages || 0) * (pr.unitPrice || 0);
  const totalHTSafe = rawTotalHT > 0 ? rawTotalHT : computedHT;

  let baseHTForInfo = totalHTSafe;
  let airbnbExtraForInfo = 0;

  if (pr.airbnbOption && totalHTSafe > 0) {
    baseHTForInfo = totalHTSafe / 1.2; // base HT
    airbnbExtraForInfo = totalHTSafe - baseHTForInfo;
  }

  const tvaRate = pr.tvaRate || 0;
  const rawTvaAmount = Number(pr.tvaAmount) || 0;
  const tvaAmountSafe =
    tvaRate > 0
      ? rawTvaAmount > 0
        ? rawTvaAmount
        : totalHTSafe * (tvaRate / 100)
      : 0;

  const totalTTCSafe = tvaRate > 0 ? totalHTSafe + tvaAmountSafe : totalHTSafe;

  // ---------- 🔴 Bloc résiliation en haut ----------
  let resiliationBlockTop = "";
  if (contract.status === CONTRACT_STATUS.RESILIE && meta.resiliationDate) {
    const dateLabel = formatDateFR(meta.resiliationDate);
    const whoLabel =
      meta.resiliationWho === "prestataire"
        ? "AquaClim Prestige"
        : "Le client / mandataire";

    resiliationBlockTop = `
      <div style="
        margin: 8px 0 6px;
        padding: 8px 10px;
        border-left: 3px solid #d32f2f;
        background:#fff5f5;
        font-size:11px;
        line-height:1.4;
      ">
        <div style="font-weight:700; color:#b71c1c; margin-bottom:2px;">
          <span style="font-size:12px;">🔴</span> CONTRAT RÉSILIÉ
        </div>
        ${dateLabel ? `<div>Date : ${dateLabel}</div>` : ""}
        <div>Initiative : ${whoLabel}</div>
        ${
          meta.resiliationMotif
            ? `<div>Motif : ${escapeHtml(meta.resiliationMotif)}</div>`
            : ""
        }
      </div>
    `;
  }

  // ---------- 🔴 Paragraphe résiliation dans 5.10 ----------
  let resiliationHTML = "";
  if (meta.resiliationDate) {
    const dateLabel = formatDateFR(meta.resiliationDate);
    const whoLabel =
      meta.resiliationWho === "prestataire"
        ? "AquaClim Prestige"
        : "le client / mandataire";

    resiliationHTML =
      `<p style="margin-top:3px;">
        <em>
          Contrat résilié le ${dateLabel} à l’initiative de ${whoLabel}` +
      (meta.resiliationMotif
        ? " – Motif : " + escapeHtml(meta.resiliationMotif)
        : "") +
      `.</em>
      </p>`;
  }
  // ---------- 🔵 Bloc facturation de clôture (renouvelé ou résilié) ----------
  let terminationBillingBlockTop = "";

  const docsForThis = getAllDocuments().filter(
    (d) =>
      d.type === "facture" &&
      d.contractId === contract.id &&
      d.prestations?.some((p) => p.kind === "contrat_resiliation"),
  );

  if (docsForThis.length > 0) {
    const invoice = docsForThis[docsForThis.length - 1]; // dernière facture de clôture
    const alreadyBilled = docsForThis.reduce(
      (sum, f) => sum + (Number(f.subtotal) || 0),
      0,
    );
    const totalHT = Number(pr.totalHT) || 0;
    const remain = Math.max(0, totalHT - alreadyBilled);

    terminationBillingBlockTop = `
    <div style="
      margin: 8px 0 6px;
      padding: 8px 10px;
      border-left: 3px solid #1a74d9;
      background:#f0f7ff;
      font-size:11px;
      line-height:1.4;
    ">
      <div style="font-weight:700; color:#1a74d9; margin-bottom:2px;">
        <span style="font-size:12px;">🔵</span> FACTURE DE CLÔTURE ÉMISE
      </div>

      <div>Montant total du contrat : ${format(totalHT)}</div>
      <div>Montant déjà facturé : ${format(alreadyBilled)}</div>
      <div>Solde facturé : ${format(remain)}</div>
      <div>Facture n° ${invoice.number || ""} du ${invoice.date || ""}</div>
    </div>
  `;
  }

  const isSyndic = pr.clientType === "syndic";
  const clientBlockTitle = isSyndic ? "Syndic / Agence" : "Client";
  const nameLabel = isSyndic ? "Société" : "Nom";

  // ================= SIGNATURE CLIENT =================

  // 1) d'abord : signature stockée dans le CONTRAT (cas syndic)
  let clientSignatureDataUrl = contract.signature || "";
  let clientSignatureDate = contract.signatureDate || "";

  // 2) si PAS de signature dans le contrat ET que ce n'est PAS un syndic,
  //    on essaie de récupérer la signature du DEVIS lié (cas particulier)
  if (
    !clientSignatureDataUrl &&
    !isSyndic &&
    typeof getAllDocuments === "function"
  ) {
    const meta = contract.meta || {};
    const docs = getAllDocuments();

    let linkedDevis = null;

    if (meta.sourceDevisId) {
      linkedDevis = docs.find((d) => d.id === meta.sourceDevisId);
    } else if (meta.sourceDevisNumber) {
      linkedDevis = docs.find(
        (d) => d.type === "devis" && d.number === meta.sourceDevisNumber,
      );
    }

    if (
      linkedDevis &&
      linkedDevis.status === "accepte" &&
      linkedDevis.signature
    ) {
      clientSignatureDataUrl = linkedDevis.signature;
      clientSignatureDate = linkedDevis.signatureDate || linkedDevis.date || "";
    }
  }

  // Date qui apparaîtra dans "Fait à Nice, le ..."
  const clientSignatureDateLabel =
    formatDateFR(clientSignatureDate) || pdfDateStr;

  // HTML du bloc signature client
  let clientSignatureHTML = "";
  if (clientSignatureDataUrl) {
    clientSignatureHTML = `
      <p>Signature précédée de la mention : « Lu et approuvé ».</p>
      <p>Date de signature : ${clientSignatureDateLabel}</p>
      <img src="${clientSignatureDataUrl}" class="sig" alt="Signature du client" />
    `;
  } else {
    clientSignatureHTML = `
      <p>(Aucune signature disponible)</p>
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Contrat d'entretien piscine / spa</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: Arial, sans-serif;
  font-size: 10.5px;
  color:#333;
  display: flex;
  justify-content: center;   /* centre la page dans la fenêtre */
}

.page {
  width: 210mm;              /* largeur A4 */
  margin: 0 auto;            /* sécurité */
  padding: 10mm 12mm 12mm 12mm;
  box-sizing: border-box;
}


  .header {
    text-align: center;
    margin-bottom: 6px;
    border-bottom: 1.5px solid #1a74d9;
    padding-bottom: 4px;
  }

  .header img.logo {
    height: 55px;
    margin-bottom: 3px;
  }

  .header h1 {
    color: #1a74d9;
    font-size: 18px;
    margin-bottom: 2px;
  }

  .header .subtitle {
    font-size: 10px;
    margin-bottom: 2px;
  }

  .header .contact {
    font-size: 9.5px;
  }

  h2.contrat-title {
    text-align:center;
    margin: 6px 0 2px;
    font-size: 14px;
    text-transform: uppercase;
  }
  .contrat-period {
    font-size: 10px;
    font-weight: normal;
    text-transform: none;
  }

  .contrat-subtitle {
    text-align: center;
    font-size: 10px;
    margin-bottom: 4px;
  }

  .ref-bar {
    display:flex;
    justify-content: flex-start; /* plus de client à droite */
    font-size: 9.5px;
    margin: 4px 0 2px;
  }

  .section {
    margin-top: 10px;              /* moins d’espace entre sections */
    page-break-inside: avoid;
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
  }

  .section-title {
    font-weight: bold;
    margin-bottom: 2px;
    color: #1a74d9;
    font-size: 10.5px;
    page-break-after: avoid;
  }

  .block {
    border: 1px solid #cbd3e1;
    border-radius: 6px;
    padding: 5px 7px;
    margin-bottom: 4px;
    background:#fafbff;
  }

  .block p {
    margin: 1px 0;
  }

  .block p,
  .block ul li {
    line-height: 1.25; /* compact mais lisible */
  }

  .label {
    font-weight:bold;
  }

  .tarif-block {
    border: 1.5px solid #1a74d9;
    background: #f0f5ff;
  }

  .tarif-main-amount {
    font-size: 11px;
    font-weight: 700;
    margin-top: 3px;
  }

  .grid-2 {
    display:flex;
    gap:12px;
  }
  .grid-2 > div {
    flex:1;
  }

  ul {
    margin-left: 12px;
    margin-top: 2px;
  }

  .signatures {
    margin-top: 8px;
    display:flex;
    gap:16px;
  }
  .signature-block {
    flex:1;
    border-top:1px solid #333;
    padding-top:3px;
    min-height:45px;
    font-size:9.5px;
  }
  .signature-title {
    font-weight:bold;
    margin-bottom:3px;
  }

  img.sig {
    height: 70px;
    width: auto;
    margin-top: 3px;
  }
img.sig-client {
  height: 70px;
  width: auto;
  margin-top: 10px;
}


  .amount-highlight {
    margin-top:3px;
    font-weight:bold;
    font-size:11px;
  }

  @media print {
    @page { margin:0; }
    body { margin:0; }
  }
</style>


</head>
<body>
<div class="page">
  <div class="header">
         <h1>${getCompanySettings().companyName}</h1>
    <p class="subtitle">${getCompanySettings().subtitle}</p>
    <p class="contact">
      ${getCompanySettings().legalName} – SIRET : ${getCompanySettings().siret}<br>
      Adresse : ${getCompanySettings().address} – Tél : ${getCompanySettings().phone} – Email : ${getCompanySettings().email}
    </p>

  </div>

  <h2 class="contrat-title">
    ${headerTitle}<br>
    <span class="contrat-period">${headerPeriod}</span>
  </h2>

${resiliationBlockTop}
${terminationBillingBlockTop}


  <div class="ref-bar">
  <div><strong>Contrat n°</strong> ${c.reference || contract.id}</div>
</div>



  <!-- 1. Identification -->

  <div class="section">
    <div class="section-title">1. Identification des parties</div>
    <div class="block">
           <p class="label">Prestataire</p>
      <p>${getCompanySettings().companyName} – représentée par ${getCompanySettings().legalName}</p>
      <p>Domiciliation : ${getCompanySettings().address}</p>
      <p>SIRET : ${getCompanySettings().siret}</p>
      <p>RC Pro : Oui (attestation disponible sur demande)</p>

      <br>

      <p class="label">${clientBlockTitle}</p>

      ${
        c.name || c.civility
          ? `<p>${nameLabel} : ${[c.civility, c.name]
              .filter(Boolean)
              .join(" ")}</p>`
          : ""
      }

      ${c.address ? `<p>Adresse : ${c.address}</p>` : ""}

      ${
        c.phone || c.email
          ? `<p>Téléphone / Email : ${[c.phone, c.email]
              .filter(Boolean)
              .join(" / ")}</p>`
          : ""
      }

      ${c.reference ? `<p>Référence contrat : ${c.reference}</p>` : ""}

      ${
        pr.clientType === "syndic"
          ? `
            <p class="label">Lieu d’intervention</p>
            ${
              s.civility || s.name
                ? `<p>Nom sur place : ${
                    (s.civility ? s.civility + " " : "") + (s.name || "")
                  }</p>`
                : ""
            }
            ${s.address ? `<p>Adresse : ${s.address}</p>` : ""}`
          : ""
      }

      <p>Type d’installation :
        ${
          p.type === "piscine_sel"
            ? "Piscine au sel"
            : p.type === "piscine_chlore"
              ? "Piscine au chlore"
              : p.type === "spa"
                ? "Spa / Jacuzzi"
                : ""
        }
      </p>
      ${p.volume ? `<p>Volume approximatif : ${p.volume} m³</p>` : ""}
      ${p.notes ? `<p>Particularités / Accès : ${p.notes}</p>` : ""}
    </div>
  </div>

  <!-- 2. Objet -->

  <div class="section">
    <div class="section-title">2. Objet du contrat</div>
    <div class="block">
      <p>Le présent contrat a pour objet l’entretien, la surveillance et le contrôle des installations énoncées ci-dessus, comprenant piscine, spa, jacuzzi et local technique, selon la fréquence et les prestations décrites ci-après.</p>
    </div>
  </div>

  <!-- 3. Fréquence & période -->

  <div class="section">
    <div class="section-title">3. Fréquence des interventions & période</div>
    <div class="block">
      <div class="grid-2">
        <div>
          <p><span class="label">Prestation principale :</span>
           ${
             poolType === "piscine_sel"
               ? "Piscine au sel"
               : poolType === "piscine_chlore"
                 ? "Piscine au chlore"
                 : "Spa / Jacuzzi"
           }

          </p>
          <p><span class="label">Mode de passages :</span>
            ${
              pr.mode === "standard"
                ? "Standard : 1/mois hiver – 2/mois été"
                : pr.mode === "intensif"
                  ? "Intensif : 2/mois hiver – 4/mois été"
                  : "Personnalisé"
            }
          </p>
          <p><span class="label">Passages hiver (nov → avr) :</span> ${pr.passHiver} / mois</p>
          <p><span class="label">Passages été (mai → oct) :</span> ${pr.passEte} / mois</p>
        </div>
        <div>
          <p>
            <span class="label">Période du contrat :</span>
            ${startDateFR} → ${endDateFR} (${pr.durationMonths} mois)
          </p>
          <p>
            <span class="label">Nombre de visites prévues :</span>
            ${pr.totalPassages}
          </p>
        </div>
      </div>

      <p class="amount-highlight">
        Prix par passage : ${format(pr.unitPrice)} — Montant total du contrat : ${format(totalHTSafe)}
      </p>
    </div>
  </div>

  <!-- 4. Prestations incluses -->

<div class="section">
  <div class="section-title">4. Prestations incluses</div>
  <div class="block">

    ${
      isPiscine
        ? `
    <p class="label">4.1 Prestations standards (piscine chlore / sel)</p>
    <ul>
      <li>Contrôle et nettoyage : paniers skimmer, préfiltre pompe, ligne d’eau, fond et parois (si robot absent ou HS).</li>
      <li>Vérification du système de filtration.</li>
      <li>Nettoyage du filtre (sable, verre, cartouche) selon besoin.</li>
      <li>Analyse de l’eau (pH / TAC / TH / chlore libre / redox).</li>
      <li>Contrôle de la cellule d’électrolyse (piscine au sel le cas échéant).</li>
      <li>Vérification des pompes, vannes, canalisations et joints.</li>
      <li>Contrôle volet / bâche / barrière si présents.</li>
      <li>Conseils d’usage et ajustements nécessaires.</li>
    </ul>
    `
        : ""
    }

    ${
      isSpa
        ? `
    <p class="label" style="margin-top:4px;">4.1 Prestations Spa / Jacuzzi</p>
    <ul>
      <li>Vidange complète selon la fréquence définie.</li>
      <li>Nettoyage de la cuve, des buses et des cartouches.</li>
      <li>Désinfection air/eau et circuits.</li>
      <li>Contrôle de la soufflerie et du chauffage.</li>
      <li>Analyse de l’eau et dosage adapté.</li>
    </ul>
    `
        : ""
    }

    <p class="label" style="margin-top:4px;">4.2 Remise en service / hivernage</p>
    <p>
      Remise en service et hivernage (actif ou passif) peuvent être inclus
      selon l’option choisie et feront l’objet d’une fiche ou d’un devis associé.
    </p>

  </div>
</div>


<!-- 5. Clauses contractuelles & responsabilités -->

<div class="section">
  <div style="height:10px;"></div>
  <div class="section-title">5. Clauses contractuelles & responsabilités</div>
  <div class="block">

    <p class="label">5.1 Prestations non incluses (hors forfait)</p>
    <ul>
      <li>Dépannage, fuites, réparations hydrauliques et climatisation.</li>
      <li>Remplacement de matériel (pompe, filtre, cellule, carte, pièces diverses).</li>
      <li>Travaux nécessitant une vidange complète.</li>
      <li>Nettoyages lourds : eau verte, algues massives, tempête, sable saharien…</li>
      <li>Passages liés à un usage intensif ou à une location saisonnière.</li>
    </ul>

    <p class="label" style="margin-top:4px;">5.2 Produits & consommables</p>
    <p>
      Les produits (chlore, sel, correcteurs, floculant…) sont fournis selon devis ou facture.
      Les surconsommations liées à la météo, à l’usage ou à un matériel défectueux
      peuvent être facturées.
    </p>

    <p class="label" style="margin-top:4px;">5.3 Déchets & conformité</p>
    <p>
      Les déchets sont évacués conformément à la réglementation applicable et aux filières de traitement en vigueur.
    </p>

    <p class="label" style="margin-top:4px;">5.4 Accès aux installations – déplacement dû</p>
    <p>
      Le client garantit l’accès au bassin et au local technique.
     En cas d’accès impossible (clé absente, code erroné, animaux, etc.), le déplacement reste dû. Le prestataire n’est pas tenu d’attendre au-delà de 10 minutes.
    </p>

    <p class="label" style="margin-top:4px;">5.5 Obligations du client</p>
    <p>
      Le client informe de tout changement d’usage (location, forte fréquentation),
      travaux, panne, fuite ou modification technique.
      Le client garantit le bon fonctionnement de la filtration (pompe, horloge, vannes)
      et un temps de filtration suffisant.
    </p>

    <p class="label" style="margin-top:4px;">5.6 Obligation de moyens</p>
    <p>
      AquaClim Prestige intervient avec une obligation de moyens.
      L’apparition d’algues ou d’eau trouble peut provenir d’intempéries,
      d’un usage intensif ou d’un matériel défaillant et peut nécessiter des interventions hors contrat.
    </p>

    <p class="label" style="margin-top:4px;">5.7 Absence d’obligation de résultat</p>
    <p>
Le prestataire est tenu à une obligation de moyens. La qualité de l’eau dépend de facteurs externes (météo, fréquentation, état du matériel, interventions de tiers…). Des interventions hors contrat peuvent être nécessaires.
    </p>

    <p class="label" style="margin-top:4px;">5.8 Limitation de responsabilité</p>
    <p>
      La responsabilité du prestataire est strictement limitée aux dommages directs,
      prouvés et imputables à une faute caractérisée dans l’exécution de la prestation.
      En tout état de cause, la responsabilité financière du prestataire ne pourra excéder
      le montant total des sommes effectivement encaissées au titre du présent contrat
      sur l’année contractuelle en cours.
      Sont exclus tous dommages indirects, pertes d’exploitation, pertes d’usage,
      préjudices commerciaux ou frais annexes.
Cette limitation ne s’applique pas en cas de faute lourde ou de dommage corporel.
    </p>

    <p class="label" style="margin-top:4px;">5.9 Installations non conformes</p>
    <p>
      En cas d’installation dangereuse ou non conforme (fuite importante, électricité défectueuse,
      surchauffe moteur…), les interventions peuvent être suspendues jusqu’à remise en conformité.
    </p>

    <p class="label" style="margin-top:4px;">5.10 Locations saisonnières & usage intensif</p>
    <p>
      En cas de location (Airbnb, saisonnier) ou usage intensif,
      des passages supplémentaires peuvent être nécessaires et facturés.
    </p>

    <p class="label" style="margin-top:4px;">5.11 Assurance & exclusions</p>
    <p>
      AquaClim Prestige est assuré en RC Pro.
      La responsabilité ne couvre pas les défauts structurels, la plomberie enterrée,
      le matériel ancien ou non conforme, ni la mauvaise utilisation par le client.
      Le prestataire n’est pas responsable d’un mauvais traitement lié à un matériel défaillant.
    </p>

    ${
      pr.clientType === "syndic"
        ? `
    <p class="label" style="margin-top:4px;">5.12 Exploitation et interventions de tiers</p>
    <p>
      Le prestataire n’assure pas l’exploitation quotidienne de l’installation.
      Toute intervention, réglage ou modification réalisée par un tiers
      exonère le prestataire de toute responsabilité sur les conséquences
      directes ou indirectes pouvant en résulter.
    </p>
    `
        : ""
    }

    <p class="label" style="margin-top:4px;">5.13 Durée – renouvellement – résiliation</p>
    ${
      pr.clientType === "syndic"
        ? `
<p>
  Le présent contrat est conclu pour une durée ferme de 12 mois et renouvelable
  par tacite reconduction, sauf dénonciation par lettre recommandée avec accusé
  de réception adressée au moins <strong>3 mois avant l’échéance</strong>.
</p>

<p>
  En cas de résiliation anticipée en cours d’année, quelle qu’en soit la cause,
  restent dus :
</p>

<ul>
  <li>les prestations déjà réalisées à la date de résiliation ;</li>
  <li>les prestations planifiées durant la période de préavis ;</li>
  <li>
    une indemnité de résiliation correspondant à
    <strong>20&nbsp;%</strong> du montant restant dû sur la période contractuelle,
    à titre de frais de désorganisation et de réservation de planning.
  </li>
</ul>

<p>
  Cette indemnité est plafonnée au montant des sommes restant dues sur la période
  contractuelle et ne constitue pas une pénalité.
</p>

    `
        : `
    <p>
      Le contrat est conclu pour la période définie. Il peut être résilié à tout moment,
      par le client ou par le prestataire, avec un préavis de
      <strong>30 jours calendaires</strong>.
      La résiliation doit être adressée exclusivement par courrier recommandé
      avec accusé de réception (LRAR).
    </p>
    <p>
      Les prestations réalisées, ainsi que celles programmées durant la période de préavis,
      restent intégralement dues.
      Les prestations non encore réalisées au-delà de cette période ne sont pas facturées.
    </p>
    `
    }

    <p>
      En cas d’impayés répétés, d’accès impossible récurrent,
      d’installation dangereuse ou de force majeure, le prestataire peut suspendre
      ou résilier le contrat selon les conditions ci-dessus.
    </p>

    <!-- Encadré automatique si résilié -->
    ${resiliationHTML}

    <p class="label" style="margin-top:4px;">5.14 Photos (preuve)</p>
    <p>
      Le prestataire peut prendre des photos avant/après intervention.
      Elles peuvent servir de preuve en cas de litige.
    </p>

    <p class="label" style="margin-top:4px;">5.15 Délais d’intervention</p>
    <p>
      Les interventions sont réalisées dans un délai raisonnable selon le planning.
      Aucun délai impératif ne peut être imposé sans accord écrit.
    </p>

    <p class="label" style="margin-top:4px;">5.16 Eau verte & intempéries</p>
    <p>
      Les eaux vertes, algues, sable saharien, pollen ou dépôts liés aux intempéries
      relèvent d’interventions hors contrat et peuvent être facturés.
    </p>

    <p class="label" style="margin-top:4px;">5.17 Réclamations</p>
    <p>
     Toute réclamation doit être formulée par écrit dans un délai raisonnable, idéalement sous 48 h, afin de permettre une vérification rapide.
    </p>

    <p class="label" style="margin-top:4px;">5.18 Révision annuelle</p>
    <p>
      Les tarifs peuvent être révisés chaque 1er janvier
      selon l’évolution des coûts et de l’indice Syntec.
    </p>

    <p class="label" style="margin-top:4px;">5.19 Données personnelles</p>
    <p>
      Les données clients sont utilisées uniquement pour la gestion et ne sont jamais revendues.
      AquaClim Prestige garantit la confidentialité des accès, codes et informations fournies.
    </p>

  </div>
</div>


<!-- 6. Tarifs & paiement -->


  <div class="section">
    <div class="section-title">6. Tarifs & paiement</div>
    <div class="block tarif-block">
      ${
        tvaRate && tvaRate > 0
          ? `
            <p><strong>Montant HT :</strong> ${format(totalHTSafe)}</p>
            ${
              pr.airbnbOption && airbnbExtraForInfo > 0
                ? `<p>Dont majoration usage location saisonnière / Airbnb (+20 %) : ${format(airbnbExtraForInfo)}</p>`
                : ""
            }
            <p><strong>TVA (${tvaRate
              .toFixed(2)
              .replace(/\\.00$/, "")} %) :</strong> ${format(tvaAmountSafe)}</p>
            <p class="tarif-main-amount"><strong>Montant TTC du contrat :</strong> ${format(totalTTCSafe)}</p>
          `
          : pr.clientType === "syndic"
            ? `
            <p class="tarif-main-amount"><strong>Montant HT du contrat :</strong> ${format(totalHTSafe)}</p>
            ${
              pr.airbnbOption && airbnbExtraForInfo > 0
                ? `<p>Dont majoration usage location saisonnière / Airbnb (+20 %) : ${format(airbnbExtraForInfo)}</p>`
                : ""
            }
            <p>TVA non applicable, article 293 B du CGI (régime de franchise en base).</p>
          `
            : `
            <p class="tarif-main-amount"><strong>Montant total du contrat :</strong> ${format(totalHTSafe)}</p>
            ${
              pr.airbnbOption && airbnbExtraForInfo > 0
                ? `<p>Dont majoration usage location saisonnière / Airbnb (+20 %) : ${format(airbnbExtraForInfo)}</p>`
                : ""
            }
            <p>TVA non applicable, article 293 B du CGI.</p>
          `
      }

<p style="margin-top:6px;">
  <strong>Mode de facturation :</strong> ${buildBillingPlanLine(pr) || "—"}
</p>

    </div>
  </div>

  <!-- 7. Signature -->

  <div class="section">
    <div class="section-title">7. Signature des parties</div>
    <div class="block">
      <p>Fait à Nice, le ${pdfDateStr}</p>

      <div class="signatures">

        <!-- 🟦 SIGNATURE CLIENT -->
        <div class="signature-block">
          <div class="signature-title">Client / Mandataire</div>

          ${
            // 🔵 CONTRAT PARTICULIER : signature héritée du devis
            pr.clientType === "particulier" && contract._inheritedSignature
              ? `
                <p>Bon pour accord</p>
                <p>Lu et approuvé.</p>
                <p>Date : ${contract._inheritedSignatureDate || pdfDateStr}</p>
                <p>Signature du client :</p>
                <img src="${contract._inheritedSignature}" class="sig" />
              `
              : ""
          }

          ${
            // 🟣 CONTRAT SYNDIC : signature faite dans le contrat
            pr.clientType === "syndic" && contract.signature
              ? `
                <p>Bon pour accord</p>
                <p>Lu et approuvé.</p>
                <p>Date : ${contract.signatureDate || pdfDateStr}</p>
                <p>Signature du client :</p>
              <img src="${contract.signature}" class="sig sig-client" />

              `
              : ""
          }

          ${
            !contract._inheritedSignature && !contract.signature
              ? `<p>(Aucune signature disponible)</p>`
              : ""
          }
        </div>

        <!-- 🟩 SIGNATURE PRESTATAIRE -->
        <div class="signature-block">
          <div class="signature-title">AquaClim Prestige</div>
          <p>Signature et tampon de l’entreprise</p>
          <img src="signature.png" class="sig" alt="Signature AquaClim Prestige" />
          <img src="tampon.png" class="sig" alt="Tampon AquaClim Prestige" />
        </div>


      </div>
    </div>
  </div>



</div>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.focus();
    if (!previewOnly) {
      printWindow.print();
    }
  };
}

function updateContractClientType(type) {
  // on stocke "particulier" ou "syndic" dans ctClientType
  const hidden = document.getElementById("ctClientType");
  if (hidden) hidden.value = type;

  // afficher / cacher le bloc "Lieu d’intervention"
  const siteSection = document.getElementById("ctSiteSection");
  if (siteSection) {
    if (type === "syndic") {
      siteSection.classList.remove("hidden");
    } else {
      siteSection.classList.add("hidden");
    }
  }

  // 🔧 Modes de facturation disponibles selon le type de client
  const billingSelect = document.getElementById("ctBillingMode");
  if (billingSelect) {
    const options = Array.from(billingSelect.options);

    options.forEach((opt) => {
      const val = opt.value;

      if (type === "particulier") {
        // ✅ Particulier : seulement Mensuel + Annuel 50/50
        if (val === "mensuel" || val === "annuel_50_50") {
          opt.disabled = false;
        } else {
          opt.disabled = true; // trimestriel / semestriel / annuel = interdits
        }
      } else {
        // ✅ Syndic : mensuel / trimestriel / semestriel / annuel
        if (val === "annuel_50_50") {
          opt.disabled = true; // réservé aux particuliers
        } else {
          opt.disabled = false;
        }
      }
    });

    // Si la valeur actuelle est devenue invalide, on force une valeur cohérente
    if (billingSelect.selectedOptions.length) {
      const current = billingSelect.selectedOptions[0];
      if (current.disabled) {
        if (type === "particulier") {
          billingSelect.value = "mensuel"; // défaut particulier
        } else {
          billingSelect.value = "annuel"; // défaut syndic (pour la suite)
        }
      }
    }
  }

  // recalcul (tarifs particuliers / syndic)
  if (typeof recomputeContract === "function") {
    recomputeContract();
  }
  // 🎯 Affichage du bouton signature syndic
  const sigWrapper = document.getElementById("ctSignatureWrapper");
  if (sigWrapper) {
    sigWrapper.style.display = type === "syndic" ? "block" : "none";
  }
}

function markContractNoRenew(id) {
  const c = getContract(id);
  if (!c) return;

  showConfirmDialog({
    title: "Ne pas renouveler",
    message:
      "Confirmer que ce contrat ne sera pas renouvelé ?\n" +
      "Il sera marqué comme terminé et ne remontera plus dans les alertes.",
    confirmLabel: "Oui, terminer",
    cancelLabel: "Annuler",
    variant: "warning",
    icon: "🛑",
    onConfirm: () => {
      c.meta = c.meta || {};
      c.meta.forceStatus = "termine_sans_renouvellement";

      // Optionnel : on force aussi le status stocké (pas obligatoire car computeContractStatus gère)
      c.status = CONTRACT_STATUS.TERMINE;

      const all = getAllContracts().map((x) => (x.id === c.id ? c : x));
      saveContracts(all);

      if (typeof saveSingleContractToFirestore === "function") {
        saveSingleContractToFirestore(c);
      }

      // refresh UI
      if (typeof updateContractsAlert === "function") updateContractsAlert();
      if (typeof refreshHomeStats === "function") refreshHomeStats();
      if (typeof fillContractForm === "function") fillContractForm(c);

      showToast("Contrat marqué : terminé (non renouvelé).");
    },
  });
}

function renewContract(id) {
  const oldContract = getContract(id);
  if (!oldContract) return;

  const pr = oldContract.pricing || {};

  // ---- 1) Calcul nouvelle date de début ----
  let newStart;
  if (pr.endDateLabel && pr.endDateLabel.includes("/")) {
    const iso = parseFrenchDate(pr.endDateLabel);
    newStart = new Date(iso + "T00:00:00");
  } else {
    newStart = new Date(pr.endDateLabel || new Date());
  }
  newStart.setDate(newStart.getDate() + 1);
  const newStartISO = newStart.toISOString().slice(0, 10);

  // ---- 2) Créer le nouveau contrat ----
  const newContract = JSON.parse(JSON.stringify(oldContract));
  newContract.id = Date.now().toString();
  newContract.createdAt = new Date().toISOString();

  newContract.pricing.startDate = newStartISO;

  newContract.status = "en_cours";
  newContract.meta = newContract.meta || {};
  newContract.meta.renewedFrom = oldContract.id;

  // ---- 3) L'ancien contrat passe IMMÉDIATEMENT en TERMINÉ ----
  oldContract.status = "termine";
  oldContract.meta = oldContract.meta || {};
  oldContract.meta.forceStatus = "termine_renouvele";
  oldContract.meta.renewedTo = newContract.id;

  // ---- 4) Générer automatiquement la facture de clôture ----
  const facture = createTerminationInvoiceForContract(oldContract);

  // ---- 5) Sauvegarder les 2 contrats ----
  const list = getAllContracts();

  // Remplacer l'ancien contrat
  const idx = list.findIndex((c) => c.id === oldContract.id);
  if (idx !== -1) list[idx] = oldContract;

  // Ajouter le nouveau
  list.push(newContract);

  saveContracts(list);
  saveSingleContractToFirestore(newContract);
  saveSingleContractToFirestore(oldContract);

  // ---- 6) Redirection ----
  switchListType("contrat");
  fillContractForm(newContract);

  // ---- 7) Notification ----
  if (facture) {
    showToast("Contrat renouvelé + facture de clôture créée !");
  } else {
    showToast("Contrat renouvelé !");
  }
}

function renewContractFromList(id) {
  renewContract(id);
}

function renewCurrentContract() {
  // Récupérer l’ID du contrat actuellement affiché
  const id = currentContractId;
  if (!id) {
    showToast("Aucun contrat chargé.", "error");
    return;
  }

  renewContract(id);
}

function formatDateFr(iso) {
  if (!iso) return "";
  // On attend du YYYY-MM-DD
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;

  const [year, month, day] = parts;
  if (!year || !month || !day) return iso;

  // Affichage demandé : DD-MM-YYYY
  return `${day}/${month}/${year}`;
}

function openContractSchedulePopup() {
  let contract = null;

  if (typeof currentContractId !== "undefined" && currentContractId) {
    contract = getContract(currentContractId);
  }
  if (!contract) {
    contract = buildContractFromForm(false);
  }

  if (!contract || !contract.pricing) {
    alert("Aucun contrat chargé ou contrat incomplet.");
    return;
  }

  const pr = contract.pricing || {};
  const client = contract.client || {};

  // 🔹 Ligne 1 : "Contrat entretien piscine Mr Dupont"
  const clientName = (client.name || "").trim();
  let titleText = "Contrat d'entretien piscine";
  if (clientName) {
    titleText += " " + clientName;
  }

  // 🔹 Ligne 2 : "Du 04/01/2026 au 09/08/2026"
  const startISO = pr.startDate || "";
  let endISO = pr.endDateLabel || "";

  // Si pas de date de fin saisie, on essaie de la calculer à partir de la durée
  if (!endISO && startISO && pr.durationMonths) {
    const d = new Date(startISO + "T00:00:00");
    d.setMonth(d.getMonth() + Number(pr.durationMonths || 0));
    endISO = d.toISOString().slice(0, 10);
  }

  const startLabel = formatDateFr(pr.startDate);

  const endLabel = formatDateFr(endISO);

  let periodText = "";
  if (startLabel && endLabel) {
    periodText = `Du ${startLabel} au ${endLabel}`;
  } else if (startLabel) {
    periodText = `À partir du ${startLabel}`;
  }

  const titleEl = document.getElementById("contractScheduleTitle");
  if (titleEl) titleEl.textContent = titleText;

  const periodEl = document.getElementById("contractSchedulePeriod");
  if (periodEl) periodEl.textContent = periodText;

  // 🔹 reste comme avant
  const schedule = buildContractSchedule(contract);
  const html = renderContractScheduleHTML(schedule);

  const container = document.getElementById("contractScheduleContent");
  if (container) container.innerHTML = html;

  const overlay = document.getElementById("contractSchedulePopup");
  if (overlay) {
    overlay.classList.remove("hidden");
    const popup = overlay.querySelector(".popup");
    if (popup) {
      void popup.offsetWidth;
      popup.classList.add("show");
    }
  }
}

function openInvoiceFromSchedule(invoiceId) {
  if (!invoiceId) return;

  // On bascule sur l’onglet "Factures"
  if (typeof switchListType === "function") {
    switchListType("facture");
  }

  // On ferme la popup d’échéancier
  const overlay = document.getElementById("contractSchedulePopup");
  if (overlay) {
    overlay.classList.add("hidden");
    const popup = overlay.querySelector(".popup");
    if (popup) popup.classList.remove("show");
  }

  // On charge la facture correspondante
  if (typeof loadDocument === "function") {
    loadDocument(invoiceId);
  }
}

function closeContractSchedulePopup() {
  const overlay = document.getElementById("contractSchedulePopup");
  if (!overlay) return;
  const popup = overlay.querySelector(".popup");
  if (popup) popup.classList.remove("show");
  overlay.classList.add("hidden");
}

// Format YYYY-MM-DD sans problème de fuseau horaire
function formatDateYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildContractSchedule(contract) {
  const pr = contract.pricing || {};
  const mode = pr.billingMode || "annuel";
  const clientType = pr.clientType || "particulier";

  const startISO = pr.startDate;
  if (!startISO) return [];

  const totalHT = Number(pr.totalHT || 0);
  const tvaRate = Number(pr.tvaRate || 0);
  const duration = Number(pr.durationMonths || 0);

  // Sécurité : si rien de cohérent, on sort
  if (!totalHT || !duration) return [];

  // Date de début brute
  const start = new Date(startISO + "T00:00:00");
  if (isNaN(start.getTime())) return [];

  // Date de fin de contrat = fin du dernier mois
  const contractEnd = new Date(start);
  contractEnd.setMonth(contractEnd.getMonth() + duration);
  contractEnd.setDate(0);
  contractEnd.setHours(0, 0, 0, 0);

  const rows = [];

  // ===============================
  // 🟢 PARTICULIER / MENSUEL
  // ===============================
  if (clientType === "particulier" && mode === "mensuel") {
    const n = getNumberOfInstallments(pr) || duration; // nb d'échéances

    const amountHT = totalHT / n;
    const amountTVA = amountHT * (tvaRate / 100);
    const amountTTC = amountHT + amountTVA;

    let first = new Date(start);
    first.setHours(0, 0, 0, 0);

    for (let i = 0; i < n; i++) {
      const d = new Date(first);
      d.setMonth(first.getMonth() + i);

      if (d > contractEnd) break;

      rows.push({
        index: i + 1,
        date: formatDateYMD(d),
        amountHT,
        amountTVA,
        amountTTC,
        status: "Prévisionnel",
        statusType: "forecast",
        invoiceId: null,
        invoiceNumber: "",
      });
    }
  } else {
    // ===============================
    // 🧰 CAS GÉNÉRIQUES
    // (annuel, 50/50, trimestriel, semestriel, etc.)
    // ===============================
    let n = 1;
    let stepMonths = 0;

    if (mode === "annuel_50_50") {
      n = 2;
      stepMonths = duration > 0 ? Math.round(duration / 2) : 0;
    } else {
      // nombre d’échéances (1 pour annuel, 4 pour trimestriel sur 12 mois, etc.)
      n = getNumberOfInstallments(pr);
      // pas de période : 1, 3, 6, 12…
      stepMonths = getBillingStepMonths(mode) || duration;
    }

    if (n < 1) n = 1;

    let amountHT;
    if (mode === "annuel") {
      amountHT = totalHT; // 1 seule facture
    } else if (mode === "annuel_50_50") {
      amountHT = totalHT / 2; // deux fois 50 %
    } else {
      amountHT = totalHT / n; // fractionnement classique
    }

    const amountTVA = amountHT * (tvaRate / 100);
    const amountTTC = amountHT + amountTVA;

    let current = new Date(startISO + "T00:00:00");

    // ✅ SYNDIC : la 1ʳᵉ échéance est à la FIN de la première période
    // (1 mois, 3 mois, 6 mois ou duration pour l’annuel)
    if (clientType === "syndic" && stepMonths > 0) {
      current.setMonth(current.getMonth() + stepMonths);
    }

    for (let i = 0; i < n; i++) {
      const iso = formatDateYMD(current);

      rows.push({
        index: i + 1,
        date: iso,
        amountHT,
        amountTVA,
        amountTTC,
        status: "Prévisionnel",
        statusType: "forecast",
        invoiceId: null,
        invoiceNumber: "",
      });

      if (stepMonths > 0) {
        current.setMonth(current.getMonth() + stepMonths);
      }
    }
  }

  // 🔍 On croise avec les factures réelles du contrat
  const docs = getAllDocuments();

  // 1) On prend TOUTES les factures du contrat
  let invoices = docs.filter(
    (d) => d.type === "facture" && d.contractId === contract.id,
  );

  // 2) Pour les PARTICULIERS, on ne garde que les factures d’échéance
  if (clientType === "particulier") {
    invoices = invoices.filter(
      (d) =>
        d.prestations &&
        d.prestations.some(
          (p) =>
            p.kind === "contrat_echeance" ||
            p.kind === "contrat_echeance_initiale",
        ),
    );
  }
  // Pour les SYNDICS, on garde toutes les factures liées au contrat

  rows.forEach((r) => {
    const inv = invoices.find((d) => {
      if (!d.date) return false;

      const invDate = new Date(d.date);
      const rowDate = new Date(r.date + "T00:00:00");

      return (
        invDate.getFullYear() === rowDate.getFullYear() &&
        invDate.getMonth() === rowDate.getMonth()
        // 👆 on matche au MOIS, pas au jour
      );
    });

    if (inv) {
      const invHT = Number(inv.subtotal || inv.total || 0);
      const invTVA = Number(inv.tvaAmount || 0);
      const invTTC = Number(inv.totalTTC || inv.total || invHT + invTVA);

      r.amountHT = invHT || r.amountHT;
      r.amountTVA = invTVA;
      r.amountTTC = invTTC;

      r.invoiceId = inv.id || null;
      r.invoiceNumber = inv.number || "";

      if (inv.paid) {
        r.status = "Payée";
        r.statusType = "paid";
      } else {
        r.status = "À payer";
        r.statusType = "due";
      }
    }
  });

  // 🔵 Facture de résiliation éventuelle
  const closureInvoice = docs.find(
    (d) =>
      d.type === "facture" &&
      d.contractId === contract.id &&
      d.prestations &&
      d.prestations.some((p) => p.kind === "contrat_resiliation"),
  );

  if (closureInvoice) {
    const invHT = Number(closureInvoice.subtotal || closureInvoice.total || 0);
    const invTVA = Number(closureInvoice.tvaAmount || 0);
    const invTTC = Number(
      closureInvoice.totalTTC || closureInvoice.total || invHT + invTVA,
    );

    rows.push({
      index: rows.length + 1,
      date: closureInvoice.date ? closureInvoice.date.slice(0, 10) : "",
      amountHT: invHT,
      amountTVA: invTVA,
      amountTTC: invTTC,
      status: "Résiliation",
      statusType: "closure",
      invoiceId: closureInvoice.id || null,
      invoiceNumber: closureInvoice.number || "",
    });
  }

  // 🎨 Ajustement des couleurs uniquement pour les contrats SYNDIC
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = new Date(todayISO + "T00:00:00");

  if (clientType === "syndic") {
    rows.forEach((r) => {
      const d = new Date(r.date + "T00:00:00");
      if (isNaN(d.getTime())) return;

      // On ne touche pas à la ligne de résiliation
      if (r.statusType === "closure") {
        return;
      }

      // Pas de facture liée → prévisionnel
      if (!r.invoiceId) {
        r.statusType = "forecast";
        r.status = "Prévisionnel";
        return;
      }

      // Facture payée → déjà vert
      if (r.statusType === "paid") {
        return;
      }

      // Facture non payée
      if (d <= today) {
        r.statusType = "due"; // rouge
        r.status = "À payer";
      } else {
        r.statusType = "forecast"; // gris
        r.status = "Prévisionnel";
      }
    });
  }

  return rows;
}

function renderContractScheduleHTML(rows) {
  if (!rows || !rows.length) {
    return "<p>Aucune échéance calculée pour ce contrat.</p>";
  }

  const hasTVA = rows.some(
    (r) => typeof r.amountTVA === "number" && !isNaN(r.amountTVA),
  );

  let html = `
    <table class="schedule-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Montant HT</th>
          ${hasTVA ? "<th>TVA</th><th>TTC</th>" : ""}
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach((r) => {
    const d = new Date(r.date + "T00:00:00");
    const dateFr = isNaN(d.getTime()) ? r.date : d.toLocaleDateString("fr-FR");

    // Classe de couleur selon le type
    let rowClass = "";
    if (r.statusType === "paid") {
      rowClass = "schedule-row-paid"; // vert
    } else if (r.statusType === "due") {
      rowClass = "schedule-row-due"; // rouge
    } else if (r.statusType === "closure") {
      rowClass = "schedule-row-closure"; // autre couleur
    } else {
      rowClass = "schedule-row-forecast"; // gris léger
    }

    // Texte statut (une seule ligne)
    const parts = [];
    if (r.statusType === "paid") {
      parts.push("Payée");
    } else if (r.statusType === "due") {
      parts.push("À payer");
    } else if (r.statusType === "closure") {
      parts.push("Résiliation");
    } else {
      parts.push("Prévisionnel");
    }

    if (r.invoiceNumber) {
      parts.push(r.invoiceNumber);
    }

    let statusHtml = `
      <div class="schedule-status">
        <span class="schedule-status-text">${parts.join(" · ")}</span>
    `;

    if (r.invoiceId) {
      statusHtml += `
        <button type="button"
                class="schedule-status-btn"
                onclick="openInvoiceFromSchedule('${r.invoiceId}')">
          Voir
        </button>
      `;
    }

    statusHtml += `</div>`;

    html += `
      <tr class="${rowClass}">
        <td>${r.index}</td>
        <td>${dateFr}</td>
        <td class="amount-cell">${r.amountHT.toFixed(2)} €</td>
        ${
          hasTVA
            ? `
        <td class="amount-cell">${r.amountTVA.toFixed(2)} €</td>
        <td class="amount-cell">${r.amountTTC.toFixed(2)} €</td>`
            : ""
        }
        <td class="schedule-status-cell">${statusHtml}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  return html;
}

function initContractsUI() {
  const root = document.getElementById("contractView");
  if (!root) return;

  // ✅ Tous les champs qui influencent le calcul du contrat
  const recalcSelectors = [
    "#ctMode",
    "#ctPassHiver",
    "#ctPassEte",
    "#ctStartDate",
    "#ctDuration",
    "#ctBillingMode",
    "#ctIncludeOpening",
    "#ctIncludeWinter",
    "#ctAirbnb",
    "#ctPoolType",
    "#ctMainService",
    "#ctClientParticulier",
    "#ctClientSyndic",
  ];

  recalcSelectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;

    const isInput = el.tagName === "INPUT";
    const evtName =
      isInput &&
      (el.type === "number" ||
        el.type === "date" ||
        el.type === "checkbox" ||
        el.type === "radio")
        ? "input"
        : "change";

    el.addEventListener(evtName, recomputeContract);
  });

  // synchronisation type de bassin -> prestation principale
  const poolTypeEl = document.getElementById("ctPoolType");
  const mainServiceEl = document.getElementById("ctMainService");

  if (poolTypeEl && mainServiceEl) {
    poolTypeEl.addEventListener("change", () => {
      const v = poolTypeEl.value;
      if (v === "piscine_sel") {
        mainServiceEl.value = "piscine_sel";
      } else if (v === "piscine_chlore") {
        mainServiceEl.value = "piscine_chlore";
      } else {
        mainServiceEl.value = "entretien_jacuzzi";
      }
      recomputeContract();
    });
  }

  // radios type client
  const ctPartRadio = document.getElementById("ctClientParticulier");
  const ctSynRadio = document.getElementById("ctClientSyndic");
  const hiddenType = document.getElementById("ctClientType");

  if (ctPartRadio) {
    ctPartRadio.addEventListener("change", () => {
      if (ctPartRadio.checked) {
        updateContractClientType("particulier");
        if (hiddenType) hiddenType.value = "particulier";
        recomputeContract();
      }
    });
  }

  if (ctSynRadio) {
    ctSynRadio.addEventListener("change", () => {
      if (ctSynRadio.checked) {
        updateContractClientType("syndic");
        if (hiddenType) hiddenType.value = "syndic";
        recomputeContract();
      }
    });
  }

  // état initial
  const initialType = (hiddenType && hiddenType.value) || "particulier";
  updateContractClientType(initialType);

  // 1er calcul pour tout mettre d’aplomb
  recomputeContract();
}

// ================== FACTURATION PRO – CONTRATS ==================

// Nombre de mois entre deux factures selon le mode
function getBillingStepMonths(mode) {
  if (mode === "mensuel") return 1;
  if (mode === "trimestriel") return 3;
  if (mode === "semestriel") return 6;
  // "annuel_50_50" et "annuel" auront un traitement spécifique ailleurs
  return 0;
}

// Combien d'échéances pour ce contrat ?

function getNumberOfInstallments(pricing) {
  const mode = pricing.billingMode || "annuel";

  if (mode === "annuel") return 1;
  if (mode === "annuel_50_50") return 2;

  const dur = Number(pricing.durationMonths || 0);
  const step = getBillingStepMonths(mode);

  if (!dur || !step) return 1;

  // ex : 6 mois / trimestriel → ceil(6/3) = 2
  return Math.max(1, Math.ceil(dur / step));
}

function computeEcheanceNumber(pricing) {
  const total = getNumberOfInstallments(pricing);

  const start = new Date(pricing.startDate + "T00:00:00");
  let step;

  if (pricing.billingMode === "annuel_50_50") {
    const dur = Number(pricing.durationMonths || 0);
    step = dur > 0 ? Math.round(dur / 2) : 1;
  } else {
    step = getBillingStepMonths(pricing.billingMode);
  }

  const next = new Date(pricing.nextInvoiceDate + "T00:00:00");

  const diffMonths =
    (next.getFullYear() - start.getFullYear()) * 12 +
    (next.getMonth() - start.getMonth());

  return Math.min(total, Math.max(1, Math.floor(diffMonths / step) + 1));
}

// ---------- FACTURE INITIALE À LA CRÉATION DU CONTRAT ----------

// Période globale lisible pour le contrat (ex : "mai 2026 à octobre 2026")
function formatContractGlobalPeriod(pr) {
  const startISO = pr.startDate;
  const duration = Number(pr.durationMonths || 0);
  if (!startISO || !duration) return "";

  const start = new Date(startISO + "T00:00:00");
  if (isNaN(start.getTime())) return "";

  const end = new Date(start);
  end.setMonth(end.getMonth() + duration - 1);

  const opts = { month: "long", year: "numeric" };
  const startLabel = start.toLocaleDateString("fr-FR", opts);
  const endLabel = end.toLocaleDateString("fr-FR", opts);

  if (startLabel === endLabel) return startLabel;
  return `${startLabel} à ${endLabel}`;
}

function buildOriginDevisNote(contract) {
  const devisNum =
    contract?.meta?.sourceDevisNumber ||
    contract?.meta?.devisNumber ||
    contract?.sourceDevisNumber ||
    "";

  if (!devisNum) return "";
  return `Facture générée automatiquement à partir du devis ${devisNum}.`;
}

function generateImmediateBilling(contract) {
  const pr = contract.pricing || {};
  const c = contract.client || {};
  const s = contract.site || {};

  const clientType = pr.clientType || "particulier";
  const mode = pr.billingMode || "annuel";

  const totalHT = Number(pr.totalHT) || 0;
  if (totalHT <= 0) return null;

  // 🏢 SYNDIC → jamais de facture immédiate
  if (clientType === "syndic") return null;

  const todayISO = new Date().toISOString().slice(0, 10);
  const startISO = pr.startDate || todayISO;

  // ⛔ Si le contrat commence dans le futur -> pas de facture immédiate
  if (startISO > todayISO) return null;

  // 📅 Date de la facture initiale = date exacte de début
  const invoiceDateISO = startISO;
  const start = new Date(startISO + "T00:00:00");
  if (isNaN(start.getTime())) return null;

  // 📌 Nombre d’échéances prévues
  let n = 1;
  if (mode === "mensuel") n = getNumberOfInstallments(pr); // ex : 12 mois -> 12
  else if (mode === "annuel_50_50") n = 2;
  if (!n || n < 1) n = 1;

  // 💰 Montant de cette facture
  let amountHT = totalHT;
  if (mode === "annuel_50_50") amountHT = totalHT / 2;
  else if (mode === "mensuel") amountHT = totalHT / n;

  const tvaRate = Number(pr.tvaRate) || 0;
  const tvaAmount = amountHT * (tvaRate / 100);
  const totalTTC = amountHT + tvaAmount;

  const number = getNextNumber("facture");

  const moisLabel = monthYearFr(invoiceDateISO); // "décembre 2025"
  const suffixClient = "";

  // Type de service
  const poolType = pr.mainService || "";
  const serviceLabel = poolType.includes("spa")
    ? "Entretien spa / jacuzzi"
    : "Entretien piscine";

  const globalPeriod = formatContractGlobalPeriod(pr); // "mai 2026 à octobre 2026"

  // 🧾 Libellés
  let subject = "";
  let lineDesc = "";

  if (mode === "annuel_50_50") {
    subject = `${serviceLabel} – 1er paiement 50 % (1/2) – saison ${globalPeriod}${suffixClient}`;
    lineDesc = `${serviceLabel} – 1er paiement (50 %) (1/2) pour la saison ${globalPeriod}`;
  } else if (mode === "mensuel") {
  subject = `${serviceLabel} – échéance 1/${n} – mois ${withDeOrDApostrophe(moisLabel)}${suffixClient}`;

lineDesc = `${serviceLabel} – mois ${withDeOrDApostrophe(moisLabel)} – échéance 1/${n} sur la période ${globalPeriod}`;

  } else {
    subject = `${serviceLabel} – règlement initial du contrat${suffixClient}`;
    lineDesc = `${serviceLabel} – règlement initial du contrat d’entretien (${globalPeriod})`;
  }

  const originNote = buildOriginDevisNote(contract);

  // ✅ Notes (PARTICULIER uniquement ici)
  const notes = [
    "Règlement à réception de facture.",
    "Aucun escompte pour paiement anticipé.",
    mode === "annuel_50_50"
      ? "Cette facture correspond au 1er paiement (50 %) du contrat d’entretien (1/2)."
      : mode === "mensuel"
        ? `Cette facture correspond à l’échéance 1/${n} du contrat d’entretien.`
        : "Cette facture correspond au règlement initial du contrat d’entretien.",
    originNote,
    "Les Conditions Générales de Vente sont disponibles sur demande.",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id: generateId("FAC"),
    type: "facture",
    number,
    date: invoiceDateISO,
    validityDate: "",
    subject,

    contractId: contract.id || null,
    contractReference: c.reference || "",

    client: {
      civility: c.civility || "",
      name: c.name || "",
      address: c.address || "",
      phone: c.phone || "",
      email: c.email || "",
    },

    siteCivility: s.civility || "",
    siteName: s.name || "",
    siteAddress: s.address || "",

    prestations: [
      {
        desc: lineDesc,
        detail: "",
        qty: 1,
        price: amountHT,
        total: amountHT,
        unit: "forfait",
        dates: [invoiceDateISO],
        kind: "contrat_echeance_initiale",
      },
    ],

    tvaRate,
    subtotal: amountHT,
    discountRate: 0,
    discountAmount: 0,
    tvaAmount,
    totalTTC,

    notes,

    paid: false,
    paymentMode: "",
    paymentDate: "",
    status: "",
    conditionsType: "particulier",

    createdAt: new Date().toISOString(),
  };
}

function createAutomaticInvoice(contract) {
  const pr = contract.pricing || {};
  const c = contract.client || {};
  const s = contract.site || {};

  const clientType = pr.clientType || "particulier";
  const mode = pr.billingMode || "annuel";

  const totalHT = Number(pr.totalHT) || 0;
  if (totalHT <= 0) return null;

  const startISO = pr.startDate;
  const duration = Number(pr.durationMonths || 0);
  if (!startISO || !duration) return null;

  const start = new Date(startISO + "T00:00:00");
  if (isNaN(start.getTime())) return null;

  // Date de fin de contrat (fin inclusive)
  const contractEnd = new Date(start);
  contractEnd.setMonth(contractEnd.getMonth() + duration);
  contractEnd.setDate(contractEnd.getDate() - 1);

  const totalInstallments = getNumberOfInstallments(pr);
  if (!totalInstallments || totalInstallments < 1) return null;

  const nextISO = pr.nextInvoiceDate;
  if (!nextISO) return null;

  // 🔒 Anti-doublon : facture déjà créée à cette date ?
  const alreadyExists = getAllDocuments().some(
    (d) =>
      d.type === "facture" &&
      d.contractId === contract.id &&
      d.date === nextISO &&
      Array.isArray(d.prestations) &&
      d.prestations.some((p) => p && p.kind === "contrat_echeance"),
  );
  if (alreadyExists) return null;

  const nextDate = new Date(nextISO + "T00:00:00");
  if (isNaN(nextDate.getTime())) return null;

  const number = getNextNumber("facture");
  const todayISO = new Date().toISOString().slice(0, 10);

  const tvaRate = Number(pr.tvaRate) || 0;

  // Type de service
  const poolType = pr.mainService || "";
  let serviceLabel = "Entretien piscine";
  if (
    poolType === "spa" ||
    poolType === "spa_jacuzzi" ||
    poolType === "entretien_jacuzzi"
  ) {
    serviceLabel = "Entretien spa / jacuzzi";
  }

  const globalPeriod = formatContractGlobalPeriod(pr);
  const moisLabel = monthYearFr(nextISO);

  const originNote = buildOriginDevisNote(contract);

  // 🔢 Numéro d’échéance = factures déjà existantes + 1
  const numEcheance = countContractInstallmentInvoices(contract.id) + 1;

  let amountHT = 0;
  let subject = "";
  let lineDesc = "";

  // ============================
  // 🔴 PARTICULIER
  // ============================
  if (clientType === "particulier") {
    if (mode === "annuel_50_50") {
      // 2e paiement (solde)
      amountHT = totalHT / 2;

      subject = `${serviceLabel} – 2e paiement 50 % (2/2) – saison ${globalPeriod}`;
      lineDesc = `${serviceLabel} – 2e paiement (50 %) (2/2) – solde du contrat d’entretien pour la saison ${globalPeriod}`;
    } else if (mode === "mensuel") {
      amountHT = totalHT / totalInstallments;

      subject = `${serviceLabel} – échéance ${numEcheance}/${totalInstallments} – mois ${withDeOrDApostrophe(moisLabel)}`;
      lineDesc = `${serviceLabel} – mois ${withDeOrDApostrophe(moisLabel)} – échéance ${numEcheance}/${totalInstallments} sur la période ${globalPeriod}`;
    } else {
      amountHT = totalHT;

      subject = `${serviceLabel} – règlement du contrat – saison ${globalPeriod}`;
      lineDesc = `${serviceLabel} – règlement du contrat d’entretien pour la saison ${globalPeriod}`;
    }
  }

  // ============================
  // 🔵 SYNDIC (post-payé)
  // ============================
  else {
    amountHT = totalHT / totalInstallments;

    let stepMonths = getBillingStepMonths(mode);
    if (!stepMonths) stepMonths = duration;

    // Reconstruire la période [periodStart, periodEnd] correspondant à nextISO
    let periodStart = new Date(start);
    let periodEnd = null;
    let found = false;

    for (let i = 1; i <= totalInstallments; i++) {
      const endCandidate = new Date(start);
      endCandidate.setMonth(endCandidate.getMonth() + stepMonths * i);
      endCandidate.setDate(0);

      const isoCandidate = endCandidate.toISOString().slice(0, 10);

      if (isoCandidate === nextISO) {
        periodEnd = endCandidate;
        found = true;
        break;
      } else if (isoCandidate < nextISO) {
        periodStart = new Date(endCandidate);
        periodStart.setDate(periodStart.getDate() + 1);
      }
    }

    if (!found || !periodEnd) {
      const prevStart = new Date(nextDate);
      prevStart.setDate(1);
      const prevEnd = new Date(prevStart);
      prevEnd.setMonth(prevStart.getMonth() + 1);
      prevEnd.setDate(0);

      periodStart = prevStart;
      periodEnd = prevEnd;
    }

    if (periodEnd > contractEnd) periodEnd = new Date(contractEnd);

    const startLabel = periodStart.toLocaleDateString("fr-FR");
    const endLabel = periodEnd.toLocaleDateString("fr-FR");

    subject = `${serviceLabel} – échéance ${numEcheance}/${totalInstallments} – prestations du ${startLabel} au ${endLabel}`;
    lineDesc = `${serviceLabel} – échéance ${numEcheance}/${totalInstallments} – prestations réalisées du ${startLabel} au ${endLabel}`;
  }

  const tvaAmount = amountHT * (tvaRate / 100);
  const totalTTC = amountHT + tvaAmount;

  const notes = (
    clientType === "syndic"
      ? [
          "Règlement à 30 jours fin de mois.",
          "Aucun escompte pour paiement anticipé.",
          "En cas de retard de paiement, des pénalités pourront être appliquées ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441-10 du Code de commerce).",
          "Cette facture correspond à la facturation des prestations réalisées sur la période indiquée.",
          originNote,
          "Les Conditions Générales de Vente sont disponibles sur demande.",
        ]
      : [
          "Règlement à réception de facture.",
          "Aucun escompte pour paiement anticipé.",
          mode === "annuel_50_50"
            ? "Cette facture correspond au 2e paiement (50 %) du contrat d’entretien (2/2)."
            : mode === "mensuel"
              ? `Cette facture correspond à l’échéance ${numEcheance}/${totalInstallments} du contrat d’entretien.`
              : "Cette facture correspond au règlement du contrat d’entretien.",
          originNote,
          "Les Conditions Générales de Vente sont disponibles sur demande.",
        ]
  )
    .filter(Boolean)
    .join("\n");

  const conditionsType = clientType === "syndic" ? "agence" : "particulier";

  return {
    id: generateId("FAC"),
    type: "facture",
    number,
    date: nextISO,
    validityDate: "",

    subject,

    contractId: contract.id || null,
    contractReference: c.reference || "",

    client: {
      civility: c.civility || "",
      name: c.name || "",
      address: c.address || "",
      phone: c.phone || "",
      email: c.email || "",
    },

    siteCivility: s.civility || "",
    siteName: s.name || "",
    siteAddress: s.address || "",

    prestations: [
      {
        desc: lineDesc,
        detail: "",
        qty: 1,
        price: amountHT,
        total: amountHT,
        unit: "forfait",
        dates: [],
        kind: "contrat_echeance",
      },
    ],

    tvaRate,
    subtotal: amountHT,
    discountRate: 0,
    discountAmount: 0,
    tvaAmount,
    totalTTC,

    notes,
    paid: false,
    paymentMode: "",
    paymentDate: "",
    status: "",
    conditionsType,

    createdAt: todayISO,
    updatedAt: todayISO,
  };
}

function createDevisFromCurrentContract() {
  if (!currentContractId) {
    showConfirmDialog({
      title: "Aucun contrat",
      message: "Enregistre d'abord le contrat avant de créer un devis.",
      confirmLabel: "OK",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  const contract = getContract(currentContractId);
  if (!contract) return;

  const devis = generateDevisFromContract(contract);
  if (!devis) return;

  // Sauvegarde local
  const docs = getAllDocuments();
  docs.push(devis);
  saveDocuments(docs);

  // Firestore
  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(devis);
  }

  // Lier devis → contrat
  if (!contract.meta) contract.meta = {};
  contract.meta.sourceDevisId = devis.id;
  contract.meta.sourceDevisNumber = devis.number;

  // Mise à jour contrat
  const all = getAllContracts().map((c) =>
    c.id === contract.id ? contract : c,
  );
  saveContracts(all);

  if (typeof saveSingleContractToFirestore === "function") {
    saveSingleContractToFirestore(contract);
  }

  // Ouvrir le devis
  if (typeof switchListType === "function") switchListType("devis");
  if (typeof loadDocumentsList === "function") loadDocumentsList();
  if (typeof loadDocument === "function") loadDocument(devis.id);
}

// Combien de factures d'échéance existent déjà pour ce contrat ?
function countContractInstallmentInvoices(contractId) {
  const docs = getAllDocuments();

  // 🔒 Sécurité : on ne compte QUE les factures déjà sauvegardées
  return docs.filter((d) => {
    if (d.type !== "facture") return false;
    if (d.contractId !== contractId) return false;
    if (!Array.isArray(d.prestations)) return false;

    return d.prestations.some(
      (p) =>
        p.kind === "contrat_echeance" ||
        p.kind === "contrat_echeance_initiale",
    );
  }).length;
}


// ---------- FACTURES D’ÉCHÉANCE AUTOMATIQUES ----------

function checkScheduledInvoices() {
  let docs = getAllDocuments();
  const contracts = getAllContracts();
  const todayISO = new Date().toISOString().slice(0, 10);

  contracts.forEach((contract) => {
    if (contract.status === CONTRACT_STATUS.RESILIE) {
      return;
    }
    const pr = contract.pricing || {};
    // ✅ NE RIEN FACTURER tant que le contrat n'est pas signé
    if (!contract.signature) {
      return;
    }

    const clientType = pr.clientType || "particulier";
    const mode = pr.billingMode || "annuel";

    const status = computeContractStatus(contract);
    // ⛔ Si un devis est obligatoire mais pas encore accepté → aucune facture auto
    const devisNeeded = isDevisObligatoireForContract(contract);
    const devisOK = isDevisAcceptedForContract(contract);
    if (devisNeeded && !devisOK) {
      return;
    }

    if (!pr.billingMode) return;

    const totalInstallments = getNumberOfInstallments(pr);
    let installmentsCount = countContractInstallmentInvoices(contract.id);

    // 🧮 Calcul de la fin de contrat (optionnel, tu peux le garder si tu l'utilises ailleurs)
    let limitISO = todayISO;
    if (pr.startDate && pr.durationMonths) {
      const start = new Date(pr.startDate + "T00:00:00");
      if (!isNaN(start.getTime())) {
        const contractEnd = new Date(start);
        contractEnd.setMonth(
          contractEnd.getMonth() + Number(pr.durationMonths || 0),
        );
        contractEnd.setDate(0); // fin du dernier mois
        const endISO = contractEnd.toISOString().slice(0, 10);
        if (endISO < limitISO) {
          limitISO = endISO;
        }
      }
    }

    // 🔁 Rattrapage : uniquement pour les factures dont la date ≤ aujourd'hui
    while (
      pr.nextInvoiceDate &&
      pr.nextInvoiceDate <= todayISO &&
      installmentsCount < totalInstallments
    ) {
      const fac = createAutomaticInvoice(contract);
      if (!fac) break;

      docs.push(fac);
      saveDocuments(docs);

      if (typeof saveSingleDocumentToFirestore === "function") {
        saveSingleDocumentToFirestore(fac);
      }

      installmentsCount++;

      contract.pricing.nextInvoiceDate = computeNextInvoiceDate(contract) || "";
      if (!contract.pricing.nextInvoiceDate) break;
    }
  });

  saveContracts(contracts);
}


function getCurrentAppView() {
  const views = [
    "homeView",
    "listView",
    "formView",
    "contractView",
    "attestationView",
  ];

  return views.find((id) => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("hidden");
  });
}

/* ======================
   SIGNATURE ELECTRONIQUE
====================== */

let signaturePad = null;

// Ajuster la taille réelle du canvas (pour les écrans HDPI)
function resizeSignatureCanvas() {
  const canvas = document.getElementById("signatureCanvas");
  if (!canvas) return;

  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

// Ouvrir la popup de signature (mode devis)

function openSignaturePopup() {
  window.currentContractSignatureMode = false;

  const popup = document.getElementById("signaturePopup");
  const canvas = document.getElementById("signatureCanvas");
  if (!popup || !canvas) {
    console.error("❌ SignaturePopup ou canvas introuvable");
    return;
  }

  popup.classList.remove("hidden");
  resizeSignatureCanvas();

  signaturePad = new SignaturePad(canvas, {
    penColor: "black",
    backgroundColor: "rgba(0,0,0,0)",
  });
}

// Enregistrer la signature dans le devis courant
function saveSignatureToCurrentDocument(dataUrl) {
  if (!currentDocumentId) {
    showConfirmDialog({
      title: "Aucun devis ouvert",
      message:
        "Impossible d'enregistrer la signature : aucun devis n'est en cours d'édition.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === currentDocumentId);
  if (idx === -1) {
    showConfirmDialog({
      title: "Devis introuvable",
      message:
        "Impossible d'enregistrer la signature : le devis n'a pas été retrouvé.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "danger",
      icon: "❌",
    });
    return;
  }

  const doc = docs[idx];

  if (doc.type !== "devis") {
    showConfirmDialog({
      title: "Type de document invalide",
      message:
        "La signature électronique ne peut être appliquée que sur un devis.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "ℹ️",
    });
    return;
  }

  doc.signature = dataUrl;
  doc.signatureDate = new Date().toLocaleDateString("fr-FR");

  docs[idx] = doc;
  saveDocuments(docs);

  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(doc);
  }

  if (typeof setDevisStatus === "function") {
    setDevisStatus(doc.id, "accepte");
  }

  showConfirmDialog({
    title: "Devis signé",
    message:
      "Signature enregistrée.\nLe devis est maintenant marqué comme accepté.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅",
  });

  if (typeof loadDocument === "function") loadDocument(doc.id);
  if (typeof loadDocumentsList === "function") loadDocumentsList();
}

/* ======================
   SIGNATURE CONTRAT SYNDIC
====================== */

// Ouvre la popup de signature mais pour un CONTRAT
function openContractSignature() {
  const popup = document.getElementById("signaturePopup");
  const canvas = document.getElementById("signatureCanvas");
  if (!popup || !canvas) return;

  window.currentContractSignatureMode = true;

  popup.classList.remove("hidden");
  resizeSignatureCanvas();

  signaturePad = new SignaturePad(canvas, {
    penColor: "black",
    backgroundColor: "rgba(0,0,0,0)",
  });
}

// Sauver la signature contrat
function saveContractSignature(dataUrl) {
  if (!currentContractId) {
    showConfirmDialog({
      title: "Aucun contrat ouvert",
      message:
        "Impossible d'enregistrer la signature : aucun contrat n'est en cours d'édition.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️",
    });
    return;
  }

  const list = getAllContracts();
  const idx = list.findIndex((c) => c.id === currentContractId);
  if (idx === -1) {
    showConfirmDialog({
      title: "Contrat introuvable",
      message:
        "Impossible d'enregistrer la signature : le contrat n'a pas été retrouvé.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "danger",
      icon: "❌",
    });
    return;
  }

  const c = list[idx];

  // ✅ Save signature
  c.signature = dataUrl;
  c.signatureDate = new Date().toLocaleDateString("fr-FR");

  list[idx] = c;
  saveContracts(list);

  if (typeof saveSingleContractToFirestore === "function") {
    saveSingleContractToFirestore(c);
  }

  // ✅ Génération factures UNIQUEMENT après signature
  // (sécurité anti doublon)
  const docs = getAllDocuments() || [];
  const hasAnyInvoiceForThisContract = docs.some(
    (d) => d.type === "facture" && d.contractId === c.id,
  );

  if (!hasAnyInvoiceForThisContract) {
    // Lance la logique complète (facture initiale + échéances + rattrapage)
    if (typeof rebuildContractInvoices === "function") {
      rebuildContractInvoices(c);
    } else if (typeof checkScheduledInvoices === "function") {
      // fallback
      c.pricing = c.pricing || {};
      c.pricing.nextInvoiceDate = computeNextInvoiceDate(c) || "";
      saveContracts(list);
      checkScheduledInvoices();
    }
  }

  fillContractForm(c);

  showConfirmDialog({
    title: "Contrat signé",
    message:
      "Signature enregistrée ✅\n\n" +
      (hasAnyInvoiceForThisContract
        ? "Des factures existaient déjà : aucune nouvelle facture n’a été recréée."
        : "La facturation du contrat a été déclenchée automatiquement."),
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✍️",
  });
}


function syncContractsWithDevis(updatedDevis) {
  if (!updatedDevis || !updatedDevis.id) return;

  const allContracts = getAllContracts();
  let changed = false;

  allContracts.forEach((c) => {
    if (c.meta && c.meta.sourceDevisId === updatedDevis.id) {
      c.meta.sourceDevisStatus = updatedDevis.status;
      c.meta.sourceDevisNumber = updatedDevis.number;
      changed = true;
    }
  });

  if (changed) {
    saveContracts(allContracts);

    if (typeof saveSingleContractToFirestore === "function") {
      allContracts.forEach((c) => {
        if (c.meta && c.meta.sourceDevisId === updatedDevis.id) {
          saveSingleContractToFirestore(c);
        }
      });
    }

    if (typeof loadContractsList === "function") {
      loadContractsList();
    }
  }
}

/* ======================
   FOLLOWUP TABLE
====================== */

function renderClientsFollowup() {
  const tbody = document.getElementById("followupClientsBody");
  if (!tbody) return;

  const docs = getAllDocuments() || [];
  const factures = docs.filter((d) => d.type === "facture");
  const unpaid = factures.filter((f) => !f.paid);

  if (!unpaid.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="no-docs-cell">✅ Aucun impayé </td></tr>`;
    return;
  }

  const map = new Map();
  unpaid.forEach((f) => {
    const name = (f?.client?.name || "").trim();
    if (!name) return;

    const amount = Number(f.totalTTC || 0);
    const lateMonths = _lateMonthsFromInvoiceDate(
      f,
      typeof DELAI_REGLEMENT_JOURS !== "undefined" ? DELAI_REGLEMENT_JOURS : 30,
    );

    if (!map.has(name)) {
      map.set(name, {
        name,
        unpaidTotal: 0,
        maxLate: 0,
        lastInvoice: null,
        lastInvoiceDate: null,
      });
    }

    const row = map.get(name);
    row.unpaidTotal += amount;
    row.maxLate = Math.max(row.maxLate, lateMonths);

    const d = new Date(f.date || 0).getTime();
    if (!row.lastInvoiceDate || d > row.lastInvoiceDate) {
      row.lastInvoiceDate = d;
      row.lastInvoice = f;
    }
  });

  let rows = Array.from(map.values());

  const sort = document.getElementById("followupSort")?.value || "amount_desc";
  if (sort === "amount_desc")
    rows.sort((a, b) => b.unpaidTotal - a.unpaidTotal);
  if (sort === "late_desc") rows.sort((a, b) => b.maxLate - a.maxLate);
  if (sort === "name_asc") rows.sort((a, b) => a.name.localeCompare(b.name));

  rows = rows.slice(0, 10);

  tbody.innerHTML = rows
    .map((r) => {
      const inv = r.lastInvoice;
      const invNumber = inv?.number || "—";
      const invDate = inv?.date ? _fmtDateFRSafe(inv.date) : "—";
      const late = r.maxLate;

      return `
      <tr>
        <td><strong>${_escapeHtml(r.name)}</strong></td>
        <td><span class="badge-red">${_fmtEUR(r.unpaidTotal)}</span></td>
        <td>${_escapeHtml(invNumber)}<div style="opacity:.7;font-size:12px;">${_escapeHtml(invDate)}</div></td>
        <td>${late > 0 ? `<span class="badge-late">${late} mois</span>` : "—"}</td>
        <td style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-secondary btn-small" type="button" onclick="openClientSheet('${_escapeHtml(r.name)}')">📇 Fiche</button>
          <button class="btn btn-primary btn-small" type="button" onclick="openClientSheet('${_escapeHtml(r.name)}')">💬 Relancer</button>
          <button class="btn btn-success btn-small" type="button" onclick="followupOpenInvoice('${_escapeHtml(inv?.id || "")}')">📄 Facture</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

function followupOpenInvoice(id) {
  if (!id) return;
  if (typeof loadDocument === "function") {
    openFromHome("facture");
    loadDocument(id);
  }
}

/* ======================
   AUTO YEARS + DATES
====================== */

function fillYearMenu() {
  const docs = getAllDocuments();
  const select = document.getElementById("yearMenu");
  if (!select) return;

  const years = new Set(["2025", "2026", "2027"]);

  docs.forEach((d) => {
    if (d.date) years.add(d.date.split("-")[0]);
  });

  const sorted = Array.from(years).sort();
  select.innerHTML = '<option value="all">Toutes</option>';

  sorted.forEach((y) => {
    select.innerHTML += `<option value="${y}">${y}</option>`;
  });
}

function autoFillDates() {
  document.querySelectorAll("input[type='date']").forEach((input) => {
    // ✅ Ne jamais auto-remplir les "dates de passage"
    if (input.classList.contains("prestation-date")) return;

    // (optionnel) si tu veux aussi éviter d’auto-remplir d’autres champs précis :
    // if (input.id === "validityDate") return;
    // if (input.id === "paymentDate") return;

    if (!input.value) input.value = todayISO();
  });
}

// ================= iPhone : dropdown natif pour "Nom client" =================

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalonePWA() {
  // iOS Safari (ancien) + standard
  return window.navigator.standalone === true ||
    window.matchMedia?.("(display-mode: standalone)")?.matches === true;
}

// doc = instance jsPDF
function getPdfUrl(doc) {
  // ✅ SEULEMENT PWA iOS => datauristring (évite Quick Look)
  if (isIOS() && isStandalonePWA()) return doc.output("datauristring");

  // ✅ Partout ailleurs => bloburl (Safari iOS + PC + Android)
  return doc.output("bloburl");
}




function _fillClientSelectIOS() {
  const sel = document.getElementById("clientNameIOS");
  if (!sel) return;

  const clients = (typeof getClients === "function" ? getClients() : [])
    .filter(c => c && c.name);

  clients.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  // 1) reset
  sel.innerHTML = "";

  // 2) option vide (obligatoire)
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = "— Choisir un client —";
  sel.appendChild(opt0);

  // 3) options clients
  for (const c of clients) {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    sel.appendChild(opt);
  }
}

function _enableIOSClientDropdown() {
  const input = document.getElementById("clientName");
  const sel = document.getElementById("clientNameIOS");
  if (!input || !sel) return;

  if (!isIOS()) return; // PC = rien

  // Remplit la liste iPhone
  _fillClientSelectIOS();

  // ✅ IMPORTANT : on NE CACHE PLUS l'input → tu peux taper à la main
  input.style.display = "block";
  sel.style.display = "block";

  // Quand tu choisis dans la liste => on copie dans l'input
  sel.onchange = () => {
    input.value = sel.value || "";
    if (typeof onClientNameChange === "function") onClientNameChange();
  };

  // (optionnel) si tu tapes à la main, on ne bloque rien
  // ton app continue de bosser avec input.value comme avant
}

/* ======================
   INIT (tu gardes ton window.onload)
====================== */

window.onload = function () {
  loadCustomTemplates();
  loadCustomTexts();

  applyCompanySettingsToUI();

  setTVA(0);
  if (typeof refreshClientDatalist === "function") refreshClientDatalist();
  if (typeof loadYearFilter === "function") loadYearFilter();

  if (typeof switchListType === "function") switchListType("devis");
  if (typeof updateButtonColors === "function") updateButtonColors();
  if (typeof showHome === "function") showHome();

  if (
    typeof checkScheduledInvoices === "function" &&
    typeof countContractInstallmentInvoices === "function"
  ) {
    checkScheduledInvoices();
  }

  const subjectInput = document.getElementById("docSubject");
  if (subjectInput && !subjectInput.dataset.boundManualFlag) {
    subjectInput.addEventListener("input", () => {
      subjectInput.dataset.manualEdited = "1";
    });
    subjectInput.dataset.boundManualFlag = "1";
  }

initFirebase().then(() => {
  if (typeof refreshMicroTVAState === "function") {
    refreshMicroTVAState(false);
  }
});

  if (typeof initContractsUI === "function") initContractsUI();

  // ===============================
  // ✅ CLEAN STARTUP (PROPRE)
  // ===============================
  try { _enableIOSClientDropdown(); } catch(e){}

  // ✅ 1) Nettoie les vieux items cassés
  try { sanitizeManualPlanningItems(); } catch(e){}

  // ✅ 2) Supprime les doublons MAIS une seule fois (migration)
  try {
    const key = "planning_migration_v1_done";
    if (localStorage.getItem(key) !== "1") {
      removePlanningDuplicates();
      localStorage.setItem(key, "1");
    }
  } catch(e){}

  // ✅ 3) Sidebar
  try { renderPlanningSidebar(); } catch(e){ console.error("SIDEBAR ERROR:", e); }


};

/* ======================
   NET STATE
====================== */

window.addEventListener("online", () => {
  console.log("[NET] Reconnexion détectée");
  updateOfflineBadge();
  if (!db) {
    initFirebase()
      .then(processSyncQueue)
      .catch(() => {
        updateOfflineBadge();
      });
  } else {
    processSyncQueue();
  }
});

window.addEventListener("offline", () => {
  console.log("[NET] Passage hors-ligne");
  updateOfflineBadge();
});

/* ======================
   ✅ UN SEUL DOMContentLoaded
====================== */

document.addEventListener("DOMContentLoaded", () => {
  // Anti double-bind (si tu recolle/merge)
  if (document.body.dataset.domReadyBound === "1") return;
  document.body.dataset.domReadyBound = "1";

  // Badge + sync queue
  updateOfflineBadge();
  if (navigator.onLine && db) processSyncQueue();

  // Rapport inputs
  const rapPhotos = document.getElementById("rapPhotosInput");
  if (rapPhotos) rapPhotos.addEventListener("change", _onRapportPhotosChange);

  const rapFiles = document.getElementById("rapFilesInput");
  if (rapFiles) rapFiles.addEventListener("change", _onRapportFilesChange);

  // Dashboard + followup
  if (typeof refreshHomeStats === "function") refreshHomeStats();
  if (typeof renderClientsFollowup === "function") renderClientsFollowup();
if (typeof refreshMicroTVAState === "function") refreshMicroTVAState(false);

// ===============================
// ✅ TVA – BIND UNIQUE (clic user)
// ===============================
if (!window.__tvaUiBound) {
  window.__tvaUiBound = true;

  // Radios devis/facture
  document.getElementById("tva0")?.addEventListener("change", () => {
    if (document.getElementById("tva0")?.checked) setTVA(0, { showAlert: true });
  });
  document.getElementById("tva20")?.addEventListener("change", () => {
    if (document.getElementById("tva20")?.checked) setTVA(20, { showAlert: true });
  });

  // Radios contrat
  document.getElementById("ctTva0")?.addEventListener("change", () => {
    if (document.getElementById("ctTva0")?.checked) setTVA(0, { showAlert: true });
  });
  document.getElementById("ctTva20")?.addEventListener("change", () => {
    if (document.getElementById("ctTva20")?.checked) setTVA(20, { showAlert: true });
  });

  // Si jamais tu as aussi un <select id="tvaRate"> utilisé quelque part :
  document.getElementById("tvaRate")?.addEventListener("change", (e) => {
    // ⚠️ seulement si c'est un vrai select visible manipulé par l'utilisateur
    // sinon tu peux supprimer ce listener
    const v = Number(e.target.value) || 0;
    setTVA(v, { showAlert: true });
  });
}



  // Double clic fiche client
  const docClientInput = document.getElementById("clientName");
  const ctClientInput = document.getElementById("ctClientName");

  if (docClientInput) {
    docClientInput.addEventListener("dblclick", () =>
      openClientSheet(docClientInput.value),
    );
  }
  if (ctClientInput) {
    ctClientInput.addEventListener("dblclick", () =>
      openClientSheet(ctClientInput.value),
    );
  }

// =====================================
// SIGNATURE POPUP – BIND UNIQUE (ROBUSTE)
// =====================================
if (!window.__signaturePopupBound) {
  window.__signaturePopupBound = true;

  // Ouvre la popup quand on clique "Bon pour accord"
  document.addEventListener("click", (e) => {
    const el = e.target;
    if (!el) return;

    const approve =
      el.id === "approveDevis" ||
      el.closest?.("#approveDevis") ||
      el.closest?.('label[for="approveDevis"]');

    if (approve) openSignaturePopup();
  });

  // Clear
  document.addEventListener("click", (e) => {
    const el = e.target;
    if (el && el.id === "signatureClear") {
      signaturePad?.clear();
    }
  });

  // Close
  document.addEventListener("click", (e) => {
    const el = e.target;
    if (el && el.id === "signatureClose") {
      window.currentContractSignatureMode = false;
      document.getElementById("signaturePopup")?.classList.add("hidden");
    }
  });

  // Validate
  document.addEventListener("click", (e) => {
    const el = e.target;
    if (!el || el.id !== "signatureValidate") return;

    if (!signaturePad || signaturePad.isEmpty()) {
      showConfirmDialog?.({
        title: "Signature manquante",
        message: "Merci de signer dans la zone prévue avant de valider.",
        confirmLabel: "OK",
        variant: "warning",
        icon: "✍️",
      });
      return;
    }

    const dataUrl = signaturePad.toDataURL("image/png");

    if (window.currentContractSignatureMode) {
      saveContractSignature(dataUrl);
      window.currentContractSignatureMode = false;
    } else {
      saveSignatureToCurrentDocument(dataUrl);
    }

    document.getElementById("signaturePopup")?.classList.add("hidden");
  });
}

// Auto-fill dates after any click (sans casser la popup signature)
document.addEventListener("click", (e) => {
  const popup = document.getElementById("signaturePopup");
  if (popup && !popup.classList.contains("hidden") && popup.contains(e.target)) {
    return; // ignore les clics dans la popup
  }
  setTimeout(autoFillDates, 50);
});

});









































