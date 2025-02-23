import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissionsService } from './permissions.service';

@Component({
  selector: 'app-permission-dialog',
  templateUrl: './permission-dialog.component.html',
  styleUrls: ['./permission-dialog.component.scss']
})
export class PermissionDialogComponent {
  permissionName: string = '';

  constructor(
    public dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionsService: PermissionsService
  ) {
    if (data?.permission) {
      this.permissionName = data.permission.name;
    }
  }

  savePermission(): void {
    if (this.permissionName.trim()) {
      if (this.data.permission) {
        this.permissionsService.updatePermission(this.data.permission.id, this.permissionName).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.permissionsService.createPermission(this.permissionName).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }
}
