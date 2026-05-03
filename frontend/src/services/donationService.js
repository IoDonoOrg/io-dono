import api from "./api";

/* 
  Questo file contiene tutte le funzioni che interagiscono con il backend per gestire le donazioni
  Ogni funzione corrisponde a una specifica chiamata API (es. GET /donations, POST /donations, etc.)
  e si occupa di formattare i dati nel formato richiesto dal backend, gestire gli errori e restituire i risultati in un formato opportuno
*/

// POST /donations
// Crea una nuova donazione usando i dati forniti dal frontend
// Utilizza la funzione helper preparePayload per formattare i dati nel formato richiesto dal backend
// Ritorna un oggetto con due campi: success (booleano) e message (stringa) che indica il risultato dell'operazione
export const createDonation = async (formData) => {
  const payload = preparePayload(formData);

  try {
    await api.post("/donations", payload);

    return {
      success: true,
      message: "Donazione creata"
    }

    // se il backend restituisce un errore, viene restituito il messaggio d'errore
  } catch (e) {
    if (e.response) {
      console.log("Errore backend: ", e.response.data.message);

      return {
        success: false,
        message: e.response.data.message
      }
    }
    // altrimenti si tratta di un errore di rete o altro
    return {
      success: false,
      message: "Errore server backend"
    }
  }
}

// Funzione helper che trasforma i dati del form di creazione/modifica donazione nel formato richiesto dal backend
// Il backend si aspetta un array di items con proprietà type, name e quantity (stringa unica che combina quantità e unità)
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


// DELETE /donations/:id 
// Elimina una donazione specifica identificata dal suo ID
// Ritorna true se l'eliminazione è avvenuta con successo, altrimenti false
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

// PATCH /donations/:id
// Aggiorna i dati di una donazione specifica identificata dal suo ID
// Utilizza la funzione helper preparePayload per formattare i dati nel formato richiesto dal backend
// Ritorna un oggetto con due campi: success (booleano) e message (stringa) che indica il risultato dell'operazione
export const updateDonation = async (id, formData) => {
  const payload = preparePayload(formData);

  try {
    await api.patch(`/donations/${id}`, payload);
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

// GET /donations?status={AVAILABLE|ACCEPTED|COMPLETED}
// Recupera le donazioni filtrate per stato (AVAILABLE, ACCEPTED, COMPLETED)
// Gli statis possibili sono definiti nell'oggetto DONATION_STATUS in src/utils/constants.js
export const getDonationsByStatus = async (type) => {
  try {
    const response = await api.get(`/donations?status=${type}`);
    // ritorna solo l'array di donazioni, senza altri metadati
    return response.data.items;
  } catch (e) {
    console.log("Errore backend: ", e.response?.data?.message);
    return [];
  }
};

// PATCH /donations/:id
// Accetta una donazione (cambia lo stato da AVAILABLE ad ACCEPTED)
// Solo le associazioni possono accettare donazioni
// Ritorna un oggetto con due campi: success (booleano) e message (stringa) che indica il risultato dell'operazione
export const acceptDonation = async (id) => {
  try {
    await api.patch(`/donations/${id}`, { status: 'ACCEPTED' });
    return {
      success: true,
      message: "Donazione accettata con successo"
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
};

