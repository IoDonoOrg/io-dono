// logga nella console ogni richiesta che arriva al server
// stampa metodo, rotta, headers e body della richiesta ricevuta
// stampa anche il codice della risposta, tempo in cui è stata inviata
// e la body 
exports.logger = (req, res, next) => {
  // salva l'orario di inzio per calcolare poi il tempo della risposta
  const start = Date.now();

  // Otteniamo la data e l'orario attuali in formato leggibile
  const now = new Date().toLocaleString("it-IT");

  // logga info relativi alla richiesta
  console.log(`\n---[${now}]--- \n${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // intercettazione risposte express
  // res.send() è il metodo che invia davvero la risposta al client
  // salva una copia della funzione originale, perché verrà sovrascritta dopo
  const originalSend = res.send;

  // intercetta la chiamata a res.send di Express
  res.send = function (body) {
    const duration = Date.now() - start;

    console.log(`\nResponse (${res.statusCode}) in ${duration}ms`);

    try {
      console.log("Body: ", JSON.parse(body), "\n------");
    } catch {
      console.log("Body: ", body, "\n------");
    }
    // ripristina il comportamento originale di Express
    return originalSend.call(this, body);
  };

  // Permette alla richiesta di continuare la catena normale di middleware
  next();
}