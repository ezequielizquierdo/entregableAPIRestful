// Importo express
const express = require("express");
// Importo los routers construidos
const productosRouter = require("./router/productos");
// // Declaro el puerto
const PORT = 8080;
// Descargo el modulo y lo importo
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

// // Instancio app express
const app = express();
const httpServer = new HttpServer(app);
// // Lo que tengo en httpServer lo envio a una instancia de io server (servidor socket)
const io = new IOServer(httpServer);

// Levanto el server
// const server = app.listen(PORT, () => {
//   console.log("servidor levantado en el puerto " + server.address().port);
// });
// Levanto el servidor socket
const server = httpServer.listen(8080, () =>
  console.log("servidor Levantado en:", PORT)
);

// Envio la vista
app.use(express.static("./public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.sendFile("index.html");
  res.render("index.html");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/productos", productosRouter);


const messages = [
  { author: "Juan", text: "¡Hola! ¿Que tal?" },
  { author: "Pedro", text: "¡Muy bien! ¿Y vos?" },
  { author: "Ana", text: "¡Genial!" },
];

// Es el metodo que me define la logica de la conexión.
// El evento para levantar la conexión es el evento "connection".
io.on("connection", (socket) => {
  console.log("se conecto un usuario");
    // Con el metodo socket.emit procedo a enviarles todos los mensajes que haya acumulados hasta el momento
  socket.emit("messages", messages);
  socket.on("notificacion", (data) => {
    console.log(data);
  });
// Con el socket.on recibo los mensajes
  socket.on("new-message", (data) => {
    messages.push(data);
    io.sockets.emit("messages", messages);
  });
});

server.on("error", (error) => console.log(`hubo un error ${error}`));