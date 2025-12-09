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
  const diff = new Date(a) - new Date(b);
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
    ribHolder: "AquaClim Prestige – Le Blevennec Loïc",
    bankName: "Banque Fictive",
    iban: "FR76 1234 5678 9012 3456 7890 123",
    bic: "FICTFRPPXXX"
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

function saveCompanySettings(settings) {
  const clean = { ...getDefaultCompanySettings(), ...settings };
  try {
    localStorage.setItem(COMPANY_SETTINGS_KEY, JSON.stringify(clean));
  } catch (e) {}
  applyCompanySettingsToUI(clean);
}

function applyCompanySettingsToUI(settings) {
  const s = settings || getCompanySettings();

  document.querySelectorAll(".js-company-name").forEach(el => {
    el.textContent = s.companyName;
  });
  document.querySelectorAll(".js-company-subtitle").forEach(el => {
    el.textContent = s.subtitle;
  });
  document.querySelectorAll(".js-company-legal").forEach(el => {
    el.textContent = s.legalName;
  });
  document.querySelectorAll(".js-company-address").forEach(el => {
    el.textContent = s.address;
  });
  document.querySelectorAll(".js-company-phone").forEach(el => {
    el.textContent = s.phone;
  });
  document.querySelectorAll(".js-company-email").forEach(el => {
    el.textContent = s.email;
  });
  document.querySelectorAll(".js-company-siret").forEach(el => {
    el.textContent = s.siret;
  });
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
    descSyndic: ""
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
      "Nettoyage complet intérieur/extérieur, contrôle évacuation, désinfection et vérification installation. Contrôle températures et rapport gestionnaire."
  },

  // 2. Entretien piscine chlore
  {
     label: "Entretien piscine chlore",
  kind: "piscine_chlore",
  title: "Entretien piscine chlore",
  priceParticulier: 80,
  priceSyndic: 100,
    descParticulier:
      "Analyse de l’eau, nettoyage bassin, contrôle filtration, rinçage et ajustement traitement.",
    descSyndic:
      "Analyse complète, nettoyage bassin, contrôle local technique, pression filtre, rinçage, vérification pompe et rapport gestionnaire."
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
      "Analyse complète, nettoyage, contrôle cellule et production, vérification filtration, réglages boîtier et rapport gestionnaire."
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
      "Nettoyage complet, analyse eau, désinfection, contrôle installation, pompes/chauffage et rapport gestionnaire."
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
      "Nettoyage complet, abaissement contrôlé, purge éventuelle, sécurisation local technique et rapport gestionnaire."
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
      "Redémarrage complet, analyse et réglages, contrôle local technique, étanchéité et rapport gestionnaire."
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
      "Vidange complète, nettoyage cuve/buses, remise en eau, équilibrage et rapport gestionnaire."
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
      "Traitement adapté, suivi filtration, analyse après traitement, rinçage filtre et rapport gestionnaire."
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
      "Vidange complète, nettoyage cuve, contrôle crépines, remplacement charge, rinçage et rapport gestionnaire."
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
      "Démontage, extraction, remplacement roulement, remontage, test et rapport technicien."
  },

  // 11. Remplacement pompe piscine (MO)
  {
    label: "Remplacement pompe piscine (MO)",
    kind: "remplacement_pompe_mo",
    title: "Remplacement pompe piscine",
    priceParticulier: 150,
    priceSyndic: 180,
    descParticulier: "Remplacement pompe",
    descSyndic:
      "Dépose/installation, raccordement, réglages et rapport technicien."
  },

  // 12. Remplacement cellule électrolyseur (MO)
  {
    label: "Remplacement cellule électrolyseur (MO)",
    kind: "remplacement_cellule_mo",
    title: "Remplacement cellule électrolyseur",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier: "Remplacement cellule, contrôle étanchéité.",
    descSyndic:
      "Dépose/installation, test production, réglages, contrôle étanchéité et rapport."
  },

  // 13. Nettoyage local technique
  {
    label: "Nettoyage local technique",
    kind: "nettoyage_local",
    title: "Nettoyage local technique",
    priceParticulier: 30,
    priceSyndic: 50,
    descParticulier:
      "Nettoyage local technique, dépoussiérage et contrôle humidité.",
    descSyndic:
      "Nettoyage complet, dégagement accès appareils, contrôle matériel, ventilation et rapport gestionnaire."
  },

  // 14. Déplacement
  {
    label: "Déplacement",
    kind: "deplacement",
    title: "Déplacement",
    priceParticulier: 50,
    priceSyndic: 50,
    descParticulier: "Forfait déplacement.",
    descSyndic: "Forfait déplacement."
  },

  // 15. Dépannage climatisation
  {
    label: "Dépannage climatisation (horaire)",
    kind: "depannage_clim",
    title: "Diagnostic et dépannage climatisation",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier:
      "Diagnostic, tests électriques, vérification soufflage et remise en service si possible. Hors pièces.",
    descSyndic:
      "Diagnostic complet, contrôle composants, sécurités, soufflage et rapport gestionnaire. Hors pièces."
  },

  // 16. Dépannage piscine
  {
    label: "Dépannage piscine (horaire)",
    kind: "depannage_piscine",
    title: "Diagnostic et dépannage piscine",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier:
      "Diagnostic installation, filtration, pompe, vanne et accessoires. Hors pièces.",
    descSyndic:
      "Diagnostic complet : pompe, filtration, électrolyse, tests fuite/pression et rapport gestionnaire. Hors pièces."
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
      "Diagnostic complet, tests électriques/hydrauliques, recherche fuite/défaut et rapport gestionnaire. Hors pièces."
  },

  // 18. Produits
  {
    label: "Produits",
    kind: "produits",
    title: "",
    priceParticulier: 0,
    priceSyndic: 0,
    descParticulier: "",
    descSyndic: ""
  },

  // 19. Fournitures
  {
    label: "Fournitures",
    kind: "fournitures",
    title: "",
    priceParticulier: 0,
    priceSyndic: 0,
    descParticulier: "",
    descSyndic: ""
  }
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
          "Contrôle des fixations"
        ]
      },
      {
        title: "Unité extérieure",
        items: [
          "Nettoyage du condenseur",
          "Dépoussiérage complet",
          "Contrôle du ventilateur externe",
          "Contrôle des fixations et silentblocs",
          "Contrôle des liaisons frigorifiques"
        ]
      },
      {
        title: "Contrôles électriques & fonctionnement",
        items: [
          "Contrôle des connexions électriques",
          "Contrôle du serrage des borniers",
          "Vérification tensions / intensités",
          "Test des différents modes chaud / froid",
          "Mesure soufflage / reprise",
          "Test global de fonctionnement"
        ]
      }
    ]
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
          "Contrôle de la température soufflée"
        ]
      },
      {
        title: "Tests électriques & composants",
        items: [
          "Contrôle de l’alimentation électrique",
          "Contrôle des protections / disjoncteurs",
          "Test du ventilateur",
          "Vérification du compresseur",
          "Vérification des sondes"
        ]
      },
      {
        title: "Actions réalisées",
        items: [
          "Remise à zéro du système",
          "Nettoyage partiel si nécessaire",
          "Correction du paramétrage",
          "Réparation / remplacement d’éléments",
          "Tests finaux de fonctionnement"
        ]
      },
      {
        title: "Recommandations",
        items: [
          "Conseils d'entretien",
          "Recommandation d'un entretien complet",
          "Conseils d'utilisation optimale"
        ]
      }
    ]
  },

  {
    id: "entretien_piscine",
    label: "Entretien piscine – visite",
    showAnalysis: true,
    sections: [
      {
        title: "Type de traitement",
        items: [
          "Piscine au chlore",
          "Piscine au sel"
        ]
      },
      {
        title: "Préfiltration & skimmers",
        items: [
          "Nettoyage du panier de skimmer",
          "Nettoyage du panier de pompe",
          "Nettoyage du filtre de skimmer",
          "Contrôle du niveau d’eau"
        ]
      },
      {
        title: "Nettoyage du bassin",
        items: [
          "Épuisette surface",
          "Épuisette fond",
          "Brossage des parois",
          "Brossage ligne d’eau",
          "Passage aspirateur manuel / robot"
        ]
      },
      {
        title: "Filtration",
        items: [
          "Contrôle pression manomètre",
          "Contre-lavage du filtre (si sable)",
          "Rinçage filtre",
          "Nettoyage filtre cartouche (si applicable)",
          "Contrôle absence de fuites hydraulique"
        ]
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
          "Réglage électrolyseur (si piscine au sel)"
        ]
      },
      {
        title: "Local technique & sécurité",
        items: [
          "Contrôle visuel local technique",
          "Contrôle coffret électrique",
          "Contrôle programmation filtration",
          "Contrôle général de sécurité"
        ]
      }
    ]
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
          "Brossage des parois"
        ]
      },
      {
        title: "Traitement choc",
        items: [
          "Ajout du produit choc (chlore / sel / oxygène actif)",
          "Ajout de floculant si nécessaire",
          "Augmentation temps de filtration",
          "Activation filtration manuelle"
        ]
      },
      {
        title: "Analyse & corrections",
        items: [
          "Contrôle du pH avant treatment",
          "Correction du pH",
          "Contrôle redox / chlore après traitement",
          "Contrôle salinité (si sel)"
        ]
      },
      {
        title: "Suivi",
        items: [
          "Conseils au client post-traitement",
          "Planification d’un contrôle de suivi si nécessaire"
        ]
      }
    ]
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
          "Contrôle des niveaux"
        ]
      },
      {
        title: "Préfiltre & aspiration",
        items: [
          "Vérification panier pompe",
          "Contrôle étanchéité du couvercle",
          "Contrôle tuyauterie aspiration",
          "Recherche prise d’air éventuelle"
        ]
      },
      {
        title: "Filtration",
        items: [
          "Contrôle pression manomètre",
          "Évaluation état du média filtrant",
          "Contrôle crépines (si possible)",
          "Contrôle filtre cartouche (si applicable)",
          "Contrôle vanne 6 voies",
          "Contrôle absence de fuites"
        ]
      },
      {
        title: "Pompe de filtration",
        items: [
          "Contrôle bruit / vibration",
          "Contrôle débit",
          "Contrôle présence bulles d’air",
          "Vérification amorçage"
        ]
      },
      {
        title: "Équipements annexes",
        items: [
          "Contrôle électrolyseur",
          "Contrôle régulation pH",
          "Contrôle PAC (si présente)",
          "Contrôle coffret électrique"
        ]
      },
      {
        title: "Recommandations",
        items: [
          "Actions suggérées au client",
          "Remplacement / entretien recommandé",
          "Conseils sécurité / usage"
        ]
      }
    ]
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
          "Contrôle coffret électrique"
        ]
      },
      {
        title: "Recherche de panne",
        items: [
          "Contrôle pompe filtration",
          "Contrôle absence de fuite",
          "Contrôle vanne 6 voies",
          "Contrôle pression filtre",
          "Tests aspiration / refoulement"
        ]
      },
      {
        title: "Actions réalisées",
        items: [
          "Purge de l’air",
          "Nettoyage préfiltre",
          "Réparation hydraulique mineure",
          "Correction câblage / connexion",
          "Remplacement élément défectueux"
        ]
      },
      {
        title: "Recommandations",
        items: [
          "Conseils d’usage",
          "Avertissement sur usure",
          "Recommandation d’un entretien régulier"
        ]
      }
    ]
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
          "Démontage pompe / moteur"
        ]
      },
      {
        title: "Remplacement des roulements",
        items: [
          "Extraction des anciens roulements",
          "Nettoyage arbre moteur",
          "Mise en place nouveaux roulements",
          "Graissage si nécessaire"
        ]
      },
      {
        title: "Remontage & tests",
        items: [
          "Remontage moteur",
          "Raccordements hydrauliques",
          "Raccordements électriques",
          "Test en charge",
          "Contrôle absence de vibration",
          "Contrôle absence de fuite"
        ]
      }
    ]
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
          "Déconnexion électrique"
        ]
      },
      {
        title: "Installation nouvelle pompe",
        items: [
          "Mise en place pompe neuve",
          "Alignement et réglages",
          "Collage / raccordement PVC",
          "Branchement électrique",
          "Sécurisation installation"
        ]
      },
      {
        title: "Essais",
        items: [
          "Mise en route installation",
          "Contrôle débit",
          "Contrôle fuite / suintement",
          "Contrôle bruit / vibration",
          "Contrôle fonctionnement filtration"
        ]
      }
    ]
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
          "Mise en sécurité"
        ]
      },
      {
        title: "Pose & collage PVC",
        items: [
          "Mise en place nouvelles vannes / raccords",
          "Collage PVC sous pression",
          "Respect temps de séchage",
          "Mise en pression progressive"
        ]
      },
      {
        title: "Ventilation / aménagement local",
        items: [
          "Installation grille / extracteur d’air",
          "Aération améliorée du local technique",
          "Nettoyage & organisation local",
          "Contrôle sécurité électrique"
        ]
      },
      {
        title: "Tests finaux",
        items: [
          "Contrôle absence de fuite",
          "Contrôle circulation eau",
          "Validation fonctionnement complet"
        ]
      }
    ]
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
          "Nettoyage des repose-têtes"
        ]
      },
      {
        title: "Hydromassage & circulation",
        items: [
          "Contrôle fonctionnement buses hydromassage",
          "Contrôle pompe de circulation",
          "Contrôle absence de fuites",
          "Contrôle niveau d’eau"
        ]
      },
      {
        title: "Traitement & désinfection",
        items: [
          "Mesure pH",
          "Correction pH",
          "Traitement désinfectant (chlore / brome)",
          "Ajout produit anti-calcaire / clarifiant si nécessaire"
        ]
      },
      {
        title: "Contrôles techniques",
        items: [
          "Contrôle tableau de commande",
          "Contrôle chauffage",
          "Contrôle capteurs / sondes",
          "Contrôle éclairage"
        ]
      }
    ]
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
          "Nettoyage ligne d’eau"
        ]
      },
      {
        title: "Entretien & remise en eau",
        items: [
          "Nettoyage filtres",
          "Remplissage du spa",
          "Purge circulation eau",
          "Traitement désinfectant initial",
          "Réglage température"
        ]
      },
      {
        title: "Contrôles finaux",
        items: [
          "Test fonctionnement hydromassage",
          "Test pompe de circulation",
          "Test chauffage",
          "Test éclairage"
        ]
      }
    ]
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
          "Mise en sécurité électrique"
        ]
      },
      {
        title: "Pose électrolyseur",
        items: [
          "Installation nouvelle cellule",
          "Raccordements PVC",
          "Collage et séchage",
          "Branchement électrique sécurisée",
          "Paramétrage de la production"
        ]
      },
      {
        title: "Tests & réglages",
        items: [
          "Test de production de chlore",
          "Contrôle absence de fuite",
          "Contrôle circulation eau",
          "Réglage horloge / mode boost",
          "Explication de fonctionnement au client"
        ]
      }
    ]
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
          "Déconnexion hydraulique et électrique"
        ]
      },
      {
        title: "Installation nouvelle pompe",
        items: [
          "Installation pompe neuve",
          "Alignement et niveau",
          "Raccordements PVC",
          "Branchement électrique",
          "Contrôle débit"
        ]
      },
      {
        title: "Installation PAC",
        items: [
          "Installation PAC à l’extérieur",
          "Raccordements hydrauliques By-pass",
          "Raccordements électriques",
          "Mise en service PAC",
          "Contrôle montée en température"
        ]
      },
      {
        title: "Tests finaux",
        items: [
          "Contrôle absence de fuite",
          "Contrôle bruit / vibration",
          "Contrôle fonctionnement global",
          "Explication client"
        ]
      }
    ]
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

// ================== OFFLINE / SYNC QUEUE ==================

const SYNC_QUEUE_KEY = "acp_sync_queue_v1";

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
    ts: Date.now()
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
  updateOfflineBadge();
}


// ================== FIREBASE / SYNC ==================

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
    appId: "1:305566055348:web:175c174c115ca457bd50e1"
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.firestore();

  try {
    // 1️⃣ SYNC DOCUMENTS (devis / factures)
    const snapshot = await db.collection("documents").get();
    const cloudDocs = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data) cloudDocs.push(data);
    });

    if (cloudDocs.length > 0) {
      localStorage.setItem("documents", JSON.stringify(cloudDocs));
    } else {
      const local = localStorage.getItem("documents");
      if (local) {
        const docs = JSON.parse(local);
        for (const d of docs) {
          if (d.id) {
            await db.collection("documents").doc(d.id).set(d);
          }
        }
      }
    }

    // 2️⃣ SYNC CONTRATS
    await syncContractsWithFirestore();

    // 3️⃣ SYNC CLIENTS
    await syncClientsWithFirestore();

  } catch (e) {
    console.error("Erreur de synchronisation Firestore :", e);
  }

  // 🔄 Rafraîchissement UI
  if (typeof loadDocumentsList === "function") {
    loadDocumentsList();
  }
  if (typeof refreshClientDatalist === "function") {
    refreshClientDatalist();
  }
  // 🔁 Met à jour le filtre des années après la synchro
  if (typeof loadYearFilter === "function") {
    loadYearFilter();
  }
  // 🏠 Met à jour le dashboard CA / impayés etc.
  if (typeof refreshHomeStats === "function") {
    refreshHomeStats();
  }

  computeCA();

  // Mise à jour badge + tentative de vidage de la queue
  updateOfflineBadge();
  if (navigator.onLine) {
    processSyncQueue();
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


// ================== CLIENT (DEVIS / FACTURES) ==================

function onClientNameChange() {
  const input = document.getElementById("clientName");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients();
  const client = clients.find(
    (c) => (c.name || "").trim().toLowerCase() === value
  );
  if (!client) return;

  const addr  = document.getElementById("clientAddress");
  const phone = document.getElementById("clientPhone");
  const email = document.getElementById("clientEmail");

  if (addr)  addr.value  = client.address || "";
  if (phone) phone.value = client.phone   || "";
  if (email) email.value = client.email   || "";

  const civ = document.getElementById("clientCivility");
  if (civ && !civ.value && client.civility) {
    civ.value = client.civility;
  }
}


// Remplit les champs du contrat à partir d'un objet client
function fillContractClientFromObject(client) {
  if (!client) return;

  const civ   = document.getElementById("ctClientCivility");
  const name  = document.getElementById("ctClientName");
  const addr  = document.getElementById("ctClientAddress");
  const phone = document.getElementById("ctClientPhone");
  const email = document.getElementById("ctClientEmail");

  if (civ && !civ.value && client.civility) {
    civ.value = client.civility;
  }

  if (name)  name.value  = client.name    || "";
  if (addr)  addr.value  = client.address || "";
  if (phone) phone.value = client.phone   || "";
  if (email) email.value = client.email   || "";
}

// Quand on tape / choisit un nom dans ctClientName (contrat)
function onContractClientNameChange() {
  const input = document.getElementById("ctClientName");
  if (!input) return;

  const name = (input.value || "").trim();
  if (!name) return;

  const clients = getClients();
  const found = clients.find(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase()
  );

  if (found) {
    fillContractClientFromObject(found);
  }
}

// --- Attestation clim : remplir adresse depuis la liste de clients ---
function onAttClientNameChange() {
  const input = document.getElementById("attClientName");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients ? getClients() : [];
  const client = clients.find(
    c => (c.name || "").trim().toLowerCase() === value
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
    c => (c.name || "").trim().toLowerCase() === value
  );
  if (!client) return;

  fillRapportClientFromObject(client);
}



let currentAttestationId = null;
let currentRapportId = null;
/* ================== ATTESTATIONS & RAPPORTS ================== */

function showAttestations() {
  // ===== Onglets =====
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const tabAttest = document.getElementById("tabAttest");
  if (tabAttest) tabAttest.classList.add("active");

  // ===== Vues =====
  const viewsToHide = ["homeView", "listView", "formView", "contractView"];
  viewsToHide.forEach(id => {
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
  const tabHome     = document.getElementById("tabHome");
  const tabDevis    = document.getElementById("tabDevis");
  const tabContrats = document.getElementById("tabContrats");
  const tabFactures = document.getElementById("tabFactures");
  const tabAttest   = document.getElementById("tabAttest");
  const tabCA       = document.getElementById("tabCA");
  const tabSettings = document.getElementById("tabSettings");

  tabHome     && tabHome.classList.remove("active");
  tabDevis    && tabDevis.classList.remove("active");
  tabContrats && tabContrats.classList.remove("active");
  tabFactures && tabFactures.classList.remove("active");
  tabAttest   && tabAttest.classList.remove("active");
  tabCA       && tabCA.classList.remove("active");
  tabSettings && tabSettings.classList.add("active");

  // vues
  const views = ["homeView", "listView", "formView", "contractView", "attestationView", "settingsView"];
  views.forEach(id => {
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
  setVal("confSubtitle",    s.subtitle);
  setVal("confLegalName",   s.legalName);
  setVal("confSiret",       s.siret);
  setVal("confAddress",     s.address);
  setVal("confPhone",       s.phone);
  setVal("confEmail",       s.email);
  setVal("confRibHolder",   s.ribHolder);
  setVal("confBankName",    s.bankName);
  setVal("confIban",        s.iban);
  setVal("confBic",         s.bic);
}

function saveCompanySettingsFromForm() {
  const getVal = (id) => (document.getElementById(id)?.value || "").trim();

  const settings = {
    companyName: getVal("confCompanyName"),
    subtitle:    getVal("confSubtitle"),
    legalName:   getVal("confLegalName"),
    siret:       getVal("confSiret"),
    address:     getVal("confAddress"),
    phone:       getVal("confPhone"),
    email:       getVal("confEmail"),
    ribHolder:   getVal("confRibHolder"),
    bankName:    getVal("confBankName"),
    iban:        getVal("confIban"),
    bic:         getVal("confBic")
  };

  saveCompanySettings(settings);

  showConfirmDialog({
    title: "Paramètres enregistrés",
    message: "Les informations de l’entreprise ont été mises à jour.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
  });
}



/* ========== ATTESTATION CLIM ========== */

function openClimAttestationGenerator() {
  const overlay = document.getElementById("attestationPopup");
  if (!overlay) return;

  // 👉 on est en création, pas en édition
  currentAttestationId = null;

  // on vide / remet les champs
  const name  = document.getElementById("attClientName");
  const addr  = document.getElementById("attClientAddress");
  const date  = document.getElementById("attDate");
  const units = document.getElementById("attUnits");
  const notes = document.getElementById("attNotes");

  if (name)  name.value  = "";
  if (addr)  addr.value  = "";
  if (date)  date.value  = "";
  if (units) units.value = 1;
  if (notes) notes.value = "";

  overlay.classList.remove("hidden");

  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth;        // petit reflow pour l’animation
    popup.classList.add("show");
  }
}

function openAttestationPopupForEdit(attId) {
  const list = getAllAttestations();
  const rec = list.find(a => a.id === attId);
  if (!rec) return;

  currentAttestationId = rec.id;

  const name  = document.getElementById("attClientName");
  const addr  = document.getElementById("attClientAddress");
  const date  = document.getElementById("attDate");
  const units = document.getElementById("attUnits");
  const notes = document.getElementById("attNotes");

  if (name)  name.value  = rec.clientName  || "";
  if (addr)  addr.value  = rec.clientAddress || "";
  if (date)  date.value  = rec.date        || "";
  if (units) units.value = rec.units != null ? rec.units : 1;
  if (notes) notes.value = rec.notes       || "";

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
  const name  = document.getElementById("attClientName")?.value || "";
  const addr  = document.getElementById("attClientAddress")?.value || "";
  const date  = document.getElementById("attDate")?.value || "";
  const units = document.getElementById("attUnits")?.value || "1";
  const notes = document.getElementById("attNotes")?.value || "";

  const list = getAllAttestations();
  let record;

  if (currentAttestationId) {
    // ✏️ MODE ÉDITION
    const idx = list.findIndex(a => a.id === currentAttestationId);
    if (idx !== -1) {
      record = {
        ...list[idx],
        clientName: name,
        clientAddress: addr,
        date,
        units: Number(units) || 1,
        notes
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
        sourceDocId: currentAttestationSource && currentAttestationSource.id || null,
        sourceDocNumber: currentAttestationSource && currentAttestationSource.number || null
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
      sourceDocId: currentAttestationSource && currentAttestationSource.id || null,
      sourceDocNumber: currentAttestationSource && currentAttestationSource.number || null
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
  const name  = document.getElementById("attClientName")?.value || "";
  const addr  = document.getElementById("attClientAddress")?.value || "";
  const date  = document.getElementById("attDate")?.value || "";
  const units = document.getElementById("attUnits")?.value || "1";
  const notes = document.getElementById("attNotes")?.value || "";

  // 1) on sauvegarde / met à jour dans le localStorage
  saveAttestationFromForm();

  // 2) on récupère l’enregistrement à jour
  const list = getAllAttestations();
  const rec = list
    .slice()
    .reverse()
    .find(a =>
      (a.clientName || "") === name &&
      (a.clientAddress || "") === addr &&
      (a.date || "") === date
    ) || {
      clientName: name,
      clientAddress: addr,
      date,
      units: Number(units) || 1,
      notes
    };

  rec.units = Number(units) || 1;

  // 3) on génère le PDF premium
  generatePDFAttestationFromRecord(rec, mode);

  // on ferme la popup
  closeAttestationPopup();
}

function detectRapportTypeFromDevis(devis) {
  const text = JSON.stringify(devis.prestations || []).toLowerCase();

  if (text.includes("entretien piscine")) return "entretien_piscine";
  if (text.includes("piscine sel")) return "entretien_piscine";
  if (text.includes("chlore")) return "entretien_piscine";
  if (text.includes("traitement choc")) return "traitement_choc";
  if (text.includes("diagnostic filtration")) return "diagnostic_filtration";

  if (text.includes("electrolyseur")) return "installation_electrolyseur";
  if (text.includes("pompe filtration")) return "installation_pompe_pac";
  if (text.includes("roulement")) return "remplacement_roulements";

  if (text.includes("clim") && text.includes("entretien")) return "entretien_clim";
  if (text.includes("clim") && text.includes("diag")) return "depannage_clim";

  // fallback si rien trouvé
  return null;
}

function generateAutoChecklist(rapportType, devis) {
  const template = RAPPORT_TEMPLATES.find(t => t.id === rapportType);
  if (!template) return [];

  const txt = JSON.stringify(devis.prestations || []).toLowerCase();
  let checklist = [];

  template.sections.forEach(section => {
    section.items.forEach(item => {
      const keywords = item.toLowerCase().split(" ").slice(0, 2).join(" ");
      
      const checked = txt.includes(keywords);

      checklist.push({
        text: item,
        checked
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
        message: "Sélectionne d’abord un devis avant de générer un rapport d’intervention.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️"
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
        message: "Impossible de déterminer automatiquement le type de rapport à partir de ce devis.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "⚠️"
      });
    } else {
      alert("Impossible de déterminer automatiquement le type de rapport.");
    }
    return null;
  }

  const tpl = RAPPORT_TEMPLATES.find(t => t.id === typeId) || null;

  // ✅ Checklist "intelligente" à partir du devis
  const flatChecklist = generateAutoChecklist(typeId, devis);

  // on mappe ça sur la structure `sections` utilisée par les rapports
  const checkedSet = new Set(
    flatChecklist.filter(it => it.checked).map(it => it.text)
  );

  const sectionsData = [];
  if (tpl) {
    tpl.sections.forEach(section => {
      const items = section.items.filter(item => {
        // si aucune info → on coche tout
        if (checkedSet.size === 0) return true;
        return checkedSet.has(item);
      });

      if (items.length) {
        sectionsData.push({
          title: section.title,
          items
        });
      }
    });
  }

  const id = (typeof generateId === "function")
    ? generateId("RAP")
    : "RAP-" + Date.now();

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
      chlore: null
    },
    autoGenerated: true,
    createdAt: new Date().toISOString(),
    sourceDocId: devis.id || null,
    sourceDocNumber: devis.number || null
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
        message: "Ouvre d’abord un devis avant de générer un rapport d’intervention.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️"
      });
    } else {
      alert("Aucun devis ouvert. Ouvre d’abord un devis avant de générer un rapport.");
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
        icon: "⚠️"
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
        message: "Le rapport d’intervention ne peut être généré qu’à partir d’un devis.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "🧾"
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
      icon: "📝"
    });
  } else {
    alert("Un rapport d’intervention a été créé pour le devis " + numero + ".");
  }
}


function openPiscineRapportGenerator(docId = null) {
  // 👉 on est en mode "nouveau"
  currentRapportId = null;

  const sel = document.getElementById("rapportType");
  if (!sel) return;

  sel.innerHTML = `<option value="">— Choisir —</option>`;
  RAPPORT_TEMPLATES.forEach(t => {
    sel.innerHTML += `<option value="${t.id}">${t.label}</option>`;
  });

  // on vide les champs
  const name  = document.getElementById("rapClientName");
  const addr  = document.getElementById("rapClientAddress");
  const date  = document.getElementById("rapDate");
  const notes = document.getElementById("rapNotes");
  const ph    = document.getElementById("rapPH");
  const chl   = document.getElementById("rapChlore");

  if (name)  name.value  = "";
  if (addr)  addr.value  = "";
  if (date)  date.value  = "";
  if (notes) notes.value = "";
  if (ph)    ph.value    = "";
  if (chl)   chl.value   = "";

  const checklist = document.getElementById("rapportChecklist");
  if (checklist) checklist.innerHTML = "";

  // 🔹 cacher l’analyse tant qu’on n’a pas choisi "entretien_piscine"
  updateRapportAnalyseVisibility("");

const overlay = document.getElementById("rapportPopup");
  if (!overlay) return;

  overlay.classList.remove("hidden");
  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth;     // pour l’animation
    popup.classList.add("show");
  }
}

function closeRapportPopup() {
  const overlay = document.getElementById("rapportPopup");
  if (!overlay) return;

  const popup = overlay.querySelector(".popup");
  if (popup) popup.classList.remove("show");

  overlay.classList.add("hidden");
  currentRapportId = null;   // 🧹
}

function rebuildRapportChecklist() {
  const type = document.getElementById("rapportType").value;

  // gère affichage bloc analyse
  updateRapportAnalyseVisibility(type);

  const tpl = RAPPORT_TEMPLATES.find(t => t.id === type);
  const box = document.getElementById("rapportChecklist");
  if (!box) return;

  box.innerHTML = "";
  if (!tpl) return;

  // 🔎 si on édite un rapport existant, on récupère ses items cochés
  let checkedSet = null;
  if (currentRapportId) {
    const list = getAllRapports();
    const rec = list.find(r => r.id === currentRapportId);
    if (rec && Array.isArray(rec.sections)) {
      checkedSet = new Set();
      rec.sections.forEach(sec => {
        (sec.items || []).forEach(text => checkedSet.add(text));
      });
    }
  }

  tpl.sections.forEach(section => {
    const div = document.createElement("div");
    div.className = "rapport-section";

    const h = document.createElement("h4");
    h.textContent = section.title;
    div.appendChild(h);

    section.items.forEach(item => {
      const isChecked =
        !checkedSet || checkedSet.size === 0
          ? true              // nouveau rapport → tout coché
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
    const ph  = document.getElementById("rapPH");
    const chl = document.getElementById("rapChlore");
    if (ph)  ph.value  = "";
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




// Ajoute le client du contrat dans la base clients
function addCurrentClientFromContract() {
  const name = (document.getElementById("ctClientName")?.value || "").trim();
  const address = (document.getElementById("ctClientAddress")?.value || "").trim();
  const phone = (document.getElementById("ctClientPhone")?.value || "").trim();
  const email = (document.getElementById("ctClientEmail")?.value || "").trim();
  const civility = (document.getElementById("ctClientCivility")?.value || "").trim();

  if (!name || !address) {
    showConfirmDialog({
      title: "Client incomplet",
      message: "Nom et adresse sont obligatoires pour enregistrer le client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const clients = getClients();

  const existingIdx = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase()
  );

  let clientObj;

  if (existingIdx >= 0) {
    const old = clients[existingIdx];
    clientObj = {
      ...old,
      civility,
      name,
      address,
      phone,
      email
    };
    clients[existingIdx] = clientObj;
  } else {
    const tmp = { civility, name, address, phone, email };
    const id = getClientDocId(tmp);
    clientObj = { ...tmp, id };
    clients.push(clientObj);
  }

  saveClients(clients);
  refreshClientDatalist();

  if (typeof saveSingleClientToFirestore === "function") {
    saveSingleClientToFirestore(clientObj);
  }

  showConfirmDialog({
    title: "Client enregistré",
    message: "Ce client a été enregistré dans la base.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
  });
}


// ================== CLIENTS POUR CONTRATS ==================

function fillContractClientFromObject(client) {
  if (!client) return;

  const civ   = document.getElementById("ctClientCivility");
  const name  = document.getElementById("ctClientName");
  const addr  = document.getElementById("ctClientAddress");
  const phone = document.getElementById("ctClientPhone");
  const email = document.getElementById("ctClientEmail");

  if (civ && !civ.value && client.civility) {
    civ.value = client.civility;
  }
  if (name)  name.value  = client.name    || "";
  if (addr)  addr.value  = client.address || "";
  if (phone) phone.value = client.phone   || "";
  if (email) email.value = client.email   || "";
}

// Auto-remplissage quand on choisit un client dans ctClientName
function onContractClientNameChange() {
  const input = document.getElementById("ctClientName");
  if (!input) return;

  const name = (input.value || "").trim();
  if (!name) return;

  const clients = getClients();
  const found = clients.find(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase()
  );

  if (found) {
    fillContractClientFromObject(found);
  }
}

// Ajoute / met à jour le client depuis un contrat
function addCurrentClientFromContract() {
  const name    = (document.getElementById("ctClientName")?.value || "").trim();
  const address = (document.getElementById("ctClientAddress")?.value || "").trim();
  const phone   = (document.getElementById("ctClientPhone")?.value || "").trim();
  const email   = (document.getElementById("ctClientEmail")?.value || "").trim();
  const civ     = (document.getElementById("ctClientCivility")?.value || "").trim();

  if (!name || !address) {
    showConfirmDialog({
      title: "Client incomplet",
      message: "Nom et adresse sont obligatoires pour enregistrer le client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const clients = getClients();
  const existingIdx = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase()
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
      email
    };
    clients[existingIdx] = clientObj;
  } else {
    const tmp = { civility: civ, name, address, phone, email };
    const id  = getClientDocId(tmp);
    clientObj = { ...tmp, id };
    clients.push(clientObj);
  }

  saveClients(clients);
  refreshClientDatalist();

  if (typeof saveSingleClientToFirestore === "function") {
    saveSingleClientToFirestore(clientObj);
  }

  showConfirmDialog({
    title: "Client enregistré",
    message: "Ce client a été enregistré dans la base.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
  });
}

// Supprime le client courant (depuis l'onglet contrat)
function deleteCurrentClientFromContract() {
  const name = (document.getElementById("ctClientName")?.value || "").trim();
  if (!name) return;

  const clients = getClients();
  const existingIdx = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase()
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
      clients.splice(existingIdx, 1);
      saveClients(clients);
      refreshClientDatalist();

      if (typeof deleteClientFromFirestore === "function" && clientToDelete.id) {
        deleteClientFromFirestore(clientToDelete);
      }

      showConfirmDialog({
        title: "Client supprimé",
        message: "Le client a été supprimé de la base.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "success",
        icon: "✅"
      });
    }
  });
}


// Supprimer le client depuis la fiche contrat (en base clients)
function deleteCurrentClientFromContract() {
  const name = (document.getElementById("ctClientName")?.value || "").trim();
  if (!name) return;

  const clients = getClients();

  const existingIdx = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase()
  );
  if (existingIdx < 0) return;

  const clientToDelete = clients[existingIdx];

  showConfirmDialog({
    title: "Supprimer ce client ?",
    message: `Voulez-vous vraiment supprimer "${name}" de la base clients ?`,
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      // 🔴 1. LocalStorage
      clients.splice(existingIdx, 1);
      saveClients(clients);
      refreshClientDatalist();

      // 🔴 2. Firestore
      if (typeof deleteClientFromFirestore === "function") {
        deleteClientFromFirestore(clientToDelete);
      }
    }
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
      icon: "⚠️"
    });
    return;
  }

  const clients = getClients();
  const existingIndex = clients.findIndex(
    c => (c.name || "").toLowerCase() === name.toLowerCase()
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
      email
    };
    clients[existingIndex] = clientObj;
  }

  saveClients(clients);
  refreshClientDatalist();

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
    icon: "✅"
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
    (a.client.name || "").toLowerCase()
      .localeCompare((b.client.name || "").toLowerCase(), "fr", { sensitivity: "base" })
  );

  if (searchText && searchText.trim() !== "") {
    const q = searchText.toLowerCase();
    clientsPopupList = sorted.filter(item =>
      (item.client.name || "").toLowerCase().includes(q) ||
      (item.client.address && item.client.address.toLowerCase().includes(q)) ||
      (item.client.phone && item.client.phone.toLowerCase().includes(q))
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
      filterClientsList(); // pour recharger la liste avec tri + pagination

      showConfirmDialog({
        title: "Client supprimé",
        message: "Le client a bien été supprimé.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "success",
        icon: "✅"
      });
    }
  });
}


function exportClientsCSV() {
  const clients = getClients();
  let csv = "Nom;Adresse;Téléphone;Email\n";

  clients.forEach(c => {
    csv += `${c.name};${c.address};${c.phone || ""};${c.email || ""}\n`;
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

  document.getElementById("editClientForm").classList.remove("hidden");
}
function openAddClientFromList() {
  // Vide les champs
  document.getElementById("editClientName").value = "";
  document.getElementById("editClientAddress").value = "";
  document.getElementById("editClientPhone").value = "";
  document.getElementById("editClientEmail").value = "";

  editingClientIndex = null; // mode création

  // Affiche le formulaire d'édition
  document.getElementById("editClientForm").classList.remove("hidden");
}

function cancelEditClient() {
  document.getElementById("editClientForm").classList.add("hidden");
}

function saveEditedClient() {
  const clients = getClients();

  const newClient = {
    name: document.getElementById("editClientName").value.trim(),
    address: document.getElementById("editClientAddress").value.trim(),
    phone: document.getElementById("editClientPhone").value.trim(),
    email: document.getElementById("editClientEmail").value.trim()
  };

  // Nom obligatoire
  if (!newClient.name) {
    showConfirmDialog({
      title: "Nom obligatoire",
      message: "Merci de renseigner au minimum le nom du client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  let title;
  let message;

  if (editingClientIndex === null || typeof editingClientIndex === "undefined") {
    // ➕ AJOUT NOUVEAU CLIENT
    clients.push(newClient);
    title = "Client ajouté";
    message = "Le client a été ajouté à la base.";
  } else {
    // ✏️ MODIFICATION CLIENT EXISTANT
    clients[editingClientIndex] = newClient;
    title = "Client modifié";
    message = "Les informations du client ont été mises à jour.";
  }

  saveClients(clients);
  refreshClientDatalist();
  openClientsListPopup(); // recharge la liste triée / paginée

  // Popup de succès
  showConfirmDialog({
    title,
    message,
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
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
  const tpl = RAPPORT_TEMPLATES.find(t => t.id === type);
  if (!tpl) return alert("Sélectionne un modèle.");

  const doc = new jspdf.jsPDF();

  doc.setFontSize(18);
  doc.text(tpl.label, 10, 20);

  doc.setFontSize(12);

  let y = 40;
  document.querySelectorAll(".rapport-section").forEach(section => {
    const title = section.querySelector("h4").textContent;
    doc.text(title, 10, y);
    y += 6;

    section.querySelectorAll("input:checked").forEach(cb => {
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

  // Hors ligne ou Firestore HS → on met en file d’attente
  if (!db || !navigator.onLine) {
    enqueueSync({
      collection: "documents",
      action: "set",
      docId: doc.id,
      data: doc
    });
    if (typeof syncContractsWithDevis === "function") {
      syncContractsWithDevis(doc);
    }
    return;
  }

  db.collection("documents")
    .doc(doc.id)
    .set(doc, { merge: true })
    .then(() => {
      processSyncQueue();
    })
    .catch((err) =>
      console.error("Erreur Firestore (saveSingleDocumentToFirestore) :", err)
    );

  if (typeof syncContractsWithDevis === "function") {
    syncContractsWithDevis(doc);
  }
}

// ================== LISTE CLIENTS (popup) ==================
let clientsPopupList = [];      // liste courante affichée dans le popup
let currentClientPage = 1;
const CLIENTS_PER_PAGE = 10;

// ================== HELPERS GÉNÉRAUX ==================

function formatEuro(value) {
  return (
    (Number(value) || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €"
  );
}
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ================== CHIFFRE D'AFFAIRES – DASHBOARD PRO ================== */

function formatEuroCA(v) {
  const n = Number(v) || 0;
  return n.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  });
}

function getCAAvailableYears() {
  const docs = getAllDocuments().filter(d => d.type === "facture" && d.date);
  if (docs.length === 0) {
    return [new Date().getFullYear()];
  }
  let minYear = 9999;
  let maxYear = 0;

  docs.forEach(d => {
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
  const docs = getAllDocuments().filter(d => d.type === "facture" && d.date);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0,
    paidTTC: 0,
    unpaidTTC: 0,
    paidCount: 0,
    unpaidCount: 0
  }));

  docs.forEach(d => {
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
      unpaidCount: 0
    }
  );

  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentMonth = months[currentMonthIndex];

  return {
    year,
    months,
    totals,
    currentMonth,
    availableYears: getCAAvailableYears()
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

  years.forEach(y => {
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
  const summaryCurMonthLabel = document.getElementById("caSummaryCurrentMonthLabel");
  const prevCard = document.getElementById("caSummaryPrevYearCard");
  const summaryDelta = document.getElementById("caSummaryDelta");
  const summaryDeltaPct = document.getElementById("caSummaryDeltaPct");

  if (summaryTotal) summaryTotal.textContent = formatEuroCA(totalTTC);
  if (summaryTotalHT) summaryTotalHT.textContent = "HT : " + formatEuroCA(totalHT);

  if (summaryPaid) summaryPaid.textContent = formatEuroCA(paidTTC);
  if (summaryPaidPct) {
    summaryPaidPct.textContent =
      totalTTC > 0
        ? `${paidPct.toFixed(1)} % du CA payé`
        : "Aucune facture";
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
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
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
        (delta >= 0 ? "▲ " : "▼ ") + deltaPct.toFixed(1) + " % vs " + (selectedYear - 1);

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

    const currentValues = report.months.map(m => m.totalTTC);
    const prevValues = prevReport ? prevReport.months.map(m => m.totalTTC) : [];
    const maxVal = Math.max(
      1,
      ...currentValues,
      ...(prevReport ? prevValues : [0])
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
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
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

  const docs = getAllDocuments().filter(d => d.type === "facture" && d.date);

  let csv = "Numero;Date;Client;HT;TVA;TTC;Payee;Date_reglement;Mode\n";

  docs.forEach(d => {
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
        Number(d.subtotal || 0).toFixed(2).replace(".", ","),
        Number(d.tvaAmount || 0).toFixed(2).replace(".", ","),
        Number(d.totalTTC || 0).toFixed(2).replace(".", ","),
        statut,
        dateReg,
        mode
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
      e
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
}

// ===== ENVOI EMAIL / WHATSAPP POUR UN DOCUMENT =====

let currentSendDoc = null;

function buildSendMessage(doc) {
  const clientName = (doc.client && doc.client.name) ? doc.client.name : "Madame, Monsieur";
  const typeLabel = doc.type === "facture" ? "facture" : "devis";
  const number = doc.number || "";
  const subject = doc.subject || "";
  const total =
    typeof doc.totalTTC === "number"
      ? doc.totalTTC.toFixed(2).replace(".", ",")
      : "";
  const validity =
    doc.type === "devis" && doc.validityDate
      ? fromISO(doc.validityDate).replace(/-/g, "/")
      : null;

  let body = `Bonjour ${clientName},\n\n`;

  if (doc.type === "devis") {
    const status = doc.status || "en_attente";

    if (status === "accepte") {
      body += `Comme convenu, je vous envoie le devis ${number} concernant ${subject}, que nous avons validé ensemble, pour un montant de ${total} € TTC.`;
    } else if (status === "refuse") {
      body += `Je vous renvoie le devis ${number} concernant ${subject}, pour un montant de ${total} € TTC.`;
    } else if (status === "expire") {
      body += `Je vous rappelle le devis ${number} concernant ${subject}, d’un montant de ${total} € TTC.`;
    } else {
      body += `Je vous envoie le devis ${number} concernant ${subject}, pour un montant de ${total} € TTC.`;
    }

    if (validity) {
      body += `\nIl est valable jusqu’au ${validity}.`;
    }
  } else {
    // FACTURE
    if (doc.paid) {
      body += `Veuillez trouver ci-joint votre facture acquittée ${number} concernant ${subject}, d’un montant de ${total} € TTC.`;
    } else {
      body += `Je vous envoie la facture ${number} concernant ${subject}, pour un montant de ${total} € TTC.\nMerci d’en effectuer le règlement dès que possible.`;
    }
  }

  body += `\n\nCordialement,\nLoïc – AquaClim Prestige\n06 03 53 77 73`;

  const mailSubject =
    (doc.type === "facture" ? "Facture " : "Devis ") +
    number +
    (subject ? " – " + subject : "");

  return { mailSubject, body };
}

function openSendPopup() {
  if (!currentDocumentId) {
    showConfirmDialog({
      title: "Aucun document ouvert",
      message: "Ouvre d’abord un devis ou une facture avant de l’envoyer.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️"
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
    const typeLabel = doc.type === "facture" ? "Facture" : "Devis";
    const clientName = doc.client && doc.client.name ? doc.client.name : "";
    infoEl.textContent = `${typeLabel} ${doc.number || ""} – ${clientName}`;
  }

  if (txtArea) {
    txtArea.value = body;
  }

  if (overlay) {
    overlay.classList.remove("hidden");
    const popup = overlay.querySelector(".popup");
    if (popup) {
      void popup.offsetWidth;
      popup.classList.add("show");
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

function sendByEmail() {
  if (!currentSendDoc) return;

  const email = currentSendDoc.client && currentSendDoc.client.email
    ? currentSendDoc.client.email.trim()
    : "";

  if (!email) {
    showConfirmDialog({
      title: "Email manquant",
      message: "Aucune adresse email n’est renseignée pour ce client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const { mailSubject } = buildSendMessage(currentSendDoc);
  const body = document.getElementById("sendMessagePreview").value || "";

  const url =
    "mailto:" + encodeURIComponent(email) +
    "?subject=" + encodeURIComponent(mailSubject) +
    "&body=" + encodeURIComponent(body);

  window.location.href = url;   // ouvre l’app mail

  closeSendPopup();
}

function sendByWhatsApp() {
  if (!currentSendDoc) return;

  const phoneRaw = currentSendDoc.client && currentSendDoc.client.phone
    ? currentSendDoc.client.phone
    : "";

  const phone = phoneRaw.replace(/[^0-9]/g, "");

  if (!phone) {
    showConfirmDialog({
      title: "Téléphone manquant",
      message: "Aucun numéro de téléphone n’est renseigné pour ce client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const body = document.getElementById("sendMessagePreview").value || "";
  const waUrl = "https://wa.me/" + phone + "?text=" + encodeURIComponent(body);

  window.open(waUrl, "_blank");   // ouvre WhatsApp (mobile) ou WhatsApp Web

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
  localStorage.setItem("attestations", JSON.stringify(list));
}

function saveAttestationOnly() {
  saveAttestationFromForm();
  closeAttestationPopup();
}

function autoCreateClimAttestationForInvoice(doc) {
  if (!doc) return;

  const list = getAllAttestations();

  // ⚠️ Si une attestation existe déjà pour cette facture, on ne recrée pas
  if (doc.id && list.some(att => att.sourceDocId === doc.id)) {
    return;
  }

  // Données de base depuis la facture
  const name  = (doc.client && doc.client.name)    || "";
  const addr  = (doc.client && doc.client.address) || "";
  const date  = doc.date || new Date().toISOString().slice(0, 10);

  // 🔢 Nombre d’unités = somme des quantités sur les lignes de clim
  let units = 1;
  if (Array.isArray(doc.prestations)) {
    const climLines = doc.prestations.filter(p =>
      p && ["entretien_clim", "depannage_clim"].includes(p.kind)
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
    sourceDocNumber: doc.number || null
  };

  list.push(record);
  saveAttestations(list);

  // Si tu es sur l’onglet Attestations, on rafraîchit la liste
  if (typeof loadAttestationsList === "function") {
    loadAttestationsList();
  }
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
  localStorage.setItem("rapports", JSON.stringify(list));
}

function saveRapportFromForm() {
  const name   = document.getElementById("rapClientName")?.value || "";
  const addr   = document.getElementById("rapClientAddress")?.value || "";
  const date   = document.getElementById("rapDate")?.value || "";
  const notes  = document.getElementById("rapNotes")?.value || "";
  const typeId = document.getElementById("rapportType")?.value || "";

  const tpl = RAPPORT_TEMPLATES.find(t => t.id === typeId) || null;

  const phInput     = document.getElementById("rapPH");
  const chloreInput = document.getElementById("rapChlore");
  const phValue     = phInput ? phInput.value.trim() : "";
  const chloreValue = chloreInput ? chloreInput.value.trim() : "";

  // Items cochés
  const sectionsData = [];
  document.querySelectorAll("#rapportChecklist .rapport-section").forEach(sectionEl => {
    const title = sectionEl.querySelector("h4")?.textContent || "";
    const items = [];
    sectionEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      if (cb.checked) items.push(cb.dataset.text || "");
    });
    if (items.length) sectionsData.push({ title, items });
  });

  const list = getAllRapports();
  let record;

  if (currentRapportId) {
    // ✏️ on met à jour
    const idx = list.findIndex(r => r.id === currentRapportId);
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
        analysis: {
          ph: phValue || null,
          chlore: chloreValue || null
        }
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
        analysis: {
          ph: phValue || null,
          chlore: chloreValue || null
        },
        createdAt: new Date().toISOString(),
        sourceDocId: currentAttestationSource && currentAttestationSource.id || null,
        sourceDocNumber: currentAttestationSource && currentAttestationSource.number || null
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
      analysis: {
        ph: phValue || null,
        chlore: chloreValue || null
      },
      createdAt: new Date().toISOString(),
      sourceDocId: currentAttestationSource && currentAttestationSource.id || null,
      sourceDocNumber: currentAttestationSource && currentAttestationSource.number || null
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

  list.forEach(r => {
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
  doc.text(`${company.legalName} – ${company.address}`, 12, y); y += 5;
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
    doc.text(record.clientName, 16, yy); yy += 4;
  }
  if (record.clientAddress) {
    const addrLines = doc.splitTextToSize(record.clientAddress, 80);
    addrLines.forEach(line => {
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
    doc.text("Date : " + frDate, 114, yy); yy += 4;
  }
  if (record.typeLabel) {
    doc.text("Type : " + record.typeLabel, 114, yy); yy += 4;
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
 (record.sections || []).forEach(sec => {
  if (y > 260) { doc.addPage(); y = 20; }

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

  (sec.items || []).forEach(txtRaw => {
    if (y > 270) { doc.addPage(); y = 20; }

    // 🔧 on enlève les éventuelles puces déjà présentes dans le texte ("• ", "-", etc.)
    const clean = (txtRaw || "").replace(/^[•●\-–]\s*/, "");

    // pastille bleue
    doc.setFillColor(25, 118, 210);
    doc.circle(14, y - 1.5, 1, "F");

    const wrapped = doc.splitTextToSize(clean, 178);
    wrapped.forEach(line => {
      doc.text(line, 18, y);
      y += 5;
    });
    y += 1;
  });

  y += 3;
});

  // ========= REMARQUES =========
  if (record.notes) {
    if (y > 260) { doc.addPage(); y = 20; }

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
    wrapped.forEach(line => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 5;
    });
  }

  // ========= PIED =========
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "AquaClim Prestige – SIRET XXXXXXXXXXXXX – Entretien & Dépannage climatisation / piscine",
    105,
    287,
    { align: "center" }
  );

  const fileName =
    "rapport-" +
    (record.clientName ? record.clientName.replace(/[^a-z0-9\-]+/gi, "_") : "intervention") +
    ".pdf";

  if (mode === "download") {
    doc.save(fileName);
  } else {
    if (mode === "print") {
      doc.autoPrint();
    }
    const url = doc.output("bloburl");
    window.open(url, "_blank");
  }
}

function openRapportPreview(rapportId) {
  const list = getAllRapports();
  const rec = list.find(r => r.id === rapportId);
  if (!rec) return;
  generatePDFRapportFromRecord(rec, "preview");
}

function printRapport(rapportId) {
  const list = getAllRapports();
  const rec = list.find(r => r.id === rapportId);
  if (!rec) return;
  generatePDFRapportFromRecord(rec, "print");
}


function downloadRapport(rapId) {
  const list = getAllRapports();
  const record = list.find(r => r.id === rapId);
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
      const list = getAllRapports().filter(r => r.id !== rapId);
      saveRapports(list);
      loadRapportsList();
    }
  });
}

function openRapportPopupForEdit(rapportId) {
  const list = getAllRapports();
  const rec = list.find(r => r.id === rapportId);
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
    if (phEl)  phEl.value  = rec.analysis.ph || "";
    if (chlEl) chlEl.value = rec.analysis.chlore || "";
  }

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
    (d) => d.type === type && typeof d.number === "string"
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

  const tabDevis    = document.getElementById("tabDevis");
  const tabFactures = document.getElementById("tabFactures");
  const tabContrats = document.getElementById("tabContrats");
const tabCA       = document.getElementById("tabCA");

  if (tabDevis)    tabDevis.classList.toggle("active", type === "devis");
  if (tabFactures) tabFactures.classList.toggle("active", type === "facture");
  if (tabContrats) tabContrats.classList.toggle("active", type === "contrat");
  if (tabCA)       tabCA.classList.remove("active");

  const listView     = document.getElementById("listView");
  const formView     = document.getElementById("formView");
  const contractView = document.getElementById("contractView");

  const yearFilterContainer   = document.getElementById("yearFilterContainer");
  const exportContainer       = document.getElementById("exportContainer");
  const unpaidFilterContainer = document.getElementById("unpaidFilterContainer");

  const btnDevis    = document.getElementById("createDevis");
  const btnFacture  = document.getElementById("createFacture");
  const btnContract = document.getElementById("createContract");

    // 🔵 MODE CONTRATS
  if (type === "contrat") {
    if (listView)     listView.classList.remove("hidden");
    if (formView)     formView.classList.add("hidden");
    if (contractView) contractView.classList.add("hidden"); // on ouvre le form seulement sur "Modifier" / "Nouveau"

    // Titre de la liste
    const listTitle = document.getElementById("listTitle");
    if (listTitle) listTitle.textContent = "Liste des contrats";

    // Pas de filtres factures en mode contrat
    if (yearFilterContainer)   yearFilterContainer.classList.add("hidden");
    if (exportContainer)       exportContainer.classList.add("hidden");
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
  if (listView)     listView.classList.remove("hidden");
  if (formView)     formView.classList.add("hidden");

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
  return getAllDocuments().filter(d => d.type === "facture");
}

// ================== FILTRE ANNÉE FACTURES ==================

function loadYearFilter() {
  const select = document.getElementById("yearFilter");
  if (!select) return;

  // On remet la valeur par défaut
  select.innerHTML = '<option value="all">Toutes</option>';

  // On prend toutes les FACTURES stockées
  const docs = getAllDocuments().filter(d => d.type === "facture");

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

function setTVA(rate) {
  const seuilMicro = 36800;  // seuil micro → ajuste si besoin
  const currentCA = (typeof computeCA === "function") ? computeCA() : 0;

  // ======================================================
  // 🚫 BLOCAGE TVA 20% si CA < seuil micro-entreprise
  // ======================================================
  if (rate === 20 && currentCA < seuilMicro) {
    alert("Impossible : tant que vous êtes sous le seuil micro-entreprise, la TVA 20% est interdite.");

    // On rétablit 0% dans l’UI
    const tva0 = document.getElementById("tva0");
    const tva20 = document.getElementById("tva20");

    if (tva20) tva20.checked = false;
    if (tva0)  tva0.checked = true;

    rate = 0; // on force la TVA à 0%
  }

  // ======================================================
  // (Ton code original ci-dessous — inchangé)
  // ======================================================

  const tvaInput   = document.getElementById("tvaRate");
  const tvaNote    = document.getElementById("tvaNote");
  const totalLabel = document.getElementById("totalLabel");

  if (tvaInput) {
    tvaInput.value = rate.toString();
  }

  const clientType = getCurrentClientType();

  if (rate === 0) {
    if (clientType === "syndic") {
      if (tvaNote)   tvaNote.textContent   = "";
      if (totalLabel) totalLabel.textContent = "TOTAL HT :";
    } else {
      if (tvaNote)
        tvaNote.textContent = "TVA non applicable, article 293 B du CGI.";
      if (totalLabel) totalLabel.textContent = "NET À PAYER :";
    }
  } else {
    if (tvaNote)    tvaNote.textContent    = "";
    if (totalLabel) totalLabel.textContent = "TOTAL TTC :";
  }

  // ➜ recalcul devis/factures
  calculateTotals();

  // ➜ ET recalcul contrat si on est sur l’onglet contrat
  if (typeof recomputeContract === "function") {
    recomputeContract();
  }
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

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className =
    "btn btn-danger btn-small date-remove-btn no-print";
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
  row.remove();

  // On s'assure qu'il reste toujours au moins 1 ligne de date
  if (container.querySelectorAll(".prestation-date-row").length === 0) {
    const newRow = document.createElement("div");
    newRow.className = "prestation-date-row";

    const input = document.createElement("input");
    input.type = "date";
    input.className = "prestation-date";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className =
      "btn btn-danger btn-small date-remove-btn no-print";
    removeBtn.textContent = "✖";
    removeBtn.onclick = function () {
      removePassageDate(removeBtn);
    };

    newRow.appendChild(input);
    newRow.appendChild(removeBtn);
    container.appendChild(newRow);
  }
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
  onclick="removePrestation(${prestationCount})"
  title="Supprimer cette prestation"
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
    adjustPriceHTMargin(line);   // ➜ AJOUT ICI
  } else {
    block.style.display = "none";
    adjustPriceHTMargin(line);   // retire la classe si besoin
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
  if (!line) return;

  // Dès que l'utilisateur modifie le prix manuellement,
  // on indique que ce n'est plus un prix auto
  line.dataset.autoPrice = "0";
  calculateTotals();
}


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
      base = (clientType === "syndic") ? 120 : 100;
    }

    // 💰 Nouvelle grille : 1 = 100 %, 2 = 85 %, 3+ = 70 %
    if (clientType === "particulier") {
      if (n === 1) {
        price = base;          // 1 clim → 100 %
      } else if (n === 2) {
        price = base * 0.85;   // 2 clims → 85 %
      } else {
        price = base * 0.70;   // 3+ clims → 70 %
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
        "Réduction (" +
        discountRate.toFixed(2).replace(/\.00$/, "") +
        " %) :";
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
          template.kind + "_" +
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
        "Aucun escompte pour paiement anticipé.\n" +
        "En cas de retard de paiement : pénalités au taux légal en vigueur et indemnité forfaitaire de 40 € pour frais de recouvrement (article L441-10 du Code de commerce).";
    }
  } else if (type === "agence") {
    if (cbClientSyn) cbClientSyn.checked = true;
    if (cbClientPart) cbClientPart.checked = false;

    if (notesEl) {
      notesEl.value =
        "Paiement à 30 jours date de facture.\n" +
        "Aucun escompte pour paiement anticipé.\n" +
        "Pénalités de retard : taux légal en vigueur et indemnité forfaitaire de 40 € pour frais de recouvrement (article L441-10 du Code de commerce).";
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
if (civilitySelect) {
  civilitySelect.value = doc.client.civility || "";
}
const siteCivilityEl = document.getElementById("siteCivility");
if (siteCivilityEl) siteCivilityEl.value = doc.siteCivility || "";

  document.getElementById("notes").value = doc.notes || "";

  const subjectInput = document.getElementById("docSubject");
  if (subjectInput) {
    subjectInput.value = doc.subject || "";
  }

  const siteBlock = document.getElementById("siteBlock");
  const siteNameInp = document.getElementById("siteName");
  const siteAddrInp = document.getElementById("siteAddress");
  if (siteNameInp) siteNameInp.value = doc.siteName || "";
  if (siteAddrInp) siteAddrInp.value = doc.siteAddress || "";
  if (siteBlock) {
    siteBlock.style.display = doc.conditionsType === "agence" ? "block" : "none";
  }

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
  // ⚠️ on NE met plus basePrice = p.price ici
  updatePurchaseVisibility(line);
  updatePriceLayout(line);

  const descInput      = line.querySelector(".prestation-desc");
  const qtyInput       = line.querySelector(".prestation-qty");
  const priceInput     = line.querySelector(".prestation-price");
  const unitInput      = line.querySelector(".prestation-unit");
  const templateSelect = line.querySelector(".prestation-template");

  if (descInput)  descInput.value  = p.desc;
  if (qtyInput)   qtyInput.value   = p.qty;
  if (priceInput) priceInput.value = p.price;
  if (unitInput)  unitInput.value  = p.unit || "";

  // ==============================
  // 🎯 Choix du "modèle" (template)
  // ==============================

  // kind réel stocké dans la ligne (contrat_echeance, contrat_normal, etc.)
  let effectiveKind = p.kind || "";

  // Est-ce qu'on a déjà un modèle qui correspond à ce kind ?
  let hasTemplateForKind = PRESTATION_TEMPLATES.some(
    (t) => t.kind === effectiveKind
  );

  // Si ce n'est PAS un modèle connu, mais que la facture est liée à un contrat,
  // on essaie de deviner le bon modèle (piscine chlore / sel / spa) à partir du contrat.
  if (!hasTemplateForKind && doc.type === "facture" && doc.contractId) {
    const linkedContract = getContract(doc.contractId);
    const inferredKind   = getTemplateKindForContract(linkedContract);
    if (inferredKind) {
      effectiveKind      = inferredKind;
      hasTemplateForKind = PRESTATION_TEMPLATES.some(
        (t) => t.kind === effectiveKind
      );
    }
  }

  // 🔁 on remet le bon modèle dans le select
  if (templateSelect) {
    const idx = PRESTATION_TEMPLATES.findIndex(
      (t) => t.kind === effectiveKind
    );
    templateSelect.value = idx >= 0 ? String(idx) : "0";
  }

  // 🧠 On recalcule le "prix de base" à partir du modèle + type client
  const template = PRESTATION_TEMPLATES.find(
    (t) => t.kind === effectiveKind
  );
  if (template) {
    const custom = getCustomPrices();
    const clientType =
      document.getElementById("clientSyndic")?.checked ? "syndic" : "particulier";

    const key = template.kind + "_" + clientType;
    let base =
      custom[key] != null
        ? custom[key]
        : clientType === "syndic"
        ? (template.priceSyndic || 0)
        : (template.priceParticulier || 0);

    line.dataset.basePrice = base.toFixed(2);
  }

  // ⚙️ Dates…
  const datesContainer = line.querySelector(".prestation-dates");
  datesContainer.innerHTML = "";
  const dates = (p.dates && p.dates.length) ? p.dates : [""];
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
    btn.addEventListener("click", () => row.remove());

    row.appendChild(btn);
    datesContainer.appendChild(row);
  });
});

calculateTotals(); // et on laisse faire la logique dégressive normale


  document.getElementById("formTitle").textContent =
    (doc.type === "devis" ? "Devis " : "Facture ") + doc.number;


  try {
    renderHistory(doc);
  } catch (e) {
    console.error("Erreur renderHistory:", e);
  }

// ====================================================
// 🔘 Empêcher le bouton "Bon pour accord" d'être coché 
//      si aucune signature n'existe
// ====================================================
const sigRadio = document.getElementById("signatureRadio");
if (sigRadio) {
    sigRadio.checked = !!doc.signature; // cochée SEULEMENT si déjà signé
}


if (typeof refreshDocumentHealthUI === "function") {
  refreshDocumentHealthUI(doc);
}
}




// ================== SAUVEGARDE / SUPPRESSION / DUPLICATION ==================

function saveDocument() {

// ==== BLOCAGE TVA MICRO ====
try {
  const status = getMicroTvaStatus(); // ton statut actuel
  const selectedRate = Number(document.getElementById("tvaRate").value || 0);

  // Si encore en franchise (CA < 37 500 €) → TVA doit OBLIGATOIREMENT être 0%
  if (status.mode === "franchise" && selectedRate > 0) {

    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "TVA impossible",
        message: 
          "Tu es encore sous le seuil micro (moins de 37 500 €). " +
          "Les devis et factures DOIVENT rester en TVA 0 %. Impossible de sauvegarder en 20 %. ",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "⚠️"
      });
    }
    return; // ❌ STOP, on empêche la sauvegarde
  }

  // Si TVA devenue obligatoire → interdire TVA 0% sur tout nouveau document
  if (status.mode === "obligatoire" && selectedRate === 0) {

    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "TVA obligatoire",
        message:
          "Le seuil micro de 37 500 € a été dépassé.\n" +
          "La TVA de 20 % est désormais obligatoire sur les nouveaux documents.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "⚠️"
      });
    }
    return; // ❌ STOP, on empêche la sauvegarde
  }
} catch (e) {
  console.error("Erreur contrôle TVA :", e);
}
  const clientName = document.getElementById("clientName").value.trim();
  const clientAddress = document.getElementById("clientAddress").value.trim();
  const clientCivility = (document.getElementById("clientCivility")?.value || "").trim();

  const clientPhone = document.getElementById("clientPhone").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const docSubject = (document.getElementById("docSubject")?.value || "").trim();

  // 🔥 Civilité du lieu d’intervention
  const siteCivility = (document.getElementById("siteCivility")?.value || "").trim();
  const siteName = (document.getElementById("siteName")?.value || "").trim();
  const siteAddress = (document.getElementById("siteAddress")?.value || "").trim();

  if (!clientName || !clientAddress) {
    showConfirmDialog({
      title: "Informations client manquantes",
      message: "Merci de renseigner au minimum le nom et l'adresse du client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  if (!docSubject) {
    showConfirmDialog({
      title: "Objet manquant",
      message: "Veuillez saisir l'objet du devis ou de la facture.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const prestations = [];
  let missingPurchase = false;

  document.querySelectorAll(".prestation-line").forEach((line) => {
    const kind = line.dataset.kind || "";

    if (kind === "produits" || kind === "fournitures") {
      const purchaseInput = line.querySelector(".prestation-purchase");
      const purchaseVal = parseFloat(purchaseInput?.value || "0");
      if (!purchaseVal || purchaseVal <= 0) {
        missingPurchase = true;
      }
    }

    const desc = (line.querySelector(".prestation-desc")?.value || "").trim();
    const qty = parseFloat(line.querySelector(".prestation-qty")?.value || "0");
    const price = parseFloat(line.querySelector(".prestation-price")?.value || "0");
    const unit = (line.querySelector(".prestation-unit")?.value || "").trim();
    const detail = line.dataset.detail || "";

    const datesInputs = line.querySelectorAll(".prestation-date");
    const dates = [];
    datesInputs.forEach((i) => {
      const v = i.value.trim();
      if (v) dates.push(v);
    });

    if (desc) {
      prestations.push({
        desc,
        detail,
        qty: qty || 0,
        price: price || 0,
        total: (qty || 0) * (price || 0),
        unit,
        dates,
        kind
      });
    }
  });

  if (missingPurchase) {
    showConfirmDialog({
      title: "Prix d'achat manquant",
      message:
        "Merci de renseigner le prix d'achat pour toutes les prestations Produits / Fournitures.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  if (prestations.length === 0) {
    showConfirmDialog({
      title: "Aucune prestation",
      message: "Ajoute au moins une prestation avant d'enregistrer le document.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const docType = document.getElementById("docType").value;
  const docNumber = document.getElementById("docNumber").value;
  const docDate = document.getElementById("docDate").value;
  const validityDate = document.getElementById("validityDate").value;
  const tvaRate = parseFloat(document.getElementById("tvaRate").value) || 0;
  const notes = document.getElementById("notes").value;
  const existing = currentDocumentId ? getDocument(currentDocumentId) : null;
  const wasPaid = existing ? !!existing.paid : false;   // 🧠 état avant sauvegarde
  // ancien statut (pour détecter le passage en "cloture")
  const oldStatus = existing ? (existing.status || "") : "";


  let conditionsType = existing ? existing.conditionsType || "" : "";
  const cbClientPart = document.getElementById("clientParticulier");
  const cbClientSyn = document.getElementById("clientSyndic");

  if (cbClientPart && cbClientPart.checked) {
    conditionsType = "particulier";
  } else if (cbClientSyn && cbClientSyn.checked) {
    conditionsType = "agence";
  } else {
    conditionsType = "";
  }

  let status = "";
  if (docType === "devis") {
    status = existing && existing.status ? existing.status : "en_attente";
  } else {
    status = existing && existing.status ? existing.status : "";
  }

// ==== DÉTECTION PASSAGE EN "CLOTURÉ" ====
// On mémorise si l'ancien doc était un devis NON clôturé
let wasCloture = existing?.status === "cloture";
let willBeCloture = status === "cloture";

  let paymentMode = "";
  let paymentDate = "";
  let paid = false;

  if (docType === "facture") {
    const sel = document.querySelector('input[name="payMode"]:checked');
    if (sel && sel.value) {
      paymentMode = sel.value;
      const pdInput = document.getElementById("paymentDate");
      const pd = pdInput ? pdInput.value : "";
      paymentDate = pd || docDate;
    } else if (existing && existing.type === "facture") {
      paymentMode = existing.paymentMode || "";
      paymentDate = existing.paymentDate || "";
    }
    paid = !!paymentMode;
  }

  let subtotal = 0;
  prestations.forEach((p) => (subtotal += p.total));

  const discountCb = document.getElementById("discountEnabled");
  const discountInput = document.getElementById("discountPercentInput");

  let discountRate = 0;
  let discountAmount = 0;
  if (discountCb && discountInput && discountCb.checked) {
    discountRate = parseFloat(discountInput.value) || 0;
    if (discountRate < 0) discountRate = 0;
    if (discountRate > 100) discountRate = 100;
    discountAmount = subtotal * (discountRate / 100);
  }

  let baseAfterDiscount = subtotal - discountAmount;
  if (baseAfterDiscount < 0) baseAfterDiscount = 0;

  const tvaAmount = baseAfterDiscount * (tvaRate / 100);
  const totalTTC = baseAfterDiscount + tvaAmount;

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
      email: clientEmail
    },

    // 🔥 on stocke aussi la civilité du lieu
    siteCivility,
    siteName,
    siteAddress,

    prestations,
    tvaRate,
    subtotal,
    discountRate,
    discountAmount,
    tvaAmount,
    totalTTC,
    notes,
    paid,
    paymentMode,
    paymentDate,
    status,
    conditionsType,
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };

  // 📌 Un devis qui vient de passer en "cloture" ?
  const justClotured =
    doc.type === "devis" &&
    oldStatus !== "cloture" &&
    doc.status === "cloture";

  // on gardera ici la référence vers le rapport auto
  let autoRapportRecord = null;


// =======================
// 📌 Création auto rapport intelligent
// =======================
let shouldCreateRapport = false;

// Un devis passe en clôturé → création rapport
if (doc.type === "devis" && !wasCloture && doc.status === "cloture") {
  shouldCreateRapport = true;
}



  // 1) S'il existait déjà un document → on calcule le diff
  if (existing) {
    const diffEntries = computeDocumentDiff(existing, doc) || [];
    diffEntries.forEach((entry) => {
      addHistoryEntry(doc, {
        type: entry.type,
        detail: entry.detail
      });
    });
  } else {
    // 2) Nouveau document → entrée "create"
    addHistoryEntry(doc, {
      type: "create",
      detail: `Document créé (${doc.type === "facture" ? "Facture" : "Devis"} ${doc.number || ""})`
    });
  }


  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) docs[idx] = doc;
  else docs.push(doc);

  saveDocuments(docs);
  saveSingleDocumentToFirestore(doc);

// =======================================
// 📄 Création automatique du rapport depuis devis clôturé
// =======================================
if (shouldCreateRapport && typeof createRapportFromDevis === "function") {

  createRapportFromDevis(doc); // ⚡ Génère le rapport intelligent !!!

  // Option : popup confirmation
  showConfirmDialog({
    title: "Rapport généré",
    message: 
      "Le devis a été clôturé et un rapport d’intervention intelligent a été créé automatiquement.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "📝"
  });
}


  // 💥 Si on vient de passer une facture de NON PAYÉE à PAYÉE depuis le formulaire
  if (
    doc.type === "facture" &&
    typeof wasPaid !== "undefined" &&
    !wasPaid &&
    doc.paid &&
    typeof handleAfterInvoicePaid === "function"
  ) {
    handleAfterInvoicePaid(doc);
  }

  // ===============================
  // 📝 Création automatique d'un rapport depuis un devis clôturé
  // ===============================
  if (justClotured && typeof createRapportFromDevis === "function") {
    try {
      // 1) on crée le rapport intelligent (lié au devis)
      autoRapportRecord = createRapportFromDevis(doc); // doit retourner l'objet rapport

      // 2) on propose de l'ouvrir tout de suite
      if (autoRapportRecord && typeof showConfirmDialog === "function") {
        showConfirmDialog({
          title: "Rapport d’intervention créé",
          message:
            "Le devis a été clôturé et un rapport technique a été généré automatiquement.\n" +
            "Souhaites-tu ouvrir ce rapport maintenant pour le compléter ?",
          confirmLabel: "Ouvrir le rapport",
          cancelLabel: "Plus tard",
          variant: "info",
          icon: "📝",
          // 👉 si ta showConfirmDialog gère des callbacks
          onConfirm: () => {
            if (typeof openRapportPopupForEdit === "function") {
              openRapportPopupForEdit(autoRapportRecord.id);
            } else if (typeof openPiscineRapportGenerator === "function") {
              // fallback : si ton édition utilise cette fonction
              openPiscineRapportGenerator(autoRapportRecord.id);
            }
          },
          onCancel: () => {}
        });
      }
    } catch (e) {
      console.error("Erreur création rapport auto depuis devis cloturé :", e);
    }
  }


  // Mise à jour client SI la fonction existe (évite une erreur JS)
  if (typeof updateClientsFromDocument === "function") {
    updateClientsFromDocument(doc);
  }

  // Pop-up intelligente selon le type de document
  const typeLabel = doc.type === "facture" ? "facture" : "devis";
  const numero = doc.number ? ` ${doc.number}` : "";

  showConfirmDialog({
    title: "Enregistrement réussi",
    message: `Le document ${typeLabel}${numero} a été enregistré avec succès.`,
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
  });

  currentDocumentId = doc.id;
  loadDocumentsList();
  updateTransformButtonVisibility();
  if (typeof refreshHomeStats === "function") {
    refreshHomeStats();
  }

  // 🔄 MAJ dashboard + automate TVA micro
  if (typeof computeCA === "function") {
    computeCA();
  }

  try {
    renderHistory(doc);
  } catch (e) {
    console.error("Erreur renderHistory après sauvegarde:", e);
  }
if (typeof refreshDocumentHealthUI === "function") {
  refreshDocumentHealthUI(doc);
}


}

function deleteCurrent() {
  const typeSelect = document.getElementById("docType");
  const type = typeSelect ? typeSelect.value : "devis";
  const docNumber = document.getElementById("docNumber")?.value || "";
  const subject = (document.getElementById("docSubject")?.value || "").trim() || "Sans objet";

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
      variant: "danger",   // 👈 aussi en rouge + ⚠️ si tu veux
      onConfirm: function () {
        newDocument(type);
      }
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
    onConfirm: function () {
      const idToDelete = currentDocumentId;
      const docs = getAllDocuments().filter((d) => d.id !== idToDelete);
      saveDocuments(docs);

      if (db) {
        db.collection("documents")
          .doc(idToDelete)
          .delete()
          .catch((err) =>
            console.error("Erreur Firestore delete :", err)
          );
      }

      backToList();
    }
  });

computeCA();

}
// Supprimer depuis la LISTE (bouton "Supprimer" dans le tableau)
function deleteDocument(id) {
  const docs = getAllDocuments();
  const doc = docs.find((d) => d.id === id);
  if (!doc) return;

  const typeLabel = doc.type === "devis" ? "DEVIS" : "FACTURE";
  const subject =
    (doc.subject && doc.subject.trim()) ? doc.subject.trim() : "Sans objet";

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
    onConfirm: function () {
      const newDocs = docs.filter((d) => d.id !== id);
      saveDocuments(newDocs);

      if (db) {
        db.collection("documents")
          .doc(id)
          .delete()
          .catch((err) =>
            console.error("Erreur Firestore delete :", err)
          );
      }

      // On rafraîchit juste la liste
      loadDocumentsList();
    }
  });

if (typeof refreshHomeStats === "function") {
    refreshHomeStats();
}

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
      }
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
    onConfirm: function () {
      const idToDelete = currentDocumentId;
      const docs = getAllDocuments().filter((d) => d.id !== idToDelete);
      saveDocuments(docs);

      if (db) {
        db.collection("documents")
          .doc(idToDelete)
          .delete()
          .catch((err) =>
            console.error("Erreur Firestore delete :", err)
          );
      }

      backToList();
    }
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
      icon: "ℹ️"
    });
    return;
  }

  duplicateDocument(currentDocumentId);
}



function backToList() {
  document.getElementById("formView").classList.add("hidden");
  document.getElementById("listView").classList.remove("hidden");
  currentDocumentId = null;
  resetTarifsPanel();
  loadYearFilter();
  loadDocumentsList();
  updateTransformButtonVisibility();
}
function backToContracts() {
  // Pour l’instant : retour à la liste Devis/Factures
  switchListType("devis");
}

// =====================================
// 📊 CALCUL CA ANNUEL / MENSUEL
// =====================================
function computeCA() {
  const docs = getAllDocuments().filter(d => d.type === "facture" && d.date);

  const now   = new Date();
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  let totalYear      = 0;   // CA annuel (affiché)
  let totalPaidYear  = 0;   // CA réellement encaissé → micro-entreprise
  let totalUnpaid    = 0;
  let monthTotal     = 0;

  docs.forEach(f => {
    const amount = Number(f.totalTTC || 0);
    if (!amount) return;

    const isPaid  = !!f.paid;
    const payDate = f.paymentDate || f.date;

    // --------------------------
    // CA affiché = basé sur la DATE FACTURE
    // --------------------------
    if (f.date.startsWith(String(year))) {
      totalYear += amount;

      if (isPaid) totalPaidYear += amount;
      else        totalUnpaid   += amount;

      // mois courant
      if (f.date.startsWith(`${year}-${month}`)) {
        monthTotal += amount;
      }
    }
  });

  // Mise à jour UI
  document.getElementById("dashCATotal").textContent      = "CA total : " + formatEuro(totalYear);
  document.getElementById("dashCAPaid").textContent       = "Payé : " + formatEuro(totalPaidYear);
  document.getElementById("dashCAUnpaid").textContent     = "Impayé : " + formatEuro(totalUnpaid);
  document.getElementById("dashCAMonth").textContent      = "Mois en cours : " + formatEuro(monthTotal);

  // Surveiller le seuil TVA micro
  if (typeof checkMicroTVAThreshold === "function") {
    checkMicroTVAThreshold(false);
  }

  // TRÈS IMPORTANT : renvoyer le CA encaissé (micro)
  return totalPaidYear;
}

// =====================================
// TVA MICRO-ENTREPRISE – SURVEILLANCE SEUIL
// =====================================

// Seuils légaux prestations de services (micro, franchise en base TVA)
// Source officielle : 37 500 € (seuil de base) / 41 250 € (seuil majoré)
const MICRO_TVA_THRESHOLD_BASE = 37500;     // déclenche l'obligation de TVA
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
      mode: parsed.mode || "franchise",           // "franchise" ou "obligatoire"
      activatedYear: parsed.activatedYear || null,
      activatedCA: parsed.activatedCA || 0
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


function saveMicroTVAStatus(status) {
  try {
    localStorage.setItem(MICRO_TVA_STATUS_KEY, JSON.stringify(status));
  } catch (e) {
    console.error("Erreur sauvegarde statut TVA micro :", e);
  }
}

// CA TTC de l'année civile en cours (simple, à partir des factures)

function computeCurrentYearCAForMicro() {
  const docs = getAllDocuments().filter(d => d.type === "facture" && d.date);
  const now = new Date();
  const currentYear = now.getFullYear();

  let totalTTC = 0;

  docs.forEach(f => {
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



function formatEuroFallback(v) {
  if (typeof formatEuro === "function") return formatEuro(v);
  return (Number(v || 0).toFixed(2) + " €");
}

/**
 * Surveille le seuil micro :
 * - si CA >= 37 500 € sur l'année en cours → bascule en "TVA obligatoire"
 * - pas de retour automatique en arrière
 * @param {boolean} showAlert - true = popup d'alerte
 */
function checkMicroTVAThreshold(showAlert = false) {
  const status = getMicroTVAStatus();
  const { year, caTTC } = computeCurrentYearCAForMicro();

  // Petit badge sur le dashboard (optionnel, si tu ajoutes l'élément dans le HTML)
  const badge = document.getElementById("dashTVAMicroBadge");
  if (badge) {
    if (status.mode === "obligatoire") {
      badge.textContent = "TVA activée (20 %)";
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }

  // Si TVA déjà activée une fois → on ne revient jamais en "franchise" tout seul
  if (status.mode === "obligatoire") {
    return;
  }

  // Dépassement du seuil légal micro – prestations de services
  if (caTTC >= MICRO_TVA_THRESHOLD_BASE) {
    const newStatus = {
      mode: "obligatoire",
      activatedYear: year,
      activatedCA: caTTC
    };
    saveMicroTVAStatus(newStatus);

    // Notification uniquement quand on demande (ex : à l’enregistrement d’une facture)
    if (showAlert) {
      if (typeof showConfirmDialog === "function") {
        showConfirmDialog({
          title: "Seuil TVA micro-entreprise dépassé",
          message:
            `Ton chiffre d'affaires ${year} atteint ${formatEuroFallback(caTTC)}.\n\n` +
            `Le seuil légal de franchise en base de TVA (prestations de services) est de ` +
            `${formatEuroFallback(MICRO_TVA_THRESHOLD_BASE)}.\n\n` +
            `À partir de maintenant, la TVA 20 % doit être appliquée sur les nouveaux devis et factures.`,
          confirmLabel: "OK",
          cancelLabel: "",
          variant: "warning",
          icon: "⚠️"
        });
      } else {
        alert(
          "⚠️ Seuil TVA micro dépassé : " +
          formatEuroFallback(caTTC) +
          " (seuil " +
          formatEuroFallback(MICRO_TVA_THRESHOLD_BASE) +
          "). TVA 20 % obligatoire sur les prochaines factures."
        );
      }
    }

    // Force la TVA à 20 % sur le formulaire courant
    if (typeof setTVA === "function") {
      setTVA(20);
    }
    const tva0  = document.getElementById("tva0");
    const tva20 = document.getElementById("tva20");
    if (tva0 && tva20) {
      tva0.checked = false;
      tva20.checked = true;
    }

    // Mise à jour éventuelle du badge (si présent)
    const badge2 = document.getElementById("dashTVAMicroBadge");
    if (badge2) {
      badge2.textContent = "TVA activée (20 %)";
      badge2.style.display = "inline-block";
    }
  }
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
    const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return `${date} ${time}`;
  } catch (e) {
    return "";
  }
}

function mapHistoryTypeLabel(type) {
  switch (type) {
    case "create": return "Création";
    case "delete": return "Suppression";
    case "status": return "Statut";
    case "payment": return "Paiement";
    case "prest_add": return "Prestation ajoutée";
    case "prest_delete": return "Prestation supprimée";
    case "prest_update": return "Prestation modifiée";
    case "field_update": return "Modification";
    default: return "Mise à jour";
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
      docId: doc.id
    });
    // Pas de save ici → le caller sauvegarde le doc complet
    return;
  }

  // 2) Cas : on donne un id → on va chercher le document et on persiste nous-mêmes
  if (typeof docOrId === "string") {
    const docs = getAllDocuments();
    const idx = docs.findIndex(d => d.id === docOrId);
    if (idx === -1) return;

    doc = docs[idx];
    ensureHistoryArray(doc);
    doc.history.push({
      ts,
      type,
      detail,
      docId: doc.id
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

  if (!currentDocument || !Array.isArray(currentDocument.history) || currentDocument.history.length === 0) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "Aucune modification pour le moment.";
    container.appendChild(empty);
    return;
  }

  // ✅ Correction ici : le spread [...]
  const entries = [...currentDocument.history].sort((a, b) => (b.ts || 0) - (a.ts || 0));

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
      detail: `${label} : ${oldVal || "—"} → ${newVal || "—"}`
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
      detail: `${label} : ${oLabel} → ${nLabel}`
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
      detail: `TVA : ${(before.tvaRate || 0)} % → ${(after.tvaRate || 0)} %`
    });
  }

  // Réduction : activation / désactivation / changement de %
  const bDiscountRate = Number(before.discountRate || 0);
  const aDiscountRate = Number(after.discountRate || 0);
  const bDiscountActive = bDiscountRate > 0 && Number(before.discountAmount || 0) > 0;
  const aDiscountActive = aDiscountRate > 0 && Number(after.discountAmount || 0) > 0;

  if (!bDiscountActive && aDiscountActive) {
    diffs.push({
      type: "field_update",
      detail: `Réduction activée : ${aDiscountRate}%`
    });
  } else if (bDiscountActive && !aDiscountActive) {
    diffs.push({
      type: "field_update",
      detail: "Réduction désactivée"
    });
  } else if (bDiscountActive && aDiscountActive && bDiscountRate !== aDiscountRate) {
    diffs.push({
      type: "field_update",
      detail: `Réduction modifiée : ${bDiscountRate}% → ${aDiscountRate}%`
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
    const oldType = before.conditionsType === "agence" ? "Agence / Syndic" : "Particulier";
    const newType = after.conditionsType === "agence" ? "Agence / Syndic" : "Particulier";
    diffs.push({
      type: "field_update",
      detail: `Type de client : ${oldType} → ${newType}`
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

  const beforePrest = Array.isArray(before.prestations) ? before.prestations : [];
  const afterPrest  = Array.isArray(after.prestations)  ? after.prestations  : [];

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
        detail: `Prestation supprimée : ${p.desc || "(sans intitulé)"}`
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
      if (p.qty != null)   lines.push(`Quantité : ${p.qty}`);
      if (p.price != null) lines.push(`Prix unitaire : ${formatEuroFallback(p.price || 0)}`);
      lines.push(`Total : ${formatEuroFallback(total)}`);

      diffs.push({
        type: "prest_add",
        detail: lines.join("\n")
      });
    }
  });

  // Prestations modifiées
  afterMap.forEach((val, key) => {
    if (!beforeMap.has(key)) return;

    const pBefore = beforeMap.get(key).p || {};
    const pAfter  = val.p || {};
    const lines   = [];

    function prestField(label, prop, formatMode) {
      const ov = pBefore[prop];
      const nv = pAfter[prop];
      if (ov == null && nv == null) return;
      if (String(ov) === String(nv)) return;

      if (formatMode === "euro") {
        lines.push(
          `${label} : ${formatEuroFallback(ov || 0)} → ${formatEuroFallback(nv || 0)}`
        );
      } else {
        lines.push(`${label} : ${(ov ?? "—")} → ${(nv ?? "—")}`);
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
          }\n` + lines.join("\n")
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
      detail: `Statut modifié : ${(before.status || "—")} → ${(after.status || "—")}`
    });
  }

  // ================== PAIEMENT ==================
  const bPaid = !!before.paid;
  const aPaid = !!after.paid;

  if (bPaid !== aPaid || (before.paymentMode || "") !== (after.paymentMode || "")) {
    let detail;
    if (!bPaid && aPaid) {
      const mode = after.paymentMode || "inconnu";
      const date = after.paymentDate || after.date || "";
      detail = `Paiement enregistré : ${mode.toUpperCase()} le ${date || "date non renseignée"}`;
    } else if (bPaid && !aPaid) {
      detail = "Retour à impayé";
    } else {
      detail =
        `Mode de paiement modifié : ${(before.paymentMode || "—")} → ${(after.paymentMode || "—")}`;
    }
    diffs.push({
      type: "payment",
      detail
    });
  }

  return diffs;
}




// =====================================
// MICRO TVA – GARDE-FOU 0 % / 20 %
// =====================================

function onMainTvaRadioChange(rate) {
  const status = getMicroTvaStatus();
  const tva0  = document.getElementById("tva0");
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
          MICRO_TVA_THRESHOLD_BASE.toLocaleString('fr-FR') +
          " € encaissés TTC).\n\n" +
          "On reste automatiquement en TVA 0 %.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "info",
        icon: "ℹ️"
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
          MICRO_TVA_THRESHOLD_TTC.toLocaleString('fr-FR') +
          " € encaissés TTC a été dépassé.\n\n" +
          "Les nouvelles factures doivent être émises avec une TVA de 20 %. " +
          "Les contrats déjà en place, eux, ne sont pas modifiés automatiquement.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "⚠️"
      });
    }
    setTVA(20);
    return;
  }

  // ✅ Cas normal : on applique ce que tu as choisi
  setTVA(rate);
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
    add("TVA", "warn", "TVA activée alors que vous êtes en micro-BIC (devrait être 0%).");
  } else {
    add("TVA", "ok", `TVA : ${tvaRate}%`);
  }

  // ================== Dates ==================
  if (doc.type === "devis") {
    if (doc.validityDate && doc.validityDate < doc.date) {
      add("Dates", "crit", "La date de validité est antérieure à la date du devis.");
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
        add("Comportement", "warn", `Devis signé depuis ${daysSince} jours : aucune facture créée.`);
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

/* =======================  ===========================
   Module d’analyse automatique de la santé d’un document
   ================================================================ */

function refreshDocumentHealthUI(doc) {
  if (!doc) return;

  // 1️⃣ On choisit le bon tableau en fonction de l'écran affiché
  let tbody = null;
  const contractView = document.getElementById("contractView");

  if (contractView && !contractView.classList.contains("hidden")) {
    // On est sur un CONTRAT
    tbody = document.getElementById("contractHealthBody");
  } else {
    // On est sur un devis / facture
    tbody = document.getElementById("documentHealthBody");
  }

  if (!tbody) return;
  tbody.innerHTML = "";

  const rows = [];

  // On déduit le contexte une bonne fois pour toutes
  const docType = doc.type || "";
  const isContract = tbody.id === "contractHealthBody";
  const isInvoice  = !isContract && docType === "facture";
  const isQuote    = !isContract && docType === "devis";

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
          detail: `En retard de ${daysLate} jours`
        });
      } else {
        rows.push({
          cat: "Facture impayée",
          status: "🟠 À surveiller",
          detail: daysLate ? `${daysLate} jours depuis émission` : "—"
        });
      }
    } else {
      rows.push({
        cat: "Paiement",
        status: "🟢 Payée",
        detail: paymentDate ? `Réglée le ${paymentDate}` : "Date non renseignée"
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
          detail: `Devis expiré le ${doc.validityDate}`
        });
      } else {
        const diff = Math.floor((validity - today) / (1000 * 60 * 60 * 24));
        rows.push({
          cat: "Validité devis",
          status: "🟢 Valide",
          detail: `Expire dans ${diff} jours`
        });
      }
    } else {
      rows.push({
        cat: "Validité devis",
        status: "⚠️ Manquante",
        detail: "Aucune date de validité définie"
      });
    }
  }

  /* -------- 3. INFORMATIONS CLIENT (tous les types) -------- */
  const clientName =
    (doc.client && doc.client.name) || doc.clientName || "";
  const clientAddress =
    (doc.client && doc.client.address) || doc.clientAddress || "";

  if (!clientName || !clientAddress) {
    rows.push({
      cat: "Client",
      status: "⚠️ Incomplet",
      detail: "Nom ou adresse manquants"
    });
  } else {
    rows.push({
      cat: "Client",
      status: "🟢 OK",
      detail: clientName
    });
  }

  /* -------- 4. PRESTATIONS + TVA (devis + factures uniquement) -------- */
  if (!isContract) {
    // Prestations
    if (!doc.prestations || doc.prestations.length === 0) {
      rows.push({
        cat: "Prestations",
        status: "⚠️ Vide",
        detail: "Aucune prestation ajoutée"
      });
    } else {
      rows.push({
        cat: "Prestations",
        status: "🟢 OK",
        detail: `${doc.prestations.length} prestation(s)`
      });
    }

    // TVA
    const rate = typeof doc.tvaRate === "number" ? doc.tvaRate : 0;
    if (rate === 0) {
      rows.push({
        cat: "TVA",
        status: "🟢 0 %",
        detail: "TVA non applicable"
      });
    } else if (rate === 20) {
      rows.push({
        cat: "TVA",
        status: "🟢 20 %",
        detail: "Taux standard"
      });
    } else {
      rows.push({
        cat: "TVA",
        status: "⚠️ Atypique",
        detail: `${rate} %`
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
        detail: pr.periodLabel || ""
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
        detail
      });
    } else {
      rows.push({
        cat: "Période",
        status: "⚠️ Incomplète",
        detail: "Dates de début / fin manquantes"
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
        detail: `${pr.totalPassages} visites à ${unit} €`
      });
    } else {
      rows.push({
        cat: "Visites",
        status: "⚠️ Manquantes",
        detail: "Total de visites non défini"
      });
    }

    // 5.4 Facturation
    const billingMode = pr.billingMode || "";
    if (billingMode) {
      const mapBilling = {
        mensuel: "Mensuel",
        annuel_50_50: "Annuel 50/50",
        trimestriel: "Trimestriel",
        semestriel: "Semestriel",
        annuel: "Annuel"
      };
      const bLabel = mapBilling[billingMode] || billingMode;
      let detail = bLabel;

      if (pr.nextInvoiceDate) {
        detail += ` – prochaine facture le ${pr.nextInvoiceDate}`;
      }

      rows.push({
        cat: "Facturation",
        status: "🟢 OK",
        detail
      });
    } else {
      rows.push({
        cat: "Facturation",
        status: "⚠️ Non définie",
        detail: "Aucun mode de facturation choisi"
      });
    }

    // 5.5 Options
    const opts = pr.options || {};
    const optList = [];
    if (opts.airbnb || pr.airbnbOption) optList.push("Usage Airbnb +20 %");
    if (opts.openingIncluded || pr.includeOpening) optList.push("Mise en service incluse");
    if (opts.winterIncluded || pr.includeWinter) optList.push("Hivernage inclus");

    rows.push({
      cat: "Options",
      status: optList.length ? "🟢 OK" : "—",
      detail: optList.length
        ? optList.join(" · ")
        : "Aucune option particulière"
    });

    // 5.6 TVA contrat (si tu veux la remonter ici aussi)
    const rateC =
      typeof pr.tvaRate === "number"
        ? pr.tvaRate
        : (typeof doc.tvaRate === "number" ? doc.tvaRate : 0);
    if (rateC === 0) {
      rows.push({
        cat: "TVA",
        status: "🟢 0 %",
        detail: "TVA non applicable"
      });
    } else if (rateC === 20) {
      rows.push({
        cat: "TVA",
        status: "🟢 20 %",
        detail: "Taux standard"
      });
    } else {
      rows.push({
        cat: "TVA",
        status: "⚠️ Atypique",
        detail: `${rateC} %`
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
  let filtered = docs.filter(d => d.type === currentListType);

  // 🔎 FILTRE ANNÉE (AUTO)
  const selectedYear = document.getElementById("yearMenu")?.value || "all";

  if (selectedYear !== "all") {
      filtered = filtered.filter(d => {
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
          (d) => d.date && new Date(d.date).getFullYear() === y
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
        d.totalTTC != null
          ? d.totalTTC.toFixed(2).replace(".", ",")
          : "";

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
  const sortSel  = document.getElementById("sortDocumentsBy");
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
        statusText =
          "🟢 Payée" + (modeLabel ? " (" + modeLabel + ")" : "");
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
            (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (!isNaN(diffDays) && diffDays > DELAI_REGLEMENT_JOURS) {
            isLate = true;
          }
        }

    if (isLate) {
  badgeStatus = "badge-unpaid";   // rouge (déjà existant)
  statusText = "🔴 En retard";
} else {
  badgeStatus = "badge-pending";  // 👉 notre nouvelle classe orange
  statusText = "🟡 En attente";
}

      }

      statutHTML =
        `<span class="badge ${badgeStatus}">${statusText}</span>` +
        (doc.paymentDate && doc.paid
          ? `<div class="status-sub">le ${
              new Date(doc.paymentDate).toLocaleDateString("fr-FR")
            }</div>`
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

  const list = getAllAttestations().slice().sort((a, b) => {
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

  list.forEach(att => {
    const frDate = att.date ? att.date.split("-").reverse().join("/") : "";
    const source = att.sourceDocNumber ? `Facture ${att.sourceDocNumber}` : "";
    const units  = att.units != null ? att.units : "";

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
      const list = getAllAttestations().filter(a => a.id !== attId);
      saveAttestations(list);
      loadAttestationsList();
    }
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
    number: doc.number || null
  };

  // Pré-remplissage des champs de la popup
  const attName  = document.getElementById("attClientName");
  const attAddr  = document.getElementById("attClientAddress");
  const attDate  = document.getElementById("attDate");
  const attUnits = document.getElementById("attUnits");
  const attNotes = document.getElementById("attNotes");

  if (attName)  attName.value  = (doc.client && doc.client.name)    || "";
  if (attAddr)  attAddr.value  = (doc.client && doc.client.address) || "";
  if (attDate)  attDate.value  = doc.date || new Date().toISOString().slice(0, 10);
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

  const blue = { r: 26, g: 116, b: 217 };   // #1a74d9
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

const pillW = 90;      // <<< beaucoup plus petit
const pillH = 16;
const pillRight = 10;  // marge à droite
const pillY = 16;

const pillX = pageWidth - pillRight - pillW;

doc.setFillColor(255, 255, 255);
doc.setDrawColor(255, 255, 255);
doc.roundedRect(pillX, pillY, pillW, pillH, 6, 6, "FD");

doc.setFont("helvetica", "bold");
doc.setFontSize(7);    // plus petit pour tenir dans un petit badge
doc.setTextColor(blue.r, blue.g, blue.b);

// texte sur 2 lignes, centré dans le petit badge
doc.text("ATTESTATION D'ENTRETIEN", pillX + pillW / 2, pillY + 6, { align: "center" });
doc.text("CLIMATISATION",          pillX + pillW / 2, pillY + 12, { align: "center" });




  /* ================= COORDONNÉES ================= */

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  let y = 38;

const company = getCompanySettings();
  doc.text(`${company.legalName} – ${company.address}`, margin, y); y += 5;
  doc.text(`Tél : ${company.phone} – Email : ${company.email}`, margin, y); y += 8;
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
    "Unités entretenues : " +
    (record.units != null ? record.units : 1);
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
    "Contrôle du soufflage et test de fonctionnement"
  ];

  ops.forEach(line => {
    if (y > 270) { doc.addPage(); y = 20; }
    const txt = "• " + line;
    doc.text(txt, margin, y);
    y += 5;
  });

  /* ================= REMARQUES ================= */

  if (record.notes) {
    y += 8;
    if (y > 260) { doc.addPage(); y = 20; }

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
    if (mode === "print") {
      if (doc.autoPrint) doc.autoPrint();
    }
    const url = doc.output("bloburl");
    window.open(url, "_blank");
  }
}


function openAttestationPreview(attId) {
  const list = getAllAttestations();
  const rec = list.find(a => a.id === attId);
  if (!rec) return;
  generatePDFAttestationFromRecord(rec, "preview");
}

function printAttestation(attId) {
  const list = getAllAttestations();
  const rec = list.find(a => a.id === attId);
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

function updateContractsAlert() {
  const alertBox = document.getElementById("contractsAlert");
  const tabBtn   = document.getElementById("tabContrats");
  if (!alertBox || !tabBtn) return;

  const all = getAllContracts();
  const toRenewCount = all.filter(
    (c) => computeContractStatus(c) === CONTRACT_STATUS.A_RENOUVELER
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

  // 🎯 CAS CONTRAT LIÉ À UN DEVIS (tant qu'il n'est ni terminé ni résilié)
  if (meta.sourceDevisNumber) {

    if (devisStatus === "accepte" || devisStatus === "accepted") {
      return `<span class="status-badge status-accepted">En cours</span>`;
    }

    if (devisStatus === "cloture" || devisStatus === "closed") {
      // Côté contrat, on appelle ça "Terminé"
      return `<span class="status-badge status-terminated">Terminé</span>`;
    }

    if (devisStatus === "en_attente" || devisStatus === "pending") {
      return `<span class="status-badge status-pending">En attente</span>`;
    }

    if (
      devisStatus === "refuse"  || devisStatus === "refused" ||
      devisStatus === "expire" || devisStatus === "expired"
    ) {
      return `<span class="status-badge status-refused">Non validé</span>`;
    }

    // fallback si bizarre
    return `<span class="status-badge status-pending">En attente</span>`;
  }

  // 🎯 CONTRAT SANS DEVIS → statut normal
  if (cst === CONTRACT_STATUS.EN_COURS)
    return `<span class="status-badge status-accepted">En cours</span>`;

  if (cst === CONTRACT_STATUS.A_RENOUVELER)
    return `<span class="status-badge status-pending">À renouveler</span>`;

  return `<span class="status-badge status-pending">En attente</span>`;
}


// ---- Popup résiliation ----

let resiliationContractId = null;

function openResiliationPopup(id) {
  resiliationContractId = id;

  const popup   = document.getElementById("resiliationPopup");
  if (!popup) return;

  const whoEl   = document.getElementById("resiliationWho");
  const motifEl = document.getElementById("resiliationMotif");
  const dateEl  = document.getElementById("resiliationDate");

  const todayISO = new Date().toISOString().slice(0, 10);

  const contract = getContract(id);
  if (contract && contract.meta) {
    if (whoEl)   whoEl.value   = contract.meta.resiliationWho   || "client";
    if (motifEl) motifEl.value = contract.meta.resiliationMotif || "";
    if (dateEl)  dateEl.value  = contract.meta.resiliationDate  || "";
  } else {
    if (whoEl)   whoEl.value   = "client";
    if (motifEl) motifEl.value = "";
    if (dateEl)  dateEl.value  = ""; // vide => utilisera todayISO si rien saisi
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

  const whoSelect  = document.getElementById("resiliationWho");
  const motifInput = document.getElementById("resiliationMotif");
  const dateInput  = document.getElementById("resiliationDate");

  const who   = whoSelect ? (whoSelect.value || "client") : "client";
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
  contract.meta.resiliationWho   = who;
  contract.meta.resiliationMotif = motif;
  contract.meta.resiliationDate  = resDateISO;

  // 🔹 Sauvegarde
  const list = getAllContracts();
  const idx  = list.findIndex((c) => c.id === contract.id);
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
        const formView     = document.getElementById("formView");
        if (contractView) contractView.classList.add("hidden");
        if (formView) formView.classList.remove("hidden");

        if (typeof loadDocument === "function") {
          loadDocument(facture.id);
        }
        if (typeof loadDocumentsList === "function") {
          loadDocumentsList();
        }
      }
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
      icon: "✅"
    });
  }
}


// Bouton utilisé dans la liste + dans le formulaire

function resiliateContractFromList(id) {
  // simplement ouvrir la popup, la logique finale est dans confirmResiliationPopup()
  openResiliationPopup(id);
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

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const todayFR = today.toLocaleDateString("fr-FR");

  // 🔹 Contenu HTML de la popup
  const popupHtml = `
    <div class="resiliation-dialog">
      <div class="resiliation-field">
        <label for="resWhoSelect"><strong>Qui résilie ?</strong></label>
        <select id="resWhoSelect" class="resiliation-input">
          <option value="client">Le client</option>
          <option value="prestataire">AquaClim Prestige</option>
        </select>
      </div>

      <div class="resiliation-field">
        <label for="resDateInput">
          <strong>Date de réception du courrier recommandé</strong>
        </label>
        <input
          type="date"
          id="resDateInput"
          class="resiliation-input"
          value="${todayISO}"
        />
        <small>
          Tu peux ajuster cette date si le recommandé a été reçu plus tôt.
          Par défaut : ${todayFR}.
        </small>
      </div>

      <div class="resiliation-field">
        <label for="resMotifInput"><strong>Motif de résiliation</strong></label>
        <textarea
          id="resMotifInput"
          class="resiliation-input"
          rows="3"
          placeholder="Ex : Vente du bien, départ, changement de prestataire, impayés répétés…"
        ></textarea>
      </div>

      <p class="resiliation-note">
        La résiliation prendra effet après validation écrite du client
        (courrier recommandé avec accusé de réception) et sera calculée
        avec un préavis de 30&nbsp;jours à compter de la date saisie ci-dessus.
      </p>
    </div>
  `;

  showConfirmDialog({
    title: "Résiliation du contrat",
    message:
      `Contrat pour « ${escapeHtml(clientName)} »<br><br>` +
      popupHtml,
    confirmLabel: "Confirmer la résiliation",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "⚠️",
    onConfirm: function () {
      const whoEl   = document.getElementById("resWhoSelect");
      const dateEl  = document.getElementById("resDateInput");
      const motifEl = document.getElementById("resMotifInput");

      const who = whoEl ? whoEl.value : "client";

      let dateStr = dateEl ? (dateEl.value || "").trim() : "";
      let resISO;

      if (!dateStr) {
        // sécurité : si l'utilisateur vide le champ -> aujourd'hui
        resISO = todayISO;
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        // AAAA-MM-JJ
        resISO = dateStr;
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        // JJ/MM/AAAA -> on réutilise ta fonction
        const parsed = parseFrenchDate(dateStr);
        resISO = parsed || todayISO;
      } else {
        // format bizarre -> fallback
        resISO = todayISO;
      }

      const motif = motifEl ? motifEl.value.trim() : "";

      // 1) Met à jour le statut + meta résiliation
      contract.status = CONTRACT_STATUS.RESILIE;
      if (!contract.meta) contract.meta = {};
      contract.meta.resiliationDate  = resISO;
      contract.meta.resiliationWho   = who;
      contract.meta.resiliationMotif = motif;

      // 2) Sauvegarde du contrat modifié
      const list = getAllContracts();
      const idx  = list.findIndex((c) => c.id === contract.id);
      if (idx >= 0) {
        list[idx] = contract;
      } else {
        list.push(contract);
      }
      saveContracts(list);
      saveSingleContractToFirestore(contract);

      // 3) Création de la facture de résiliation (prorata + préavis)
      const facture = createTerminationInvoiceForContract(contract);

      // Recharge la liste des contrats (statut RÉSILIÉ visible)
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
            if (typeof switchListType === "function") {
              switchListType("facture");
            }

            const contractView = document.getElementById("contractView");
            const formView     = document.getElementById("formView");
            if (contractView) contractView.classList.add("hidden");
            if (formView)     formView.classList.remove("hidden");

            if (typeof loadDocument === "function") {
              loadDocument(facture.id);
            }
            if (typeof loadDocumentsList === "function") {
              loadDocumentsList();
            }
          }
        });
      } else {
        // Rien à facturer
        showConfirmDialog({
          title: "Contrat résilié",
          message:
            "Le contrat a été résilié.\nAucun montant restant dû n’a été détecté, aucune facture de clôture n’a été générée automatiquement.",
          confirmLabel: "OK",
          cancelLabel: "",
          variant: "success",
          icon: "✅"
        });
      }
    }
  });
}

// === Helpers contrats ===
function getContractListTitle(c) {
  const pr   = c.pricing || {};
  const pool = c.pool    || {};
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
    filtered = filtered.filter(c =>
      computeContractStatus(c) === CONTRACT_STATUS.A_RENOUVELER ||
      computeContractStatus(c) === CONTRACT_STATUS.TERMINE
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
  const sortSel  = document.getElementById("sortDocumentsBy");
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

    const ref        = c.client?.reference || "";
    const clientName = c.client?.name      || "";

    // 🔵 conversion ISO → DD/MM/YYYY
    const startDateISO = c.pricing?.startDate || "";
    const startDateFR  = startDateISO ? formatDateFr(startDateISO) : "";

    const totalHT    = c.pricing?.totalHT != null ? c.pricing.totalHT : 0;

    const statutHTML = renderContractStatusBadge(c);

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
      (status === CONTRACT_STATUS.A_RENOUVELER || status === CONTRACT_STATUS.TERMINE)
        ? `
        <button class="btn btn-primary btn-small" onclick="openRenewPopup('${c.id}')">
          Renouveler
        </button>
        `
        : "";

    const resiliationRow =
      (status === CONTRACT_STATUS.EN_COURS || status === CONTRACT_STATUS.A_RENOUVELER)
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

        ${renewBtn
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

        const title     = getContractListTitle(c);
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
    const hasClimKind = Array.isArray(doc.prestations) &&
      doc.prestations.some(p =>
        p && ["entretien_clim", "depannage_clim"].includes(p.kind)
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
  const id = (typeof generateId === "function")
    ? generateId("FAC")
    : Date.now().toString();

  // Sujet : on reprend celui du devis ou on en fabrique un
  const subject =
    devis.subject ||
    `Facture suite au devis ${devis.number || ""}`;

  // Copie profonde des prestations pour ne pas modifier le devis par erreur
  const prestations = Array.isArray(devis.prestations)
    ? devis.prestations.map(p => ({ ...p }))
    : [];

  const tvaRate        = Number(devis.tvaRate) || 0;
  const subtotal       = Number(devis.subtotal) || 0;
  const discountRate   = Number(devis.discountRate) || 0;
  const discountAmount = Number(devis.discountAmount) || 0;
  const tvaAmount      = Number(devis.tvaAmount) || 0;
  const totalTTC       = Number(devis.totalTTC) || 0;

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
      name:     devis.client?.name     || "",
      address:  devis.client?.address  || "",
      phone:    devis.client?.phone    || "",
      email:    devis.client?.email    || ""
    },

    // Lieu
    siteCivility: devis.siteCivility || "",
    siteName:     devis.siteName     || "",
    siteAddress:  devis.siteAddress  || "",

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
    updatedAt: new Date().toISOString()
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
    if (mode === "virement" || mode === "cheque") {
      doc.paymentDate = doc.paymentDate || doc.date;
    } else {
      doc.paymentDate = doc.date;
    }
  }

  // 💾 On sauvegarde d'abord la facture modifiée
  saveDocuments(docs);

  // ⚠️ Sécurité : on sauvegarde aussi dans Firestore si dispo
  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(doc);
  }

  // -------------------------------------------------------------------
  // 🔗 MISE À JOUR AUTOMATIQUE DU DEVIS LIÉ
  // -------------------------------------------------------------------
  if (doc.type === "facture" && doc.sourceDevisId && typeof setDevisStatus === "function") {

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
  if (doc.type === "facture" && !wasPaid && doc.paid && typeof handleAfterInvoicePaid === "function") {
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

function setDevisStatus(id, status, skipRapport = false) {
  const docs = getAllDocuments();
  const idx = docs.findIndex(d => d.id === id);
  if (idx === -1) return;

  const doc = docs[idx];
  if (doc.type !== "devis") return;

  const oldStatus = doc.status || "";

  // 1) Mise à jour du devis
  doc.status    = status;
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
      const rapports = (typeof getAllRapports === "function" ? getAllRapports() : []) || [];

      // évite de générer plusieurs rapports pour le même devis
      const already = rapports.find(r =>
        r.source &&
        r.source.type === "devis" &&
        r.source.id === doc.id
      );

      if (!already) {
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
            icon: "📝"
          });
        } else {
          console.log("[Devis] Rapport technique créé pour le devis", numero, rapport && rapport.id);
        }
      }
    } catch (e) {
      console.error("Erreur lors de la création automatique du rapport depuis un devis clôturé :", e);
    }
  }

  // 3) Si on vient de passer à "accepte" → logique contrats + facture auto (comme avant)
  if (status === "accepte" && oldStatus !== "accepte") {

    const contracts = (typeof getAllContracts === "function"
      ? getAllContracts()
      : []) || [];

    const linkedContracts = contracts.filter(c =>
      c.meta && c.meta.sourceDevisId === doc.id
    );

    // 🟦 CAS 1 : il y a un contrat lié → on laisse la logique actuelle (échéances, etc.)
    linkedContracts.forEach(contract => {
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

        const all = getAllContracts().map(c =>
          c.id === contract.id ? contract : c
        );

        saveContracts(all);
        if (typeof saveSingleContractToFirestore === "function") {
          saveSingleContractToFirestore(contract);
        }
      }

      const updated = getAllContracts().map(c =>
        c.id === contract.id ? contract : c
      );
      saveContracts(updated);
      if (typeof saveSingleContractToFirestore === "function") {
        saveSingleContractToFirestore(contract);
      }
    });

    // 🟥 CAS 2 : aucun contrat lié → on génère une facture "classique" automatiquement
    if (linkedContracts.length === 0 && typeof createInvoiceFromDevis === "function") {
      const factureAuto = createInvoiceFromDevis(doc);
      if (factureAuto) {
        console.log("[Devis] Facture auto créée à l'acceptation :", factureAuto.number);
      }
    }
  }

  // 4) Historique de changement de statut
  try {
    addHistoryEntry(id, {
      type: "status",
      detail: `Statut modifié : ${oldStatus || "—"} → ${status || "—"}`
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
      icon: "ℹ️"
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
        mode
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
      descSyndic: tpl.descSyndic || ""
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
        custom[keyPart] != null ? custom[keyPart] : t.priceParticulier ?? "";
      const valSyn =
        custom[keySyn] != null ? custom[keySyn] : t.priceSyndic ?? "";

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
    message: "Les tarifs ont été sauvegardés et seront utilisés pour les prochaines prestations ajoutées.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
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
        message: "Les tarifs ont été remis à zéro. Les valeurs par défaut seront utilisées.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "success",
        icon: "✅"
      });
      openTarifsPanel();
    }
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
      icon: "⚠️"
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
      icon: "⚠️"
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
    descSyndic: ""
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
    descSyndic: synText
  };
  saveCustomTexts(map);

  showConfirmDialog({
    title: "Texte détaillé mis à jour",
    message: "Ces textes seront utilisés dans les prochains devis et factures.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
  });

  closeDescEditor();
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
    }
  });
}

// ================== MODAL DE CONFIRMATION ==================

function showConfirmDialog({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuler",
  onConfirm,
  variant = "info",   // "default" | "info" | "warning" | "danger" | "success"
  icon                 // ex: "⚠️", "ℹ️", "✅", "🧾"
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
    if (window.confirm(message)) {
      if (typeof onConfirm === "function") onConfirm();
    }
    return;
  }

  // Texte titre + message
  titleEl.textContent = title || "";
  msgEl.textContent = message || "";

  // Libellés des boutons
  btnOk.textContent = confirmLabel || "OK";

  if (cancelLabel === "" || cancelLabel == null) {
    btnCancel.style.display = "none";
  } else {
    btnCancel.style.display = "inline-block";
    btnCancel.textContent = cancelLabel;
  }

  // Reset classes de variante
  box.classList.remove("danger", "success", "info");
  if (iconEl) {
    iconEl.classList.remove("danger", "success", "info");
  }

  // Normalisation du variant ("warning" → "danger", "default" → "info")
  let v = variant || "info";
  if (v === "warning") v = "danger";
  if (v === "default") v = "info";

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
    // info
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

  // Nettoyage des anciens handlers
  btnOk.onclick = null;
  btnCancel.onclick = null;

  // Cancel = fermer
  btnCancel.onclick = function () {
    overlay.classList.add("hidden");
  };

  // OK = fermer + callback
  btnOk.onclick = function () {
    overlay.classList.add("hidden");
    if (typeof onConfirm === "function") onConfirm();
  };

  // Afficher la popup
  overlay.classList.remove("hidden");
}

const signatureClientTitle = "Bon pour accord";
const signatureClientText  = "Bon pour accord, lu et approuvé.";



// ================== IMPRESSION / PDF ==================


function openPrintable(id, previewOnly) {
  const targetId = id || currentDocumentId;
  if (!targetId) {
    showConfirmDialog({
      title: "Enregistrement requis",
      message: "Veuillez d'abord enregistrer le devis ou la facture avant d'imprimer ou d'afficher l'aperçu.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️"
    });
    return;
  }

  const doc = getDocument(targetId);
  if (!doc) return;

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
      "depannage_piscine"
    ].includes(p.kind)
  );

  const hasClim = doc.prestations.some((p) =>
    ["entretien_clim", "depannage_clim"].includes(p.kind)
  );

  const hasProduitsOuFournitures = doc.prestations.some(
    (p) => p.kind === "produits" || p.kind === "fournitures"
  );

  const isDevis = doc.type === "devis";
  const isPaidInvoice = !isDevis && doc.paid;
  const isUnpaidInvoice = !isDevis && !doc.paid;

  const titleColor = isDevis
    ? "#1a74d9"
    : doc.paid
    ? "#1b5e20"
    : "#1a74d9";

  const formatEuroFR = (value) =>
    (Number(value) || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €";

  // Lignes prestations
  let prestationsHTML = "";
  doc.prestations.forEach((p) => {
    let extraHtml = "";
    if (p.dates && p.dates.length) {
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

    if (hasPiscine && !hasProduitsOuFournitures) {
      items.push(
        "Les produits de traitement piscine (chlore choc, sel, produits d’équilibrage, etc.) ne sont pas inclus, sauf mention contraire sur le devis, et seront facturés en supplément le cas échéant."
      );
    }

    if (hasPiscine && hasClim) {
      items.push(
        "Les tarifs des pièces détachées de piscine et de climatisation (pompes, cellules, cartes électroniques, moteurs, etc.) sont susceptibles d’évoluer en fonction des tarifs fournisseurs en vigueur. Le montant final pourra être ajusté après votre accord."
      );
    } else if (hasPiscine) {
      items.push(
        "Les tarifs des pièces détachées de piscine (pompes, cellules, roulements, etc.) sont susceptibles d’évoluer selon les tarifs fournisseurs en vigueur. Le montant final pourra être ajusté après votre accord."
      );
    } else if (hasClim) {
      items.push(
        "Les tarifs des pièces détachées de climatisation (moteurs, ventilateurs, cartes électroniques, etc.) sont susceptibles d’évoluer selon les tarifs fournisseurs en vigueur. Le montant final pourra être ajusté après votre accord."
      );
    }

    items.push(
      "Les prix indiqués comprennent la main-d’œuvre et, le cas échéant, les frais de déplacement mentionnés au devis."
    );

    items.push(
      "Toute prestation non mentionnée dans le présent devis fera l’objet d’un devis complémentaire ou d’un avenant écrit avant réalisation."
    );

    items.push(
      "L’entreprise est titulaire d’une assurance responsabilité civile professionnelle."
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

</div> <!-- FIN REGLEMENT-BLOCK -->

<!-- 🟢 Tampon facturé payée sous le bloc -->
<div class="paid-stamp-big-wrapper">
  <img src="${paidStampSrc}" alt="Facture payée" class="paid-stamp-big">
</div>

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


  let notesHtml = "";
  if (isDevis) {
    const devisConditions =
      "Paiement à réception de facture.\n" +
      "Aucun acompte demandé sauf mention contraire.";
    notesHtml = `
      <div class="conditions-block">
        <div class="conditions-title">Conditions de règlement</div>
        <p>${devisConditions.replace(/\n/g, "<br>")}</p>
      </div>
    `;
  } else {
    let notesText = doc.notes || "";
    if (doc.paid && notesText) {
      const removeLines = [
        "Paiement à 30 jours date de facture.",
        "Règlement à réception de facture.",
        "Aucun escompte pour paiement anticipé.",
        "En cas de retard de paiement : pénalités au taux légal en vigueur et indemnité forfaitaire de 40 € pour frais de recouvrement (article L441-10 du Code de commerce).",
        "Pénalités de retard : taux légal en vigueur et indemnité forfaitaire de 40 € pour frais de recouvrement (article L441-10 du Code de commerce)."
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
  <title>${isDevis ? "Devis " : "Facture "}${doc.number}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      color: #333;
      font-size: 10.5px;
    }

    .page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 10mm 12mm 14mm 12mm;
      box-sizing: border-box;
    }

    .page-main {
      flex: 1 0 auto;
    }

    .page-footer {
      flex-shrink: 0;
      margin-top: 8mm;
    }

    .bottom-block {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  .ref-bar {
    margin: 6px 0 10px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid #cbd3e1;
    background: #f5f7ff;
    font-size: 11px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

    /* ===== HEADER ===== */

    .header {
      text-align: center;
      margin-bottom: 6px; /* un peu plus compact */
      border-bottom: 1.5px solid #1a74d9;
      padding-bottom: 7px;
    }

    img.logo {
      height: 55px;
      margin-bottom: 4px;
    }

    .header h1 {
      color: #1a74d9;
      font-size: 21px;
      margin-bottom: 3px;
      font-weight: 700;
    }

    .header p {
      color: #444;
      font-size: 10.5px;
      line-height: 1.25;
    }

    .subtitle {
      font-weight: 600;
      font-size: 11px;
    }

    .contact {
      font-size: 10.5px;
      font-weight: 500;
    }

    .contact strong {
      font-weight: 700;
    }

    /* ===== TITRE DEVIS / FACTURE ===== */

  .doc-header-center {
  margin: 8px 0 12px 0;
}

/* Titre Devis / Facture premium */
.doc-title-main {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 600;
  opacity: 0.9;
}

.doc-title-number {
  display: block;
  margin-top: 2px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: inherit;
}

/* Objet */
.doc-subject {
  margin-top: 8px;
  font-size: 12.5px;
  font-weight: 700;
}


    /* ===== INFOS DATES (CADRE À DROITE) ===== */

    .doc-info-block {
      display: inline-block;
      border: 1px solid #cbd3e1;
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 10px;
      background: #f6f8fc;
      margin-top: 4px;
    }

    .doc-info-row {
      display: flex;
      gap: 4px;
      margin: 1px 0;
    }

    .doc-info-label {
      min-width: 95px;
      font-weight: bold;
    }

    .doc-info-value {
      flex: 1;
    }

    /* ===== BLOC CLIENT / SITE ===== */

    .client-block {
      margin-bottom: 8px;
      font-size: 10px;
      border: 1px solid #dde4ee;
      border-radius: 8px;
      padding: 8px 10px;
      background: #f5f7fb; /* léger fond gris/bleu */
    }

    .client-title {
      font-weight: 700;
      font-size: 10.5px;
      margin-bottom: 4px;
      text-transform: none;
      letter-spacing: 0;
      color: #1a74d9;
    }

    .client-line {
      margin: 2px 0;
    }

    .client-inner-row {
      display: flex;
      gap: 18px;
    }

    .client-col {
      flex: 1 1 auto;
    }

    .client-col.right {
      flex: 0 0 auto;
      margin-left: auto;
    }

    .site-block {
      margin-bottom: 8px;
      font-size: 10px;
      border: 1px solid #000;
      border-radius: 6px;
      padding: 8px 10px;
      background: #fff;
    }

    .site-title {
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ===== TABLE PRESTATIONS ===== */

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }

    thead th {
      background: #1a74d9;
      color: #fff;
      padding: 6px 6px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      border-bottom: 2px solid #cbd3e1;
    }

    tbody td {
      padding: 4px 6px;
      border-bottom: 1px solid #dde4ee;
      font-size: 10px;
      vertical-align: top;
    }

    /* zébrage léger */
    tbody tr:nth-child(odd) {
      background: #f9fbff;
    }

    tbody tr:nth-child(even) {
      background: #ffffff;
    }

    th:first-child,
    td:first-child {
      width: 55%;
    }

    .text-right {
      text-align: right;
    }

    .qty-col,
    .unit-col {
      text-align: center;
      white-space: nowrap;
    }

    .price-col,
    .total-col {
      white-space: nowrap;
      text-align: right;
    }

    .desc-main {
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .desc-detail {
      font-size: 10px;
      color: #555;
      margin-top: 2px;
    }

    .sub-info {
      margin-top: 3px;
      font-size: 9.5px;
      color: #555;
    }

    .sub-info-line {
      margin-top: 1px;
    }

    /* ===== TOTAUX ===== */

    .totals {
      margin-left: auto;
      width: 230px;
      margin-top: 6px;
      border: 1px solid #cbd3e1;
      border-radius: 8px;
      padding: 8px 10px;
      background: #f3f6fc;
    }

    .totals table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }

    .totals td {
      padding: 3px 0;
      font-size: 10px;
    }

    .totals .grand-total td {
      padding-top: 6px;
      border-top: 1px solid #cbd3e1;
      font-weight: 800;
      font-size: 11px;
      background: #e3edff;
      color: #0d3b66;
    }

    .tva-note {
      margin-top: 4px;
      font-size: 9px;
      font-style: italic;
      color: #555;
    }

    /* ===== BLOCS ANNEXES ===== */

    .reglement-block {
      margin-top: 6px;
      font-size: 10px;
      border: 1px solid #1b5e20;
      padding: 8px;
      border-radius: 6px;
      background: #e8f5e9;
      page-break-inside: avoid;
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
    }

.paid-stamp-big-wrapper {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.paid-stamp-big {
  height: 240px;
  width: auto;
  opacity: 0.95;
}



    .reg-title {
      font-weight: bold;
      margin-bottom: 3px;
      color: #1b5e20;
      font-size: 10px;
    }

    .rib-block {
      margin-top: 6px;
      font-size: 10px;
      border: 1px solid #cbd3e1;
      padding: 8px;
      border-radius: 6px;
      background: #ffffff;
      page-break-inside: avoid;
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
    }

    .rib-title {
      font-weight: bold;
      margin-bottom: 3px;
      font-size: 10px;
    }

    .important-block {
      margin-top: 8px;
      font-size: 10px;
      border: 1px solid #1a74d9;
      padding: 8px;
      border-radius: 6px;
      background: #f3f7ff;
      page-break-inside: avoid;
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
    }

    .important-title {
      font-weight: bold;
      margin-bottom: 4px;
      font-size: 10px;
      color: #1a74d9;
    }

    .important-block ul {
      margin-left: 14px;
    }

    .important-block li {
      margin-bottom: 3px;
    }

    .conditions-block {
      margin-top: 6px;
      font-size: 10px;
      border: 1px solid #cbd3e1;
      border-radius: 6px;
      padding: 8px;
      background: #ffffff;
      page-break-inside: avoid;
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
    }

    .conditions-title {
      font-weight: bold;
      margin-bottom: 3px;
      font-size: 10px;
    }

    /* ===== SIGNATURES ===== */

    .signatures {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      gap: 22px;
      page-break-inside: avoid;
      break-inside: avoid;
      -webkit-column-break-inside: avoid;
    }

    .signature-block {
      flex: 1;
      page-break-inside: avoid;
      border-top: 1px solid #333;
      padding-top: 4px;
      font-size: 10px;
      min-height: 55px;
    }

    .signature-title {
      font-weight: bold;
      margin-bottom: 3px;
    }

img.sig {
  height: 100px;
  width: auto;
  margin-top: 3px;
}

img.sig-client {
  height: 100px;
  width: auto;
  margin-top: 12px;  /* tu peux mettre 14–15 si tu veux plus bas */
}



    @media print {
      @page {
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .page {
        min-height: 100vh;
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
        SIRET : <strong>${getCompanySettings().siret}</strong>
      </p>

    </div>

<div class="doc-header-center">
  <h2 style="color:${titleColor};">
    <span class="doc-title-main">
      ${isDevis ? "DEVIS" : "FACTURE"}
    </span>
    <span class="doc-title-number">
      N° ${doc.number}
    </span>
  </h2>

  ${topDatesHtml}
  ${
    doc.subject
      ? `<div class="doc-subject">Objet : ${doc.subject}</div>`
      : ``
  }
</div>


    <div class="client-block">
      <div class="client-inner-row">
        <!-- COLONNE GAUCHE -->
        <div class="client-col">
          <div class="client-title">Client</div>
         ${(doc.client?.name || doc.client?.civility)
  ? `<p class="client-line">${[doc.client?.civility, doc.client?.name].filter(Boolean).join(" ")}</p>`
  : ""}

          ${doc.client?.address ? `<p class="client-line">${doc.client.address}</p>` : ""}
          ${doc.client?.phone ? `<p class="client-line">${doc.client.phone}</p>` : ""}
          ${doc.client?.email ? `<p class="client-line">${doc.client.email}</p>` : ""}
        </div>

        <!-- COLONNE DROITE (Lieu d’intervention) -->
        ${
          doc.siteName || doc.siteAddress
            ? `
        <div class="client-col right">
          <div class="client-title">Lieu d’intervention</div>
         ${(doc.siteCivility || doc.siteName)
  ? `<p class="client-line">${[doc.siteCivility, doc.siteName].filter(Boolean).join(" ")}</p>`
  : ""}

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

  <div class="page-footer bottom-block">
    ${
      isDevis
        ? signatureClientHTML
        : (
          isUnpaidInvoice
            ? `
              ${ribHtml}
              ${notesHtml}
            `
            : ``
        )
    }
  </div>
</div>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();

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
  RESILIE: "resilie"
};
// Fonction d'échappement HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
// Calcul du statut en fonction de la date de fin

function computeContractStatus(contract) {
if (contract.meta && contract.meta.forceStatus === "termine_renouvele") {
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

  // 1️⃣ Statut calculé proprement
  contract.status = computeContractStatus(contract);

  const pr = contract.pricing || {};
  const cl = contract.client  || {};

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
  const mode       = pr.billingMode || "annuel";

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
    0
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
  const p  = contract.pool    || {};
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
 "settingsView"  
  ];

  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}


/* ============================
   ACCUEIL / MENU PRINCIPAL
============================ */

function showHome() {
  const tabHome     = document.getElementById("tabHome");
  const tabDevis    = document.getElementById("tabDevis");
  const tabContrats = document.getElementById("tabContrats");
  const tabFactures = document.getElementById("tabFactures");
  const tabAttest   = document.getElementById("tabAttest");
  const tabCA       = document.getElementById("tabCA");

  const homeView        = document.getElementById("homeView");
  const listView        = document.getElementById("listView");
  const formView        = document.getElementById("formView");
  const contractView    = document.getElementById("contractView");
  const attestationView = document.getElementById("attestationView");
const settingsView    = document.getElementById("settingsView");
settingsView    && settingsView.classList.add("hidden");

  // Onglets
  tabHome     && tabHome.classList.add("active");
  tabDevis    && tabDevis.classList.remove("active");
  tabContrats && tabContrats.classList.remove("active");
  tabFactures && tabFactures.classList.remove("active");
  tabAttest   && tabAttest.classList.remove("active");
  tabCA       && tabCA.classList.remove("active");

  // Vues
  homeView        && homeView.classList.remove("hidden");
  listView        && listView.classList.add("hidden");
  formView        && formView.classList.add("hidden");
  contractView    && contractView.classList.add("hidden");
  attestationView && attestationView.classList.add("hidden");

  refreshHomeStats();
}


function openFromHome(type) {
  // Onglets
  const tabHome     = document.getElementById("tabHome");
  const tabDevis    = document.getElementById("tabDevis");
  const tabContrats = document.getElementById("tabContrats");
  const tabFactures = document.getElementById("tabFactures");
  const tabAttest   = document.getElementById("tabAttest");
  const tabCA       = document.getElementById("tabCA");

  // On quitte l’accueil et les attestations
  tabHome   && tabHome.classList.remove("active");
  tabAttest && tabAttest.classList.remove("active");
  tabCA     && tabCA.classList.remove("active");

  if (type === "devis") {
    tabDevis    && tabDevis.classList.add("active");
    tabContrats && tabContrats.classList.remove("active");
    tabFactures && tabFactures.classList.remove("active");
  } else if (type === "contrat") {
    tabContrats && tabContrats.classList.add("active");
    tabDevis    && tabDevis.classList.remove("active");
    tabFactures && tabFactures.classList.remove("active");
  } else if (type === "facture") {
    tabFactures && tabFactures.classList.add("active");
    tabDevis    && tabDevis.classList.remove("active");
    tabContrats && tabContrats.classList.remove("active");
  }

  const homeView        = document.getElementById("homeView");
  const listView        = document.getElementById("listView");
  const formView        = document.getElementById("formView");
  const contractView    = document.getElementById("contractView");
  const attestationView = document.getElementById("attestationView");
const settingsView = document.getElementById("settingsView");

  // On affiche la liste (devis/factures/contrats)
  homeView        && homeView.classList.add("hidden");
  attestationView && attestationView.classList.add("hidden");
  listView        && listView.classList.remove("hidden");
  formView        && formView.classList.add("hidden");
  contractView    && contractView.classList.add("hidden");
settingsView && settingsView.classList.add("hidden");

  // logique existante
  if (typeof switchListType === "function") {
    switchListType(type);
  }
}



function refreshHomeStats() {
  // Sécu : si pas de dashboard sur la page, on ne fait rien
  if (!document.getElementById("homeView")) return;

  const docs      = (typeof getAllDocuments === "function") ? getAllDocuments() : [];
  const contracts = (typeof getAllContracts === "function") ? getAllContracts() : [];

  // ========= DEVIS =========
  const devis = docs.filter(d => d.type === "devis");

  const devisCount     = devis.length;
  const devisPending   = devis.filter(d => !d.status || d.status === "en_attente").length;
  const devisAccepted  = devis.filter(d => d.status === "accepte").length;
  const devisClosed    = devis.filter(d => d.status === "cloture").length;
  const devisRefused   = devis.filter(d => d.status === "refuse").length;
  const devisExpired   = devis.filter(d => d.status === "expire").length;


  const lastDevis = devis
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];

  const elDevisCount  = document.getElementById("dashDevisCount");
  const elDevisStatus = document.getElementById("dashDevisStatus");
  const elDevisLast   = document.getElementById("dashDevisLast");

  if (elDevisCount) {
    elDevisCount.textContent =
      devisCount + (devisCount > 1 ? " devis enregistrés" : " devis enregistré");
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
      const num  = lastDevis.number || lastDevis.id || "";
      const date = lastDevis.date || "";
      elDevisLast.textContent = `Dernier devis : ${num} (${date})`;
    } else {
      elDevisLast.textContent = "Dernier devis : –";
    }
  }

  // ========= CONTRATS =========
  const activeContracts = contracts.filter(c =>
    c.status === CONTRACT_STATUS.EN_COURS ||
    c.status === CONTRACT_STATUS.A_RENOUVELER
  );
  const toRenew = contracts.filter(c =>
    c.status === CONTRACT_STATUS.A_RENOUVELER
  );

  const elCtCount  = document.getElementById("dashContractCount");
  const elCtRenew  = document.getElementById("dashContractRenew");

  if (elCtCount) {
    elCtCount.textContent =
      activeContracts.length +
      (activeContracts.length > 1 ? " contrats actifs" : " contrat actif");
  }

  if (elCtRenew) {
    elCtRenew.textContent = `À renouveler : ${toRenew.length}`;
  }

  // ========= FACTURES =========
  const factures = docs.filter(d => d.type === "facture");
  const unpaid   = factures.filter(f => !f.paid);

  const unpaidAmount = unpaid.reduce((sum, f) => {
    const val = Number(f.totalTTC || 0);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const elInvCount   = document.getElementById("dashInvoiceCount");
  const elInvUnpaid  = document.getElementById("dashInvoiceUnpaid");
  const elInvAmt     = document.getElementById("dashInvoiceAmount");
  const elInvHealth  = document.getElementById("dashInvoiceHealth"); // 👈 nouveau

  if (elInvCount) {
    elInvCount.textContent =
      factures.length +
      (factures.length > 1 ? " factures créées" : " facture créée");
  }

  if (elInvUnpaid) {
    elInvUnpaid.textContent = `Impayées : ${unpaid.length}`;
  }

  if (elInvAmt) {
    const fmtUnpaid = (typeof formatEuro === "function")
      ? formatEuro(unpaidAmount)
      : (unpaidAmount.toFixed(2) + " €");
    elInvAmt.textContent = `Montant impayé : ${fmtUnpaid}`;
  }

  // 🧠 Analyse "santé" facturation
  if (elInvHealth) {
    const DELAI_REGLEMENT_JOURS = 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lateCount     = 0;
    let lateAmount    = 0;
    let pendingCount  = 0;
    let pendingAmount = 0;

    unpaid.forEach((f) => {
      const val = Number(f.totalTTC || 0);
      if (isNaN(val)) return;

      if (!f.date) {
        // pas de date => on considère "en attente"
        pendingCount++;
        pendingAmount += val;
        return;
      }

      const d = new Date(f.date + "T00:00:00");
      d.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (!isNaN(diffDays) && diffDays > DELAI_REGLEMENT_JOURS) {
        lateCount++;
        lateAmount += val;
      } else {
        pendingCount++;
        pendingAmount += val;
      }
    });

    const fmtLocal = (v) =>
      (typeof formatEuro === "function")
        ? formatEuro(v)
        : (Number(v || 0).toFixed(2) + " €");

    if (unpaid.length === 0) {
      elInvHealth.textContent =
        "Santé facturation : ✅ RAS, tout est payé";
    } else if (lateCount > 0) {
      elInvHealth.textContent =
        `Santé facturation : ⚠️ ${lateCount} en retard (${fmtLocal(lateAmount)})`;
    } else {
      elInvHealth.textContent =
        `Santé facturation : 🟡 ${pendingCount} en attente (${fmtLocal(pendingAmount)})`;
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
    if (f.paid) {
      caPaid += val;
    } else {
      caUnpaid += val;
    }

    if (f.date) {
      const d = new Date(f.date + "T00:00:00");
      if (!isNaN(d.getTime()) &&
          d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth) {
        caThisMonth += val;
      }
    }
  });

  const elCaTotal  = document.getElementById("dashCATotal");
  const elCaPaid   = document.getElementById("dashCAPaid");
  const elCaUnpaid = document.getElementById("dashCAUnpaid");
  const elCaMonth  = document.getElementById("dashCAMonth");

  const fmt = (v) =>
    (typeof formatEuro === "function")
      ? formatEuro(v)
      : (Number(v || 0).toFixed(2) + " €");

  if (elCaTotal)  elCaTotal.textContent  = "CA total : " + fmt(caTotal);
  if (elCaPaid)   elCaPaid.textContent   = "Payé : " + fmt(caPaid);
  if (elCaUnpaid) elCaUnpaid.textContent = "Impayé : " + fmt(caUnpaid);
  if (elCaMonth)  elCaMonth.textContent  = "Mois en cours : " + fmt(caThisMonth);

  // ========= TABLEAU SANTÉ GLOBAL =========

  const rowFacturesLate    = document.getElementById("healthRowFacturesLate");
  const rowFacturesPending = document.getElementById("healthRowFacturesPending");
  const rowDevis           = document.getElementById("healthRowDevis");
  const rowContrats        = document.getElementById("healthRowContrats");

  function setHealthRow(row, status, text) {
    if (!row) return;

    const statusCell = row.querySelector(".health-status");
    const detailCell = row.querySelector(".health-detail");

    if (statusCell) {
      statusCell.classList.remove("health-ok", "health-warn", "health-bad");

      let cls = "";
      if (status === "ok")   cls = "health-ok";
      if (status === "warn") cls = "health-warn";
      if (status === "bad")  cls = "health-bad";

      if (cls) statusCell.classList.add(cls);

      if (status === "ok")        statusCell.textContent = "✅ OK";
      else if (status === "warn") statusCell.textContent = "⚠️ Attention";
      else if (status === "bad")  statusCell.textContent = "⛔ Urgent";
      else                        statusCell.textContent = "–";
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

    let lateCount     = 0;
    let lateAmount    = 0;
    let pendingCount  = 0;
    let pendingAmount = 0;

    unpaid.forEach((f) => {
      const val = Number(f.totalTTC || 0) || 0;

      if (!f.date) {
        pendingCount++;
        pendingAmount += val;
        return;
      }
      const d = new Date(f.date + "T00:00:00");
      if (isNaN(d.getTime())) return;

      const diffDays = Math.floor(
        (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > DELAI_REGLEMENT_JOURS) {
        lateCount++;
        lateAmount += val;
      } else {
        pendingCount++;
        pendingAmount += val;
      }
    });

    const fmtLocal = (v) =>
      (typeof formatEuro === "function")
        ? formatEuro(v)
        : (Number(v || 0).toFixed(2) + " €");

    // === Ligne "Factures critiques"
    if (rowFacturesLate) {
      if (lateCount > 0) {
        setHealthRow(
          rowFacturesLate,
          "bad",
          `${lateCount} facture(s) en retard (${fmtLocal(lateAmount)})`
        );
      } else {
        setHealthRow(rowFacturesLate, "ok", "Aucune facture critique");
      }
    }

    // === Ligne "Factures en attente"
    if (rowFacturesPending) {
      if (pendingCount > 0) {
        setHealthRow(
          rowFacturesPending,
          "warn",
          `${pendingCount} facture(s) non payée(s) (${fmtLocal(pendingAmount)})`
        );
      } else {
        setHealthRow(rowFacturesPending, "ok", "Aucune facture en attente");
      }
    }
  }

  // ---- Devis
  if (rowDevis) {
    if (devisExpired > 0) {
      setHealthRow(
        rowDevis,
        "bad",
        `${devisExpired} devis expiré(s) à traiter`
      );
    } else if (devisPending > 0) {
      setHealthRow(
        rowDevis,
        "warn",
        `${devisPending} devis en attente de réponse`
      );
    } else {
      setHealthRow(
        rowDevis,
        "ok",
        "Aucun devis en attente critique"
      );
    }
  }

  // ---- Contrats
  if (rowContrats) {
    const endedCount = contracts.length - activeContracts.length;

    if (endedCount > 0) {
      setHealthRow(
        rowContrats,
        "bad",
        `${endedCount} contrat(s) terminé(s) à renouveler`
      );
    } else if (toRenew.length > 0) {
      setHealthRow(
        rowContrats,
        "warn",
        `${toRenew.length} contrat(s) à renouveler bientôt`
      );
    } else if (contracts.length === 0) {
      setHealthRow(
        rowContrats,
        "ok",
        "Aucun contrat enregistré"
      );
    } else {
      setHealthRow(
        rowContrats,
        "ok",
        "Tous les contrats sont à jour"
      );
    }
  }
  if (typeof renderPlanningWeek === "function") {
    renderPlanningWeek();
  }

}

// ====== PLANNING HEBDO ======

let planningWeekOffset = 0;
let manualPlanningItems = loadManualPlanningItems();
let currentPlanningData = [];
let manualPopupDate = null;

function loadManualPlanningItems() {
  try {
    const raw = localStorage.getItem("manualPlanningItems") || "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function saveManualPlanningItems() {
  try {
    localStorage.setItem("manualPlanningItems", JSON.stringify(manualPlanningItems));
  } catch (e) {}
}

function getServiceLabelForContract(contract) {
  const pr = contract.pricing || {};
  const mainService = (pr.mainService || contract.pool?.type || "").toLowerCase();

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
  planningWeekOffset += delta;
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
  if (visits < 1) visits = 1;            // s’il y a des passages, au moins 1

  return visits;
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

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
const dateStr = formatDateYMD(date);

    const col = document.createElement("div");
    col.className = "day-column";
    if (dateStr === todayISO && planningWeekOffset === 0) {
      col.classList.add("is-today");
    }
    if (i >= 5) {
      col.classList.add("is-weekend");
    }
    col.dataset.date = dateStr;

   const header = document.createElement("div");
header.className = "day-column-header";
header.innerHTML =
  `<span>${dayShort[i]} ${date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit"
  })}</span>
   <button type="button"
           class="planning-add-btn"
           data-date="${dateStr}">+</button>`;

// 🔥🔥🔥 AJOUT OBLIGATOIRE : activer le bouton +
const addBtn = header.querySelector(".planning-add-btn");
if (addBtn) {
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();   // empêche d’ouvrir les détails du jour
    openManualPlanningPopup(addBtn.dataset.date);
  });
}

const list = document.createElement("div");
list.className = "day-visits";

col.appendChild(header);
col.appendChild(list);
grid.appendChild(col);

col.addEventListener("click", function (e) {
  if (e.target.closest(".planning-add-btn")) return;
  openPlanningDayDetails(this.dataset.date);
});


    dayColumns.push({ date, dateStr, list });
    currentPlanningData.push({ date: dateStr, items: [] });
  }

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
      const dayIndex = Math.min(6, Math.floor((i + 0.5) * 7 / visits));
      const column = dayColumns[dayIndex];
      const info = currentPlanningData[dayIndex];

      const div = document.createElement("div");
      div.className = "visit-entry";
      // 🔹 dans la case : prestation en gros, client en dessous
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
      });
    }
  });

  // Ajouts manuels (stockés en localStorage)
  manualPlanningItems.forEach((item) => {
    const index = currentPlanningData.findIndex((d) => d.date === item.date);
    if (index === -1) return;

    const column = dayColumns[index];
    const info = currentPlanningData[index];

    const service = item.service || item.label || "Intervention";
    const clientName = item.clientName || "";

    const div = document.createElement("div");
    div.className = "visit-entry visit-manual";
    div.innerHTML =
      "<strong>" +
      escapeHtml(service) +
      "</strong>" +
      (clientName
        ? "<br><span class='visit-pool'>" +
          escapeHtml(clientName) +
          "</span>"
        : "");

    column.list.appendChild(div);

info.items.push({
  id: item.id,               // ← OBLIGATOIRE
  type: "manual",
  service,
  clientName,
  address: item.address || "",
  phone: item.phone || "",
  notes: item.notes || ""
});

  });

  // colonnes vides
  currentPlanningData.forEach((d, idx) => {
    if (!dayColumns[idx].list.children.length) {
      const empty = document.createElement("div");
      empty.className = "visit-empty";
      empty.textContent = "—";
      dayColumns[idx].list.appendChild(empty);
    }
  });
}

function openPlanningDayDetails(dateStr) {
  const detailsEl = document.getElementById("planningDetails");
  if (!detailsEl) return;

  // 🔵 déplace le cadre bleu sur la case cliquée
  document.querySelectorAll(".day-column").forEach((col) => {
    col.classList.remove("is-selected");
  });
  const selectedCol = document.querySelector(`.day-column[data-date="${dateStr}"]`);
  if (selectedCol) selectedCol.classList.add("is-selected");

  const day = currentPlanningData.find((d) => d.date === dateStr);
  const frDate = new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

  let html = `<h3>Détails pour ${frDate}</h3>`;

  if (!day || !day.items.length) {
    html += `<div class="visit-empty">Aucun passage prévu.</div>`;
  } else {
    day.items.forEach((item) => {
      if (item.type === "contract") {
        html += `<div class="planning-details-entry">
          <strong>${escapeHtml(item.clientName)}</strong><br>
          ${item.address ? escapeHtml(item.address) + "<br>" : ""}
          ${item.phone ? "📞 " + escapeHtml(item.phone) + "<br>" : ""}
          ${
            item.serviceLabel
              ? `<span class="visit-pool">${escapeHtml(item.serviceLabel)}</span>`
              : ""
          }
        </div>`;
} else if (item.type === "manual") {
  const service = item.service || item.label || "Intervention";
  html += `<div class="planning-details-entry">
    <strong>${escapeHtml(service)}</strong><br>
    ${item.clientName ? escapeHtml(item.clientName) + "<br>" : ""}
    ${item.address ? escapeHtml(item.address) + "<br>" : ""}
    ${item.phone ? "📞 " + escapeHtml(item.phone) + "<br>" : ""}

    <button class="delete-manual-btn"
      onclick="deleteManualPlanningItem('${item.id}', '${dateStr}')">
      🗑️ Supprimer
    </button>
  </div>`;
}

    });
  }

  detailsEl.innerHTML = html;
  detailsEl.classList.remove("hidden");
}

function openManualPlanningPopup(dateStr, ev) {
  if (ev) ev.stopPropagation();
  manualPopupDate = dateStr;

  const overlay = document.getElementById("planningPopup");
  if (!overlay) return;

  const frDate = new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dateLabel = document.getElementById("planningPopupDate");
  if (dateLabel) {
    dateLabel.textContent = "Pour le " + frDate;
  }

  // on reset les champs existants UNIQUEMENT
  const select = document.getElementById("planningPopupPrestation");
  if (select) select.value = "";

  const clientInput  = document.getElementById("planningPopupClient");
  const addrInput    = document.getElementById("planningPopupAddress");
  const phoneInput   = document.getElementById("planningPopupPhone");
  const notesInput   = document.getElementById("planningPopupNotes");

  if (clientInput) clientInput.value = "";
  if (addrInput) addrInput.value = "";
  if (phoneInput) phoneInput.value = "";
  if (notesInput) notesInput.value = "";

  // remplit la liste déroulante
  loadPlanningPrestations();

  // on affiche
  overlay.classList.remove("hidden");

  const popup = overlay.querySelector(".popup");
  if (popup) {
    void popup.offsetWidth; // déclenche l’anim
    popup.classList.add("show");
  }
}

function closeManualPlanningPopup() {
  const overlay = document.getElementById("planningPopup");
  if (!overlay) return;

  const popup = overlay.querySelector(".popup");
  if (popup) {
    popup.classList.remove("show");
  }

  overlay.classList.add("hidden");
}
function confirmManualPlanningPopup() {
  const overlay = document.getElementById("planningPopup");
  if (!overlay || !manualPopupDate) return;

  const prestation = document.getElementById("planningPopupPrestation")?.value || "";
  const client     = document.getElementById("planningPopupClient")?.value.trim() || "";
  const address    = document.getElementById("planningPopupAddress")?.value.trim() || "";
  const phone      = document.getElementById("planningPopupPhone")?.value.trim() || "";
  const notes      = document.getElementById("planningPopupNotes")?.value.trim() || "";

  // On doit avoir au moins une presta ou un client
  if (!prestation && !client) {
    alert("Merci de renseigner au moins une prestation ou un nom de client 🙂");
    return;
  }

  // Label qui s’affiche dans la case du planning
  const label = prestation || client;

  manualPlanningItems.push({
    id: Date.now().toString(36),
    date: manualPopupDate,
    label,
    prestation,
    clientName: client,
    address,
    phone,
    notes
  });

  saveManualPlanningItems();
  overlay.classList.add("hidden");
  renderPlanningWeek();
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
    .filter(t => t && t.label && t.label !== "— Choisir un modèle —")
    // on exclut Produits / Fournitures / Déplacement
    .filter(t => !excluded.includes(t.label.toLowerCase()));

  // Option vide par défaut
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "— Choisir une prestation —";
  select.appendChild(defaultOpt);

  // On remplit avec les modèles
  list.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.label;
    opt.textContent = t.label;
    select.appendChild(opt);
  });
}

function deleteManualPlanningItem(id, dateStr) {
  // On filtre pour retirer l’intervention
  manualPlanningItems = manualPlanningItems.filter(item => item.id !== id);

  // On sauvegarde l'état
  saveManualPlanningItems();

  // On refresh l'affichage
  renderPlanningWeek();
  openPlanningDayDetails(dateStr); // Ré-ouvre la colonne mise à jour
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
      message: "Ouvre et enregistre d'abord un devis avant de créer un contrat.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "ℹ️"
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
      icon: "⚠️"
    });
    return;
  }

  // 2) Mapping Devis → Client / Site pour le contrat
  const client = {
    civility:  devis.client?.civility || "",
    name:      devis.client?.name || "",
    address:   devis.client?.address || "",
    phone:     devis.client?.phone || "",
    email:     devis.client?.email || "",
    // On récupère le numéro de devis en référence de contrat (modifiable ensuite)
    reference: devis.number || ""
  };

  const site = {
    civility: devis.siteCivility || "",
    name:     devis.siteName || "",
    address:  devis.siteAddress || ""
  };

  // 3) Pool par défaut (à ajuster dans le contrat)
  const pool = {
    type: "piscine_chlore",   // par défaut, tu pourras changer en sel / spa
    equipment: "",
    volume: "",
    notes: ""
  };

  // 4) Type de client en fonction des conditions du devis
  // devis.conditionsType = "particulier" / "agence"
  const clientType =
    devis.conditionsType === "agence" ? "syndic" : "particulier";

  const todayISO = new Date().toISOString().split("T")[0];

  // 5) Pricing de base : on récupère totals du devis, le reste sera ajusté par le contrat
  const pricing = {
    clientType,
    mainService: "piscine_chlore",   // tu pourras changer ensuite
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
        : (typeof devis.subtotal === "number" ? devis.subtotal : 0),

    airbnbOption: false
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
      sourceDevisNumber: devis.number || ""
    },
    createdAt: new Date().toISOString()
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
    icon: "✅"
  });
}

function generateDevisFromContract(contract) {
  if (!contract) return null;

  const c  = contract.client  || {};
  const s  = contract.site    || {};
  const p  = contract.pool    || {};
  const pr = contract.pricing || {};

  const todayISO = new Date().toISOString().slice(0, 10);
  const number   = getNextNumber("devis");

  const poolType = pr.mainService || p.type || "";
  const label    = getContractLabel(poolType);

  const globalPeriod = formatContractGlobalPeriod(pr);
  const clientName   = (c.name || "").trim();
  const suffixClient = clientName ? " – " + clientName : "";

  const subjectBase = globalPeriod
    ? `${label} – saison ${globalPeriod}`
    : label;

  const subject = subjectBase + suffixClient;

  const lineDesc = globalPeriod
    ? `${label} pour la période ${globalPeriod}`
    : label;

  // ----- Données prix venant du contrat -----
  const totalHTContract = Number(pr.totalHT)  || 0;
  const tvaRate         = Number(pr.tvaRate)  || 0;

  const clientType     = pr.clientType || "particulier";
  const conditionsType = clientType === "syndic" ? "agence" : "particulier";

  const baseNotesLines =
    clientType === "syndic"
      ? [
          "Règlement à 30 jours fin de mois.",
          "Aucun escompte pour paiement anticipé.",
          "En cas de retard de paiement : pénalités + indemnité forfaitaire de 40 € (art. L441-10 du Code de commerce)."
        ]
      : [
          "Paiement à réception de facture.",
          "Aucun acompte demandé sauf mention contraire.",
          "Aucun escompte pour paiement anticipé."
        ];

  const notesBase = baseNotesLines.concat([
    "Les produits de traitement piscine (chlore choc, sel, produits d’équilibrage, etc.) ne sont pas inclus sauf mention contraire.",
    "Les tarifs des pièces détachées et produits sont susceptibles d’évoluer selon les fournisseurs.",
    "Toute prestation non mentionnée fera l’objet d’un devis complémentaire.",
    "L’entreprise est titulaire d’une assurance responsabilité civile professionnelle."
  ]).join("\n");

  // ===== 1. Prestation principale (entretiens réguliers) =====
  const totalPassages = Number(pr.totalPassages || 0) || 1;
  let unitPrice = Number(pr.unitPrice || 0);

  if (!unitPrice && totalPassages > 0 && totalHTContract > 0) {
    unitPrice = totalHTContract / totalPassages;
  }
  if (!unitPrice) {
    unitPrice = totalHTContract;
  }

  let lineQty   = totalPassages;
  let lineTotal = unitPrice * lineQty;

  if (!lineTotal && totalHTContract > 0) {
    lineQty   = 1;
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
      desc:  lineDesc,
      detail: "",
      qty:    lineQty,
      price:  unitPrice,
      total:  lineTotal,
      unit:   "forfait",
      dates:  [],
      kind:   prestationKind
    }
  ];

  // ===== 2. Options forfaitaires (remise en service / hivernage) =====
  let optionsExtraTotal = 0;

  const includeOpening = !!pr.includeOpening;
  const includeWinter  = !!pr.includeWinter;
  const airbnbOption   = !!pr.airbnbOption;

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
      kind: kindOpening
    });
    optionsExtraTotal += openingPrice;
  }
}


// Hivernage
if (includeWinter) {
  const winterKind  = "hivernage_piscine";
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
      kind: winterKind
    });
    optionsExtraTotal += winterPrice;
  }
}


  // ===== 3. Majoration Airbnb +20 % =====
  let airbnbExtra = 0;
  if (airbnbOption) {
    const baseForAirbnb = lineTotal + optionsExtraTotal;
    airbnbExtra = baseForAirbnb * 0.20;

    if (airbnbExtra > 0.01) {
      prestations.push({
        desc: "Majoration usage location saisonnière / Airbnb (+20%)",
        detail: "Fréquence accrue, niveau d’exigence renforcé et nettoyage approfondi après chaque rotation de locataires.",
        qty: 1,
        price: airbnbExtra,
        total: airbnbExtra,
        unit: "forfait",
        dates: [],
        kind: "airbnb_extra"
      });
    }
  }

  // ===== 4. Totaux =====
  const subtotal  = prestations.reduce((sum, p) => sum + (Number(p.total) || 0), 0);
  const tvaAmount = tvaRate > 0 ? subtotal * (tvaRate / 100) : 0;
  const totalTTC  = subtotal + tvaAmount;

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

    client: {
      civility: c.civility || "",
      name:     c.name     || "",
      address:  c.address  || "",
      phone:    c.phone    || "",
      email:    c.email    || ""
    },

    siteCivility: s.civility || "",
    siteName:     s.name     || "",
    siteAddress:  s.address  || "",

    prestations,

    tvaRate,
    subtotal,
    discountRate:   0,
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
    updatedAt: todayISO
  };
}


function maybeProposeDevisForContract(contract) {
  if (!contract || !contract.pricing) {
    console.log("[Devis] Pas de pricing sur le contrat, pas de popup.");
    return false;
  }

  const pr         = contract.pricing;
  const clientType = pr.clientType || "particulier";

  let totalTTCraw = pr.totalTTC != null ? pr.totalTTC : pr.totalHT;
  if (typeof totalTTCraw === "string") {
    totalTTCraw = totalTTCraw.replace(",", ".");
  }
  const totalTTC = Number(totalTTCraw) || 0;

  console.log("[Devis] maybeProposeDevisForContract → clientType=", clientType, " totalTTC=", totalTTC);

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
    console.log("[Devis] Contrat déjà lié au devis", meta.sourceDevisNumber, "→ pas de popup.");
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

      console.log("[Devis] Création du devis depuis contrat", contract.id, "→", devis.number);

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
        updated.meta.sourceDevisId     = devis.id;
        updated.meta.sourceDevisNumber = devis.number;

        allContracts[idx] = updated;
        saveContracts(allContracts);

        if (typeof saveSingleContractToFirestore === "function") {
          saveSingleContractToFirestore(updated);
        }
      }

      if (typeof switchListType === "function") switchListType("devis");

      const contractView = document.getElementById("contractView");
      const formView     = document.getElementById("formView");
      if (contractView) contractView.classList.add("hidden");
      if (formView) formView.classList.remove("hidden");

      if (typeof loadDocumentsList === "function") loadDocumentsList();
      if (typeof loadDocument === "function")      loadDocument(devis.id);
    }
  });

  console.log("[Devis] Popup 'Créer un devis ?' affichée.");
  return true;
}

function getLinkedDevisForContract(contract) {
  if (!contract) return null;
  const meta = contract.meta || {};
  if (!meta.sourceDevisId) return null;

  const docs = getAllDocuments();
  return docs.find(
    d => d.type === "devis" && d.id === meta.sourceDevisId
  ) || null;
}

function isDevisObligatoireForContract(contract) {
  if (!contract || !contract.pricing) return false;

  const pr         = contract.pricing;
  const clientType = pr.clientType || "particulier";

  let totalTTCraw = pr.totalTTC != null ? pr.totalTTC : pr.totalHT;
  if (typeof totalTTCraw === "string") {
    totalTTCraw = totalTTCraw.replace(",", ".");
  }
  const totalTTC = Number(totalTTCraw) || 0;

  return (clientType === "particulier" && totalTTC >= 150);
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
  const ctSynRadio  = document.getElementById("ctClientSyndic");
  if (ctPartRadio) ctPartRadio.checked = true;
  if (ctSynRadio)  ctSynRadio.checked  = false;

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

  const tvaRateInput = document.getElementById("tvaRate");
  if (tvaRateInput) tvaRateInput.value = "0";

  const ctTva0  = document.getElementById("ctTva0");
  const ctTva20 = document.getElementById("ctTva20");
  if (ctTva0 && ctTva20) {
    ctTva0.checked = true;
    ctTva20.checked = false;
  }

  if (typeof setTVA === "function") {
    setTVA(0);
  }

  // 🔁 datalist clients
  if (typeof refreshClientDatalist === "function") {
    refreshClientDatalist();
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

  fillContractForm(contract);

if (typeof refreshDocumentHealthUI === "function") {
  refreshDocumentHealthUI(contract);
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
          .catch((err) => console.error("Erreur Firestore delete contrat :", err));
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
    }
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
      data: contract
    });
    return;
  }

  try {
    await db.collection("contracts").doc(contract.id).set(contract, { merge: true });
    processSyncQueue();
  } catch (e) {
    console.error("Erreur Firestore (save contract)", e);
  }
}

async function deleteContractFromFirestore(id) {
  if (!id) return;

  if (!db || !navigator.onLine) {
    enqueueSync({
      collection: "contracts",
      action: "delete",
      docId: id
    });
    return;
  }

  try {
    await db.collection("contracts").doc(id).delete();
    processSyncQueue();
  } catch (e) {
    console.error("Erreur Firestore (delete contract)", e);
  }
}

async function syncContractsWithFirestore() {
  if (!db) return;

  try {
    const snap = await db.collection("contracts").get();
    const cloudContracts = [];
    snap.forEach((doc) => {
      const data = doc.data();
      if (data && data.id) {
        cloudContracts.push(data);
      }
    });

    if (cloudContracts.length > 0) {
      console.log(
        "[Contracts] Chargement depuis Firestore :",
        cloudContracts.length,
        "contrats"
      );
      saveContracts(cloudContracts);
    } else {
      const localContracts = getAllContracts();
      if (localContracts.length > 0) {
        console.log("[Contracts] Firestore vide, push des contrats locaux");
        for (const c of localContracts) {
          await db.collection("contracts").doc(c.id).set(c, { merge: true });
        }
      }
    }

    // 🔄 Si on est déjà sur l'onglet contrats, on recharge la liste
    if (typeof loadContractsList === "function" && currentListType === "contrat") {
      loadContractsList();
    }

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
      data: client
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

  if (!db || !navigator.onLine) {
    enqueueSync({
      collection: "clients",
      action: "delete",
      docId: id
    });
    return;
  }

  try {
    await db.collection("clients").doc(id).delete();
    processSyncQueue();
  } catch (e) {
    console.error("Erreur Firestore (delete client)", e);
  }
}


async function syncClientsWithFirestore() {
  if (!db) return;

  try {
    const snap = await db.collection("clients").get();
    const cloudClients = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (data && data.name) {
        cloudClients.push(data);
      }
    });

    if (cloudClients.length > 0) {
      console.log("[Clients] Chargement depuis Firestore :", cloudClients.length, "clients");
      saveClients(cloudClients);
      refreshClientDatalist();
    } else {
      const localClients = getClients();
      if (localClients.length > 0) {
        console.log("[Clients] Firestore vide, push des clients locaux");
        for (const c of localClients) {
          const id = c.id || getClientDocId(c);
          c.id = id;
          await db.collection("clients").doc(id).set(c, { merge: true });
        }
      }
      refreshClientDatalist();
    }

  } catch (e) {
    console.error("Erreur sync clients Firestore :", e);
  }
}

// ----- Récupération d'un tarif dans PRESTATION_TEMPLATES -----

function getTarifFromTemplates(kind, clientType) {
  if (!kind) return 0;

  const tpl = PRESTATION_TEMPLATES.find((t) => t.kind === kind);
  if (!tpl) return 0;

  const custom =
    typeof getCustomPrices === "function" ? getCustomPrices() : {};
  const key =
    kind + "_" + (clientType === "syndic" ? "syndic" : "particulier");

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

  while (y < end.getFullYear() || (y === end.getFullYear() && m <= end.getMonth())) {
    const monthStart = new Date(y, m, 1);
    const monthEnd   = new Date(y, m + 1, 0);

    const effStart = monthStart < start ? start : monthStart;
    const effEnd   = monthEnd > end ? end : monthEnd;

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
    endDateISO: end.toISOString().slice(0, 10)
  };
}


function computeMonthsEteHiverBetween(startISO, endISO) {
  if (!startISO || !endISO) {
    return { monthsEte: 0, monthsHiver: 0 };
  }

  const start = new Date(startISO + "T00:00:00");
  const end   = new Date(endISO  + "T00:00:00");

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { monthsEte: 0, monthsHiver: 0 };
  }

  let y = start.getFullYear();
  let m = start.getMonth(); // 0-11

  let monthsEte = 0;
  let monthsHiver = 0;

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const MIN_DAYS = 15; // au moins 15 jours dans le mois

  while (y < end.getFullYear() || (y === end.getFullYear() && m <= end.getMonth())) {
    const monthStart = new Date(y, m, 1);
    const monthEnd   = new Date(y, m + 1, 0);

    // chevauchement réel entre le contrat et ce mois
    const effStart = monthStart < start ? start : monthStart;
    const effEnd   = monthEnd > end   ? end   : monthEnd;

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
  const modeEl        = document.getElementById("ctMode");
  const passHiverEl   = document.getElementById("ctPassHiver");
  const passEteEl     = document.getElementById("ctPassEte");
  const startDateEl   = document.getElementById("ctStartDate");
  const durationEl    = document.getElementById("ctDuration");
  const endDateEl     = document.getElementById("ctEndDate");
  const periodEl      = document.getElementById("ctPeriod");
  const totalPassEl   = document.getElementById("ctTotalPassages");
  const recapSummary  = document.getElementById("ctRecapSummary");
  const warnBox       = document.getElementById("ctWarning");

  if (!modeEl || !passHiverEl || !passEteEl || !startDateEl || !durationEl || !totalPassEl) {
    return;
  }

  // 2) Mode entretien
  let mode      = modeEl.value || "standard";
  let passHiver = parseInt(passHiverEl.value || "0", 10) || 0;
  let passEte   = parseInt(passEteEl.value   || "0", 10) || 0;

  if (mode === "standard") {
    passHiver = 1;
    passEte   = 2;
    passHiverEl.value = "1";
    passEteEl.value   = "2";
  } else if (mode === "intensif") {
    passHiver = 2;
    passEte   = 4;
    passHiverEl.value = "2";
    passEteEl.value   = "4";
  }

  const startISO = startDateEl.value || "";
  const duration = parseInt(durationEl.value || "0", 10) || 0;

  let monthsEte = 0;
  let monthsHiver = 0;

  // 3) Calcul des mois + date de fin via computeContractMonths()
  let endISO = "";
  if (startISO && duration > 0) {
    const info = computeContractMonths(startISO, duration);
    monthsEte   = info.monthsEte;
    monthsHiver = info.monthsHiver;
    endISO      = info.endDateISO;

    if (endDateEl) endDateEl.value = endISO;

    if (periodEl) {
      const debutFr = new Date(startISO + "T00:00:00").toLocaleDateString("fr-FR");
      const finFr   = new Date(endISO   + "T00:00:00").toLocaleDateString("fr-FR");
      periodEl.value = `${debutFr} → ${finFr}`;
    }
  } else {
    if (endDateEl) endDateEl.value = "";
    if (periodEl)  periodEl.value  = "";
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
      warnings.push("Merci de renseigner une date de début et une durée de contrat.");
    } else {
      if (monthsEte === 0 && passEte > 0) {
        warnings.push("La période ne contient aucun mois d’été alors que des passages d’été sont définis.");
      }
      if (monthsHiver === 0 && passHiver > 0) {
        warnings.push("La période ne contient aucun mois d’hiver alors que des passages d’hiver sont définis.");
      }
      if (totalPassages === 0 && (passHiver > 0 || passEte > 0)) {
        warnings.push("Avec ces paramètres, le total de passages calculé est de 0. Vérifie la date de début, la durée et la fréquence.");
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
  const clientType   = document.getElementById("ctClientType")?.value || "particulier";
  const mainService  = document.getElementById("ctMainService")?.value || "piscine_chlore";
  const includeOpen  = document.getElementById("ctIncludeOpening")?.checked || false;
  const includeWinter= document.getElementById("ctIncludeWinter")?.checked || false;
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
    airbnbExtra = totalHT * 0.20;
    totalHT += airbnbExtra;
  }

  const tvaRateInput = document.getElementById("tvaRate");
  const tvaRate = tvaRateInput
    ? (parseFloat(String(tvaRateInput.value).replace(",", ".")) || 0)
    : 0;

  const tvaAmount = totalHT * (tvaRate / 100);
  const totalTTC  = totalHT + tvaAmount;

  const unitInput   = document.getElementById("ctUnitPrice");
  const totalHTInput= document.getElementById("ctTotalHT");
  const recapPass   = document.getElementById("ctRecapPassages");
  const recapPrice  = document.getElementById("ctRecapPrice");
  const recapTotal  = document.getElementById("ctRecapTotal");

  const format =
    typeof formatEuro === "function"
      ? formatEuro
      : (v) => (v.toFixed ? v.toFixed(2) + " €" : v + " €");

  if (unitInput)   unitInput.value   = unitPrice ? format(unitPrice) : "0,00 €";
  if (totalHTInput) totalHTInput.value = format(totalHT);
  if (recapPass)   recapPass.textContent  = totalPassages.toString();
  if (recapPrice)  recapPrice.textContent = unitPrice ? format(unitPrice) : "0,00 €";

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
  const clientName = (document.getElementById("ctClientName")?.value || "").trim();
  const clientAddress = (document.getElementById("ctClientAddress")?.value || "").trim();

  if (showErrors && (!clientName || !clientAddress)) {
    showConfirmDialog({
      title: "Infos client manquantes",
      message: "Merci de renseigner au minimum le nom et l'adresse du client.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return null;
  }
  // Type de client obligatoire (Particulier / Syndic)
  const clientTypeHiddenEl = document.getElementById("ctClientType");
  const clientTypeValue = (clientTypeHiddenEl?.value || "").trim();

  if (showErrors && !clientTypeValue) {
    showConfirmDialog({
      title: "Type de client manquant",
      message: "Merci de sélectionner un type de client (Particulier ou Syndic / Agence).",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return null;
  }

  const client = {
    civility: (document.getElementById("ctClientCivility")?.value || "").trim(),
    name: clientName,
    address: clientAddress,
    phone: (document.getElementById("ctClientPhone")?.value || "").trim(),
    email: (document.getElementById("ctClientEmail")?.value || "").trim(),
    reference: (document.getElementById("ctReference")?.value || "").trim()
  };

  const site = {
    civility: (document.getElementById("ctSiteCivility")?.value || "").trim(),
    name: (document.getElementById("ctSiteName")?.value || "").trim(),
    address: (document.getElementById("ctSiteAddress")?.value || "").trim()
  };

  const pool = {
    type: (document.getElementById("ctPoolType")?.value || "").trim(),
    equipment: (document.getElementById("ctEquipment")?.value || "").trim(),
    volume: (document.getElementById("ctVolume")?.value || "").trim(),
    notes: (document.getElementById("ctNotes")?.value || "").trim()
  };

  const startDate = (document.getElementById("ctStartDate")?.value || "").trim();
  const duration = parseInt(document.getElementById("ctDuration")?.value || "0", 10) || 0;

  const totalPassagesStr = (document.getElementById("ctTotalPassages")?.value || "0").trim();
  const totalPassages = parseInt(totalPassagesStr || "0", 10) || 0;

  // Reprendre les valeurs numériques des champs formatés
  const unitPriceStr = (document.getElementById("ctUnitPrice")?.value || "0")
    .replace(/\s|€|€/g, "")
    .replace(",", ".");
  const totalHTStr = (document.getElementById("ctTotalHT")?.value || "0")
    .replace(/\s|€|€/g, "")
    .replace(",", ".");

  // TVA pour le contrat (on lit le même champ que devis/factures)
  const tvaRateInput = document.getElementById("tvaRate");
  const tvaRate = tvaRateInput ? parseFloat(tvaRateInput.value) || 0 : 0;
  const totalHTNum = parseFloat(totalHTStr) || 0;
  const tvaAmount = totalHTNum * (tvaRate / 100);
  const totalTTC = totalHTNum + tvaAmount;

const pricing = {
  clientType: clientTypeValue || "particulier",

  mainService: (document.getElementById("ctMainService")?.value || "piscine_chlore").trim(),
  mode: (document.getElementById("ctMode")?.value || "standard").trim(),
  passHiver: parseInt(document.getElementById("ctPassHiver")?.value || "0", 10) || 0,
  passEte: parseInt(document.getElementById("ctPassEte")?.value || "0", 10) || 0,
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

  includeOpening: document.getElementById("ctIncludeOpening")?.checked || false,
  includeWinter:  document.getElementById("ctIncludeWinter")?.checked  || false,

  // ---------- Usage Airbnb ----------

  airbnbOption: document.getElementById("ctAirbnb")?.checked || false
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
    createdAt: existing?.createdAt || new Date().toISOString()
  };

  return contract;
}

// ----- Remplir le formulaire depuis un contrat -----

function fillContractForm(contract) {
  if (!contract) return;

  currentContractId = contract.id;

  const c    = contract.client  || {};
  const s    = contract.site    || {};
  const p    = contract.pool    || {};
  const pr   = contract.pricing || {};
  const meta = contract.meta    || {};

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
  const ctPartRadio  = document.getElementById("ctClientParticulier");
  const ctSynRadio   = document.getElementById("ctClientSyndic");

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
  if (typeof pr.tvaRate === "number") {
    const tvaRateInput = document.getElementById("tvaRate");
    if (tvaRateInput) tvaRateInput.value = pr.tvaRate;

    const tva0  = document.getElementById("tva0");
    const tva20 = document.getElementById("tva20");
    if (tva0 && tva20) {
      if (pr.tvaRate === 0) {
        tva0.checked = true;
        tva20.checked = false;
      } else {
        tva20.checked = true;
        tva0.checked = false;
      }
    }
  }

  // ---------- 8. BANDEAU DEVIS LIÉ (COULEUR) ----------
  let linkedDevis = null;
  if (typeof getAllDocuments === "function" && meta.sourceDevisId) {
    const docs = getAllDocuments();
    linkedDevis = docs.find(d => d.id === meta.sourceDevisId) || null;
  }
  updateCtDevisBanner(linkedDevis, meta);

  // ---------- 9. PRIX ----------
  const unitInput  = document.getElementById("ctUnitPrice");
  const totalHTInp = document.getElementById("ctTotalHT");

  if (unitInput) {
    unitInput.value = pr.unitPrice != null ? pr.unitPrice : "";
  }
  if (totalHTInp) {
    totalHTInp.value = pr.totalHT != null ? pr.totalHT : "";
  }

  // ---------- 10. Type de bassin -> prestation ----------
  const ctMainService = document.getElementById("ctMainService");
  const ctPoolTypeEl  = document.getElementById("ctPoolType");
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
    // On récupère le statut du devis lié si présent
    const meta = contract.meta || {};
    let statusCode =
      (meta.sourceDevisStatus ||
       meta.devisStatus ||
       contract.status ||
       "").toLowerCase();

    let displayStatus = "En attente"; // valeur par défaut

    // Mapping :
    // devis accepté   -> En cours
    // devis en attente -> En attente
    // devis refusé / expiré -> Non validé
    if (statusCode === "accepte" || statusCode === "accepted") {
      displayStatus = "En cours";
    } else if (
      statusCode === "refuse"  || statusCode === "refused" ||
      statusCode === "expire" || statusCode === "expired"
    ) {
      displayStatus = "Non validé";
    } else {
      // tout le reste (en_attente, pending, vide...) -> En attente
      displayStatus = "En attente";
    }

    ctStatus.textContent = displayStatus;
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
    number     = devis.number || "";
    statusCode = devis.status || "";
  } else {
    number     = metaFallback.sourceDevisNumber || "";
    statusCode = metaFallback.sourceDevisStatus || metaFallback.devisStatus || "";
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
    bg     = "#E8F7E8";
    color  = "#1E7C1E";
    border = "#3CB43C";
    label  = "Accepté";
  } else if (norm === "closed" || norm === "cloture") {
    bg     = "#E0E0E0";
    color  = "#424242";
    border = "#BDBDBD";
    label  = "Clôturé";
  } else if (norm === "refused" || norm === "refuse") {
    bg     = "#FFE5E5";
    color  = "#C62828";
    border = "#E57373";
    label  = "Refusé";
  } else if (norm === "expired" || norm === "expire") {
    bg     = "#FFECD9";
    color  = "#E67E22";
    border = "#FFB56A";
    label  = "Expiré";
  } else {
    // En attente / inconnu
    bg     = "#FFF6D8";
    color  = "#8E6C00";
    border = "#EBCB66";
    label  = "En attente";
  }

  banner.style.display    = "block";
  banner.style.background = bg;
  banner.style.borderLeft = `4px solid ${border}`;
  banner.style.color      = color;

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
  docs = docs.filter(doc => doc.contractId !== contract.id);

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
    // première échéance déjà créée
    installmentsCount = 1;
    saveDocuments(docs); // pour la numérotation
  }

  // 4️⃣ Calculer la 1re prochaine échéance (particulier + syndic)
  pr.nextInvoiceDate = computeNextInvoiceDate(contract);

  // 5️⃣ Rattraper toutes les échéances manquantes jusqu'à aujourd'hui,
  //    SANS dépasser le nombre d'échéances prévues
  while (pr.nextInvoiceDate &&
         installmentsCount < totalInstallments) {

    const nextISO  = pr.nextInvoiceDate;
    const nextDate = new Date(nextISO + "T00:00:00");
    if (isNaN(nextDate.getTime()) || nextDate > todayObj) {
      break;
    }

    const inv = createAutomaticInvoice(contract);
    if (!inv) {
      break;
    }

    // On force la date de la facture à la vraie échéance
    inv.date = nextISO;

    docs.push(inv);
    if (typeof saveSingleDocumentToFirestore === "function") {
      saveSingleDocumentToFirestore(inv);
    }
    saveDocuments(docs);  // pour que getNextNumber voie ce numéro

    installmentsCount++;

    // Recalcul de la prochaine échéance après cette facture
    pr.nextInvoiceDate = computeNextInvoiceDate(contract);
  }

  // 6️⃣ Sauvegarde finale des documents & du contrat
  saveDocuments(docs);

  contract.pricing = pr;

  const allContracts = getAllContracts().map(c =>
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
  const btnTop    = document.getElementById("contractTransformButtonTop");
  const btnBottom = document.getElementById("contractTransformButtonBottom");
  const visible   = !!currentContractId;

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
  const startDateEl   = document.getElementById("ctStartDate");
  const billingModeEl = document.getElementById("ctBillingMode");

  if (!startDateEl.value) {
    showConfirmDialog({
      title: "Champ manquant",
      message: "Veuillez renseigner la date de début du contrat.",
      confirmLabel: "OK",
      variant: "error",
      icon: "⚠️"
    });
    return;
  }

  if (!billingModeEl.value) {
    showConfirmDialog({
      title: "Mode de facturation manquant",
      message: "Merci de sélectionner un mode de facturation.",
      confirmLabel: "OK",
      variant: "error",
      icon: "⚠️"
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
    if (!["mensuel", "trimestriel", "semestriel", "annuel"].includes(pr.billingMode)) {
      pr.billingMode = "annuel";
    }
  }

if (pr.clientType === "syndic") {
    if (!["mensuel", "trimestriel", "semestriel", "annuel"].includes(pr.billingMode)) {
        pr.billingMode = "annuel";
    }
}

  // 3️⃣ Normalisation du contrat (statut, meta, etc.)
  contract = normalizeContractBeforeSave(contract);

  const list = getAllContracts();
  const idx = list.findIndex(c => c.id === contract.id);

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
  const clientType  =
    (contract.pricing && contract.pricing.clientType) || "particulier";
  const devisNeeded = isDevisObligatoireForContract(contract);
  const devisOK     = isDevisAcceptedForContract(contract);
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
          const formView     = document.getElementById("formView");
          if (contractView) contractView.classList.add("hidden");
          if (formView)     formView.classList.remove("hidden");

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
      }
    });

    // ❗Important : pas de facturation tant que devis pas accepté
    return;
  }

  // ✅ Cas 2 : Pas de devis obligatoire OU devis déjà accepté
  if (isNew) {
    // ======= NOUVEAU CONTRAT =======

    // 1️⃣ Facture initiale (PARTICULIER uniquement)
    const invoice = generateImmediateBilling(contract);

    if (invoice) {
      const docs = getAllDocuments();
      docs.push(invoice);
      saveDocuments(docs);

      if (typeof saveSingleDocumentToFirestore === "function") {
        saveSingleDocumentToFirestore(invoice);
      }

      showConfirmDialog({
        title: "Facture créée",
        message: "La facture initiale a été générée automatiquement 💶",
        confirmLabel: "OK",
        variant: "success",
        icon: "💶"
      });
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
    // ======= CONTRAT EXISTANT =======
    rebuildContractInvoices(contract);

    showConfirmDialog({
      title: "Contrat mis à jour",
      message: "Le contrat et toute la facturation ont été recalculés ✔️",
      confirmLabel: "OK",
      variant: "success",
      icon: "🔁"
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
    icon: "✅"
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
  const ctSynRadio  = document.getElementById("ctClientSyndic");
  if (ctPartRadio) ctPartRadio.checked = true;
  if (ctSynRadio)  ctSynRadio.checked  = false;

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
    year: "numeric"
  });
}


// ----- Suppression -----

function deleteCurrentContract() {
  const ref = (document.getElementById("ctReference")?.value || "").trim();
  const clientName = (document.getElementById("ctClientName")?.value || "").trim();
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
      }
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
    }
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
  const c    = contract.client  || {};
  const s    = contract.site    || {};
  const pr   = contract.pricing || {};
  const meta = contract.meta    || {};

  const totalContractHT = Number(pr.totalHT) || 0;
  const tvaRate         = Number(pr.tvaRate) || 0;

  // Si on n'a pas de date de début ou de fréquence, on retombe sur l'ancienne logique "reste du contrat"
  const hasPassHiver = pr.passHiver !== undefined && pr.passHiver !== null;
  const hasPassEte   = pr.passEte   !== undefined && pr.passEte   !== null;

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
  let resISO  = meta.resiliationDate || new Date().toISOString().slice(0, 10);
  let resDate = new Date(resISO + "T00:00:00");
  if (isNaN(resDate.getTime())) {
    resDate = new Date();
    resDate.setHours(0, 0, 0, 0);
    resISO  = resDate.toISOString().slice(0, 10);
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

  const startISO        = pr.startDate;
  const effectiveEndISO = effectiveEnd.toISOString().slice(0, 10);

  // 3) Calcul du nombre de mois été / hiver sur la période début -> résiliation+préavis
  const { monthsEte, monthsHiver } = computeMonthsEteHiverBetween(startISO, effectiveEndISO);

  // 4) Passages théoriques sur cette période
  const passHiver = Number(pr.passHiver) || 0;
  const passEte   = Number(pr.passEte)   || 0;
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
    .filter(d => d.type === "facture" && d.contractId === contract.id)
    .reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0);

  // 6) Solde à facturer
  const remainingHT = Math.max(0, htDue - alreadyBilledHT);
  if (remainingHT <= 0) {
    return null; // rien à facturer
  }

  const tvaAmount = tvaRate > 0 ? remainingHT * (tvaRate / 100) : 0;
  const totalTTC  = remainingHT + tvaAmount;

  const number   = getNextNumber("facture");
  const todayISO = new Date().toISOString().slice(0, 10);

  // 💡 Date de facture = fin effective du contrat (sans aller dans le futur)
  const invoiceDateISO =
    effectiveEndISO <= todayISO ? effectiveEndISO : todayISO;

  const baseLabel       = "Facture de clôture – Contrat d’entretien";
  const formattedPeriod = formatNicePeriod(startISO, effectiveEndISO);
  const subject         = formattedPeriod
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
    `Les conditions générales restent applicables.`
  ].join("\n");

  const prestations = [
    {
      desc:   lineDesc,
      detail: "Solde restant dû au titre du contrat d’entretien (prorata + préavis).",
      qty:    1,
      price:  remainingHT,
      total:  remainingHT,
      unit:   "forfait",
      dates:  [],
      kind:   "contrat_resiliation"
    }
  ];

  const facture = {
    id: generateId("FAC"),
    type: "facture",
    number,
    date: invoiceDateISO,       // 🔥 ICI : fin de contrat, plus todayISO
    validityDate: "",
    subject,

    contractId:        contract.id || null,
    contractReference: c.reference || "",

    client: {
      civility: c.civility || "",
      name:     c.name     || "",
      address:  c.address  || "",
      phone:    c.phone    || "",
      email:    c.email    || ""
    },

    siteCivility: s.civility || "",
    siteName:     s.name     || "",
    siteAddress:  s.address  || "",

    prestations,
    tvaRate,
    subtotal:       remainingHT,
    discountRate:   0,
    discountAmount: 0,
    tvaAmount,
    totalTTC,

    notes,

    paid:        false,
    paymentMode: "",
    paymentDate: "",

    status: "",
    conditionsType: pr.clientType === "syndic" ? "agence" : "particulier",

    createdAt: new Date().toISOString()
  };

  docs.push(facture);
  saveDocuments(docs);
  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(facture);
  }

  return facture;
}

function createTerminationInvoiceSimple(contract) {
  const c   = contract.client  || {};
  const s   = contract.site    || {};
  const pr  = contract.pricing || {};

  const totalContractHT = Number(pr.totalHT) || 0;
  const tvaRate         = Number(pr.tvaRate) || 0;

  // Montant déjà facturé pour ce contrat
  const docs = getAllDocuments();
  const alreadyBilledHT = docs
    .filter(d => d.type === "facture" && d.contractId === contract.id)
    .reduce((sum, d) => sum + (Number(d.subtotal) || 0), 0);

  const remainingHT = Math.max(0, totalContractHT - alreadyBilledHT);
  if (remainingHT <= 0) return null;

  const tvaAmount = tvaRate > 0 ? remainingHT * (tvaRate / 100) : 0;
  const totalTTC  = remainingHT + tvaAmount;

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
      kind: "contrat_resiliation"
    }
  ];

  const notes = [
    "Facture de clôture émise suite à la résiliation du contrat d’entretien.",
    "Le montant facturé correspond au solde restant dû conformément aux conditions contractuelles."
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
      name:     c.name     || "",
      address:  c.address  || "",
      phone:    c.phone    || "",
      email:    c.email    || ""
    },

    siteCivility: s.civility || "",
    siteName:     s.name     || "",
    siteAddress:  s.address  || "",

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

    createdAt: new Date().toISOString()
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
      "Laisse vide pour utiliser la date d'aujourd'hui : " + todayISO,
    todayISO
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
      contract.meta.resiliationWho  = "prestataire"; // ou "client" 

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
            const formView     = document.getElementById("formView");
            if (contractView) contractView.classList.add("hidden");
            if (formView) formView.classList.remove("hidden");

            if (typeof loadDocument === "function") {
              loadDocument(facture.id);
            }
            if (typeof loadDocumentsList === "function") {
              loadDocumentsList();
            }
          }
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
          icon: "✅"
        });
      }
    }
  });
}



function transformContractToInvoice() {
  // On recalcule d'abord le contrat depuis le formulaire
  recomputeContract();
  const contract = buildContractFromForm(true);
  if (!contract) return;

  // 🔒 Blocage si devis obligatoire mais non accepté
  const devisNeeded = isDevisObligatoireForContract(contract);
  const devisOK     = isDevisAcceptedForContract(contract);

  if (devisNeeded && !devisOK) {
    const linkedDevis = getLinkedDevisForContract(contract);
    const devisNum    = linkedDevis ? linkedDevis.number : null;

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
      icon: "🧾"
    });
    return;
  }

  // --- 🧾 Partie d'origine : on garde tout comme avant ---

  const c  = contract.client  || {};
  const s  = contract.site    || {};
  const p  = contract.pool    || {};
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
  const tvaRate  = Number(pr.tvaRate) || 0;
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
      kind: "contrat_normal"
    }
  ];

  const baseNotesLines =
    pr.clientType === "syndic"
      ? [
          "Règlement à 30 jours fin de mois.",
          "Aucun escompte pour paiement anticipé. En cas de retard de paiement, des pénalités pourront être appliquées conformément aux conditions générales."
        ]
      : [
          "Règlement comptant à réception de la facture.",
          "Aucun escompte pour paiement anticipé. En cas de retard de paiement, des pénalités pourront être appliquées conformément aux conditions générales."
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
      reference: c.reference || ""
    },
    site: {
      name: s.name || "",
      address: s.address || ""
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
    contractId: contract.id || currentContractId || null
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
  const formView     = document.getElementById("formView");
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


  const c   = contract.client  || {};
  const s   = contract.site    || {};
  const p   = contract.pool    || {};
  const pr  = contract.pricing || {};
  const meta = contract.meta || {};

  const poolType = pr.mainService || p.type || "";

  const isPiscine =
    poolType === "piscine_sel" || poolType === "piscine_chlore";

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
const today   = new Date();
const pdfDateStr = today.toLocaleDateString("fr-FR");

const startDateFR = formatDateFr(pr.startDate);
const endDateFR   = formatDateFr(pr.endDateLabel);

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
    startDateFR && endDateFR
      ? `Période : ${startDateFR} → ${endDateFR}`
      : "";

  // ---------- 💰 Montants sécurisés ----------
  const rawTotalHT   = Number(pr.totalHT) || 0;
  const computedHT   = (pr.totalPassages || 0) * (pr.unitPrice || 0);
  const totalHTSafe  = rawTotalHT > 0 ? rawTotalHT : computedHT;

  let baseHTForInfo       = totalHTSafe;
  let airbnbExtraForInfo  = 0;

  if (pr.airbnbOption && totalHTSafe > 0) {
    baseHTForInfo      = totalHTSafe / 1.2;         // base HT
    airbnbExtraForInfo = totalHTSafe - baseHTForInfo;
  }

  const tvaRate      = pr.tvaRate || 0;
  const rawTvaAmount = Number(pr.tvaAmount) || 0;
  const tvaAmountSafe =
    tvaRate > 0
      ? (rawTvaAmount > 0 ? rawTvaAmount : totalHTSafe * (tvaRate / 100))
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
  d => d.type === "facture" && d.contractId === contract.id && d.prestations?.some(p => p.kind === "contrat_resiliation")
);

if (docsForThis.length > 0) {
  const invoice = docsForThis[docsForThis.length - 1]; // dernière facture de clôture
  const alreadyBilled = docsForThis.reduce((sum, f) => sum + (Number(f.subtotal) || 0), 0);
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

  const isSyndic        = pr.clientType === "syndic";
  const clientBlockTitle = isSyndic ? "Syndic / Agence" : "Client";
  const nameLabel        = isSyndic ? "Société" : "Nom";

  // ================= SIGNATURE CLIENT =================

  // 1) d'abord : signature stockée dans le CONTRAT (cas syndic)
  let clientSignatureDataUrl = contract.signature || "";
  let clientSignatureDate    = contract.signatureDate || "";

  // 2) si PAS de signature dans le contrat ET que ce n'est PAS un syndic,
  //    on essaie de récupérer la signature du DEVIS lié (cas particulier)
  if (!clientSignatureDataUrl && !isSyndic && typeof getAllDocuments === "function") {
    const meta = contract.meta || {};
    const docs = getAllDocuments();

    let linkedDevis = null;

    if (meta.sourceDevisId) {
      linkedDevis = docs.find(d => d.id === meta.sourceDevisId);
    } else if (meta.sourceDevisNumber) {
      linkedDevis = docs.find(
        d => d.type === "devis" && d.number === meta.sourceDevisNumber
      );
    }

    if (linkedDevis && linkedDevis.status === "accepte" && linkedDevis.signature) {
      clientSignatureDataUrl = linkedDevis.signature;
      clientSignatureDate    = linkedDevis.signatureDate || linkedDevis.date || "";
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
          ? `<p>${nameLabel} : ${
              [c.civility, c.name].filter(Boolean).join(" ")
            }</p>`
          : ""
      }

      ${c.address ? `<p>Adresse : ${c.address}</p>` : ""}

      ${
        c.phone || c.email
          ? `<p>Téléphone / Email : ${
              [c.phone, c.email].filter(Boolean).join(" / ")
            }</p>`
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

      ${isPiscine ? `
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
      ` : ""}

      ${isSpa ? `
      <p class="label" style="margin-top:4px;">4.1 Prestations Spa / Jacuzzi</p>
      <ul>
        <li>Vidange complète selon la fréquence définie.</li>
        <li>Nettoyage de la cuve, des buses et des cartouches.</li>
        <li>Désinfection air/eau et circuits.</li>
        <li>Contrôle de la soufflerie et du chauffage.</li>
        <li>Analyse de l’eau et dosage adapté.</li>
      </ul>
      ` : ""}

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
      Les déchets sont évacués conformément à la réglementation et aux normes AFNOR.
    </p>

    <p class="label" style="margin-top:4px;">5.4 Accès aux installations – déplacement dû</p>
    <p>
      Le client garantit l’accès au bassin et au local technique.
      En cas d’accès impossible (portail fermé, clé absente, code erroné, chiens, bâche…),
      <strong>le déplacement reste dû</strong>.
      Le prestataire n’est pas tenu d’attendre plus de 10 minutes sur place.
    </p>

    <p class="label" style="margin-top:4px;">5.5 Obligations du client</p>
    <p>
      Le client informe de tout changement d’usage (location, forte fréquentation),
      travaux, panne, fuite ou modification technique.
    </p>

    <p class="label" style="margin-top:4px;">5.6 Obligation de moyens</p>
    <p>
      AquaClim Prestige intervient avec une obligation de moyens.
      L’apparition d’algues ou d’eau trouble peut provenir d’intempéries,
      d’un usage intensif ou d’un matériel défaillant et peut nécessiter des interventions hors contrat.
    </p>

    <p class="label" style="margin-top:4px;">5.7 Installations non conformes</p>
    <p>
      En cas d’installation dangereuse ou non conforme (fuite importante, électricité défectueuse,
      surchauffe moteur…), les interventions peuvent être suspendues jusqu’à remise en conformité.
    </p>

    <p class="label" style="margin-top:4px;">5.8 Locations saisonnières & usage intensif</p>
    <p>
      En cas de location (Airbnb, saisonnier) ou usage intensif,
      des passages supplémentaires peuvent être nécessaires et facturés.
    </p>

    <p class="label" style="margin-top:4px;">5.9 Assurance & responsabilités</p>
    <p>
      AquaClim Prestige est assuré en RC Pro.
      La responsabilité ne couvre pas les défauts structurels, la plomberie enterrée,
      le matériel ancien ou non conforme, ni la mauvaise utilisation par le client.
    </p>

  <p class="label" style="margin-top:4px;">5.10 Durée – renouvellement – résiliation</p>
<p>
  Le contrat est conclu pour la période définie. Il peut être résilié à tout moment,
  par le client ou par le prestataire, avec un préavis de <strong>30 jours calendaires</strong>.
  La résiliation doit être adressée <strong>exclusivement par courrier recommandé avec accusé de réception (LRAR)</strong>.

</p>
<p>
  Les prestations réalisées, ainsi que celles prévues durant la période de préavis,
  restent intégralement dues. En cas d’impayés répétés, d’accès impossible récurrent,
  d’installation dangereuse ou de force majeure, le prestataire peut suspendre ou résilier
  le contrat sans préavis.
</p>

    <!-- Encadré automatique si résilié -->
    ${resiliationHTML}

    <p class="label" style="margin-top:4px;">5.11 Photos (preuve)</p>
    <p>
      Le prestataire peut prendre des photos avant/après intervention.
      Elles peuvent servir de preuve en cas de litige.
    </p>

    <p class="label" style="margin-top:4px;">5.12 Délais d’intervention</p>
    <p>
      Les interventions sont réalisées dans un délai raisonnable selon le planning.
      Aucun délai impératif ne peut être imposé sans accord écrit.
    </p>

    <p class="label" style="margin-top:4px;">5.13 Eau verte & intempéries</p>
    <p>
      Les eaux vertes, algues, sable saharien, pollen ou dépôts liés aux intempéries
      relèvent d’interventions hors contrat et peuvent être facturés.
    </p>

    <p class="label" style="margin-top:4px;">5.14 Filtration & matériel</p>
    <p>
      Le client garantit le bon fonctionnement de la filtration (pompe, horloge, vannes)
      et un temps de filtration suffisant.
      Le prestataire n’est pas responsable d’un mauvais traitement lié à un matériel défaillant.
    </p>

    <p class="label" style="margin-top:4px;">5.15 Réclamations</p>
    <p>
      Toute réclamation doit être formulée par écrit sous 48 h.
      Passé ce délai, l’intervention est considérée conforme.
    </p>

    <p class="label" style="margin-top:4px;">5.16 Révision annuelle</p>
    <p>
      Les tarifs peuvent être révisés chaque 1er janvier
      selon l’évolution des coûts et de l’indice Syntec.
    </p>

    <p class="label" style="margin-top:4px;">5.17 Données personnelles</p>
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
        Les modalités de règlement (mensualisation, facturation périodique, etc.) sont précisées dans les devis et factures associés.
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
            (!contract._inheritedSignature && !contract.signature)
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
          billingSelect.value = "mensuel";       // défaut particulier
        } else {
          billingSelect.value = "annuel";        // défaut syndic (pour la suite)
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
  sigWrapper.style.display = (type === "syndic") ? "block" : "none";
}
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
  const idx = list.findIndex(c => c.id === oldContract.id);
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

  const endLabel   = formatDateFr(endISO);

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
  const pr         = contract.pricing || {};
  const mode       = pr.billingMode || "annuel";
  const clientType = pr.clientType || "particulier";

  const startISO = pr.startDate;
  if (!startISO) return [];

  const totalHT  = Number(pr.totalHT || 0);
  const tvaRate  = Number(pr.tvaRate || 0);
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

    const amountHT  = totalHT / n;
    const amountTVA = amountHT * (tvaRate / 100);
    const amountTTC = amountHT + amountTVA;

    let first = new Date(start);
    first.setHours(0, 0, 0, 0);

    for (let i = 0; i < n; i++) {
      const d = new Date(first);
      d.setMonth(first.getMonth() + i);

      if (d > contractEnd) break;

      rows.push({
        index:        i + 1,
        date:         formatDateYMD(d),
        amountHT,
        amountTVA,
        amountTTC,
        status:       "Prévisionnel",
        statusType:   "forecast",
        invoiceId:    null,
        invoiceNumber:""
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
      n          = 2;
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
      amountHT = totalHT;          // 1 seule facture
    } else if (mode === "annuel_50_50") {
      amountHT = totalHT / 2;      // deux fois 50 %
    } else {
      amountHT = totalHT / n;      // fractionnement classique
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
        index:        i + 1,
        date:         iso,
        amountHT,
        amountTVA,
        amountTTC,
        status:       "Prévisionnel",
        statusType:   "forecast",
        invoiceId:    null,
        invoiceNumber:""
      });

      if (stepMonths > 0) {
        current.setMonth(current.getMonth() + stepMonths);
      }
    }
  }

  // 🔍 On croise avec les factures réelles du contrat
  const docs = getAllDocuments();

  // 1) On prend TOUTES les factures du contrat
  let invoices = docs.filter(d =>
    d.type === "facture" &&
    d.contractId === contract.id
  );

  // 2) Pour les PARTICULIERS, on ne garde que les factures d’échéance
  if (clientType === "particulier") {
    invoices = invoices.filter(d =>
      d.prestations &&
      d.prestations.some(p =>
        p.kind === "contrat_echeance" ||
        p.kind === "contrat_echeance_initiale"
      )
    );
  }
  // Pour les SYNDICS, on garde toutes les factures liées au contrat

  rows.forEach((r) => {
    const inv = invoices.find(d => {
      if (!d.date) return false;

      const invDate = new Date(d.date);
      const rowDate = new Date(r.date + "T00:00:00");

      return (
        invDate.getFullYear() === rowDate.getFullYear() &&
        invDate.getMonth()    === rowDate.getMonth()
        // 👆 on matche au MOIS, pas au jour
      );
    });

    if (inv) {
      const invHT  = Number(inv.subtotal || inv.total || 0);
      const invTVA = Number(inv.tvaAmount || 0);
      const invTTC = Number(inv.totalTTC || inv.total || invHT + invTVA);

      r.amountHT  = invHT || r.amountHT;
      r.amountTVA = invTVA;
      r.amountTTC = invTTC;

      r.invoiceId     = inv.id || null;
      r.invoiceNumber = inv.number || "";

      if (inv.paid) {
        r.status     = "Payée";
        r.statusType = "paid";
      } else {
        r.status     = "À payer";
        r.statusType = "due";
      }
    }
  });

  // 🔵 Facture de résiliation éventuelle
  const closureInvoice = docs.find(d =>
    d.type === "facture" &&
    d.contractId === contract.id &&
    d.prestations &&
    d.prestations.some(p => p.kind === "contrat_resiliation")
  );

  if (closureInvoice) {
    const invHT  = Number(closureInvoice.subtotal || closureInvoice.total || 0);
    const invTVA = Number(closureInvoice.tvaAmount || 0);
    const invTTC = Number(closureInvoice.totalTTC || closureInvoice.total || invHT + invTVA);

    rows.push({
      index:         rows.length + 1,
      date:          closureInvoice.date ? closureInvoice.date.slice(0, 10) : "",
      amountHT:      invHT,
      amountTVA:     invTVA,
      amountTTC:     invTTC,
      status:        "Résiliation",
      statusType:    "closure",
      invoiceId:     closureInvoice.id || null,
      invoiceNumber: closureInvoice.number || ""
    });
  }

  // 🎨 Ajustement des couleurs uniquement pour les contrats SYNDIC
  const todayISO = new Date().toISOString().slice(0, 10);
  const today    = new Date(todayISO + "T00:00:00");

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
        r.status     = "Prévisionnel";
        return;
      }

      // Facture payée → déjà vert
      if (r.statusType === "paid") {
        return;
      }

      // Facture non payée
      if (d <= today) {
        r.statusType = "due";          // rouge
        r.status     = "À payer";
      } else {
        r.statusType = "forecast";     // gris
        r.status     = "Prévisionnel";
      }
    });
  }

  return rows;
}


function renderContractScheduleHTML(rows) {
  if (!rows || !rows.length) {
    return "<p>Aucune échéance calculée pour ce contrat.</p>";
  }

  const hasTVA = rows.some(r => typeof r.amountTVA === "number" && !isNaN(r.amountTVA));

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
      rowClass = "schedule-row-paid";      // vert
    } else if (r.statusType === "due") {
      rowClass = "schedule-row-due";       // rouge
    } else if (r.statusType === "closure") {
      rowClass = "schedule-row-closure";   // autre couleur
    } else {
      rowClass = "schedule-row-forecast";  // gris léger
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
        ${hasTVA ? `
        <td class="amount-cell">${r.amountTVA.toFixed(2)} €</td>
        <td class="amount-cell">${r.amountTTC.toFixed(2)} €</td>` : ""}
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
    "#ctClientSyndic"
  ];

  recalcSelectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;

    const isInput = el.tagName === "INPUT";
    const evtName =
      isInput && (el.type === "number" || el.type === "date" || el.type === "checkbox" || el.type === "radio")
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
  const ctSynRadio  = document.getElementById("ctClientSyndic");
  const hiddenType  = document.getElementById("ctClientType");

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
  if (mode === "mensuel")      return 1;
  if (mode === "trimestriel")  return 3;
  if (mode === "semestriel")   return 6;
  // "annuel_50_50" et "annuel" auront un traitement spécifique ailleurs
  return 0;
}


// Combien d'échéances pour ce contrat ?

function getNumberOfInstallments(pricing) {
  const mode = pricing.billingMode || "annuel";

  if (mode === "annuel")       return 1;
  if (mode === "annuel_50_50") return 2;

  const dur  = Number(pricing.durationMonths || 0);
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

  const next  = new Date(pricing.nextInvoiceDate + "T00:00:00");

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
  const endLabel   = end.toLocaleDateString("fr-FR", opts);

  if (startLabel === endLabel) return startLabel;
  return `${startLabel} à ${endLabel}`;
}

function generateImmediateBilling(contract) {
  const pr = contract.pricing || {};
  const c  = contract.client  || {};
  const s  = contract.site    || {};

  const clientType = pr.clientType || "particulier";
  const mode       = pr.billingMode || "annuel";

  const totalHT = Number(pr.totalHT) || 0;
  if (totalHT <= 0) return null;

  // 🏢 SYNDIC → jamais de facture immédiate
  if (clientType === "syndic") {
    return null;
  }

  const todayISO = new Date().toISOString().slice(0, 10);
  const startISO = pr.startDate || todayISO;

  // ⛔ Si le contrat commence dans le futur -> pas de facture immédiate
  if (startISO > todayISO) {
    return null;
  }

  // 📅 Date de la facture initiale = date exacte de début
  const invoiceDateISO = startISO;
  const start = new Date(startISO + "T00:00:00");
  if (isNaN(start.getTime())) return null;

  // 📌 Nombre d’échéances prévues
  let n = 1;
  if (mode === "mensuel") {
    n = getNumberOfInstallments(pr);      // ex : 12 mois -> 12
  } else if (mode === "annuel_50_50") {
    n = 2;
  }
  if (!n || n < 1) n = 1;

  // 💰 Montant de cette facture
  let amountHT;
  if (mode === "annuel_50_50") {
    amountHT = totalHT / 2;
  } else if (mode === "mensuel") {
    amountHT = totalHT / n;
  } else {
    amountHT = totalHT;
  }

  const tvaRate   = Number(pr.tvaRate) || 0;
  const tvaAmount = amountHT * (tvaRate / 100);
  const totalTTC  = amountHT + tvaAmount;

  const number = getNextNumber("facture");

  const moisLabel    = monthYearFr(invoiceDateISO); // "décembre 2025"
  const clientName   = (c.name || "").trim();
  const suffixClient = clientName ? " – " + clientName : "";

  // Type de service
  const poolType = pr.mainService || "";
  let serviceLabel = poolType.includes("spa")
    ? "Entretien spa / jacuzzi"
    : "Entretien piscine";

  const globalPeriod = formatContractGlobalPeriod(pr); // "mai 2026 à octobre 2026"

  // 🧾 Libellés
  let subject;
  let lineDesc;

  if (mode === "annuel_50_50") {
    subject  = `${serviceLabel} – 1er paiement 50 % (1/2) – saison ${globalPeriod}${suffixClient}`;
    lineDesc = `${serviceLabel} – 1er paiement (50 %) (1/2) pour la saison ${globalPeriod}`;
  } else if (mode === "mensuel") {
    subject  = `${serviceLabel} – échéance 1/${n} – mois de ${moisLabel}${suffixClient}`;
    lineDesc = `${serviceLabel} – mois de ${moisLabel} – échéance 1/${n} sur la période ${globalPeriod}`;
  } else {
    subject  = `${serviceLabel} – acompte contrat${suffixClient}`;
    lineDesc = `${serviceLabel} – acompte sur contrat d’entretien (${globalPeriod})`;
  }

  const notes = [
    "Règlement à réception de facture.",
    "Aucun escompte pour paiement anticipé.",
    "Des pénalités peuvent être appliquées en cas de retard.",
    mode === "annuel_50_50"
      ? "Cette facture correspond au 1er paiement (50 %) du contrat d’entretien."
      : "Cette facture correspond à la première échéance du contrat d’entretien.",
    "Les Conditions Générales de Vente sont disponibles sur demande."
  ].join("\n");

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
      name:     c.name     || "",
      address:  c.address  || "",
      phone:    c.phone    || "",
      email:    c.email    || ""
    },

    siteCivility: s.civility || "",
    siteName:     s.name     || "",
    siteAddress:  s.address  || "",

    prestations: [
      {
        desc:   lineDesc,
        detail: "",
        qty:    1,
        price:  amountHT,
        total:  amountHT,
        unit:   "forfait",
        dates:  [invoiceDateISO],
        kind:   "contrat_echeance_initiale"
      }
    ],

    tvaRate,
    subtotal:       amountHT,
    discountRate:   0,
    discountAmount: 0,
    tvaAmount,
    totalTTC,

    notes,

    paid: false,
    paymentMode: "",
    paymentDate: "",

    status: "",
    conditionsType: clientType === "syndic" ? "agence" : "particulier",

    createdAt: new Date().toISOString()
  };
}

function createAutomaticInvoice(contract) {
  const pr = contract.pricing || {};
  const c  = contract.client  || {};
  const s  = contract.site    || {};

  const clientType = pr.clientType || "particulier";
  const mode       = pr.billingMode || "annuel";

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

  const n = getNumberOfInstallments(pr);
  if (!n || n < 1) return null;

  const nextISO = pr.nextInvoiceDate;
  if (!nextISO) return null;

  const nextDate = new Date(nextISO + "T00:00:00");
  if (isNaN(nextDate.getTime())) return null;

  const number   = getNextNumber("facture");
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
  const moisLabel    = monthYearFr(nextISO);
  const clientName   = c.name ? ` – ${c.name}` : "";

  let amountHT;
  let subject = "";
  let lineDesc = "";

  // ============================
  // 🔴 PARTICULIER
  // ============================
  if (clientType === "particulier") {
    if (mode === "annuel_50_50") {
      // 2e paiement (solde)
      amountHT = totalHT / 2;

      subject  = `${serviceLabel} – 2e paiement 50 % (2/2) – saison ${globalPeriod}${clientName}`;
      lineDesc = `${serviceLabel} – 2e paiement (50 %) (2/2) – solde du contrat d’entretien pour la saison ${globalPeriod}`;
    } else {
      // Mensuel anticipé (échéance i/n)

      // 💡 IMPORTANT :
      // numéro d’échéance = nb de factures d’échéance déjà existantes + 1
      const numEcheance = countContractInstallmentInvoices(contract.id) + 1;

      amountHT = totalHT / n;

      subject  = `${serviceLabel} – échéance ${numEcheance}/${n} – mois de ${moisLabel}${clientName}`;
      lineDesc = `${serviceLabel} – mois de ${moisLabel} – échéance ${numEcheance}/${n} sur la période ${globalPeriod}`;
    }
  }


  // ============================
  // 🔵 SYNDIC (post-payé)
  // ============================
  else {
 // Montant fractionné
    amountHT = totalHT / n;

    let stepMonths = getBillingStepMonths(mode);
    if (!stepMonths) stepMonths = duration;

    const totalInstallments = getNumberOfInstallments(pr);

    // Reconstruire la période [startPeriod, endPeriod]
    let periodStart = new Date(start);
    let periodEnd   = null;
    let found       = false;

    for (let i = 1; i <= totalInstallments; i++) {
      const endCandidate = new Date(start);
      endCandidate.setMonth(endCandidate.getMonth() + stepMonths * i);
      endCandidate.setDate(0); // dernier jour du mois précédent

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
      periodEnd   = prevEnd;
    }

    if (periodEnd > contractEnd) {
      periodEnd = new Date(contractEnd);
    }

    const startLabel = periodStart.toLocaleDateString("fr-FR");
    const endLabel   = periodEnd.toLocaleDateString("fr-FR");

 
    // 🔢 Numéro d’échéance pour le SYNDIC (comme pour le particulier)
    const numEcheance = countContractInstallmentInvoices(contract.id) + 1;

    subject  = `${serviceLabel} – échéance ${numEcheance}/${totalInstallments} – prestations du ${startLabel} au ${endLabel}${clientName}`;
    lineDesc = `${serviceLabel} – échéance ${numEcheance}/${totalInstallments} – prestations réalisées du ${startLabel} au ${endLabel}`;
  }

  const tvaAmount = amountHT * (tvaRate / 100);
  const totalTTC  = amountHT + tvaAmount;

  const notes = (clientType === "syndic"
    ? [
        "Règlement à 30 jours fin de mois.",
        "Aucun escompte pour paiement anticipé.",
        "En cas de retard de paiement, des pénalités pourront être appliquées ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement (art. L441-10 du Code de commerce).",
        "Cette facture correspond à la facturation des prestations réalisées sur la période indiquée.",
        "Les Conditions Générales de Vente sont disponibles sur demande."
      ]
    : [
        "Règlement à réception de facture.",
        "Aucun escompte pour paiement anticipé.",
        mode === "annuel_50_50"
          ? "Cette facture correspond au 2e paiement (50 %) du contrat d’entretien."
          : "Cette facture correspond à une échéance du contrat d’entretien.",
        "Les Conditions Générales de Vente sont disponibles sur demande."
      ]
  ).join("\n");

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
      name:     c.name     || "",
      address:  c.address  || "",
      phone:    c.phone    || "",
      email:    c.email    || ""
    },

    siteCivility: s.civility || "",
    siteName:     s.name     || "",
    siteAddress:  s.address  || "",

    prestations: [
      {
        desc:   lineDesc,
        detail: "",
        qty:    1,
        price:  amountHT,
        total:  amountHT,
        unit:   "forfait",
        dates:  [],
        kind:   "contrat_echeance"
      }
    ],

    tvaRate,
    subtotal:       amountHT,
    discountRate:   0,
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
    updatedAt: todayISO
  };
}




function createDevisFromCurrentContract() {
  if (!currentContractId) {
    showConfirmDialog({
      title: "Aucun contrat",
      message: "Enregistre d'abord le contrat avant de créer un devis.",
      confirmLabel: "OK",
      variant: "warning",
      icon: "⚠️"
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
  contract.meta.sourceDevisId     = devis.id;
  contract.meta.sourceDevisNumber = devis.number;

  // Mise à jour contrat
  const all = getAllContracts().map(c => c.id === contract.id ? contract : c);
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
  return docs.filter(d =>
    d.type === "facture" &&
    d.contractId === contractId &&
    d.prestations &&
    d.prestations.some(p =>
      p.kind === "contrat_echeance" ||
      p.kind === "contrat_echeance_initiale"
    )
  ).length;
}

// ---------- FACTURES D’ÉCHÉANCE AUTOMATIQUES ----------

function checkScheduledInvoices() {
  let docs        = getAllDocuments();
  const contracts = getAllContracts();
  const todayISO  = new Date().toISOString().slice(0, 10);

  contracts.forEach(contract => {
    if (contract.status === CONTRACT_STATUS.RESILIE) {
      return;
    }
    const pr = contract.pricing || {};
    const clientType = pr.clientType || "particulier";
    const mode       = pr.billingMode || "annuel";

    const status = computeContractStatus(contract);
    // ⛔ Si un devis est obligatoire mais pas encore accepté → aucune facture auto
    const devisNeeded = isDevisObligatoireForContract(contract);
    const devisOK     = isDevisAcceptedForContract(contract);
    if (devisNeeded && !devisOK) {
      return;
    }

    if (!pr.billingMode) return;

    const totalInstallments = getNumberOfInstallments(pr);
    let installmentsCount   = countContractInstallmentInvoices(contract.id);

    // 🧮 Calcul de la fin de contrat (optionnel, tu peux le garder si tu l'utilises ailleurs)
    let limitISO = todayISO;
    if (pr.startDate && pr.durationMonths) {
      const start = new Date(pr.startDate + "T00:00:00");
      if (!isNaN(start.getTime())) {
        const contractEnd = new Date(start);
        contractEnd.setMonth(contractEnd.getMonth() + Number(pr.durationMonths || 0));
        contractEnd.setDate(0); // fin du dernier mois
        const endISO = contractEnd.toISOString().slice(0, 10);
        if (endISO < limitISO) {
          limitISO = endISO;
        }
      }
    }

    // 🔁 Rattrapage : uniquement pour les factures dont la date ≤ aujourd'hui
    while (pr.nextInvoiceDate &&
           pr.nextInvoiceDate <= todayISO &&
           installmentsCount < totalInstallments) {

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

  // on multiplie la taille réelle par le ratio
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

// Ouvrir la popup de signature
function openSignaturePopup() {
  const popup = document.getElementById("signaturePopup");
  const canvas = document.getElementById("signatureCanvas");
  if (!popup || !canvas) {
    console.error("❌ SignaturePopup ou canvas introuvable");
    return;
  }

  popup.classList.remove("hidden");

  // ajuste le canvas avant d'initialiser SignaturePad
  resizeSignatureCanvas();

  signaturePad = new SignaturePad(canvas, {
    penColor: "black",
    backgroundColor: "rgba(0,0,0,0)"
  });
}

// Enregistrer la signature dans le devis courant

function saveSignatureToCurrentDocument(dataUrl) {
  if (!currentDocumentId) {
    showConfirmDialog({
      title: "Aucun devis ouvert",
      message: "Impossible d'enregistrer la signature : aucun devis n'est en cours d'édition.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const docs = getAllDocuments();
  const idx = docs.findIndex(d => d.id === currentDocumentId);
  if (idx === -1) {
    showConfirmDialog({
      title: "Devis introuvable",
      message: "Impossible d'enregistrer la signature : le devis n'a pas été retrouvé.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "danger",
      icon: "❌"
    });
    return;
  }

  const doc = docs[idx];

  if (doc.type !== "devis") {
    showConfirmDialog({
      title: "Type de document invalide",
      message: "La signature électronique ne peut être appliquée que sur un devis.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "ℹ️"
    });
    return;
  }

  // ✅ On enregistre la signature + date du jour
  doc.signature = dataUrl;
  doc.signatureDate = new Date().toLocaleDateString("fr-FR");

  docs[idx] = doc;
  saveDocuments(docs);

  if (typeof saveSingleDocumentToFirestore === "function") {
    saveSingleDocumentToFirestore(doc);
  }

  // ✅ On passe le devis en "Accepté" via la fonction centrale
  //    → ça déclenche aussi la facturation du contrat lié
  if (typeof setDevisStatus === "function") {
    setDevisStatus(doc.id, "accepte");
  }

  // Popup jolie au lieu du alert()
  showConfirmDialog({
    title: "Devis signé",
    message: "Signature enregistrée.\nLe devis est maintenant marqué comme accepté.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✅"
  });

  // Rechargement de l'UI
  if (typeof loadDocument === "function") {
    loadDocument(doc.id);
  }
  if (typeof loadDocumentsList === "function") {
    loadDocumentsList();
  }

}


// === Boutons de la popup ===

document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("signatureClear");
  const validateBtn = document.getElementById("signatureValidate");
  const approveRadio = document.getElementById("approveDevis");

  // Bouton devis (inchangé)
  if (approveRadio) {
    approveRadio.addEventListener("click", () => {
      openSignaturePopup();
    });
  }

  // bouton Effacer
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      signaturePad?.clear();
    });
  }

// bouton Fermer
const closeBtn = document.getElementById("signatureClose");
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    document.getElementById("signaturePopup").classList.add("hidden");
  });
}


  // BOUTON VALIDER UNIQUE
  if (validateBtn) {
    validateBtn.addEventListener("click", () => {
      if (!signaturePad || signaturePad.isEmpty()) {
        showConfirmDialog({
          title: "Signature manquante",
          message: "Merci de signer dans la zone prévue avant de valider.",
          confirmLabel: "OK",
          variant: "warning",
          icon: "✍️"
        });
        return;
      }

      const dataUrl = signaturePad.toDataURL("image/png");

      // 🔥🔥🔥 CONTRAT SYNDIC
      if (window.currentContractSignatureMode) {
        saveContractSignature(dataUrl);
        window.currentContractSignatureMode = false;
      }
      else {
        // 🔵 DEVIS (comportement original)
        saveSignatureToCurrentDocument(dataUrl);
      }

      document.getElementById("signaturePopup").classList.add("hidden");
    });
  }
});

/* ======================
   SIGNATURE CONTRAT SYNDIC
====================== */

// Ouvre la popup de signature mais pour un CONTRAT
function openContractSignature() {
  const popup  = document.getElementById("signaturePopup");
  const canvas = document.getElementById("signatureCanvas");
  if (!popup || !canvas) return;

  // on indique qu'on signe un CONTRAT (et pas un devis)
  window.currentContractSignatureMode = true;

  // on affiche la popup
  popup.classList.remove("hidden");

  // ajuste la taille réelle du canvas
  resizeSignatureCanvas();

  // initialise SignaturePad
  signaturePad = new SignaturePad(canvas, {
    penColor: "black",
    backgroundColor: "rgba(0,0,0,0)"
  });
}

// 👉👉👉 FONCTION UNIQUE À GARDER POUR SAUVER LA SIGNATURE CONTRAT
function saveContractSignature(dataUrl) {
  if (!currentContractId) {
    showConfirmDialog({
      title: "Aucun contrat ouvert",
      message: "Impossible d'enregistrer la signature : aucun contrat n'est en cours d'édition.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "warning",
      icon: "⚠️"
    });
    return;
  }

  const list = getAllContracts();
  const idx = list.findIndex(c => c.id === currentContractId);
  if (idx === -1) {
    showConfirmDialog({
      title: "Contrat introuvable",
      message: "Impossible d'enregistrer la signature : le contrat n'a pas été retrouvé.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "danger",
      icon: "❌"
    });
    return;
  }

  const c = list[idx];

  // 🔥 on stocke la signature DANS LE CONTRAT (syndic)
  c.signature = dataUrl;
  c.signatureDate = new Date().toLocaleDateString("fr-FR");

  list[idx] = c;
  saveContracts(list);

  if (typeof saveSingleContractToFirestore === "function") {
    saveSingleContractToFirestore(c);
  }

  // Recharge le formulaire contrat (affiche la signature si tu veux)
  fillContractForm(c);

  showConfirmDialog({
    title: "Contrat signé",
    message: "Signature enregistrée pour ce contrat syndic.",
    confirmLabel: "OK",
    cancelLabel: "",
    variant: "success",
    icon: "✍️"
  });
}

function syncContractsWithDevis(updatedDevis) {
  if (!updatedDevis || !updatedDevis.id) return;

  const allContracts = getAllContracts();
  let changed = false;

  allContracts.forEach(c => {
    if (c.meta && c.meta.sourceDevisId === updatedDevis.id) {
      c.meta.sourceDevisStatus = updatedDevis.status;
      c.meta.sourceDevisNumber = updatedDevis.number;
      changed = true;
    }
  });

  if (changed) {
    saveContracts(allContracts);

    if (typeof saveSingleContractToFirestore === "function") {
      allContracts.forEach(c => {
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

/* ---- On met à jour le dashboard dès que la page est chargée ---- */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof refreshHomeStats === "function") {
    refreshHomeStats();
  }
});

// ==========================================
// AUTO-GÉNÉRATION DES ANNÉES DOCUMENTS
// ==========================================
function fillYearMenu() {
    const docs = getAllDocuments();
    const select = document.getElementById("yearMenu");
    if (!select) return;

    const years = new Set(["2025", "2026", "2027"]);

    docs.forEach(d => {
        if (d.date) {
            const y = d.date.split("-")[0];
            years.add(y);
        }
    });

    const sorted = Array.from(years).sort();
    select.innerHTML = '<option value="all">Toutes</option>';

    sorted.forEach(y => {
        select.innerHTML += `<option value="${y}">${y}</option>`;
    });
}

function autoFillDates() {
  document.querySelectorAll("input[type='date']").forEach(input => {
    if (!input.value) input.value = todayISO();
  });
}

// Appelé quand une popup ou un formulaire apparaît
document.addEventListener("click", () => {
  setTimeout(autoFillDates, 50);
});



// ================== INIT ==================

window.onload = function () {
  loadCustomTemplates();
  loadCustomTexts();

  applyCompanySettingsToUI();

  setTVA(0);
  if (typeof refreshClientDatalist === "function") {
    refreshClientDatalist();
  }

  if (typeof loadYearFilter === "function") {
    loadYearFilter();
  }

  // ⚡ Affichage immédiat des devis depuis localStorage
  if (typeof switchListType === "function") {
    switchListType("devis");
  }
  if (typeof updateButtonColors === "function") {
    updateButtonColors();
  }
  if (typeof showHome === "function") {
    showHome();
  }

  // 🔁 Factures d’échéance auto : seulement si TOUT est défini
  if (typeof checkScheduledInvoices === "function"
      && typeof countContractInstallmentInvoices === "function") {
    checkScheduledInvoices();
  }
  // 🔒 Si l'utilisateur tape lui-même dans l'objet, on arrête la synchro auto
  const subjectInput = document.getElementById("docSubject");
  if (subjectInput && !subjectInput.dataset.boundManualFlag) {
    subjectInput.addEventListener("input", () => {
      subjectInput.dataset.manualEdited = "1";
    });
    subjectInput.dataset.boundManualFlag = "1";
  }

  // 🛰 Synchro Firebase en arrière-plan
  initFirebase();

  if (typeof refreshHomeStats === "function") {
    refreshHomeStats();
  }


  // Contrats UI
  if (typeof initContractsUI === "function") {
    initContractsUI();
  }
};

// ================== GESTION ÉTAT RÉSEAU ==================

window.addEventListener("online", () => {
  console.log("[NET] Reconnexion détectée");
  updateOfflineBadge();
  if (!db) {
    initFirebase().then(processSyncQueue).catch(() => {
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

// Si le DOM est prêt, on met à jour le badge une première fois
document.addEventListener("DOMContentLoaded", () => {
  updateOfflineBadge();
  if (navigator.onLine && db) {
    processSyncQueue();
  }
});

