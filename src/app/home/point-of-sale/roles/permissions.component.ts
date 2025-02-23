import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PermissionDialogComponent } from './permission-dialog.component';
import { PermissionsService } from './permissions.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  permissions: any[] = [];

  constructor(
    private permissionsService: PermissionsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  // 📌 Cargar permisos desde el backend o datos de prueba
  loadPermissions(): void {
    this.permissionsService.getPermissions().subscribe((response: any) => {
      this.permissions = response.data.permissions;
    }, error => {
      console.error('Error loading permissions:', error);
      // 📌 Si hay un error con el backend, usar datos de prueba
      this.permissions = [
        { id: 1, name: 'Manage Users' },
        { id: 2, name: 'View Reports' },
        { id: 3, name: 'Edit Products' },
        { id: 4, name: 'Delete Orders' }
      ];
    });
  }

  // 📌 Abrir modal para crear o editar permisos
  openPermissionDialog(permission?: any): void {
    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      width: '400px',
      data: { permission }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPermissions(); // 📌 Recargar la lista después de cerrar el modal
      }
    });
  }

  // 📌 Eliminar un permiso
  deletePermission(permissionId: number): void {
    if (confirm('Are you sure you want to delete this permission?')) {
      this.permissionsService.deletePermission(permissionId).subscribe(() => {
        this.loadPermissions(); // 📌 Refrescar la lista
      });
    }
  }
}
