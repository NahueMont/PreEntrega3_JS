

// Clases

class Producto {

    constructor(id, nombre, tipo, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.precio = precio;
        this.stock = stock;
    }
}

// Funciones

// Llevar los productos al front


function renderProductos(productosA) {

    const container = document.getElementById("container")
    container.className = "d-flex flex-wrap justify-content-center"
    container.innerHTML = "";

    for (const producto of productosA) {

        const divCard = document.createElement("div");
        divCard.className = "card m-2 border-2 border-black rounded-2";
        divCard.style = "width: 20rem; ";

        const divCardBody = document.createElement("div");
        divCardBody.className = "card-body bg-secondary rounded-2";
        divCardBody.style = "width: 20rem; color: white";

        const h5 = document.createElement("h5");
        h5.className = "card-title";
        h5.innerText = producto.nombre;

        const p = document.createElement("p");
        p.className = "card-text";
        p.innerHTML = `Precio: <strong>$${producto.precio}</strong><br>Stock: <strong>${producto.stock}</strong>`;

        const anadirCarritoDiv = document.createElement("div");
        anadirCarritoDiv.className = "d-inline-flex align-items-center justify-content-between";

        const botonAnadirAlCarrito = document.createElement("button");
        botonAnadirAlCarrito.className = "btn border-black border-2 bg-success text-white";
        botonAnadirAlCarrito.innerText = "Añadir al carrito"

        const inputStockCantidad = document.createElement("input");
        inputStockCantidad.className = "form-control w-25 ms-3";
        inputStockCantidad.min = 1;
        inputStockCantidad.type = "number";
        inputStockCantidad.value = 1;


        // Agregar al carrito
        botonAnadirAlCarrito.addEventListener("click", () => {

            cantidad = inputStockCantidad.value;

            if (cantidad > producto.stock || cantidad < 1) {

                alert("Por favor, ingrese un stock válido.");

            } else {

                agregarAlCarrito(producto, cantidad);

                restarStock(producto, cantidad);

            }
        });

        // Insertar elementos 
        divCard.append(divCardBody);
        divCardBody.append(h5, p, anadirCarritoDiv);
        anadirCarritoDiv.append(botonAnadirAlCarrito, inputStockCantidad)
        container.append(divCard);

    }
}

// Guardar los productos en el carrito y LS.  (fixear bug de local storage en el que cuando se refresca, el stock no vuelve a su estado original, pero si lo filtro, sí lo hace.)

function agregarAlCarrito(producto, cantidad) {

    const productoAAgregar = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: parseInt(cantidad),
    }

    if (cantidad > 0) {

        if (carrito === null) {

            carrito = [productoAAgregar];

        } else {

            const indexProductoLS = carrito.findIndex((el) => {
                return el.nombre === productoAAgregar.nombre;
            });

            if (indexProductoLS === -1) {
                carrito.push(productoAAgregar);
            } else {
                carrito[indexProductoLS].cantidad += parseInt(cantidad);
            }
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));

        renderTablaCarrito(carrito);

    }
}

// Restar el stock de un producto dependiendo de la cantidad (input)

function restarStock(producto, cantidad) {

    const indexStockARestarDeProducto = productos.findIndex((el) => {
        return producto.nombre === el.nombre;
    });


    if (indexStockARestarDeProducto !== -1) {

        // Resto el stock del producto que está en el carrito
        productosB[indexStockARestarDeProducto].stock -= cantidad;

        localStorage.setItem("productos", JSON.stringify(productosB));

        renderProductos(productosB);

    }
}

// Cargar la tabla del carrito al front

function renderTablaCarrito(productosCarrito) {

    const tbody = document.querySelector("#carrito table tbody");
    tbody.innerHTML = "";


    for (const productoCarrito of productosCarrito) {

        const tr = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.innerText = productoCarrito.nombre;

        const tdPrecio = document.createElement("td");
        tdPrecio.innerText = `$${productoCarrito.precio}`;

        const tdCantidad = document.createElement("td");
        tdCantidad.innerText = productoCarrito.cantidad;

        const tdTotal = document.createElement("td");
        tdTotal.innerText = `$${productoCarrito.cantidad * productoCarrito.precio}`;

        const tdEliminar = document.createElement("td");

        const botonEliminar = document.createElement("button");
        botonEliminar.className = "btn btn-danger";
        botonEliminar.innerText = "Eliminar";

        // Eliminar del carrito
        botonEliminar.addEventListener("click", () => {

            eliminarProducto(productoCarrito);

            sumarStock(productoCarrito, productoCarrito.cantidad);

        });


        // Agregar elementos uno adentro del otro
        tdEliminar.append(botonEliminar);
        tr.append(tdNombre, tdPrecio, tdCantidad, tdTotal, tdEliminar);
        tbody.append(tr);
    }
}

// Sumar el stock al producto luego de eliminarlo del carrito
function sumarStock(producto, cantidad) {

    const indexProductoASumarStock = productos.findIndex((el) => {
        return producto.nombre === el.nombre;
    });

    if (indexProductoASumarStock !== -1) {

        // Resto el stock del producto que está en el carrito
        productosB[indexProductoASumarStock].stock += cantidad;

        localStorage.setItem("productos", JSON.stringify(productosB));

        renderProductos(productosB);

    }

}

// Eliminar productos del local storage y del carrito
function eliminarProducto(producto) {

    const indexProductoAEliminar = carrito.findIndex((el) => {
        return producto.nombre === el.nombre;
    });

    if (indexProductoAEliminar !== -1) {

        carrito.splice(indexProductoAEliminar, 1);

        localStorage.setItem("carrito", JSON.stringify(carrito));

        renderTablaCarrito(carrito);

    }
}

// Obtengo los productos del carrito (local storage), para renderizar la tabla
function obtenerCarritoDelLS() {

    carrito = JSON.parse(localStorage.getItem("carrito"));

    if (carrito) {

        renderTablaCarrito(carrito);

    }
}

// Eliminar el carrito del local storage
function vaciarCarrito() {

    const botonVaciar = document.getElementById("vaciar");

    botonVaciar.addEventListener("click", () => {

        productosB = productos;

        localStorage.setItem("productos", JSON.stringify(productosB));

        renderProductos(productosB);

        // Vacío el carrito
        localStorage.removeItem("carrito");

        carrito = [];

        renderTablaCarrito(carrito);

    });
}

// Ordenar los productos renderizados por precio, de manera ascendente
function ordenarPorPrecioAscendente() {

    const productosOrdenados = productos.sort((a, b) => {

        if (a.precio > b.precio) {

            return 1;

        } else if (a.precio < b.precio) {

            return -1;
        }

        return 0;
    });

    renderProductos(productosOrdenados);
}

// Ordenar los productos renderizados por precio, de manera descendente
function ordenarPorPrecioDescendente() {

    const productosOrdenados = productos.sort((a, b) => {

        if (a.precio > b.precio) {

            return -1;

        } else if (a.precio < b.precio) {

            return 1;
        }

        return 0;
    });

    renderProductos(productosOrdenados);
}

// Ordenar los productos renderizados por nombre, de manera ascendente
function ordenarPorNombreAZ() {

    const productosOrdenados = productos.sort((a, b) => {

        if (a.nombre.toUpperCase() > b.nombre.toUpperCase()) {

            return 1;

        } else if (a.nombre.toUpperCase() < b.nombre.toUpperCase()) {

            return -1;

        }

        return 0;
    });

    renderProductos(productosOrdenados);
}

// Inicializar el select para ordenar los productos
function inicializarSelectOrden() {

    const select = document.getElementById("selectOrden");

    select.addEventListener("click", () => {

        const value = select.value;

        switch (value) {

            case "precioAscendente":

                ordenarPorPrecioAscendente();

                break;

            case "precioDescendente":

                ordenarPorPrecioDescendente();

                break;

            case "nombreAZ":

                ordenarPorNombreAZ();

                break;

        }
    });
}

// 
function inicializarInputNombre() {

    const input = document.getElementById("filter");

    input.addEventListener("keyup", () => {

        const value = input.value;

        const productosFiltrados = productos.filter((producto) => {

            return producto.nombre.toUpperCase().includes(value.toUpperCase());
        });

        renderProductos(productosFiltrados);
    });
}

// FILTROS 

function filtrarPcs() {

    const productosFiltrados = productos.filter((el) => {
        return el.tipo === "pc";
    });

    renderProductos(productosFiltrados);

}

function filtrarTeclados() {

    const productosFiltrados = productos.filter((el) => {
        return el.tipo === "teclados";
    });

    renderProductos(productosFiltrados);

}

function filtrarMouse() {

    const productosFiltrados = productos.filter((el) => {
        return el.tipo === "mouse";
    });

    renderProductos(productosFiltrados);

}

function filtrarAuriculares() {

    const productosFiltrados = productos.filter((el) => {
        return el.tipo === "auriculares";
    });

    renderProductos(productosFiltrados);

}

function inicializarFiltroProductos() {

    const select = document.getElementById("selectFiltro");

    select.addEventListener("click", () => {

        const value = select.value;

        switch (value) {

            case "teclados":

                filtrarTeclados();

                break;

            case "mouse":

                filtrarMouse();

                break;

            case "pc":

                filtrarPcs();

                break;

            case "auriculares":

                filtrarAuriculares();

                break;
        }
    });
}

// Storage

function confirmarRender() {

    if (productosB == null) {

        renderProductos(productos);
        localStorage.setItem("productos", JSON.stringify(productos));
    } else {

        renderProductos(productosB);
        localStorage.setItem("productos", JSON.stringify(productosB));
    }
}

// Variables globales.

const productos = [
    new Producto(0, "PC Ryzen 5 5600x", "pc", 3000, 10),
    new Producto(1, "PC Ryzen 7 5800X3D", "pc", 4000, 5),
    new Producto(2, "PC Ryzen 9 7950X3D", "pc", 5500, 3),
    new Producto(3, "Mouse Logitech G203", "mouse", 100, 50),
    new Producto(4, "Teclado Mecánico HyperX Alloy Origins", "teclados", 250, 25),
    new Producto(6, "Teclado Mecánico Logitech 815", "teclados", 400, 15),
    new Producto(7, "Auriculares Logitech Aurora G735", "auriculares", 400, 10),
    new Producto(8, "Auriculares HyperX Cloud Flight Wireless", "auriculares", 300, 30),
];

let carrito = [];
let cantidad = 0;
let productosB = JSON.parse(localStorage.getItem("productos"));

// Inicio

confirmarRender();
inicializarInputNombre();
inicializarSelectOrden();
inicializarFiltroProductos();
obtenerCarritoDelLS();