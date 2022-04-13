# Primera entrega del Proyecto final:

1- El router base '/api' implementará las siguientes funcionalidades:

GET: '/' - Me permite listar todos los productos disponibles
GET: '/:id' - Me permite listar un producto por su id
POST: '/' - Para incorporar productos al listado
PUT: '/:id' - Actualiza un producto por su id
DELETE: '/:id' - Borra un producto por su id
DELETE: '/' - Borra todos los productos


2- El router '/api/productos' implementará las siguientes funcionalidades:

POST: '/api/productos' - Crea un producto y le asigna su id.
DELETE: '/api/productos/:id' - Elimina el producto del id seleccionado
GET: '/api/productos/:id' - Me permite listar un producto por su id
POST: '/api/productos/:id' - Para incorporar productos por su id
DELETE: '/api/productos/:id' - Eliminar un producto por su id de productos

3- El router '/api/carrito' implementará las siguientes funcionalidades:

POST: '/api/carrito' - Crea un carrito y le asigna su id.
DELETE: '/api/carrito/:id' - Elimina un producto del carrito
GET: '/api/carrito/:id' - Me permite listar un producto por su id
POST: '/api/carrito/:id' - Para incorporar productos al carrito por su id
DELETE: '/api/carrito/:id' - Eliminar un producto del carrito por su id de carrito
