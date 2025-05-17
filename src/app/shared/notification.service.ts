import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(    private router: Router,
  ) { }
 
  mostrarSnackbar(mensaje: string,
     tipo: 'success' | 'warning' | 'error' | 'info',
      imagenUrl?: string) {
    const snackbar = document.getElementById('notification');


    if (imagenUrl==null) {
      imagenUrl='./'
    }
    if (snackbar) {
      // Limpiar el contenido anterior
      snackbar.innerHTML = '';

      // Fila para la imagen y el mensaje
      const content = `

  <div style="display: flex; align-items: center;  z-index: 9999; /* 🔥 Prioridad máxima para estar encima de todo */
">
    <div class="circle" style="width: 40px; height: 40px; border-radius: 50%; z-index: 9999; overflow: hidden; margin-right: 10px;">
      <img style="width: 100%; height: 100%; object-fit: cover;" src="${imagenUrl}" alt="Avatar" />
    </div>
    <div class="notification-text">${mensaje}</div>
  </div>
`;

      
      snackbar.innerHTML = content;

      // Condicional para cambiar el color de fondo según el tipo
      if (tipo === 'success') {
        snackbar.style.backgroundColor = '#4caf50'; // Verde para éxito
      } else if (tipo === 'warning') {
        snackbar.style.backgroundColor = '#ff9800'; // Naranja para advertencia
      } else if (tipo === 'error') {
        snackbar.style.backgroundColor = '#f44336'; // Rojo para error
      } else if (tipo === 'info') {
        snackbar.style.backgroundColor = '#2196f3'; // Azul para información
      }

      // Mostrar el snackbar
      snackbar.classList.add('show');

      // Después de 3 segundos, ocultarlo
      setTimeout(() => {
        snackbar.classList.remove('show');
      }, 3000); // 3 segundos
    }
  }



  showProductAddToCart(productName:string,
                       msg:string, 
                       productImageUrl:string, 
                       tipo = 'success') {

    const snackbar = document.getElementById('notification');

  
    if (snackbar) {
      // Limpiar el contenido anterior
      snackbar.innerHTML = '';
  
      // Estructura de la notificación con imagen y texto
      const content = `
        <div  style="display: flex; align-items: center;width:70px">
            <img object-fit: cover;" src="${productImageUrl}" alt="Product Image"  class="imgModalAddCart">
          
          <div class="texto">
            <strong 
                            }">${productName}</strong>
                     <p>  Agregado </p>
          <button id="goToCartButton" style="margin-left:23px;margin-top:-10px">Ir a carrito</button>
          </div>
        </div>
      `;
  
      snackbar.innerHTML = content;
  
      // Cambiar el color de fondo de la notificación según el tipo
      if (tipo === 'success') {
        snackbar.style.backgroundColor = '#8bb69e'; // Verde para éxito
      } else if (tipo === 'warning') {
        snackbar.style.backgroundColor = '#ff9800'; // Naranja para advertencia
      } else if (tipo === 'error') {
        snackbar.style.backgroundColor = '#f44336'; // Rojo para error
      } else if (tipo === 'info') {
        snackbar.style.backgroundColor = '#2196f3'; // Azul para información
      }
  
      // Mostrar la notificación
      snackbar.classList.add('show');
  
       // ** Agregar evento click al botón **
    const goToCartButton = document.getElementById('goToCartButton');
    if (goToCartButton) {
      goToCartButton.addEventListener('click', () => {
       this.cart();
       snackbar.classList.remove('show');

      });
    }

    // Ocultar después de 3 segundos
    setTimeout(() => {
      snackbar.classList.remove('show');
    }, 3000);
  
    
    }
  }
  cart(){
    this.router.navigate(['home/product/cart']);
  }




  mostrarErrorCreacionCaja(error: string) {
  let mensaje = '❌ Error al crear la caja registradora.';

  if (error.includes('ya tiene una caja abierta')) {
    mensaje = '❌ Este cajero ya tiene una caja abierta.';
  } else if (error.includes('ya tiene 4')) {
    mensaje = '❌ Este gimnasio ya tiene 4 cajas abiertas.';
  } else if (error.includes('balance')) {
    mensaje = '❌ El balance inicial no puede ser negativo.';
  }

  this.mostrarSnackbar(
    mensaje,
    'error',
    'assets/img/icons/error.png'
  );
}



async mostrarConfirmacionCaja(pregunta = '¿Deseas crear una caja?'): Promise<boolean> {
  return new Promise(resolve => {
    const div = document.createElement('div');
    div.className = 'modal-confirm';
    div.innerHTML = `
      <div class="modal-content">
        <p>${pregunta}</p>
        <button id="btn-si">Sí</button>
        <button id="btn-no">No</button>
      </div>
    `;
    document.body.appendChild(div);
    document.getElementById('btn-si')!.onclick = () => {
      div.remove();
      resolve(true);
    };
    document.getElementById('btn-no')!.onclick = () => {
      div.remove();
      resolve(false);
    };
  });
}



}