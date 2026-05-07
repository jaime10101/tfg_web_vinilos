/* ============================================================
   DETALLE_MERCH.JS — Lógica del detalle de merch
   Rutas relativas con ../../ (está en pages/detalle/)
   ============================================================ */


/* ============================================================
   DATOS
   TODO (Spring Boot): GET /api/productos/{id}
   ============================================================ */
const PRODUCTS = {
    1:  { id: 1,  name: "Camiseta The Car Tour",  artist: "Arctic Monkeys",  price: 35, oldPrice: null, category: "Camiseta",  badge: "new",      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", material: "100% algodón orgánico",      sizes: ["XS","S","M","L","XL","XXL"], colors: ["#1a1a2e","#e91e8c","#ffffff"], description: "Camiseta oficial de la gira The Car Tour de Arctic Monkeys. Diseño exclusivo en algodón orgánico. Corte unisex con el artwork serigrafiado en la parte frontal." },
    2:  { id: 2,  name: "Sudadera Motomami",       artist: "Rosalía",         price: 65, oldPrice: null, category: "Sudadera",  badge: null,        image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80", material: "80% algodón, 20% poliéster", sizes: ["XS","S","M","L","XL"],       colors: ["#0d0d0d","#c0392b","#f5f5f5"], description: "Sudadera oficial del álbum Motomami de Rosalía. Tejido grueso con capucha y bolsillo canguro." },
    3:  { id: 3,  name: "Tote Bag Dawn FM",        artist: "The Weeknd",      price: 12, oldPrice: 20,   category: "Accesorio", badge: "discount",  image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", material: "Canvas 100% algodón",        sizes: null,                          colors: ["#1a0033","#000000"],          description: "Tote bag oficial del álbum Dawn FM de The Weeknd. Bolsa resistente con el artwork serigrafiado." },
    4:  { id: 4,  name: "Eras Tour T-Shirt",       artist: "Taylor Swift",    price: 45, oldPrice: null, category: "Camiseta",  badge: null,        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", material: "100% algodón peinado",       sizes: ["XS","S","M","L","XL","XXL"], colors: ["#000000","#1a1a3e","#4a0080"], description: "Camiseta oficial negra de la gira Eras Tour de Taylor Swift." },
    5:  { id: 5,  name: "Set de Pines",            artist: "Varios Artistas", price: 15, oldPrice: null, category: "Accesorio", badge: null,        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&q=80", material: "Metal esmaltado",            sizes: null,                          colors: null,                           description: "Set de 5 pines coleccionables de tus artistas favoritos. Metal esmaltado de alta calidad." },
    6:  { id: 6,  name: "Taza Un Verano Sin Ti",   artist: "Bad Bunny",       price: 18, oldPrice: null, category: "Accesorio", badge: null,        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80", material: "Cerámica premium",           sizes: null,                          colors: ["#ffffff","#000000"],          description: "Taza oficial del álbum Un Verano Sin Ti de Bad Bunny. Cerámica premium de 350ml." },
    10: { id: 10, name: "Hoodie Eras Tour",        artist: "Taylor Swift",    price: 70, oldPrice: null, category: "Sudadera",  badge: null,        image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80", material: "85% algodón, 15% poliéster", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#1a1a3e","#4a0080","#000000"], description: "Sudadera premium oficial de la gira Eras Tour de Taylor Swift." },
    11: { id: 11, name: "Camiseta Bad Bunny",      artist: "Bad Bunny",       price: 38, oldPrice: null, category: "Camiseta",  badge: "new",       image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80", material: "100% algodón orgánico",      sizes: ["S","M","L","XL","XXL"],      colors: ["#000000","#ffffff","#f39c12"], description: "Camiseta oficial de Bad Bunny con su icónico conejo estampado." },
    20: { id: 20, name: "Eras Tour Hoodie",        artist: "Taylor Swift",    price: 65, oldPrice: null, category: "Sudadera",  badge: "new",       image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80", material: "85% algodón, 15% poliéster", sizes: ["XS","S","M","L","XL","XXL"], colors: ["#1a1a3e","#4a0080","#000000"], description: "Sudadera de pre-orden oficial de la gira Eras Tour de Taylor Swift." },
    22: { id: 22, name: "Blinding Lights Tee",     artist: "The Weeknd",      price: 40, oldPrice: null, category: "Camiseta",  badge: "new",       image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", material: "100% algodón peinado",       sizes: ["S","M","L","XL","XXL"],      colors: ["#000000","#c0392b","#1a1a2e"], description: "Camiseta oficial de The Weeknd inspirada en el videoclip de Blinding Lights." },
};

let quantity      = 1;
let selectedSize  = null;
let selectedColor = null;


/* Carga el producto desde el parámetro ?id= de la URL */
function loadProduct() {
    const params  = new URLSearchParams(window.location.search);
    const id      = parseInt(params.get('id')) || 1;
    const product = PRODUCTS[id];

    if (!product) {
        document.getElementById('productoNombre').textContent = 'Producto no encontrado';
        return;
    }

    /* Título de la pestaña */
    document.title = `${product.name} — Vinyl Sounds`;

    /* Imagen */
    document.getElementById('productoImagen').src = product.image;
    document.getElementById('productoImagen').alt = product.name;

    /* Cabecera — nombre, artista y categoría */
    document.getElementById('productoNombre').textContent     = product.name;
    document.getElementById('productoArtista').textContent    = product.artist;
    document.getElementById('productoPrecio').textContent     = `€${product.price.toFixed(2)}`;
    document.getElementById('productoDescripcion').textContent = product.description;
    document.getElementById('productoMaterial').textContent   = product.material;
    document.getElementById('productoCategoria').textContent  = product.category;
    document.getElementById('productoArtistaBD').textContent  = product.artist;

    /* Migas de pan */
    document.getElementById('migaNombre').textContent    = product.name;
    document.getElementById('migaCategoria').textContent = product.category;

    /* Badge de categoría */
    document.getElementById('etiquetaCategoria').textContent =
        `${product.category.toUpperCase()} OFICIAL`;

    /* Precio anterior si hay descuento */
    if (product.oldPrice) {
        const el       = document.getElementById('precioAntes');
        el.textContent = `€${product.oldPrice.toFixed(2)}`;
        el.style.display = 'inline';
    }

    /* Insignia NUEVO */
    if (product.badge === 'new') {
        document.getElementById('insigniaNuevo').style.display = 'block';
    }

    /* Miniatura */
    const miniatura = document.getElementById('miniaturaUnica');
    miniatura.style.backgroundImage    = `url(${product.image})`;
    miniatura.style.backgroundSize     = 'cover';
    miniatura.style.backgroundPosition = 'center';

    /* Selector de talla — solo si tiene tallas */
    if (product.sizes?.length > 0) {
        document.getElementById('selectorTalla').style.display = 'flex';
        const opciones = document.getElementById('opcionesTalla');
        opciones.innerHTML = product.sizes.map(size =>
            `<button class="btn-talla" data-size="${size}">${size}</button>`
        ).join('');

        /* Evento — seleccionar talla */
        opciones.querySelectorAll('.btn-talla').forEach(btn => {
            btn.addEventListener('click', () => {
                opciones.querySelectorAll('.btn-talla').forEach(b => b.classList.remove('seleccionada'));
                btn.classList.add('seleccionada');
                selectedSize = btn.dataset.size;
                document.getElementById('tallaSeleccionada').textContent = selectedSize;
            });
        });
    }

    /* Selector de color — solo si tiene colores */
    if (product.colors?.length > 0) {
        document.getElementById('selectorColor').style.display = 'flex';
        const opciones = document.getElementById('opcionesColor');
        opciones.innerHTML = product.colors.map(color =>
            `<button class="btn-color" data-color="${color}"
                style="background:${color};border:2px solid rgba(255,255,255,0.15);"></button>`
        ).join('');

        /* Nombres legibles de los colores */
        const NOMBRES = {
            '#000000': 'Negro',      '#ffffff': 'Blanco',    '#c0392b': 'Rojo',
            '#f39c12': 'Amarillo',   '#1a1a2e': 'Azul oscuro', '#1a1a3e': 'Azul marino',
            '#4a0080': 'Morado',     '#0d0d0d': 'Negro carbón', '#f5f5f5': 'Blanco hueso',
            '#1a0033': 'Índigo',     '#e91e8c': 'Rosa'
        };

        /* Evento — seleccionar color */
        opciones.querySelectorAll('.btn-color').forEach(btn => {
            btn.addEventListener('click', () => {
                opciones.querySelectorAll('.btn-color').forEach(b => b.classList.remove('seleccionado'));
                btn.classList.add('seleccionado');
                selectedColor = btn.dataset.color;
                document.getElementById('colorSeleccionado').textContent =
                    NOMBRES[selectedColor.toLowerCase()] || selectedColor;
            });
        });
    }

    loadRelated(id);
}


/* Carga los productos relacionados — aleatorios excepto el actual */
function loadRelated(currentId) {
    const grid    = document.getElementById('gridRelacionados');
    const related = Object.values(PRODUCTS)
        .filter(p => p.id !== currentId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    grid.innerHTML = related.map(p => `
        <a href="detalle_merch.html?id=${p.id}" class="tarjeta-relacionado">
            <div class="imagen-relacionado">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="info-relacionado">
                <h4>${p.name}</h4>
                <p>${p.artist}</p>
                <span class="precio-relacionado">€${p.price.toFixed(2)}</span>
            </div>
        </a>`).join('');
}


/* Botones de cantidad */
document.getElementById('btnMas').addEventListener('click', () => {
    quantity++;
    document.getElementById('cantidad').textContent = quantity;
});

document.getElementById('btnMenos').addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        document.getElementById('cantidad').textContent = quantity;
    }
});


/* Botón añadir al carrito — valida talla si es necesario */
document.getElementById('btnAnadirCarrito').addEventListener('click', () => {
    const params  = new URLSearchParams(window.location.search);
    const id      = parseInt(params.get('id')) || 1;
    const product = PRODUCTS[id];
    if (!product) return;

    /* Validación — talla obligatoria si el producto tiene tallas */
    if (product.sizes && !selectedSize) {
        alert('Por favor selecciona una talla.');
        return;
    }

    if (typeof Carrito !== 'undefined') {
        Carrito.agregar({
            id:     product.id,
            nombre: product.name,
            precio: `€${product.price.toFixed(2)}`,
            tipo:   'merch',
            imagen: product.image
        });
    }

    /* Aviso de confirmación */
    const aviso = document.getElementById('avisoCarrito');
    aviso.style.display = 'flex';
    setTimeout(() => { aviso.style.display = 'none'; }, 3000);
});


/* Inicialización */
document.addEventListener('DOMContentLoaded', loadProduct);