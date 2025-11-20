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
    priceParticulier: 90,
    priceSyndic: 110,
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
    label: "Entretien jacuzzi",
    kind: "entretien_jacuzzi",
    title: "Entretien jacuzzi / spa",
    priceParticulier: 70,
    priceSyndic: 90,
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
    title: "Remplacement pompe piscine (main-d’œuvre uniquement)",
    priceParticulier: 150,
    priceSyndic: 180,
    descParticulier: "Remplacement pompe (main d’œuvre uniquement).",
    descSyndic:
      "Dépose/installation, raccordement, réglages et rapport technicien. Main d’œuvre uniquement."
  },

  // 12. Remplacement cellule électrolyseur (MO)
  {
    label: "Remplacement cellule électrolyseur (MO)",
    kind: "remplacement_cellule_mo",
    title: "Remplacement cellule électrolyseur (main-d’œuvre uniquement)",
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

const MARGIN_MULTIPLIER = 1.4;

// ================== VARIABLES GLOBALES ==================

let currentDocumentId = null;
let prestationCount = 0;
let currentListType = "devis"; // "devis" ou "facture"

// Firebase Firestore
let db = null;

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
    const snapshot = await db.collection("documents").get();
    const cloudDocs = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data) cloudDocs.push(data);
    });

    if (cloudDocs.length > 0) {
      // Cloud -> local
      localStorage.setItem("documents", JSON.stringify(cloudDocs));
    } else {
      // Cloud vide, on pousse le local si présent
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

    loadYearFilter();
    loadDocumentsList();
  } catch (e) {
    console.error("Erreur de synchronisation Firestore :", e);
  }
}

function saveSingleDocumentToFirestore(doc) {
  if (!db) {
    console.warn("Firestore non initialisé, pas d'envoi cloud.");
    return;
  }
  if (!doc || !doc.id) {
    console.warn("Document sans id, impossible de sauvegarder dans Firestore.");
    return;
  }

  db.collection("documents")
    .doc(doc.id)
    .set(doc)
    .catch((err) =>
      console.error("Erreur Firestore (saveSingleDocumentToFirestore) :", err)
    );
}

// ================== HELPERS GÉNÉRAUX ==================

function formatEuro(value) {
  return (
    (Number(value) || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €"
  );
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

// ================== TABS DEVIS / FACTURES ==================

function switchListType(type) {
  currentListType = type;

  document
    .getElementById("tabDevis")
    .classList.toggle("active", type === "devis");
  document
    .getElementById("tabFactures")
    .classList.toggle("active", type === "facture");

  document.getElementById("listTitle").textContent =
    type === "devis" ? "Liste des devis" : "Liste des factures";

  document
    .getElementById("yearFilterContainer")
    .classList.toggle("hidden", type !== "facture");
  document
    .getElementById("exportContainer")
    .classList.toggle("hidden", type !== "facture");

  // Activation / désactivation des boutons "Nouveau devis / facture"
  const btnDevis = document.getElementById("createDevis");
  const btnFacture = document.getElementById("createFacture");

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

  resetTarifsPanel();

  document.getElementById("formView").classList.add("hidden");
  document.getElementById("listView").classList.remove("hidden");
  currentDocumentId = null;

  loadYearFilter();
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

// ================== FILTRE ANNÉE FACTURES ==================

function loadYearFilter() {
  const select = document.getElementById("yearFilter");
  if (!select) return;
  select.innerHTML = '<option value="all">Toutes</option>';
  if (currentListType !== "facture") return;
  const docs = getAllDocuments().filter((d) => d.type === "facture");
  const years = new Set();
  docs.forEach((d) => {
    if (d.date) years.add(new Date(d.date).getFullYear());
  });
  Array.from(years)
    .sort()
    .forEach((y) => {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = y;
      select.appendChild(opt);
    });
}

// ================== TVA & TYPE DOCUMENT ==================

function getCurrentClientType() {
  const part = document.getElementById("clientParticulier");
  const syn = document.getElementById("clientSyndic");
  if (syn && syn.checked) return "syndic";
  return "particulier";
}

function setTVA(rate) {
  const tvaInput = document.getElementById("tvaRate");
  const tvaNote = document.getElementById("tvaNote");
  const totalLabel = document.getElementById("totalLabel");

  if (tvaInput) {
    tvaInput.value = rate.toString();
  }

  const clientType = getCurrentClientType();

  if (rate === 0) {
    if (clientType === "syndic") {
      if (tvaNote) tvaNote.textContent = "";
      if (totalLabel) totalLabel.textContent = "TOTAL HT :";
    } else {
      if (tvaNote)
        tvaNote.textContent = "TVA non applicable, article 293 B du CGI.";
      if (totalLabel) totalLabel.textContent = "NET À PAYER :";
    }
  } else {
    if (tvaNote) tvaNote.textContent = "";
    if (totalLabel) totalLabel.textContent = "TOTAL TTC :";
  }

  calculateTotals();
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

  if (type === "devis") {
    validityGroup.style.display = "block";
    const base = docDate ? new Date(docDate) : new Date();
    const validity = new Date(base);
    validity.setDate(validity.getDate() + 30);
    validityInput.value = validity.toISOString().split("T")[0];
    paymentSection.classList.add("hidden");
  } else {
    validityGroup.style.display = "none";
    validityInput.value = "";
    paymentSection.classList.remove("hidden");
  }

  refreshDevisStatusUI(type, validityInput.value);
  updateButtonColors();
}

function updateTransformButtonVisibility() {
  const btn = document.getElementById("transformButton");
  if (!btn) return;
  const type = document.getElementById("docType").value;
  btn.style.display =
    type === "devis" && currentDocumentId ? "inline-block" : "none";
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

  if (!sel || !sel.value) {
    wrapper.style.display = "none";
    dateInput.value = "";
    return;
  }

  wrapper.style.display = "block";

  if (!dateInput.value) {
    const docDate = document.getElementById("docDate")?.value;
    dateInput.value = docDate || new Date().toISOString().split("T")[0];
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

  const optionsHtml = PRESTATION_TEMPLATES.map(
    (t, idx) => `<option value="${idx}">${t.label}</option>`
  ).join("");

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
    <div class="form-group no-print">
      <label>&nbsp;</label>
      <button
        type="button"
        class="btn btn-danger btn-small"
        onclick="removePrestation(${prestationCount})"
      >
        🗑️
      </button>
    </div>
  `;

  container.appendChild(line);
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
  )
    return;

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
        title = "Entretien climatisation" + plural;
      }
      descInput.value = title;
    }
  }

  
// Prix (avec prise en compte des tarifs personnalisés)
if (priceInput) {
  const custom = getCustomPrices(); 
  let price = 0;

  if (template.kind) {
    const key =
      template.kind + "_" +
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

        // Entretien clim : gestion du tarif dégressif basé sur un pourcentage
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

        // Sécurité : si base pas défini, on retombe sur tes anciens tarifs
        if (!base) {
          base = (clientType === "syndic") ? 110 : 90;
        }

        // On garde TES réductions actuelles, mais exprimées en % :
        // Particulier : 1 = 90 / 2 = 75 / 3+ = 65
        //   → 2 = -16,67 %, 3+ = -27,78 %
        // Syndic : 1 = 110 / 2 = 90 / 3+ = 80
        //   → 2 = -18,18 %, 3+ = -27,27 %

        if (clientType === "particulier") {
          if (n === 1) {
            price = base;
          } else if (n === 2) {
            price = base * (1 - 15 / 90); // -16,67 %
          } else {
            price = base * (1 - 25 / 90); // -27,78 %
          }
        } else {
          if (n === 1) {
            price = base;
          } else if (n === 2) {
            price = base * (1 - 20 / 110); // -18,18 %
          } else {
            price = base * (1 - 30 / 110); // -27,27 %
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

  const siteBlock = document.getElementById("siteBlock");
  const siteNameInp = document.getElementById("siteName");
  const siteAddrInp = document.getElementById("siteAddress");
  if (siteNameInp) siteNameInp.value = "";
  if (siteAddrInp) siteAddrInp.value = "";
  if (siteBlock) siteBlock.style.display = "none";

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

  const descInput = line.querySelector(".prestation-desc");
  const qtyInput = line.querySelector(".prestation-qty");
  const priceInput = line.querySelector(".prestation-price");
  const unitInput = line.querySelector(".prestation-unit");
  const templateSelect = line.querySelector(".prestation-template");

  if (descInput) descInput.value = p.desc;
  if (qtyInput) qtyInput.value = p.qty;
  if (priceInput) priceInput.value = p.price;
  if (unitInput) unitInput.value = p.unit || "";

  // 🔁 on remet le bon modèle dans le select
  if (templateSelect) {
    const idx = PRESTATION_TEMPLATES.findIndex((t) => t.kind === p.kind);
    templateSelect.value = idx >= 0 ? String(idx) : "0";
  }

  // 🧠 ICI on re-calcule le "prix de base" à partir du modèle + type client
  const template = PRESTATION_TEMPLATES.find((t) => t.kind === p.kind);
  if (template) {
    const custom = getCustomPrices();
    const clientType =
      (document.getElementById("clientSyndic")?.checked ? "syndic" : "particulier");

    const key = template.kind + "_" + clientType;
    let base =
      custom[key] != null
        ? custom[key]
        : clientType === "syndic"
        ? (template.priceSyndic || 0)
        : (template.priceParticulier || 0);

    line.dataset.basePrice = base.toFixed(2); // ✅ base = tarif pour 1 clim
  }

  // dates…
  const datesContainer = line.querySelector(".prestation-dates");
  datesContainer.innerHTML = "";
  const dates = (p.dates && p.dates.length) ? p.dates : [""];
  dates.forEach((dv) => {
    const row = document.createElement("div");
    row.className = "prestation-date-row";

    const inp = document.createElement("input");
    inp.type = "date";
    inp.className = "prestation-date";
    if (dv) inp.value = dv;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-danger btn-small date-remove-btn no-print";
    removeBtn.textContent = "✖";
    removeBtn.onclick = function () {
      removePassageDate(removeBtn);
    };

    row.appendChild(inp);
    row.appendChild(removeBtn);
    datesContainer.appendChild(row);
  });
});

calculateTotals(); // et on laisse faire la logique dégressive normale


  document.getElementById("formTitle").textContent =
    (doc.type === "devis" ? "Devis " : "Facture ") + doc.number;
}

// ================== SAUVEGARDE / SUPPRESSION / DUPLICATION ==================

function saveDocument() {
  const clientName = document.getElementById("clientName").value.trim();
  const clientAddress = document.getElementById("clientAddress").value.trim();
  const clientPhone = document.getElementById("clientPhone").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const docSubject = (document.getElementById("docSubject")?.value || "").trim();
  const siteName = (document.getElementById("siteName")?.value || "").trim();
  const siteAddress = (document.getElementById("siteAddress")?.value || "").trim();

  if (!clientName || !clientAddress) {
    alert("Veuillez renseigner au minimum le nom et l'adresse du client.");
    return;
  }

  if (!docSubject) {
    alert("Veuillez saisir l'objet du devis / de la facture.");
    return;
  }

  const prestations = [];
  let missingPurchase = false; // ← pour détecter les produits/fournitures sans prix d'achat

  document.querySelectorAll(".prestation-line").forEach((line) => {
    const kind = line.dataset.kind || "";

    // ⚠️ Prix d'achat obligatoire pour Produits / Fournitures
    if (kind === "produits" || kind === "fournitures") {
      const purchaseInput = line.querySelector(".prestation-purchase");
      const purchaseVal = parseFloat(purchaseInput?.value || "0");
      if (!purchaseVal || purchaseVal <= 0) {
        missingPurchase = true;
      }
    }

    const desc = (line.querySelector(".prestation-desc")?.value || "").trim();
    const qty = parseFloat(
      line.querySelector(".prestation-qty")?.value || "0"
    );
    const price = parseFloat(
      line.querySelector(".prestation-price")?.value || "0"
    );
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
    alert("Merci de renseigner le prix d'achat pour toutes les prestations Produits / Fournitures.");
    return;
  }


  if (prestations.length === 0) {
    alert("Ajoutez au moins une prestation");
    return;
  }

  const docType = document.getElementById("docType").value;
  const docNumber = document.getElementById("docNumber").value;
  const docDate = document.getElementById("docDate").value;
  const validityDate = document.getElementById("validityDate").value;
  const tvaRate = parseFloat(document.getElementById("tvaRate").value) || 0;
  const notes = document.getElementById("notes").value;
  const existing = currentDocumentId ? getDocument(currentDocumentId) : null;

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
      name: clientName,
      address: clientAddress,
      phone: clientPhone,
      email: clientEmail
    },
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

  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) docs[idx] = doc;
  else docs.push(doc);

  saveDocuments(docs);
  saveSingleDocumentToFirestore(doc);

  alert("Document enregistré avec succès !");
  currentDocumentId = doc.id;
  loadDocumentsList();
  updateTransformButtonVisibility();
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
    alert("Aucun document à dupliquer. Enregistre d'abord le devis ou la facture.");
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

// ================== LISTE DOCUMENTS & STATUTS ==================

function loadDocumentsList() {
  const docs = getAllDocuments();
  let filtered = docs.filter((d) => d.type === currentListType);

  if (currentListType === "facture") {
    const yearSel = document.getElementById("yearFilter");
    if (yearSel && yearSel.value !== "all") {
      const y = parseInt(yearSel.value, 10);
      filtered = filtered.filter(
        (d) => d.date && new Date(d.date).getFullYear() === y
      );
    }
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  const tbody = document.getElementById("documentsTableBody");
  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="no-docs-cell">Aucun document pour le moment</td></tr>';
    return;
  }

  filtered.forEach((doc) => {
    const tr = document.createElement("tr");
const typeLabel = doc.type === "devis" ? "Devis" : "Facture";

let badgeClass;
if (doc.type === "devis") {
  badgeClass = "badge-devis";
} else {
  // Facture : rouge si non payée, vert si payée
  badgeClass = doc.paid ? "badge-facture-paid" : "badge-facture-unpaid";
}


    let statutHTML = "";

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

      const badgeStatus = doc.paid ? "badge-paid" : "badge-unpaid";
      const statusText = doc.paid
        ? "🟢 Payée" + (modeLabel ? " (" + modeLabel + ")" : "")
        : "🔴 Non payée";

      statutHTML =
        `<span class="badge ${badgeStatus}">${statusText}</span><br>` +
        `<div style="font-size:11px;margin-top:4px;white-space:nowrap;">` +
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
    } else {
      let storedStatus = doc.status || "en_attente";
      let displayStatus = storedStatus;

      if (isDevisExpired("devis", doc.validityDate) && storedStatus === "en_attente") {
        displayStatus = "expire";
      }

      let badgeDevisClass = "badge-devis-en-attente";
      let text = "En attente";

      if (displayStatus === "accepte") {
        badgeDevisClass = "badge-devis-accepte";
        text = "Accepté";
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

// Aperçu = même couleur que Imprimer
const previewBtnClass = printBtnClass;
// Supprimer = toujours rouge
const deleteBtnClass = "btn btn-danger btn-small";

const actionsHtml =
  `<div class="actions-btns">` +
    `<div class="actions-btns-row">` +
      `<button class="${openBtnClass}" type="button" onclick="loadDocument('${doc.id}')">Modifier</button>` +
      `<button class="${printBtnClass}" type="button" onclick="openPrintable('${doc.id}')">Imprimer</button>` +
    `</div>` +
    `<div class="actions-btns-row">` +
      `<button class="${previewBtnClass}" type="button" onclick="openPrintable('${doc.id}', true)">Aperçu</button>` +
      `<button class="${deleteBtnClass}" type="button" onclick="deleteDocument('${doc.id}')">Supprimer</button>` +
    `</div>` +
  `</div>`;




    tr.innerHTML =
      `<td><span class="badge ${badgeClass}">${typeLabel}</span></td>` +
      `<td>${doc.number}</td>` +
      `<td>${doc.client?.name || ""}</td>` +
      `<td>${
        doc.date ? new Date(doc.date).toLocaleDateString("fr-FR") : ""
      }</td>` +
      `<td><strong>${formatEuro(doc.totalTTC)}</strong></td>` +
      `<td class="status-cell">${statutHTML}</td>` +
      `<td>${actionsHtml}</td>`;

    tbody.appendChild(tr);
  });
}

function setPaymentMode(id, mode) {
  const docs = getAllDocuments();
  const doc = docs.find((d) => d.id === id);
  if (!doc) return;

  if (!mode) {
    doc.paymentMode = "";
    doc.paid = false;
    doc.paymentDate = "";
  } else {
    doc.paymentMode = mode;
    doc.paid = true;

    if (mode === "virement" || mode === "cheque") {
      doc.paymentDate = doc.paymentDate || doc.date;
    } else {
      doc.paymentDate = doc.date;
    }
  }

  saveDocuments(docs);
  saveSingleDocumentToFirestore(doc);
  loadDocumentsList();
}

function setDevisStatus(id, status) {
  const docs = getAllDocuments();
  const doc = docs.find((d) => d.id === id);
  if (!doc || doc.type !== "devis") return;

  doc.status = status;
  saveDocuments(docs);
  saveSingleDocumentToFirestore(doc);
  loadDocumentsList();
}

// ================== TRANSFORMATION DEVIS -> FACTURE ==================

function transformToInvoice() {
  if (!currentDocumentId) {
    alert("Ouvrez d'abord un devis pour le transformer.");
    return;
  }
  const devis = getDocument(currentDocumentId);
  if (!devis || devis.type !== "devis") {
    alert("Ce document n'est pas un devis.");
    return;
  }

  const docs = getAllDocuments();
  const facture = JSON.parse(JSON.stringify(devis));

  facture.id = Date.now().toString();
  facture.type = "facture";
  facture.number = getNextNumber("facture");
  facture.date = new Date().toISOString().split("T")[0];
  facture.validityDate = "";
  facture.paid = false;
  facture.paymentMode = "";
  facture.paymentDate = "";
  facture.status = "";
  facture.createdAt = new Date().toISOString();

  docs.push(facture);
  saveDocuments(docs);
  saveSingleDocumentToFirestore(facture);

  alert("Devis transformé en facture : " + facture.number);
  loadDocument(facture.id);
}

// ================== EXPORT CSV FACTURES ==================

function exportFacturesCSV() {
  const docs = getAllDocuments().filter((d) => d.type === "facture");
  if (docs.length === 0) {
    alert("Aucune facture à exporter.");
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

    PRESTATION_TEMPLATES.forEach((t) => {
  // ⛔ On ignore Produits & Fournitures dans le tableau des tarifs
  if (
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

  const tr = document.createElement("tr");
  tr.innerHTML =
    `<td>${t.label}</td>` +
    `<td><input type="number" step="0.01" class="tarif-part" ` +
    `oninput="syncTarifRow(this)" data-kind="${t.kind}" data-type="particulier" value="${valPart}"></td>` +
    `<td><input type="number" step="0.01" class="tarif-syn" ` +
    `oninput="syncTarifRow(this)" data-kind="${t.kind}" data-type="syndic" value="${valSyn}"></td>`;
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
    btn.textContent = "📋 Tarifs prestations";
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
  alert("Tarifs enregistrés. Ils seront utilisés pour les prochaines lignes ajoutées.");
}

function resetTarifs() {
  if (
    !confirm(
      "Réinitialiser tous les tarifs personnalisés et revenir aux valeurs par défaut ?"
    )
  )
    return;
  saveCustomPrices({});
  alert("Tarifs réinitialisés.");
  openTarifsPanel();
}
// ================== MODAL DE CONFIRMATION ==================

function showConfirmDialog({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuler",
  icon,
  variant = "info", // "danger", "success", "info"
  onConfirm
}) {
  const overlay = document.getElementById("confirmOverlay");
  const titleEl = document.getElementById("confirmTitle");
  const msgEl = document.getElementById("confirmMessage");
  const btnOk = document.getElementById("confirmOk");
  const btnCancel = document.getElementById("confirmCancel");
  const iconEl = document.getElementById("confirmIcon");
  const box = overlay ? overlay.querySelector(".confirm-box") : null;

  if (!overlay || !titleEl || !msgEl || !btnOk || !btnCancel || !box || !iconEl) {
    // fallback sécurité : confirm natif si le HTML n'est pas là
    if (confirm(message)) {
      if (typeof onConfirm === "function") onConfirm();
    }
    return;
  }

  titleEl.textContent = title || "";
  msgEl.textContent = message || "";

  btnOk.textContent = confirmLabel || "OK";
  btnCancel.textContent = cancelLabel || "Annuler";

  // reset classes
  box.classList.remove("danger", "success", "info");
  iconEl.classList.remove("danger", "success", "info");

  // applique la variante
  if (variant === "danger") {
    box.classList.add("danger");
    iconEl.classList.add("danger");
  } else if (variant === "success") {
    box.classList.add("success");
    iconEl.classList.add("success");
  } else {
    box.classList.add("info");
    iconEl.classList.add("info");
  }

  // icône par défaut si pas fournie
  if (!icon) {
    if (variant === "danger") icon = "⚠️";
    else if (variant === "success") icon = "✔️";
    else icon = "ℹ️";
  }
  iconEl.textContent = icon;

  // Nettoyage des anciens handlers
  btnOk.onclick = null;
  btnCancel.onclick = null;

  btnCancel.onclick = function () {
    overlay.classList.add("hidden");
  };

  btnOk.onclick = function () {
    overlay.classList.add("hidden");
    if (typeof onConfirm === "function") onConfirm();
  };

  overlay.classList.remove("hidden");
}


// ================== IMPRESSION / PDF ==================

function openPrintable(id, previewOnly) {
  const targetId = id || currentDocumentId;
  if (!targetId) {
    alert("Veuillez d'abord enregistrer le document");
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
    `;
  }

  let ribHtml = "";
  if (!isDevis && !doc.paid) {
    ribHtml = `
      <div class="rib-block">
        <div class="rib-title">Coordonnées bancaires pour virement</div>
        <p>Titulaire : AquaClim Prestige – Le Blevennec Loïc</p>
        <p>Banque : Banque Fictive</p>
        <p>IBAN : FR76 1234 5678 9012 3456 7890 123</p>
        <p>BIC : FICTFRPPXXX</p>
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

  const signatureClientTitle = isDevis ? "Bon pour accord" : "Pour acquit";
  const signatureClientText = isDevis
    ? "Précédé de la mention manuscrite : « Bon pour accord, lu et approuvé »."
    : "Le client reconnaît avoir reçu la facture et en avoir pris connaissance.";

  const printWindow = window.open("", "_blank");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${isDevis ? "Devis " : "Facture "}${doc.number}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{
      margin:0;
      padding:0;
      font-family:Arial,sans-serif;
      color:#333;
      font-size:10.5px;
    }
    .page{
      display:flex;
      flex-direction:column;
      min-height:100vh;
      padding:10mm 12mm 14mm 12mm;
      box-sizing:border-box;
    }
    .page-main{flex:1 0 auto;}
    .page-footer{flex-shrink:0;margin-top:8mm;}
    .bottom-block{page-break-inside:avoid;break-inside:avoid;}

    .header{
      text-align:center;
      margin-bottom:8px;
      border-bottom:1.3px solid #1a74d9;
      padding-bottom:7px;
    }
    img.logo{height:55px;margin-bottom:4px;}
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
    .subtitle{
      font-weight:600;
      font-size:11px;
    }
    .contact{
      font-size:10.5px;
      font-weight:500;
    }
    .contact strong{font-weight:700;}

    .doc-header-center{
      margin:10px 0 12px 0;
    }
    .doc-header-center h2{
      font-size:18px;
      margin-top:10px;
      margin-bottom:4px;
      text-align:left;
    }
    .doc-subject{
      margin-top:6px;
      font-size:11px;
      font-weight:bold;
    }

    .doc-info-block{
      display:inline-block;
      border:1px solid #000;
      border-radius:6px;
      padding:6px 8px;
      font-size:10px;
      background:#fafafa;
    }
    .doc-info-row{
      display:flex;
      gap:4px;
      margin:1px 0;
    }
    .doc-info-label{
      min-width:95px;
      font-weight:bold;
    }
    .doc-info-value{
      flex:1;
    }

    .client-block{
  margin-bottom:8px;
  font-size:10px;
  border:1px solid #000;
  border-radius:6px;
  padding:8px 10px;
  background:#fff;
}
.client-title{
  font-weight:bold;
  font-size:10.5px;
  margin-bottom:4px;
  text-transform:none;
  letter-spacing:0;
}
.client-line{margin:2px 0;}
.client-inner-row{
  display:flex;
  gap:18px;
}
.client-col{
  flex:1 1 auto;
}
.client-col.right{
  flex:0 0 auto;
  margin-left:auto;
}



    .site-block{
      margin-bottom:8px;
      font-size:10px;
      border:1px solid #000;
      border-radius:6px;
      padding:8px 10px;
      background:#fff;
    }
    .site-title{
      font-weight:bold;
      font-size:10px;
      margin-bottom:4px;
      text-transform:uppercase;
      letter-spacing:0.5px;
    }

    table{
      width:100%;
      border-collapse:collapse;
      margin:10px 0;
    }
    th{
      background:#1a74d9;
      color:#fff;
      padding:6px 6px;
      text-align:left;
      font-weight:600;
      font-size:11px;
      border-bottom:2px solid #000;
    }
    td{
      padding:4px 6px;
      border-bottom:1px solid #000;
      font-size:10px;
      vertical-align:top;
    }

    th:first-child,
    td:first-child{
      width:55%;
    }

    .text-right{text-align:right;}
    .qty-col,
    .unit-col{
      text-align:center;
      white-space:nowrap;
    }
    .price-col,
    .total-col{
      white-space:nowrap;
      text-align:right;
    }

    .desc-main{
      font-size:11px;
      font-weight:600;
      margin-bottom:2px;
    }
    .desc-detail{
      font-size:10px;
      color:#555;
      margin-top:2px;
    }
    .sub-info{
      margin-top:3px;
      font-size:9.5px;
      color:#555;
    }
    .sub-info-line{margin-top:1px;}

    .totals{
      margin-left:auto;
      width:230px;
      margin-top:6px;
      border:1px solid #000;
      border-radius:6px;
      padding:6px 8px;
      background:#fff;
    }
    .totals table{
      width:100%;
      border-collapse:collapse;
      margin:0;
    }
    .totals td{
      padding:3px 0;
      font-size:10px;
    }
    .totals .grand-total td{
      padding-top:5px;
      border-top:1px solid #000;
      font-weight:bold;
      font-size:11px;
      background:#f0f0f0;
    }
        .tva-note{
            margin-top:4px;
            font-size:9px;
            font-style:italic;
            color:#555;
        }

        .reglement-block{
            margin-top:6px;
            font-size:10px;
            border:1px solid #1b5e20;
            padding:8px;
            border-radius:6px;
            background:#e8f5e9;
            page-break-inside:avoid;
            break-inside:avoid;
            -webkit-column-break-inside:avoid;
        }
        .reg-title{
            font-weight:bold;
            margin-bottom:3px;
            color:#1b5e20;
            font-size:10px;
        }

        .rib-block{
            margin-top:6px;
            font-size:10px;
            border:1px solid #000;
            padding:8px;
            border-radius:6px;
            background:#fff;
            page-break-inside:avoid;
            break-inside:avoid;
            -webkit-column-break-inside:avoid;
        }
        .rib-title{
            font-weight:bold;
            margin-bottom:3px;
            font-size:10px;
        }

        .important-block{
            margin-top:8px;
            font-size:10px;
            border:1px solid #1a74d9;
            padding:8px;
            border-radius:6px;
            background:#f3f7ff;
            page-break-inside:avoid;
            break-inside:avoid;
            -webkit-column-break-inside:avoid;
        }
        .important-title{
            font-weight:bold;
            margin-bottom:4px;
            font-size:10px;
            color:#1a74d9;
        }
        .important-block ul{
            margin-left:14px;
        }
        .important-block li{
            margin-bottom:3px;
        }

        .conditions-block{
            margin-top:6px;
            font-size:10px;
            border:1px solid #000;
            border-radius:6px;
            padding:8px;
            background:#fff;
            page-break-inside:avoid;
            break-inside:avoid;
            -webkit-column-break-inside:avoid;
        }
        .conditions-title{
            font-weight:bold;
            margin-bottom:3px;
            font-size:10px;
        }

        .signatures{
            margin-top:10px;
            display:flex;
            justify-content:space-between;
            gap:22px;
            page-break-inside:avoid;
            break-inside:avoid;
            -webkit-column-break-inside:avoid;
        }
        .signature-block{
            flex:1;
            border-top:1px solid #333;
            padding-top:4px;
            font-size:10px;
            min-height:55px;
        }
        .signature-title{
            font-weight:bold;
            margin-bottom:3px;
        }
        img.sig{
            max-height:38px;
            margin-top:3px;
        }

        @media print{
            @page{margin:0;}
            body{margin:0;padding:0;}
            .page{min-height:100vh;}
        }
    </style>
</head>
<body>
<div class="page">
    <div class="page-main">
        <div class="header">
            <img src="${logoSrc}" class="logo" alt="AquaClim Prestige">
            <h1>AquaClim Prestige</h1>
            <p class="subtitle">Entretien & Dépannage - Climatisations & Piscines</p>
            <p class="contact">
                Le Blevennec Loïc – 2 avenue Cauvin, 06100 Nice<br>
                Tél : 06 03 53 77 73 – Email : aquaclimprestige@gmail.com<br>
                SIRET : <strong>XXXXXXXXXXXXX</strong>
            </p>
        </div>

        <div class="doc-header-center">
            <h2 style="color:${titleColor};">
                ${isDevis ? "DEVIS N° : " : "FACTURE N° : "}${doc.number}
            </h2>

            ${topDatesHtml}
            ${doc.subject ? `
                <div class="doc-subject">Objet : ${doc.subject}</div>
            ` : ``}
        </div>

  <div class="client-block">
  <div class="client-inner-row">

    <!-- COLONNE GAUCHE -->
    <div class="client-col">
      <div class="client-title">Client</div>

      ${doc.client?.name ? `<p class="client-line">${doc.client.name}</p>` : ""}
      ${doc.client?.address ? `<p class="client-line">${doc.client.address}</p>` : ""}
      ${doc.client?.phone ? `<p class="client-line">${doc.client.phone}</p>` : ""}
      ${doc.client?.email ? `<p class="client-line">${doc.client.email}</p>` : ""}
    </div>

    <!-- COLONNE DROITE (poussée complètement à droite) -->
    ${(doc.siteName || doc.siteAddress) ? `
    <div class="client-col right">
      <div class="client-title">Lieu d’intervention</div>

      ${doc.siteName ? `<p class="client-line">Client sur site : ${doc.siteName}</p>` : ""}
      ${doc.siteAddress ? `<p class="client-line">Adresse : ${doc.siteAddress}</p>` : ""}
    </div>
    ` : ""}

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
                ? `
                    ${notesHtml}
                    ${importantHtml}
                    <div class="signatures">
                        <div class="signature-block">
                            <div class="signature-title">${signatureClientTitle}</div>
                            <p>${signatureClientText}</p>
                            <p style="margin-top:6px;">Date :</p>
                            <p>Signature du client :</p>
                        </div>
                        <div class="signature-block">
                            <div class="signature-title">AquaClim Prestige</div>
                            <p>Signature et cachet de l’entreprise</p>
                            <img src="${signSrc}" class="sig" alt="Signature AquaClim Prestige">
                        </div>
                    </div>
                `
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
    // 👇 si previewOnly est true → on n'imprime pas
    if (!previewOnly) {
      printWindow.print();
    }
  };
}


// ------- Init -------
window.onload = function () {
    setTVA(0);
    switchListType("devis");
    initFirebase(); // 🔥 synchronisation avec Firestore au démarrage
    updateButtonColors();
};

















