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

// ✅ FIX 1: guardado en variable para poder limpiarlo si fuera necesario
const intervaloCarrusel = setInterval(() => {
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

// ── CONFIRMAR COMPRA ──
document.getElementById('btn-confirmar-compra').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const nroOrden = parseInt(localStorage.getItem('nroOrden') || '0') + 1;
    localStorage.setItem('nroOrden', nroOrden);

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

    const numero = '5493513534795';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');

    carrito = [];
    actualizarCarrito();
    carritoPanel.style.display = 'none';
});

// ── SECCIONES ──
const SECCIONES_OCULTAS = ['sec-productos', 'sec-contacto'];
const SECCIONES_INICIO  = ['inicio-content', 'valores', 'nosotros-txt'];

function mostrarSeccion(cual) {
  if (cual === 'inicio') {
    SECCIONES_INICIO.forEach(cls => {
      const el = document.querySelector('.' + cls) || document.getElementById(cls);
      if (el) el.style.display = '';
    });
    SECCIONES_OCULTAS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

  } else if (cual === 'nosotros') {
    mostrarSeccion('inicio');
    setTimeout(() => {
      const el = document.querySelector('.nosotros-txt');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);

  } else {
    SECCIONES_INICIO.forEach(cls => {
      const el = document.querySelector('.' + cls) || document.getElementById(cls);
      if (el) el.style.display = 'none';
    });
    SECCIONES_OCULTAS.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'sec-' + cual) {
          el.style.display = 'block';
          animarSeccion(id);
        } else {
          el.style.display = 'none';
        }
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── MENU RESPONSIVE ──
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

// ── FORMULARIO DE CONTACTO ──
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

// ── GSAP ANIMACIONES ──
gsap.registerPlugin(ScrollTrigger);

const esMobile = window.innerWidth <= 768;

// Forzar visibilidad inicial de elementos críticos
gsap.set('.info-nosotros-txt, .fondologo, .footer-col, .copy-footer', { clearProps: 'all' });

if (!esMobile) {
  // Nosotros
  gsap.from('.fondologo', {
    scrollTrigger: {
      trigger: '.nosotros-txt',
      start: 'top 75%',
      toggleActions: 'play reverse play reverse'
    },
    scale: 0.6, opacity: 0, duration: 1.2,
    ease: 'elastic.out(1, 0.5)', clearProps: 'all'
  });

  gsap.from('.info-nosotros-txt', {
    scrollTrigger: {
      trigger: '.nosotros-txt',
      start: 'top 75%',
      toggleActions: 'play reverse play reverse'
    },
    x: 120, opacity: 0, duration: 1,
    ease: 'power4.out', clearProps: 'all'
  });

  // Cards productos
  gsap.utils.toArray('.producto-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play reverse play reverse'
      },
      y: 100, opacity: 0, scale: 0.9,
      duration: 0.7, delay: i * 0.08,
      ease: 'back.out(1.4)', clearProps: 'all'
    });
  });
}

// Footer — funciona en mobile y desktop
gsap.from('.footer-col', {
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 95%',
    toggleActions: 'play none none none' 
  },
  y: 40, opacity: 0, duration: 0.7,
  stagger: 0.15, ease: 'power3.out', clearProps: 'all'
});

gsap.from('.copy-footer', {
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 95%',
    toggleActions: 'play none none none'  
  },
  y: 20, opacity: 0, duration: 0.5,
  delay: 0.4, ease: 'power3.out', clearProps: 'all'
});

// ── ANIMAR SECCIONES ──
let footerScrollTrigger = null;

function animarSeccion(id) {
  if (footerScrollTrigger) {
    footerScrollTrigger.kill();
    footerScrollTrigger = null;
  }

  gsap.killTweensOf('.footer-col, .copy-footer');

  if (id === 'sec-productos') {
    gsap.from('.productos-header', {
      y: -50, opacity: 0, duration: 0.7,
      ease: 'power3.out', clearProps: 'all'
    });
    if (!esMobile) {
      gsap.from('.producto-card', {
        y: 80, opacity: 0, scale: 0.9,
        duration: 0.6, stagger: 0.1,
        delay: 0.1, ease: 'back.out(1.4)', clearProps: 'all'
      });
    }
  }

  if (id === 'sec-contacto') {
    gsap.from('.contacto-form-col', {
      x: esMobile ? 0 : -80, opacity: 0,
      duration: 0.9, ease: 'power4.out', clearProps: 'all'
    });
    gsap.from('.contacto-info-col', {
      x: esMobile ? 0 : 80, opacity: 0,
      duration: 0.9, ease: 'power4.out', clearProps: 'all'
    });
  }

  // ✅ FIX: verificar si el footer ya está en el viewport antes de crear el trigger
  const footerEl = document.querySelector('.footer');
  const footerRect = footerEl.getBoundingClientRect();
  const yaVisible = footerRect.top < window.innerHeight;

  if (yaVisible) {
    // Ya está visible — animar directo sin esperar scroll
    gsap.fromTo('.footer-col',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', clearProps: 'all' }
    );
    gsap.fromTo('.copy-footer',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power3.out', clearProps: 'all' }
    );
  } else {
    // No está visible — preparar y esperar scroll
    gsap.set('.footer-col', { opacity: 0, y: 40 });
    gsap.set('.copy-footer', { opacity: 0, y: 20 });

    footerScrollTrigger = ScrollTrigger.create({
      trigger: '.footer',
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to('.footer-col', {
          y: 0, opacity: 1, duration: 0.7,
          stagger: 0.15, ease: 'power3.out', clearProps: 'all'
        });
        gsap.to('.copy-footer', {
          y: 0, opacity: 1, duration: 0.5,
          delay: 0.3, ease: 'power3.out', clearProps: 'all'
        });
      }
    });
  }
}