import { Component, HostListener } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { EmployeeService } from 'src/app/shared/employee.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  isSingleColumnLayout = false; // Variable para controlar el diseño de las columnas

  webcamImage: WebcamImage | undefined;
  takePhoto:boolean=true;
  
  handleImage($event: WebcamImage) {
    this.webcamImage = $event;
  }

  constructor(
    public notificationService: NotificationService,
    private router: Router,
    public service:EmployeeService,
    ){

  }

  birthDate:string="";
  
  ngOnInit() {
    this.checkWindowWidth(); 
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth(); // Verificar el ancho de la ventana al cambiar su tamaño
  }

  checkWindowWidth() {
    this.isSingleColumnLayout = window.innerWidth < 768; // Modificar el valor de acuerdo al ancho de la ventana
  }

  onClear() {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.notificationService.mostrarSnackbar(':: Submitted successfully','success');
  }

  onSubmit() {
    if (this.service.form.valid) {
      this.service.insertEmployee(this.service.form.value);
      this.service.form.reset();
      this.service.initializeFormGroup();
      this.notificationService.mostrarSnackbar(':: Submitted successfully','success');
    }
  }


  onClose() {
    this.router.navigate(['home/user/table']);
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.notificationService.mostrarSnackbar(':: Cerrado','success');
  }

  addItem(value: boolean) {
    this.takePhoto=value;
  }


 

  }

 

