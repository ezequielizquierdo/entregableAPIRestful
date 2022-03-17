// Importo express
const express = require("express");
// Importo los routers construidos
const productosRouter = require("./router/productos");
// Instancio express
const app = express();
// Declaro el puerto
const PORT = 8080;

// Acceso a lo publico
app.use(express.static("public"));

// Para que mi APIRest sea compatible con entender objeto JSON y poder responder objeto JSON.
// Es importante que se declare esto antes que hacer la petición, para que entienda los objeto JSON.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Para cada entidad vamos a tener un Router para poder editarlos individualmente.
// Llega la petición y la redirige
app.use("/api/productos", productosRouter);

//server
const server = app.listen(PORT, () => {
  console.log("servidor levantado en el puerto " + server.address().port);
});

server.on("error", (error) => console.log(`hubo un error ${error}`));
