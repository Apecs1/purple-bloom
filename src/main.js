import './style.css'
import { db } from './firebase.js'
import { ref, push, set } from 'firebase/database'

document.querySelector('#app').innerHTML = `
<nav class="navbar">
  <div class="logo">Purple Bloom</div>

  <div class="menu">
    <a href="#inicio">Inicio</a>
    <a href="#servicios">Servicios</a>
    <a href="#galeria">Galería</a>
    <a href="#nosotros">Nosotros</a>
    <a href="#citas">Citas</a>
  </div>
</nav>

<header class="hero" id="inicio">
  <div class="hero-content">
    <span>Beauty • Nails • Hair • Makeup</span>
    <h1>Purple Bloom</h1>
    <p>Un espacio creado para resaltar tu belleza, renovar tu estilo y consentirte como mereces.</p>
    <a href="#citas" class="btn">Reservar Ahora</a>
  </div>
</header>

<section class="servicios" id="servicios">
  <h2>Nuestros Servicios</h2>
  <p class="subtitulo">Todo lo que necesitas para lucir espectacular.</p>

  <div class="grid">
    <div class="card">
      <h3>💅 Uñas Acrílicas</h3>
      <p>Diseños personalizados y tendencias actuales.</p>
      <strong>$350 MXN</strong>
      <button onclick="seleccionarServicio('Uñas Acrílicas')">Agendar</button>
    </div>

    <div class="card">
      <h3>✨ Gelish</h3>
      <p>Color, brillo y duración para tus uñas.</p>
      <strong>$180 MXN</strong>
      <button onclick="seleccionarServicio('Gelish')">Agendar</button>
    </div>

    <div class="card">
      <h3>🧴 Manicure & Pedicure</h3>
      <p>Cuidado completo para manos y pies.</p>
      <strong>$220 MXN</strong>
      <button onclick="seleccionarServicio('Manicure y Pedicure')">Agendar</button>
    </div>

    <div class="card">
      <h3>✂️ Corte de Cabello</h3>
      <p>Estilos modernos para dama y caballero.</p>
      <strong>$150 MXN</strong>
      <button onclick="seleccionarServicio('Corte de Cabello')">Agendar</button>
    </div>

    <div class="card">
      <h3>👑 Peinados</h3>
      <p>Peinados para eventos especiales.</p>
      <strong>$250 MXN</strong>
      <button onclick="seleccionarServicio('Peinado')">Agendar</button>
    </div>

    <div class="card">
      <h3>💄 Maquillaje</h3>
      <p>Maquillaje social y profesional.</p>
      <strong>$300 MXN</strong>
      <button onclick="seleccionarServicio('Maquillaje')">Agendar</button>
    </div>
  </div>
</section>

<section class="galeria" id="galeria">
  <h2>Galería</h2>

  <div class="galeria-grid">
    <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80">
    <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80">
    <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80">
    <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80">
  </div>
</section>

<section class="nosotros" id="nosotros">
  <div class="contenido-nosotros">
    <span>Sobre Nosotros</span>
    <h2>Más que un salón de belleza</h2>
    <p>
      En Purple Bloom creemos que cada persona merece sentirse hermosa y segura de sí misma.
      Nuestro equipo está comprometido en brindarte una experiencia profesional, cálida y personalizada.
    </p>
  </div>
</section>

<section class="citas" id="citas">
  <h2>Agenda tu cita</h2>

  <input type="text" id="nombre" placeholder="Nombre completo">
  <input type="tel" id="telefono" placeholder="Teléfono">

  <select id="servicio">
    <option value="">Selecciona un servicio</option>
    <option>Uñas Acrílicas</option>
    <option>Gelish</option>
    <option>Manicure y Pedicure</option>
    <option>Corte de Cabello</option>
    <option>Peinado</option>
    <option>Maquillaje</option>
  </select>

  <input type="date" id="fecha">
  <input type="time" id="hora">
  <textarea id="notas" placeholder="Comentarios adicionales"></textarea>

  <button id="agendar">Enviar por WhatsApp</button>
</section>

<footer>
  <h3>Purple Bloom</h3>
  <p>Belleza • Uñas • Cabello • Maquillaje</p>
</footer>

<a class="whatsapp" href="https://wa.me/523312546212" target="_blank">💬</a>
`

window.seleccionarServicio = function(servicio) {
  document.getElementById('servicio').value = servicio
  document.getElementById('citas').scrollIntoView({
    behavior: 'smooth'
  })
}

document.getElementById('agendar').addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value
  const telefono = document.getElementById('telefono').value
  const servicio = document.getElementById('servicio').value
  const fecha = document.getElementById('fecha').value
  const hora = document.getElementById('hora').value
  const notas = document.getElementById('notas').value

  if (!nombre || !telefono || !servicio || !fecha || !hora) {
    alert('Por favor llena todos los campos obligatorios')
    return
  }

  const cita = {
    nombre,
    telefono,
    servicio,
    fecha,
    hora,
    notas,
    estado: 'pendiente',
    creadoEn: new Date().toLocaleString()
  }

  try {
    const nuevaCita = push(ref(db, 'citas'))
    await set(nuevaCita, cita)

    alert('Tu cita fue guardada correctamente')

    const numeroWhatsApp = '523312546212'

    const mensaje = `Hola, quiero agendar una cita en Purple Bloom.

Nombre: ${nombre}
Teléfono: ${telefono}
Servicio: ${servicio}
Fecha: ${fecha}
Hora: ${hora}
Notas: ${notas}`

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    )

    document.getElementById('nombre').value = ''
    document.getElementById('telefono').value = ''
    document.getElementById('servicio').value = ''
    document.getElementById('fecha').value = ''
    document.getElementById('hora').value = ''
    document.getElementById('notas').value = ''

  } catch (error) {
    console.error(error)
    alert('Error al guardar la cita. Revisa Firebase.')
  }
})