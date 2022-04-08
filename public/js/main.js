const socket = io.connect()
let hora = new Date();


// Creamos una funcion para renderizar lo que nos llegue (data). En este caso, author y text
// Lo va a recorrer por medio de la función .map con dos parametros. El elemento y el indice.
function render(data) {
  const html = data.map((elem, index) => {
      // Para cada iteración lo voy metiendo en un html
      return `
      <div>
        <strong class="user">${elem.author}</strong>:
        <em class="hora">(${hora.toLocaleString()})</em>
        <em class="texto">${elem.text}</em> 
      </div>`
    })
    .join(' ')
    // Con un innerHTML lo voy metiendo en "mensajes"
  document.getElementById('mensajes').innerHTML = html
}

// Tiene que ser el mismo evento que se envia desde el socket.emit ("messages")
// En el cliente tambien recibno los mensajes y los renderizo de la vista.
// Se hace dos veces. 1 para enviarle al cliente el historial y otra para enviarle el nuevo mensaje al cliente.
socket.on('messages', function (data) {
  render(data)
})

function addMessage(e) {
  const mensaje = {
    // Busco la etiqueta y la inserto con el valor.
    author: document.getElementById('username').value,
    text: document.getElementById('texto').value,
  }
  // Envia un mensaje
  socket.emit('new-message', mensaje)
  return false
}