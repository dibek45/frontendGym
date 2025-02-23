import { Component, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/shared/employee.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MemberModel } from 'src/app/core/models/member.interface';
import { Observable, Subject } from 'rxjs';
//import { SocketProviderConnect } from 'src/shared/soket.service';
////import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  
  
})
export class UserComponent {
  private unsubscribe$ = new Subject<void>();

  constructor(private service:EmployeeService,private dialog: MatDialog,private router: Router){

  

  }

  ngOnInit(): void {
    
  }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    mobile: new FormControl('', [Validators.required, Validators.minLength(8)]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl(0),
    hireDate: new FormControl(''),
    isPermanent: new FormControl(false)
  });
  
  displayedColumns: string[] = ['id', 'name', 'created_at', 'actived'];
  searchKey="";


  onSearchClear(){}

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
  }

  
  ngAfterViewInit() {
   
  }
  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      fullName: '',
      email: '',
      mobile: '',
      city: '',
      gender: '1',
      department: 0,
      hireDate: '',
      isPermanent: false
    });
  }

  

  onCreate() {

    this.service.initializeFormGroup();
    this.router.navigate(['home/user/new-user']);
  }
}
