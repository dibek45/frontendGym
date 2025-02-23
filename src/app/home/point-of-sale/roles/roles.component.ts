import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { RoleDialogComponent } from './role-dialog.component';
import * as RoleActions from '../../../../app/state/roles/rol.actions';
import { selectAllPermisos, selectAllRoles } from 'src/app/state/roles/rol.selectors';
import { Role } from 'src/app/state/roles/rol.model';
import { selectAllPermissions } from 'src/app/state/roles/permission/permission.selectors';
import { Permission } from 'src/app/state/roles/permission/permission.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles$ = this.store.select(selectAllRoles);
  selectedRoleId: number | null = null;
  editedRoleName: string = '';
  allPermissions$ = this.store.select(selectAllPermisos); // ✅ Obtiene todos los permisos

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('🔄 Componente RolesComponent iniciado.');
    this.loadRoles();

    // ✅ Verificar si los roles llegan desde Redux
    this.roles$.subscribe(roles => {
      console.log('✅ Roles desde Redux (roles$):', roles);
    });

    // ✅ Verificar si los permisos llegan desde Redux
    this.allPermissions$.subscribe(permissions => {
      console.log('*-*********************************✅ Permisos desde Redux (allPermissions$):', permissions);
    });
  }

  loadRoles(): void {
    console.log('🚀 Despachando loadRoles()...');
    this.store.dispatch(RoleActions.loadRoles());
  }

  saveRole(): void {
    if (this.selectedRoleId && this.editedRoleName) {
      this.store.dispatch(
        RoleActions.updateRole({
          role: { id: this.selectedRoleId, name: this.editedRoleName, permissions: [] }
        })
      );
      this.selectedRoleId = null;
    }
  }

  deleteRole(roleId: number): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.store.dispatch(RoleActions.deleteRole({ roleId }));
    }
  }
  openRoleDialog(role?: Role): void {
    this.allPermissions$.subscribe(allPermissions => {
      console.log('🔄 Passing permissions to modal:', allPermissions);
  
      // ✅ Group permissions by category before passing to the modal
      const groupedPermissions = allPermissions.reduce((acc, permission) => {
        const category = permission.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {} as { [category: string]: Permission[] });
  
      console.log('📌 Grouped permissions:', groupedPermissions);
  
      const dialogRef = this.dialog.open(RoleDialogComponent, {
        width: '800px',
        data: {
          role: role ? { ...role } : { id: 0, name: '', permissions: [] }, // Default role if none exists
          groupedPermissions: groupedPermissions // ✅ Pass grouped permissions
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(
            RoleActions.updateRole({ role: { id: result.id, name: result.name, permissions: result.permissions } })
          );
        }
      });
    });
  }
  
  
}
