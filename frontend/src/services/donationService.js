import api from "./api";

// POST api/donations
export const createDonation = async (formData) => {
  const payload = preparePayload(formData);

  try {
    await api.post("/donations", payload);

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

// GET /api/donations/me/available
export const activeDonations = async () => {
  try {
    const response = await api.get("/donations/me/available");

    return response.data;
  } catch (e) {
    console.log("Errore backend: ", e.response?.data.message);
    return [];
  }

}

// DELETE /api/donations/:id 
export const deleteDonation = async (id) => {
  try {
    await api.delete(`donations/${id}`);
    console.log("Donazione con id", id, "cancellata")
    return true;
  } catch (e) {
    console.log("Errore backend: ", e.response?.data.message);
    return false;
  }
}