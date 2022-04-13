const express = require("express");
const {
  getData,
  buscarId,
  estaProducto,
  writeData,
} = require("../controllers/products-controller");

const fs = require("fs");

const carritoRouter = express.Router();

//routas
// Llamo a todos los productos
carritoRouter.get("/", async (req, res) => {
  try {
    const carrito = await getData("./contenedor/carrito.txt");
    console.log("carrito", carrito);
    carrito !== undefined
      ? //res.send(carrito)
        res.render("checkout", { carrito })
      : res.json({ error: "producto no encontrado" });
  } catch (error) {
    return res.json({ mensaje: "no se pudo comprar" });
  }
});

// Invoco producto por id
carritoRouter.get("/:num", async (req, res) => {
  let numeroId = req.params.num;
  if (isNaN(req.params.num)) {
    res.json({ error: "el parametro no es un numero" });
  } else {
    const productoBuscado = await buscarId(
      "./contenedor/carrito.txt",
      numeroId
    );
    productoBuscado !== null
      ? res.send(productoBuscado)
      : res.json({ error: "producto no encontrado" });
      console.log("productoBuscado", productoBuscado)
  }
});

// recibe y agrega un producto, y lo devuelve con su id asignado.
// carritoRouter.post("/totales", async (req, res) => {
carritoRouter.post("/", async (req, res) => {
  let carrito = await getData("./contenedor/carrito.txt");

  if (
    req.body.title == null ||
    req.body.price == null ||
    req.body.thumbnail == null
  ) {
    res.json({ error: "Faltan carrito por completar" });
  }

  if (req == null) {
    console.log("Checkout");
  } else {
  }

  // Si no hay productos el id será 0
  if (carrito == "[]") {
    carrito = 0;
  }
  // Cuento la cantidad de carrito en el array carrito existente y le sumo 1
  const id = carrito.length + 1;

  const carritoGuardado = [];

  try {
    writeData("./contenedor/carrito.txt", [
      ...carrito,
      { ...req.body, id: id },
    ]);
    carrito = await getData("./contenedor/carrito.txt");
    carritoGuardado.push(...carrito, { ...req.body, id: id });
    // return res.json([{ ...req.body, id: id }]);
    return res.render("checkout", { carrito });
  } catch (e) {
    console.log("No se pudo guardar el objeto " + e);
  }
});

// Actualizo un producto en un id
carritoRouter.put("/:id", async (req, res) => {
  const numeroId = req.params.id;
  try {
    const carrito = await getData("./contenedor/carrito.txt");

    if (estaProducto(numeroId, carrito)) {
      const indexProducto = req.params.id - 1;

      const productoCargar = { ...req.body, id: numeroId };
      console.log("productoCargar ->", productoCargar);
      
      carrito.splice(indexProducto, 1, productoCargar);
      
      writeData("./contenedor/carrito.txt", carrito);

      // return res.send(carrito);
      return res.json("se actualizo el carrito");
    } else {
      return res.json("no esta el carrito");
    }
  } catch (error) {
    console.log("no se pudo post carrito nuevo " + error);
  }
});

// Este método delete borra todo en el archivo productos.txt
carritoRouter.delete("/", async (req, res) => {
  try {
    let carrito = await getData("./contenedor/carrito.txt");
    console.log(carrito);
    // if (estaProducto(carrito)) {
    if (carrito) {
      writeData("./contenedor/carrito.txt", []);
      return res.json({ mensaje: "Se borro todo" });
    }
  } catch (err) {
    res.json({ mensaje: "No se pudo borrar todo" });
  }
});

// Este método llama al producto por su id
carritoRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const carrito = await getData("./contenedor/carrito.txt");
  const indice = id - 1;
  const productoBuscado = await buscarId(
    "./contenedor/carrito.txt",
    id
  );
  console.log("Producto Elegido", productoBuscado);
  try {
    if (estaProducto(id, carrito)) {
      carrito.splice(indice, 1);
      let indiceId = 1;
      carrito.forEach((element) => {
        element.id = indiceId;
        indiceId++;
      });
      writeData("./contenedor/carrito.txt", carrito);
      return res.json({ mensaje: `El item con el ID ${id} fue eliminado` });
    }
    res.json({ mensaje: `El item con el ID ${id} no esta` });
  } catch (err) {
    res.json({ mensaje: `no se pudo eliminar el id` });
  }
});

module.exports = carritoRouter;
