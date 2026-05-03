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
  FURNITURE: "Materassi",
  ALTRO: "Altro",
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

// Configurazione delle azioni del menu per le donazioni
// La funzione condition determina se visualizzare una voce o meno
export const DONATION_MENU_ACTIONS = [
  {
    key: "visualize",
    label: "Visualizza",
    // sempre visualizzata
    condition: () => true,
  },
  {
    key: "accept",
    label: "Accetta",
    // solo se il ruolo dell'utente è admin o associazione e se la donazione può essere accetta
    condition: ({ role, status }) => (role === USER_ROLE.ASSOCIATION || role === USER_ROLE.ADMIN) && status === DONATION_STATUS.AVAILABLE
  },
  {
    key: "edit",
    label: "Modifica",
    // solo se la donazione è modificabile
    condition: ({ isModifieble }) => isModifieble,
  },
  {
    key: "delete",
    label: "Elimina",
    condition: ({ isModifieble }) => isModifieble,
  },
];