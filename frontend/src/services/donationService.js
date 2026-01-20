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

  // Estrai i dati della posizione (gestisce il caso in cui sia null)
  const location = formData.pickupLocation || {};

  return {
    items: formattedItems,
    pickupTime: formData.pickupTime?.toISOString(),
    notes: formData.notes || "",

    pickupLocation: {
      address: location.address || "",
      geo: {
        type: "Point",
        // NOTA: GeoJSON richiede l'ordine [Longitudine, Latitudine]
        coordinates: [
          location.lng || 0,
          location.lat || 0
        ]
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

// PUT /api/donations/:id
export const updateDonation = async (id, formData) => {
  const payload = preparePayload(formData);

  try {
    await api.put(`/donations/${id}`, payload);
    return {
      success: true,
      message: "Donazione modificata con successo"
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


