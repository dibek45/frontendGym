import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './submenu.service';

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.scss'],
})
export class PointOfSaleComponent implements OnInit {
  menuButtons = [
    { label: 'Caja', color: '#D9EAD3', icon: 'point_of_sale' },
    { label: 'Ventas', color: '#D9EAD3', icon: 'shopping_cart' },
    { label: 'Gastos', color: '#D9EAD3', icon: 'money_off' },
    { label: 'Pagos membresía', color: '#D9EAD3', icon: 'card_membership' },
    //{ label: 'Reservas', color: '#F4F4F4', icon: 'event' },
   // { label: 'Clases', color: '#F4F4F4', icon: 'fitness_center' },
   { label: 'Roles y Permisos', color: '#EADAFD', icon: 'lock_open' },
   { label: 'Planes', color: '#EADAFD', icon: 'card_membership' },

    { label: 'Cajeros', color: '#F4F4F4', icon: 'supervisor_account' },
    { label: 'Reportes', color: '#EAF6FF', icon: 'bar_chart' },
    { label: 'Gráficas', color: '#EAF6FF', icon: 'insert_chart' },
    { label: 'Rutinas', color: '#FFE5D9', icon: 'fitness_center' },
    { label: 'Promociones', color: '#FFF4E5', icon: 'local_offer' },
    { label: 'Maquinas', color: '#EAF6FF', icon: 'fitness_center' },

  ];
  btnBack: boolean=false;

  constructor(private router: Router, public menuService:MenuService) {}
  //roles
  ngOnInit() {
    this.menuService.menuselected$.subscribe((menu) => {
      this.btnBack = menu === 'Administration' ? true : false;
    });
    
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        

        // Cambiar menuselected según la URL
        if (event.url.includes('cash-register')) {
          this.menuService.setMenuselected('Caja');
        } 
        
        else if (event.url.includes('sales')) {
          this.menuService.setMenuselected('Ventas');
        }
        else if (event.url.includes('roles')) {
          
          this.menuService.setMenuselected('Roles y Permisos');
        }
         else if (event.url.includes('exponses')) {
          this.menuService.setMenuselected('Gastos');
        } 
        else if (event.url.includes('MembershipPayment')) {
          this.menuService.setMenuselected('Pagos membresía');
        } 
        else if (event.url.includes('PermissionSection')) {
          this.menuService.setMenuselected('Permisos');
        } 
        else if (event.url.includes('Reports')) {
          this.menuService.setMenuselected('Reportes');
        } 
        else if (event.url.includes('Graphs')) {
          this.menuService.setMenuselected('Gráficas');
        } 
        else if (event.url.includes('Promotions')) {
          this.menuService.setMenuselected('Promociones');
        }
        else if (event.url.includes('Cajeros')) {
          this.menuService.setMenuselected('Cajeros');
        } 
        else if (event.url.includes('Routines')) {
          this.menuService.setMenuselected('Routinas');
        }         
        else if (event.url.includes('administration')) {
          this.menuService.setMenuselected('Menu');

          }  
        else {
          this.menuService.setMenuselected('Menu');
          this.btnBack=true;

        }
        console.log('Menú seleccionado:', this.menuService.getMenuselected());
      }
    });
  }

  handleButtonClick(buttonLabel: string) {
    console.log('Botón clicado:', buttonLabel);

    // Actualizar estado manualmente en el servicio
    this.menuService.setMenuselected(buttonLabel);

    // Navegar basado en el botón
    if (buttonLabel === 'Caja') {
  
      this.router.navigate(['home/administration/cash-register']);
      this.btnBack=true;
    } 
    if (buttonLabel === 'Roles y Permisos') {
      this.router.navigate(['home/administration/roles']);
    } else if (buttonLabel === 'Ventas') {
      this.router.navigate(['home/administration/sales']);
    } else if (buttonLabel === 'Gastos') {
      this.router.navigate(['home/administration/exponses']);
    } else if (buttonLabel === 'Pagos membresía') {
      this.router.navigate(['home/administration/MembershipPayment']);
    } else if (buttonLabel === 'Permisos') {
      this.router.navigate(['home/administration/PermissionSection']);
    } else if (buttonLabel === 'Reportes') {
      this.router.navigate(['home/administration/Reports']);
    } else if (buttonLabel === 'Gráficas') {
      this.router.navigate(['home/administration/Graphs']);
    } else if (buttonLabel === 'Promociones') {
      this.router.navigate(['home/administration/Promotions']);
    }else if (buttonLabel === 'Cajeros') {
      this.router.navigate(['home/administration/Cajeros']);
    }else if (buttonLabel === 'Rutinas') {
      this.router.navigate(['home/administration/Routines']);
    }  else {
      console.log(`Acción no definida para ${buttonLabel}`);
    }
    
  }



  goBack() {
    this.router.navigate(['home/administration']); 
   }
}
