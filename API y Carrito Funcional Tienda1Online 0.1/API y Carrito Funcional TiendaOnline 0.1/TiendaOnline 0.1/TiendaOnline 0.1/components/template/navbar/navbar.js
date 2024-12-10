'use strict';

// Definición del módulo 'myApp.navbar' que contiene el componente 'navbar'
angular.module('myApp.navbar', [])
  .component('navbar', {
    templateUrl: './components/template/navbar/navbar.html',
    controller: ['cart', '$window', '$http', function ProductosController(cart, $window, $http) {
      let self = this;

      // Función para obtener el total del carrito
      self.getTotal = function () {
        return cart.getTotal() || 0;
      };

      // Función para obtener el contenido del carrito
      self.getCart = function () {
        return cart.getCart();
      };

      // Función para agregar productos al carrito
      self.addProductToCart = function (productId, quantity) {
        for (let i = 0; i < quantity; i++) {
          cart.add(productId);
        }
        Swal.fire('Producto agregado', 'El producto ha sido agregado al carrito.', 'success');
      };

      // Configurar el botón de PayPal
      self.renderPaypalButton = function () {
        paypal.Buttons({
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: self.getTotal().toFixed(2) // Monto total del carrito
                }
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              Swal.fire('¡Gracias por tu compra, ' + details.payer.name.given_name + '!', '', 'success');
              cart.clearCart();
              $window.location.reload(); // Recargar la página o redirigir
            });
          }
        }).render('#paypal-button-container'); // Renderizar el botón en el contenedor
      };

      // Llamar la función para renderizar el botón cuando el modal se abre
      self.$onInit = function() {
        self.renderPaypalButton();
      };

      // Función para eliminar un producto y generar el PDF
      self.removeItem = function (prodId) {
        cart.remove(prodId);
        self.generatePDF(); // Llamada para generar el PDF
      };

      // Función para generar el archivo PDF
      self.generatePDF = function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Agregar título
        doc.setFontSize(16);
        doc.text('Resumen de Compra', 20, 20);

        // Agregar tabla con los productos
        let y = 40;
        doc.setFontSize(12);
        doc.text('Producto', 20, y);
        doc.text('Precio', 70, y);
        doc.text('Cantidad', 120, y);
        doc.text('Subtotal', 160, y);
        y += 10;

        self.getCart().forEach(item => {
          doc.text(item.nombre, 20, y);
          doc.text(`$${item.precio.toFixed(2)}`, 70, y);
          doc.text(`${item.cantidad}`, 120, y);
          doc.text(`$${item.subtotal.toFixed(2)}`, 160, y);
          y += 10;
        });

        // Agregar total
        doc.setFontSize(14);
        doc.text(`Total: $${self.getTotal().toFixed(2)}`, 20, y + 10);

        // Guardar el PDF
        doc.save('resumen_de_compra.pdf');
        Swal.fire('Resumen Generado', 'Se ha generado un archivo PDF con los productos restantes.', 'info');
      };

      // Función para procesar el pago
      self.pagar = function () {
        let valido = true;
        if (cart.getTotal() === 0) {
          Swal.fire('¡Alerta!', 'No ha agregado ningún producto al carrito', 'warning');
          valido = false;
        }
        if (valido) {
          Swal.fire('¡Transacción exitosa!', '', 'success')
            .then(function () {
              cart.clearCart();
              $window.location.reload(); // Recargar la página
            });
        }
      };
    }]
  });

// Definición del módulo principal
angular.module('myApp', ['myApp.navbar']);
