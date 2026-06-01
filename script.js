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

const intervaloCarrusel = setInterval(() => {
    const siguiente = (slideActual + 1) % slides.length;
    irASlide(siguiente);
}, 4000);

// ── CARRUSEL NOSOTROS ──
let slideNosotrosActual = 0;
const slidesNosotros = document.querySelectorAll('.carruselinfo');

function irASlideNosotros(n) {
    slidesNosotros[slideNosotrosActual].classList.remove('active');
    slideNosotrosActual = n;
    slidesNosotros[slideNosotrosActual].classList.add('active');
}

function nosotrosAnterior() {
    const anterior = slideNosotrosActual - 1 < 0 ? slidesNosotros.length - 1 : slideNosotrosActual - 1;
    irASlideNosotros(anterior);
}

function nosotrosSiguiente() {
    const siguiente = slideNosotrosActual + 1 >= slidesNosotros.length ? 0 : slideNosotrosActual + 1;
    irASlideNosotros(siguiente);
}

// ── SWIPE CARRUSEL NOSOTROS ──
const nosotrosContainer = document.querySelector('.info-nosotros-txt');
let touchStartX = 0;

nosotrosContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

nosotrosContainer.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    if (diff > 0) nosotrosSiguiente();
    else nosotrosAnterior();
}, { passive: true });

// ── CARRITO ──
const carritoPanel = document.getElementById('carrito-panel');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

document.querySelector('.cart-icon-btn').addEventListener('click', () => {
    carritoPanel.style.display = carritoPanel.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
    const esIcono = e.target.closest('.cart-icon');
    // ✅ FIX: usar composedPath para detectar el panel incluso después de re-render del tbody
    const path = e.composedPath ? e.composedPath() : [];
    const dentroCarrito = path.includes(carritoPanel) || e.target.closest('#carrito-panel');
    if (!dentroCarrito && !esIcono && carritoPanel.style.display === 'block') {
        carritoPanel.style.display = 'none';
    }
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

    // ✅ FIX: construir el HTML completo primero y asignarlo de una sola vez
    // así el panel no se re-renderiza parcialmente durante un click
    let html = '';
    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;
        cantidadTotal += item.cantidad;
        html += `
            <tr>
              <td><img src="${item.imagen}" width="50"></td>
              <td>${item.nombre}</td>
              <td>
                <div style="display:flex; align-items:center; gap:6px;">
                  <button onclick="cambiarCantidad(event, ${index}, -1)">−</button>
                  <span style="min-width:20px; text-align:center; display:inline-block;">${item.cantidad}</span>
                  <button onclick="cambiarCantidad(event, ${index}, 1)">+</button>
                </div>
              </td>
              <td>$${(item.precio * item.cantidad).toLocaleString()}</td>
              <td><button onclick="eliminarItem(${index})">🗑️</button></td>
            </tr>
        `;
    });

    tbody.innerHTML = html; // ✅ una sola asignación, no acumulativa

    totalSpan.textContent = '$' + total.toLocaleString();
    badge.style.display = cantidadTotal > 0 ? 'block' : 'none';
    badge.textContent = cantidadTotal;
}

function cambiarCantidad(e, index, valor) {
    e.stopPropagation(); //Frena el click antes de que altere el dom global
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
        mostrarModal('Tu carrito está vacío');
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
        mostrarModal('Por favor completá nombre, email y mensaje.');
        return;
    }

    emailjs.send('service_uky7v5h', 'template_8xs47lg', {
        nombre, apellido, telefono, email, mensaje
    }).then(() => {
        mostrarModal('✅ Mensaje enviado con éxito. Te respondemos a la brevedad.');
        document.querySelectorAll('.contacto-form-col input, .contacto-form-col textarea')
            .forEach(el => el.value = '');
    }).catch(() => {
        mostrarModal('❌ Hubo un error al enviar. Intentá de nuevo.');
    });
}

// ── MODAL ──
function mostrarModal(mensaje) {
    document.getElementById('modal-mensaje').textContent = mensaje;
    document.getElementById('modal-overlay').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modal-overlay').classList.remove('activo');
}

// ────────────────────────────────────────────
// ── GSAP ANIMACIONES — todas las pantallas ──
// ────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

gsap.set('.info-nosotros-txt, .fondologo, .footer-col, .copy-footer', { clearProps: 'all' });

// ── Nosotros ──
gsap.from('.fondologo', {
    scrollTrigger: {
        trigger: '.nosotros-txt',
        start: 'top 80%',
        toggleActions: 'play reverse play reverse'
    },
    scale: 0.6, opacity: 0, duration: 1.2,
    ease: 'elastic.out(1, 0.5)', clearProps: 'all'
});

gsap.from('.info-nosotros-txt', {
    scrollTrigger: {
        trigger: '.nosotros-txt',
        start: 'top 80%',
        toggleActions: 'play reverse play reverse'
    },
    x: 60, opacity: 0, duration: 1,
    ease: 'power4.out', clearProps: 'all'
});

// ── Footer — play none none none porque está al final ──
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
let seccionTriggers = [];
let footerScrollTrigger = null;

function limpiarTriggersSección() {
    seccionTriggers.forEach(t => t.kill());
    seccionTriggers = [];
    if (footerScrollTrigger) {
        footerScrollTrigger.kill();
        footerScrollTrigger = null;
    }
    gsap.killTweensOf('.footer-col, .copy-footer, .contacto-form-col, .contacto-info-col');
}

function animarSeccion(id) {
    limpiarTriggersSección();

    // ✅ FIX: inicializar el carrusel de productos al entrar a la sección
    if (id === 'sec-productos') {
        cpInit();
    }

    if (id === 'sec-contacto') {
        const tForm = ScrollTrigger.create({
            trigger: '.contacto-form-col',
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
            animation: gsap.from('.contacto-form-col', {
                x: -60, opacity: 0, duration: 0.9,
                ease: 'power4.out', clearProps: 'all',
                paused: true
            })
        });

        const tInfo = ScrollTrigger.create({
            trigger: '.contacto-info-col',
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
            animation: gsap.from('.contacto-info-col', {
                x: 60, opacity: 0, duration: 0.9,
                ease: 'power4.out', clearProps: 'all',
                paused: true
            })
        });

        seccionTriggers.push(tForm, tInfo);
    }

    // ── Footer ──
    const footerEl = document.querySelector('.footer');
    const footerRect = footerEl.getBoundingClientRect();
    const yaVisible = footerRect.top < window.innerHeight;

    if (yaVisible) {
        gsap.fromTo('.footer-col',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', clearProps: 'all' }
        );
        gsap.fromTo('.copy-footer',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power3.out', clearProps: 'all' }
        );
    } else {
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

// ── DATOS DE PRODUCTOS ──
const cpProductos = [
    {
        nombre: 'THE CLASSIC SMASH',
        imagen: 'images/ClassicSmash.png',
        ingredientes: ['Pan Sunset', 'smash 90gr', 'doble cheddar', 'salsa secreta'],
        precio: 8999,
        precioDisplay: '$8.999'
    },
    {
        nombre: 'BRAVE',
        imagen: 'images/brave.png',
        ingredientes: ['Pan Sunset', 'smash 90gr', 'doble cheddar', 'bacon', 'cebolla morada', 'salsa chill'],
        precio: 10500,
        precioDisplay: '$10.500'
    },
    {
        nombre: '7TH STREET',
        imagen: 'images/7thstreet.png',
        ingredientes: ['Pan Sunset', 'smash 90gr', 'doble cheddar', 'cebolla grillada', 'pepinillos', 'salsa mil islas'],
        precio: 9500,
        precioDisplay: '$9.500'
    },
    {
        nombre: 'ONE BURGER',
        imagen: 'images/oneburger.png',
        ingredientes: ['Pan Sunset', 'smash 90gr', 'doble cheddar', 'cebolla morada', 'tomate', 'lechuga', 'salsa mil islas'],
        precio: 10000,
        precioDisplay: '$10.000'
    },
    {
        nombre: 'MANHATTAN',
        imagen: 'images/manhattan.png',
        ingredientes: ['Pan Sunset', 'smash 90gr', 'doble cheddar', 'bacon', 'cebolla crispi', 'salsa chill'],
        precio: 10500,
        precioDisplay: '$10.500'
    },
    {
        nombre: 'SIMPLE SMASH',
        imagen: 'images/simplesmash.png',
        ingredientes: ['Pan Sunset', 'smash 90gr', 'doble cheddar', 'salsa mil islas'],
        precio: 8500,
        precioDisplay: '$8.500'
    }
];

let cpActual = 0;
let cpAnimando = false;
let cpSwipeInit = false; // ✅ evita registrar el swipe múltiples veces

function cpIndice(n) {
    return ((n % cpProductos.length) + cpProductos.length) % cpProductos.length;
}

function cpRenderizar(idx) {
    const prev = cpProductos[cpIndice(idx - 1)];
    const curr = cpProductos[cpIndice(idx)];
    const next = cpProductos[cpIndice(idx + 1)];

    document.getElementById('cp-img-prev').src    = prev.imagen;
    document.getElementById('cp-img-prev').alt    = prev.nombre;
    document.getElementById('cp-img-active').src  = curr.imagen;
    document.getElementById('cp-img-active').alt  = curr.nombre;
    document.getElementById('cp-img-next').src    = next.imagen;
    document.getElementById('cp-img-next').alt    = next.nombre;

    // Re-animar nombre
    const nombreEl = document.getElementById('cp-nombre');
    nombreEl.style.animation = 'none';
    nombreEl.offsetHeight;
    nombreEl.style.animation = '';
    nombreEl.textContent = curr.nombre;

    // Re-animar detalle
    const detalleEl = document.getElementById('cp-detalle');
    detalleEl.style.animation = 'none';
    detalleEl.offsetHeight;
    detalleEl.style.animation = '';

    document.getElementById('cp-detalle-img').src          = curr.imagen;
    document.getElementById('cp-detalle-img').alt          = curr.nombre;
    const ingEl = document.getElementById('cp-ingredientes');
ingEl.innerHTML = curr.ingredientes.map(ing =>
    `<span class="cp-ing-item">🍔 ${ing}</span>`
).join('');
    document.getElementById('cp-precio').textContent        = curr.precioDisplay;

    const btn = document.getElementById('cp-btn-agregar');
    btn.dataset.nombre = curr.nombre;
    btn.dataset.precio = curr.precio;
    btn.dataset.imagen = curr.imagen;

    document.querySelectorAll('.cp-dot').forEach((d, i) => {
        d.classList.toggle('active', i === cpIndice(idx));
    });
}

function cpCambiar(direccion) {
    if (cpAnimando) return;
    cpAnimando = true;

    const activeEl = document.getElementById('cp-active');
    const salida = direccion > 0 ? 'animando-salida-izq' : 'animando-salida-der';
    activeEl.classList.add(salida);

    setTimeout(() => {
        activeEl.classList.remove(salida);
        cpActual = cpIndice(cpActual + direccion);
        cpRenderizar(cpActual);
        activeEl.classList.add('animando-entrada');
        setTimeout(() => {
            activeEl.classList.remove('animando-entrada');
            cpAnimando = false;
        }, 400);
    }, 300);
}

function cpSiguiente() { cpCambiar(1);  }
function cpAnterior()  { cpCambiar(-1); }

function cpAgregar() {
    const btn = document.getElementById('cp-btn-agregar');
    agregarAlCarrito(btn);
}

function cpInitSwipe() {
    if (cpSwipeInit) return; // ✅ solo registrar una vez
    cpSwipeInit = true;

    const stage = document.querySelector('.cp-stage');
    let startX = 0;

    stage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) < 40) return;
        if (diff > 0) cpSiguiente();
        else cpAnterior();
    }, { passive: true });
}

function cpInit() {
    // ✅ Precargar todas las imágenes antes de mostrar
    cpProductos.forEach(p => {
        const img = new Image();
        img.src = p.imagen;
    });

    // Crear dots
    const dotsEl = document.getElementById('cp-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    cpProductos.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'cp-dot' + (i === 0 ? ' active' : '');
        d.onclick = () => {
            if (i !== cpActual) {
                const dir = i > cpActual ? 1 : -1;
                cpActual = i - dir;
                cpCambiar(dir);
            }
        };
        dotsEl.appendChild(d);
    });

    cpActual = 0;
    cpRenderizar(0);
    cpInitSwipe();
}