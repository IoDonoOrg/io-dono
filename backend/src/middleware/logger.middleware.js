// Registra in console richiesta e risposta HTTP con metadati principali.
exports.logger = (req, res, next) => {
  // Memorizza l'istante iniziale per il calcolo della latenza.
  const start = Date.now();

  // Genera timestamp locale in formato leggibile.
  const now = new Date().toLocaleString("it-IT");

  // Registra i dati principali della richiesta.
  console.log(`\n---[${now}]--- \n${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // Esegue wrapping di res.send per registrare esito e payload di risposta.
  const originalSend = res.send;

  // Intercetta l'invio della risposta.
  res.send = function (body) {
    const duration = Date.now() - start;

    console.log(`\nResponse (${res.statusCode}) in ${duration}ms`);

    try {
      console.log("Body: ", JSON.parse(body), "\n------");
    } catch {
      console.log("Body: ", body, "\n------");
    }
    // Invoca il comportamento originale di Express.
    return originalSend.call(this, body);
  };

  // Prosegue la catena middleware.
  next();
}