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
    const contenedor = await getData("./contenedor/productos.txt");
    contenedor !== undefined
      ? // ? res.send(contenedor)
        res.render("formulario", { productosRouter })
      : res.json({ error: "producto no encontrado" });
  } catch (error) {
    return res.json({ mensaje: "no se pudo comprar" });
  }
});

productosRouter.get("/totales", async (req, res) => {
  try {
    const contenedor = await getData("./contenedor/productos.txt");
    contenedor !== undefined
      ? res.send(contenedor)
      : // ? res.render("table", { productosRouter })
        res.json({ error: "producto no encontrado" });
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
productosRouter.post("/totales", async (req, res) => {
  const productos = await getData("./contenedor/productos.txt");
  console.log(req.body);
  console.log("Length de productos", productos.length);
  res.render("../views/partials/table.ejs", {productos});

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
  if (productos == "[]") {
    productos = 0;
  }
  const id = productos.length + 1;

  const productoGuardado = [];

  if (id == 1) {
    try {
      productoGuardado.push({ ...req.body, id: id });
      writeData("./contenedor/productos.txt", [{ ...req.body, id: id }]);
      return res.json([{ ...req.body, id: id }]);
    } catch (e) {
      return console.log("No se pudo guardar los objeto " + e);
    }
  } else {
    try {
      writeData("./contenedor/productos.txt", [
        ...productos,
        { ...req.body, id: id },
      ]);
      productoGuardado.push(...productos, { ...req.body, id: id });
      return res.json([{ ...req.body, id: id }]);
    } catch (e) {
      console.log("No se pudo guardar el objeto " + e);
    }
  }

  res.json({ error: "productos no encontrado" });
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
