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

export const DONATION_TYPES = {
  CLOTHING: "Vestiti",
  FOOD: "Cibo",
  MIXED: "Misto",
  NO_TYPE: "",
};