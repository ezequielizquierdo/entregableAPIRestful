const fs = require("fs");

const writeData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("ERROR DE ESCRITURA", error);
  }
};

const buscarId = async (file, id) => {
  const respuesta = await fs.promises.readFile(file, "utf-8");
  const data = await JSON.parse(respuesta, null, 2);
  const isArray = data.some((item) => item.id == id);
  if (isArray) {
    const itemFound = data.find((item) => item.id == id);
    return itemFound;
  }
  return null;
};

const getData = async (file) => {
  try {
    const respuesta = await fs.promises.readFile(file, "utf-8");
    const data = await JSON.parse(respuesta, null, 2);
    return data;
  } catch (error) {
    console.log("Error de Lectura", error);
  }
};

const estaProducto = (id, array) => {
  return array.filter(producto => producto.id === id);
};


const clearProductos = () => {
  console.log("Hizo click")
  // return productos = []
}

module.exports = { getData, estaProducto, buscarId, writeData, clearProductos };
