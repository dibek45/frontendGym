import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Asegúrate de importar MatInputModule
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FingerprintPersonaService } from 'src/app/shared/fingerprint.service';

export interface AuthMethod {
  name: string;
  icon?: string;
}

@Component({
  selector: 'app-type-authentication',
  templateUrl: './type-authentication.component.html',
  styleUrls: ['./type-authentication.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule,MatSelectModule,MatChipsModule], // Asegúrate de incluir MatInputModule
})
export class TypeAuthenticationComponent {

constructor(){

  }
  selectedAuthMethods: AuthMethod[] = [];
  allAuthMethods: AuthMethod[] = [
    { name: 'Fingerprint', icon: 'fingerprint' },
    { name: 'Face ID', icon: 'face' },
    { name: 'QR code', icon: 'qr_code' },
    { name: 'Bar code', icon: 'barcode' },
  ];

  get availableAuthMethods(): AuthMethod[] {
    return this.allAuthMethods.filter(method => !this.selectedAuthMethods.some(selected => selected.name === method.name));
  }

  add(method: AuthMethod): void {
    if (!this.selectedAuthMethods.some(m => m.name === method.name)) {
      this.selectedAuthMethods.push(method);
    }
  }

  remove(method: AuthMethod): void {
    this.selectedAuthMethods = this.selectedAuthMethods.filter(m => m !== method);
  }




}