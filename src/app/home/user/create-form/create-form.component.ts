import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // Importar FormControl y Validators
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { NotificationService } from 'src/app/shared/notification.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { addMember } from 'src/app/state/member/member.actions';
import { Observable } from 'rxjs';
import { selectItemsList } from 'src/app/state/selectors/huella.selectors';
import { loadedHuella } from 'src/app/state/actions/huella.actions';
import { selectUser } from 'src/app/state/selectors/user.selectors';
import { loadedUser } from 'src/app/state/actions/user.actions';
import { DialogModalService } from 'src/app/shared/dialog-modal.service';
import { FingerprintPersonaService } from 'src/app/shared/fingerprint.service';
import { SpeechService } from 'src/app/shared/speech.service';
import { userModel } from 'src/app/core/models/user.interface';


@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
})
export class CreateFormComponent {
  members$:Observable<any>=new Observable();

  isSingleColumnLayout = false;
  webcamImage: WebcamImage | undefined;
  takePhoto: boolean = true;
  image: string = '';
  llenarDatos:boolean=true;
  form: FormGroup; // Definición del formulario
  counter: number=0;

  constructor(
    private _finger:FingerprintPersonaService,
    private store: Store<AppState>,
    private http: HttpClient,
    private router: Router,
    public notificationService: NotificationService,
    public _dialog:DialogModalService,
    public _speech:SpeechService
  ) {
    this.form = new FormGroup({
      $key: new FormControl(null), // Asegúrate de que $key esté definido
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', Validators.required),
      gender: new FormControl('1'),
      department: new FormControl('basic'),
      birthDate: new FormControl(''),
      isPermanent: new FormControl(false)
    });
  }

  birthDate: string = "";
  estado = 0;
  currentStep: number = 0; 
  huellaId$: Observable<Number> = new Observable(); // Cambia el tipo a string o null
  gymIdFromStore: number = 0; // Variable para almacenar el gymId del usuario actual

  
  ngOnInit() {

    


    this.checkWindowWidth(); 
    this.huellaId$ = this.store.select(selectItemsList);

    this.huellaId$.subscribe(id => {
      if (id) {
        switch (Number(id)) {
          case 4:
              break;
          case 3:
              this.counter++; // Si id es 3, setea this.counter a 1
              break;
          case 2:
              this.counter++; 
              break;
          case 1:
              this.counter++; 
              break;
          case 0:
              this.counter ++; 
              
              this._speech.speak
this._dialog.openDialog('1500ms', '100ms', 'REGISTRO CON EXITO',"Dar de alta usuario");
 setTimeout(() => {
  this._finger.verifyFingerprint(this.gymIdFromStore);
  this.router.navigate(['home/user/table']);
}, 2000); // 2000 milisegundos = 2 segundos
  

              break;
          default:
              this.counter++; 
      }
      }
    });

    this.store.select(selectUser).subscribe((users:any) => {

      this.gymIdFromStore=users.user.gymId;

    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    this.isSingleColumnLayout = window.innerWidth < 768;
  }

  onClear() {
    this.form.reset();
    this.notificationService.mostrarSnackbar(':: Formulario reiniciado correctamente','success');
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        name: this.form.value.fullName, // Asegúrate de capturar el nombre
        huella: 'this.form.value.huella',
        img: this.image,
        actived: this.form.value.isPermanent,
        gym_id:this.gymIdFromStore,
        available_days:10
      };
  
      const graphqlQuery = `
        mutation CreateUser($createUser: CreateUser!) {
          createUser(createUser: $createUser) {
            id
            name
            actived
            huella
            img,
            gym_id,
            available_days
          }
        }
      `;
  
      this.http.post<{ data: { createUser: { id:  string } } }>('http://localhost:3000/graphql', {
        query: graphqlQuery,
        variables: {
          createUser: formData
        }
      }).subscribe({
        next: (response) => {
          console.log(response)
          const { id } = response.data.createUser;
          alert("Ingresa el ID al programa de Windows: " + id);
          this._finger.registerFingerprint(this.gymIdFromStore,Number(id)).subscribe({
            next: () => {
              console.log('Verificación de huellas en progreso...');
              this.llenarDatos=false;

            },
            error: (error) => {
              console.error('Error en WebSocket:', error);
            }
          });

          this.store.dispatch(loadedUser({id:Number(id)}));

          // Enviar imagen, ID y nombre al endpoint de Flask
          this.http.post('http://127.0.0.1:5000/imageangular', {
            id: id,
            name: this.form.value.fullName, // Incluye el nombre en el cuerpo de la solicitud
            image: this.image // Enviar la imagen en base64
          }).subscribe({
            next: (response) => {
              this.store.dispatch(addMember({ member: { ...formData, id,createdAt:'null' } }));

              console.log('Response from Flask:', response);
              this.notificationService.mostrarSnackbar(':: ID, nombre e imagen procesados correctamente','success');
       //       this.router.navigate(['home/user/table']);
            },
            error: error => {
              console.error('Error:', error);
            }
          });
          setTimeout(() => {
          }, 2000); // 2000 milisegundos = 2 segundos
      
          
          this.notificationService.mostrarSnackbar(':: Enviado correctamente','success');
        },
        error: error => {
          console.error('GraphQL Error:', error);
        }
      });
    }
  }
  
  
//    this.router.navigate(['home/user/table']);

  onClose() {
    this.llenarDatos=false;
    this.form.reset();
    this.notificationService.mostrarSnackbar(':: Cerrado','success');
  }

  addItem(value: boolean) {
    this.takePhoto = value;
  }

  getImg(img: string) {
    this.image = img;
  }

mas() {
  this.counter++;

  }
}
