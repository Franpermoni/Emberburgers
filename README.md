# 🔥 Ember Burgers — Sitio Web Oficial

Sitio web oficial de **Ember Burgers**, hamburguesería artesanal con 12 locales en Córdoba Capital. Desarrollado con HTML, CSS y JavaScript puro, sin frameworks, con animaciones GSAP y despliegue en Vercel.

🌐 **[emberburgers.vercel.app](https://emberburgers.vercel.app)**

---

## 📋 Tabla de contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Instalación y uso local](#instalación-y-uso-local)
- [Despliegue](#despliegue)
- [Autor](#autor)

---

## Descripción

Sitio web de una sola página (SPA simulada) con navegación entre secciones sin recarga. Incluye carrusel de productos interactivo, carrito de compras con integración a WhatsApp, formulario de contacto con EmailJS y animaciones de scroll con GSAP ScrollTrigger.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura del sitio |
| CSS3 | Estilos, animaciones y diseño responsive |
| JavaScript (ES6+) | Lógica, interactividad y carrusel |
| [GSAP 3](https://greensock.com/gsap/) + ScrollTrigger | Animaciones al scroll |
| [EmailJS](https://www.emailjs.com/) | Envío de formulario de contacto sin backend |
| [Bootstrap 5](https://getbootstrap.com/) | Componentes puntuales |
| [Google Fonts](https://fonts.google.com/) | Tipografías Poppins y Bebas Neue |
| [Vercel](https://vercel.com/) | Hosting y despliegue continuo |
| Git + GitHub | Control de versiones |

---

## Estructura del proyecto

```
emberburgers/
├── index.html          # Estructura principal del sitio
├── style.css           # Estilos globales y responsive
├── script.js           # Lógica JS: carrusel, carrito, animaciones
└── images/
    ├── logo.png
    ├── icono.png
    ├── ClassicSmash.png
    ├── brave.png
    ├── 7thstreet.png
    ├── oneburger.png
    ├── manhattan.png
    ├── simplesmash.png
    ├── fondonosotros.jpeg
    ├── fc.jpg
    ├── ig.jpg
    ├── tiktok.avif
    └── Copyright.png
```

---

## Funcionalidades

### 🧭 Navegación SPA
- Navegación entre secciones (Inicio, Productos, Nosotros, Contacto) sin recargar la página
- Click en el logo vuelve al inicio
- Menú hamburguesa en mobile con overlay y cierre por swipe/click afuera

### 🍔 Carrusel de Productos
- Vista panorámica con hamburguesa activa en el centro y adyacentes a los lados
- Navegación con flechas y dots
- Swipe táctil en mobile
- Muestra nombre, ingredientes en dos columnas, precio y botón de agregar al carrito
- Animación de transición al cambiar de producto
- Precarga de imágenes para evitar parpadeos

### 🛒 Carrito de Compras
- Agregar, quitar y vaciar productos
- Contador de items en el ícono del carrito
- Cierre tocando fuera del panel
- Al confirmar, genera un pedido numerado progresivamente y abre WhatsApp con el detalle completo del pedido

### 📬 Formulario de Contacto
- Validación de campos requeridos (nombre, email, mensaje)
- Envío real de emails via EmailJS sin backend
- Modal de feedback personalizado con identidad de la marca

### ✨ Animaciones
- Animaciones de entrada/salida al scroll con GSAP ScrollTrigger
- Activas en todas las pantallas (desktop, tablet y mobile)
- Sección Nosotros: escala y deslizamiento
- Sección Contacto: deslizamiento lateral
- Footer: fade-in al aparecer
- Carrusel de valores con auto-play cada 4 segundos

### 📱 Responsive
- Diseño adaptado para desktop (≥1024px), tablet (≤1024px), mobile (≤768px) y mobile pequeño (≤480px)
- Menú lateral deslizable en mobile
- Solo el carrito permanece fijo en scroll mobile

---

## Instalación y uso local

No requiere instalación de dependencias. Todo corre en el navegador.

```bash
# Clonar el repositorio
git clone https://github.com/Franpermoni/Emberburgers.git

# Entrar al directorio
cd Emberburgers

# Abrir en el navegador
# Opción 1: abrir index.html directamente
# Opción 2: usar Live Server en VS Code (recomendado)
```

> **Recomendado:** usar la extensión **Live Server** de VS Code para evitar problemas con rutas relativas de imágenes.

---

## Despliegue

El sitio está desplegado en **Vercel** con despliegue continuo desde la rama `principal` de GitHub.

Cada push a `principal` genera un nuevo despliegue automático en producción.

```
Rama: principal
URL producción: https://emberburgers.vercel.app
```

---

## Autor

**Francisco Permoni**  
🌐 [franciscopermoni.com](https://franciscopermoni.com)

---

*Desarrollado con 🔥 para Ember Burgers — Sabor real, hecho al fuego.*
