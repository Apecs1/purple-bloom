import './style.css'
import { db, auth } from './firebase.js'
import { ref, onValue, update } from 'firebase/database'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

const admin = document.querySelector('#admin')

function mostrarLogin() {
  admin.innerHTML = `
    <section class="login-admin">
      <div class="login-card">
        <h1>Purple Bloom</h1>
        <h2>Panel Administrador</h2>

        <input type="email" id="email" placeholder="Correo electrónico">
        <input type="password" id="password" placeholder="Contraseña">

        <button id="loginBtn">Entrar</button>

        <p id="loginError"></p>
      </div>
    </section>
  `

  document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      document.getElementById('loginError').textContent =
        'Correo o contraseña incorrectos'
    }
  })
}

function mostrarPanel() {
  admin.innerHTML = `
    <section class="admin-panel">
      <button id="logoutBtn" class="logout">Cerrar sesión</button>

      <h1>Panel Purple Bloom</h1>
      <p>Administra las citas registradas en la página.</p>

      <div class="resumen">
        <div>
          <h3 id="total">0</h3>
          <span>Total</span>
        </div>

        <div>
          <h3 id="pendientes">0</h3>
          <span>Pendientes</span>
        </div>

        <div>
          <h3 id="confirmadas">0</h3>
          <span>Confirmadas</span>
        </div>

        <div>
          <h3 id="canceladas">0</h3>
          <span>Canceladas</span>
        </div>
      </div>

      <div id="listaCitas" class="lista-citas"></div>
    </section>
  `

  document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth)
  })

  cargarCitas()
}

function cargarCitas() {
  const listaCitas = document.getElementById('listaCitas')

  onValue(ref(db, 'citas'), (snapshot) => {
    listaCitas.innerHTML = ''

    let total = 0
    let pendientes = 0
    let confirmadas = 0
    let canceladas = 0

    if (!snapshot.exists()) {
      listaCitas.innerHTML = '<p>No hay citas registradas.</p>'
      return
    }

    snapshot.forEach((childSnapshot) => {
      const id = childSnapshot.key
      const cita = childSnapshot.val()

      total++

      if (cita.estado === 'pendiente') pendientes++
      if (cita.estado === 'confirmada') confirmadas++
      if (cita.estado === 'cancelada') canceladas++

      const tarjeta = document.createElement('div')
      tarjeta.className = 'cita-card'

      tarjeta.innerHTML = `
        <div>
          <h3>${cita.nombre}</h3>
          <p><strong>Teléfono:</strong> ${cita.telefono}</p>
          <p><strong>Servicio:</strong> ${cita.servicio}</p>
          <p><strong>Fecha:</strong> ${cita.fecha}</p>
          <p><strong>Hora:</strong> ${cita.hora}</p>
          <p><strong>Notas:</strong> ${cita.notas || 'Sin notas'}</p>
          <p><strong>Creado:</strong> ${cita.creadoEn || 'Sin fecha'}</p>
          <p class="estado ${cita.estado}">${cita.estado}</p>
        </div>

        <div class="acciones">
          <button onclick="cambiarEstado('${id}', 'confirmada')">Confirmar</button>
          <button onclick="cambiarEstado('${id}', 'cancelada')">Cancelar</button>
          <a href="https://wa.me/52${cita.telefono}" target="_blank">WhatsApp</a>
        </div>
      `

      listaCitas.appendChild(tarjeta)
    })

    document.getElementById('total').textContent = total
    document.getElementById('pendientes').textContent = pendientes
    document.getElementById('confirmadas').textContent = confirmadas
    document.getElementById('canceladas').textContent = canceladas
  })
}

window.cambiarEstado = function(id, estado) {
  update(ref(db, `citas/${id}`), {
    estado: estado
  })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    mostrarPanel()
  } else {
    mostrarLogin()
  }
})