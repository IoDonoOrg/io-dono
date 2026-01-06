import dayjs from "dayjs";
import { DONATION_STATUS } from "./constants";

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

