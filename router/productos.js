const express = require("express");
const {
  getData,
  buscarId,
  estaProducto,
  writeData,
} = require("../contenedor/helpers/helpers");

const fs = require("fs");

const productosRouter = express.Router();

//routas
productosRouter.get("/", async (req, res) => {
  try {
    const productos = await getData("./contenedor/productos.txt");
    console.log("productos", productos);
    productos !== undefined
      ? //res.send(productos)
      res.render("formulario", { productos })
      : res.json({ error: "producto no encontrado" });
  } catch (error) {
    return res.json({ mensaje: "no se pudo comprar" });
  }
});

productosRouter.get("/:num", async (req, res) => {
  let numeroId = req.params.num;
  if (isNaN(req.params.num)) {
    res.json({ error: "el parametro no es un numero" });
  } else {
    const productoBuscado = await buscarId(
      "./contenedor/productos.txt",
      numeroId
    );
    productoBuscado !== null
      ? res.send(productoBuscado)
      : res.json({ error: "producto no encontrado" });
  }
});

// recibe y agrega un producto, y lo devuelve con su id asignado.
// productosRouter.post("/totales", async (req, res) => {
productosRouter.post("/", async (req, res) => {
  let productos = await getData("./contenedor/productos.txt");

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
      writeData("./contenedor/productos.txt", [
        ...productos,
        { ...req.body, id: id },
      ]);
      productos = await getData("./contenedor/productos.txt");
      productoGuardado.push(...productos, { ...req.body, id: id });
      // return res.json([{ ...req.body, id: id }]);
      return res.render("formulario", { productos });
    } catch (e) {
      console.log("No se pudo guardar el objeto " + e);
    }
});

productosRouter.put("/:id", async (req, res) => {
  const numeroId = req.params.id;
  try {
    const productos = await getData("./contenedor/productos.txt");
    if (estaProducto(numeroId, productos)) {
      const indexProducto = req.params.id - 1;
      const productoCargar = { ...req.body, id: numeroId };
      productos.splice(indexProducto, 1, productoCargar);
      writeData("./contenedor/productos.txt", productos);
      return res.json("se actualizo el producto");
    }
    return res.json("no esta el producto");
  } catch (error) {
    console.log("no se pudo post producto nuevo " + error);
  }
});

productosRouter.delete("/", async (req, res) => {
  try {
    let productos = await getData("./contenedor/productos.txt");
    console.log(productos);
    // if (estaProducto(productos)) {
    if (productos) {
      writeData("./contenedor/productos.txt", []);
      return res.json({ mensaje: "Se borro todo" });
    }
  } catch (err) {
    res.json({ mensaje: "No se pudo borrar todo" });
  }
});

productosRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const productos = await getData("./contenedor/productos.txt");
    const indice = id - 1;
    if (estaProducto(id, productos)) {
      productos.splice(indice, 1);
      let indiceId = 1;
      productos.forEach((element) => {
        element.id = indiceId;
        indiceId++;
      });
      writeData("./contenedor/productos.txt", productos);
      return res.json({ mensaje: `El item con el ID ${id} fue eliminado` });
    }
    res.json({ mensaje: `El item con el ID ${id} no esta` });
  } catch (err) {
    res.json({ mensaje: `no se pudo eliminar el id` });
  }
});

module.exports = productosRouter;
