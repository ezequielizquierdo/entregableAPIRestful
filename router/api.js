const express = require("express");
const {
  getData,
  buscarId,
  estaProducto,
  writeData,
} = require("../controllers/products-controller");

const fs = require("fs");

const apiRouter = express.Router();

//ROUTERS API

// Llamo todos los productos
apiRouter.get("/productos", async (req, res) => {
  try {
    const productos = await getData("data/productos.json");
    console.log("productos", productos);
    productos !== undefined
      ? res.json(productos)
      : res.json({ error: "producto no encontrado" });
  } catch (error) {
    return res.json({ mensaje: "no se pudo comprar" });
  }
});

// Invoco producto por id
apiRouter.get("/productos/:num", async (req, res) => {
  let numeroId = req.params.num;
  if (isNaN(req.params.num)) {
    res.json({ error: "el parametro no es un numero" });
  } else {
    const productoBuscado = await buscarId(
      "data/productos.json", 
      numeroId
      );
    productoBuscado !== null
      ? res.json(productoBuscado)
      : res.json({ error: "producto no encontrado" });
    console.log("productoBuscado", productoBuscado);
  }
});

// Recibe y agrega un producto, y lo devuelve con su id asignado.

apiRouter.post("/productos", async (req, res) => {
  let productos = await getData("data/productos.json");
  if (
    req.body.title == null ||
    req.body.price == null ||
    req.body.thumbnail == null
  ) {
    res.json({ error: "Faltan productos por completar" });
  }
  if (req == null) {
    console.log("Formulario");
  } else {
  }
  // Si no hay productos el id será 0
  if (productos == "[]") {
    productos = 0;
  }
  // Cuento la cantidad de productos en el array productos existente y le sumo 1
  const id = productos.length + 1;

  const productoGuardado = [];

  try {
    writeData("data/productos.json", [...productos, { ...req.body, id: id }]);
    // productos = await getData("./contenedor/productos.txt");
    productos = await getData("data/productos.json");
    productoGuardado.push(...productos, { ...req.body, id: id });
    // return res.json([{ ...req.body, id: id }]);
    return res.render("formulario", { productos });
  } catch (e) {
    console.log("No se pudo guardar el objeto " + e);
  }
});

// Actualizo un producto por su id
apiRouter.put("/productos/:id", async (req, res) => {
  const numeroId = req.params.id;
  try {
    const productos = await getData("data/productos.json");

    if (estaProducto(numeroId, productos)) {
      const indexProducto = req.params.id - 1;

      const productoCargar = { ...req.body, id: numeroId };
      console.log("productoCargar ->", productoCargar);

      productos.splice(indexProducto, 1, productoCargar);

      writeData("data/productos.json", productos);

      return res.json("se actualizo el producto");
    } else {
      return res.json("no esta el producto");
    }
  } catch (error) {
    console.log("no se pudo post producto nuevo " + error);
  }
});

// Este método delete borra todo en el archivo productos.txt
apiRouter.delete("/productos", async (req, res) => {
  try {
    let productos = await getData("data/productos.json");
    console.log(productos);
    if (productos) {
      writeData("data/productos.json", []);
      return res.json({ mensaje: "Se borro todo" });
    }
  } catch (err) {
    res.json({ mensaje: "No se pudo borrar todo" });
  }
});

// Este método borra el producto por su id
apiRouter.delete("/productos/:id", async (req, res) => {
  const id = req.params.id;
  const productos = await getData("data/productos.json");
  const indice = id - 1;
  const productoBuscado = await buscarId(
    "data/productos.json",
    id
  );
  console.log("Producto Elegido", productoBuscado);
  try {
    if (estaProducto(id, productos)) {
      productos.splice(indice, 1);
      let indiceId = 1;
      productos.forEach((element) => {
        element.id = indiceId;
        indiceId++;
      });
      writeData("data/productos.json", productos);
      return res.json({ mensaje: `El item con el ID ${id} fue eliminado` });
    }
    res.json({ mensaje: `El item con el ID ${id} no esta` });
  } catch (err) {
    res.json({ mensaje: `no se pudo eliminar el id` });
  }
});

////////////////////////////////////////////////////

// Llamo a todos los productos en carrito
apiRouter.get("/carrito", async (req, res) => {
  try {
    const carrito = await getData("data/carrito.json");
    console.log("carrito", carrito);
    carrito !== undefined
      ? res.json(carrito)
      : res.json({ error: "producto no encontrado" });
  } catch (error) {
    return res.json({ mensaje: "no se pudo comprar" });
  }
});

// Invoco producto por id
apiRouter.get("/carrito/:num", async (req, res) => {
  let numeroId = req.params.num;
  if (isNaN(req.params.num)) {
    res.json({ error: "el parametro no es un numero" });
  } else {
    const productoBuscado = await buscarId(
      "data/carrito.json",
      numeroId
    );
    productoBuscado !== null
      ? res.send(productoBuscado)
      : res.json({ error: "producto no encontrado" });
      console.log("productoBuscado", productoBuscado)
  }
});

// recibe y agrega un producto, y lo devuelve con su id asignado.
// apiRouter.post("/totales", async (req, res) => {
apiRouter.post("/carrito", async (req, res) => {
  let carrito = await getData("data/carrito.json");
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
    writeData("data/carrito.json", [
      ...carrito,
      { ...req.body, id: id },
    ]);
    carrito = await getData("data/carrito.json");
    carritoGuardado.push(...carrito, { ...req.body, id: id });
    // return res.json([{ ...req.body, id: id }]);
    return res.render("checkout", { carrito });
  } catch (e) {
    console.log("No se pudo guardar el objeto " + e);
  }
});

// Actualizo un producto en un id
apiRouter.put("/carrito/:id", async (req, res) => {
  const numeroId = req.params.id;
  try {
    const carrito = await getData("data/carrito.json");

    if (estaProducto(numeroId, carrito)) {
      const indexProducto = req.params.id - 1;

      const productoCargar = { ...req.body, id: numeroId };
      console.log("productoCargar ->", productoCargar);
      
      carrito.splice(indexProducto, 1, productoCargar);
      
      writeData("data/carrito.json", carrito);

      return res.json("se actualizo el carrito");
    } else {
      return res.json("no esta el carrito");
    }
  } catch (error) {
    console.log("no se pudo post carrito nuevo " + error);
  }
});

// Este método delete borra todo en el archivo productos.txt
apiRouter.delete("/carrito", async (req, res) => {
  try {
    let carrito = await getData("data/carrito.json");
    console.log(carrito);
    if (carrito) {
      writeData("data/carrito.json", []);
      return res.json({ mensaje: "Se borro todo" });
    }
  } catch (err) {
    res.json({ mensaje: "No se pudo borrar todo" });
  }
});

// Este método llama al producto por su id
apiRouter.delete("/carrito/:id", async (req, res) => {
  const id = req.params.id;
  const carrito = await getData("data/carrito.json");
  const indice = id - 1;
  const productoBuscado = await buscarId(
    "data/carrito.json",
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
      writeData("data/carrito.json", carrito);
      return res.json({ mensaje: `El item con el ID ${id} fue eliminado` });
    }
    res.json({ mensaje: `El item con el ID ${id} no esta` });
  } catch (err) {
    res.json({ mensaje: `no se pudo eliminar el id` });
  }
});

module.exports = apiRouter;
