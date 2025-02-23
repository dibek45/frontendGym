import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private datePipe: DatePipe) { }

  employeeList: any;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl('John Doe', Validators.required),
    email: new FormControl('johndoe@example.com', Validators.email),
    mobile: new FormControl('12345678', [Validators.required, Validators.minLength(8)]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl('basic'),
    birthDate: new FormControl('2000-01-01'),
    isPermanent: new FormControl(false)
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      mobile: '12345678',
      city: '',
      gender: '1',
      department: 'basic',
      birthDate: '2000-01-01',
      isPermanent: false
    });
  }

  getEmployees() {
    // Método para obtener empleados (aquí podrías implementar la lógica necesaria)
  }

  insertEmployee(employee: any) {
    // Método para insertar empleado (aquí podrías implementar la lógica necesaria)
  }

  updateEmployee(employee: any) {
    // Método para actualizar empleado (aquí podrías implementar la lógica necesaria)
  }

  deleteEmployee($key: string) {
    // Método para eliminar empleado (aquí podrías implementar la lógica necesaria)
  }
}
