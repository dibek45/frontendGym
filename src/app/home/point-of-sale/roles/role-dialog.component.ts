import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Import Material and Angular Modules
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

// Import Redux Actions & Selectors
import * as PermissionActions from 'src/app/state/roles/permission/permission.actions';
import { selectAllPermissions } from 'src/app/state/roles/permission/permission.selectors';

// Import Models
import { Role } from 'src/app/state/roles/rol.model';
import { Permission } from 'src/app/state/roles/permission/permission.model';
import { RoleState } from 'src/app/state/roles/rol.state';

@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgFor,
      CommonModule,
  ]
})
export class RoleDialogComponent implements OnInit {
  private store = inject(Store<RoleState>);

  role: Role;
  allPermissions$: Observable<Permission[]> | undefined; // Obtiene los permisos desde Redux
  assignedPermissions: Permission[] = [];
  availablePermissions: Permission[] = [];

  constructor(
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Role, allPermissions: Permission[] }
  ) {
    // ✅ Solución: Evita 'null' en role.id
    this.role = data.role
      ? { ...data.role }
      : { id: -1, name: '', permissions: [] }; // `-1` indica nuevo rol
  }
  ngOnInit(): void {
    console.log('🔍 Datos recibidos en RoleDialogComponent:', this.data);

    if (!this.data.allPermissions || this.data.allPermissions.length === 0) {
      console.warn('⚠️ No se recibieron permisos en el diálogo.');
      return;
    }

    console.log('✅ Permisos recibidos en el diálogo:', this.data.allPermissions);

    // Filtrar permisos asignados y disponibles
    this.assignedPermissions = this.data.allPermissions.filter(perm =>
      this.role.permissions.some(p => Number(p.id) === Number(perm.id))
    );

    this.availablePermissions = this.data.allPermissions.filter(perm =>
      !this.role.permissions.some(p => Number(p.id) === Number(perm.id))
    );

    console.log('✅ Permisos asignados:', this.assignedPermissions);
    console.log('✅ Permisos disponibles:', this.availablePermissions);
  }
  

  /** ✅ Mueve un permiso de disponibles a asignados */
  moveToAssigned(permission: Permission): void {
    this.availablePermissions = this.availablePermissions.filter(p => p.id !== permission.id);
    this.assignedPermissions.push(permission);
  }

  /** ✅ Mueve un permiso de asignados a disponibles */
  moveToAvailable(permission: Permission): void {
    this.assignedPermissions = this.assignedPermissions.filter(p => p.id !== permission.id);
    this.availablePermissions.push(permission);
  }

  /** ✅ Mueve TODOS los permisos disponibles a asignados */
  moveAllToAssigned(): void {
    this.assignedPermissions = [...this.assignedPermissions, ...this.availablePermissions];
    this.availablePermissions = [];
  }

  /** ✅ Mueve TODOS los permisos asignados a disponibles */
  moveAllToAvailable(): void {
    this.availablePermissions = [...this.availablePermissions, ...this.assignedPermissions];
    this.assignedPermissions = [];
  }

  /** ✅ Guarda los cambios en Redux */
  save(): void {
    const updatedRole: Role = {
      ...this.role,
      permissions: this.assignedPermissions
    };

 //   this.store.dispatch(PermissionActions.updateRole({ role: updatedRole }));
    this.dialogRef.close();
  }
}
