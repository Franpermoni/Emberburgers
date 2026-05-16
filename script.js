// ── CARRUSEL VALORES ──
let slideActual = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function irASlide(n) {
    slides[slideActual].classList.remove('active');
    dots[slideActual].classList.remove('active');
    slideActual = n;
    slides[slideActual].classList.add('active');
    dots[slideActual].classList.add('active');
}

setInterval(() => {
    const siguiente = (slideActual + 1) % slides.length;
    irASlide(siguiente);
}, 4000);

// ── CARRUSEL NOSOTROS ──
let slideNosotrosActual = 0;
const slidesNosotros = document.querySelectorAll('.carruselinfo');
const dotsNosotros = document.querySelectorAll('.dot-nosotros');

function irASlideNosotros(n) {
    slidesNosotros[slideNosotrosActual].classList.remove('active');
    dotsNosotros[slideNosotrosActual].classList.remove('active');
    slideNosotrosActual = n;
    slidesNosotros[slideNosotrosActual].classList.add('active');
    dotsNosotros[slideNosotrosActual].classList.add('active');
}



// ── CARRITO ──
const carritoPanel = document.getElementById('carrito-panel');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

document.querySelector('.cart-icon-btn').addEventListener('click', () => {
    carritoPanel.style.display = carritoPanel.style.display === 'block' ? 'none' : 'block';
});

cerrarCarrito.addEventListener('click', () => {
    carritoPanel.style.display = 'none';
});

let carrito = [];

function agregarAlCarrito(btn) {
    const nombre = btn.dataset.nombre;
    const precio = parseInt(btn.dataset.precio);
    const imagen = btn.dataset.imagen;

    const existente = carrito.find(item => item.nombre === nombre);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }

    actualizarCarrito();
    carritoPanel.style.display = 'block';
}

function actualizarCarrito() {
    const tbody = document.getElementById('carrito-body');
    const totalSpan = document.getElementById('total');
    const badge = document.querySelector('.cart-badge');

    tbody.innerHTML = '';
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;
        cantidadTotal += item.cantidad;
        tbody.innerHTML += `
            <tr>
  <td><img src="${item.imagen}" width="50"></td>
  <td>${item.nombre}</td>
  <td>
    <div style="display:flex; align-items:center; gap:6px;">
      <button onclick="cambiarCantidad(${index}, -1)">−</button>
      <span style="min-width:20px; text-align:center; display:inline-block;">${item.cantidad}</span>
      <button onclick="cambiarCantidad(${index}, 1)">+</button>
    </div>
  </td>
  <td>$${(item.precio * item.cantidad).toLocaleString()}</td>
  <td><button onclick="eliminarItem(${index})">🗑️</button></td>
</tr>
        `;
    });

    totalSpan.textContent = '$' + total.toLocaleString();
    badge.style.display = cantidadTotal > 0 ? 'block' : 'none';
    badge.textContent = cantidadTotal;
}

function cambiarCantidad(index, valor) {
    carrito[index].cantidad += valor;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    actualizarCarrito();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});

// Confirmar compra
document.getElementById('btn-confirmar-compra').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Generar número de orden aleatorio
    const nroOrden = Math.floor(Math.random() * 9000) + 1000;

    // Armar el mensaje
    let mensaje = `🍔 *EMBER BURGERS — NUEVO PEDIDO #${nroOrden}*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensaje += `📋 *DETALLE DEL PEDIDO:*\n`;

    carrito.forEach(item => {
        mensaje += `• ${item.nombre} x${item.cantidad} — $${(item.precio * item.cantidad).toLocaleString()}\n`;
    });

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    mensaje += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💰 *TOTAL: $${total.toLocaleString()}*\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    mensaje += `💳 *MÉTODO DE PAGO:*\n`;
    mensaje += `Por favor indicanos cómo vas a abonar:\n`;
    mensaje += `   • Mercado Pago\n`;
    mensaje += `   • QR\n`;
    mensaje += `   • Transferencia bancaria\n\n`;
    mensaje += `⚠️ *Si elegís transferencia*, por favor enviá el comprobante de pago por este mismo chat para confirmar tu pedido.\n\n`;
    mensaje += `✅ Tu pedido será confirmado una vez que recibamos el comprobante o la acreditación del pago. ¡Gracias por elegirnos! 🔥`;

    // Abrir WhatsApp
    const numero = '5493513534795';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    // Limpiar carrito
    carrito = [];
    actualizarCarrito();
    carritoPanel.style.display = 'none';
});

// Secciones que se ocultan/muestran
const SECCIONES_OCULTAS = ['sec-productos', 'sec-contacto'];
const SECCIONES_INICIO  = ['inicio-content', 'valores', 'nosotros-txt']; // clases de tus secciones del inicio
 
function mostrarSeccion(cual) {
  if (cual === 'inicio') {
    // Mostrar inicio, ocultar productos y contacto
    SECCIONES_INICIO.forEach(cls => {
      const el = document.querySelector('.' + cls) || document.getElementById(cls);
      if (el) el.style.display = '';
    });
    SECCIONES_OCULTAS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
 
  } else if (cual === 'nosotros') {
    // Scroll al nosotros en el inicio
    mostrarSeccion('inicio');
    setTimeout(() => {
      const el = document.querySelector('.nosotros-txt');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
 
  } else {
    // Ocultar inicio, mostrar la sección pedida
    SECCIONES_INICIO.forEach(cls => {
      const el = document.querySelector('.' + cls) || document.getElementById(cls);
      if (el) el.style.display = 'none';
    });
    SECCIONES_OCULTAS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = id === 'sec-' + cual ? 'block' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

//Responsive menu
function toggleMenu() {
  const navbar = document.getElementById('navbar');
  const overlay = document.getElementById('menu-overlay');
  navbar.classList.toggle('abierto');
  overlay.classList.toggle('activo');
}

function cerrarMenu() {
  const navbar = document.getElementById('navbar');
  const overlay = document.getElementById('menu-overlay');
  navbar.classList.remove('abierto');
  overlay.classList.remove('activo');
}

// Enviar formulario de contacto
function enviarFormulario() {
  const nombre   = document.querySelector('.contacto-form-col input[placeholder="Nombre"]').value.trim();
  const apellido = document.querySelector('.contacto-form-col input[placeholder="Apellido"]').value.trim();
  const telefono = document.querySelector('.contacto-form-col input[type="tel"]').value.trim();
  const email    = document.querySelector('.contacto-form-col input[type="email"]').value.trim();
  const mensaje  = document.querySelector('.contacto-form-col textarea').value.trim();

  if (!nombre || !email || !mensaje) {
    alert('Por favor completá nombre, email y mensaje.');
    return;
  }

  emailjs.send('service_uky7v5h', 'template_8xs47lg', {
    nombre,
    apellido,
    telefono,
    email,
    mensaje
  }).then(() => {
    alert('✅ Mensaje enviado con éxito. Te respondemos a la brevedad.');
    document.querySelectorAll('.contacto-form-col input, .contacto-form-col textarea')
      .forEach(el => el.value = '');
  }).catch(() => {
    alert('❌ Hubo un error al enviar. Intentá de nuevo.');
  });
}