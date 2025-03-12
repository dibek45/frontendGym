import { Component, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // Importar FormControl y Validators
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { NotificationService } from 'src/app/shared/notification.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { addMember, updateMember } from 'src/app/state/member/member.actions';
import { Observable } from 'rxjs';
import { selectItemsList } from 'src/app/state/selectors/huella.selectors';
import { loadedHuella } from 'src/app/state/actions/huella.actions';
import { selectUser } from 'src/app/state/user/user.selectors';
import { loadedUser } from 'src/app/state/user/user.actions';
import { DialogModalService } from 'src/app/shared/dialog-modal.service';
import { FingerprintPersonaService } from 'src/app/shared/fingerprint.service';
import { SpeechService } from 'src/app/shared/speech.service';
import { userModel } from 'src/app/core/models/user.interface';
import { DialogRegistroCompletadoComponent } from '../dialog-registro-completado/dialog-registro-completado.component';
import { MatDialog } from '@angular/material/dialog';
import { OfflineDbService } from 'src/app/db-local/offline-db.service';
import { MemberModel } from 'src/app/core/models/member.interface';


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
    private dialog: MatDialog, // 👈 Asegúrate que se llama "dialog"
    private offlineDb: OfflineDbService,
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
  gymIdFromStore: number = 1; // Variable para almacenar el gymId del usuario actual

  huellaRegistrada() {
    console.log(`✅ Huella ${this.counter + 1} registrada`);
    this.counter++;
  
    if (this.counter === 4) {
      console.log('🎉 Registro de huellas completado.');
      // Aquí activar lo que sigue
    }
  }
  ngOnInit() {

    
   // 🔔 Escuchar el progreso de huellas
   this._finger.contadorHuella$.subscribe((progreso) => {
    this.counter = progreso;
    console.log(`🟢 Progreso de huellas: ${this.counter} / 4`);

    if (this.counter === 4) {
      this.abrirModalRegistroCompletado();
    }
  });

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
    if (!this.form.valid) return;
  
    const tempId = Date.now().toString();
  
    const nuevoMiembro: MemberModel = {
      id: tempId,
      name: this.form.value.fullName,
      createdAt: new Date().toISOString(),
      actived: this.form.value.isPermanent,
      available_days: 10,
      img: this.image,
      gymId: this.gymIdFromStore,  // ✅ gymId siempre
      isSynced: false,
      syncError: false,
      username:this.form.value.username,
      tempId
    };
  
    // 1️⃣ Guardar en Redux
    this.store.dispatch(addMember({ member: nuevoMiembro }));
  
    // 2️⃣ Guardar en IndexedDB
    this.offlineDb.saveMember(nuevoMiembro).then(() => {
      console.log('✅ Guardado en IndexedDB con gymId:', nuevoMiembro.gymId);
    });
  
    // 3️⃣ Intentar sincronizar
    this.syncMemberWithBackend(nuevoMiembro);
  }
  
  syncMemberWithBackend(member: MemberModel) {
    const graphqlQuery = `
      mutation CreateUser($createUser: CreateUser!) {
        createUser(createUser: $createUser) {
          id
          name
          actived
          huella
          img
          gymId
          available_days
        }
      }
    `;
  
    // 🔧 Creamos el payload que el backend GraphQL espera (basado en el input CreateUser)
    const userPayload = {
      name: member.name,
      actived: member.actived,
      available_days: member.available_days,
      img: member.img,
      gymId: member.gymId,
      huella: member.huella ?? '' // 👈 Asegúrate que no sea null ni undefined
    };
    
  
    console.log('📤 Enviando payload limpio al backend:', userPayload);
  
    // 🔨 Enviamos la mutación POST al endpoint GraphQL
    this.http.post<any>('http://localhost:3000/graphql', {
      query: graphqlQuery,
      variables: { createUser: userPayload } // ✅ Solo los datos permitidos por el backend
    }).subscribe({
      next: (response) => {
        console.log('📦 RESPUESTA COMPLETA DEL BACKEND:', response);
  
        // 1️⃣ Revisamos si GraphQL regresó errores
        if (response.errors && response.errors.length > 0) {
          console.error('❌ Errores de GraphQL:', response.errors);
  
          // Marcamos como fallido en Redux
          this.store.dispatch(updateMember({
            tempId: member.tempId!,
            updatedMember: {
              ...member,
              syncError: true
            }
          }));
  
          // Guardamos el estado de error en IndexedDB
          this.offlineDb.updateMember(member.id, {
            syncError: true
          });
  
          return; // Terminamos aquí
        }
  
        // 2️⃣ Validación básica de datos
        if (!response.data || !response.data.createUser) {
          console.error('❌ La respuesta no contiene createUser:', response);
          return; // Evitamos que siga si no hay respuesta válida
        }
  
        // 3️⃣ Si todo está bien, extraemos el miembro creado en el backend
        const miembroBackend = response.data.createUser;
  
        console.log('✅ Miembro sincronizado correctamente:', miembroBackend);
  
        // 4️⃣ Actualizamos Redux para reflejar que el miembro se sincronizó
        this.store.dispatch(updateMember({
          tempId: member.tempId!, // buscamos el miembro local usando el tempId
          updatedMember: {
            ...miembroBackend, // los datos oficiales del backend
            isSynced: true,    // marcamos como sincronizado
            tempId: member.tempId
          }
        }));
  
        // 5️⃣ Actualizamos también en IndexedDB
        this.offlineDb.updateMember(member.id, {
          ...miembroBackend,
          isSynced: true
        });
      },
  
      error: (error) => {
        console.error('❌ Error HTTP o de red al enviar la mutación GraphQL:', error);
  
        // 1️⃣ Marcamos como fallo en Redux
        this.store.dispatch(updateMember({
          tempId: member.tempId!,
          updatedMember: {
            ...member,
            syncError: true
          }
        }));
  
        // 2️⃣ Guardamos el error en IndexedDB
        this.offlineDb.updateMember(member.id, {
          syncError: true
        });
      }
    });
  }
  
  
  retrySyncUnsyncedMembers() {
    this.offlineDb.getUnsyncedMembersByGym(this.gymIdFromStore).then(members => {
      console.log(`🔄 Reintentando sincronización para ${members.length} miembros del gym ${this.gymIdFromStore}`);
      members.forEach(member => {
        this.syncMemberWithBackend(member);
      });
    });
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

  abrirModalRegistroCompletado() {
    const dialogRef = this.dialog.open(DialogRegistroCompletadoComponent, {
      width: '350px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('❗ Modal cerrado');
      if (result === 'ok') {
        // Aquí puedes hacer la lógica después de aceptar el modal.
        this.llenarDatos = true;
        console.log('✅ Registro finalizado. Listo para siguiente paso.');
      }
    });
  }
}
