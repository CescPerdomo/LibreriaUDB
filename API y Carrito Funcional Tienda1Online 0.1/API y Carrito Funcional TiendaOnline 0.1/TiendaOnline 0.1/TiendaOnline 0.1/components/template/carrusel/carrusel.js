'use strict';
// Declaración estricta de JavaScript para garantizar una mejor calidad de código

// Registro del componente `carrusel`, junto con su controlador y plantilla asociados
angular.
  module('myApp.carrusel',[]).  // Creación de un módulo llamado 'myApp.carrusel' con dependencia vacía []
  component('carrusel', {  // Definición del componente 'carrusel' para que coincida con el elemento `<carrusel>`
    templateUrl:'./components/template/carrusel/carrusel.html',  // Ruta de la plantilla HTML asociada al componente
    controller: ['cart', function CarruselController(cart) {  // Definición del controlador del componente con dependencia 'cart'
        var  self = this;  // Variable local para hacer referencia al contexto del controlador
    }]
  });
