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


// prepara i dati per il backend
const preparePayload = (formData) => {
  // mappa l'array degli items del frontend allo schema del backend
  const formattedItems = formData.items.map(item => ({
    type: item.type,
    name: item.name,
    // il backend aspetta una stringa unica
    quantity: `${item.quantity} ${item.units}`
  }));

  return {
    items: formattedItems,
    pickupTime: formData.pickupTime?.toISOString(),
    notes: formData.notes || "",
    // TODO: implementare la geolocalizzazione
    pickupLocation: formData.pickupLocation || {
      address: "test",
      geo: {
        type: "Point",
        coordinates: [0, 0]
      }
    }
  };
};


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


/*
  RECUPERO DEI DIVERSI TIPI DELLE DONAZIONE
*/

// GET /api/donations/me/available
export const getActiveDonations = async () => {
  try {
    const response = await api.get("/donations/me/available");

    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log("Errore backend: ", e.response?.data.message);
    return [];
  }
}

// GET /api/donations/me/accepted
export const getAcceptedDonations = async () => {
  try {
    const response = await api.get("/donations/me/accepted");

    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log("Errore backend: ", e.response?.data.message);
    return [];
  }
}

// GET /api/donations/me/completed
export const getCompletedDonations = async () => {
  try {
    const response = await api.get("/donations/me/completed");

    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log("Errore backend: ", e.response?.data.message);
    return [];
  }
}


