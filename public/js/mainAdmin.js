const socket = io.connect()

socket.on('mi mensaje', (data) => {
  alert(data)
  socket.emit('notificacion', 'mensaje recibido con exito')
})

function enviarActualizacion(e) {
  const mensaje = {
    equipo: document.getElementById('username').value,
    descripcion: document.getElementById('texto').value,
  }
  socket.emit('nuevo-evento', mensaje)
  return false
}
