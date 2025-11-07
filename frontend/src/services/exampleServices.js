import api from './api';

export const exampleFetch = async () => {
  try {
    // chiama la rotta di default (api/)
    const response = await api.get('/'); 
    // ritorna solo i dati utili
    console.log('Risposta API arrivata con successo');
    return response; 
  } catch (error) {
    console.error('Errore nella chiamata API:', error);
    return null;
  }
};