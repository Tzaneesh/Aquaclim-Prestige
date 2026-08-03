


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
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Nettoyage des filtres",
      "Nettoyage et désinfection unité intérieure",
      "Nettoyage évaporateur",
      "Nettoyage et désinfection du bac à condensats et test d’écoulement",
      "Nettoyage des ailettes du condenseur et du caisson extérieur",
      "Vérification connexions électriques",
      "Contrôle fonctionnement froid / chaud",
      "Mesure températures soufflage",
      "Contrôle télécommande et réglages",
    ],
  },

  // 2. Entretien piscine chlore
  {
    label: "Entretien piscine chlore",
    kind: "piscine_chlore",
    title: "Entretien piscine chlore",
    priceParticulier: 80,
    priceSyndic: 120,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Analyse de l’eau",
      "Ajustement chimique selon résultats",
      "Nettoyage préfiltre",
      "Aspiration fond de bassin",
      "Brossage parois",
      "Contrôle pression filtre et backwash",
      "Contrôle pompe, débit, programmateur",
      "Nettoyage ligne d’eau",
    ],
  },

  // 3. Entretien piscine sel
  {
    label: "Entretien piscine sel",
    kind: "piscine_sel",
    title: "Entretien piscine sel",
    priceParticulier: 80,
    priceSyndic: 100,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Analyse de l’eau",
      "Ajustement chimique selon résultats",
      "Nettoyage préfiltre",
      "Aspiration fond de bassin",
      "Brossage parois",
      "Contrôle pression filtre et backwash",
      "Contrôle pompe, débit, programmateur",
      "Contrôle fonctionnement électrolyseur",
      "Nettoyage ligne d’eau",
    ],
  },

  // 4. Entretien jacuzzi
  {
    label: "Entretien jacuzzi / spa",
    kind: "entretien_jacuzzi",
    title: "Entretien jacuzzi / spa",
    priceParticulier: 80,
    priceSyndic: 100,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Analyse et équilibrage eau",
      "Nettoyage filtre",
      "Nettoyage ligne d’eau et surface",
      "Désinfection des buses",
      "Contrôle pompe et chauffage",
      "Contrôle jets et tableau de commande",
    ],
  },

  // 5. Hivernage piscine
  {
    label: "Hivernage piscine",
    kind: "hivernage_piscine",
    title: "Hivernage piscine",
    priceParticulier: 150,
    priceSyndic: 180,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Analyse de l’eau",
      "Traitement choc fin de saison",
      "Nettoyage fond, parois, ligne d’eau",
      "Backwash et rinçage filtre",
      "Vidange pompe, filtre, réchauffeur",
      "Mise en place bâche / couverture hivernale",
    ],
  },

  // 6a. Remise en service piscine — eau propre
  {
    label: "Remise en service — eau propre",
    kind: "remise_service_propre",
    title: "Remise en service piscine",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Retrait et nettoyage bâche",
      "Inspection bassin et équipements",
      "Vérification pompe",
      "Nettoyage préfiltre et backwash",
      "Brossage parois et fond",
      "Analyse de l’eau",
      "Correction des paramètres eau",
      "Détartrage cellule électrolyseur (si piscine au sel)",
    ],
  },

  // 6b. Remise en service piscine — eau verte / algues
  {
    label: "Remise en service — eau verte / algues",
    kind: "remise_service_piscine",
    title: "Remise en service piscine",
    priceParticulier: 200,
    priceSyndic: 240,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Inspection bassin et équipements",
      "Vérification pompe",
      "Nettoyage préfiltre et backwash complet du filtre",
      "Traitement choc anti-algues",
      "Brossage intensif parois et fond",
      "Aspiration fond",
      "Floculation si eau très trouble",
      "Analyse de l’eau",
      "Correction des paramètres eau",
      "Détartrage cellule électrolyseur (si piscine au sel)",
    ],
  },

  // 7. Vidange + nettoyage jacuzzi
  {
    label: "Vidange + nettoyage jacuzzi",
    kind: "vidange_jacuzzi",
    title: "Vidange et nettoyage jacuzzi / spa",
    priceParticulier: 150,
    priceSyndic: 180,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Traitement choc canalisations avant vidange",
      "Vidange complète",
      "Détartrage et nettoyage buses",
      "Nettoyage et désinfection coque",
      "Nettoyage filtre",
      "Remplissage et traitement de mise en route",
      "Analyse et équilibrage eau",
    ],
  },

  // 8. Traitement choc piscine
  {
    label: "Traitement choc piscine",
    kind: "traitement_choc",
    title: "Traitement choc piscine",
    priceParticulier: 90,
    priceSyndic: 110,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Analyse de l’eau",
      "Correction pH",
      "Traitement chlore choc",
      "Floculant si eau trouble",
      "Brossage parois",
      "Aspiration fond si dépôts",
      "Mise en fonctionnement filtration en continu",
    ],
  },

  // 9. Changement sable / charge filtre
  {
    label: "Changement sable / charge filtre",
    kind: "changement_sable",
    title: "Changement sable / charge filtre",
    priceParticulier: 300,
    priceSyndic: 360,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Coupure installation",
      "Extraction sable usagé",
      "Rinçage et inspection intérieur cuve",
      "Remplissage média filtrant",
      "Backwash et rinçage de mise en service",
      "Test d’étanchéité et analyse de l’eau",
    ],
  },

  // 10. Remplacement roulement pompe piscine
  {
    label: "Remplacement roulement pompe piscine",
    kind: "remplacement_roulement",
    title: "Remplacement roulement pompe piscine",
    priceParticulier: 180,
    priceSyndic: 220,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Diagnostic et coupure électrique",
      "Isolement hydraulique",
      "Démontage et extraction du moteur",
      "Remplacement des roulements et du joint de garniture mécanique",
      "Remontage et test de fonctionnement",
      "Contrôle étanchéité et débit",
    ],
  },

  // 11. Remplacement pompe piscine 
  {
    label: "Remplacement pompe piscine",
    kind: "remplacement_pompe_mo",
    title: "Remplacement pompe piscine",
    priceParticulier: 150,
    priceSyndic: 180,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Diagnostic et coupure électrique",
      "Isolement hydraulique",
      "Dépose de l’ancienne pompe",
      "Pose et raccordement nouvelle pompe",
      "Réglages et amorçage",
      "Test fonctionnement et contrôle étanchéité",
    ],
  },

  // 12. Remplacement cellule électrolyseur
  {
    label: "Remplacement cellule électrolyseur",
    kind: "remplacement_cellule_mo",
    title: "Remplacement cellule électrolyseur",
    priceParticulier: 120,
    priceSyndic: 150,
    descParticulier: "",
    descSyndic: "",
    detailLines: [
      "Contrôle du taux de sel et diagnostic de la cellule",
      "Démontage de l’ancienne cellule",
      "Détartrage",
      "Pose de la nouvelle cellule",
      "Réglage du taux de sel et de la production de chlore",
      "Test de fonctionnement et contrôle de l’eau",
    ],
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
    id: "piscine_chlore",
    label: "Entretien piscine – chlore",
    showAnalysis: true,
    sections: [
      {
        title: "Préfiltration & skimmers",
        items: [
          "Nettoyage du panier de skimmer",
          "Nettoyage du panier de pompe",
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
          "Passage aspirateur / robot",
        ],
      },
      {
        title: "Filtration",
        items: [
          "Contrôle pression manomètre",
          "Contre-lavage du filtre (si sable)",
          "Rinçage filtre",
          "Nettoyage filtre cartouche (si applicable)",
          "Contrôle absence de fuites hydrauliques",
        ],
      },
      {
        title: "Analyse & traitement (eau chlorée)",
        items: [
          "Mesure du pH",
          "Mesure du chlore libre",
          "Mesure du stabilisant",
          "Mesure du TAC",
          "Correction du pH si nécessaire",
          "Ajout désinfectant si nécessaire",
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
    id: "piscine_sel",
    label: "Entretien piscine – sel",
    showAnalysis: true,
    sections: [
      {
        title: "Préfiltration & skimmers",
        items: [
          "Nettoyage du panier de skimmer",
          "Nettoyage du panier de pompe",
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
          "Passage aspirateur / robot",
        ],
      },
      {
        title: "Filtration",
        items: [
          "Contrôle pression manomètre",
          "Contre-lavage du filtre",
          "Rinçage filtre",
          "Contrôle absence de fuites hydrauliques",
        ],
      },
      {
        title: "Électrolyseur & salinité",
        items: [
          "Contrôle état de la cellule",
          "Nettoyage cellule si nécessaire",
          "Contrôle taux de salinité",
          "Contrôle production de chlore (redox)",
          "Réglage production si nécessaire",
        ],
      },
      {
        title: "Analyse & traitement",
        items: [
          "Mesure du pH",
          "Mesure du redox / chlore",
          "Mesure du TAC",
          "Correction du pH si nécessaire",
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
let manualPlanningItems = (() => {
  try { return JSON.parse(localStorage.getItem("manualPlanningItems") || "[]") || []; }
  catch (e) { return []; }
})();
// 🔄 Items manuels créés/modifiés localement mais pas encore confirmés côté serveur.
//    Sert à distinguer « créé hors-ligne (à garder) » de « supprimé sur un autre
//    appareil (à retirer) » lors de la fusion du snapshot Firestore.
let pendingManualPlanningIds = (() => {
  try { return new Set(JSON.parse(localStorage.getItem("pendingManualPlanningIds") || "[]")); }
  catch (e) { return new Set(); }
})();
function _savePendingManualPlanningIds() {
  try { localStorage.setItem("pendingManualPlanningIds", JSON.stringify([...pendingManualPlanningIds])); } catch (e) {}
}
let editingManualPlanningId = null;
let contractPlanningOverrides = (() => {
  try { return JSON.parse(localStorage.getItem("contractPlanningOverrides") || "[]") || []; }
  catch (e) { return []; }
})();

// Ordre des interventions à l'intérieur d'une journée : { dateISO: [visitKey, ...] }
let planningOrder = (() => {
  try { return JSON.parse(localStorage.getItem("planningOrder") || "{}") || {}; }
  catch (e) { return {}; }
})();

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

  // Modèles de messages : chargement des défauts si vide
  if (typeof initDefaultMsgTemplates === "function") {
    initDefaultMsgTemplates();
  }
});



// =================== PLANNING MANUEL ===================
db.collection("planningManual").onSnapshot((snap) => {
  const remote = [];
  snap.forEach((d) => remote.push(d.data()));

  // 🔀 Firestore fait foi. On ne conserve en local QUE les items encore en
  //    attente d'upload (créés/modifiés hors-ligne). Un item absent de Firestore
  //    ET non "pending" = supprimé sur un autre appareil → on le retire.
  const remoteIds = new Set(remote.map((o) => o && o.id).filter(Boolean));
  const localOnly = (Array.isArray(manualPlanningItems) ? manualPlanningItems : [])
    .filter((o) => o && o.id && !remoteIds.has(o.id) && pendingManualPlanningIds.has(o.id));
  manualPlanningItems = remote.concat(localOnly);

  // Nettoyage : les ids "pending" désormais présents côté serveur ne le sont plus
  remoteIds.forEach((id) => {
    if (pendingManualPlanningIds.has(id)) pendingManualPlanningIds.delete(id);
  });
  _savePendingManualPlanningIds();

  localStorage.setItem("manualPlanningItems", JSON.stringify(manualPlanningItems));

  try { renderPlanningWeek(); } catch(e) {}
  try { renderPlanningSidebar(); } catch(e) {}
});

// =================== OVERRIDES CONTRATS ===================
db.collection("contractPlanningOverrides").onSnapshot((snap) => {
  const remote = [];
  snap.forEach((d) => remote.push(d.data()));

  // 🔀 Fusion : Firestore fait foi, mais on GARDE les déplacements locaux
  //    pas encore remontés (sinon un refresh remet le planning comme au départ)
  const byId = {};
  (Array.isArray(contractPlanningOverrides) ? contractPlanningOverrides : []).forEach((o) => {
    if (o && o.id) byId[o.id] = o;
  });
  remote.forEach((o) => {
    if (!o || !o.id) return;
    const local = byId[o.id];
    // Firestore l'emporte, sauf si la version locale est plus récente (pas encore syncro)
    if (!local || (Number(o.updatedAt) || 0) >= (Number(local.updatedAt) || 0)) {
      byId[o.id] = o;
    }
  });
  contractPlanningOverrides = Object.values(byId);

  localStorage.setItem("contractPlanningOverrides", JSON.stringify(contractPlanningOverrides));

  try { renderPlanningWeek(); } catch(e) {}
});

// =========== FLAGS PLANNING : passages retirés / marqués "fait" ===========
// Suivent une seule liste de clés "contractId|dateOrigine" chacun.
function _bindPlanningFlagDoc(docId, localKey) {
  db.collection("planningFlags").doc(docId).onSnapshot((doc) => {
    if (!doc.exists) {
      // Pas encore sur le cloud → on migre l'état local existant (une fois)
      let local = [];
      try { local = JSON.parse(localStorage.getItem(localKey) || "[]") || []; } catch (e) {}
      if (local.length && db) {
        db.collection("planningFlags").doc(docId).set({ keys: local }, { merge: true }).catch(() => {});
      }
      return;
    }
    const data = doc.data() || {};
    const keys = Array.isArray(data.keys) ? data.keys : [];
    localStorage.setItem(localKey, JSON.stringify(keys));
    try { renderPlanningWeek(); } catch (e) {}
  });
}
_bindPlanningFlagDoc("contractRemoved", "contractPlanningRemoved");
_bindPlanningFlagDoc("contractDone", "contractPlanningDone");


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
     onclick="createDocForClient('facture', decodeURIComponent('${encodeURIComponent(n)}'))">
    ➕ Créer facture
  </button>

  <button class="btn btn-secondary btn-small" type="button"
       onclick="openPlanningForClient(decodeURIComponent('${encodeURIComponent(n)}'))">
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

  showConfirmDialog({
    title: "Restaurer un backup",
    message: "⚠️ Cette action va effacer toutes les données actuelles et les remplacer par le backup. Es-tu sûr ?",
    confirmLabel: "Oui, restaurer",
    cancelLabel: "Annuler",
    variant: "warning",
    icon: "⚠️",
    onConfirm: () => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || "{}"));
          if (!data || !data.localStorage) throw new Error("Format invalide");
          localStorage.clear();
          Object.keys(data.localStorage).forEach((k) => {
            localStorage.setItem(k, data.localStorage[k]);
          });
          location.reload();
        } catch (e) {
          alert("Import impossible : fichier backup invalide.");
        }
      };
      reader.readAsText(file);
    },
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
  if (civ && client.civility) {
    civ.value = client.civility;
  }

  // 📍 Adresse d'intervention spécifique au client → auto-remplissage
  const diffCb = document.getElementById("diffSiteAddress");
  const siteAddrInp = document.getElementById("siteAddress");
  const siteNameInp = document.getElementById("siteName");
  if (client.siteAddress && client.siteAddress.trim()) {
    if (diffCb) diffCb.checked = true;
    if (siteAddrInp) siteAddrInp.value = client.siteAddress;
    if (siteNameInp && !siteNameInp.value) siteNameInp.value = client.name || "";
  } else {
    // Pas d'adresse d'intervention spécifique → on décoche (sauf agence)
    const isAgence = document.getElementById("clientSyndic")?.checked || false;
    if (diffCb && !isAgence) diffCb.checked = false;
  }
  if (typeof _updateSiteBlockVisibility === "function") _updateSiteBlockVisibility();
}

// ── Autocomplete client custom (contourne le bug datalist iOS dans un popup) ──
function _planningClientAutocomplete(inputEl) {
  const box = document.getElementById("planningClientSuggestions");
  if (!box) return;

  const query = (inputEl.value || "").trim().toLowerCase();
  const clients = (typeof getClients === "function") ? getClients() : [];

  // Filtrer
  const matches = clients
    .filter(c => c.name && c.name.toLowerCase().includes(query))
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    .slice(0, 20);

  if (matches.length === 0) {
    box.style.display = "none";
    return;
  }

  box.innerHTML = "";
  matches.forEach(c => {
    const item = document.createElement("div");
    item.className = "pcs-item";
    item.textContent = c.name;

    // Touch : utiliser touchend pour éviter le blur qui ferme trop tôt
    item.addEventListener("touchend", (e) => {
      e.preventDefault();
      inputEl.value = c.name;
      box.style.display = "none";
      onPlanningPopupClientChange();
    });
    item.addEventListener("mousedown", (e) => {
      e.preventDefault(); // évite le blur
      inputEl.value = c.name;
      box.style.display = "none";
      onPlanningPopupClientChange();
    });
    box.appendChild(item);
  });

  box.style.display = "block";
}

function _closePlanningClientSuggestions() {
  const box = document.getElementById("planningClientSuggestions");
  if (box) box.style.display = "none";
}

// Fermer le dropdown si on clique ailleurs
document.addEventListener("click", (e) => {
  const input = document.getElementById("planningPopupClient");
  const box   = document.getElementById("planningClientSuggestions");
  if (box && input && !input.contains(e.target) && !box.contains(e.target)) {
    box.style.display = "none";
  }
});

function onPlanningPopupClientChange() {
  const input = document.getElementById("planningPopupClient");
  const addBtn = document.getElementById("planningAddClientBtn");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();

  if (!value) {
    if (addBtn) addBtn.style.display = "none";
    return;
  }

  const clients = getClients();
  const client = clients.find(
    (c) => (c.name || "").trim().toLowerCase() === value
  );

  if (!client) {
    if (addBtn) addBtn.style.display = "inline-flex";
    return;
  }

  if (addBtn) addBtn.style.display = "none";

  const addr = document.getElementById("planningPopupAddress");
  const phone = document.getElementById("planningPopupPhone");
  const email = document.getElementById("planningPopupEmail");
  const privateNotes = document.getElementById("planningPopupPrivateNotes");

  if (addr) addr.value = client.address || "";
  if (phone) phone.value = client.phone || "";
  if (email) email.value = client.email || "";
  if (privateNotes) privateNotes.value = client.privateNotes || "";
}

function savePlanningClientToList() {
  const name = (document.getElementById("planningPopupClient")?.value || "").trim();
  const address = (document.getElementById("planningPopupAddress")?.value || "").trim();
  const phone = (document.getElementById("planningPopupPhone")?.value || "").trim();
  const email = (document.getElementById("planningPopupEmail")?.value || "").trim();
  const privateNotes = (document.getElementById("planningPopupPrivateNotes")?.value || "").trim();

  if (!name) {
    showToast("Merci de saisir un nom de client.", "warning");
    return;
  }

  const clients = getClients();
  const existingIndex = clients.findIndex(
    (c) => (c.name || "").toLowerCase() === name.toLowerCase()
  );

  let clientObj;
  if (existingIndex === -1) {
    const tmp = { name, address, phone, email, privateNotes };
    const id = getClientDocId(tmp);
    clientObj = { ...tmp, id };
    clients.push(clientObj);
  } else {
    clientObj = { ...clients[existingIndex], name, address, phone, email, privateNotes };
    clients[existingIndex] = clientObj;
  }

  saveClients(clients);
  refreshClientDatalist();
  if (typeof _fillClientSelectIOS === "function") _fillClientSelectIOS();
  if (typeof saveSingleClientToFirestore === "function") saveSingleClientToFirestore(clientObj);

  const addBtn = document.getElementById("planningAddClientBtn");
  if (addBtn) addBtn.style.display = "none";

  showToast(`Client "${name}" enregistré ✅`, "success");
}

// --- Attestation clim : remplir adresse depuis la liste de clients ---

const ATT_DEFAULT_OPS = [
  "Nettoyage des filtres intérieurs",
  "Nettoyage des batteries (évaporateur + condenseur)",
  "Application d'un traitement antibactérien",
  "Nettoyage des turbines",
  "Vérification des écoulements et du bac à condensats",
  "Contrôle des connexions électriques",
  "Contrôle du soufflage et test de fonctionnement",
];

function getNextAttNumber() {
  const year = new Date().getFullYear();
  const atts = getAllAttestations ? getAllAttestations() : [];
  const used = atts
    .map(a => { const m = (a.numero || "").match(/ATT-(\d{4})-(\d+)/); return m && +m[1] === year ? +m[2] : 0; })
    .filter(n => n > 0)
    .sort((a, b) => a - b);
  let next = 1;
  for (const n of used) { if (n === next) next++; else if (n > next) break; }
  return `ATT-${year}-${String(next).padStart(3, "0")}`;
}

function initAttOps(checkedOps) {
  const container = document.getElementById("attOpsList");
  if (!container) return;
  const ops = checkedOps ? checkedOps.map(o => ({ label: o.label, checked: o.checked }))
                         : ATT_DEFAULT_OPS.map(l => ({ label: l, checked: true }));
  container.innerHTML = ops.map((op, i) => `
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
      <input type="checkbox" data-att-op="${i}" ${op.checked ? "checked" : ""}
             style="width:16px;height:16px;accent-color:#1a74d9;cursor:pointer;">
      <span>${op.label}</span>
      ${i >= ATT_DEFAULT_OPS.length ? `<button type="button" onclick="removeAttOp(this)" style="margin-left:auto;background:none;border:none;color:#dc2626;cursor:pointer;font-size:15px;">✕</button>` : ""}
    </label>`).join("");
}

function addAttCustomOp() {
  const input = document.getElementById("attCustomOp");
  const val = (input?.value || "").trim();
  if (!val) return;
  const container = document.getElementById("attOpsList");
  if (!container) return;
  const idx = container.querySelectorAll("[data-att-op]").length;
  const div = document.createElement("label");
  div.style.cssText = "display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;";
  div.innerHTML = `<input type="checkbox" data-att-op="${idx}" checked style="width:16px;height:16px;accent-color:#1a74d9;cursor:pointer;">
    <span>${val}</span>
    <button type="button" onclick="removeAttOp(this)" style="margin-left:auto;background:none;border:none;color:#dc2626;cursor:pointer;font-size:15px;">✕</button>`;
  container.appendChild(div);
  if (input) input.value = "";
}

function removeAttOp(btn) {
  btn.closest("label").remove();
}

function getAttOps() {
  const container = document.getElementById("attOpsList");
  if (!container) return ATT_DEFAULT_OPS.map(l => ({ label: l, checked: true }));
  return Array.from(container.querySelectorAll("label")).map(lbl => ({
    label: lbl.querySelector("span")?.textContent || "",
    checked: lbl.querySelector("input[type=checkbox]")?.checked || false,
  }));
}

function onAttDateChange() {
  const dateEl = document.getElementById("attDate");
  const nextEl = document.getElementById("attNextService");
  if (!dateEl?.value || !nextEl) return;
  nextEl.value = (typeof _addOneYearISO === "function")
    ? _addOneYearISO(dateEl.value)
    : dateEl.value;
}

function onAttClientNameChange() {
  const input = document.getElementById("attClientName");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients ? getClients() : [];
  const client = clients.find(c => (c.name || "").trim().toLowerCase() === value);
  if (!client) return;

  const addr = document.getElementById("attClientAddress");
  if (addr && !addr.value) addr.value = client.address || "";

  const eq = client.equipment || {};
  const brand = document.getElementById("attEquipBrand");
  const model = document.getElementById("attEquipModel");
  if (brand && !brand.value) brand.value = eq.climBrand || "";
  if (model && !model.value) model.value = eq.climModel || "";
}

// --- Rapport d'intervention : remplir nom + adresse ---

function fillRapportClientFromObject(client) {
  if (!client) return;

  const nameEl = document.getElementById("rapClientName");
  const addrEl = document.getElementById("rapClientAddress");

  if (nameEl) nameEl.value = client.name || "";
  if (addrEl) addrEl.value = client.address || "";
}

function getNextRapNumber() {
  const year = new Date().getFullYear();
  const raps = getAllRapports ? getAllRapports() : [];
  const used = raps
    .map(r => { const m = (r.numero || "").match(/RAP-(\d{4})-(\d+)/); return m && +m[1] === year ? +m[2] : 0; })
    .filter(n => n > 0).sort((a, b) => a - b);
  let next = 1;
  for (const n of used) { if (n === next) next++; else if (n > next) break; }
  return `RAP-${year}-${String(next).padStart(3, "0")}`;
}

function onRapDateChange() {
  const dateEl = document.getElementById("rapDate");
  const nextEl = document.getElementById("rapNextService");
  const typeId  = document.getElementById("rapportType")?.value || "";
  if (!dateEl?.value || !nextEl) return;
  if (typeId.startsWith("depannage")) return;
  // En création : n'écrase pas si déjà rempli manuellement
  // En édition : recalcule toujours pour refléter la nouvelle date
  if (nextEl.value && !currentRapportId) return;
  nextEl.value = (typeof _addOneYearISO === "function")
    ? _addOneYearISO(dateEl.value)
    : dateEl.value;
}

function onRapportClientNameChange() {
  const input = document.getElementById("rapClientName");
  if (!input) return;

  const value = (input.value || "").trim().toLowerCase();
  if (!value) return;

  const clients = getClients ? getClients() : [];
  const client = clients.find(c => (c.name || "").trim().toLowerCase() === value);
  if (!client) return;

  fillRapportClientFromObject(client);

  const eq = client.equipment || {};
  const brand = document.getElementById("rapEquipBrand");
  const model = document.getElementById("rapEquipModel");
  if (brand && !brand.value) brand.value = eq.climBrand || "";
  if (model && !model.value) model.value = eq.climModel || "";
}

let currentAttestationId = null;
let currentRapportId = null;
let currentRapportSource = null;
let currentRapportPhotosTemp = []; // [{name,type,dataUrl}]
let currentRapportAttachmentsTemp = []; // [{name,type,dataUrl}]

/* ================== ATTESTATIONS & RAPPORTS ================== */

function showAttestations() {
  _hideAllMainViews();

  // Onglets
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const tabAttest = document.getElementById("tabAttest");
  if (tabAttest) tabAttest.classList.add("active");

  // Afficher attestationView
  const attestationView = document.getElementById("attestationView");
  if (attestationView) attestationView.classList.remove("hidden");

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
  _hideAllMainViews();

  // Onglets
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const tabSettings = document.getElementById("tabSettings");
  if (tabSettings) tabSettings.classList.add("active");

  // Afficher settingsView
  const settingsView = document.getElementById("settingsView");
  if (settingsView) settingsView.classList.remove("hidden");

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
  loadSignaturePreview();
}

function saveSignatureImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem("companySignature", e.target.result);
    loadSignaturePreview();
  };
  reader.readAsDataURL(file);
}

function removeSignatureImage() {
  localStorage.removeItem("companySignature");
  const inp = document.getElementById("signatureUpload");
  if (inp) inp.value = "";
  loadSignaturePreview();
}

function loadSignaturePreview() {
  const sig = localStorage.getItem("companySignature");
  const wrap = document.getElementById("signaturePreviewWrap");
  const img  = document.getElementById("signaturePreview");
  if (!wrap || !img) return;
  if (sig) {
    img.src = sig;
    wrap.style.display = "flex";
  } else {
    img.src = "";
    wrap.style.display = "none";
  }
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

  currentAttestationId = null;
  // Attestation manuelle → aucune facture source par défaut
  // (évite qu'un lien facture résiduel se recolle par erreur)
  currentAttestationSource = null;

  const s = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  s("attClientName", "");
  s("attClientAddress", "");
  s("attEquipBrand", "");
  s("attEquipModel", "");
  s("attDate", "");
  s("attNextService", "");
  s("attUnits", 1);
  s("attNotes", "");

  const numEl = document.getElementById("attNumeroDisplay");
  if (numEl) numEl.textContent = "N° " + getNextAttNumber();

  initAttOps();

  overlay.classList.remove("hidden");
  const popup = overlay.querySelector(".popup");
  if (popup) { void popup.offsetWidth; popup.classList.add("show"); }
}

function openAttestationPopupForEdit(attId) {
  const list = getAllAttestations();
  const rec = list.find((a) => a.id === attId);
  if (!rec) return;

  currentAttestationId = rec.id;

  const s = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ""; };
  s("attClientName", rec.clientName);
  s("attClientAddress", rec.clientAddress);
  s("attEquipBrand", rec.equipBrand);
  s("attEquipModel", rec.equipModel);
  s("attDate", rec.date);
  s("attNextService", rec.nextService);
  s("attUnits", rec.units != null ? rec.units : 1);
  s("attNotes", rec.notes);

  const numEl = document.getElementById("attNumeroDisplay");
  if (numEl) numEl.textContent = rec.numero ? "N° " + rec.numero : "";

  initAttOps(rec.ops || null);

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
  currentAttestationId = null;
  currentAttestationSource = null;

  // Vider tous les champs pour la prochaine ouverture
  ["attClientName","attClientAddress","attEquipBrand","attEquipModel",
   "attDate","attNextService","attNotes"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const unitsEl = document.getElementById("attUnits");
  if (unitsEl) unitsEl.value = "1";
  initAttOps(null);
  const numEl = document.getElementById("attNumeroDisplay");
  if (numEl) numEl.textContent = "";
}

function saveAttestationFromForm() {
  const g = id => document.getElementById(id)?.value || "";
  const name        = g("attClientName");
  const addr        = g("attClientAddress");
  const equipBrand  = g("attEquipBrand");
  const equipModel  = g("attEquipModel");
  const date        = g("attDate");
  const nextService = g("attNextService");
  const units       = g("attUnits") || "1";
  const notes       = g("attNotes");
  const ops         = getAttOps();

  const list = getAllAttestations();
  let record;
  const base = {
    clientName: name, clientAddress: addr,
    equipBrand, equipModel,
    date, nextService,
    units: Number(units) || 1,
    notes, ops,
  };

  if (currentAttestationId) {
    const idx = list.findIndex(a => a.id === currentAttestationId);
    if (idx !== -1) {
      record = { ...list[idx], ...base };
      list[idx] = record;
    } else {
      record = { id: generateId("ATT"), numero: getNextAttNumber(), type: "attestation_clim", ...base,
        createdAt: new Date().toISOString(),
        sourceDocId: currentAttestationSource?.id || null,
        sourceDocNumber: currentAttestationSource?.number || null };
      list.push(record);
    }
  } else {
    record = { id: generateId("ATT"), numero: getNextAttNumber(), type: "attestation_clim", ...base,
      createdAt: new Date().toISOString(),
      sourceDocId: currentAttestationSource?.id || null,
      sourceDocNumber: currentAttestationSource?.number || null };
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
  // ✅ Facture issue d'un contrat : on détecte via le service du contrat
  // (le libellé d'une échéance ne contient pas toujours "chlore"/"sel")
  if (devis.contractId && typeof getContract === "function") {
    const c = getContract(devis.contractId);
    const ms = (c?.pricing?.mainService || c?.pool?.type || "").trim();
    if (ms === "entretien_clim") return "entretien_clim";
    if (ms === "piscine_sel") return "piscine_sel";
    if (ms === "piscine_chlore") return "piscine_chlore";
    if (ms === "entretien_jacuzzi" || ms === "spa_jacuzzi" || ms === "spa") return "entretien_jacuzzi";
  }

  const text = JSON.stringify(devis.prestations || []).toLowerCase();
  // ✅ Détection fiable via "kind"
  if (text.includes('"kind":"entretien_clim"')) return "entretien_clim";
  if (text.includes('"kind":"depannage_clim"')) return "depannage_clim";


  if (text.includes('"kind":"piscine_sel"')) return "piscine_sel";
  if (text.includes('"kind":"piscine_chlore"')) return "piscine_chlore";
  if (text.includes("piscine sel") || text.includes("sel")) return "piscine_sel";
  if (text.includes("piscine chlore") || text.includes("chlore")) return "piscine_chlore";
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
      const items = section.items.map((item) => ({
        text: item,
        checked: checkedSet.size === 0 ? true : checkedSet.has(item),
      }));
      sectionsData.push({ title: section.title, items });
    });
  }

  const id =
    typeof generateId === "function" ? generateId("RAP") : "RAP-" + Date.now();

  const rapport = {
    id,
    numero: typeof getNextRapNumber === "function" ? getNextRapNumber() : null,
    typeId,
    typeLabel: tpl ? tpl.label : "",
    clientName: devis.client?.name || "",
    clientAddress: devis.client?.address || "",
    equipBrand: devis.client?.equipment?.climBrand || "",
    equipModel: devis.client?.equipment?.climModel || "",
    date: new Date().toISOString().slice(0, 10),
    nextService: "",
    notes: "",
    sections: sectionsData,
    analysis: { ph: null, chlore: null },
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

  // Devis OU facture
  if (doc.type !== "devis" && doc.type !== "facture") {
    if (typeof showConfirmDialog === "function") {
      showConfirmDialog({
        title: "Action impossible",
        message:
          "Le rapport d’intervention se génère depuis un devis ou une facture.",
        confirmLabel: "OK",
        cancelLabel: "",
        variant: "warning",
        icon: "🧾",
      });
    } else {
      alert("Le rapport technique se génère depuis un devis ou une facture.");
    }
    return;
  }

  // ✅ Génère le rapport intelligent à partir de ce document
  const rapport = createRapportFromDevis(doc);
  if (!rapport) return;

  const numero = doc.number || doc.id || "";
  const _docLabel = doc.type === "facture" ? "la facture" : "le devis";

  // 🔔 Message pro de confirmation
  if (typeof showConfirmDialog === "function") {
    showConfirmDialog({
      title: "Rapport d’intervention créé",
      message:
        `Un rapport technique a été créé pour ${_docLabel} ${numero}.\n` +
        `Tu pourras le consulter et l’imprimer depuis l’onglet "Attestations & Rapports".`,
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "success",
      icon: "📝",
    });
  } else {
    alert("Un rapport d’intervention a été créé pour " + _docLabel + " " + numero + ".");
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

  const s = (id) => { const el = document.getElementById(id); if (el) el.value = ""; };
  s("rapEquipBrand"); s("rapEquipModel"); s("rapNextService");

  const numEl = document.getElementById("rapNumeroDisplay");
  if (numEl) numEl.textContent = "N° " + getNextRapNumber();

  const checklist = document.getElementById("rapportChecklist");
  if (checklist) checklist.innerHTML = "";

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
  currentRapportId = null;
  currentRapportSource = null;

  // Vider tous les champs pour la prochaine ouverture
  ["rapClientName","rapClientAddress","rapEquipBrand","rapEquipModel",
   "rapDate","rapNextService","rapNotes","rapPH","rapChlore"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const typeEl = document.getElementById("rapportType");
  if (typeEl) typeEl.value = "";
  const checklistEl = document.getElementById("rapportChecklist");
  if (checklistEl) checklistEl.innerHTML = "";
  const numEl = document.getElementById("rapNumeroDisplay");
  if (numEl) numEl.textContent = "";
  updateRapportAnalyseVisibility("");
}

function rebuildRapportChecklist(savedSections) {
  const type = document.getElementById("rapportType").value;
  updateRapportAnalyseVisibility(type);

  const tpl = RAPPORT_TEMPLATES.find((t) => t.id === type);
  const box = document.getElementById("rapportChecklist");
  if (!box) return;

  box.innerHTML = "";
  if (!tpl) return;

  // Build a map of saved item states: text → checked (bool)
  let savedStateMap = null;
  const src = savedSections || (() => {
    if (!currentRapportId) return null;
    const rec = (getAllRapports ? getAllRapports() : []).find(r => r.id === currentRapportId);
    return rec?.sections || null;
  })();

  if (src) {
    savedStateMap = {};
    src.forEach(sec => {
      (sec.items || []).forEach(item => {
        if (typeof item === "object") {
          savedStateMap[item.text] = item.checked !== false;
        } else {
          savedStateMap[item] = true; // anciens rapports : tout coché
        }
      });
    });
  }

  tpl.sections.forEach((section) => {
    const div = document.createElement("div");
    div.className = "rapport-section";

    const h = document.createElement("h4");
    h.textContent = section.title;
    div.appendChild(h);

    section.items.forEach((item) => {
      const isChecked = savedStateMap ? (savedStateMap[item] !== false) : true;
      const row = document.createElement("label");
      row.className = "rapport-item";
      row.innerHTML = `<input type="checkbox" ${isChecked ? "checked" : ""} data-text="${item}">
        <span class="rapport-item-text">${item}</span>`;
      div.appendChild(row);
    });

    box.appendChild(div);
  });
}

function updateRapportAnalyseVisibility(typeId) {
  const bloc = document.getElementById("rapportAnalyse");
  if (!bloc) return;

  // On montre l'analyse pour les entretiens piscine (chlore ou sel)
  const show = typeId === "piscine_chlore" || typeId === "piscine_sel" || typeId === "traitement_choc";

  bloc.style.display = show ? "block" : "none";

  // Si on cache, on vide les champs
  if (!show) {
    const ph = document.getElementById("rapPH");
    const chl = document.getElementById("rapChlore");
    if (ph) ph.value = "";
    if (chl) chl.value = "";
  }

  // Masquer + vider "Prochain entretien" pour les dépannages
  const nextWrap = document.getElementById("rapNextServiceWrap");
  const nextEl   = document.getElementById("rapNextService");
  if (nextWrap) {
    const isDepannage = typeId.startsWith("depannage");
    nextWrap.style.display = isDepannage ? "none" : "block";
    if (isDepannage && nextEl) nextEl.value = "";
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

  if (civ && client.civility) {
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

// ── Palette avatar ──────────────────────────────────────────
const _CLIENT_AVATAR_COLORS = [
  "#1976d2","#388e3c","#f57c00","#7b1fa2",
  "#c62828","#00838f","#558b2f","#5d4037"
];
function _clientAvatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return _CLIENT_AVATAR_COLORS[h % _CLIENT_AVATAR_COLORS.length];
}
function _clientInitials(name) {
  const p = (name || "?").trim().split(/\s+/);
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function renderClientsList() {
  const container = document.getElementById("clientsListContainer");
  const countEl   = document.getElementById("clientsCount");
  if (!container) return;

  container.innerHTML = "";

  const total    = clientsPopupList.length;
  const allTotal = getClients().length;

  if (countEl) {
    if (total === allTotal) {
      countEl.textContent = `${total} client${total > 1 ? "s" : ""}`;
    } else {
      countEl.textContent = `${total} résultat${total > 1 ? "s" : ""} sur ${allTotal}`;
    }
  }

  if (total === 0) {
    container.innerHTML = `<div class="client-empty">Aucun client trouvé.</div>`;
    _renderClientsPagination(0, 0);
    return;
  }

  const totalPages = Math.max(1, Math.ceil(total / CLIENTS_PER_PAGE));
  if (currentClientPage > totalPages) currentClientPage = totalPages;

  const start     = (currentClientPage - 1) * CLIENTS_PER_PAGE;
  const pageItems = clientsPopupList.slice(start, start + CLIENTS_PER_PAGE);

  pageItems.forEach(({ client, index }) => {
    const initials = _clientInitials(client.name || "?");
    const color    = _clientAvatarColor(client.name || "");

    const addrHtml  = client.address
      ? `<div class="client-card-addr"><span class="client-card-icon">🧾</span>${client.address}</div>`
      : "";
    const siteHtml  = (client.siteAddress && client.siteAddress.trim())
      ? `<div class="client-card-addr"><span class="client-card-icon">📍</span>Intervention : ${client.siteAddress}</div>`
      : "";
    const siretHtml = (client.siret && client.siret.trim())
      ? `<span class="client-card-info"><span class="client-card-icon">🏢</span>SIRET ${client.siret}</span>`
      : "";
    const phoneHtml = client.phone
      ? `<span class="client-card-info"><span class="client-card-icon">📞</span>${client.phone}</span>`
      : "";
    const emailHtml = client.email
      ? `<span class="client-card-info"><span class="client-card-icon">✉️</span>${client.email}</span>`
      : "";
    const metaHtml  = (phoneHtml || emailHtml || siretHtml)
      ? `<div class="client-card-meta">${phoneHtml}${emailHtml}${siretHtml}</div>`
      : "";

    const item = document.createElement("div");
    item.className = "client-card";
    item.title = "Ouvrir la fiche client";
    item.innerHTML = `
      <div class="client-card-avatar" style="background:${color}">${initials}</div>
      <div class="client-card-body">
        <div class="client-card-name">${client.name || ""}</div>
        ${addrHtml}${siteHtml}${metaHtml}
      </div>
      <div class="client-card-actions">
        <button class="client-action-btn client-action-edit"   title="Modifier"   onclick="editClient(${index})">✏️</button>
        <button class="client-action-btn client-action-delete" title="Supprimer"  onclick="deleteClientFromList(${index})">🗑️</button>
      </div>
    `;

    item.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      openClientSheet(client.name);
    });

    container.appendChild(item);
  });

  _renderClientsPagination(currentClientPage, totalPages);
}

function _renderClientsPagination(current, total) {
  const pag = document.getElementById("clientsPagination");
  if (!pag) return;
  if (total <= 1) { pag.innerHTML = ""; return; }

  let startP = Math.max(1, current - 2);
  let endP   = Math.min(total, startP + 4);
  if (endP - startP < 4) startP = Math.max(1, endP - 4);

  let html = `<button class="clients-pag-btn" onclick="prevClientsPage()" ${current === 1 ? "disabled" : ""}>◀</button>`;
  for (let p = startP; p <= endP; p++) {
    html += `<button class="clients-pag-btn${p === current ? " active" : ""}" onclick="goToClientPage(${p})">${p}</button>`;
  }
  html += `<button class="clients-pag-btn" onclick="nextClientsPage()" ${current === total ? "disabled" : ""}>▶</button>`;
  pag.innerHTML = html;
}

function goToClientPage(p) {
  currentClientPage = p;
  renderClientsList();
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
   onConfirm: async () => {
await deleteClientFromFirestore(c);
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
  const _siteEl = document.getElementById("editClientSiteAddress");
  if (_siteEl) _siteEl.value = c.siteAddress || "";
  const _siretEl = document.getElementById("editClientSiret");
  if (_siretEl) _siretEl.value = c.siret || "";
  document.getElementById("editClientPhone").value = c.phone;
  document.getElementById("editClientEmail").value = c.email;
document.getElementById("editClientPrivateNotes").value = c.privateNotes || "";

  const eq = c.equipment || {};
  const s = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
  s("editEquipClimBrand",  eq.climBrand);
  s("editEquipClimModel",  eq.climModel);
  s("editEquipClimUnits",  eq.climUnits);
  s("editEquipPoolType",   eq.poolType);
  s("editEquipPoolVolume", eq.poolVolume);
  s("editEquipPoolFilter", eq.poolFilter);
  s("editEquipPoolElec",   eq.poolElec);
  s("editEquipNotes",      eq.notes);

  document.getElementById("editClientForm").classList.remove("hidden");
}
function openAddClientFromList() {
  // Vide les champs
  document.getElementById("editClientName").value = "";
  document.getElementById("editClientAddress").value = "";
  const _siteEl0 = document.getElementById("editClientSiteAddress");
  if (_siteEl0) _siteEl0.value = "";
  const _siretEl0 = document.getElementById("editClientSiret");
  if (_siretEl0) _siretEl0.value = "";
  document.getElementById("editClientPhone").value = "";
  document.getElementById("editClientEmail").value = "";
document.getElementById("editClientPrivateNotes").value = "";

  ["editEquipClimBrand","editEquipClimModel","editEquipClimUnits",
   "editEquipPoolType","editEquipPoolVolume","editEquipPoolFilter",
   "editEquipPoolElec","editEquipNotes"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });


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
  const siteAddress = (document.getElementById("editClientSiteAddress")?.value || "").trim();
  const siret = (document.getElementById("editClientSiret")?.value || "").replace(/\s/g, "").trim();
  const phone = document.getElementById("editClientPhone").value.trim();
  const email = document.getElementById("editClientEmail").value.trim();
  const privateNotes = document.getElementById("editClientPrivateNotes").value.trim();

  const g = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const equipment = {
    climBrand:  g("editEquipClimBrand"),
    climModel:  g("editEquipClimModel"),
    climUnits:  g("editEquipClimUnits"),
    poolType:   g("editEquipPoolType"),
    poolVolume: g("editEquipPoolVolume"),
    poolFilter: g("editEquipPoolFilter"),
    poolElec:   g("editEquipPoolElec"),
    notes:      g("editEquipNotes"),
  };

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
      siteAddress,
      siret,
      phone,
      email,
      privateNotes,
      equipment,
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
      siteAddress,
      siret,
      phone,
      email,
      privateNotes,
      equipment,
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
  const docs = getAllDocuments().filter((d) => d.type === "facture" && (d.date || d.paymentDate));

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
    const ht = Number(d.subtotal || 0) || 0;
    const tva = Number(d.tvaAmount || 0) || 0;
    const ttc = Number(d.totalTTC || 0) || 0;

    if (d.paid) {
      // ✅ CA encaissé → classé par DATE DE PAIEMENT (comptabilité de trésorerie)
      const payISO = (d.paymentDate || d.date || "").slice(0, 10);
      if (!payISO) return;
      const dtPay = new Date(payISO + "T00:00:00");
      const yPay = dtPay.getFullYear();
      if (isNaN(yPay)) return;
      if (year && yPay !== year) return;
      const mIndex = dtPay.getMonth();
      const month = months[mIndex];
      month.totalHT  += ht;
      month.totalTVA += tva;
      month.totalTTC += ttc;
      month.paidTTC  += ttc;
      month.paidCount += 1;
    } else {
      // 📋 Facture non payée → classée par date d'émission (activité de facturation)
      if (!d.date) return;
      const dtEmit = new Date(d.date + "T00:00:00");
      const yEmit = dtEmit.getFullYear();
      if (isNaN(yEmit)) return;
      if (year && yEmit !== year) return;
      const mIndex = dtEmit.getMonth();
      const month = months[mIndex];
      month.totalHT  += ht;
      month.totalTVA += tva;
      month.totalTTC += ttc;
      month.unpaidTTC  += ttc;
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
  _hideAllMainViews();

  // Onglets
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const tabCA = document.getElementById("tabCA");
  if (tabCA) tabCA.classList.add("active");

  // Afficher la vue CA
  const overlay = document.getElementById("caReportOverlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");

  initCAYearSelect();
  renderCAReport();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeCAReport() {
  const overlay = document.getElementById("caReportOverlay");
  if (overlay) overlay.classList.add("hidden");
  showHome();
}

/* ===== Exports CSV ===== */

function exportCAURSSAFCSV() {
  try {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF non charge. Verifiez la connexion internet.");
    return;
  }

  const yearSelect = document.getElementById("caYearSelect");
  const value      = yearSelect ? (yearSelect.value || "all") : "all";
  const selectedYear = value === "all"
    ? new Date().getFullYear()
    : (parseInt(value, 10) || new Date().getFullYear());

  const months    = computeCAMonthsForYear(selectedYear);
  const company   = (typeof getCompanySettings === "function") ? getCompanySettings() : {};
  const tvaStatus = (typeof getMicroTVAStatus  === "function") ? getMicroTVAStatus()  : { mode: "franchise" };
  const THRESHOLD = (typeof MICRO_TVA_THRESHOLD_BASE !== "undefined") ? MICRO_TVA_THRESHOLD_BASE : 36800;

  // ── Formateur nombres : espace simple comme séparateur de milliers
  // (toLocaleString("fr-FR") insère un U+202F que jsPDF rend en "/")
  const fmt = (v) => {
    const n = Number(v || 0);
    const parts = n.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(",") + " EUR";
  };

  // ── Palette ──────────────────────────────────────────
  const C = {
    blue:   [25,  118, 210],
    blueD:  [13,   71, 161],
    blueL:  [232, 244, 255],
    green:  [ 27,  94,  32],
    greenL: [232, 245, 233],
    red:    [198,  40,  40],
    redL:   [255, 235, 238],
    grey:   [120, 120, 120],
    greyL:  [247, 249, 251],
    greyM:  [220, 225, 230],
    dark:   [ 20,  20,  20],
    white:  [255, 255, 255],
  };
  const M = 14;
  const W = 210 - M * 2;
  const doc = new window.jspdf.jsPDF();

  // Donnees agregees
  const annualCA  = months.reduce((s, m) => s + (m.paidTTC   || 0), 0);
  const annualCnt = months.reduce((s, m) => s + (m.paidCount || 0), 0);
  const pct       = THRESHOLD > 0 ? Math.min(annualCA / THRESHOLD * 100, 999) : 0;
  const isObl     = tvaStatus.mode === "obligatoire";
  const MOIS      = ["Janvier","Fevrier","Mars","Avril","Mai","Juin",
                     "Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];
  const QTRIM     = ["T1  Janv - Mars","T2  Avr - Juin","T3  Juil - Sept","T4  Oct - Dec"];
  const quarters  = [0,1,2,3].map(q => ({
    ca:  months.slice(q*3, q*3+3).reduce((s,m) => s + (m.paidTTC   || 0), 0),
    cnt: months.slice(q*3, q*3+3).reduce((s,m) => s + (m.paidCount || 0), 0),
  }));

  // ════════════════════════════════
  // HEADER
  // ════════════════════════════════
  doc.setFillColor(...C.blue);
  doc.rect(0, 0, 210, 26, "F");

  doc.setTextColor(...C.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(company.companyName || "AquaClim Prestige", M, 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(company.subtitle || "Entretien & Depannage - Climatisation & Piscine", M, 18);

  // Badge droite
  doc.setFillColor(...C.white);
  doc.roundedRect(143, 4, 53, 18, 2, 2, "F");
  doc.setTextColor(...C.blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DECLARATION CA", 169, 11, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.grey);
  doc.text("Micro-Entrepreneur", 169, 18, { align: "center" });

  // ── Coordonnees societe ──
  let y = 32;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grey);
  [
    company.legalName || "",
    company.address   || "",
    [company.phone, company.email].filter(Boolean).join("   "),
    company.siret ? "SIRET : " + company.siret : "",
  ].filter(Boolean).forEach(l => { doc.text(l, M, y); y += 3.8; });

  // ── Titre ──
  y += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...C.dark);
  doc.text("Declaration de Chiffre d'Affaires", M, y);
  y += 5.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.blue);
  doc.text("Exercice " + selectedYear + "   |   Micro-Entrepreneur   |   Recettes encaissees", M, y);
  y += 1.5;
  doc.setDrawColor(...C.blueL);
  doc.setLineWidth(0.5);
  doc.line(M, y + 2, 210 - M, y + 2);
  y += 8;

  // ════════════════════════════
  // TOTAL ANNUEL — grande case
  // ════════════════════════════
  doc.setFillColor(...C.blueD);
  doc.roundedRect(M, y, W, 20, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 210, 255);
  doc.text("TOTAL ANNUEL " + selectedYear, M + 6, y + 7);
  doc.setFontSize(7.5);
  doc.text(annualCnt + " facture" + (annualCnt > 1 ? "s" : "") + " encaissee" + (annualCnt > 1 ? "s" : ""), M + 6, y + 13);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.white);
  doc.text(fmt(annualCA), 210 - M - 5, y + 13, { align: "right" });
  y += 26;

  // ════════════════════════════
  // 4 CASES TRIMESTRIELLES
  // ════════════════════════════
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.dark);
  doc.text("Montants a declarer par trimestre :", M, y);
  y += 5;

  const bW = (W - 6) / 2;
  const bH = 26;

  quarters.forEach((q, qi) => {
    const bx = M + (qi % 2) * (bW + 6);
    const by = y + Math.floor(qi / 2) * (bH + 5);

    // Fond
    doc.setFillColor(...C.greyL);
    doc.setDrawColor(...C.greyM);
    doc.setLineWidth(0.3);
    doc.roundedRect(bx, by, bW, bH, 3, 3, "FD");

    // Barre couleur gauche
    doc.setFillColor(...C.blue);
    doc.roundedRect(bx, by, 4, bH, 2, 2, "F");
    doc.rect(bx + 2, by, 2, bH, "F");

    // Label trimestre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.blue);
    doc.text(QTRIM[qi], bx + 8, by + 9);

    // Montant
    doc.setFont("helvetica", "bold");
    doc.setFontSize(q.ca > 0 ? 13 : 11);
    doc.setTextColor(...(q.ca > 0 ? C.dark : C.grey));
    doc.text(q.ca > 0 ? fmt(q.ca) : "0,00 EUR", bx + bW - 5, by + 20, { align: "right" });

    // Nb factures
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.grey);
    doc.text(q.cnt + " fact.", bx + 8, by + 21);
  });

  y += 2 * (bH + 5) + 6;

  // ════════════════════════════
  // TABLEAU MENSUEL DETAILLE
  // ════════════════════════════
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.dark);
  doc.text("Detail mensuel :", M, y);
  y += 5;

  const cW  = [40, 22, 48, 48, 24];
  const cX  = [M, M+40, M+62, M+110, M+158];
  const hH  = 7.5;
  const rH  = 6.2;

  // En-tete tableau
  doc.setFillColor(...C.blue);
  doc.rect(M, y, W, hH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.white);
  [["Mois",0,"left"],["Fact.",1,"right"],["CA HT",2,"right"],["CA TTC",3,"right"],["Trim.",4,"right"]].forEach(([lbl,i,al]) => {
    const tx = al === "left" ? cX[i] + 3 : cX[i] + cW[i] - 2;
    doc.text(lbl, tx, y + 5.2, { align: al });
  });
  y += hH;

  months.forEach((m, idx) => {
    const ca  = m.paidTTC   || 0;
    const ht  = m.totalHT   || 0;
    const cnt = m.paidCount || 0;

    if (idx % 2 === 0) {
      doc.setFillColor(...C.greyL);
      doc.rect(M, y, W, rH, "F");
    }

    doc.setFontSize(8);
    const midY = y + 4.2;

    // Mois
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...(ca > 0 ? C.dark : C.grey));
    doc.text(MOIS[idx], cX[0] + 3, midY);

    // Nb factures
    doc.setTextColor(...(cnt > 0 ? C.dark : C.grey));
    doc.text(cnt > 0 ? String(cnt) : "-", cX[1] + cW[1] - 2, midY, { align: "right" });

    // HT
    doc.setTextColor(...C.grey);
    doc.text(ca > 0 ? fmt(ht) : "-", cX[2] + cW[2] - 2, midY, { align: "right" });

    // TTC
    doc.setFont("helvetica", ca > 0 ? "bold" : "normal");
    doc.setTextColor(...(ca > 0 ? C.dark : C.grey));
    doc.text(ca > 0 ? fmt(ca) : "-", cX[3] + cW[3] - 2, midY, { align: "right" });

    // Trimestre (1er mois uniquement)
    if (idx % 3 === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.blue);
      doc.text("T" + (Math.floor(idx/3) + 1), cX[4] + cW[4] - 2, midY, { align: "right" });
    }

    y += rH;

    // Separateur fin de trimestre
    if (idx % 3 === 2) {
      doc.setDrawColor(...C.greyM);
      doc.setLineWidth(0.4);
      doc.line(M, y, M + W, y);
      y += 1.5;
    }
  });

  // ════════════════════════════
  // STATUT TVA
  // ════════════════════════════
  y += 6;
  const sBg   = isObl ? C.redL   : C.greenL;
  const sBord = isObl ? C.red    : C.green;
  const sTxt  = isObl ? C.red    : C.green;
  doc.setFillColor(...sBg);
  doc.setDrawColor(...sBord);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, y, W, 14, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...sTxt);
  doc.text(isObl ? "TVA OBLIGATOIRE" : "Franchise en base de TVA", M + 5, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.grey);
  doc.text(
    "Seuil : " + fmt(THRESHOLD) + "   CA encaisse : " + fmt(annualCA) + "   (" + pct.toFixed(1) + " % atteint)",
    M + 5, y + 11
  );
  y += 20;

  // ════════════════════════════
  // PIED DE PAGE
  // ════════════════════════════
  const d   = new Date();
  const gen = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  doc.setDrawColor(...C.greyM);
  doc.setLineWidth(0.3);
  doc.line(M, y, 210 - M, y);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.grey);
  doc.text(
    "Genere le " + gen + "  -  " + (company.companyName || "AquaClim Prestige") + "  -  Usage interne / declaration URSSAF",
    105, y + 4, { align: "center" }
  );

  doc.save("Declaration_CA_URSSAF_" + selectedYear + ".pdf");

  } catch(e) {
    alert("Erreur generation PDF : " + e.message + "\n\nLigne : " + (e.stack || "").split("\n")[1]);
  }
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

  if (typeof refreshSendTemplateSelect === "function") refreshSendTemplateSelect();

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

  if (typeof refreshSendTemplateSelect === "function") refreshSendTemplateSelect();

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

// ⚡ ACTION RAPIDE : ouvrir l'envoi email depuis la liste (sans ouvrir le doc)
function quickSendEmail(id) {
  const doc = getDocument(id);
  if (!doc) return;

  currentSendDoc = doc;
  const { body } = buildSendMessage(doc);

  const infoEl  = document.getElementById("sendDocInfo");
  const txtArea = document.getElementById("sendMessagePreview");
  const overlay = document.getElementById("sendPopup");

  if (infoEl) {
    const typeLabel = doc.type === "facture" ? "Facture" : doc.type === "devis" ? "Devis" : "Document";
    infoEl.textContent = `${typeLabel} ${doc.number || ""} – ${doc?.client?.name || ""}`;
  }
  if (txtArea) txtArea.value = body;
  if (typeof refreshSendTemplateSelect === "function") refreshSendTemplateSelect();

  if (overlay) {
    overlay.classList.remove("hidden");
    const popup = overlay.querySelector(".popup");
    if (popup) { void popup.offsetWidth; popup.classList.add("show"); }
  }
}

// ⚡ ACTION RAPIDE : basculer payé / en attente depuis la liste
function quickMarkPaid(id) {
  const doc = getDocument(id);
  if (!doc || doc.type !== "facture") return;

  if (doc.paid) {
    // Repasser en attente
    setPaymentMode(id, "");
  } else {
    // Marquer payée (on garde le mode déjà choisi sinon "virement" par défaut)
    setPaymentMode(id, doc.paymentMode || "virement");
  }
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

// Ajoute 1 an à une date ISO "YYYY-MM-DD" sans passer par toISOString
// (évite tout décalage lié au fuseau horaire → l'année reste exacte)
function _addOneYearISO(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const y = parseInt(m[1], 10) + 1;
  return `${y}-${m[2]}-${m[3]}`;
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
  const nextService = _addOneYearISO(date); // prochain entretien = +1 an

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
    numero: getNextAttNumber(),
    type: "attestation_clim",
    clientName: name,
    clientAddress: addr,
    date,
    nextService,
    units,
    notes: "",
    ops: null,
    createdAt: new Date().toISOString(),
    sourceDocId: doc.id || null,
    sourceDocNumber: doc.number || null,
  };

  list.push(record);
  saveAttestations(list);

  // Sync Firestore si dispo
  if (typeof saveSingleAttestationToFirestore === "function") {
    try { saveSingleAttestationToFirestore(record); } catch (e) {}
  }

  // Si tu es sur l’onglet Attestations, on rafraîchit la liste
  if (typeof loadAttestationsList === "function") {
    loadAttestationsList();
  }

  // 🔔 Notifier l'utilisateur (sinon il ne voit pas qu'elle a été créée)
  if (typeof showToast === "function") {
    showToast(`Attestation clim ${record.numero} générée`, "success");
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

  // Tous les items avec état coché/non coché
  const sectionsData = [];
  document.querySelectorAll("#rapportChecklist .rapport-section").forEach((sectionEl) => {
    const title = sectionEl.querySelector("h4")?.textContent || "";
    const items = [];
    sectionEl.querySelectorAll("input[type='checkbox']").forEach((cb) => {
      items.push({ text: cb.dataset.text || "", checked: cb.checked });
    });
    if (items.length) sectionsData.push({ title, items });
  });

  const equipBrand  = document.getElementById("rapEquipBrand")?.value.trim() || "";
  const equipModel  = document.getElementById("rapEquipModel")?.value.trim() || "";
  const nextService = document.getElementById("rapNextService")?.value || "";

  const list = getAllRapports();
  let record;

  const photos = Array.isArray(currentRapportPhotosTemp) ? currentRapportPhotosTemp : [];
  const attachments = Array.isArray(currentRapportAttachmentsTemp) ? currentRapportAttachmentsTemp : [];
  const analysis = { ph: phValue || null, chlore: chloreValue || null };
  const baseFields = { typeId, typeLabel: tpl ? tpl.label : "", clientName: name, clientAddress: addr,
    equipBrand, equipModel, date, nextService, notes, sections: sectionsData, photos, attachments, analysis };

  if (currentRapportId) {
    const idx = list.findIndex((r) => r.id === currentRapportId);
    if (idx !== -1) {
      record = { ...list[idx], ...baseFields };
      list[idx] = record;
    } else {
      record = { id: generateId("RAP"), numero: getNextRapNumber(), ...baseFields,
        createdAt: new Date().toISOString(),
        sourceDocId: currentRapportSource?.id || null,
        sourceDocNumber: currentRapportSource?.number || null };
      list.push(record);
    }
  } else {
    record = { id: generateId("RAP"), numero: getNextRapNumber(), ...baseFields,
      createdAt: new Date().toISOString(),
      sourceDocId: currentRapportSource?.id || null,
      sourceDocNumber: currentRapportSource?.number || null };
    list.push(record);
  }

  saveRapports(list);
  currentRapportId = record.id;

  if (typeof loadRapportsList === "function") {
    loadRapportsList();
  }
}

function saveRapportOnly() {
  // Capture les valeurs avant fermeture
  const rapName     = document.getElementById("rapClientName")?.value.trim()    || "";
  const rapAddr     = document.getElementById("rapClientAddress")?.value.trim() || "";
  const rapDate     = document.getElementById("rapDate")?.value                  || "";
  const rapTypeId   = document.getElementById("rapportType")?.value              || "";
  const rapTpl      = RAPPORT_TEMPLATES.find(t => t.id === rapTypeId);
  const rapTypeLabel = rapTpl ? rapTpl.label : "Intervention";

  saveRapportFromForm();
  closeRapportPopup();

  // Proposer de créer une facture
  if (rapName) {
    showConfirmDialog({
      title: "Créer une facture ?",
      message: `Intervention enregistrée pour ${rapName}.\nVoulez-vous générer la facture correspondante ?`,
      confirmLabel: "💶 Créer la facture",
      cancelLabel: "Non merci",
      variant: "info",
      icon: "📋",
      onConfirm: () => {
        openFromHome("facture");
        newDocument("facture");
        setTimeout(() => {
          const elName = document.getElementById("clientName");
          const elAddr = document.getElementById("clientAddress");
          const elSubj = document.getElementById("docSubject");
          if (elName) { elName.value = rapName; elName.dispatchEvent(new Event("change")); }
          if (elAddr) elAddr.value = rapAddr;
          if (elSubj) elSubj.value = `${rapTypeLabel}${rapDate ? " – " + rapDate.split("-").reverse().join("/") : ""}`;
        }, 350);
      }
    });
  }
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

  // PC / Android => nouvel onglet
  if (!ios) {
    window.open(url, "_blank");
    return;
  }

  // Safari iPhone (pas PWA) => nouvel onglet
  if (ios && !pwa) {
    window.open(url, "_blank");
    return;
  }

  // ── iOS PWA ──────────────────────────────────────────────
  // On utilise le share sheet natif iOS via un lien <a download>.
  // Quick Look s'ouvre, l'utilisateur peut imprimer/partager/enregistrer,
  // et quand il ferme → il revient directement dans l'app (pas besoin de tuer).
  _openPdfIOSPWA(url);
}

function _openPdfIOSPWA(url) {
  // Convertit data URI → Blob URL si nécessaire (download ne marche qu'avec blob)
  let blobUrl = url;
  let created = false;

  if (url.startsWith("data:")) {
    try {
      const [header, b64] = url.split(",");
      const mime = (header.match(/:(.*?);/) || [])[1] || "application/pdf";
      const bin  = atob(b64);
      const arr  = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      blobUrl = URL.createObjectURL(new Blob([arr], { type: mime }));
      created = true;
    } catch (e) {
      // fallback : on essaie quand même avec le data URI
      blobUrl = url;
    }
  }

  const a = document.createElement("a");
  a.href     = blobUrl;
  a.download = "document.pdf";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    if (created) URL.revokeObjectURL(blobUrl);
  }, 3000);
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



// Déclenche l'impression depuis le viewer iOS (ouvre la feuille partage → Save PDF)
function _pdfViewerPrint() {
  const frame = document.getElementById("pdfViewerFrame");
  if (!frame) return;
  try {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  } catch(e) {
    // Fallback : ouvrir l'URL du blob dans un onglet pour imprimer
    if (frame.src && frame.src !== "about:blank") {
      window.open(frame.src, "_blank");
    }
  }
}

function closePdfViewer() {
  const overlay = document.getElementById("pdfViewerOverlay");
  const frame = document.getElementById("pdfViewerFrame");
  const printBtn = document.getElementById("pdfPrintBtn");

  if (frame) frame.src = "about:blank";
  if (overlay) overlay.classList.add("hidden");
  if (printBtn) printBtn.style.display = "none";

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
  const blue   = [25, 118, 210];
  const blueL  = [232, 244, 255];
  const grey   = [100, 100, 100];
  const dark   = [30,  30,  30];
  const M      = 14;          // marge gauche/droite
  const W      = 210 - M*2;  // largeur utile
  const PAGE_B = 274;         // bas de page utilisable (mm)
  const PAGE_T = 18;          // haut de page après saut
  const company = getCompanySettings();

  /* ====================================================
     HEADER
  ==================================================== */
  doc.setFillColor(...blue);
  doc.rect(0, 0, 210, 26, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("AquaClim Prestige", M, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Entretien & Depannage – Climatisation & Piscine", M, 20);

  // Badge titre document
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(132, 4, 64, 18, 2, 2, "F");
  doc.setTextColor(...blue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("RAPPORT TECHNIQUE", 164, 11, { align: "center" });
  if (record.numero) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text("N\xB0 " + record.numero, 164, 18, { align: "center" });
  }

  /* ====================================================
     COORDONNÉES SOCIÉTÉ
  ==================================================== */
  let y = 32;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...grey);
  doc.text(company.legalName + " – " + company.address, M, y);
  y += 4.5;
  doc.text("Tel : " + company.phone + " – " + company.email, M, y);
  y += 7;

  /* ====================================================
     TITRE DU RAPPORT
  ==================================================== */
  const title = record.typeLabel || "Rapport d'intervention";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...blue);
  doc.text(title, M, y);
  y += 5;
  doc.setDrawColor(220, 230, 245);
  doc.setLineWidth(0.4);
  doc.line(M, y, 210 - M, y);
  y += 7;

  /* ====================================================
     CARTES CLIENT / INTERVENTION
  ==================================================== */
  const cardH = 28;
  const cardW = (W - 8) / 2;

  // Carte Client
  doc.setFillColor(247, 250, 253);
  doc.setDrawColor(220, 230, 245);
  doc.roundedRect(M, y, cardW, cardH, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...blue);
  doc.text("CLIENT", M + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  let cy = y + 12;
  if (record.clientName) {
    doc.setFont("helvetica", "bold");
    const cLines = doc.splitTextToSize(record.clientName, cardW - 8);
    doc.text(cLines, M + 4, cy);
    cy += cLines.length * 4.5;
    doc.setFont("helvetica", "normal");
  }
  if (record.clientAddress) {
    doc.setFontSize(8.5);
    doc.setTextColor(...grey);
    const aLines = doc.splitTextToSize(record.clientAddress, cardW - 8);
    doc.text(aLines, M + 4, cy);
  }

  // Carte Intervention
  const c2x = M + cardW + 8;
  doc.setFillColor(247, 250, 253);
  doc.setDrawColor(220, 230, 245);
  doc.roundedRect(c2x, y, cardW, cardH, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...blue);
  doc.text("INTERVENTION", c2x + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  let iy = y + 12;
  const frDate = record.date ? record.date.split("-").reverse().join("/") : "";
  if (frDate) {
    doc.text("Date : " + frDate, c2x + 4, iy);
    iy += 4.5;
  }
  if (record.equipBrand || record.equipModel) {
    const equip = [record.equipBrand, record.equipModel].filter(Boolean).join(" – ");
    doc.setFontSize(8.5);
    const eLines = doc.splitTextToSize("Equip. : " + equip, cardW - 8);
    doc.text(eLines, c2x + 4, iy);
  }

  y += cardH + 8;

  /* ====================================================
     BLOC ANALYSE EAU (piscine)
  ==================================================== */
  const showAnalysis = record.analysis && (record.analysis.ph || record.analysis.chlore);
  if (showAnalysis) {
    doc.setFillColor(...blueL);
    doc.setDrawColor(...blue);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, W, 13, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...blue);
    doc.text("Analyse de l'eau", M + 4, y + 5.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...dark);
    let ax = M + 40;
    if (record.analysis.ph) {
      doc.text("pH : " + record.analysis.ph, ax, y + 5.5);
      doc.setTextColor(...grey);
      doc.setFontSize(7.5);
      doc.text("(ref 7,2-7,6)", ax + 14, y + 5.5);
      doc.setTextColor(...dark);
      doc.setFontSize(8.5);
      ax += 50;
    }
    if (record.analysis.chlore) {
      doc.text("Chlore : " + record.analysis.chlore + " mg/L", ax, y + 5.5);
      doc.setTextColor(...grey);
      doc.setFontSize(7.5);
      doc.text("(ref 1,0-3,0)", ax + 28, y + 5.5);
    }
    y += 18;
  }

  /* ====================================================
     SECTIONS CHECKLIST
  ==================================================== */
  const ITEM_H  = 5.0;   // hauteur par ligne d'item
  const SEC_H   = 15;    // hauteur barre section (8) + espace avant 1er item (7)

  (record.sections || []).forEach((sec) => {
    const items = sec.items || [];

    // Hauteur estimée de la section entière (header + tous les items)
    const secTotalH = SEC_H + items.length * ITEM_H;
    // Hauteur minimale pour ne pas laisser le header seul en bas
    // (header + au moins 2 items, ou la section entière si elle est petite)
    const minH = SEC_H + Math.min(items.length, 2) * ITEM_H;

    if (y + minH > PAGE_B) {
      // Pas assez de place même pour le header + 2 items → saut de page
      doc.addPage();
      y = PAGE_T;
    } else if (y + secTotalH <= PAGE_B) {
      // La section entière tient : ne rien faire
    }
    // Sinon : la section est longue, on la laisse se couper entre items

    // Barre de section — bleu foncé + texte blanc
    doc.setFillColor(...blue);
    doc.setDrawColor(...blue);
    doc.roundedRect(M, y, W, 8, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(sec.title || "", M + 4, y + 5.5);
    y += SEC_H;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    items.forEach((itemRaw, idx) => {
      // Saut de page entre items : on garde au moins 1 item suivant sur la même page
      const isLast = idx === items.length - 1;
      const spaceNeeded = isLast ? ITEM_H : ITEM_H * 2;
      if (y + spaceNeeded > PAGE_B) { doc.addPage(); y = PAGE_T; }

      const isObj   = typeof itemRaw === "object";
      const txtRaw  = isObj ? itemRaw.text : itemRaw;
      const checked = isObj ? itemRaw.checked !== false : true;
      const clean   = (txtRaw || "").replace(/^[•●\-–]\s*/, "");

      _pdfDrawCheckbox(doc, M + 1, y, checked);
      if (checked) { doc.setTextColor(...dark); } else { doc.setTextColor(160, 160, 160); }

      const wrapped = doc.splitTextToSize(clean, W - 12);
      doc.text(wrapped, M + 8, y);
      y += wrapped.length * ITEM_H;
    });

    y += 3; // espace inter-sections
  });

  /* ====================================================
     REMARQUES
  ==================================================== */
  if (record.notes && record.notes.trim()) {
    if (y > 255) { doc.addPage(); y = 18; }

    doc.setFillColor(...blue);
    doc.setDrawColor(...blue);
    doc.roundedRect(M, y, W, 8, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Remarques / anomalies", M + 4, y + 5.5);
    y += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    const wrapped = doc.splitTextToSize(record.notes, W);
    wrapped.forEach((line) => {
      if (y > 272) { doc.addPage(); y = 18; }
      doc.text(line, M, y);
      y += 5;
    });
    y += 3;
  }

  /* ====================================================
     PHOTOS
  ==================================================== */
  const photos = Array.isArray(record.photos) ? record.photos : [];
  if (photos.length) {
    const imgH = 56;
    const gap  = 6;
    const colW = (W - gap) / 2;
    if (y + imgH + 10 > 275) { doc.addPage(); y = 18; }

    doc.setFillColor(...blue);
    doc.setDrawColor(...blue);
    doc.roundedRect(M, y, W, 8, 1.5, 1.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Photos", M + 4, y + 5.5);
    y += 15;

    let col = 0;
    for (const p of photos) {
      if (!p || !p.dataUrl) continue;
      if (y + imgH > 275) { doc.addPage(); y = 18; col = 0; }
      const x = M + (col === 0 ? 0 : colW + gap);
      try { doc.addImage(p.dataUrl, "JPEG", x, y, colW, imgH, undefined, "FAST"); } catch(e) {}
      col = (col + 1) % 2;
      if (col === 0) y += imgH + 4;
    }
    if (col !== 0) y += imgH + 4;
  }

  /* ====================================================
     ZONE SIGNATURE
  ==================================================== */
  // Si on est encore loin du bas, on colle la signature après le contenu
  // Si on est trop proche du bas, on saute une page
  if (y + 25 > PAGE_B) { doc.addPage(); y = PAGE_T; }
  if (y < 248) y = 248;
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(M, y, M + 65, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...grey);
  doc.text("Signature du technicien", M, y + 4.5);

  const rapSig = localStorage.getItem("companySignature");
  if (rapSig) {
    try { doc.addImage(rapSig, "PNG", M, y - 14, 50, 14); } catch(e) {}
  }

  const dateSign = record.date ? record.date.split("-").reverse().join("/") : new Date().toLocaleDateString("fr-FR");
  doc.text("Fait le " + dateSign, M, y + 9);

  /* ====================================================
     PIED DE PAGE
  ==================================================== */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 160);
  doc.text(
    (company.legalName || "AquaClim Prestige") + " – SIRET " + (company.siret || "XXXXXXXXXXXXX"),
    105, 287, { align: "center" }
  );

  const fileName = "rapport-" + (record.clientName ? record.clientName.replace(/[^a-z0-9\-]+/gi, "_") : "intervention") + ".pdf";

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

  const s = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ""; };
  s("rapClientName",  rec.clientName);
  s("rapClientAddress", rec.clientAddress);
  s("rapEquipBrand",  rec.equipBrand);
  s("rapEquipModel",  rec.equipModel);
  s("rapDate",        rec.date);
  s("rapNextService", rec.nextService);
  s("rapNotes",       rec.notes);
  s("rapportType",    rec.typeId);

  const numEl = document.getElementById("rapNumeroDisplay");
  if (numEl) numEl.textContent = rec.numero ? "N° " + rec.numero : "";

  updateRapportAnalyseVisibility(rec.typeId || "");
  rebuildRapportChecklist(rec.sections);

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

function getNextContractNumber() {
  const year = new Date().getFullYear();
  const contracts = (typeof getAllContracts === "function") ? getAllContracts() : [];
  const used = [];
  contracts.forEach((c) => {
    if (!c.number) return;
    const m = c.number.match(/^CTR-(\d{4})-(\d{3})$/);
    if (!m) return;
    if (parseInt(m[1], 10) === year) used.push(parseInt(m[2], 10));
  });
  used.sort((a, b) => a - b);
  let next = 1;
  for (let i = 0; i < used.length; i++) {
    if (used[i] === next) next++;
    else if (used[i] > next) break;
  }
  return `CTR-${year}-${String(next).padStart(3, "0")}`;
}

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

// ⚠️ ANCIENNE FONCTION — conservée pour compatibilité avec les contrats existants
// qui stockaient le numéro dans client.reference. NE PAS utiliser pour les nouveaux contrats.
// Utiliser getNextContractNumber() (qui stocke dans contract.number) à la place.
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
  // 🔒 Si un formulaire est ouvert avec des modifs, demander confirmation
  if (_formDirty && _isAnyFormVisible()) {
    showConfirmDialog({
      title: "Modifications non sauvegardées",
      message: "Tu as des modifications non enregistrées.\nChanger d'onglet sans sauvegarder ?",
      confirmLabel: "Changer sans sauvegarder",
      cancelLabel: "Rester",
      variant: "danger",
      icon: "⚠️",
      onConfirm: () => { _clearFormDirty(); switchListType(type); },
    });
    return;
  }

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

  // 🧾 Bouton Factur-X : uniquement pour les factures
  document.querySelectorAll(".facturx-btn").forEach((b) => {
    b.style.display = type === "facture" ? "inline-block" : "none";
  });

  refreshDevisStatusUI(type, validityInput.value);
  updateButtonColors();
}

function updateTransformButtonVisibility() {
  const transformBtn = document.getElementById("transformButton");
  const contractBtn = document.getElementById("contractFromDevisButton");
  const rapportBtns = document.querySelectorAll(".js-rapport-btn");
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
  // 🔥 Le(s) bouton(s) rapport apparaissent pour les devis ET les factures
  //    (uniquement quand le document est enregistré)
  //    → pour une FACTURE CLIM, ils deviennent "Générer attestation clim"
  const canRapport = (type === "devis" || type === "facture") && !!currentDocumentId;
  const _doc = canRapport && typeof getDocument === "function" ? getDocument(currentDocumentId) : null;
  const _isClimFacture = canRapport && type === "facture" && _docLooksClim(_doc);
  rapportBtns.forEach((rapportBtn) => {
    rapportBtn.style.display = canRapport ? "inline-block" : "none";
    if (!canRapport) return;
    if (_isClimFacture) {
      rapportBtn.textContent = "📋 Générer attestation clim";
      rapportBtn.onclick = onGenerateAttestationFromCurrent;
    } else {
      rapportBtn.textContent = "📝 Générer rapport d’intervention";
      rapportBtn.onclick = onGenerateRapportFromCurrent;
    }
  });
}

// Détecte si un document (facture/devis) concerne la climatisation / PAC
function _docLooksClim(doc) {
  if (!doc) return false;
  if (Array.isArray(doc.prestations) &&
      doc.prestations.some((p) => p && ["entretien_clim", "depannage_clim"].includes(p.kind))) {
    return true;
  }
  const hay = (
    (doc.subject || "") + " " +
    (Array.isArray(doc.prestations) ? doc.prestations.map((p) => p && p.desc || "").join(" ") : "")
  ).toLowerCase();
  if (hay.includes("clim") || /\bpac\b/.test(hay) ||
      hay.includes("pompe à chaleur") || hay.includes("pompe a chaleur")) {
    return true;
  }
  if (doc.contractId && typeof getContract === "function") {
    const c = getContract(doc.contractId);
    if ((c?.pricing?.mainService || c?.pool?.type || "") === "entretien_clim") return true;
  }
  return false;
}

// Génère (ouvre le formulaire pré-rempli) une attestation clim depuis la facture courante
function onGenerateAttestationFromCurrent() {
  if (!currentDocumentId) {
    if (typeof showToast === "function") showToast("Ouvre d’abord une facture", "warning");
    return;
  }
  const doc = (typeof getDocument === "function") ? getDocument(currentDocumentId) : null;
  if (!doc) return;
  if (typeof openAttestationForInvoice === "function") {
    openAttestationForInvoice(doc);
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

// ═══════════════════════════════════════════════════════════
// Construction du menu déroulant des prestations avec sous-menus
// ═══════════════════════════════════════════════════════════
function buildPrestationOptionsHtml() {
  // Catégorie de chaque prestation (par "kind")
  const GROUP_BY_KIND = {
    // Entretien
    entretien_clim:        "Entretien",
    piscine_chlore:        "Entretien",
    piscine_sel:           "Entretien",
    entretien_jacuzzi:     "Entretien",
    // Saisonnier piscine
    hivernage_piscine:     "Saisonnier piscine",
    remise_service_propre: "Saisonnier piscine",
    remise_service_piscine:"Saisonnier piscine",
    // Traitements
    vidange_jacuzzi:       "Traitements",
    traitement_choc:       "Traitements",
    // Réparations
    changement_sable:        "Réparations",
    remplacement_roulement:  "Réparations",
    remplacement_pompe_mo:   "Réparations",
    remplacement_cellule_mo: "Réparations",
    // Dépannages
    depannage_clim:        "Dépannages",
    depannage_piscine:     "Dépannages",
    depannage_jacuzzi:     "Dépannages",
    // Divers
    nettoyage_local:       "Divers",
    deplacement:           "Divers",
    produits:              "Divers",
    fournitures:           "Divers",
  };

  // Ordre d'affichage des groupes
  const GROUP_ORDER = [
    "Entretien",
    "Saisonnier piscine",
    "Traitements",
    "Réparations",
    "Dépannages",
    "Divers",
  ];

  let html = "";

  // 1) Option vide "— Choisir un modèle —" (toujours en premier, hors groupe)
  PRESTATION_TEMPLATES.forEach((t, idx) => {
    if (t && !t.kind && !t._deleted) {
      html += `<option value="${idx}">${t.label}</option>`;
    }
  });

  // 2) Groupes
  GROUP_ORDER.forEach((groupName) => {
    const items = [];
    PRESTATION_TEMPLATES.forEach((t, idx) => {
      if (!t || t._deleted || !t.kind) return;
      const g = GROUP_BY_KIND[t.kind] || "Divers";
      if (g === groupName) {
        items.push(`<option value="${idx}">${t.label}</option>`);
      }
    });
    if (items.length > 0) {
      html += `<optgroup label="${groupName}">${items.join("")}</optgroup>`;
    }
  });

  return html;
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

  const optionsHtml = buildPrestationOptionsHtml();

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


function addDetailLine() {
  prestationCount++;

  const container = document.getElementById("prestationsContainer");
  if (!container) return;

  const line = document.createElement("div");
  line.className = "prestation-line prestation-detail-line";
  line.id = "prestation-" + prestationCount;
  line.dataset.kind = "detail_line";
  line.dataset.isDetail = "1";
  line.dataset.detail = "";
  line.dataset.basePrice = "0";
  line.dataset.autoPrice = "0";

  line.innerHTML = `
    <div class="form-group" style="grid-column: 1 / -1;">
      <label>Ligne détail incluse</label>
      <input
        type="text"
        class="prestation-desc"
        placeholder="Ex : Récupération et traitement des fluides frigorigènes"
        onchange="calculateTotals()"
      />
      <input type="hidden" class="prestation-qty" value="0">
      <input type="hidden" class="prestation-unit" value="">
      <input type="hidden" class="prestation-price" value="0">
      <span class="prestation-total" style="display:none;">0,00 €</span>
   <div class="form-group no-print prestation-remove-wrapper">
  <button
    type="button"
    class="btn-remove-line"
    onclick="removePrestation(${prestationCount})"
  >
    ✖ Supprimer cette ligne
  </button>
</div>
  `;

  container.appendChild(line);
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
  if (typeof _addDetailToggles === "function") _addDetailToggles();
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
    } else if (
      template.kind === "entretien_clim" ||
      template.kind === "piscine_chlore" ||
      template.kind === "piscine_sel" ||
      template.kind === "entretien_jacuzzi" ||
      template.kind === "hivernage_piscine" ||
      template.kind === "remise_service_propre" ||
      template.kind === "remise_service_piscine" ||
      template.kind === "vidange_jacuzzi" ||
      template.kind === "traitement_choc" ||
      template.kind === "changement_sable" ||
      template.kind === "remplacement_roulement" ||
      template.kind === "remplacement_pompe_mo" ||
      template.kind === "remplacement_cellule_mo" ||
      template.kind === "nettoyage_local" ||
      template.kind === "deplacement"
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

  // ═══════════════════════════════════════════════════════
  // 🎯 Lignes de détail automatiques
  // ═══════════════════════════════════════════════════════
  // 1) Supprimer les anciennes lignes de détail déjà injectées après cette ligne
  let _next = line.nextElementSibling;
  while (_next && _next.dataset.isDetail === "1" && _next.dataset.autoInjected === "1") {
    const _toRemove = _next;
    _next = _next.nextElementSibling;
    _toRemove.remove();
  }

  // 2) Injecter les nouvelles lignes si le template en a
  if (Array.isArray(template.detailLines) && template.detailLines.length > 0) {
    let _insertAfter = line;
    template.detailLines.forEach((text) => {
      prestationCount++;
      const _id   = prestationCount;
      const _dl   = document.createElement("div");
      _dl.className       = "prestation-line prestation-detail-line";
      _dl.id              = "prestation-" + _id;
      _dl.dataset.kind    = "detail_line";
      _dl.dataset.isDetail      = "1";
      _dl.dataset.autoInjected  = "1";   // marqueur pour savoir qu'on peut les supprimer/remplacer
      _dl.dataset.detail        = "";
      _dl.dataset.basePrice     = "0";
      _dl.dataset.autoPrice     = "0";
      _dl.innerHTML = `
        <div class="form-group" style="grid-column: 1 / -1;">
          <label>Ligne détail incluse</label>
          <input type="text" class="prestation-desc"
                 value="${text.replace(/"/g, "&quot;")}"
                 onchange="calculateTotals()" />
          <input type="hidden" class="prestation-qty"   value="0">
          <input type="hidden" class="prestation-unit"  value="">
          <input type="hidden" class="prestation-price" value="0">
          <span class="prestation-total" style="display:none;">0,00 €</span>
          <div class="form-group no-print prestation-remove-wrapper">
            <button type="button" class="btn-remove-line"
                    onclick="removePrestation(${_id})">✖ Supprimer cette ligne</button>
          </div>
        </div>`;
      _insertAfter.insertAdjacentElement("afterend", _dl);
      _insertAfter = _dl;
    });
  }

  // Ajoute le bouton de repli des lignes de détail
  _addDetailToggles();
} // <- fin de applyTemplate

// ═══════════════════════════════════════════════════════════
// #4 Repli / dépli des lignes de détail dans le formulaire
// ═══════════════════════════════════════════════════════════
function _addDetailToggles() {
  const container = document.getElementById("prestationsContainer");
  if (!container) return;

  // Nettoyer les anciens boutons (on reconstruit proprement)
  container.querySelectorAll(".detail-toggle-btn").forEach((b) => b.remove());

  const mainLines = Array.from(container.children).filter(
    (el) =>
      el.classList &&
      el.classList.contains("prestation-line") &&
      !el.classList.contains("prestation-detail-line"),
  );

  mainLines.forEach((line) => {
    // Collecter les lignes de détail qui suivent immédiatement
    const details = [];
    let next = line.nextElementSibling;
    while (
      next &&
      next.classList &&
      next.classList.contains("prestation-detail-line")
    ) {
      details.push(next);
      next = next.nextElementSibling;
    }
    if (details.length === 0) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "detail-toggle-btn no-print";

    const setLabel = (collapsed) => {
      btn.textContent = collapsed
        ? `▸ Afficher les ${details.length} lignes de détail`
        : "▾ Masquer les détails";
    };
    setLabel(false);

    btn.addEventListener("click", () => {
      const willCollapse = !details[0].classList.contains("detail-collapsed");
      details.forEach((d) => d.classList.toggle("detail-collapsed", willCollapse));
      setLabel(willCollapse);
    });

    line.insertAdjacentElement("afterend", btn);
  });
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

      // Libellé au pluriel — uniquement si le texte est vide ou le libellé auto
      // (on préserve un texte personnalisé tapé par l'utilisateur)
      if (descInput) {
        const cur = (descInput.value || "").trim().toLowerCase();
        const isAuto =
          cur === "" ||
          cur === "entretien climatisation" ||
          cur === "entretien climatisations";
        if (isAuto) {
          const plural = n >= 2 ? "s" : "";
          descInput.value = "Entretien climatisation" + plural;
        }
      }

      const clientType = getCurrentClientType();

      if (autoPrice) {
        // Prix de base = prix pour 1 clim (issu des tarifs persos ou de la saisie)
        let base = parseFloat(line.dataset.basePrice) || 0;

        // Sécurité : si base pas défini, on met un défaut logique
        if (!base) {
          base = clientType === "syndic" ? 120 : 100;
        }

        // 💰 Grille dégressive : 1 clim = 100€, 2 clims = 90€/u, 3+ = 80€/u
        if (clientType === "particulier") {
          if (n === 1) {
            price = base;          // 100 €
          } else if (n === 2) {
            price = base * 0.9;    // 90 € par clim
          } else {
            price = base * 0.8;    // 80 € par clim
          }
        } else {
          // Grille syndic (proportionnelle)
          if (n === 1) {
            price = base;
          } else if (n === 2) {
            price = base * 0.9;
          } else {
            price = base * 0.8;
          }
        }

        // Arrondi au multiple de 5 € supérieur
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

  // 🔻 Total collant en bas du formulaire
  _updateStickyTotal(formatEuro(totalTTC));
}

// Crée/maj le bandeau de total collant, visible quand on remplit un devis/facture
function _updateStickyTotal(amountText) {
  let bar = document.getElementById("formStickyTotal");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "formStickyTotal";
    bar.innerHTML =
      `<span class="fst-label">Total à payer</span>` +
      `<span class="fst-amount">0,00 €</span>`;
    document.body.appendChild(bar);
  }
  const amtEl = bar.querySelector(".fst-amount");
  if (amtEl) amtEl.textContent = amountText;

  // Visible uniquement quand le formulaire devis/facture est affiché
  const fv = document.getElementById("formView");
  const visible = fv && !fv.classList.contains("hidden");
  bar.classList.toggle("visible", !!visible);
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

// Affiche le bloc "Lieu d'intervention" si agence OU si case "adresse différente" cochée
function _updateSiteBlockVisibility() {
  const siteBlock = document.getElementById("siteBlock");
  if (!siteBlock) return;
  const isAgence = document.getElementById("clientSyndic")?.checked || false;
  const diff = document.getElementById("diffSiteAddress")?.checked || false;
  siteBlock.style.display = (isAgence || diff) ? "block" : "none";
}

// Case "Adresse d'intervention différente" (particuliers)
function toggleSiteAddress() {
  const cb = document.getElementById("diffSiteAddress");
  const siteNameInp = document.getElementById("siteName");
  const siteAddrInp = document.getElementById("siteAddress");
  // Si on décoche → on vide les champs chantier (sauf agence)
  const isAgence = document.getElementById("clientSyndic")?.checked || false;
  if (cb && !cb.checked && !isAgence) {
    if (siteNameInp) siteNameInp.value = "";
    if (siteAddrInp) siteAddrInp.value = "";
  }
  _updateSiteBlockVisibility();
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
  // 🔒 Demande confirmation si des modifs sont en cours
  if (_formDirty && _isAnyFormVisible()) {
    showConfirmDialog({
      title: "Modifications non sauvegardées",
      message: "Tu as des modifications non enregistrées.\nCréer un nouveau document sans sauvegarder ?",
      confirmLabel: "Nouveau sans sauvegarder",
      cancelLabel: "Rester",
      variant: "danger",
      icon: "⚠️",
      onConfirm: () => { _clearFormDirty(); newDocument(type); },
    });
    return;
  }
  _clearFormDirty();
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
  const _diffReset = document.getElementById("diffSiteAddress");
  if (_diffReset) _diffReset.checked = false;

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
  // 🔒 Demande confirmation si des modifs sont en cours
  if (_formDirty && _isAnyFormVisible()) {
    showConfirmDialog({
      title: "Modifications non sauvegardées",
      message: "Tu as des modifications non enregistrées.\nOuvrir un autre document sans sauvegarder ?",
      confirmLabel: "Ouvrir sans sauvegarder",
      cancelLabel: "Rester",
      variant: "danger",
      icon: "⚠️",
      onConfirm: () => { _clearFormDirty(); loadDocument(id); },
    });
    return;
  }

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

  // 📍 Cocher la case "adresse différente" si une adresse d'intervention est enregistrée
  const _diffCb = document.getElementById("diffSiteAddress");
  const _hasSite = !!(doc.siteAddress || doc.siteName);
  if (_diffCb) _diffCb.checked = _hasSite && doc.conditionsType !== "agence";

  if (siteBlock) {
    siteBlock.style.display =
      (doc.conditionsType === "agence" || _hasSite) ? "block" : "none";
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
  const isDetail =
    p.isDetail === true ||
    p.kind === "detail_line";

  if (isDetail) {
    addDetailLine();

    const lines = document.querySelectorAll(".prestation-line");
    const line = lines[lines.length - 1];

    line.classList.add("prestation-detail-line");
    line.dataset.kind = "detail_line";
    line.dataset.isDetail = "1";
    line.dataset.detail = "";

    const descInput = line.querySelector(".prestation-desc");
    if (descInput) descInput.value = p.desc || "";

    return;
  }

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

    // ✅ CORRECTIF : basePrice = prix réellement sauvegardé, pas le prix du template
    // (évite que rouvrir une facture remette le prix par défaut du modèle)
    line.dataset.basePrice = Number(p.price || 0).toFixed(2);

    // 🔧 CLIM : on conserve le prix sauvegardé tel quel à la réouverture.
    //    Sinon la grille dégressive se ré-applique par-dessus un prix déjà dégressif
    //    et fait baisser le prix de 5 € à chaque ouverture.
    if ((p.kind || "") === "entretien_clim") {
      line.dataset.autoPrice = "0";
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
  _addDetailToggles();
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
  // Document chargé → on repart de zéro (pas de modifs en attente)
  _clearFormDirty();
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
  // 1) Est-ce que c'est une ligne détail ?
  const isDetail =
    line.dataset.isDetail === "1" ||
    line.dataset.kind === "detail_line";

  // 2) kind robuste : dataset.kind OU kind du template sélectionné
  let kind = line.dataset.kind || "";
  const templateSelect = line.querySelector(".prestation-template");
  const tplIdx = templateSelect ? parseInt(templateSelect.value || "0", 10) : -1;
  const tpl =
    tplIdx >= 0 && PRESTATION_TEMPLATES[tplIdx]
      ? PRESTATION_TEMPLATES[tplIdx]
      : null;

  if (!kind && tpl && tpl.kind) kind = tpl.kind;
  if (isDetail) kind = "detail_line";

  // 3) champs de base
  let desc = line.querySelector(".prestation-desc")?.value?.trim() || "";

  const qty = isDetail ? 0 : _num(line.querySelector(".prestation-qty")?.value);
  const price = isDetail ? 0 : _num(line.querySelector(".prestation-price")?.value);
  const unit = isDetail ? "" : (line.querySelector(".prestation-unit")?.value || "");

  // 4) si desc vide, on met au minimum le label du modèle
  if (!desc && tpl && tpl.label && !isDetail) {
    desc = String(tpl.label).trim();
  }

  // 5) prix d’achat uniquement produits/fournitures
  const isProduct = !isDetail && (kind === "produits" || kind === "fournitures");
  const purchase = isProduct
    ? _num(line.querySelector(".prestation-purchase")?.value)
    : 0;

  if (isProduct) {
    if (!purchase || purchase <= 0) missingPurchase = true;
  }

// 6) sauvegarde
  if (desc) {
    prestations.push({
      desc,
      qty,
      price,
      total: isDetail ? 0 : qty * price,
      unit,
      kind,
      isDetail,
      purchase,
      detail: line.dataset.detail || "",   // ✅ AJOUT : description longue pour le PDF
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

const discountEnabled =
  document.getElementById("discountEnabled")?.checked || false;

const discountRate = discountEnabled
  ? _num(document.getElementById("discountPercentInput")?.value)
  : 0;

const discountAmount = subtotal * (discountRate / 100);
const subtotalAfterDiscount = subtotal - discountAmount;

const tvaAmount = subtotalAfterDiscount * (tvaRate / 100);
const totalTTC = subtotalAfterDiscount + tvaAmount;

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

    // ✅ Adresse du chantier / lieu d'intervention (le formulaire fait foi)
    siteCivility: document.getElementById("siteCivility")?.value || "",
    siteName: document.getElementById("siteName")?.value || "",
    siteAddress: document.getElementById("siteAddress")?.value || "",

    prestations,
    subtotal,
    discountRate,
    discountAmount,
    subtotalAfterDiscount,
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

    // ✅ BUGS 4 — Ces champs existaient sur le doc mais étaient écrasés à chaque save
    signature: existing?.signature || null,           // signature du client sur devis
    signatureDate: existing?.signatureDate || null,   // date de la signature
    contractId: existing?.contractId || null,         // lien vers un contrat
    history: existing?.history || [],                 // historique des modifications

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

  // ✅ Facture qui vient de passer PAYÉE via le formulaire → attestation clim auto
  //    (le même déclenchement existe déjà via les boutons de la liste / setPaymentMode)
  try {
    const _wasPaid = !!(existing && existing.paid);
    if (doc.type === "facture" && doc.paid && !_wasPaid &&
        typeof handleAfterInvoicePaid === "function") {
      handleAfterInvoicePaid(doc);
    }
  } catch (e) {}

  _clearFormDirty();

  const _typeLabel = doc.type === "devis" ? "Devis" : "Facture";
  showToast(`${_typeLabel} ${doc.number || ""} enregistré${doc.type === "facture" ? "e" : ""}`, "success");

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

      // 🔴 Fix : si le document supprimé est un devis lié à un ou plusieurs contrats,
      // on nettoie meta.sourceDevisId sur ces contrats pour éviter un blocage de facturation.
      if (doc.type === "devis") {
        const allContracts = (typeof getAllContracts === "function") ? getAllContracts() : [];
        const affected = allContracts.filter(c => c.meta?.sourceDevisId === id);
        if (affected.length > 0) {
          const updated = allContracts.map(c => {
            if (c.meta?.sourceDevisId !== id) return c;
            const newMeta = { ...c.meta };
            delete newMeta.sourceDevisId;
            delete newMeta.sourceDevisNumber;
            delete newMeta.sourceDevisStatus;
            return { ...c, meta: newMeta };
          });
          if (typeof saveContracts === "function") saveContracts(updated);
        }
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
  confirmIfDirty(() => {
    hideHealthCardsEverywhere();
    document.getElementById("formView").classList.add("hidden");
    document.getElementById("listView").classList.remove("hidden");
    const fst = document.getElementById("formStickyTotal");
    if (fst) fst.classList.remove("visible");
    currentDocumentId = null;
    resetTarifsPanel();
    loadYearFilter();
    loadDocumentsList();
    updateTransformButtonVisibility();
  });
}

function syncMicroTVAStatusWithCurrentCA() {
  return refreshMicroTVAState(false);
}


// =====================================
// 📊 CALCUL CA ANNUEL / MENSUEL
// =====================================

function computeCA() {
  const docs = getAllDocuments().filter((d) => d.type === "facture" && (d.date || d.paymentDate));

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // ✅ CA micro-entreprise = comptabilité de trésorerie
  // → uniquement les factures PAYÉES, classées par DATE DE PAIEMENT
  let totalPaidYear = 0;
  let monthTotal = 0;

  docs.forEach((f) => {
    if (!f.paid) return; // seules les factures encaissées comptent

    const amount = Number(f.totalTTC || 0);
    if (!amount) return;

    // Date de référence = date de paiement si connue, sinon date d'émission
    const refDate = (f.paymentDate || f.date || "").slice(0, 10);
    if (!refDate) return;

    if (refDate.startsWith(String(year))) {
      totalPaidYear += amount;

      if (refDate.startsWith(`${year}-${month}`)) {
        monthTotal += amount;
      }
    }
  });

  // Surveiller le seuil TVA micro
  if (typeof refreshMicroTVAState === "function") {
    refreshMicroTVAState(false);
  }

  // CA encaissé sur l'année en cours (comptabilité de trésorerie)
  return totalPaidYear;
}

// =====================================
// TVA MICRO-ENTREPRISE – SURVEILLANCE SEUIL
// =====================================

// Seuils légaux prestations de services (art. 293 B CGI) — valables 2023-2025
const MICRO_TVA_THRESHOLD_BASE      = 36800; // seuil de base
const MICRO_TVA_THRESHOLD_TOLERANCE = 39100; // seuil majoré (dépassement = TVA immédiate)
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

  let totalHT = 0;

  docs.forEach((f) => {
    // Micro-entreprise = CA ENCAISSÉ uniquement (comptabilité de trésorerie)
    if (!f.paid) return;

    // Date de paiement si présente, sinon date facture
    const refDate = f.paymentDate || f.date;
    const d = new Date(refDate + "T00:00:00");
    if (isNaN(d.getTime()) || d.getFullYear() !== currentYear) return;

    // Seuil TVA comparé au CA HT (art. 293 B CGI)
    const val = Number(f.subtotal || f.totalTTC || 0);
    if (!isNaN(val)) totalHT += val;
  });

  return { year: currentYear, caTTC: totalHT };
}

function computeYearCAForMicro(year) {
  const docs = getAllDocuments().filter(
    (d) => d.type === "facture" && (d.date || d.paymentDate)
  );

  let totalHT = 0;

  docs.forEach((f) => {
    if (!f.paid) return;

    const refDate = (f.paymentDate || f.date || "").slice(0, 10);
    if (!refDate) return;

    const d = new Date(refDate + "T00:00:00");
    if (isNaN(d.getTime()) || d.getFullYear() !== year) return;

    // Seuil TVA = CA HT encaissé
    const val = Number(f.subtotal || f.totalTTC || 0);
    if (!isNaN(val)) totalHT += val;
  });

  return totalHT;
}

function canReturnToFranchiseTVA() {
  const now = new Date();
  const y = now.getFullYear();

  // Retour franchise possible au 01/01/N si CA N-1 ET CA N-2 sont tous deux < seuil de base
  // (art. 293 B CGI : la franchise se réapplique l'année suivante si les 2 années précédentes
  //  sont sous le seuil de base)
  const caLastYear     = computeYearCAForMicro(y - 1);
  const caTwoYearsAgo  = computeYearCAForMicro(y - 2);

  const under2Years =
    caLastYear    < MICRO_TVA_THRESHOLD_BASE &&
    caTwoYearsAgo < MICRO_TVA_THRESHOLD_BASE;

  return {
    ok: under2Years,
    caThisYear: caLastYear,   // renommé pour l'affichage dans le dialog
    caLastYear: caTwoYearsAgo,
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

// Écran vide accueillant avec bouton d'action contextuel
function _buildEmptyStateHtml() {
  const type = (typeof currentListType !== "undefined" && currentListType) ? currentListType : "devis";

  let icon, title, sub, ctaLabel, ctaAction;
  if (type === "facture") {
    icon = "💰";
    title = "Aucune facture pour le moment";
    sub = "Crée ta première facture ou génère-la depuis un devis accepté.";
    ctaLabel = "+ Nouvelle facture";
    ctaAction = "newDocument('facture')";
  } else {
    icon = "📄";
    title = "Aucun devis pour le moment";
    sub = "Crée ton premier devis pour démarrer.";
    ctaLabel = "+ Nouveau devis";
    ctaAction = "newDocument('devis')";
  }

  return (
    `<div class="empty-state">` +
      `<div class="empty-icon">${icon}</div>` +
      `<div class="empty-title">${title}</div>` +
      `<div class="empty-sub">${sub}</div>` +
      `<button class="empty-cta" type="button" onclick="${ctaAction}">${ctaLabel}</button>` +
    `</div>`
  );
}

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
  const sortMode = sortSel ? sortSel.value : "payment_desc";

  filtered.sort((a, b) => {
    // 🔴 FACTURES : les impayées toujours en haut (ça saute aux yeux)
    if (currentListType === "facture") {
      const ua = a.paid ? 1 : 0;
      const ub = b.paid ? 1 : 0;
      if (ua !== ub) return ua - ub; // impayée (0) avant payée (1)
    }

    if (sortMode === "number_desc") {
      const na = (a.number || "").toString();
      const nb = (b.number || "").toString();
      // On compare en chaîne, mais comme tes numéros sont normalisés ça passe très bien
      return nb.localeCompare(na, "fr", { numeric: true });
    }

    if (sortMode === "payment_desc") {
      // Tri par date de paiement (factures payées d'abord, dans l'ordre d'encaissement).
      // Les non payées / sans date de paiement retombent sur la date d'émission.
      const keyA = (a.paid && a.paymentDate) ? a.paymentDate : (a.date || a.createdAt || "");
      const keyB = (b.paid && b.paymentDate) ? b.paymentDate : (b.date || b.createdAt || "");
      const da = keyA ? new Date(keyA) : new Date(0);
      const db = keyB ? new Date(keyB) : new Date(0);
      return db - da;
    }

    // défaut : date d'émission décroissante
    const da = a.date ? new Date(a.date) : new Date(a.createdAt || 0);
    const db = b.date ? new Date(b.date) : new Date(b.createdAt || 0);
    return db - da;
  });

  const tbody = document.getElementById("documentsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="7" class="no-docs-cell">${_buildEmptyStateHtml()}</td></tr>`;
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
      } else if (displayStatus === "realise") {
        badgeDevisClass = "badge-devis-realise";
        text = "Réalisé";
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
        `<option value="realise" ${
          storedStatus === "realise" ? "selected" : ""
        }>Réalisé</option>` +
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

    // ⚡ Actions rapides (sans ouvrir le document)
    const qaPaidBtn =
      doc.type === "facture"
        ? (doc.paid
            ? `<button class="qa-btn qa-unpaid" type="button" title="Marquer en attente"
                       onclick="quickMarkPaid('${doc.id}')">↩️ En attente</button>`
            : `<button class="qa-btn qa-paid" type="button" title="Marquer payée"
                       onclick="quickMarkPaid('${doc.id}')">💰 Payée</button>`)
        : "";

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
      `<div class="qa-row">
           <button class="qa-btn qa-email" type="button" title="Envoyer par email"
                   onclick="quickSendEmail('${doc.id}')">📧 Email</button>
           ${qaPaidBtn}
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

  // ── Rendu mobile (cartes) ──
  _renderMobileDocList(filtered);
}

/**
 * Génère une liste de cartes pour les petits écrans.
 * Appelé automatiquement depuis loadDocumentsList.
 */
function _renderMobileDocList(docs) {
  const container = document.getElementById("mobileDocList");
  if (!container) return;
  container.innerHTML = "";

  if (!docs || docs.length === 0) {
    container.innerHTML = _buildEmptyStateHtml();
    return;
  }

  docs.forEach(doc => {
    const isDevis   = doc.type === "devis";
    const isFacture = doc.type === "facture";

    // Badge statut
    let statusBadge = "";
    if (isDevis) {
      const st = doc.status || "en_attente";
      const stMap = { en_attente:"🟡 En attente", accepte:"🟢 Accepté", realise:"🟠 Réalisé", refuse:"🔴 Refusé", cloture:"⚫ Clôturé", expire:"⚠️ Expiré" };
      statusBadge = stMap[st] || st;
    } else if (isFacture) {
      statusBadge = doc.paid ? "🟢 Payée" : (doc.paidLate ? "🔴 En retard" : "🟡 En attente");
    }

    const dateText = doc.date ? new Date(doc.date).toLocaleDateString("fr-FR", {day:"2-digit",month:"short",year:"numeric"}) : "";
    const clientName = escapeHtml(doc.client?.name || "—");
    const num = escapeHtml(doc.number || "");
    const subject = escapeHtml(doc.subject || "");
    const amount = formatEuro(doc.totalTTC);
    const typeIcon = isDevis ? "📄" : "💰";
    const typeLabel = isDevis ? "Devis" : "Facture";

    // Couleur carte selon statut
    let borderColor = "#e2ecf8";
    if (isFacture && doc.paid) borderColor = "#c6f6d5";
    else if (isFacture && !doc.paid) borderColor = "#fed7d7";

    // Sélecteur de mode de paiement (factures uniquement)
    let payRow = "";
    if (isFacture) {
      const mode = doc.paymentMode || "";
      const opt = (val, label) =>
        `<option value="${val}" ${mode === val ? "selected" : ""}>${label}</option>`;
      payRow = `
      <div class="mdoc-pay">
        <span class="mdoc-pay-label">💳 Règlement</span>
        <select class="mdoc-pay-select ${doc.paid ? "is-paid" : "is-unpaid"}"
                onchange="setPaymentMode('${doc.id}', this.value)">
          ${opt("", "Non réglée")}
          ${opt("especes", "Espèces")}
          ${opt("cb", "CB")}
          ${opt("virement", "Virement")}
          ${opt("cheque", "Chèque")}
        </select>
      </div>`;
    }

    const card = document.createElement("div");
    card.className = "mdoc-card";
    card.style.borderLeftColor = borderColor;
    card.style.borderLeftWidth = "4px";
    card.innerHTML = `
      <div class="mdoc-top">
        <div class="mdoc-num">${typeIcon} ${num}</div>
        <div class="mdoc-amount">${amount}</div>
      </div>
      <div class="mdoc-client">${clientName}</div>
      <div class="mdoc-meta">
        <span>📅 ${dateText}</span>
        ${subject ? `<span>· ${subject}</span>` : ""}
        <span>· ${statusBadge}</span>
      </div>
      ${payRow}
      <div class="mdoc-actions">
        <button class="btn btn-primary btn-small" onclick="loadDocument('${doc.id}')">✏️ Modifier</button>
        <button class="btn btn-secondary btn-small" onclick="openPrintable('${doc.id}', true)">👁 Aperçu</button>
        <button class="btn btn-success btn-small" onclick="openPrintable('${doc.id}')">🖨 Imprimer</button>
        <button class="qa-btn qa-email" onclick="quickSendEmail('${doc.id}')">📧 Email</button>
        <button class="btn btn-danger btn-small" onclick="deleteDocument('${doc.id}')">🗑</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function loadAttestationsList() {
  const tbody = document.getElementById("attestationsTableBody");
  if (!tbody) return;

  let list = getAllAttestations()
    .slice()
    .sort((a, b) => {
      const ad = a.date || "";
      const bd = b.date || "";
      return ad.localeCompare(bd);
    });

  // ── Migration : assign ATT numbers to old attestations that lack one ──
  const needsNumber = list.filter(a => !a.numero);
  if (needsNumber.length > 0) {
    // Collect already-used ATT numbers so we don't collide
    const usedNumbers = new Set(list.filter(a => a.numero).map(a => a.numero));
    // Assign sequential numbers per year (use date year if available, else current year)
    // Build a counter per year
    const yearCounters = {};
    usedNumbers.forEach(n => {
      const m = n.match(/ATT-(\d{4})-(\d+)/);
      if (m) {
        const y = +m[1], seq = +m[2];
        yearCounters[y] = Math.max(yearCounters[y] || 0, seq);
      }
    });
    needsNumber.forEach(att => {
      const y = att.date ? +att.date.slice(0, 4) : new Date().getFullYear();
      yearCounters[y] = (yearCounters[y] || 0) + 1;
      att.numero = `ATT-${y}-${String(yearCounters[y]).padStart(3, "0")}`;
    });
    saveAttestations(list);
    // Sync migrated records to Firestore if online
    if (db && navigator.onLine) {
      needsNumber.forEach(att => {
        db.collection("attestations").doc(att.id).set(att, { merge: true }).catch(() => {});
      });
    }
  }

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

  const rows = list.map((att) => {
    const frDate = att.date ? att.date.split("-").reverse().join("/") : "";
    const units  = att.units != null ? att.units : "";
    const numero = escapeHtml(att.numero || "–");
    const name   = escapeHtml(att.clientName || "");
    const addr   = escapeHtml(att.clientAddress || "");
    const id     = escapeHtml(att.id);
    const factureLink = att.sourceDocNumber
      ? `<br><span style="font-size:11px;color:#1565c0;font-weight:500;">→ ${escapeHtml(att.sourceDocNumber)}</span>`
      : "";
    return `<tr>
      <td><strong>${numero}</strong>${factureLink}</td>
      <td>${frDate}</td>
      <td>${name}</td>
      <td>${addr}</td>
      <td>${units}</td>
      <td class="col-actions">
        <button class="btn btn-small btn-primary" onclick="openAttestationPopupForEdit('${id}')">Ouvrir</button>
        <button class="btn btn-small btn-secondary" onclick="openAttestationPreview('${id}')">Aperçu</button>
        <button class="btn btn-small btn-success" onclick="printAttestation('${id}')">Imprimer</button>
        <button class="btn btn-danger btn-small" onclick="deleteAttestation('${id}')">Supprimer</button>
      </td>
    </tr>`;
  });
  tbody.innerHTML = rows.join("");
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

  // 1) On ouvre/réinitialise le formulaire D'ABORD (il vide tous les champs)
  openClimAttestationGenerator();

  // 2) PUIS on mémorise la facture source (après le reset, sinon il serait effacé)
  currentAttestationSource = {
    id: doc.id || null,
    number: doc.number || null,
  };

  // 3) Et on pré-remplit les champs (après le reset, sinon ils seraient vidés)
  const attName = document.getElementById("attClientName");
  const attAddr = document.getElementById("attClientAddress");
  const attDate = document.getElementById("attDate");
  const attUnits = document.getElementById("attUnits");
  const attNext = document.getElementById("attNextService");

  if (attName) attName.value = (doc.client && doc.client.name) || "";
  if (attAddr) attAddr.value = (doc.client && doc.client.address) || "";
  const _attDate = doc.date || new Date().toISOString().slice(0, 10);
  if (attDate) attDate.value = _attDate;
  if (attNext && typeof _addOneYearISO === "function") attNext.value = _addOneYearISO(_attDate);
  if (attUnits) attUnits.value = 1;
}

// Utilisé par Aperçu / Imprimer
function _pdfDrawCheckbox(doc, x, y, checked) {
  const size = 3.5;
  const top = y - size + 0.5;
  if (checked) {
    doc.setFillColor(25, 118, 210);
    doc.setDrawColor(25, 118, 210);
    doc.rect(x, top, size, size, "FD");
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.55);
    doc.line(x + 0.6, top + size / 2, x + size / 2, top + size - 0.7);
    doc.line(x + size / 2, top + size - 0.7, x + size - 0.5, top + 0.6);
  } else {
    doc.setDrawColor(170, 170, 170);
    doc.setLineWidth(0.35);
    doc.rect(x, top, size, size);
  }
  doc.setLineWidth(0.2);
}

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

  // Badge "ATTESTATION D'ENTRETIEN / CLIMATISATION" en haut à droite
  const pageWidth = doc.internal.pageSize.getWidth();
  const pillW = 90;
  const pillH = 16;
  const pillRight = 10;
  const pillY = 7;
  const pillX = pageWidth - pillRight - pillW;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.roundedRect(pillX, pillY, pillW, pillH, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(blue.r, blue.g, blue.b);
  doc.text("ATTESTATION D'ENTRETIEN", pillX + pillW / 2, pillY + 6, { align: "center" });
  doc.text("CLIMATISATION", pillX + pillW / 2, pillY + 12, { align: "center" });

  // Numéro d'attestation sous le badge
  if (record.numero) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("N° " + record.numero, pillX + pillW / 2, pillY + 22, { align: "center" });
  }

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
  doc.text("Unités entretenues : " + (record.units != null ? record.units : 1), card2X + 5, interY);
  interY += 5;
  if (record.equipBrand || record.equipModel) {
    const equip = [record.equipBrand, record.equipModel].filter(Boolean).join(" – ");
    doc.text("Équipement : " + equip, card2X + 5, interY);
  }

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

  const ops = (record.ops && record.ops.length)
    ? record.ops
    : ATT_DEFAULT_OPS.map(l => ({ label: l, checked: true }));

  const doneOps  = ops.filter(o => o.checked);
  const skipped  = ops.filter(o => !o.checked);

  doneOps.forEach((op) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setTextColor(0, 0, 0);
    _pdfDrawCheckbox(doc, margin, y, true);
    doc.text(op.label, margin + 6, y);
    y += 5;
  });

  if (skipped.length) {
    y += 2;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(130, 130, 130);
    skipped.forEach(op => {
      if (y > 275) { doc.addPage(); y = 20; }
      _pdfDrawCheckbox(doc, margin, y, false);
      doc.text(op.label + " (non effectué)", margin + 6, y);
      y += 4.5;
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  }

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

  /* ================= PROCHAIN ENTRETIEN ================= */

  const attNextSvc = record.nextService ||
    (typeof _addOneYearISO === "function" ? _addOneYearISO(record.date) : "");

  if (attNextSvc) {
    y += 10;
    if (y > 265) { doc.addPage(); y = 20; }
    const frNext = attNextSvc.split("-").reverse().join("/");
    doc.setFillColor(232, 245, 255);
    doc.setDrawColor(26, 116, 217);
    doc.roundedRect(margin, y - 5, 210 - 2 * margin, 14, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(blue.r, blue.g, blue.b);
    doc.text("Prochain entretien recommande : " + frNext, margin + 4, y + 4);
    y += 16;
  }

  /* ================= SIGNATURE + FORMULE FINALE ================= */

  if (y < 250) y = 250;

  // Zone signature technicien
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + 60, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text("Signature du technicien", margin, y + 4);

  const attSig = localStorage.getItem("companySignature");
  if (attSig) {
    try { doc.addImage(attSig, "PNG", margin, y - 14, 50, 14); } catch(e) {}
  }

  const dateSign = record.date ? record.date.split("-").reverse().join("/") : new Date().toLocaleDateString("fr-FR");
  doc.text("Fait le " + dateSign + " – " + (company.legalName || "AquaClim Prestige"), margin, y + 10);

  if (y < 280) y = 280;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text("Entretien effectué conformément aux préconisations du fabricant. Fait pour servir et valoir ce que de droit.", margin, y);

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
    if (devisStatus === "accepte" || devisStatus === "accepted" || devisStatus === "realise") {
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

  // 🔧 Migration : attribuer un vrai numéro CTR aux contrats qui n'en ont pas
  // (anciens contrats qui n'affichaient qu'une réf client ou un numéro de devis)
  // Compteurs locaux par année pour éviter les doublons pendant la boucle.
  const _counters = {};
  contracts.forEach((c) => {
    const m = String(c.number || "").match(/^CTR-(\d{4})-(\d{3})$/);
    if (m) _counters[m[1]] = Math.max(_counters[m[1]] || 0, parseInt(m[2], 10));
  });
  let _migrated = false;
  contracts.forEach((c) => {
    if (!c.number || !/^CTR-\d{4}-\d{3}$/.test(String(c.number))) {
      const y = (c.pricing?.startDate || c.createdAt || "").slice(0, 4) ||
                String(new Date().getFullYear());
      _counters[y] = (_counters[y] || 0) + 1;
      c.number = `CTR-${y}-${String(_counters[y]).padStart(3, "0")}`;
      _migrated = true;
    }
  });
  if (_migrated) {
    saveContracts(contracts);
    if (typeof saveSingleContractToFirestore === "function") {
      contracts.forEach((c) => { try { saveSingleContractToFirestore(c); } catch (e) {} });
    }
  }

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

    // ✅ On affiche le VRAI numéro de contrat (c.number), pas l'ancienne réf client
    const ref = c.number || c.client?.reference || "";
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

  // 📱 Rendu mobile (cartes) — sinon sur iPhone on garde les cartes devis/factures
  _renderMobileContractsList(filtered);
}

// Rendu des contrats en cartes pour iPhone / petits écrans
function _renderMobileContractsList(contracts) {
  const container = document.getElementById("mobileDocList");
  if (!container) return;
  container.innerHTML = "";

  if (!contracts || contracts.length === 0) {
    container.innerHTML =
      `<div class="empty-state">` +
        `<div class="empty-icon">📘</div>` +
        `<div class="empty-title">Aucun contrat</div>` +
        `<div class="empty-sub">Crée ton premier contrat d'entretien.</div>` +
        `<button class="empty-cta" type="button" onclick="newContract()">+ Nouveau contrat</button>` +
      `</div>`;
    return;
  }

  const STAT = {
    [CONTRACT_STATUS.EN_COURS]:     "🟢 En cours",
    [CONTRACT_STATUS.A_RENOUVELER]: "🟠 À renouveler",
    [CONTRACT_STATUS.RESILIE]:      "🔴 Résilié",
    [CONTRACT_STATUS.TERMINE]:      "⚫ Terminé",
  };

  contracts.forEach((c) => {
    const num        = escapeHtml(c.number || c.client?.reference || c.id || "");
    const clientName = escapeHtml(c.client?.name || "—");
    const title      = escapeHtml(getContractListTitle(c) || "");
    const startFR    = c.pricing?.startDate ? formatDateFr(c.pricing.startDate) : "";
    const total      = formatEuro(c.pricing?.totalHT != null ? c.pricing.totalHT : 0);
    const st         = computeContractStatus(c);
    const signed     = (typeof isContractSigned === "function") ? isContractSigned(c) : true;
    const statusTxt  = !signed ? "🟡 En attente signature" : (STAT[st] || "");

    const card = document.createElement("div");
    card.className = "mdoc-card";
    card.style.borderLeftColor = "#4f46e5"; // indigo (couleur contrats)
    card.style.borderLeftWidth = "4px";
    card.innerHTML = `
      <div class="mdoc-top">
        <div class="mdoc-num">📘 ${num}</div>
        <div class="mdoc-amount">${total}</div>
      </div>
      <div class="mdoc-client">${clientName}</div>
      <div class="mdoc-meta">
        ${startFR ? `<span>📅 ${startFR}</span>` : ""}
        ${title ? `<span>· ${title}</span>` : ""}
        ${statusTxt ? `<span>· ${statusTxt}</span>` : ""}
      </div>
      <div class="mdoc-actions">
        <button class="btn btn-primary btn-small" onclick="openContractFromList('${c.id}')">✏️ Modifier</button>
        <button class="btn btn-secondary btn-small" onclick="previewContractFromList('${c.id}')">👁 Aperçu</button>
        <button class="btn btn-success btn-small" onclick="printContractFromList('${c.id}')">🖨 Imprimer</button>
        <button class="qa-btn qa-paid" onclick="transformContractFromList('${c.id}')">💶 Facturer</button>
        <button class="btn btn-danger btn-small" onclick="deleteContractFromList('${c.id}')">🗑</button>
      </div>
    `;
    container.appendChild(card);
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

    // 2) On regarde aussi l'objet et les libellés (clim / climatisation / PAC / pompe à chaleur)
    const hay = (
      (doc.subject || "") + " " +
      (Array.isArray(doc.prestations) ? doc.prestations.map((p) => p && p.desc || "").join(" ") : "")
    ).toLowerCase();
    const looksLikeClim =
      hay.includes("clim") ||
      hay.includes("climatisation") ||
      /\bpac\b/.test(hay) ||
      hay.includes("pompe à chaleur") ||
      hay.includes("pompe a chaleur");

    // 3) Facture issue d'un contrat CLIM
    let contractIsClim = false;
    if (doc.contractId && typeof getContract === "function") {
      const c = getContract(doc.contractId);
      contractIsClim = (c?.pricing?.mainService || c?.pool?.type || "") === "entretien_clim";
    }

    // ❌ Si ce n’est pas une facture de clim → on ne fait rien
    if (!hasClimKind && !looksLikeClim && !contractIsClim) {
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
function createInvoiceFromDevis(devis, dateOverride) {
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
    date: (dateOverride && dateOverride.length === 10) ? dateOverride : todayISO,
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
function transformToInvoice() {
  if (!currentDocumentId) return;

  const docs = getAllDocuments();
  const devis = docs.find(d => d.id === currentDocumentId && d.type === "devis");
  if (!devis) return;

  // Garde anti-doublon : une facture existe déjà pour ce devis
  const existing = docs.find(d => d.type === "facture" && d.sourceDevisId === devis.id);
  if (existing) {
    showConfirmDialog({
      title: "Facture déjà créée",
      message: `Une facture (${existing.number}) a déjà été générée à partir de ce devis. Voulez-vous l'ouvrir ?`,
      confirmLabel: "Ouvrir la facture",
      cancelLabel: "Annuler",
      variant: "info",
      icon: "ℹ️",
      onConfirm: () => loadDocument(existing.id),
    });
    return;
  }

  showConfirmDialog({
    title: "Transformer en facture",
    message: `Voulez-vous transformer le devis ${devis.number} en facture ?\nLe devis sera clôturé.`,
    confirmLabel: "Transformer",
    cancelLabel: "Annuler",
    variant: "success",
    icon: "🔁",
    onConfirm: () => {
      const invoice = createInvoiceFromDevis(devis);
      if (!invoice) return;
      setDevisStatus(devis.id, "cloture");
      if (typeof refreshHomeStats === "function") refreshHomeStats();
      if (typeof loadDocumentsList === "function") loadDocumentsList();
      loadDocument(invoice.id);
    },
  });
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
    // Passage NON PAYÉ → PAYÉ → devis clôturé
    if (!wasPaid && doc.paid) {
      setDevisStatus(doc.sourceDevisId, "cloture");
    }

    // Passage PAYÉ → NON PAYÉ → retour en "réalisé" (travail fait, pas encore encaissé)
    if (wasPaid && !doc.paid) {
      setDevisStatus(doc.sourceDevisId, "realise");
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

  // 🔔 Retour visuel
  if (typeof showToast === "function") {
    if (!wasPaid && doc.paid) {
      showToast(`Facture ${doc.number || ""} marquée payée`, "success");
    } else if (wasPaid && !doc.paid) {
      showToast(`Facture ${doc.number || ""} remise en attente`, "info");
    }
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

    // 🟥 CAS 2 : aucun contrat lié → on n'émet plus la facture ici.
    //    La facture sera générée quand le devis passe à "Réalisé".
  }

  // 3b) Passage à "réalisé" → popup date + génération de la facture
  if (status === "realise" && oldStatus !== "realise") {
    const linkedContracts =
      (typeof getAllContracts === "function" ? getAllContracts() : [])
        .filter((c) => c.meta && c.meta.sourceDevisId === doc.id);

    // Les devis liés à un contrat ne génèrent pas de facture directe ici
    if (linkedContracts.length === 0 && typeof createInvoiceFromDevis === "function") {
      // Anti-doublon : une facture existe déjà pour ce devis ?
      const existingFac = getAllDocuments().find(
        (d) => d.type === "facture" && d.sourceDevisId === doc.id,
      );

      if (existingFac) {
        showConfirmDialog({
          title: "Facture déjà existante",
          message: `La facture ${existingFac.number} a déjà été générée pour ce devis. Aucune nouvelle facture créée.`,
          confirmLabel: "OK",
          cancelLabel: "",
          variant: "info",
          icon: "ℹ️",
        });
      } else {
        const todayISO = new Date().toISOString().slice(0, 10);
        showDatePickerDialog({
          title: "✅ Devis réalisé",
          message: `Date de réalisation pour le devis ${doc.number || ""} :`,
          defaultDate: todayISO,
          confirmLabel: "Générer la facture",
          onConfirm: (dateChoisie) => {
            const facture = createInvoiceFromDevis(doc, dateChoisie);
            if (facture) {
              if (typeof loadDocumentsList === "function") loadDocumentsList();
              if (typeof refreshHomeStats === "function") refreshHomeStats();
              const dateFR = new Date(dateChoisie + "T00:00:00").toLocaleDateString("fr-FR");
              showToast(`Facture ${facture.number} générée (${dateFR})`, "success");
            }
          },
          onCancel: () => {
            // Annulé → on remet en "accepte"
            setDevisStatus(id, "accepte");
          },
        });
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

// ═══════════════════════════════════════════════════════════
// FACTUR-X — Génération du fichier de données (XML CII / EN 16931, profil BASIC)
// ═══════════════════════════════════════════════════════════

function _fxEsc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function _fxNum(v) {
  const n = Number(v || 0);
  return (isFinite(n) ? n : 0).toFixed(2);
}
// Découpe une adresse française "12 rue X, 06000 Nice" → { line, cp, ville }
function _fxParseAddress(addr) {
  const raw = String(addr || "").trim();
  const m = raw.match(/(\d{5})\s+(.+)$/);
  if (m) {
    const cp = m[1];
    const ville = m[2].replace(/[,;]+$/, "").trim();
    let line = raw.slice(0, m.index).replace(/[,;]\s*$/, "").trim();
    if (!line) line = raw;
    return { line, cp, ville };
  }
  return { line: raw || "—", cp: "", ville: raw || "—" };
}

function generateFacturXXML(doc) {
  const cs = (typeof getCompanySettings === "function") ? getCompanySettings() : {};

  const dateISO = (doc.date || "").slice(0, 10).replace(/-/g, ""); // YYYYMMDD (format 102)
  const ht  = Number(doc.subtotal || 0);
  const tva = Number(doc.tvaAmount || 0);
  const ttc = Number(doc.totalTTC || (ht + tva));
  const rate = Number(doc.tvaRate || 0);

  // Catégorie TVA : franchise en base (0 %) = "E" (exonéré) ; sinon "S" (taux normal)
  const isFranchise = rate === 0;
  const taxCat = isFranchise ? "E" : "S";
  const exemptReason = isFranchise ? "TVA non applicable, art. 293 B du CGI" : "";

  // Vendeur (toi)
  const sellerSiret = String(cs.siret || "").replace(/\s/g, "");
  const sellerAddr = _fxParseAddress(cs.address);

  // Acheteur (client)
  const buyer = doc.client || {};
  const buyerAddr = _fxParseAddress(buyer.address);
  // SIRET client : sur le doc si présent, sinon depuis la fiche client
  let buyerSiret = String(buyer.siret || "").replace(/\s/g, "");
  if (!buyerSiret && buyer.name && typeof _getClientByName === "function") {
    const _bc = _getClientByName(buyer.name);
    if (_bc && _bc.siret) buyerSiret = String(_bc.siret).replace(/\s/g, "");
  }
  const buyerLegalXml = buyerSiret
    ? `
        <ram:SpecifiedLegalOrganization>
          <ram:ID schemeID="0002">${_fxEsc(buyerSiret)}</ram:ID>
        </ram:SpecifiedLegalOrganization>`
    : "";

  // Lignes (on exclut les lignes de détail)
  const prest = (Array.isArray(doc.prestations) ? doc.prestations : [])
    .filter((p) => p && !p.isDetail && p.kind !== "detail_line");

  let lineXml = "";
  prest.forEach((p, i) => {
    const qty = Number(p.qty || 0) || 0;
    const price = Number(p.price || 0) || 0;
    const lineTotal = Number(p.total != null ? p.total : qty * price) || 0;
    lineXml += `
    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument>
        <ram:LineID>${i + 1}</ram:LineID>
      </ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct>
        <ram:Name>${_fxEsc(p.desc || "Prestation")}</ram:Name>
      </ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement>
        <ram:NetPriceProductTradePrice>
          <ram:ChargeAmount>${_fxNum(price)}</ram:ChargeAmount>
        </ram:NetPriceProductTradePrice>
      </ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery>
        <ram:BilledQuantity unitCode="C62">${qty}</ram:BilledQuantity>
      </ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax>
          <ram:TypeCode>VAT</ram:TypeCode>
          <ram:CategoryCode>${taxCat}</ram:CategoryCode>
          <ram:RateApplicablePercent>${_fxNum(rate)}</ram:RateApplicablePercent>
        </ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation>
          <ram:LineTotalAmount>${_fxNum(lineTotal)}</ram:LineTotalAmount>
        </ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`;
  });

  const sellerVatXml = cs.vatNumber
    ? `
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">${_fxEsc(cs.vatNumber)}</ram:ID>
        </ram:SpecifiedTaxRegistration>`
    : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:basic</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>${_fxEsc(doc.number || "")}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${dateISO}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>${lineXml}
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${_fxEsc(cs.legalName || cs.companyName || "")}</ram:Name>
        <ram:SpecifiedLegalOrganization>
          <ram:ID schemeID="0002">${_fxEsc(sellerSiret)}</ram:ID>
        </ram:SpecifiedLegalOrganization>
        <ram:PostalTradeAddress>
          <ram:PostcodeCode>${_fxEsc(sellerAddr.cp)}</ram:PostcodeCode>
          <ram:LineOne>${_fxEsc(sellerAddr.line)}</ram:LineOne>
          <ram:CityName>${_fxEsc(sellerAddr.ville)}</ram:CityName>
          <ram:CountryID>FR</ram:CountryID>
        </ram:PostalTradeAddress>${sellerVatXml}
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${_fxEsc(buyer.name || "")}</ram:Name>${buyerLegalXml}
        <ram:PostalTradeAddress>
          <ram:PostcodeCode>${_fxEsc(buyerAddr.cp)}</ram:PostcodeCode>
          <ram:LineOne>${_fxEsc(buyerAddr.line)}</ram:LineOne>
          <ram:CityName>${_fxEsc(buyerAddr.ville)}</ram:CityName>
          <ram:CountryID>FR</ram:CountryID>
        </ram:PostalTradeAddress>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeDelivery/>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>
      <ram:ApplicableTradeTax>
        <ram:CalculatedAmount>${_fxNum(tva)}</ram:CalculatedAmount>
        <ram:TypeCode>VAT</ram:TypeCode>
        ${exemptReason ? `<ram:ExemptionReason>${_fxEsc(exemptReason)}</ram:ExemptionReason>` : ""}
        <ram:BasisAmount>${_fxNum(ht)}</ram:BasisAmount>
        <ram:CategoryCode>${taxCat}</ram:CategoryCode>
        <ram:RateApplicablePercent>${_fxNum(rate)}</ram:RateApplicablePercent>
      </ram:ApplicableTradeTax>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${_fxNum(ht)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${_fxNum(ht)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">${_fxNum(tva)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${_fxNum(ttc)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${_fxNum(ttc)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>`;

  return xml;
}

function exportFacturX(id) {
  const doc = id ? getDocument(id) : (currentDocumentId ? getDocument(currentDocumentId) : null);

  if (!doc) {
    showToast("Ouvre/enregistre d'abord une facture", "warning");
    return;
  }
  if (doc.type !== "facture") {
    showToast("Le Factur-X ne concerne que les factures", "info");
    return;
  }

  // Avertissement SIRET non renseigné
  const cs = (typeof getCompanySettings === "function") ? getCompanySettings() : {};
  const siret = String(cs.siret || "").replace(/\s/g, "");
  if (!siret || /x/i.test(siret) || siret.length < 9) {
    showConfirmDialog({
      title: "SIRET manquant",
      message: "Ton numéro SIRET n'est pas renseigné dans les paramètres.\n\nLe fichier Factur-X sera généré mais devra être complété avec ton vrai SIRET pour être valable. Continuer ?",
      confirmLabel: "Générer quand même",
      cancelLabel: "Annuler",
      variant: "warning",
      icon: "⚠️",
      onConfirm: () => _downloadFacturX(doc),
    });
    return;
  }
  _downloadFacturX(doc);
}

function _downloadFacturX(doc) {
  const xml = generateFacturXXML(doc);
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Factur-X_${(doc.number || "facture").replace(/[^\w-]/g, "_")}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showToast === "function") showToast("Fichier Factur-X généré", "success");
}

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
    // Masquer le tableau des devis/factures pendant l'édition des tarifs
    const docsCard = document.getElementById("documentsCard");
    if (docsCard) docsCard.classList.add("hidden");

    tbody.innerHTML = "";
    const custom = getCustomPrices();

    // Catégories pour les séparateurs visuels
    const TARIF_CATEGORIES = [
      { label: "❄️ Climatisation",     icon: "❄️", kinds: ["entretien_clim","depannage_clim"] },
      { label: "🏊 Piscine",           icon: "🏊", kinds: ["piscine_chlore","piscine_sel","hivernage_piscine","remise_service_propre","remise_service_piscine","traitement_choc","changement_sable","remplacement_roulement","remplacement_pompe_mo","remplacement_cellule_mo","nettoyage_local","depannage_piscine"] },
      { label: "🛁 Jacuzzi / Spa",     icon: "🛁", kinds: ["entretien_jacuzzi","vidange_jacuzzi","depannage_jacuzzi"] },
      { label: "🔧 Divers",            icon: "🔧", kinds: ["deplacement"] },
    ];

    const eligible = PRESTATION_TEMPLATES.filter(t =>
      t && !t._deleted && t.kind &&
      t.kind !== "produits" && t.kind !== "fournitures" && t.kind !== ""
    );

    // Construire un Map kind → template pour un accès rapide
    const tmplByKind = {};
    eligible.forEach(t => tmplByKind[t.kind] = t);

    // Kinds déjà affichés (pour les custom en fin de liste)
    const displayed = new Set();

    const addSeparator = (label) => {
      const tr = document.createElement("tr");
      tr.className = "tarif-category-row";
      tr.innerHTML = `<td colspan="4" class="tarif-category-label">${label}</td>`;
      tbody.appendChild(tr);
    };

    const addRow = (t) => {
      displayed.add(t.kind);
      const keyPart = t.kind + "_particulier";
      const keySyn  = t.kind + "_syndic";
      const valPart = custom[keyPart] != null ? custom[keyPart] : (t.priceParticulier ?? "");
      const valSyn  = custom[keySyn]  != null ? custom[keySyn]  : (t.priceSyndic ?? "");
      const isCustom = t.kind.startsWith("custom_");

      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td class="tarif-label-cell" onclick="toggleDescEditor('${t.kind}')">` +
        `<span class="tarif-label-text">${t.label}</span>` +
        `<span class="tarif-desc-icon" title="Modifier le texte du devis">📝</span>` +
        `</td>` +
        `<td><div class="tarif-price-wrap"><input type="number" step="0.01" class="tarif-part" ` +
        `oninput="syncTarifRow(this)" data-kind="${t.kind}" data-type="particulier" value="${valPart}"><span class="tarif-euro">€</span></div></td>` +
        `<td><div class="tarif-price-wrap"><input type="number" step="0.01" class="tarif-syn" ` +
        `oninput="syncTarifRow(this)" data-kind="${t.kind}" data-type="syndic" value="${valSyn}"><span class="tarif-euro">€</span></div></td>` +
        (isCustom
          ? `<td class="tarif-delete-cell"><button type="button" class="tarif-del-btn no-print" onclick="deleteCustomPrestation('${t.kind}')" title="Supprimer">✕</button></td>`
          : `<td></td>`);
      tbody.appendChild(tr);
    };

    // Afficher par catégorie
    TARIF_CATEGORIES.forEach(cat => {
      const items = cat.kinds.map(k => tmplByKind[k]).filter(Boolean);
      if (items.length === 0) return;
      addSeparator(cat.label);
      items.forEach(addRow);
    });

    // Custom prestations en fin
    const customs = eligible.filter(t => t.kind.startsWith("custom_") && !displayed.has(t.kind));
    if (customs.length > 0) {
      addSeparator("⭐ Prestations personnalisées");
      customs.forEach(addRow);
    }

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
  // Réafficher le tableau des devis/factures
  const docsCard = document.getElementById("documentsCard");
  if (docsCard) docsCard.classList.remove("hidden");
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

// ================== NOTIFICATIONS TOAST ==================
// Petit bandeau qui apparaît en haut et disparaît tout seul.
// type : "success" | "error" | "info" | "warning"
function showToast(message, type = "success", duration = 2600) {
  if (!message) return;

  // Conteneur (créé une seule fois)
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }

  const ICONS = {
    success: "✅",
    error:   "❌",
    info:    "ℹ️",
    warning: "⚠️",
  };

  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.innerHTML =
    `<span class="toast-icon">${ICONS[type] || "ℹ️"}</span>` +
    `<span class="toast-msg"></span>`;
  // texte injecté en textContent (sécurité anti-HTML)
  toast.querySelector(".toast-msg").textContent = message;

  container.appendChild(toast);

  // Animation d'entrée
  requestAnimationFrame(() => toast.classList.add("toast-show"));

  // Disparition automatique
  const hide = () => {
    toast.classList.remove("toast-show");
    setTimeout(() => { try { toast.remove(); } catch (e) {} }, 320);
  };
  const timer = setTimeout(hide, duration);

  // Clic = fermeture immédiate
  toast.addEventListener("click", () => { clearTimeout(timer); hide(); });
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

// =========================================================
// POPUP DATE PICKER (utilisée pour "Devis réalisé")
// =========================================================
function showDatePickerDialog({
  title = "Date",
  message = "",
  defaultDate = "",
  confirmLabel = "Confirmer",
  onConfirm,
  onCancel,
}) {
  // Création dynamique de l'overlay (auto-supprimé à la fermeture)
  const overlay = document.createElement("div");
  overlay.className = "confirm-overlay";
  overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999;";

  overlay.innerHTML =
    `<div class="confirm-box info" style="max-width:360px;width:90%;padding:28px 24px;">` +
      `<div class="confirm-icon info" style="font-size:28px;margin-bottom:8px;">📅</div>` +
      `<h3 class="confirm-title" style="margin-bottom:8px;">${title}</h3>` +
      `<p class="confirm-message" style="margin-bottom:14px;color:#374151;">${message}</p>` +
      `<input type="date" id="_dpInput" value="${defaultDate}" ` +
        `style="width:100%;padding:9px 10px;border:1.5px solid #2563eb;border-radius:8px;` +
        `font-size:15px;margin-bottom:18px;box-sizing:border-box;">` +
      `<div class="confirm-buttons">` +
        `<button id="_dpCancel" class="btn btn-secondary" type="button">Annuler</button>` +
        `<button id="_dpOk" class="btn btn-primary" type="button">${confirmLabel}</button>` +
      `</div>` +
    `</div>`;

  document.body.appendChild(overlay);

  // Focus sur le champ date
  setTimeout(() => { const inp = document.getElementById("_dpInput"); if (inp) inp.focus(); }, 60);

  function close() { try { document.body.removeChild(overlay); } catch(e) {} }

  document.getElementById("_dpOk").onclick = () => {
    const val = (document.getElementById("_dpInput")?.value || defaultDate || "").slice(0, 10);
    close();
    if (typeof onConfirm === "function") onConfirm(val);
  };

  document.getElementById("_dpCancel").onclick = () => {
    close();
    if (typeof onCancel === "function") onCancel();
  };
}

const signatureClientTitle = "Bon pour accord";
const signatureClientText = "Bon pour accord, lu et approuvé.";

// ============================================================
// 🔒 PROTECTION FORMULAIRE NON SAUVEGARDÉ
// ============================================================
let _formDirty = false;

function _markFormDirty()  { _formDirty = true;  _updateDirtyIndicator(); }
function _clearFormDirty() { _formDirty = false; _updateDirtyIndicator(); }

// Affiche/masque le petit badge "modifications non enregistrées" près du titre
function _updateDirtyIndicator() {
  // Trouver le titre du formulaire visible
  let titleEl = null;
  const fv = document.getElementById("formView");
  const cv = document.getElementById("contractView");
  if (fv && !fv.classList.contains("hidden")) {
    titleEl = document.getElementById("formTitle");
  } else if (cv && !cv.classList.contains("hidden")) {
    titleEl = cv.querySelector("h2");
  }

  // Récupérer (ou créer) le badge
  let badge = document.getElementById("dirtyIndicator");
  if (!badge) {
    badge = document.createElement("span");
    badge.id = "dirtyIndicator";
    badge.innerHTML = `<span class="dirty-dot"></span>Modifications non enregistrées`;
  }

  if (_formDirty && titleEl) {
    // placer le badge juste après le titre courant
    if (badge.previousElementSibling !== titleEl) {
      titleEl.insertAdjacentElement("afterend", badge);
    }
    badge.classList.add("visible");
  } else {
    badge.classList.remove("visible");
  }
}

function _isAnyFormVisible() {
  const fv = document.getElementById("formView");
  const cv = document.getElementById("contractView");
  return (fv && !fv.classList.contains("hidden")) ||
         (cv && !cv.classList.contains("hidden"));
}

/**
 * Si des modifs non sauvegardées existent, demande confirmation avant de
 * continuer. Appelle onProceed() directement si rien n'est modifié.
 */
function confirmIfDirty(onProceed) {
  if (!_formDirty || !_isAnyFormVisible()) {
    onProceed();
    return;
  }
  showConfirmDialog({
    title: "Modifications non sauvegardées",
    message: "Tu as des modifications non enregistrées.\nQuitter sans sauvegarder ?",
    confirmLabel: "Quitter sans sauvegarder",
    cancelLabel: "Rester",
    variant: "danger",
    icon: "⚠️",
    onConfirm: () => {
      _clearFormDirty();
      onProceed();
    },
  });
}

/** Attache les listeners une seule fois au démarrage de l'app */
function _initDirtyTracking() {
  ["formView", "contractView"].forEach((viewId) => {
    const el = document.getElementById(viewId);
    if (!el) return;
    // input = frappe au clavier, change = select/checkbox/date
    el.addEventListener("input",  _markFormDirty);
    el.addEventListener("change", _markFormDirty);
  });
}

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
      "remise_service_propre",
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
 const isDetail =
  p.isDetail === true ||
  p.kind === "detail_line" ||
  (
    Number(p.qty || 0) === 0 &&
    Number(p.price || 0) === 0 &&
    Number(p.total || 0) === 0
  );

  if (isDetail) {
    prestationsHTML += `
      <tr class="detail-row">
        <td colspan="5">
          <div class="detail-line">${p.desc || ""}</div>
        </td>
      </tr>
    `;
    return;
  }

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

    /* ===== BOUTON RETOUR (non imprimé) ===== */
    .print-back-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9999;
      background: #1a74d9;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,.2);
    }
    .print-back-btn {
      background: #fff;
      color: #1a74d9;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .print-back-btn:active { opacity: .8; }
    .print-back-label {
      color: #fff;
      font-size: 13px;
      font-weight: 500;
    }
    body { padding-top: 52px; } /* espace pour la barre fixe */
    @media print {
      .print-back-bar { display: none !important; }
      body { padding-top: 0 !important; }
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

      /* SHRINK = évite la 2e page. iOS a besoin d'un peu plus que le PC. */
      body{ zoom:${(typeof isIOS === "function" && isIOS()) ? "0.80" : "0.90"}; }

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
  <!-- Barre retour (masquée à l'impression) -->
  <div class="print-back-bar">
    <button class="print-back-btn" onclick="window.close()">← Retour</button>
    <span class="print-back-label">${isDevis ? "Devis " : "Facture "}${doc.number} — ${escapeHtml(doc.clientName || "")}</span>
  </div>

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

// ── iOS : afficher dans l’overlay interne + bouton Imprimer/PDF ──
if (isIOS()) {
  const overlay  = document.getElementById("pdfViewerOverlay");
  const frame    = document.getElementById("pdfViewerFrame");
  const printBtn = document.getElementById("pdfPrintBtn");
  if (overlay && frame) {
    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    frame.src = blobUrl;
    overlay.classList.remove("hidden");
    if (printBtn) printBtn.style.display = "";
    // Libère le blob après chargement
    frame.onload = function() {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      if (!previewOnly) {
        try { frame.contentWindow.focus(); frame.contentWindow.print(); } catch(e) {}
      }
    };
  }
  return;
}

// ── Desktop / Android : fenêtre classique ──
const printWindow = window.open("", "_blank");
if (!printWindow) return;
printWindow.document.open();
printWindow.document.write(html);
printWindow.document.close();

/* Optionnel: titre vide */
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
  if (type === "piscine_chlore") return "Contrat d’entretien Piscine (chlore)";
  if (type === "piscine_sel")    return "Contrat d’entretien Piscine (sel)";
  if (type === "spa" || type === "entretien_jacuzzi" || type === "spa_jacuzzi")
    return "Contrat d’entretien Spa / Jacuzzi";
  if (type === "piscine+spa")    return "Contrat d’entretien Piscine + Spa";
  if (type === "entretien_clim") return "Contrat d’entretien Climatisation / PAC";
  return "Contrat d’entretien";
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

/**
 * Masque TOUTES les vues principales en une seule fois.
 * À appeler en premier dans chaque fonction de navigation.
 */
function _hideAllMainViews() {
  ["homeView","listView","formView","contractView",
   "attestationView","settingsView","caReportOverlay"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  // Aussi masquer le tarifsPanel si ouvert
  const tp = document.getElementById("tarifsPanel");
  if (tp) { tp.classList.add("hidden"); tp.style.display = ""; }
  // Réafficher documentsCard si tarifsPanel était ouvert
  const dc = document.getElementById("documentsCard");
  if (dc) dc.classList.remove("hidden");
  // Masquer le total collant (on n'est plus dans un formulaire)
  const fst = document.getElementById("formStickyTotal");
  if (fst) fst.classList.remove("visible");
  // Fermer le drawer mobile si ouvert
  closeMobileDrawer && closeMobileDrawer();
}

function showHome() {
  confirmIfDirty(() => {
    _hideAllMainViews();
    hideHealthCardsEverywhere();

    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    const tabHome = document.getElementById("tabHome");
    if (tabHome) tabHome.classList.add("active");

    const homeView = document.getElementById("homeView");
    if (homeView) homeView.classList.remove("hidden");

    refreshHomeStats();
  });
}

// 📅 Accès direct au planning (affiche l'accueil et défile jusqu'au planning)
function showPlanning() {
  confirmIfDirty(() => {
    _hideAllMainViews();
    hideHealthCardsEverywhere();

    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    const tabP = document.getElementById("tabPlanning");
    if (tabP) tabP.classList.add("active");

    const homeView = document.getElementById("homeView");
    if (homeView) homeView.classList.remove("hidden");

    refreshHomeStats();

    // Rafraîchir + défiler jusqu'à la carte planning
    try { if (typeof renderPlanningWeek === "function") renderPlanningWeek(); } catch (e) {}
    setTimeout(() => {
      const card = document.querySelector(".planning-card");
      if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  });
}

function openFromHome(type) {
  _hideAllMainViews();

  // Onglets
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (type === "devis")   { const t = document.getElementById("tabDevis");   if (t) t.classList.add("active"); }
  if (type === "contrat") { const t = document.getElementById("tabContrats"); if (t) t.classList.add("active"); }
  if (type === "facture") { const t = document.getElementById("tabFactures"); if (t) t.classList.add("active"); }

  // Afficher la liste
  const listView = document.getElementById("listView");
  if (listView) listView.classList.remove("hidden");

  // logique existante
  if (typeof switchListType === "function") {
    switchListType(type);
  }
}

function refreshHomeStats() {
  // Sécu : si pas de dashboard sur la page, on ne fait rien
  if (!document.getElementById("homeView")) return;

  // 🔄 La liste « Clients à suivre » se rafraîchit automatiquement en même temps
  //    que le tableau de bord (à chaque changement de données : paiement, devis,
  //    synchro Firestore, navigation…). Plus besoin du bouton Rafraîchir.
  if (typeof renderClientsFollowup === "function") {
    try { renderClientsFollowup(); } catch (e) {}
  }

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
// ✅ Comptabilité de trésorerie : CA = factures PAYÉES, classées par DATE DE PAIEMENT
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0-11

let caTotal = 0;
let caPaid = 0;
let caUnpaid = 0;
let caThisMonth = 0; // CA encaissé ce mois-ci (par date de paiement)

factures.forEach((f) => {
  const val = Number(f.totalTTC || 0);
  if (isNaN(val)) return;

  caTotal += val;

  if (f.paid) {
    caPaid += val;
    // CA du mois courant = date de paiement dans le mois
    const payISO = (f.paymentDate || f.date || "").slice(0, 10);
    if (payISO) {
      const dp = new Date(payISO + "T00:00:00");
      if (
        !isNaN(dp.getTime()) &&
        dp.getFullYear() === currentYear &&
        dp.getMonth() === currentMonth
      ) {
        caThisMonth += val;
      }
    }
  } else {
    caUnpaid += val;
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

if (typeof computeDashboardExtended === "function") computeDashboardExtended();
}

async function saveDocumentToFirestore(docObj) {
  if (!db || !docObj?.id) return;
  await db.collection("documents").doc(docObj.id).set(docObj, { merge: true });
}

async function upsertManualPlanningItemToFirestore(item) {
  if (!item?.id) return;
  // On marque l'item comme "en attente" tant que le serveur n'a pas confirmé
  pendingManualPlanningIds.add(item.id);
  _savePendingManualPlanningIds();
  if (!db) return;
  await db.collection("planningManual").doc(item.id).set(item, { merge: true });
  // ✅ Confirmé côté serveur → plus besoin de le garder "pending"
  pendingManualPlanningIds.delete(item.id);
  _savePendingManualPlanningIds();
}

// ==========================================================================
// 📅 PRÉ-REMPLISSAGE PLANNING — Client « Le Montanan » (Nice)
//    Calendrier de passages personnalisé issu du PDF du client.
//    Idempotent : ids déterministes + drapeau localStorage.
//    Ajoute 21 interventions manuelles (le client peut les déplacer/supprimer,
//    ou tu peux ensuite créer le contrat officiel avec le même calendrier).
// ==========================================================================
function seedMontananPlanning() {
  try {
    if (localStorage.getItem("seed_montanan_v1") === "done") return;

    // 21 dates exactes + observation associée
    const PASSAGES = [
      ["2026-08-31", "Démarrage saison (avec P. Juven)"],
      ["2026-09-05", "Passage de contrôle"],
      ["2026-09-12", "Entretien / Hivernage (filtration à l'arrêt à partir du 12/09)"],
      ["2027-02-19", "Passage de contrôle / Entretien"],
      ["2027-03-20", "Entretien"],
      ["2027-05-15", "Mise en route (filtration relancée)"],
      ["2027-05-22", "Entretien"],
      ["2027-05-29", "Entretien"],
      ["2027-06-05", "Entretien"],
      ["2027-06-12", "Entretien"],
      ["2027-06-19", "Entretien"],
      ["2027-06-26", "Entretien"],
      ["2027-07-03", "Entretien"],
      ["2027-07-10", "Entretien"],
      ["2027-07-17", "Entretien"],
      ["2027-07-24", "Entretien"],
      ["2027-07-31", "Entretien"],
      ["2027-08-07", "Entretien"],
      ["2027-08-14", "Entretien"],
      ["2027-08-21", "Entretien"],
      ["2027-08-28", "Entretien"],
    ];

    manualPlanningItems = manualPlanningItems || [];
    let added = 0;

    PASSAGES.forEach(([iso, obs]) => {
      const id = "seed-montanan-" + iso;
      // Anti-doublon (même si le drapeau a été perdu)
      if (manualPlanningItems.some((x) => x && x.id === id)) return;

      const item = {
        id,
        date: iso,
        service: "Entretien piscine",
        label: "Entretien piscine",
        clientName: "Le Montanan (Nice)",
        address: "Nice",
        phone: "",
        email: "",
        time: "11:30",
        notes: obs,
        privateNotes:
          "Contrat 1 an à partir du 31/08/2026 — Passage le samedi dès 11h30 " +
          "en présence de la femme de ménage. Facturation à la fin de chaque mois. " +
          "Filtration à l'arrêt du 12/09/2026 au 15/05/2027.",
        sourceType: "seed",
        sourceId: "montanan",
      };

      manualPlanningItems.push(item);
      added++;
      // Sync Firestore (best-effort)
      try { upsertManualPlanningItemToFirestore(item).catch(() => {}); } catch (e) {}
    });

    if (added > 0) {
      try { localStorage.setItem("manualPlanningItems", JSON.stringify(manualPlanningItems)); } catch (e) {}
    }
    localStorage.setItem("seed_montanan_v1", "done");

    if (added > 0) {
      try { renderPlanningWeek(); } catch (e) {}
      console.log(`📅 Planning « Le Montanan » pré-rempli (${added} passages ajoutés).`);
    }
  } catch (e) {
    console.warn("seedMontananPlanning a échoué :", e);
  }
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

// ───────────────────────────────────────────────────────────
// Suivi "fait" des passages de CONTRAT dans le planning
// (stockés en local par clé contractId|date d'origine)
// ───────────────────────────────────────────────────────────
function _getContractDoneSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem("contractPlanningDone") || "[]"));
  } catch (e) {
    return new Set();
  }
}
function _saveContractDoneSet(set) {
  localStorage.setItem("contractPlanningDone", JSON.stringify([...set]));
  // 🔄 Synchro multi-appareils
  try {
    if (db) db.collection("planningFlags").doc("contractDone").set({ keys: [...set] }, { merge: true }).catch(() => {});
  } catch (e) {}
}
function isContractVisitDone(contractId, originalDate) {
  return _getContractDoneSet().has(contractId + "|" + originalDate);
}
function toggleContractVisitDone(contractId, originalDate, dateStr) {
  const set = _getContractDoneSet();
  const key = contractId + "|" + originalDate;
  const nowDone = !set.has(key);
  if (nowDone) set.add(key); else set.delete(key);
  _saveContractDoneSet(set);

  try { renderPlanningWeek(); } catch (e) {}
  // 🔁 On garde le panneau du jour ouvert pour enchaîner les "Fait"
  try { if (dateStr) openPlanningDayDetails(dateStr); } catch (e) {}
  if (typeof showToast === "function") {
    showToast(
      nowDone ? "Intervention marquée faite ✅" : "Intervention remise à faire",
      nowDone ? "success" : "info",
    );
  }
}

// ── Passages de contrat RETIRÉS du planning (occurrences supprimées) ──
function _getContractRemovedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem("contractPlanningRemoved") || "[]"));
  } catch (e) {
    return new Set();
  }
}
function _saveContractRemovedSet(set) {
  localStorage.setItem("contractPlanningRemoved", JSON.stringify([...set]));
  // 🔄 Synchro multi-appareils
  try {
    if (db) db.collection("planningFlags").doc("contractRemoved").set({ keys: [...set] }, { merge: true }).catch(() => {});
  } catch (e) {}
}
function isContractVisitRemoved(contractId, originalDate) {
  return _getContractRemovedSet().has(contractId + "|" + originalDate);
}
function removeContractVisit(contractId, originalDate, dateStr) {
  showConfirmDialog({
    title: "Retirer ce passage",
    message: "Retirer cette intervention du planning ?\n\n(Le contrat n'est pas supprimé, seul ce passage précis est retiré.)",
    confirmLabel: "Retirer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "🗑️",
    onConfirm: () => {
      const set = _getContractRemovedSet();
      set.add(contractId + "|" + originalDate);
      _saveContractRemovedSet(set);
      try { renderPlanningWeek(); } catch (e) {}
      try { if (dateStr) openPlanningDayDetails(dateStr); } catch (e) {}
      if (typeof showToast === "function") showToast("Passage retiré du planning", "info");
    },
  });
}

// Capture l'ordre actuel des cartes d'une journée (depuis le DOM) et le mémorise
function capturePlanningDayOrder(dateISO, listEl) {
  if (!dateISO || !listEl) return;
  const keys = Array.from(listEl.querySelectorAll(".visit-entry"))
    .map((el) => el.dataset.visitKey)
    .filter(Boolean);
  if (keys.length === 0) {
    delete planningOrder[dateISO];
  } else {
    planningOrder[dateISO] = keys;
  }
  try { localStorage.setItem("planningOrder", JSON.stringify(planningOrder)); } catch (e) {}
}

// Réordonne les cartes d'une colonne selon l'ordre mémorisé pour ce jour
function applyPlanningDayOrder(dateISO, listEl) {
  if (!dateISO || !listEl) return;
  const order = planningOrder[dateISO];
  if (!Array.isArray(order) || order.length === 0) return;
  const cards = Array.from(listEl.querySelectorAll(".visit-entry"));
  cards.sort((a, b) => {
    const ia = order.indexOf(a.dataset.visitKey);
    const ib = order.indexOf(b.dataset.visitKey);
    // les cartes non listées (nouvelles) vont à la fin, dans leur ordre d'origine
    const ra = ia === -1 ? 9999 : ia;
    const rb = ib === -1 ? 9999 : ib;
    return ra - rb;
  });
  cards.forEach((c) => listEl.appendChild(c)); // ré-append dans le bon ordre
}

async function applyContractPlanningOverride(contractId, originalDate, newDate) {
  try {
    const id = `${contractId}__${originalDate}`; // ID stable (important)
    const rec = { id, contractId, originalDate, newDate, updatedAt: Date.now() };

    // ✅ Mise à jour LOCALE immédiate (fonctionne même hors ligne / sans Firestore)
    if (!Array.isArray(contractPlanningOverrides)) contractPlanningOverrides = [];
    const idx = contractPlanningOverrides.findIndex(
      (o) => o.contractId === contractId && o.originalDate === originalDate,
    );
    if (idx >= 0) contractPlanningOverrides[idx] = rec;
    else contractPlanningOverrides.push(rec);
    try {
      localStorage.setItem("contractPlanningOverrides", JSON.stringify(contractPlanningOverrides));
    } catch (e) {}

    // Rafraîchir tout de suite
    try { renderPlanningWeek(); } catch (e) {}

    // Firestore si dispo (l'onSnapshot re-synchronisera aussi)
    if (db) {
      await db.collection("contractPlanningOverrides").doc(id).set(rec, { merge: true });
    }
  } catch (e) {
    console.error("applyContractPlanningOverride error:", e);
  }
}

// 📅 Ouvre un sélecteur de date pour déplacer une intervention (contrat ou manuel)
function promptMovePlanningVisit(type, id, originalDate, currentDate) {
  showDatePickerDialog({
    title: "Déplacer l'intervention",
    message: "Choisis la nouvelle date de passage :",
    defaultDate: currentDate || originalDate || new Date().toISOString().slice(0, 10),
    confirmLabel: "Déplacer",
    onConfirm: (newDate) => {
      if (!newDate) return;
      _currentOpenPlanningDay = newDate; // on rouvrira ce jour après re-render
      if (type === "contract") {
        applyContractPlanningOverride(id, originalDate, newDate);
      } else {
        moveManualPlanningItemToDate(id, newDate);
        try { renderPlanningWeek(); } catch (e) {}
      }
      if (typeof showToast === "function") {
        const dFR = new Date(newDate + "T00:00:00").toLocaleDateString("fr-FR");
        showToast("Intervention déplacée au " + dFR, "success");
      }
    },
  });
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
    console.warn("❌ SortableJS manquant. Ajoute le <script Sortable.min.js> dans index.html.");
    return;
  }

  // ✅ Reset anciennes instances
  planningSortables.forEach((s) => { try { s.destroy(); } catch (e) {} });
  planningSortables = [];

  // Détection tactile (iPhone, iPad, Android)
  const isTouchDevice = ("ontouchstart" in window) || navigator.maxTouchPoints > 0;

  document.querySelectorAll(".day-visits").forEach((listEl) => {
    const sortable = new Sortable(listEl, {
      group:    "planning",
      draggable: ".visit-entry",
      filter:   ".visit-empty",

      // Classes CSS pour le retour visuel
      ghostClass:  "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass:   "sortable-drag",

      // Animation plus courte = plus nerveux
      animation: 100,

      // ── PC : drag natif HTML5 (beaucoup plus fluide que le fallback JS)
      // ── Mobile : fallback JS obligatoire (iOS ne supporte pas HTML5 DnD)
      forceFallback:    isTouchDevice,
      fallbackOnBody:   isTouchDevice,
      fallbackTolerance: isTouchDevice ? 3 : 0,

      // Délai avant départ du drag :
      //  • Mobile : 200 ms pour laisser le temps de scroller sans déclencher le drag
      //  • PC     : 0 ms, le drag démarre immédiatement au premier mouvement
      delay:           isTouchDevice ? 200 : 0,
      delayOnTouchOnly: true,

      // Seuil de mouvement avant que le drag se déclenche (mobile uniquement)
      touchStartThreshold: isTouchDevice ? 4 : 1,

      // Auto-scroll au bord de l'écran pendant le drag
      scroll:            true,
      scrollSensitivity: 60,
      scrollSpeed:       18,

      onStart() {
        document.body.classList.add("is-dragging");
      },

      onEnd(evt) {
        document.body.classList.remove("is-dragging");

        const itemEl    = evt.item;
        const newDateISO = evt.to.closest(".day-column")?.dataset?.date;
        const oldDateISO = evt.from.closest(".day-column")?.dataset?.date;
        if (!newDateISO) return;

        const changedDay = oldDateISO && newDateISO !== oldDateISO;

        // 1) CHANGEMENT DE JOUR → déplacement (déclenche un re-render)
        if (changedDay) {
          if (itemEl.classList.contains("visit-manual")) {
            const manualId = itemEl.dataset.manualId;
            if (manualId) moveManualPlanningItemToDate(manualId, newDateISO);
          } else if (itemEl.classList.contains("visit-contract")) {
            const contractId  = itemEl.dataset.contractId;
            const originalDate = itemEl.dataset.originalDate;
            if (contractId && originalDate) applyContractPlanningOverride(contractId, originalDate, newDateISO);
          }
        }

        // 2) SAUVEGARDER L'ORDRE de la/les journée(s) (y compris réorg dans le même jour)
        //    On lit depuis le DOM courant (frais après un éventuel re-render).
        const _captureDay = (dateISO) => {
          const col = document.querySelector(`.day-column[data-date="${dateISO}"] .day-visits`);
          if (col) capturePlanningDayOrder(dateISO, col);
        };
        _captureDay(newDateISO);
        if (changedDay && oldDateISO) _captureDay(oldDateISO);
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
  const todayBtn = document.getElementById("planningTodayBtn");
  if (todayBtn) todayBtn.style.display = planningWeekOffset !== 0 ? "inline-flex" : "none";
}

function goToPlanningToday() {
  planningWeekOffset = 0;
  renderPlanningWeek();
  const todayBtn = document.getElementById("planningTodayBtn");
  if (todayBtn) todayBtn.style.display = "none";
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

// Faut-il afficher une visite cette semaine pour ce contrat ?
// Retourne le nombre de slots à placer dans la semaine (0 ou 1 pour freq ≤ 4/mois).
// Approche par intervalle : startDate + n × (30 / perMonth) jours
// → permet de gérer correctement les contrats qui commencent en fin de mois (ex: 31/05)
function getVisitsPerWeekForDate(contract, monday) {
  const pr = contract.pricing || {};
  const month = monday.getMonth() + 1;

  // Mai à octobre = été (passEte), le reste = hiver (passHiver)
  const perMonth =
    month >= 5 && month <= 10
      ? Number(pr.passEte  || 0)
      : Number(pr.passHiver || 0);

  if (!perMonth) return 0;

  // Date de début du contrat (ancre des visites)
  const startISO = pr.startDate;
  if (!startISO) return 0;
  const startDate = new Date(startISO + "T00:00:00");
  if (isNaN(startDate.getTime())) return 0;

  // Dimanche de la semaine courante
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const msPerDay = 86400000;

  // Pour ≥ 4/mois : on utilise intervalles de ~7 jours
  const intervalDays = 30 / perMonth;

  const daysFromStartToMonday = Math.round((monday - startDate) / msPerDay);

  // Semaine entièrement avant le début du contrat → aucune visite
  if (daysFromStartToMonday < -6) return 0;

  // Cherche si une occurrence (startDate + n × intervalDays) tombe dans [lundi, dimanche]
  const nMin = Math.max(0, Math.floor(daysFromStartToMonday / intervalDays) - 1);
  const nMax = Math.ceil((daysFromStartToMonday + 6) / intervalDays) + 1;

  for (let n = nMin; n <= nMax; n++) {
    const visitDate = new Date(startDate);
    visitDate.setDate(startDate.getDate() + Math.round(n * intervalDays));
    const visitDayFromMonday = Math.round((visitDate - monday) / msPerDay);
    if (visitDayFromMonday >= 0 && visitDayFromMonday <= 6) return 1;
  }

  return 0;
}

function getPlanningColorClass(service) {
  const s = (service || "").toLowerCase();

  if (s.includes("clim")) return "planning-kind-clim";
  if (s.includes("jacuzzi") || s.includes("spa")) return "planning-kind-jacuzzi";
  if (s.includes("dépannage") || s.includes("depannage")) return "planning-kind-depannage";
  if (s.includes("piscine")) return "planning-kind-piscine";

  return "planning-kind-default";
}

// Jour actuellement ouvert dans le panneau de détails (pour le garder ouvert après re-render)
let _currentOpenPlanningDay = null;

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

    col.addEventListener("click", function (e) {
      if (e.target.closest(".planning-add-btn")) return;
      openPlanningDayDetails(this.dataset.date);
    });

    dayColumns.push({ date, dateStr, list });
    currentPlanningData.push({ date: dateStr, items: [] });
  }

  // ===========================
  // 2) Prestations CONTRAT
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

    // ✅ Ne pas afficher un contrat NON signé (et sans devis accepté) au planning
    //    (même règle que la facturation : rien tant que ce n'est pas validé)
    const _signed = (typeof isContractSigned === "function") ? isContractSigned(contract) : false;
    const _devisOK = (typeof isDevisAcceptedForContract === "function") ? isDevisAcceptedForContract(contract) : false;
    if (!_signed && !_devisOK) return;

    // ==========================================================
    // 📅 CALENDRIER PERSONNALISÉ : passages aux dates exactes
    //    (prioritaire sur la cadence régulière mois/été/hiver)
    // ==========================================================
    const _customPassageDates = Array.isArray(contract?.pricing?.customPassageDates)
      ? contract.pricing.customPassageDates.filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x))
      : [];

    if (_customPassageDates.length) {
      const clientName =
        (contract.client && contract.client.name) ||
        (contract.client && contract.client.reference) ||
        "Client";
      const phone = contract.client?.phone || "";
      const address = contract.client?.address || "";
      const serviceLabel = getServiceLabelForContract(contract);
      const mondayISO = dayColumns[0].dateStr;
      const sundayISO = dayColumns[6].dateStr;

      _customPassageDates.forEach((originalDateISO) => {
        // Passage retiré manuellement → on ne l'affiche pas
        if (isContractVisitRemoved(contract.id, originalDateISO)) return;

        // Un passage peut avoir été déplacé (override) vers un autre jour
        const finalDateISO = getOverriddenContractDate(contract.id, originalDateISO);
        if (finalDateISO < mondayISO || finalDateISO > sundayISO) return;

        const dayIndexFinal = currentPlanningData.findIndex(
          (d) => d.date === finalDateISO,
        );
        if (dayIndexFinal === -1) return;

        const column = dayColumns[dayIndexFinal];
        const info = currentPlanningData[dayIndexFinal];

        const div = document.createElement("div");
        div.className =
          "visit-entry visit-contract " + getPlanningColorClass(serviceLabel);
        if (isContractVisitDone(contract.id, originalDateISO)) {
          div.classList.add("is-done");
        }
        div.dataset.contractId = contract.id;
        div.dataset.originalDate = originalDateISO;
        div.dataset.visitKey = "c:" + contract.id + ":" + originalDateISO;

        const title = document.createElement("div");
        title.className = "visit-title";
        title.textContent = serviceLabel;
        div.appendChild(title);

        const sub = document.createElement("div");
        sub.className = "visit-pool";
        sub.textContent = clientName;
        div.appendChild(sub);

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
      });

      return; // ⛔ on n'applique PAS la cadence régulière pour ce contrat
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
      const startISO = contract?.pricing?.startDate;
      const d = startISO ? new Date(startISO + "T00:00:00") : null;

      const preferredIndex =
        d && !isNaN(d) ? (d.getDay() + 6) % 7 : 3;

      let dayIndexOriginal;

      if (visits === 1) {
        dayIndexOriginal = preferredIndex;
      } else {
        dayIndexOriginal = Math.min(
          6,
          Math.floor(((i + 0.5) * 7) / visits),
        );
      }

      const originalDateISO = dayColumns[dayIndexOriginal].dateStr;

      // ── Ne jamais afficher un passage avant la date de début du contrat ──
      const _contractStart = contract?.pricing?.startDate || "";
      if (_contractStart && originalDateISO < _contractStart) continue;

      // ── Ne jamais afficher un passage après la date de fin du contrat ──
      const _contractEnd = getContractEndDate(contract);
      if (_contractEnd) {
        const _endISO = _contractEnd.toISOString().split("T")[0];
        if (originalDateISO > _endISO) continue;
      }

      // 🗑️ Passage retiré manuellement du planning → on ne l'affiche pas
      if (isContractVisitRemoved(contract.id, originalDateISO)) continue;

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
      div.className =
        "visit-entry visit-contract " + getPlanningColorClass(serviceLabel);
      if (isContractVisitDone(contract.id, originalDateISO)) {
        div.classList.add("is-done");
      }
      div.dataset.contractId = contract.id;
      div.dataset.originalDate = originalDateISO;
      div.dataset.visitKey = "c:" + contract.id + ":" + originalDateISO;

      const title = document.createElement("div");
      title.className = "visit-title";
      title.textContent = serviceLabel;
      div.appendChild(title);

      const sub = document.createElement("div");
      sub.className = "visit-pool";
      sub.textContent = clientName;
      div.appendChild(sub);

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
  // 3) Ajouts MANUELS
  // ===========================
  manualPlanningItems.forEach((item) => {
    const index = currentPlanningData.findIndex((d) => d.date === item.date);
    if (index === -1) return;

    const column = dayColumns[index];
    const info = currentPlanningData[index];

    const service = item.service || item.label || "Intervention";
    const clientName = item.clientName || "";
    const time = item.time || "";

    const div = document.createElement("div");
    div.className =
      "visit-entry visit-manual " + getPlanningColorClass(service);
    if (item.isDone) div.classList.add("is-done");

    div.dataset.manualId = item.id;
    div.dataset.visitKey = "m:" + item.id;

    const title = document.createElement("div");
    title.className = "visit-title";
    title.textContent =
      (time ? time + " • " : "") + service;
    div.appendChild(title);

    if (clientName) {
      const sub = document.createElement("div");
      sub.className = "visit-pool";
      sub.textContent = clientName;
      div.appendChild(sub);
    }

    column.list.appendChild(div);

    info.items.push({
      id: item.id,
      type: "manual",
      service,
      clientName,
      address: item.address || "",
      phone: item.phone || "",
      email: item.email || "",
      privateNotes: item.privateNotes || "",
      notes: item.notes || "",
      time: item.time || "",
      sourceId: item.sourceId || "",
      sourceType: item.sourceType || "",
    });
  });

  // ===========================
  // 3b) Ordre intra-journée (réorganisation manuelle mémorisée)
  // ===========================
  dayColumns.forEach((col) => {
    applyPlanningDayOrder(col.dateStr, col.list);
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

  initPlanningDnD();

  // 🔁 Si un jour était ouvert, on le ré-affiche (le panneau reste ouvert
  //    après marquage "Fait", drag&drop, ou synchro Firestore en arrière-plan)
  if (
    _currentOpenPlanningDay &&
    currentPlanningData.some((d) => d.date === _currentOpenPlanningDay)
  ) {
    try { openPlanningDayDetails(_currentOpenPlanningDay); } catch (e) {}
  }
}
function openPlanningTour(dateStr) {
  const day = currentPlanningData.find((d) => d.date === dateStr);
  let items = (day && day.items) ? day.items.slice() : [];

  // 🔢 Ordonner selon l'ordre du planning (réorganisation mémorisée)
  const _order = planningOrder[dateStr];
  if (Array.isArray(_order) && _order.length) {
    const _vk = (it) => it.type === "contract"
      ? "c:" + it.contractId + ":" + it.originalDate
      : "m:" + it.id;
    items.sort((a, b) => {
      const ia = _order.indexOf(_vk(a));
      const ib = _order.indexOf(_vk(b));
      return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib);
    });
  }

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

  // Mémorise le jour ouvert pour le rouvrir automatiquement après chaque re-render
  _currentOpenPlanningDay = dateStr;

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
    // 🔢 Trier les items selon l'ordre du planning (réorganisation mémorisée)
    const _visitKey = (it) => it.type === "contract"
      ? "c:" + it.contractId + ":" + it.originalDate
      : "m:" + it.id;
    const _order = planningOrder[dateStr];
    if (Array.isArray(_order) && _order.length) {
      day.items.sort((a, b) => {
        const ia = _order.indexOf(_visitKey(a));
        const ib = _order.indexOf(_visitKey(b));
        return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib);
      });
    }

    day.items.forEach((item) => {
      // Notes : item (planning popup) + fiche client
      const c = item.clientName ? _getClientByName(item.clientName) : null;
      const privateNotesItem   = (item.privateNotes || "").trim();
      const notesItem          = (item.notes || "").trim();
      const privateNotesClient = (c?.privateNotes || "").trim();
      const techNotes          = (c?.equipment?.notes || "").trim();

      // Évite de répéter si les notes planning == notes fiche client
      const showClientPrivate = privateNotesClient && privateNotesClient !== privateNotesItem;

      const notesHtml = [
        privateNotesItem  ? `<div style="margin-top:6px;padding:6px 8px;border-radius:10px;background:#fff8e5;border:1px solid #f3d08a;"><strong>🔒 Notes privées</strong><br><span style="white-space:pre-line;">${escapeHtml(privateNotesItem)}</span></div>` : "",
        notesItem         ? `<div style="margin-top:6px;padding:6px 8px;border-radius:10px;background:#f0f4ff;border:1px solid #c7d7fa;"><strong>📝 Notes</strong><br><span style="white-space:pre-line;">${escapeHtml(notesItem)}</span></div>` : "",
        showClientPrivate ? `<div style="margin-top:6px;padding:6px 8px;border-radius:10px;background:#fff8e5;border:1px solid #f3d08a;"><strong>🔒 Notes fiche client</strong><br><span style="white-space:pre-line;">${escapeHtml(privateNotesClient)}</span></div>` : "",
        techNotes         ? `<div style="margin-top:6px;padding:6px 8px;border-radius:10px;background:#f0fff4;border:1px solid #a7e0bb;"><strong>🔧 Notes techniques</strong><br><span style="white-space:pre-line;">${escapeHtml(techNotes)}</span></div>` : "",
      ].join("");

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
            <div class="planning-actions">
              <button class="btn btn-small btn-secondary"
                onclick="toggleContractVisitDone('${item.contractId}', '${item.originalDate}', '${dateStr}')">
                ${
                  isContractVisitDone(item.contractId, item.originalDate)
                    ? "↩ Annuler"
                    : "✅ Fait"
                }
              </button>
              <button class="btn btn-small btn-secondary"
                onclick="promptMovePlanningVisit('contract', '${item.contractId}', '${item.originalDate}', '${item.date || dateStr}')">
                📅 Déplacer
              </button>
              <button class="btn btn-small btn-success"
                onclick="createFactureFromContractItem('${item.contractId}')">
                💶 Facturer
              </button>
              <button class="btn btn-small btn-danger"
                onclick="removeContractVisit('${item.contractId}', '${item.originalDate}', '${dateStr}')">
                🗑️ Retirer
              </button>
            </div>
          </div>
        `;
      }

      if (item.type === "manual") {
        const service = item.service || item.label || "Intervention";
        const timeHtml = item.time
          ? `⏰ ${escapeHtml(item.time)}<br>`
          : "";

        // ✅ on permet l'édition seulement pour les manuels "normaux"
        const canEdit = !item.sourceId;

        html += `
          <div class="planning-details-entry">
            <strong>${escapeHtml(service)}</strong><br>
            ${timeHtml}
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
                    : `promptMovePlanningVisit('manual', '${item.id}', '${dateStr}', '${dateStr}')`
                }">
                📅 Déplacer
              </button>

              <button class="btn btn-small btn-secondary"
                onclick="toggleManualPlanningDone('${item.id}', '${dateStr}')">
                ${
                  manualPlanningItems.find((x) => x.id === item.id)?.isDone
                    ? "↩ Annuler"
                    : "✅ Fait"
                }
              </button>

              <button class="btn btn-small btn-success"
                onclick="createFactureFromPlanningItem('${item.id}')">
                💶 Facturer
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

  editingManualPlanningId = manualIdToEdit || null;

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
  const timeInput = document.getElementById("planningPopupTime");
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
  if (timeInput) timeInput.value = "";
  if (privateNotesInput) privateNotesInput.value = "";
  if (notesInput) notesInput.value = "";
  if (repeatPerMonthInput) repeatPerMonthInput.value = "0";
  if (repeatMonthsInput) repeatMonthsInput.value = "6";

  loadPlanningPrestations();

  // pré-remplissage si édition
  if (editingManualPlanningId) {
    const it = (manualPlanningItems || []).find((x) => x.id === editingManualPlanningId);
    if (it) {
      if (custom) custom.value = it.customPrestation || "";
      if (select) select.value = it.prestation || "";

      if (clientInput) clientInput.value = it.clientName || "";
      if (addrInput) addrInput.value = it.address || "";
      if (phoneInput) phoneInput.value = it.phone || "";
      if (emailInput) emailInput.value = it.email || "";
      if (timeInput) timeInput.value = it.time || "";
      if (privateNotesInput) privateNotesInput.value = it.privateNotes || "";
      if (notesInput) notesInput.value = it.notes || "";
    }
  }

  if (custom && select) {
    custom.oninput = () => {
      if (custom.value.trim()) select.value = "";
    };
    select.onchange = () => {
      if (select.value) custom.value = "";
    };
  }

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

  // Fermer le dropdown autocomplete client s'il est ouvert
  _closePlanningClientSuggestions();

  const popup = overlay.querySelector(".popup");
  if (popup) popup.classList.remove("show");

  overlay.classList.add("hidden");

  // reset mode édition
  editingManualPlanningId = null;

  // cache le bouton "Enregistrer comme client"
  const addClientBtn = document.getElementById("planningAddClientBtn");
  if (addClientBtn) addClientBtn.style.display = "none";

  // remet le titre/bouton par défaut
  const titleEl = overlay.querySelector("h3");
  const primaryBtn = overlay.querySelector(".popup-buttons .btn.btn-primary");
  if (titleEl) titleEl.textContent = "Ajouter une intervention";
  if (primaryBtn) primaryBtn.textContent = "Ajouter";

  // Vider tous les champs
  ["planningPopupClient","planningPopupAddress","planningPopupPhone",
   "planningPopupEmail","planningPopupPrivateNotes","planningPopupNotes",
   "planningPopupPrestationCustom","planningPopupTime"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const prestEl = document.getElementById("planningPopupPrestation");
  if (prestEl) prestEl.value = "";
  const repeatEl = document.getElementById("planningPopupRepeatPerMonth");
  if (repeatEl) repeatEl.value = "0";
}

// ================== FACTURER DEPUIS LE PLANNING ==================

function createFactureFromPlanningItem(manualId) {
  const item = (manualPlanningItems || []).find((x) => x.id === manualId);
  if (!item) return;

  openFromHome("facture");
  newDocument("facture");

  const nameEl = document.getElementById("clientName");
  const addrEl = document.getElementById("clientAddress");
  const phoneEl = document.getElementById("clientPhone");
  const emailEl = document.getElementById("clientEmail");
  const subjectEl = document.getElementById("docSubject");

  if (nameEl) nameEl.value = item.clientName || "";
  if (addrEl) addrEl.value = item.address || "";
  if (phoneEl) phoneEl.value = item.phone || "";
  if (emailEl) emailEl.value = item.email || "";
  if (subjectEl) subjectEl.value = item.prestation || item.label || "";

  showToast("Facture pré-remplie depuis le planning ✅", "success");
}

function createFactureFromContractItem(contractId) {
  const contract = (typeof getAllContracts === "function" ? getAllContracts() : [])
    .find((c) => c.id === contractId);
  if (!contract) return;

  openFromHome("facture");
  newDocument("facture");

  const client = contract.client || {};
  const nameEl = document.getElementById("clientName");
  const addrEl = document.getElementById("clientAddress");
  const phoneEl = document.getElementById("clientPhone");
  const emailEl = document.getElementById("clientEmail");
  const subjectEl = document.getElementById("docSubject");

  if (nameEl) nameEl.value = client.name || "";
  if (addrEl) addrEl.value = client.address || "";
  if (phoneEl) phoneEl.value = client.phone || "";
  if (emailEl) emailEl.value = client.email || "";
  if (subjectEl) subjectEl.value = typeof getServiceLabelForContract === "function"
    ? getServiceLabelForContract(contract)
    : "";

  showToast("Facture pré-remplie depuis le contrat ✅", "success");
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
  const time =
    document.getElementById("planningPopupTime")?.value || "";
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
        time,
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
        const id =
          Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);

        const payload = {
          id,
          date: dateISO,
          time,
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

        await db.collection("planningManual").doc(id).set(payload, {
          merge: true,
        });
      }
    }

    closeManualPlanningPopup();

    // Proposer confirmation WhatsApp si le client a un téléphone
    if (phone && !editingManualPlanningId) {
      const dateObj = new Date(manualPopupDate + "T00:00:00");
      const JOURS_FR = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
      const MOIS_FR  = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
      const dateFr = `${JOURS_FR[dateObj.getDay()]} ${dateObj.getDate()} ${MOIS_FR[dateObj.getMonth()]}`;
      const heureStr = time ? ` à ${time}` : "";
      const company = (typeof getCompanySettings === "function" ? getCompanySettings() : null) || {};
      const msgRdv = `Bonjour ${client || ""},\n\nNous vous confirmons votre rendez-vous le ${dateFr}${heureStr}${prestation ? " pour : " + prestation : ""}.\n\nCordialement,\n${company.companyName || "AquaClim Prestige"}`;
      showConfirmDialog({
        title: "Confirmation RDV",
        message: `Envoyer la confirmation par WhatsApp à ${client || phone} ?`,
        confirmLabel: "💬 WhatsApp",
        cancelLabel: "Non merci",
        variant: "info",
        icon: "📅",
        onConfirm: () => {
          const cleanPhone = phone.replace(/\D/g, "").replace(/^0/, "33");
          window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msgRdv)}`, "_blank");
        }
      });
    }

    const elPresta = document.getElementById("planningPopupPrestation");
    const elPrestaCustom = document.getElementById("planningPopupPrestationCustom");
    const elClient = document.getElementById("planningPopupClient");
    const elAddress = document.getElementById("planningPopupAddress");
    const elPhone = document.getElementById("planningPopupPhone");
    const elTime = document.getElementById("planningPopupTime");
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
    if (elTime) elTime.value = "";
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


function deleteManualPlanningItem(id, dateStr) {
  showConfirmDialog({
    title: "Supprimer l'intervention",
    message: "Supprimer définitivement cette intervention du planning ?",
    confirmLabel: "Supprimer",
    cancelLabel: "Annuler",
    variant: "danger",
    icon: "🗑️",
    onConfirm: async () => {
      try {
        // 1) Retirer du tableau local + cache immédiat (fonctionne même hors ligne)
        if (Array.isArray(manualPlanningItems)) {
          manualPlanningItems = manualPlanningItems.filter((x) => x && x.id !== id);
          try { localStorage.setItem("manualPlanningItems", JSON.stringify(manualPlanningItems)); } catch (e) {}
        }
        // Ne plus considérer cet item comme "à uploader"
        pendingManualPlanningIds.delete(id);
        _savePendingManualPlanningIds();

        // 2) Rafraîchir tout de suite
        try { renderPlanningWeek(); } catch (e) {}
        if (dateStr) { try { openPlanningDayDetails(dateStr); } catch (e) {} }
        if (typeof showToast === "function") showToast("Intervention supprimée", "info");

        // 3) Firestore
        if (db) await db.collection("planningManual").doc(id).delete();
      } catch (e) {
        console.error("deleteManualPlanningItem error:", e);
      }
    },
  });
}

async function moveManualPlanningItemToDate(manualId, newDateISO) {
  try {
    // update local (si tu as un tableau en mémoire)
    if (Array.isArray(manualPlanningItems)) {
      const it = manualPlanningItems.find((x) => x.id === manualId);
      if (it) it.date = newDateISO;
    }
    // ✅ cache local immédiat (persiste même sans Firestore / hors ligne)
    try { localStorage.setItem("manualPlanningItems", JSON.stringify(manualPlanningItems)); } catch (e) {}

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

  // Date du jour (déclarée ici car utilisée dans les calculs qui suivent)
  const todayISO = new Date().toISOString().split("T")[0];

  // 3a) Lecture des prestations du devis pour extraire service / passages / prix
  //     (fait AVANT pool et pricing pour pouvoir les utiliser dans les deux)

  // Kinds qui représentent des passages/entretien récurrents dans un contrat
  const CONTRACT_PASSAGE_KINDS = [
    "piscine_chlore", "piscine_sel",
    "entretien_clim",
    "entretien_jacuzzi", "vidange_jacuzzi",
    "hivernage_piscine", "remise_service_piscine",
  ];

  const _prestations = Array.isArray(devis.prestations) ? devis.prestations : [];

  // Première prestation de type "passage" dans le devis
  const _mainPrest = _prestations.find(
    (p) => p && !p.isDetail && p.kind !== "detail_line" && CONTRACT_PASSAGE_KINDS.includes(p.kind)
  ) || null;

  // Toutes les prestations de type "passage" pour sommer les quantités
  const _passagePrests = _prestations.filter(
    (p) => p && !p.isDetail && p.kind !== "detail_line" && CONTRACT_PASSAGE_KINDS.includes(p.kind)
  );

  const _devisMainService   = _mainPrest ? _mainPrest.kind : "piscine_chlore";
  const _devisTotalPassages = _passagePrests.reduce((sum, p) => sum + (Number(p.qty) || 0), 0);
  const _devisUnitPrice     = _mainPrest ? (Number(_mainPrest.price) || 0) : 0;

  // ── Extraire la fréquence mensuelle depuis le champ "unit" du devis ──
  // Ex : "3 passages/mois pendant 4 mois" → fréquence = 3
  const _unitText = (_mainPrest?.unit || "").toLowerCase();
  const _freqMatch = _unitText.match(/(\d+)\s*passages?\s*\/\s*mois/);
  const _devisFreqPerMonth = _freqMatch ? parseInt(_freqMatch[1], 10) : 0;

  // ── Durée déduite = total / fréquence (arrondi) ──
  // Options valides dans le select : 4, 5, 6, 12 mois
  const VALID_DURATIONS = [4, 5, 6, 12];
  let _devisDuration = 12; // par défaut 12 mois
  if (_devisFreqPerMonth > 0 && _devisTotalPassages > 0) {
    const rawDur = Math.round(_devisTotalPassages / _devisFreqPerMonth);
    // On cherche la valeur valide la plus proche
    _devisDuration = VALID_DURATIONS.reduce((best, v) =>
      Math.abs(v - rawDur) < Math.abs(best - rawDur) ? v : best
    , 12);
  }

  // ── Date de début : depuis la description ("pour la période juin 2026…") ──
  const MOIS_FR = {
    janvier:1, février:2, fevrier:2, mars:3, avril:4,
    mai:5, juin:6, juillet:7, 'août':8, aout:8,
    septembre:9, octobre:10, novembre:11, décembre:12, decembre:12
  };
  let _devisStartDate = todayISO;
  const _descText = (_mainPrest?.desc || "").toLowerCase();
  const _periodMatch = _descText.match(/(?:p[eé]riode|du|de|pour)\s+(\w+)\s+(\d{4})/);
  if (_periodMatch) {
    const _mName = _periodMatch[1];
    const _mYear = parseInt(_periodMatch[2]);
    const _mNum  = MOIS_FR[_mName];
    if (_mNum && _mYear) {
      _devisStartDate = `${_mYear}-${String(_mNum).padStart(2, "0")}-01`;
    }
  }

  // ── Répartition hiver/été : calculer avec la vraie période du contrat ──
  let _devisPassHiver = 0;
  let _devisPassEte   = _devisFreqPerMonth || 1;

  if (_devisTotalPassages > 0) {
    const _cm = (typeof computeContractMonths === "function")
      ? computeContractMonths(_devisStartDate, _devisDuration)
      : { monthsHiver: 0, monthsEte: _devisDuration };
    const _mH = _cm.monthsHiver || 0;
    const _mE = _cm.monthsEte   || _devisDuration;

    // Cherche les entiers (0..5) × (0..6) qui minimisent l'erreur sur le total
    let _bestErr = Infinity;
    for (let h = 0; h <= 5; h++) {
      for (let e = 0; e <= 6; e++) {
        const err = Math.abs(h * _mH + e * _mE - _devisTotalPassages);
        if (err < _bestErr) {
          _bestErr        = err;
          _devisPassHiver = h;
          _devisPassEte   = e;
        }
      }
    }
  }

  // 3b) Pool : type issu du service détecté dans le devis
  const pool = {
    type: _devisMainService,
    equipment: "",
    volume: "",
    notes: "",
  };

  // 4) Type de client en fonction des conditions du devis
  // devis.conditionsType = "particulier" / "agence"
  const clientType =
    devis.conditionsType === "agence" ? "syndic" : "particulier";

  // 5) Pricing : valeurs tirées du devis

  const pricing = {
    clientType,
    mainService: _devisMainService,
    mode: _devisTotalPassages > 0 ? "custom" : "standard",
    passHiver: _devisPassHiver,
    passEte:   _devisPassEte,

    startDate: _devisStartDate,
    durationMonths: _devisDuration,
    endDateLabel: "",
    periodLabel: "",

    totalPassages:   _devisTotalPassages > 0 ? _devisTotalPassages : 0,
    unitPrice:       _devisUnitPrice,
    customUnitPrice: _devisUnitPrice, // prix forcé (ne sera pas écrasé par le tarif)

    totalHT:   typeof devis.subtotal  === "number" ? devis.subtotal  : 0,
    tvaRate:   typeof devis.tvaRate   === "number" ? devis.tvaRate   : 0,
    tvaAmount: typeof devis.tvaAmount === "number" ? devis.tvaAmount : 0,
    totalTTC:
      typeof devis.totalTTC === "number"
        ? devis.totalTTC
        : typeof devis.subtotal === "number"
          ? devis.subtotal
          : 0,

    // Mode de facturation : repris du devis si disponible, sinon "annuel" par défaut
    billingMode: devis.billingMode || "annuel",

    airbnbOption: false,
  };

  // 6) Objet contrat complet
  // Note : contract.number sera assigné dans buildContractFromForm() à la sauvegarde
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

  // ✅ Facture issue d'un CONTRAT validé → le contrat tient lieu d'accord,
  //    pas besoin de devis obligatoire. On laisse modifier librement.
  if (invoiceDraft.contractId) return false;
  if (Array.isArray(invoiceDraft.prestations) &&
      invoiceDraft.prestations.some((p) =>
        p && (p.kind === "contrat_echeance" || p.kind === "contrat_echeance_initiale"))) {
    return false;
  }

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
        : "remise_service_propre";

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
  return status === "accepte" || status === "realise" || status === "cloture";
}

function newContract() {
  // 🔒 Demande confirmation si des modifs sont en cours
  if (_formDirty && _isAnyFormVisible()) {
    showConfirmDialog({
      title: "Modifications non sauvegardées",
      message: "Tu as des modifications non enregistrées.\nCréer un nouveau contrat sans sauvegarder ?",
      confirmLabel: "Nouveau sans sauvegarder",
      cancelLabel: "Rester",
      variant: "danger",
      icon: "⚠️",
      onConfirm: () => { _clearFormDirty(); newContract(); },
    });
    return;
  }
  _clearFormDirty();
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

  // Remettre le titre générique et le bloc eau par défaut
  const _formTitle = document.querySelector("#contractView h2");
  if (_formTitle) _formTitle.textContent = "🟦 Nouveau contrat d'entretien";
  if (typeof setContractCategory === "function") setContractCategory("eau");

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

  // Réinitialiser le champ "Total passages" en mode auto (verrouillé)
  const ctTotalPassReset = document.getElementById("ctTotalPassages");
  if (ctTotalPassReset) {
    ctTotalPassReset.readOnly = true;
    ctTotalPassReset.classList.remove("ct-editable");
  }

  const ctPassHiver = document.getElementById("ctPassHiver");
  if (ctPassHiver) ctPassHiver.value = "1";

  const ctPassEte = document.getElementById("ctPassEte");
  if (ctPassEte) ctPassEte.value = "2";

  const ctDuration = document.getElementById("ctDuration");
  if (ctDuration) ctDuration.value = "12";
  // Réinitialiser le mode dates libres
  const ctEndDateCustomReset = document.getElementById("ctEndDateCustom");
  if (ctEndDateCustomReset) ctEndDateCustomReset.value = "";
  const ctCustomPassageDatesReset = document.getElementById("ctCustomPassageDates");
  if (ctCustomPassageDatesReset) ctCustomPassageDatesReset.value = "";
  const ctCustomDatesInfoReset = document.getElementById("ctCustomDatesInfo");
  if (ctCustomDatesInfoReset) ctCustomDatesInfoReset.textContent = "";
  window.__ctCustomPassageDates = null;
  window.__ctForcedPassages = null;
  if (typeof onContractDurationChange === "function") onContractDurationChange();

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

        // 🔄 Met à jour le tableau de bord + la liste « Clients à suivre »
        if (typeof refreshHomeStats === "function") {
          try { refreshHomeStats(); } catch (e) {}
        }
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

// Version FRACTIONNAIRE : compte les mois au prorata des jours couverts
// (ex : 01/08 → 15/09 = 1 mois été + 0,5 mois été = 1,5 mois été)
function computeMonthsEteHiverFraction(startISO, endISO) {
  if (!startISO || !endISO) return { monthsEte: 0, monthsHiver: 0 };
  const start = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { monthsEte: 0, monthsHiver: 0 };
  }

  let y = start.getFullYear();
  let m = start.getMonth();
  let monthsEte = 0;
  let monthsHiver = 0;
  const ONE_DAY = 24 * 60 * 60 * 1000;

  while (y < end.getFullYear() || (y === end.getFullYear() && m <= end.getMonth())) {
    const monthStart = new Date(y, m, 1);
    const monthEnd = new Date(y, m + 1, 0);
    const daysInMonth = monthEnd.getDate();

    const effStart = monthStart < start ? start : monthStart;
    const effEnd = monthEnd > end ? end : monthEnd;
    const daysCovered = Math.floor((effEnd - effStart) / ONE_DAY) + 1;
    const fraction = Math.min(1, Math.max(0, daysCovered / daysInMonth));

    // Mai (4) à Octobre (9) = été
    if (m >= 4 && m <= 9) monthsEte += fraction;
    else monthsHiver += fraction;

    m++;
    if (m > 11) { m = 0; y++; }
  }
  return { monthsEte, monthsHiver };
}

// ----- Recalcul global du contrat -----

// ===== Bascule entre les deux pages du formulaire contrat =====
function setContractCategory(cat) {
  const catEl    = document.getElementById("ctContractCategory");
  const eauBlock = document.getElementById("ctEauBlock");
  const climBlock= document.getElementById("ctClimBlock");
  const btnEau   = document.getElementById("ctCatEau");
  const btnClim  = document.getElementById("ctCatClim");
  const durGroup = document.getElementById("ctDurationGroup");
  const totGroup = document.getElementById("ctTotalPassagesGroup");

  if (catEl) catEl.value = cat;

  const isClim = cat === "clim";

  if (eauBlock)  eauBlock.style.display  = isClim ? "none" : "";
  if (climBlock) climBlock.style.display = isClim ? "" : "none";

  if (btnEau)  btnEau.classList.toggle("ct-cat-active", !isClim);
  if (btnClim) btnClim.classList.toggle("ct-cat-active", isClim);

  // Pour clim : durée toujours 12 mois, total passages masqué
  if (durGroup) durGroup.style.display = isClim ? "none" : "";
  if (totGroup) totGroup.style.display = isClim ? "none" : "";
  if (isClim) {
    const dur = document.getElementById("ctDuration");
    if (dur) dur.value = "12";
  }

  recomputeContract();
}

// Active/désactive la saisie manuelle du nombre de visites
function toggleCustomPassages() {
  const cb = document.getElementById("ctCustomPassages");
  const field = document.getElementById("ctTotalPassages");
  if (!cb || !field) return;

  if (cb.checked) {
    field.readOnly = false;
    field.classList.add("ct-editable");
    // petit focus pour inviter à saisir
    setTimeout(() => { try { field.focus(); field.select(); } catch (e) {} }, 30);
  } else {
    field.readOnly = true;
    field.classList.remove("ct-editable");
  }
  recomputeContract();
}

// Bascule entre durée prédéfinie et dates libres (personnalisé)
// 📅 Analyse une liste de dates saisies librement (une par ligne, ou séparées
//    par virgule / point-virgule). Accepte JJ/MM/AAAA, AAAA-MM-JJ, JJ-MM-AAAA,
//    JJ.MM.AAAA. Retourne un tableau ISO (AAAA-MM-JJ) trié, sans doublons.
function parseCustomPassageDates(text) {
  if (!text || typeof text !== "string") return [];
  const out = new Set();
  const tokens = text.split(/[\n,;]+/);
  for (let raw of tokens) {
    const t = (raw || "").trim();
    if (!t) continue;
    let iso = "";
    let m;
    if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) {
      // AAAA-MM-JJ
      iso = `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;
    } else if ((m = t.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/))) {
      // JJ/MM/AAAA (ou . ou -)
      iso = `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
    } else {
      continue; // format non reconnu → ignoré
    }
    // Validation basique de la date
    const d = new Date(iso + "T12:00:00");
    if (isNaN(d.getTime())) continue;
    const [yy, mm, dd] = iso.split("-").map(Number);
    if (d.getFullYear() !== yy || d.getMonth() + 1 !== mm || d.getDate() !== dd) continue;
    out.add(iso);
  }
  return Array.from(out).sort();
}

// 📅 Appelé à chaque saisie dans le champ « dates exactes »
function onCustomPassageDatesInput() {
  recomputeContract();
}

// 📅 Durée approximative en mois entre deux dates ISO, basée sur les JOURS réels
//    (évite le "13 mois" quand début et fin tombent dans le même mois-calendrier).
//    Ex : 31/08/2026 → 28/08/2027 = 362 j ≈ 12 mois (et non 13).
function approxMonthsBetween(startISO, endISO) {
  const s = new Date(startISO + "T00:00:00");
  const e = new Date(endISO + "T00:00:00");
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;
  const days = (e - s) / 86400000;
  return Math.max(1, Math.round(days / 30.4375)); // 30.4375 = jours moyens/mois
}

function onContractDurationChange() {
  const dur        = document.getElementById("ctDuration");
  const customEnd  = document.getElementById("ctEndDateCustom");
  const readonlyEnd= document.getElementById("ctEndDate");
  const label      = document.getElementById("ctEndDateLabel");
  const isCustom   = dur && dur.value === "custom";

  if (customEnd)   customEnd.style.display   = isCustom ? "" : "none";
  if (readonlyEnd) readonlyEnd.style.display = isCustom ? "none" : "";
  if (label)       label.textContent = isCustom ? "Fin du contrat (choisir la date)" : "Fin du contrat (auto)";

  // 📅 Champ « dates de passage exactes » visible uniquement en mode personnalisé
  const customDatesGroup = document.getElementById("ctCustomDatesGroup");
  if (customDatesGroup) customDatesGroup.style.display = isCustom ? "" : "none";
  // Si des dates exactes sont saisies, le sélecteur de fin est piloté par ces dates
  const hasExactDates = isCustom &&
    parseCustomPassageDates(document.getElementById("ctCustomPassageDates")?.value || "").length > 0;
  if (customEnd) customEnd.disabled = hasExactDates;
  if (label && hasExactDates) label.textContent = "Fin du contrat (dernière date saisie)";

  // Pré-remplir le sélecteur avec la fin actuelle si vide
  if (isCustom && customEnd && !customEnd.value) {
    const cur = readonlyEnd?.value;
    if (cur && /^\d{4}-\d{2}-\d{2}$/.test(cur)) customEnd.value = cur;
  }
  recomputeContract();
}

function recomputeContract() {
  // 0) Détecter si c'est un contrat clim
  const _cat = document.getElementById("ctContractCategory")?.value || "eau";
  if (_cat === "clim") {
    recomputeContractClim();
    return;
  }

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

  let startISO = startDateEl.value || "";
  const durationRaw = durationEl.value || "0";
  const isCustomDates = durationRaw === "custom";
  let duration = parseInt(durationRaw, 10) || 0;

  let monthsEte = 0;
  let monthsHiver = 0;
  let endISO = "";

  const _periodFR = (s, e) => {
    const d = new Date(s + "T00:00:00").toLocaleDateString("fr-FR");
    const f = new Date(e + "T00:00:00").toLocaleDateString("fr-FR");
    return `${d} → ${f}`;
  };

  // 3) Calcul des mois + date de fin
  // Reset des dates exactes (seul le mode « dates exactes » ci-dessous les remplit)
  if (!isCustomDates) {
    window.__ctCustomPassageDates = null;
    window.__ctForcedPassages = null;
  }
  if (isCustomDates) {
    // 📅 On regarde d'abord si des DATES EXACTES ont été saisies
    const customDatesEl = document.getElementById("ctCustomPassageDates");
    const parsedDates = customDatesEl ? parseCustomPassageDates(customDatesEl.value) : [];
    const infoEl = document.getElementById("ctCustomDatesInfo");

    if (parsedDates.length) {
      // 📅 Mode DATES EXACTES : début = 1re date, fin = dernière date, total = nb de dates
      window.__ctCustomPassageDates = parsedDates.slice();
      window.__ctForcedPassages = parsedDates.length;

      const firstISO = parsedDates[0];
      const lastISO = parsedDates[parsedDates.length - 1];

      // Le début du contrat s'aligne sur la 1re date (si vide ou postérieur)
      if (!startISO || startISO > firstISO) {
        startISO = firstISO;
        if (startDateEl) startDateEl.value = firstISO;
      }
      endISO = lastISO;

      const customEndEl = document.getElementById("ctEndDateCustom");
      if (customEndEl) customEndEl.value = lastISO;

      const eh = computeMonthsEteHiverFraction(startISO, endISO);
      monthsEte = eh.monthsEte;
      monthsHiver = eh.monthsHiver;
      duration = approxMonthsBetween(startISO, endISO);
      if (endDateEl) endDateEl.value = endISO;
      if (periodEl) periodEl.value = _periodFR(startISO, endISO);
      if (infoEl) {
        infoEl.textContent =
          `✓ ${parsedDates.length} passage(s) — du ` +
          new Date(firstISO + "T00:00:00").toLocaleDateString("fr-FR") +
          " au " +
          new Date(lastISO + "T00:00:00").toLocaleDateString("fr-FR");
      }
    } else {
      // 🗓️ Mode DATES LIBRES simple : la fin vient du sélecteur de date
      window.__ctCustomPassageDates = null;
      window.__ctForcedPassages = null;
      if (infoEl) infoEl.textContent = "";
      const customEndEl = document.getElementById("ctEndDateCustom");
      endISO = customEndEl?.value || "";
      if (startISO && endISO && endISO >= startISO) {
        // Prorata des jours (ex : 01/08 → 15/09 = 1,5 mois été)
        const eh = computeMonthsEteHiverFraction(startISO, endISO);
        monthsEte = eh.monthsEte;
        monthsHiver = eh.monthsHiver;
        duration = approxMonthsBetween(startISO, endISO);
        if (endDateEl) endDateEl.value = endISO;
        if (periodEl) periodEl.value = _periodFR(startISO, endISO);
      } else {
        if (periodEl) periodEl.value = "";
      }
    }
  } else if (startISO && duration > 0) {
    const info = computeContractMonths(startISO, duration);
    monthsEte = info.monthsEte;
    monthsHiver = info.monthsHiver;
    endISO = info.endDateISO;
    if (endDateEl) endDateEl.value = endISO;
    if (periodEl) periodEl.value = _periodFR(startISO, endISO);
  } else {
    if (endDateEl) endDateEl.value = "";
    if (periodEl) periodEl.value = "";
  }

  // 4) Total passages — auto OU personnalisé
  //    (arrondi : en dates libres, les mois peuvent être fractionnaires)
  const autoTotal = Math.round(monthsHiver * passHiver + monthsEte * passEte);
  const customOn = document.getElementById("ctCustomPassages")?.checked || false;

  let totalPassages;
  if (isCustomDates && window.__ctForcedPassages != null) {
    // 📅 Dates exactes : le total est le nombre de dates saisies (non modifiable)
    totalPassages = window.__ctForcedPassages;
    totalPassEl.value = String(totalPassages);
  } else if (customOn) {
    // On respecte la valeur saisie par l'utilisateur (sans l'écraser)
    totalPassages = parseInt(totalPassEl.value || "0", 10) || 0;
  } else {
    totalPassages = autoTotal;
    totalPassEl.value = String(totalPassages);
  }

  if (recapSummary) {
    if (isCustomDates && window.__ctForcedPassages != null) {
      recapSummary.textContent = `Calendrier personnalisé : ${totalPassages} passage(s) à dates fixes`;
    } else if (customOn) {
      recapSummary.textContent = `Nombre de visites personnalisé : ${totalPassages}`;
    } else if (monthsEte + monthsHiver === 0 || (passEte === 0 && passHiver === 0)) {
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

  // Prix unitaire : priorité au prix forcé depuis un devis (ctCustomUnitPrice),
  // sinon on lit le tarif standard de la grille.
  const _customPriceRaw = parseFloat(
    document.getElementById("ctCustomUnitPrice")?.value || "0"
  ) || 0;
  const unitPrice = _customPriceRaw > 0
    ? _customPriceRaw
    : (getTarifFromTemplates(mainService, clientType) || 0);

  let extra = 0;
  if (includeOpen) {
    const kindOpening =
      mainService === "entretien_jacuzzi" || mainService === "spa_jacuzzi"
        ? "vidange_jacuzzi"
        : "remise_service_propre";
    extra += getTarifFromTemplates(kindOpening, clientType) || 0;
  }
  if (includeWinter) {
    extra += getTarifFromTemplates("hivernage_piscine", clientType) || 0;
  }

  // 📅 Contrats à DATES PERSONNALISÉES : la remise en service et l'hivernage
  //    font partie des dates saisies (ce sont 2 des passages listés). On ne les
  //    facture donc pas EN PLUS d'un entretien → on retire 1 entretien par option.
  //    Ex : 21 dates avec remise + hivernage = 19 entretiens + 1 remise + 1 hivernage.
  const _isCustomDatesContract =
    isCustomDates && Array.isArray(window.__ctCustomPassageDates) && window.__ctCustomPassageDates.length > 0;
  const _specialsIncluded = (includeOpen ? 1 : 0) + (includeWinter ? 1 : 0);
  const _entretienCount = _isCustomDatesContract
    ? Math.max(0, totalPassages - _specialsIncluded)
    : totalPassages;

  let totalHT = _entretienCount * unitPrice + extra;
  let airbnbExtra = 0;
  // +20% Airbnb uniquement si aucun prix personnalisé n'est déjà fixé
  // (si le prix vient d'un devis négocié, on respecte ce prix sans majoration)
  const _hasCustomPrice = _customPriceRaw > 0;
  if (airbnbOption && !_hasCustomPrice && totalHT > 0) {
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

  // 📅 Liste des dates de passage prévues (calendrier personnalisé)
  renderContractPassageDatesList(
    isCustomDates && Array.isArray(window.__ctCustomPassageDates)
      ? window.__ctCustomPassageDates
      : [],
  );
}

// 📅 Affiche la liste des dates de passage dans le récapitulatif du contrat,
//    regroupées par mois (ex : « Août 2026 : sam. 31 »).
function renderContractPassageDatesList(dates) {
  const wrap = document.getElementById("ctRecapDatesWrap");
  const box = document.getElementById("ctRecapDates");
  if (!wrap || !box) return;

  if (!Array.isArray(dates) || dates.length === 0) {
    wrap.style.display = "none";
    box.innerHTML = "";
    return;
  }

  const sorted = dates
    .filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x))
    .slice()
    .sort();

  // Regroupement par mois
  const groups = [];
  let current = null;
  sorted.forEach((iso) => {
    const d = new Date(iso + "T00:00:00");
    const monthKey = iso.slice(0, 7);
    const monthLabel = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    if (!current || current.key !== monthKey) {
      current = { key: monthKey, label: monthLabel, items: [] };
      groups.push(current);
    }
    current.items.push(String(d.getDate())); // numéro de jour seul
  });

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  box.innerHTML = groups
    .map(
      (g) =>
        `<div><strong>${cap(g.label)}</strong> : ${g.items.join(", ")}</div>`,
    )
    .join("");
  wrap.style.display = "";
}

// 📅 Génère le HTML du calendrier des passages pour le PDF/contrat client.
//    Retourne "" si le contrat n'utilise pas de dates personnalisées.
function buildContractPassageDatesHtml(pr) {
  const dates = Array.isArray(pr?.customPassageDates)
    ? pr.customPassageDates.filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)).slice().sort()
    : [];
  if (!dates.length) return "";

  const groups = [];
  let current = null;
  dates.forEach((iso) => {
    const d = new Date(iso + "T00:00:00");
    const key = iso.slice(0, 7);
    if (!current || current.key !== key) {
      // Mois abrégé (« Août », « Sept. ») + année
      let ms = d.toLocaleDateString("fr-FR", { month: "short" }).replace(/\.$/, "");
      ms = ms.charAt(0).toUpperCase() + ms.slice(1);
      current = { key, label: `${ms} ${iso.slice(0, 4)}`, days: [] };
      groups.push(current);
    }
    current.days.push(String(d.getDate())); // numéro de jour seul (compact)
  });

  const cells = groups
    .map(
      (g) =>
        `<div style="padding:1px 0;line-height:1.35;">` +
        `<span style="font-weight:700;">${g.label}</span> — ${g.days.join(", ")}` +
        `</div>`,
    )
    .join("");

  return `
    <div style="margin-top:8px;">
      <p><span class="label">📅 Calendrier des passages prévus (${dates.length}) :</span></p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 18px;margin-top:3px;">${cells}</div>
      <p style="font-size:8px;color:#666;margin-top:4px;">
        Dates prévisionnelles, ajustables selon la météo, l’accès au bassin et les contraintes techniques.
      </p>
    </div>`;
}

// ----- Recalcul spécifique contrat CLIM -----
function recomputeContractClim() {
  const startDateEl    = document.getElementById("ctStartDate");
  const durationEl     = document.getElementById("ctDuration");
  const endDateEl      = document.getElementById("ctEndDate");
  const periodEl       = document.getElementById("ctPeriod");
  const unitsEl        = document.getElementById("ctClimUnits");
  const passPerYearEl  = document.getElementById("ctClimPassagesPerYear");
  const pricePerUnitEl = document.getElementById("ctClimPricePerUnit");
  const climTotalDisp  = document.getElementById("ctClimTotalDisplay");
  const climRecapLine  = document.getElementById("ctClimRecapLine");
  const unitInput      = document.getElementById("ctUnitPrice");
  const totalHTInput   = document.getElementById("ctTotalHT");
  const recapPass      = document.getElementById("ctRecapPassages");
  const recapPrice     = document.getElementById("ctRecapPrice");
  const recapTotal     = document.getElementById("ctRecapTotal");
  const warnBox        = document.getElementById("ctWarning");

  const format = typeof formatEuro === "function"
    ? formatEuro
    : (v) => (v && v.toFixed ? v.toFixed(2) + " €" : (v || 0) + " €");

  // Dates (toujours 12 mois pour clim)
  const startISO = startDateEl?.value || "";
  const duration = 12;
  if (durationEl) durationEl.value = "12";

  if (startISO) {
    const info = computeContractMonths(startISO, duration);
    if (endDateEl) endDateEl.value = info.endDateISO || "";
    if (periodEl) {
      const debutFr = new Date(startISO + "T00:00:00").toLocaleDateString("fr-FR");
      const finFr   = info.endDateISO
        ? new Date(info.endDateISO + "T00:00:00").toLocaleDateString("fr-FR")
        : "";
      periodEl.value = debutFr && finFr ? `${debutFr} → ${finFr}` : "";
    }
  } else {
    if (endDateEl) endDateEl.value = "";
    if (periodEl)  periodEl.value  = "";
  }

  // Calcul
  const nbUnits       = parseInt(unitsEl?.value || "1", 10) || 1;
  const passPerYear   = parseInt(passPerYearEl?.value || "1", 10) || 1;
  const pricePerUnit  = parseFloat(pricePerUnitEl?.value || "0") || 0;

  const totalPassages = passPerYear;       // nb de visites dans l'année
  const unitPrice     = pricePerUnit;      // prix par unité par passage
  const totalHT       = nbUnits * passPerYear * pricePerUnit;

  const tvaRate = parseFloat(String(document.getElementById("tvaRate")?.value || "0").replace(",", ".")) || 0;
  const tvaAmount = totalHT * (tvaRate / 100);
  const totalTTC  = totalHT + tvaAmount;
  const clientType = document.getElementById("ctClientType")?.value || "particulier";

  // Affichage dans le bloc clim
  const recapLine = `${nbUnits} unité${nbUnits>1?"s":""} × ${passPerYear} passage${passPerYear>1?"s":""}/an × ${format(pricePerUnit)} = ${format(totalHT)} HT`;
  if (climTotalDisp) climTotalDisp.value = format(totalHT);
  if (climRecapLine) climRecapLine.textContent = recapLine;

  // Aussi mettre à jour les champs partagés (recap bas de page)
  if (unitInput)    unitInput.value    = format(unitPrice);
  if (totalHTInput) totalHTInput.value = format(totalHT);
  if (recapPass)    recapPass.textContent = `${totalPassages} passage${totalPassages > 1 ? "s" : ""} / an — ${nbUnits} unité${nbUnits > 1 ? "s" : ""}`;
  if (recapPrice)   recapPrice.textContent = format(unitPrice) + " / unité / passage";

  if (recapTotal) {
    const displayAmount = tvaRate > 0 ? totalTTC : totalHT;
    const labelAmount   = tvaRate > 0 ? "Montant TTC" : (clientType === "syndic" ? "Montant HT" : "Net à payer");
    recapTotal.textContent = labelAmount + " : " + format(displayAmount);
  }

  if (warnBox) {
    const warnings = [];
    if (!startISO) warnings.push("Merci de renseigner une date de début.");
    if (nbUnits < 1) warnings.push("Le nombre d'unités doit être au moins 1.");
    if (pricePerUnit <= 0) warnings.push("Merci de renseigner un prix par unité.");
    if (warnings.length > 0) {
      warnBox.innerHTML = `<span style="font-size:18px;line-height:1;">⚠️</span><div><strong>Attention :</strong><br>${warnings.join("<br>")}</div>`;
      warnBox.classList.remove("hidden");
    } else {
      warnBox.classList.add("hidden");
      warnBox.innerHTML = "";
    }
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

  // Détecter la catégorie une seule fois (utilisée partout dans cette fonction)
  const _isClimBuild   = (document.getElementById("ctContractCategory")?.value || "eau") === "clim";
  const _buildPoolType = _isClimBuild ? "entretien_clim" : (document.getElementById("ctPoolType")?.value || "piscine_chlore").trim();

  const pool = {
    type: _buildPoolType,
    equipment: _isClimBuild
      ? (document.getElementById("ctClimBrand")?.value || "").trim()
      : (document.getElementById("ctEquipment")?.value || "").trim(),
    volume: _isClimBuild ? "" : (document.getElementById("ctVolume")?.value || "").trim(),
    notes: _isClimBuild
      ? (document.getElementById("ctClimNotes")?.value || "").trim()
      : (document.getElementById("ctNotes")?.value || "").trim(),
  };

  const startDate = (
    document.getElementById("ctStartDate")?.value || ""
  ).trim();

  // Durée : soit une valeur prédéfinie, soit calculée depuis les dates libres
  const _durRaw = document.getElementById("ctDuration")?.value || "0";
  const _isCustomDates = !_isClimBuild && _durRaw === "custom";
  const _customEndISO = (document.getElementById("ctEndDateCustom")?.value || "").trim();
  // 📅 Dates de passage exactes (calendrier personnalisé)
  const _customPassageDates = _isCustomDates
    ? parseCustomPassageDates(document.getElementById("ctCustomPassageDates")?.value || "")
    : [];
  let duration;
  if (_isClimBuild) {
    duration = 12;
  } else if (_isCustomDates && startDate && _customEndISO && _customEndISO >= startDate) {
    duration = approxMonthsBetween(startDate, _customEndISO);
  } else {
    duration = parseInt(_durRaw, 10) || 0;
  }

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

  // Champs spécifiques clim
  const _climUnits       = _isClimBuild ? (parseInt(document.getElementById("ctClimUnits")?.value || "1", 10) || 1) : 0;
  const _climPassPerYear = _isClimBuild ? (parseInt(document.getElementById("ctClimPassagesPerYear")?.value || "1", 10) || 1) : 0;
  const _climPricePerUnit= _isClimBuild ? (parseFloat(document.getElementById("ctClimPricePerUnit")?.value || "0") || 0) : 0;

  const pricing = {
    clientType: clientTypeValue || "particulier",

    mainService: _isClimBuild
      ? "entretien_clim"
      : (document.getElementById("ctMainService")?.value || "piscine_chlore").trim(),
    mode: _isClimBuild ? "clim" : (document.getElementById("ctMode")?.value || "standard").trim(),
    passHiver: _isClimBuild ? 0 : (parseInt(document.getElementById("ctPassHiver")?.value || "0", 10) || 0),
    passEte:   _isClimBuild ? 0 : (parseInt(document.getElementById("ctPassEte")?.value || "0", 10) || 0),

    // Champs clim
    climUnits:        _climUnits,
    climPassPerYear:  _climPassPerYear,
    climPricePerUnit: _climPricePerUnit,

    startDate,
    durationMonths: duration,
    endDateLabel: (document.getElementById("ctEndDate")?.value || "").trim(),
    periodLabel: (document.getElementById("ctPeriod")?.value || "").trim(),
    customDates: _isCustomDates,
    endDateISO: _isCustomDates ? _customEndISO : "",
    // 📅 Calendrier personnalisé : liste des dates de passage exactes (ISO)
    customPassageDates: _customPassageDates,
    customPassages: _isClimBuild ? false : (document.getElementById("ctCustomPassages")?.checked || false),
    totalPassages: _isClimBuild
      ? _climPassPerYear
      : (_customPassageDates.length ? _customPassageDates.length : totalPassages),
    unitPrice: _isClimBuild ? _climPricePerUnit : (parseFloat(unitPriceStr) || 0),
    customUnitPrice: _isClimBuild ? 0 : (parseFloat(document.getElementById("ctCustomUnitPrice")?.value || "0") || 0),
    totalHT: _isClimBuild ? (_climUnits * _climPassPerYear * _climPricePerUnit) : totalHTNum,
    tvaRate,
    tvaAmount: _isClimBuild ? (_climUnits * _climPassPerYear * _climPricePerUnit * tvaRate / 100) : tvaAmount,
    totalTTC:  _isClimBuild ? (_climUnits * _climPassPerYear * _climPricePerUnit * (1 + tvaRate / 100)) : totalTTC,

    // 🔹 NOUVEAUX CHAMPS FACTURATION

    billingMode: document.getElementById("ctBillingMode")?.value || "annuel",
    nextInvoiceDate: "",

    // ---------- Options forfaitaires ----------

    includeOpening: _isClimBuild ? false : (document.getElementById("ctIncludeOpening")?.checked || false),
    includeWinter:  _isClimBuild ? false : (document.getElementById("ctIncludeWinter")?.checked || false),

    // ---------- Usage Airbnb ----------

    airbnbOption: document.getElementById("ctAirbnb")?.checked || false,
  };

  // On récupère l'existant si on édite un contrat déjà sauvegardé

  let existing = null;
  if (currentContractId) {
    existing = getContract(currentContractId);
  }

  // Meta : on part de l'existant en base, puis on fusionne avec
  // les champs cachés du formulaire (sourceDevisId conservé depuis fillContractForm)
  const formDevisId  = document.getElementById("ctMetaSourceDevisId")?.value  || "";
  const formDevisNum = document.getElementById("ctMetaSourceDevisNumber")?.value || "";

  const baseMeta = existing?.meta || {};
  const mergedMeta = {
    ...baseMeta,
    // Les champs cachés ont priorité si remplis (devis créé depuis le form)
    ...(formDevisId  ? { sourceDevisId:     formDevisId  } : {}),
    ...(formDevisNum ? { sourceDevisNumber:  formDevisNum } : {}),
  };

  const contract = {
    id: currentContractId || Date.now().toString(),
    number: existing?.number || getNextContractNumber(),
    client,
    site,
    pool,
    pricing,
    // on garde status/meta si ça existe déjà
    status: existing?.status || null,
    meta: mergedMeta,
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

  // Titre du formulaire dynamique selon le type de contrat
  const _formTitle = document.querySelector("#contractView h2");
  if (_formTitle) {
    const _type = pr.mainService || p.type || "";
    _formTitle.textContent = "🟦 " + (getContractLabel(_type) || "Contrat d'entretien");
  }

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
  const ctEndDateCustom = document.getElementById("ctEndDateCustom");
  const _hasCustomPassageDates = Array.isArray(pr.customPassageDates) && pr.customPassageDates.length > 0;
  if (ctDuration) {
    if (_hasCustomPassageDates || (pr.customDates && pr.endDateISO)) {
      // 🗓️ Contrat à dates libres / calendrier personnalisé
      ctDuration.value = "custom";
      if (ctEndDateCustom) ctEndDateCustom.value = pr.endDateISO || "";
    } else {
      const dur = pr.durationMonths || 12;
      // On ne garde que les durées prédéfinies connues, sinon 12
      ctDuration.value = ["4", "5", "6", "12"].includes(String(dur)) ? String(dur) : "12";
    }
  }

  // 📅 Restituer les dates de passage exactes (calendrier personnalisé)
  const ctCustomPassageDatesEl = document.getElementById("ctCustomPassageDates");
  if (ctCustomPassageDatesEl) {
    ctCustomPassageDatesEl.value = _hasCustomPassageDates
      ? pr.customPassageDates
          .map((iso) => {
            const parts = String(iso).split("-");
            return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : iso;
          })
          .join("\n")
      : "";
  }

  // Appliquer l'affichage (montre/masque le sélecteur de date de fin + dates exactes)
  if (typeof onContractDurationChange === "function") onContractDurationChange();

  const ctEndDate = document.getElementById("ctEndDate");
  if (ctEndDate) ctEndDate.value = pr.endDateLabel || "";

  const ctPeriod = document.getElementById("ctPeriod");
  if (ctPeriod) ctPeriod.value = pr.periodLabel || "";

  const ctTotalPass = document.getElementById("ctTotalPassages");
  if (ctTotalPass) {
    ctTotalPass.value =
      pr.totalPassages != null ? String(pr.totalPassages) : "0";
  }

  // Restaurer le mode "personnalisé" du nombre de visites
  const ctCustomPass = document.getElementById("ctCustomPassages");
  if (ctCustomPass) {
    ctCustomPass.checked = !!pr.customPassages;
    if (ctTotalPass) {
      ctTotalPass.readOnly = !pr.customPassages;
      ctTotalPass.classList.toggle("ct-editable", !!pr.customPassages);
    }
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

  // ---------- 8b. Champs cachés meta (sourceDevisId conservé jusqu'au Save) ----------
  const _hiddenDevisId  = document.getElementById("ctMetaSourceDevisId");
  const _hiddenDevisNum = document.getElementById("ctMetaSourceDevisNumber");
  if (_hiddenDevisId)  _hiddenDevisId.value  = meta.sourceDevisId     || "";
  if (_hiddenDevisNum) _hiddenDevisNum.value = meta.sourceDevisNumber  || "";

  // ---------- 9. PRIX ----------
  const unitInput = document.getElementById("ctUnitPrice");
  const totalHTInp = document.getElementById("ctTotalHT");

  if (unitInput) {
    unitInput.value = pr.unitPrice != null ? pr.unitPrice : "";
  }
  if (totalHTInp) {
    totalHTInp.value = pr.totalHT != null ? pr.totalHT : "";
  }

  // ---------- 9b. Catégorie & champs CLIM ----------
  const isClimFill = (pr.mainService || p.type || "") === "entretien_clim";

  // Activer le bon onglet
  if (typeof setContractCategory === "function") {
    setContractCategory(isClimFill ? "clim" : "eau");
  }

  if (isClimFill) {
    const ctClimUnitsEl       = document.getElementById("ctClimUnits");
    const ctClimPassPerYearEl = document.getElementById("ctClimPassagesPerYear");
    const ctClimPriceEl       = document.getElementById("ctClimPricePerUnit");
    const ctClimBrandEl       = document.getElementById("ctClimBrand");
    const ctClimNotesEl       = document.getElementById("ctClimNotes");
    if (ctClimUnitsEl)        ctClimUnitsEl.value        = pr.climUnits        || 1;
    if (ctClimPassPerYearEl)  ctClimPassPerYearEl.value  = pr.climPassPerYear  || 1;
    if (ctClimPriceEl)        ctClimPriceEl.value        = pr.climPricePerUnit || "";
    if (ctClimBrandEl)        ctClimBrandEl.value        = p.equipment         || "";
    if (ctClimNotesEl)        ctClimNotesEl.value        = p.notes             || "";
  } else {
    // ---------- 10. Type de bassin -> prestation ----------
    const ctPoolTypeEl = document.getElementById("ctPoolType");
    if (ctPoolTypeEl) {
      ctPoolTypeEl.dispatchEvent(new Event("change"));
    }
  }

  // ---------- 10b. Prix personnalisé depuis devis ----------
  // On écrit le prix du devis dans le champ caché AVANT recomputeContract()
  // pour que ce dernier l'utilise au lieu du tarif standard.
  const ctCustomUnitPrice = document.getElementById("ctCustomUnitPrice");
  if (ctCustomUnitPrice) {
    // Priorité : prix personnalisé explicitement sauvegardé (customUnitPrice)
    // sinon unitPrice si le mode est custom (vient d'un devis)
    const customSaved = typeof pr.customUnitPrice === "number" && pr.customUnitPrice > 0
      ? pr.customUnitPrice
      : (pr.mode === "custom" && typeof pr.unitPrice === "number" && pr.unitPrice > 0
          ? pr.unitPrice
          : 0);
    ctCustomUnitPrice.value = String(customSaved);
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

  // Formulaire contrat chargé → plus aucune modif en attente
  _clearFormDirty();
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

  // Blocage si contrat eau avec 0 passages
  const _saveCat = document.getElementById("ctContractCategory")?.value || "eau";
  if (_saveCat !== "clim") {
    const _totalPass = parseInt(document.getElementById("ctTotalPassages")?.value || "0", 10) || 0;
    if (_totalPass === 0) {
      showConfirmDialog({
        title: "Contrat sans passages",
        message: "Le total de passages calculé est 0. Vérifiez la date de début, la durée et la fréquence avant d'enregistrer.",
        confirmLabel: "OK",
        variant: "error",
        icon: "⚠️",
      });
      return;
    }
  }

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

  // ✅ VERROU : facturation autorisée si le contrat est signé OU si le devis lié est accepté
  const isSigned = isContractSigned(contract);
  const devisAccepted = isDevisAcceptedForContract(contract);
  const billingAllowed = isSigned || devisAccepted;

  if (!billingAllowed) {
    // On neutralise l’échéancier tant que pas signé et pas de devis accepté
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
        "⛔ Aucune facture ne sera générée tant que le client n’a pas signé (Bon pour accord) ou qu’un devis accepté n’est pas associé.",
      confirmLabel: "OK",
      cancelLabel: "",
      variant: "info",
      icon: "✍️",
    });

    // On sort : surtout ne pas générer / rebuild / rattraper
    return;
  }

  // ✅ À partir d’ici : contrat signé OU devis accepté → on peut facturer
  if (isNew) {
    // ✅ Délègue toute la logique de facturation initiale + rattrapage à rebuildContractInvoices
    // (facture initiale, nextInvoiceDate, catch-up des mois passés, anti-doublon)
    if (typeof rebuildContractInvoices === "function") {
      rebuildContractInvoices(contract);
    }

    // Sync Firestore contrat (rebuildContractInvoices gère les docs Firestore)
    if (typeof saveSingleContractToFirestore === "function") {
      saveSingleContractToFirestore(contract);
    }

    // Rafraîchir la liste des factures
    if (typeof loadDocumentsList === "function") loadDocumentsList();
  } else {
    // Contrat existant, déjà signé → recalcul facturation
    rebuildContractInvoices(contract);

    showToast("Contrat mis à jour et facturation recalculée", "success");

    return;
  }


  _clearFormDirty();

  // 🔟 Notification de confirmation standard (si on n’est pas sorti avant)
  showToast("Contrat d’entretien enregistré", "success");

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

  const months = approxMonthsBetween(
    start.toISOString().slice(0, 10),
    end.toISOString().slice(0, 10),
  );

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

  // Libellé du bassin (utilise poolType = mainService || p.type pour être cohérent)
  const poolLabel =
    poolType === "piscine_sel"
      ? "Piscine au sel"
      : poolType === "piscine_chlore"
        ? "Piscine au chlore"
        : poolType === "entretien_clim"
          ? "Climatisation / PAC"
          : (poolType === "spa" || poolType === "spa_jacuzzi" || poolType === "entretien_jacuzzi")
            ? "Spa / Jacuzzi"
            : "Installation";

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

  // La majoration +20% n'est affichée que si elle a été effectivement appliquée
  // (pas de majoration quand le prix est personnalisé / issu d'un devis négocié)
  const _airbnbHasMarkup = pr.airbnbOption && !(pr.customUnitPrice > 0);
  if (_airbnbHasMarkup && totalHTSafe > 0) {
    baseHTForInfo = totalHTSafe / 1.2;
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
      <p>Bon pour accord, lu et approuvé.</p>
      <p>Date :</p>
      <p>Signature du client :</p>
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>${getContractLabel(poolType)} – ${c.name || ""}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }

  /* 🖨️ Pagination identique en impression directe ET en "Enregistrer au format PDF".
     Sans ceci, l'export PDF ajoute ses marges par défaut (~10 mm) par-dessus le
     padding de .page → le contenu déborde et crée une page en trop.
     On met les marges du navigateur à 0 : les marges visuelles sont gérées
     uniquement par le padding de .page (11 mm sur les côtés). */
  @page {
    size: A4;
    /* On laisse les marges du navigateur à 0 : l'espace en haut de page 1 vient
       du padding de .page, et l'espace en haut de la page 2 vient d'un bloc
       vide (spacer) placé après le saut de page. Ainsi l'espacement fonctionne
       même si l'utilisateur choisit "Marges : Aucune" dans le dialogue PDF. */
    margin: 0;
  }

body {
  font-family: Arial, sans-serif;
  font-size: 9.5px;
  color:#333;
  display: flex;
  justify-content: center;
}

@media print {
  html, body { width: 210mm; }
  body { display: block; }
  .page { margin: 0 auto; }
}


.page {
  width: 210mm;
  margin: 0 auto;
  padding: 12mm 11mm 8mm 11mm;
  box-sizing: border-box;
}

  .header {
    text-align: center;
    margin-bottom: 4px;
    border-bottom: 1.5px solid #1a74d9;
    padding-bottom: 3px;
  }

  .header img.logo {
    height: 45px;
    margin-bottom: 2px;
  }

  .header h1 {
    color: #1a74d9;
    font-size: 16px;
    margin-bottom: 1px;
  }

  .header .subtitle {
    font-size: 9px;
    margin-bottom: 1px;
  }

  .header .contact {
    font-size: 8.5px;
  }

  h2.contrat-title {
    text-align:center;
    margin: 4px 0 2px;
    font-size: 13px;
    text-transform: uppercase;
  }
  .contrat-period {
    font-size: 9.5px;
    font-weight: normal;
    text-transform: none;
  }

  .contrat-subtitle {
    text-align: center;
    font-size: 9.5px;
    margin-bottom: 3px;
  }

  .ref-bar {
    display:flex;
    justify-content: flex-start;
    font-size: 9px;
    margin: 3px 0 2px;
  }

  .section {
    margin-top: 5px;
  }

  .section-clauses {
    margin-top: 5px;
  }

  /* Sections 6+7 ne se séparent jamais */
  .section-tarifs-sig-wrapper {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .section-title {
    font-weight: bold;
    margin-bottom: 1px;
    color: #1a74d9;
    font-size: 9.5px;
    page-break-after: avoid;
  }

  .block {
    border: 1px solid #cbd3e1;
    border-radius: 5px;
    padding: 3px 6px;
    margin-bottom: 2px;
    background:#fafbff;
  }

  .block p {
    margin: 0;
  }

  .block p,
  .block ul li {
    line-height: 1.18;
  }

  /* Une clause (titre + texte + liste) ne se coupe jamais en plein milieu
     entre deux pages */
  .block p,
  .block ul {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  /* Un titre de clause reste collé au texte qui suit */
  .block p.label {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Grille 2 colonnes pour les clauses */
  .clauses-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px 10px;
    margin-top: 2px;
  }
  .clause-item {
    padding: 1px 0;
  }
  .clause-item p {
    margin: 0;
    line-height: 1.2;
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

  /* ===== BOUTON RETOUR (non imprimé) ===== */
  .print-back-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 9999;
    background: #1a74d9;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,.2);
  }
  .print-back-btn {
    background: #fff;
    color: #1a74d9;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .print-back-label {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
  }
  body { padding-top: 52px; }

  @media print {
    .print-back-bar { display: none !important; }
    body { padding-top: 0 !important; margin:0; }
    @page { margin:0; }
  }
</style>


</head>
<body>
  <!-- Barre retour (masquée à l'impression) -->
  <div class="print-back-bar">
    <button class="print-back-btn" onclick="window.close()">← Retour</button>
    <span class="print-back-label">Contrat — ${escapeHtml(contract.clientName || "")}</span>
  </div>

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
  <div><strong>Contrat n°</strong> ${contract.number || (meta.sourceDevisNumber ? meta.sourceDevisNumber.replace(/^DEV-/, 'CTR-') : 'CTR-' + contract.id.slice(-6))}${meta.sourceDevisNumber ? ` &nbsp;–&nbsp; <span style="font-weight:normal;">Réf. devis : ${meta.sourceDevisNumber}</span>` : ''}</div>
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

      ${c.reference && !meta.sourceDevisNumber && !/^CTR-/i.test(String(c.reference).trim()) ? `<p>Réf. interne client : ${c.reference}</p>` : ""}

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

      <p>Type d’installation : ${poolLabel}</p>
      ${p.volume ? `<p>Volume approximatif : ${p.volume} m³</p>` : ""}
      ${p.notes ? `<p>Particularités / Accès : ${p.notes}</p>` : ""}
    </div>
  </div>

  <!-- 2. Objet -->

  <div class="section">
    <div class="section-title">2. Objet du contrat</div>
    <div class="block">
      <p>${
        isPiscine
          ? `Le présent contrat a pour objet l’entretien régulier, la surveillance et le contrôle de la ${poolLabel.toLowerCase()} et du local technique, selon la fréquence et les prestations décrites ci-après.`
          : isSpa
            ? `Le présent contrat a pour objet l’entretien régulier, la surveillance et le contrôle du spa / jacuzzi et du local technique, selon la fréquence et les prestations décrites ci-après.`
            : `Le présent contrat a pour objet l’entretien régulier, la surveillance et le contrôle des installations énoncées ci-dessus et du local technique, selon la fréquence et les prestations décrites ci-après.`
      }</p>
    </div>
  </div>

  <!-- 3. Fréquence & période -->

  <div class="section">
    <div class="section-title">3. Fréquence des interventions & période</div>
    <div class="block">
    ${poolType === "entretien_clim" ? `
      <div class="grid-2">
        <div>
          <p><span class="label">Type de prestation :</span> Entretien Climatisation / PAC</p>
          <p><span class="label">Nombre d'unités :</span> ${pr.climUnits || 1} unité${(pr.climUnits||1) > 1 ? "s" : ""}</p>
          <p><span class="label">Passages par an :</span> ${pr.climPassPerYear || 1} passage${(pr.climPassPerYear||1) > 1 ? "s" : ""} / an</p>
        </div>
        <div>
          <p><span class="label">Période du contrat :</span> ${startDateFR} → ${endDateFR} (12 mois)</p>
          <p><span class="label">Prix par unité / passage :</span> ${format(pr.climPricePerUnit || 0)}</p>
        </div>
      </div>
      <p class="amount-highlight">
        ${pr.climUnits || 1} unité${(pr.climUnits||1)>1?"s":""} × ${pr.climPassPerYear || 1} passage${(pr.climPassPerYear||1)>1?"s":""} × ${format(pr.climPricePerUnit || 0)} = <strong>${format(totalHTSafe)}</strong> HT
      </p>
    ` : `
      <div class="grid-2">
        <div>
          <p><span class="label">Prestation principale :</span> ${poolLabel}</p>
          ${(Array.isArray(pr.customPassageDates) && pr.customPassageDates.length)
            ? `<p><span class="label">Rythme des passages :</span> Calendrier personnalisé (dates fixes)</p>`
            : `<p><span class="label">Mode de passages :</span>
            ${pr.mode === "standard" ? "Standard : 1/mois hiver – 2/mois été"
              : pr.mode === "intensif" ? "Intensif : 2/mois hiver – 4/mois été"
              : "Personnalisé"}
          </p>
          ${Number(pr.passHiver) > 0 ? `<p><span class="label">Passages hiver (nov → avr) :</span> ${pr.passHiver} / mois</p>` : ""}
          ${Number(pr.passEte) > 0 ? `<p><span class="label">Passages été (mai → oct) :</span> ${pr.passEte} / mois</p>` : ""}`}
        </div>
        <div>
          <p><span class="label">Période du contrat :</span> ${startDateFR} → ${endDateFR} (${pr.durationMonths} mois)</p>
          <p><span class="label">Nombre de visites prévues :</span> ${pr.totalPassages}</p>
        </div>
      </div>
      ${buildContractPassageDatesHtml(pr)}
      <p class="amount-highlight">
        ${(() => {
          const _totalPass = Number(pr.totalPassages || 0);
          const _unit = Number(pr.unitPrice || 0);
          const _ct = pr.clientType || "particulier";
          const _ms = pr.mainService || "piscine_chlore";
          const _openKind = (_ms === "entretien_jacuzzi" || _ms === "spa_jacuzzi")
            ? "vidange_jacuzzi" : "remise_service_propre";
          const _open   = pr.includeOpening ? (getTarifFromTemplates(_openKind, _ct) || 0) : 0;
          const _winter = pr.includeWinter  ? (getTarifFromTemplates("hivernage_piscine", _ct) || 0) : 0;
          // 📅 Dates personnalisées : la remise et l'hivernage font partie des
          //    passages listés → on les retire du nombre d'entretiens facturés.
          const _hasCustomDates = Array.isArray(pr.customPassageDates) && pr.customPassageDates.length > 0;
          const _specials = (pr.includeOpening ? 1 : 0) + (pr.includeWinter ? 1 : 0);
          const _pass = _hasCustomDates ? Math.max(0, _totalPass - _specials) : _totalPass;
          const _base = _pass * _unit;
          const _remainder = totalHTSafe - _base - _open - _winter; // ex : majoration Airbnb
          let rows = `Entretien : ${_pass} passage${_pass > 1 ? "s" : ""} × ${format(_unit)} = ${format(_base)}`;
          if (_open > 0)   rows += `<br>Remise en service (début de saison) : ${format(_open)}`;
          if (_winter > 0) rows += `<br>Hivernage complet : ${format(_winter)}`;
          if (_remainder > 0.5) rows += `<br>Majoration usage locatif / Airbnb (+20 %) : ${format(_remainder)}`;
          rows += `<br><strong>Montant total du contrat : ${format(totalHTSafe)} HT</strong>`;
          return rows;
        })()}
      </p>
    `}
    </div>
  </div>

  <!-- 4. Prestations incluses -->

<div class="section">
  <div class="section-title">4. Prestations incluses</div>
  <div class="block">

    ${
      isPiscine
        ? `
    <p class="label">4.1 Prestations standards (${poolType === "piscine_sel" ? "piscine au sel" : "piscine au chlore"})</p>
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
    <p class="label" style="margin-top:2px;">4.1 Prestations Spa / Jacuzzi</p>
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

    ${
      poolType === "entretien_clim"
        ? `
    <p class="label" style="margin-top:2px;">4.1 Prestations Climatisation / PAC</p>
    <ul>
      <li>Vérification du bon fonctionnement de l’unité intérieure et extérieure.</li>
      <li>Nettoyage des filtres et des grilles d’aération.</li>
      <li>Contrôle des températures de soufflage et des pressions de fonctionnement.</li>
      <li>Vérification des connexions électriques et des sécurités.</li>
      <li>Contrôle du circuit frigorifique (absence de fuites).</li>
      <li>Conseils d’usage et ajustements nécessaires.</li>
    </ul>
    `
        : ""
    }

    ${isPiscine ? (
      (pr.includeOpening || pr.includeWinter)
        ? `
    <p class="label" style="margin-top:2px;">4.2 Prestations saisonnières incluses dans ce contrat</p>
    <ul>
      ${pr.includeOpening ? `<li><strong>Remise en service en début de saison</strong> — remise en eau, redémarrage de la filtration, équilibrage, traitement choc et contrôle complet du bassin.</li>` : ""}
      ${pr.includeWinter ? `<li><strong>Hivernage complet</strong> — nettoyage, traitement choc, abaissement du niveau d’eau, purge des équipements et sécurisation du bassin.</li>` : ""}
    </ul>
    `
        : `
    <p class="label" style="margin-top:2px;">4.2 Remise en service / hivernage</p>
    <p>Remise en service et hivernage (actif ou passif) peuvent être inclus selon l’option choisie et feront l’objet d’une fiche ou d’un devis associé.</p>
    `
    ) : isSpa ? `
    <p class="label" style="margin-top:2px;">4.2 Vidange & remise en eau</p>
    <p>Une vidange complète du spa et sa remise en eau peuvent être incluses selon la fréquence contractuelle.</p>
    ` : ""
    }

  </div>
</div>


<!-- 5. Clauses contractuelles & responsabilités (flux naturel, coupures entre clauses) -->

<div class="section section-clauses">
  <div class="section-title">5. Clauses contractuelles & responsabilités</div>
  <div class="block">

    <p class="label">5.1 Prestations non incluses (hors forfait)</p>
    <ul>
      ${isPiscine ? `
      <li>Dépannage, fuites et réparations hydrauliques.</li>
      <li>Remplacement de matériel (pompe, filtre, cellule d'électrolyse, pièces diverses).</li>
      ` : isSpa ? `
      <li>Dépannage, fuites et réparations hydrauliques du spa / jacuzzi.</li>
      <li>Remplacement de matériel (pompe, jets, carte électronique, résistance, pièces diverses).</li>
      ` : poolType === "entretien_clim" ? `
      <li>Dépannage, fuites de fluide frigorigène et réparations électriques.</li>
      <li>Remplacement de matériel (compresseur, carte électronique, pièces diverses).</li>
      ` : `
      <li>Dépannage, fuites et réparations hydrauliques.</li>
      <li>Remplacement de matériel (pompe, filtre, pièces diverses).</li>
      `}
      ${poolType !== "entretien_clim" ? `<li>Travaux nécessitant une vidange complète.</li>` : ""}
      <li>Nettoyages lourds${poolType === "entretien_clim" ? " (encrassement excessif, rénovation)" : " : eau verte, algues massives, tempête, sable saharien…"}.</li>
      ${pr.airbnbOption
        ? `<li>Dégradations ou nettoyages exceptionnels liés à un usage anormal ou à une négligence des locataires.</li>`
        : `<li>Passages liés à un usage intensif ou à une location saisonnière.</li>`
      }
    </ul>

    <p class="label" style="margin-top:2px;">5.2 Produits & consommables</p>
    <p>${isPiscine
      ? `Les produits (chlore, sel, correcteurs de pH/TAC, floculant…) sont fournis selon devis ou facture. Les surconsommations liées à la météo, à l’usage ou à un matériel défectueux peuvent être facturées.`
      : isSpa
        ? `Les produits (désinfectant, correcteurs de pH, détartrant, produits de choc…) sont fournis selon devis ou facture. Les surconsommations liées à l’usage ou à un matériel défectueux peuvent être facturées.`
        : poolType === "entretien_clim"
          ? `Les consommables (nettoyants, filtres de rechange, produits de traitement d’air) sont fournis selon devis ou facture.`
          : `Les produits nécessaires à l’entretien sont fournis selon devis ou facture. Les surconsommations liées à la météo, à l’usage ou à un matériel défectueux peuvent être facturées.`
    }</p>

    <p class="label" style="margin-top:2px;">5.3 Déchets & conformité</p>
    <p>Les déchets sont évacués conformément à la réglementation applicable et aux filières de traitement en vigueur.</p>

    <p class="label" style="margin-top:2px;">5.4 Accès aux installations – déplacement dû</p>
    <p>Le client garantit l’accès au bassin et au local technique. En cas d’accès impossible (clé absente, code erroné, animaux, etc.), le déplacement reste dû. Le prestataire n’est pas tenu d’attendre au-delà de 10 minutes.</p>

    <p class="label" style="margin-top:2px;">5.5 Obligations du client</p>
    <p>${pr.airbnbOption
      ? `Le client informe le prestataire de tout changement de planning locatif susceptible d’affecter les interventions (travaux, panne, fuite ou modification technique). Le client garantit le bon fonctionnement de la filtration et un temps de filtration suffisant entre chaque rotation de locataires.`
      : `Le client informe de tout changement d’usage (location, forte fréquentation), travaux, panne, fuite ou modification technique. Le client garantit le bon fonctionnement de la filtration (pompe, horloge, vannes) et un temps de filtration suffisant.`
    }</p>

    <p class="label" style="margin-top:2px;">5.6 – 5.7 Obligation de moyens & qualité de l’eau</p>
    <p>AquaClim Prestige intervient avec une obligation de moyens. La qualité de l’eau dépend de facteurs externes (météo, fréquentation, état du matériel, interventions de tiers). L’apparition d’algues ou d’eau trouble peut nécessiter des interventions hors contrat.</p>

    <p class="label" style="margin-top:2px;">5.8 Limitation de responsabilité</p>
    <p>La responsabilité du prestataire est strictement limitée aux dommages directs, prouvés et imputables à une faute caractérisée dans l’exécution de la prestation. Elle ne pourra excéder le montant encaissé au titre du présent contrat sur l’année en cours. Dommages indirects, pertes d’exploitation et préjudices commerciaux sont exclus. Cette limitation ne s’applique pas en cas de faute lourde ou de dommage corporel.</p>

    <p class="label" style="margin-top:2px;">5.9 Installations non conformes</p>
    <p>En cas d’installation dangereuse ou non conforme (fuite importante, électricité défectueuse, surchauffe moteur…), les interventions peuvent être suspendues jusqu’à remise en conformité.</p>

    <p class="label" style="margin-top:2px;">${pr.airbnbOption ? `5.10 Usage locatif – conditions spécifiques` : `5.10 Locations saisonnières & usage intensif`}</p>
    <p>${pr.airbnbOption
      ? (pr.customUnitPrice > 0
          ? `L’usage locatif intensif de l’installation (location courte durée, rotation de locataires) est pris en compte dans la fréquence et le tarif définis au présent contrat. Tout passage exceptionnel rendu nécessaire par une dégradation, une négligence des locataires ou un usage manifestement anormal reste hors forfait et fera l’objet d’une facturation séparée.`
          : `L’usage locatif intensif de l’installation (location courte durée, rotation de locataires) est pris en compte dans la fréquence et le tarif définis au présent contrat, avec application d’une majoration de 20 %. Tout passage exceptionnel rendu nécessaire par une dégradation, une négligence des locataires ou un usage manifestement anormal reste hors forfait et fera l’objet d’une facturation séparée.`)
      : `En cas de location (Airbnb, saisonnier) ou usage intensif, des passages supplémentaires peuvent être nécessaires et facturés.`
    }</p>

    <p class="label" style="margin-top:2px;">5.11 Assurance & exclusions</p>
    <p>AquaClim Prestige est assuré en RC Pro. La responsabilité ne couvre pas les défauts structurels, la plomberie enterrée, le matériel ancien ou non conforme, ni la mauvaise utilisation par le client. Le prestataire n’est pas responsable d’un mauvais traitement lié à un matériel défaillant.</p>

  </div><!-- fin bloc 5.1→5.11 (fin de la page 1) -->

  <!-- Saut de page → 5.12 démarre en HAUT de la page 2 -->
  <div style="page-break-after: always;"></div>
  <!-- Espace vide en haut de la page 2 (fonctionne même avec "Marges : Aucune") -->
  <div style="height: 12mm;"></div>

  <div class="block"><!-- bloc 5.12→5.19 (page 2) -->

    <p class="label" style="margin-top:2px;">5.12 Interventions de tiers</p>
    <p>${pr.clientType === "syndic"
      ? `Le prestataire n’assure pas l’exploitation quotidienne de l’installation. Toute intervention, réglage ou modification réalisée par un tiers exonère le prestataire de toute responsabilité sur les conséquences directes ou indirectes pouvant en résulter.`
      : `Toute intervention, réglage ou modification réalisée sur l’installation par un tiers (électricien, plombier, autre prestataire) sans information préalable d’AquaClim Prestige exonère le prestataire de toute responsabilité sur les conséquences directes ou indirectes pouvant en résulter.`
    }</p>

    <p class="label" style="margin-top:2px;">5.13 Durée – renouvellement – résiliation</p>
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

    <p class="label" style="margin-top:2px;">5.14 Photos (preuve)</p>
    <p>Le prestataire peut prendre des photos avant/après intervention. Elles peuvent servir de preuve en cas de litige.</p>

    <p class="label" style="margin-top:2px;">5.15 Délais d’intervention</p>
    <p>Les interventions sont réalisées dans un délai raisonnable selon le planning. Aucun délai impératif ne peut être imposé sans accord écrit.</p>

    <p class="label" style="margin-top:2px;">5.16 ${isPiscine ? `Eau verte & intempéries` : poolType === "entretien_clim" ? `Encrassement excessif & intempéries` : `Dégradations & intempéries`}</p>
    <p>${isPiscine
      ? `Les eaux vertes, algues, sable saharien, pollen ou dépôts liés aux intempéries relèvent d’interventions hors contrat et peuvent être facturés.`
      : poolType === "entretien_clim"
        ? `Un encrassement excessif des filtres, unités ou gaines dû à un environnement anormal (chantier, poussières, animaux) relève d’interventions hors contrat et peut être facturé.`
        : `Les dépôts calcaires importants, mousses, dégradations liées aux intempéries ou à un usage anormal relèvent d’interventions hors contrat et peuvent être facturés.`
    }</p>

    <p class="label" style="margin-top:2px;">5.17 Réclamations</p>
    <p>Toute réclamation doit être formulée par écrit dans un délai raisonnable, idéalement sous 48 h, afin de permettre une vérification rapide.</p>

    <p class="label" style="margin-top:2px;">5.18 Révision annuelle</p>
    <p>Les tarifs peuvent être révisés chaque 1er janvier selon l’évolution des coûts et de l’indice Syntec.</p>

    <p class="label" style="margin-top:2px;">5.19 Données personnelles</p>
    <p>Les données clients sont utilisées uniquement pour la gestion et ne sont jamais revendues. AquaClim Prestige garantit la confidentialité des accès, codes et informations fournies.</p>

  </div>
</div>

<!-- 6+7 dans un wrapper inséparable pour éviter que la signature parte en page 3 -->
<div class="section-tarifs-sig-wrapper">

<!-- 6. Tarifs & paiement -->
  <div class="section section-tarifs">
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
<p style="margin-top:4px;">
  <strong>Délai de paiement :</strong> À réception de facture, sans escompte pour paiement anticipé.
</p>
<p style="margin-top:4px;">
  <strong>Modes de règlement acceptés :</strong> Virement bancaire, chèque, espèces (dans les limites légales).
</p>
${pr.clientType === "syndic" ? `
<p style="margin-top:4px; font-size:9px; color:#555;">
  Tout retard de paiement entraîne de plein droit l'application de pénalités de retard au taux de 3 fois le taux d'intérêt légal en vigueur, ainsi qu'une indemnité forfaitaire de recouvrement de 40 € (art. L.441-10 du Code de commerce).
</p>` : `
<p style="margin-top:4px; font-size:9px; color:#555;">
  En cas de retard de paiement, le prestataire se réserve le droit de suspendre les interventions après mise en demeure restée sans effet sous 8 jours.
</p>`}

    </div>
  </div>

  <!-- 7. Signature -->
  <div class="section section-signature">
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
              ? `
                <p>Bon pour accord, lu et approuvé.</p>
                <p>Date :</p>
                <p>Signature du client :</p>
              `
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

</div><!-- fin section-tarifs-sig-wrapper -->

</div><!-- fin .page -->
</body>
</html>`;

  // ── iOS : afficher dans l'overlay interne + bouton Imprimer/PDF ──
  if (isIOS()) {
    const overlay  = document.getElementById("pdfViewerOverlay");
    const frame    = document.getElementById("pdfViewerFrame");
    const printBtn = document.getElementById("pdfPrintBtn");
    if (overlay && frame) {
      const blob = new Blob([html], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      frame.src = blobUrl;
      overlay.classList.remove("hidden");
      if (printBtn) printBtn.style.display = "";
      frame.onload = function() {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
        if (!previewOnly) {
          try { frame.contentWindow.focus(); frame.contentWindow.print(); } catch(e) {}
        }
      };
    }
    return;
  }

  // ── Desktop / Android : fenêtre classique ──
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
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
  let titleText = getContractLabel(pr.mainService || pool?.type || "");
  if (clientName) {
    titleText += " – " + clientName;
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

  // synchronisation type de bassin -> prestation principale (eau seulement)
  const poolTypeEl = document.getElementById("ctPoolType");
  const mainServiceEl = document.getElementById("ctMainService");

  if (poolTypeEl && mainServiceEl) {
    poolTypeEl.addEventListener("change", () => {
      const v = poolTypeEl.value;
      if (v === "piscine_sel") mainServiceEl.value = "piscine_sel";
      else if (v === "piscine_chlore") mainServiceEl.value = "piscine_chlore";
      else mainServiceEl.value = "entretien_jacuzzi";
      recomputeContract();
    });
  }

  // Recalcul auto clim quand on change les champs dédiés
  ["ctClimUnits","ctClimPassagesPerYear","ctClimPricePerUnit"].forEach(id => {
    const el2 = document.getElementById(id);
    if (el2) el2.addEventListener("input", recomputeContract);
    if (el2) el2.addEventListener("change", recomputeContract);
  });

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
  const serviceLabel =
    poolType === "entretien_clim"
      ? "Entretien climatisation / PAC"
      : (poolType === "spa" || poolType === "spa_jacuzzi" || poolType === "entretien_jacuzzi")
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

  // 🆔 ID DÉTERMINISTE (contrat + date d'échéance).
  //    Garantit que si le PC et le téléphone génèrent la même échéance avant de
  //    s'être synchronisés, ils écrivent dans LE MÊME document Firestore → un
  //    seul document au final (plus de facture en double pour la même période).
  const _detId = "FAC-" + (contract.id || "x") + "-" + nextISO;

  // 🔒 Anti-doublon : facture déjà créée pour cette échéance ?
  //    (par id déterministe OU par contrat+date+type d'échéance)
  const alreadyExists = getAllDocuments().some(
    (d) =>
      d &&
      (d.id === _detId ||
        (d.type === "facture" &&
          d.contractId === contract.id &&
          d.date === nextISO &&
          Array.isArray(d.prestations) &&
          d.prestations.some(
            (p) =>
              p &&
              (p.kind === "contrat_echeance" ||
                p.kind === "contrat_echeance_initiale"),
          ))),
  );
  if (alreadyExists) return null;

  const nextDate = new Date(nextISO + "T00:00:00");
  if (isNaN(nextDate.getTime())) return null;

  const number = getNextNumber("facture");
  const todayISO = new Date().toISOString().slice(0, 10);

  const tvaRate = Number(pr.tvaRate) || 0;

  // Type de service
  const poolType = pr.mainService || "";
  const serviceLabel =
    poolType === "entretien_clim"
      ? "Entretien climatisation / PAC"
      : (poolType === "spa" || poolType === "spa_jacuzzi" || poolType === "entretien_jacuzzi")
        ? "Entretien spa / jacuzzi"
        : "Entretien piscine";

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
    id: _detId,
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
    // ✅ NE RIEN FACTURER tant que le contrat n'est pas signé ET qu'aucun devis accepté n'est lié
    if (!contract.signature && !isDevisAcceptedForContract(contract)) {
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

    // 🔧 Auto-réparation : si nextInvoiceDate est vide mais qu'on peut facturer,
    //    on le recalcule (cas des contrats sauvegardés avant la signature/acceptation devis)
    if (!pr.nextInvoiceDate && installmentsCount < totalInstallments) {
      pr.nextInvoiceDate = computeNextInvoiceDate(contract) || "";
      if (pr.nextInvoiceDate) {
        contract.pricing = pr;
        const _allC = getAllContracts().map((c) => c.id === contract.id ? contract : c);
        saveContracts(_allC);
      }
    }

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

  // Rafraîchir la liste si des factures ont été générées
  if (typeof loadDocumentsList === "function") loadDocumentsList();
  if (typeof refreshHomeStats === "function") refreshHomeStats();
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
    if (input.classList.contains("prestation-date")) return;
    if (input.id === "validityDate") return;   // ✅ ne pas auto-remplir la validité
    if (input.id === "paymentDate") return;    // ✅ ne pas auto-remplir la date de paiement
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
  // Blob URL partout — on n'utilise plus l'iframe pour iOS PWA
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

  // 🔒 Activer la détection des modifications non sauvegardées
  if (typeof _initDirtyTracking === "function") _initDirtyTracking();

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

  // 📅 Pré-remplissage planning « Le Montanan » (une seule fois)
  if (typeof seedMontananPlanning === "function") seedMontananPlanning();

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










































// ═══════════════════════════════════════════════════════════
// NOUVELLES FONCTIONNALITÉS
// ═══════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────
// PWA iOS – reprise après retour depuis Safari
// ──────────────────────────────────────────────────────────
// Quand window.open() a été appelé et que l'utilisateur revient
// dans la PWA via le geste de retour iOS, la page redevient visible.
// On s'assure que l'overlay PDF est fermé pour ne pas rester bloqué.
window.addEventListener("pageshow", function(e) {
  if (!isStandalonePWA()) return;
  const overlay = document.getElementById("pdfViewerOverlay");
  if (overlay && !overlay.classList.contains("hidden")) {
    // Ne rien faire : l'utilisateur est dans le viewer, c'est normal
    return;
  }
  // Si la page revient depuis le cache bfcache (retour iOS depuis Safari)
  if (e.persisted) {
    // Rien à faire, l'app reprend normalement
  }
});

// ──────────────────────────────────────────────────────────
// MODE SOMBRE
// ──────────────────────────────────────────────────────────
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "1" : "0");
  const btn = document.getElementById("darkModeBtn");
  if (btn) btn.textContent = isDark ? "☀️" : "🌙";
}

/* ═══════════════════════════════════════════════════
   📱 NAVIGATION MOBILE — bottom bar + drawer
═══════════════════════════════════════════════════ */

/**
 * Active visuellement un onglet de la bottom nav mobile.
 * @param {string} key  'home' | 'devis' | 'facture' | 'attest' | 'contrat' | 'ca' | 'settings'
 */
function _mbnActivate(key) {
  document.querySelectorAll(".mbn-item").forEach(b => b.classList.remove("active"));
  const map = {
    home:     "mbn-home",
    devis:    "mbn-devis",
    facture:  "mbn-facture",
    attest:   "mbn-attest",
    contrat:  null,
    ca:       null,
    settings: null,
  };
  const id = map[key];
  if (id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
  }
  // Pour contrat/ca/settings : activer "Plus" pour indiquer qu'on est dans ce menu
  if (!id) {
    const more = document.getElementById("mbn-more");
    if (more) more.classList.add("active");
  }
}

function openMobileDrawer() {
  document.getElementById("mobileDrawerOverlay")?.classList.add("open");
  document.getElementById("mobileDrawer")?.classList.add("open");
  // Activer visuellement "Plus"
  document.querySelectorAll(".mbn-item").forEach(b => b.classList.remove("active"));
  document.getElementById("mbn-more")?.classList.add("active");
}

function closeMobileDrawer() {
  document.getElementById("mobileDrawerOverlay")?.classList.remove("open");
  document.getElementById("mobileDrawer")?.classList.remove("open");
}

// Synchroniser la bottom nav avec les fonctions de navigation principales
// (patch léger pour que le bon onglet s'allume quand on navigue depuis d'autres chemins)
const _origShowHome = showHome;
showHome = function() { _origShowHome.apply(this, arguments); _mbnActivate("home"); };

const _origShowAttestations = showAttestations;
showAttestations = function() { _origShowAttestations.apply(this, arguments); _mbnActivate("attest"); };

const _origOpenFromHome = openFromHome;
openFromHome = function(type) {
  _origOpenFromHome.apply(this, arguments);
  if (type === "devis")   _mbnActivate("devis");
  if (type === "facture") _mbnActivate("facture");
  if (type === "contrat") _mbnActivate("contrat");
};

(function initDarkMode() {
  if (localStorage.getItem("darkMode") === "1") {
    document.body.classList.add("dark-mode");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = "☀️";
  }
})();

// ──────────────────────────────────────────────────────────
// RACCOURCIS CLAVIER
// ──────────────────────────────────────────────────────────
document.addEventListener("keydown", function(e) {
  // Escape : ferme toute popup overlay visible
  if (e.key === "Escape") {
    const openOverlay = Array.from(document.querySelectorAll(".popup-overlay:not(.hidden)")).pop();
    if (openOverlay) {
      openOverlay.classList.add("hidden");
      e.preventDefault();
      return;
    }
  }

  // Ctrl+S : sauvegarde contextuelle
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    const view = typeof getCurrentAppView === "function" ? getCurrentAppView() : "";
    if (view === "devisView" || view === "factureView") {
      if (typeof saveDocument === "function") saveDocument();
    } else if (view === "contractView") {
      if (typeof saveContractToLocal === "function") saveContractToLocal();
    } else if (view === "settingsView") {
      if (typeof saveCompanySettingsFromForm === "function") saveCompanySettingsFromForm();
    }
    return;
  }

  // Ctrl+N : nouveau document contextuel
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    const view = typeof getCurrentAppView === "function" ? getCurrentAppView() : "";
    if (view === "devisView") {
      if (typeof newDocument === "function") newDocument("devis");
    } else if (view === "factureView") {
      if (typeof newDocument === "function") newDocument("facture");
    } else if (view === "contractView") {
      if (typeof newContract === "function") newContract();
    }
    return;
  }
});

// ──────────────────────────────────────────────────────────
// RECHERCHE GLOBALE
// ──────────────────────────────────────────────────────────
function openGlobalSearch() {
  const overlay = document.getElementById("globalSearchPopup");
  if (!overlay) return;
  overlay.classList.remove("hidden");
  const input = document.getElementById("globalSearchInput");
  if (input) { input.value = ""; input.focus(); }
  const results = document.getElementById("globalSearchResults");
  if (results) results.innerHTML = "";
}

function closeGlobalSearch() {
  const overlay = document.getElementById("globalSearchPopup");
  if (overlay) overlay.classList.add("hidden");
}

function onGlobalSearchInput() {
  const input = document.getElementById("globalSearchInput");
  const results = document.getElementById("globalSearchResults");
  if (!input || !results) return;

  const q = input.value.trim().toLowerCase();
  if (q.length < 2) { results.innerHTML = ""; return; }

  const hits = [];

  // Devis & factures
  const docs = typeof getAllDocuments === "function" ? getAllDocuments() : [];
  docs.forEach(d => {
    const num = (d.number || "").toLowerCase();
    const name = (d.client?.name || "").toLowerCase();
    const subj = (d.subject || "").toLowerCase();
    if (num.includes(q) || name.includes(q) || subj.includes(q)) {
      const typeLabel = d.type === "devis" ? "Devis" : "Facture";
      hits.push({ type: typeLabel, label: `${d.number || d.id} – ${d.client?.name || ""}`, sub: d.subject || "", action: () => { closeGlobalSearch(); openFromHome(d.type); if (typeof loadDocument === "function") loadDocument(d.id); } });
    }
  });

  // Clients
  const clients = typeof getClients === "function" ? getClients() : [];
  clients.forEach(c => {
    const n = (c.name || "").toLowerCase();
    const a = (c.address || "").toLowerCase();
    const p = (c.phone || "").toLowerCase();
    if (n.includes(q) || a.includes(q) || p.includes(q)) {
      hits.push({ type: "Client", label: c.name || "", sub: c.address || "", action: () => { closeGlobalSearch(); openClientsListPopup(); setTimeout(() => { const si = document.getElementById("clientSearchInput"); if (si) { si.value = c.name; si.dispatchEvent(new Event("input")); } }, 200); } });
    }
  });

  // Contrats
  const contracts = typeof getAllContracts === "function" ? getAllContracts() : [];
  contracts.forEach(c => {
    const name = (c.client?.name || c.pricing?.clientName || "").toLowerCase();
    const num  = (c.number || "").toLowerCase();
    if (name.includes(q) || num.includes(q)) {
      hits.push({ type: "Contrat", label: `${c.number || c.id} – ${c.client?.name || c.pricing?.clientName || ""}`, sub: "", action: () => { closeGlobalSearch(); openFromHome("contrat"); if (typeof loadContract === "function") loadContract(c.id); } });
    }
  });

  // Planning manuel
  const planning = typeof manualPlanningItems !== "undefined" ? manualPlanningItems : [];
  planning.forEach(p => {
    const lbl = (p.label || p.clientName || "").toLowerCase();
    const cl  = (p.clientName || "").toLowerCase();
    if (lbl.includes(q) || cl.includes(q)) {
      hits.push({ type: "Planning", label: `${p.date || ""} – ${p.label || p.clientName || ""}`, sub: p.address || "", action: () => { closeGlobalSearch(); } });
    }
  });

  if (hits.length === 0) {
    results.innerHTML = '<div class="search-empty">Aucun résultat pour "' + escapeHtml(q) + '"</div>';
    return;
  }

  results.innerHTML = hits.slice(0, 20).map((h, i) =>
    `<div class="search-result-item" onclick="_globalSearchGo(${i})">
      <span class="search-result-type">${escapeHtml(h.type)}</span>
      <span class="search-result-label">${escapeHtml(h.label)}</span>
      ${h.sub ? `<span class="search-result-sub">${escapeHtml(h.sub)}</span>` : ""}
    </div>`
  ).join("");

  window._globalSearchHits = hits;
}

function _globalSearchGo(i) {
  const hits = window._globalSearchHits || [];
  if (hits[i] && typeof hits[i].action === "function") hits[i].action();
}

// ──────────────────────────────────────────────────────────
// RÉCAP PLANNING WHATSAPP
// ──────────────────────────────────────────────────────────
function sendPlanningRecapWhatsApp() {
  const days = (currentPlanningData || []).filter(d => d.items && d.items.length > 0);

  if (days.length === 0) {
    showConfirmDialog({
      title: "Planning vide",
      message: "Aucune intervention cette semaine.",
      confirmLabel: "OK", cancelLabel: "", variant: "info", icon: "📅"
    });
    return;
  }

  const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  const MOIS  = ["jan","fév","mars","avr","mai","juin","juil","aoû","sep","oct","nov","déc"];
  const label = document.getElementById("planningWeekLabel")?.textContent || "";
  const company = (typeof getCompanySettings === "function" ? getCompanySettings() : null) || {};

  let msg = `📅 Planning – ${label}\n${company.companyName || "AquaClim Prestige"}\n`;
  msg += "─".repeat(28) + "\n\n";

  days.forEach(day => {
    const d = new Date(day.date + "T00:00:00");
    msg += `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}\n`;
    day.items.forEach(it => {
      const heure  = it.time ? `${it.time} ` : "";
      const client = it.clientName || it.label || "";
      const presta = it.label && it.label !== client ? ` (${it.label})` : "";
      const addr   = it.address ? ` – ${it.address}` : "";
      msg += `  • ${heure}${client}${presta}${addr}\n`;
    });
    msg += "\n";
  });

  // Envoi vers son propre numéro (paramètres entreprise) ou choix
  const ownPhone = (company.phone || "").replace(/\D/g, "").replace(/^0/, "33");
  const url = ownPhone
    ? `https://wa.me/${ownPhone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
}

// ──────────────────────────────────────────────────────────
// IMPRESSION DU PLANNING SEMAINE
// ──────────────────────────────────────────────────────────
function printPlanningWeek() {
  const grid = document.getElementById("planningGrid");
  const label = document.getElementById("planningWeekLabel");
  if (!grid) return;

  const title = label ? label.textContent : "";
  const html = `<!DOCTYPE html><html lang="fr"><head>
    <meta charset="UTF-8"><title>Planning – ${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; padding-top: 62px; }
      h2 { margin-bottom: 16px; }
      .planning-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
      .day-column { border: 1px solid #ccc; border-radius: 6px; padding: 8px; min-height: 80px; }
      .day-column-header { font-weight: bold; margin-bottom: 6px; font-size: 0.85rem; background:#f0f0f0; padding:4px; border-radius:4px; }
      .planning-item { font-size: 0.78rem; margin-bottom: 4px; padding: 3px 5px; background:#e8f4ff; border-radius:3px; }
      .planning-add-btn { display:none; }
      .print-back-bar { position:fixed; top:0; left:0; right:0; z-index:9999; background:#1a74d9; padding:10px 16px; display:flex; align-items:center; gap:12px; box-shadow:0 2px 8px rgba(0,0,0,.2); }
      .print-back-btn { background:#fff; color:#1a74d9; border:none; border-radius:8px; padding:8px 16px; font-size:14px; font-weight:700; cursor:pointer; }
      .print-back-label { color:#fff; font-size:13px; font-weight:500; }
      @media print { body { padding: 10px; } .print-back-bar { display:none !important; } }
    </style>
  </head><body>
    <div class="print-back-bar">
      <button class="print-back-btn" onclick="window.close()">← Retour</button>
      <span class="print-back-label">📅 Planning – ${title}</span>
    </div>
    <h2>📅 Planning – ${title}</h2>
    ${grid.outerHTML}
    <script>window.onload = function(){ window.print(); }<\/script>
  </body></html>`;

  // iOS PWA : on ne peut pas faire window.open → on affiche dans l'overlay iframe
  if (isIOS() && isStandalonePWA()) {
    const overlay = document.getElementById("pdfViewerOverlay");
    const frame   = document.getElementById("pdfViewerFrame");
    if (overlay && frame) {
      const blob = new Blob([html], { type: "text/html" });
      const url  = URL.createObjectURL(blob);
      frame.src  = url;
      overlay.classList.remove("hidden");
    }
    return;
  }

  // PC / Android : fenêtre classique
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
}

// ──────────────────────────────────────────────────────────
// TABLEAU DE BORD ENRICHI
// ──────────────────────────────────────────────────────────
function computeDashboardExtended() {
  const el = id => document.getElementById(id);
  if (!el("dashConvRate")) return;

  const docs = typeof getAllDocuments === "function" ? getAllDocuments() : [];
  const devis = docs.filter(d => d.type === "devis");
  const factures = docs.filter(d => d.type === "facture");

  // Taux de conversion
  const accepted = devis.filter(d => d.status === "accepte").length;
  const convRate = devis.length > 0 ? Math.round((accepted / devis.length) * 100) : 0;
  if (el("dashConvRate")) el("dashConvRate").textContent = devis.length > 0 ? `${convRate}%` : "–";

  // Meilleur client (par montant facturé)
  const clientTotals = {};
  factures.forEach(f => {
    const name = f.client?.name || "Inconnu";
    clientTotals[name] = (clientTotals[name] || 0) + Number(f.totalTTC || 0);
  });
  const topEntry = Object.entries(clientTotals).sort((a, b) => b[1] - a[1])[0];
  if (el("dashTopClient")) el("dashTopClient").textContent = topEntry ? topEntry[0] : "–";

  // Mois le plus actif (par nb de factures)
  const MOIS_COURT = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
  const monthCounts = {};
  factures.forEach(f => {
    if (!f.date) return;
    const d = new Date(f.date + "T00:00:00");
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  const topMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
  if (el("dashBusiestMonth")) {
    if (topMonth) {
      const [year, month] = topMonth[0].split("-");
      el("dashBusiestMonth").textContent = `${MOIS_COURT[+month]} ${year}`;
    } else {
      el("dashBusiestMonth").textContent = "–";
    }
  }

  const _fmt = (typeof formatEuro === "function")
    ? formatEuro
    : (v) => Number(v || 0).toFixed(2) + " €";

  // 💼 CA contrats actifs (revenus récurrents)
  if (el("dashRecurrent")) {
    let caContrats = 0;
    try {
      const contracts = (typeof getAllContracts === "function") ? getAllContracts() : [];
      contracts.forEach((c) => {
        const st = (typeof computeContractStatus === "function") ? computeContractStatus(c) : null;
        const active = !st ||
          (typeof CONTRACT_STATUS !== "undefined" &&
            (st === CONTRACT_STATUS.EN_COURS || st === CONTRACT_STATUS.A_RENOUVELER));
        if (active) caContrats += Number(c.pricing?.totalTTC || c.pricing?.totalHT || 0);
      });
    } catch (e) {}
    el("dashRecurrent").textContent = caContrats > 0 ? _fmt(caContrats) : "–";
  }

  // 📋 Devis en attente (nombre + montant potentiel)
  if (el("dashPendingDevis")) {
    const pending = devis.filter((d) => !d.status || d.status === "en_attente");
    const pendingAmount = pending.reduce((s, d) => s + Number(d.totalTTC || 0), 0);
    el("dashPendingDevis").textContent =
      pending.length > 0 ? `${pending.length} · ${_fmt(pendingAmount)}` : "0";
  }

  // 🛒 Panier moyen (montant moyen d'une facture)
  if (el("dashAvgBasket")) {
    if (factures.length > 0) {
      const avg = factures.reduce((s, f) => s + Number(f.totalTTC || 0), 0) / factures.length;
      el("dashAvgBasket").textContent = _fmt(avg);
    } else {
      el("dashAvgBasket").textContent = "–";
    }
  }
}

// ──────────────────────────────────────────────────────────
// STATS CLIENTS
// ──────────────────────────────────────────────────────────

let _clientStatsData = [];
let _clientStatsSortKey = "ca";
let _clientStatsSortAsc = false;

function openClientStatsPopup() {
  _buildClientStatsData();
  _renderClientStatsTable();
  const popup = document.getElementById("clientStatsPopup");
  if (popup) popup.classList.remove("hidden");
  const search = document.getElementById("clientStatsSearch");
  if (search) search.value = "";
}

function closeClientStatsPopup() {
  const popup = document.getElementById("clientStatsPopup");
  if (popup) popup.classList.add("hidden");
}

function _buildClientStatsData() {
  const docs = typeof getAllDocuments === "function" ? getAllDocuments() : [];
  const map = {};

  const ensure = name => {
    if (!map[name]) map[name] = { name, ca: 0, paid: 0, unpaid: 0, factures: 0, devis: 0, devisAccepted: 0, lastDate: "" };
  };

  docs.forEach(d => {
    const name = String(d.client?.name || d.clientName || d.client || "").trim();
    if (!name) return;
    ensure(name);
    const entry = map[name];
    const ttc = Number(d.totalTTC || 0);
    const date = d.date || "";

    if (d.type === "facture") {
      entry.factures++;
      entry.ca += ttc;
      if (d.paid) entry.paid += ttc;
      else entry.unpaid += ttc;
    } else if (d.type === "devis") {
      entry.devis++;
      if (d.status === "accepte") entry.devisAccepted++;
    }

    if (date && date > entry.lastDate) entry.lastDate = date;
  });

  _clientStatsData = Object.values(map);
}

function _renderClientStatsTable(filter = "") {
  const tbody = document.getElementById("clientStatsTbody");
  const footer = document.getElementById("clientStatsFooter");
  if (!tbody) return;

  const search = filter || (document.getElementById("clientStatsSearch")?.value || "");
  const lc = search.toLowerCase();

  let rows = _clientStatsData.filter(r => !lc || r.name.toLowerCase().includes(lc));

  rows.sort((a, b) => {
    let va, vb;
    switch (_clientStatsSortKey) {
      case "name":    va = a.name; vb = b.name; break;
      case "ca":      va = a.ca;   vb = b.ca;   break;
      case "factures":va = a.factures; vb = b.factures; break;
      case "devis":   va = a.devis; vb = b.devis; break;
      case "conv":    va = a.devis > 0 ? a.devisAccepted / a.devis : -1;
                      vb = b.devis > 0 ? b.devisAccepted / b.devis : -1; break;
      case "unpaid":  va = a.unpaid; vb = b.unpaid; break;
      case "last":    va = a.lastDate; vb = b.lastDate; break;
      default:        va = a.ca; vb = b.ca;
    }
    if (va < vb) return _clientStatsSortAsc ? -1 : 1;
    if (va > vb) return _clientStatsSortAsc ? 1 : -1;
    return 0;
  });

  const fmt = n => n > 0 ? `${n.toFixed(2).replace(".", ",")} €` : "–";
  const fmtDate = s => s ? s.split("-").reverse().join("/") : "–";

  tbody.innerHTML = rows.map(r => {
    const conv = r.devis > 0 ? Math.round((r.devisAccepted / r.devis) * 100) : null;
    const convClass = conv === null ? "conv-bad" : conv >= 70 ? "conv-good" : conv >= 40 ? "conv-mid" : "conv-bad";
    const convTxt = conv !== null ? `${conv}%` : "–";
    const unpaidClass = r.unpaid > 0 ? "unpaid-cell" : "";
    return `<tr>
      <td class="name-cell" onclick="closeClientStatsPopup(); filterClientsByName('${r.name.replace(/'/g,"\\'")}');">${r.name}</td>
      <td>${fmt(r.ca)}</td>
      <td style="text-align:center;">${r.factures || "–"}</td>
      <td style="text-align:center;">${r.devis || "–"}</td>
      <td class="${convClass}" style="text-align:center;">${convTxt}</td>
      <td class="${unpaidClass}">${fmt(r.unpaid)}</td>
      <td>${fmtDate(r.lastDate)}</td>
    </tr>`;
  }).join("");

  if (footer) footer.textContent = `${rows.length} client${rows.length > 1 ? "s" : ""} · cliquer sur un nom pour ouvrir sa fiche`;
}

function sortClientStats(key) {
  if (_clientStatsSortKey === key) {
    _clientStatsSortAsc = !_clientStatsSortAsc;
  } else {
    _clientStatsSortKey = key;
    _clientStatsSortAsc = false;
  }
  _renderClientStatsTable();
}

function filterClientStatsTable() {
  _renderClientStatsTable();
}

function filterClientsByName(name) {
  openFromHome("facture");
  setTimeout(() => {
    const searchEl = document.getElementById("docSearchInput");
    if (searchEl) {
      searchEl.value = name;
      searchEl.dispatchEvent(new Event("input"));
    }
  }, 350);
}

// ──────────────────────────────────────────────────────────
// MODÈLES DE MESSAGES
// ──────────────────────────────────────────────────────────
const DEFAULT_MSG_TEMPLATES = [
  {
    name: "Envoi devis",
    body: `Bonjour {{client}},

Veuillez trouver ci-joint votre devis {{numero}} d'un montant de {{montant}}.

Ce devis est valable 30 jours. N'hésitez pas à me contacter pour toute question ou ajustement.

Cordialement,
Loïc – AquaClim Prestige
06 03 53 77 73`
  },
  {
    name: "Envoi facture",
    body: `Bonjour {{client}},

Veuillez trouver ci-joint votre facture {{numero}} d'un montant de {{montant}}, suite à notre intervention du {{date}}.

Règlement par virement à réception. Le RIB est disponible sur la facture.

Cordialement,
Loïc – AquaClim Prestige
06 03 53 77 73`
  },
  {
    name: "Confirmation RDV",
    body: `Bonjour {{client}},

Je vous confirme notre rendez-vous pour votre intervention. Je vous contacterai la veille pour confirmer l'heure d'arrivée.

N'hésitez pas à me contacter si vous avez besoin de modifier le créneau.

Cordialement,
Loïc – AquaClim Prestige
06 03 53 77 73`
  },
  {
    name: "Suivi devis (sans réponse)",
    body: `Bonjour {{client}},

Je me permets de vous recontacter au sujet du devis {{numero}} envoyé le {{date}}.

Avez-vous eu l'occasion d'en prendre connaissance ? Je reste disponible pour répondre à vos questions ou adapter la proposition.

Cordialement,
Loïc – AquaClim Prestige
06 03 53 77 73`
  },
  {
    name: "Rapport d'intervention",
    body: `Bonjour {{client}},

Suite à notre intervention du {{date}}, veuillez trouver ci-joint le rapport d'intervention.

Tout est en ordre. N'hésitez pas à me contacter si vous avez la moindre question.

Cordialement,
Loïc – AquaClim Prestige
06 03 53 77 73`
  },
  {
    name: "Devis accepté – planification",
    body: `Bonjour {{client}},

Merci pour votre accord sur le devis {{numero}}.

Je vais planifier votre intervention dans les prochains jours et vous contacterai pour convenir d'une date.

Cordialement,
Loïc – AquaClim Prestige
06 03 53 77 73`
  },
];

function getMsgTemplates() {
  try {
    const stored = JSON.parse(localStorage.getItem("msgTemplates") || "[]");
    // Si aucun modèle enregistré → on charge les modèles par défaut
    if (!Array.isArray(stored) || stored.length === 0) {
      return DEFAULT_MSG_TEMPLATES;
    }
    return stored;
  } catch { return DEFAULT_MSG_TEMPLATES; }
}

function saveMsgTemplates(list) {
  localStorage.setItem("msgTemplates", JSON.stringify(list));
}

function initDefaultMsgTemplates() {
  const stored = localStorage.getItem("msgTemplates");
  if (!stored || JSON.parse(stored).length === 0) {
    saveMsgTemplates(DEFAULT_MSG_TEMPLATES);
  }
}

function renderMsgTemplates() {
  const container = document.getElementById("msgTemplatesList");
  if (!container) return;
  const list = getMsgTemplates();
  if (list.length === 0) {
    container.innerHTML = '<p style="color:#888; font-style:italic;">Aucun modèle enregistré.</p>';
    return;
  }
  container.innerHTML = list.map((t, i) => `
    <div style="border:1px solid #ddd; border-radius:6px; padding:10px 12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
      <div style="flex:1;">
        <strong>${escapeHtml(t.name)}</strong>
        <pre style="margin:6px 0 0; font-size:0.82rem; white-space:pre-wrap; font-family:inherit; color:#555;">${escapeHtml(t.body)}</pre>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <button class="btn btn-danger btn-small" onclick="deleteMsgTemplate(${i})">🗑️</button>
      </div>
    </div>
  `).join("");
}

function addMsgTemplate() {
  const name = (document.getElementById("newTemplateName")?.value || "").trim();
  const body = (document.getElementById("newTemplateBody")?.value || "").trim();
  if (!name || !body) {
    alert("Merci de renseigner le nom et le contenu du modèle.");
    return;
  }
  const list = getMsgTemplates();
  list.push({ name, body });
  saveMsgTemplates(list);
  document.getElementById("newTemplateName").value = "";
  document.getElementById("newTemplateBody").value = "";
  renderMsgTemplates();
  refreshSendTemplateSelect();
  if (typeof _toast === "function") _toast("Modèle ajouté", `"${name}" enregistré.`);
}

function deleteMsgTemplate(i) {
  const list = getMsgTemplates();
  list.splice(i, 1);
  saveMsgTemplates(list);
  renderMsgTemplates();
  refreshSendTemplateSelect();
}

function refreshSendTemplateSelect() {
  const sel = document.getElementById("sendTemplateSelect");
  if (!sel) return;
  const list = getMsgTemplates();
  sel.innerHTML = '<option value="">— Utiliser un modèle de message —</option>' +
    list.map((t, i) => `<option value="${i}">${escapeHtml(t.name)}</option>`).join("");
}

function applyMsgTemplate() {
  const sel = document.getElementById("sendTemplateSelect");
  const textarea = document.getElementById("sendMessagePreview");
  if (!sel || !textarea) return;
  const idx = parseInt(sel.value, 10);
  if (isNaN(idx)) return;
  const list = getMsgTemplates();
  const tpl = list[idx];
  if (!tpl) return;

  const doc = typeof currentSendDoc !== "undefined" ? currentSendDoc : null;
  let msg = tpl.body;
  if (doc) {
    msg = msg
      .replace(/\{\{client\}\}/g, doc.client?.name || "")
      .replace(/\{\{montant\}\}/g, doc.totalTTC ? (Number(doc.totalTTC).toFixed(2) + " €") : "")
      .replace(/\{\{numero\}\}/g, doc.number || doc.id || "")
      .replace(/\{\{date\}\}/g, doc.date || "");
  }
  textarea.value = msg;
}

// Init modèles au chargement des paramètres
const _origShowSettings = typeof showSettings === "function" ? showSettings : null;
if (_origShowSettings) {
  window.showSettings = function() {
    _origShowSettings();
    renderMsgTemplates();
    refreshSendTemplateSelect();
  };
}
