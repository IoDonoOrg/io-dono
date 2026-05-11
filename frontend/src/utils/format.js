import dayjs from "dayjs";
import { DONATION_STATUS, REPORT_TYPES } from "./constants";

export const formatDate = (dateString) => {
  const date = dayjs(dateString);
  return date.format("DD/MM/YYYY, HH:mm");
};

// funzione helper che traduce lo status ricevuta dal backend in qualcosa più leggibile
export const formatStatus = (status) => {
  if (status === DONATION_STATUS.AVAILABLE) return "Attiva";
  if (status === DONATION_STATUS.ACCEPTED) return "Accettata";
  if (status === DONATION_STATUS.COMPLETED) return "Completata";
  if (status === DONATION_STATUS.CANCELLED) return "Cancellata";
  if (status === DONATION_STATUS.NO_STATUS) return "";
};

// funzione helper che decide in base allo status di una donazione 
// se un componente sia modificabile o meno
export const isModifieble = (status) => {
  return !(
    status === DONATION_STATUS.ACCEPTED ||
    status === DONATION_STATUS.CANCELLED ||
    status === DONATION_STATUS.COMPLETED
  );
}

// Estrae la quantità effetive dalla string in formato backend (quantity: 50 kg => 50)
export const formatBackendQuantity = (item) => {
  if (!item.quantity) return "1";

  const parts = item.quantity.toString().trim().split(" ");
  return parts[0];
};

// Estrae l'unità effetive dalla string in formato backend (quantity: 50 kg => kg)
export const formatBackendUnits = (item) => {
  if (!item.quantity) return "kg";

  const parts = item.quantity.toString().trim().split(" ");
  return parts[1];
};

// Converta il formato dell'indirizzo recuperato dal backend nel formato aspettato dal frontend
export const formatBackendLocation = (location) => {
  if (!location) return null;

  return {
    name: location.address,
    address: location.address,
    lat: location.geo?.coordinates?.[1] || 0,
    lng: location.geo?.coordinates?.[0] || 0,
    addressComponents: location.addressComponents || [],
    hasStreetNumber: true,
  };
};


// Determina il colore del chip in base allo stato della donazione
export const getChipColor = (status) => {
  switch (status) {
    case DONATION_STATUS.AVAILABLE:
      return "success"; // verde
    case DONATION_STATUS.ACCEPTED:
      return "warning"; // arancione
    case DONATION_STATUS.COMPLETED:
      return "info"; // blu
    case DONATION_STATUS.CANCELLED:
      return "error"; // rosso
    case DONATION_STATUS.NO_STATUS:
    default:
      return "default"; // grigio
  }
};


export const formatReportType = (type) => {
  switch (type) {
    case REPORT_TYPES.MALFUNCTION:
      return "Malfunzionamento";
    case REPORT_TYPES.DONATION_ISSUE:
      return "Problema con donazione";
  }
};

export const formatReportStatus = (status) => {
  switch (status) {
    case "OPEN":
      return "Aperta";
    case "CLOSED":
      return "Chiusa";
    default:
      return status;
  }
};

export const getReportChipColor = (status) => {
  switch (status) {
    case "OPEN":
      return "success";
    case "CLOSED":
      return "error";
    default:
      return "default";
  }
};
