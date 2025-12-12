// File che contiene dei dati fittizi
// Utile per fare il debug

export const activeEx = [
  {
    _id: "act1",
    type: "Cibo",
    status: "AVAILABLE",
    items: [
      { id: 15, name: "Riso", quantity: "7", units: "kg" },
      { id: 16, name: "Legumi", quantity: "4", units: "kg" },
    ],
    pickupTime: new Date("2024-12-18T15:00:00").toISOString(),
    notes: "Prodotti a lunga conservazione",
    pickupLocation: {
      address: "Via Dante 89, Milano",
      coordinates: { lat: 45.4654, lng: 9.1859 },
    },
  },
  {
    _id: "act2",
    type: "Verdura",
    status: "AVAILABLE",
    items: [
      { id: 17, name: "Carote", quantity: "5", units: "kg" },
      { id: 18, name: "Zucchine", quantity: "3", units: "kg" },
      { id: 19, name: "Melanzane", quantity: "2", units: "kg" },
    ],
    pickupTime: new Date("2024-12-19T10:30:00").toISOString(),
    notes: "Verdura fresca dell'orto",
    pickupLocation: {
      address: "Via Moscova 34, Milano",
      coordinates: { lat: 45.4762, lng: 9.1885 },
    },
  },
  {
    _id: "act3",
    type: "Frutta",
    status: "AVAILABLE",
    items: [
      { id: 20, name: "Banane", quantity: "6", units: "kg" },
      { id: 21, name: "Kiwi", quantity: "4", units: "kg" },
    ],
    pickupTime: new Date("2024-12-20T08:00:00").toISOString(),
    notes: "Frutta tropicale",
    pickupLocation: {
      address: "Corso Magenta 12, Milano",
      coordinates: { lat: 45.4639, lng: 9.1751 },
    },
  },
  {
    _id: "act4",
    type: "Latticini",
    status: "AVAILABLE",
    items: [
      { id: 22, name: "Formaggio", quantity: "3", units: "kg" },
      { id: 23, name: "Burro", quantity: "1", units: "kg" },
    ],
    pickupTime: new Date("2024-12-21T11:00:00").toISOString(),
    notes: "Prodotti caseari locali",
    pickupLocation: {
      address: "Via Sarpi 100, Milano",
      coordinates: { lat: 45.4812, lng: 9.1798 },
    },
  },
  {
    _id: "act5",
    type: "Pane e prodotti da forno",
    status: "AVAILABLE",
    items: [
      { id: 24, name: "Pane integrale", quantity: "8", units: "kg" },
      { id: 25, name: "Biscotti", quantity: "2", units: "kg" },
    ],
    pickupTime: new Date("2024-12-22T07:30:00").toISOString(),
    notes: "Pane appena sfornato",
    pickupLocation: {
      address: "Via Vigevano 18, Milano",
      coordinates: { lat: 45.4520, lng: 9.1639 },
    },
  },
  {
    _id: "act6",
    type: "Conserve",
    status: "AVAILABLE",
    items: [
      { id: 26, name: "Passata di pomodoro", quantity: "12", units: "barattoli" },
      { id: 27, name: "Marmellata", quantity: "8", units: "barattoli" },
    ],
    pickupTime: new Date("2024-12-23T14:00:00").toISOString(),
    notes: "Conserve fatte in casa",
    pickupLocation: {
      address: "Via Cesare Correnti 25, Milano",
      coordinates: { lat: 45.4581, lng: 9.1803 },
    },
  },
];


export const acceptedEx = [
  {
    _id: "acc1",
    type: "Cibo",
    status: "ACCEPTED",
    items: [
      { id: 1, name: "Pane", quantity: "5", units: "kg" },
      { id: 2, name: "Pasta", quantity: "10", units: "kg" },
    ],
    pickupTime: new Date("2024-12-15T10:00:00").toISOString(),
    notes: "Pane fresco del giorno",
    pickupLocation: {
      address: "Via Roma 123, Milano",
      coordinates: { lat: 45.4642, lng: 9.19 },
    },
  },
  {
    _id: "acc2",
    type: "Verdura",
    status: "ACCEPTED",
    items: [
      { id: 3, name: "Pomodori", quantity: "3", units: "kg" },
      { id: 4, name: "Insalata", quantity: "2", units: "kg" },
    ],
    pickupTime: new Date("2024-12-16T14:30:00").toISOString(),
    notes: "Verdura biologica",
    pickupLocation: {
      address: "Corso Buenos Aires 45, Milano",
      coordinates: { lat: 45.4777, lng: 9.205 },
    },
  },
  {
    _id: "acc3",
    type: "Frutta",
    status: "ACCEPTED",
    items: [
      { id: 5, name: "Mele", quantity: "8", units: "kg" },
      { id: 6, name: "Arance", quantity: "6", units: "kg" },
    ],
    pickupTime: new Date("2024-12-17T09:00:00").toISOString(),
    notes: "Frutta di stagione",
    pickupLocation: {
      address: "Piazza Duomo 1, Milano",
      coordinates: { lat: 45.4642, lng: 9.1895 },
    },
  },
];


export const completedEx = [
  {
    _id: "comp1",
    type: "Latticini",
    status: "COMPLETED",
    items: [
      { id: 7, name: "Latte", quantity: "10", units: "litri" },
      { id: 8, name: "Yogurt", quantity: "20", units: "pezzi" },
    ],
    pickupTime: new Date("2024-12-10T11:00:00").toISOString(),
    notes: "Prodotti freschi",
    pickupLocation: {
      address: "Via Torino 56, Milano",
      coordinates: { lat: 45.4608, lng: 9.1872 },
    },
  },
  {
    _id: "comp2",
    type: "Pane e prodotti da forno",
    status: "COMPLETED",
    items: [
      { id: 9, name: "Focaccia", quantity: "4", units: "kg" },
      { id: 10, name: "Grissini", quantity: "2", units: "kg" },
    ],
    pickupTime: new Date("2024-12-08T16:00:00").toISOString(),
    notes: "Tutto confezionato",
    pickupLocation: {
      address: "Viale Monza 200, Milano",
      coordinates: { lat: 45.5, lng: 9.22 },
    },
  },
  {
    _id: "comp3",
    type: "Bevande",
    status: "COMPLETED",
    items: [
      { id: 11, name: "Succhi di frutta", quantity: "15", units: "litri" },
      { id: 12, name: "Acqua", quantity: "24", units: "bottiglie" },
    ],
    pickupTime: new Date("2024-12-05T13:30:00").toISOString(),
    notes: "Bevande non alcoliche",
    pickupLocation: {
      address: "Via Farini 78, Milano",
      coordinates: { lat: 45.48, lng: 9.195 },
    },
  },
  {
    _id: "comp4",
    type: "Cibo preparato",
    status: "COMPLETED",
    items: [
      { id: 13, name: "Lasagne", quantity: "3", units: "teglie" },
      { id: 14, name: "Minestrone", quantity: "5", units: "litri" },
    ],
    pickupTime: new Date("2024-12-03T12:00:00").toISOString(),
    notes: "Cibo pronto da consumare",
    pickupLocation: {
      address: "Via Brera 12, Milano",
      coordinates: { lat: 45.4719, lng: 9.1881 },
    },
  },
];