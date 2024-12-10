'use strict';
// Registro del componente `productos`, junto con su controlador y plantilla asociada
angular.
  module('myApp.productos', ['core.cart']).
  component('productos', {
    templateUrl: './components/template/productos/productos.html',
    controller: [
      'cssInjector',
      'cart',
      function ProductosController(cssInjector, cart) {
        let self = this;

        // Variables iniciales
        self.currentCategoria = "0";
        self.textParam = "";
        self.productos = [];
        self.categorias = [];

        // Inyectar CSS
        cssInjector.add("./components/template/productos/productos.css");

        // Cargar productos y categorías al inicio
        cart.loadProductos().then(function () {
          self.productos = cart.getProductos(self.currentCategoria, self.textParam);
          self.categorias = cart.getCategorias();
        });

        // Función para actualizar los productos al cambiar la categoría
        self.changeCategoria = function () {
          self.productos = cart.getProductos(self.currentCategoria, self.textParam);
        };

        // Función para actualizar los productos al cambiar el texto de búsqueda
        self.searchProducts = function () {
          self.productos = cart.getProductos(self.currentCategoria, self.textParam);
        };

        // Función para agregar un producto al carrito
        self.add = function (prod_id) {
          cart.add(prod_id);
          Swal.fire('¡Producto agregado!', 'El producto ha sido añadido al carrito', 'success');
        };

        // Función para obtener el nombre de una categoría por su ID
        self.getCategoriaName = function (id) {
          const categoria = cart.getCategorias().find(a => a.cat_id == id);
          return categoria ? categoria.cat_nombre : 'Todos';
        };
      }
    ]
  });
