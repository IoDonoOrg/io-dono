// ATTENZIONE: i valori sotto devono corrispondere ai valori aspettati dal backend
// un oggetto tipo enum che rappresenta tutte possibili categorie di un utente
export const USER_ROLE = {
  DONOR: "DONOR",
  ASSOCIATION: "ASSOCIATION",
  ADMIN: "ADMIN",
  NO_CATEGORY: "",
};

// un oggetto tipo enum che rappresenta tutte possibili tipi di donatori
export const DONOR_TYPE = {
  PRIVATE: "PRIVATE",
  COMMERCIAL: "COMMERCIAL",
  NO_TYPE: "",
};

// l'oggetto che rappresenta tutti possibili tipi di un item donato
export const ITEM_TYPES = {
  CLOTHING: "Vestiti",
  FOOD: "Cibo",
  NO_TYPE: "",
};

// l'oggetto che rappresenta tutti possibili stati di una donazione
// ATTENZIONE: anche questi valori devono corrsipondere ai quelli del backend
export const DONATION_STATUS = {
  AVAILABLE: "AVAILABLE",
  ACCEPTED: "ACCEPTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_STATUS: ""
}

// la lista delle provincie supportate
// nel futuro dovrà diventare una chiamata API
export const PROVINCES = ["TN"];