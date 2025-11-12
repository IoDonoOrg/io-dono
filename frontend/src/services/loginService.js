import api from "./api";

// POST /auth/login
// {
// "email": "test@test.com",
// "password": "Test123$"
// }
// TODO: rivedere la funzione loginResult così che restituisce solo il codice HTTP
const localLogin = async (email, password) => {
  const loginData = {
    email: email,
    password: password
  };

  try {
    const response = await api.post('/auth/login', loginData);

    console.log('Login effettuato con successo:', response.data);
    return ""

  } catch (err) {
    if (err.response) {
      console.error('Login fallito:', err.response.data.message);
      return err.response.data.message;
    } else {
      console.error('Errore:', err.message);
      return err.message;
    }
  }
}

export { localLogin }