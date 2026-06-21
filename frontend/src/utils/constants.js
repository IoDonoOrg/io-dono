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
    onAction: ({ onVisualize }) => onVisualize(),
  },
  {
    key: "accept",
    label: "Accetta",
    // solo se il ruolo dell'utente è admin o associazione e se la donazione può essere accetta
    condition: ({ role, status }) => (role === USER_ROLE.ASSOCIATION) && status === DONATION_STATUS.AVAILABLE,
    onAction: ({ onAccept }) => onAccept(),
  },
  {
    key: "complete",
    label: "Completa",
    condition: ({ role, status }) => (role === USER_ROLE.ASSOCIATION) && status === DONATION_STATUS.ACCEPTED,
    onAction: ({ onComplete }) => onComplete(),
  },
  {
    key: "edit",
    label: "Modifica",
    condition: ({ role, status }) => role === USER_ROLE.DONOR && status === DONATION_STATUS.AVAILABLE,
    onAction: ({ onEdit }) => onEdit()
  },
  {
    key: "report",
    label: "Segnala",
    condition: ({ role, status }) => role === USER_ROLE.ASSOCIATION && status === DONATION_STATUS.ACCEPTED,
    onAction: ({ onReport }) => onReport()
  },
  {
    key: "delete",
    label: "Elimina",
    condition: ({ role, status }) => role === USER_ROLE.DONOR && status === DONATION_STATUS.AVAILABLE,
    onAction: ({ onDelete }) => onDelete(),
  },
];

export const DIALOGS = {
  HISTORY: 'history',
  MAP: 'map',
  STATISTICS: 'statistics',
  CREATE_ASSOC: 'create-association',
  MANAGE_REPORTS: 'manage-reports',
  MANAGE_USERS: 'manage-users'
};

export const REPORT_TYPES = {
  MALFUNCTION: "MALFUNCTION",
  DONATION_ISSUE: "USER_BEHAVIOR",
  NO_TYPE: "",
};

export const DIALOGS_DONATION_BAR = {
  EDIT: "edit",
  VISUALIZE: "visualize",
  COMPLETE: "complete",
  REPORT: "report",
};

export const DIALOGS_REPORT_BAR = {
  VISUALIZE: "visualize",
  CLOSE: "close"
};

export const REPORT_MENU_ACTIONS = [
  {
    key: "visualize",
    label: "Visualizza",
    condition: () => true,
    onAction: ({ onVisualize }) => onVisualize(),
  },
  {
    key: "close",
    label: "Risolvi",
    condition: ({ role, status }) => role === USER_ROLE.ADMIN && status === REPORT_STATUS.OPEN,
    onAction: ({ onClose }) => onClose(),
  },
];

export const REPORT_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED"
}
