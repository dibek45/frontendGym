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
    { label: 'Roles y Permisos', color: '#EADAFD', icon: 'lock_open' },
    { label: 'Cajeros', color: '#F4F4F4', icon: 'supervisor_account' },
    { label: 'Gráficas', color: '#EAF6FF', icon: 'insert_chart' },
    { label: 'Rutinas', color: '#FFE5D9', icon: 'fitness_center' },
    { label: 'Promociones', color: '#FFF4E5', icon: 'local_offer' },
    { label: 'Maquinas', color: '#EAF6FF', icon: 'fitness_center' },
    { label: 'Agenda', color: '#EAF6FF', icon: 'calendar_today' },
  ];

  btnBack: boolean = false;

  private readonly menuRoutes: { [key: string]: string } = {
    'Caja': 'home/administration/cash-register',
    'Roles y Permisos': 'home/administration/roles',
    'Ventas': 'home/administration/sales',
    'Gastos': 'home/administration/exponses',
    'Pagos membresía': 'home/administration/MembershipPayment',
    'Permisos': 'home/administration/PermissionSection',
    'Reportes': 'home/administration/Reports',
    'Gráficas': 'home/administration/Graphs',
    'Promociones': 'home/administration/Promotions',
    'Cajeros': 'home/administration/Cajeros',
    'Rutinas': 'home/administration/Routines',
    'Agenda': 'home/agenda',
    'Maquinas': 'home/administration/maquinas'
  };

  constructor(private router: Router, public menuService: MenuService) {}

  ngOnInit() {
    this.menuService.menuselected$.subscribe((menu) => {
      this.btnBack = menu === 'Administration';
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('URL actual:', event.url);

        const menuLabel = this.getMenuLabelFromUrl(event.url);
        this.menuService.setMenuselected(menuLabel);

        this.btnBack = (menuLabel === 'Menu' || menuLabel === 'Administration');
        console.log('Menú seleccionado:', menuLabel);
      }
    });
  }

  handleButtonClick(buttonLabel: string) {
    console.log('Botón clicado:', buttonLabel);

    this.menuService.setMenuselected(buttonLabel);
    this.navigateToMenu(buttonLabel);
  }

  goBack() {
    this.router.navigate(['home/administration']);
  }

  private getMenuLabelFromUrl(url: string): string {
    if (url.includes('cash-register')) return 'Caja';
    if (url.includes('sales')) return 'Ventas';
    if (url.includes('roles')) return 'Roles y Permisos';
    if (url.includes('exponses')) return 'Gastos';
    if (url.includes('MembershipPayment')) return 'Pagos membresía';
    if (url.includes('PermissionSection')) return 'Permisos';
    if (url.includes('Reports')) return 'Reportes';
    if (url.includes('Graphs')) return 'Gráficas';
    if (url.includes('Promotions')) return 'Promociones';
    if (url.includes('Cajeros')) return 'Cajeros';
    if (url.includes('Routines')) return 'Rutinas';
    if (url.includes('maquinas')) return 'Maquinas';
    if (url.includes('administration')) return 'Menu';

    return 'Menu';
  }

  private navigateToMenu(label: string): void {
    const route = this.menuRoutes[label];
    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn(`No se encontró ruta para el menú: ${label}`);
    }
  }
}
