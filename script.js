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

document.getElementById('btn-confirmar-compra').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    alert('¡Compra confirmada! Gracias por tu pedido 🍔');
    carrito = [];
    actualizarCarrito();
    carritoPanel.style.display = 'none';
});