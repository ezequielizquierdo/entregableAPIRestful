// Importo express
const express = require("express");
// Importo los routers construidos
const productosRouter = require("./router/productos");
// Instancio express
const app = express();
// Declaro el puerto
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/productos", productosRouter);

//server
const server = app.listen(PORT, () => {
  console.log("servidor levantado en el puerto " + server.address().port);
});

server.on("error", (error) => console.log(`hubo un error ${error}`));

// Configuro que mi motor de vistas va a ser ejs
app.set('view engine', 'ejs')
