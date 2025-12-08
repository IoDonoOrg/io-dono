import api from "./api";

export const createDonation = async (formData) => {
  const payload = preparePayload(formData);

  try {
    const response = await api.post("/donations", payload);

    return {
      success: true,
      message: "Donazione creata"
    }

  } catch (e) {
    if (e.response) {
      console.log("Errore backend: ", e.response.data.message);

      return {
        success: false,
        message: e.response.data.message
      }
    }

    return {
      success: false,
      message: "Errore server backend"
    }
  }
}


// prepara i dati recuperati dalla form convertendoli in un formato aspettato da backend
const preparePayload = (formData) => {
  // converta l'array che contiene oggeti donati in un'unica stringa
  const itemsString = formData.items
    .map(item => `${item.product} ${item.quantity} ${item.units}`)
    .join(", ");

  return {
    type: formData.type,
    quantity: itemsString,
    // conveta la data in un formato aspettato da backend
    pickupTime: formData.pickupTime?.toISOString(),
    notes: formData.notes || "",
    // TODO: aggiungere l'input della locazzione
    pickupLocation: formData.pickupLocation || {
      address: "test",
      geo: {
        type: "Point",
        coordinates: [0, 0]
      }
    }
  };
};