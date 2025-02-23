import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { MaterialModuleModule } from 'src/shared/material-module/material-module.module';
import { WebcamModule } from 'ngx-webcam';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  standalone:true, 
  imports:[CommonModule,MaterialModuleModule,WebcamModule]
  
})
export class PhotoComponent {
  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  @Input() preloadedImage: string = ''; // ✅ Recibe una imagen de entrada opcional
  @Input() imageUrl: string = ''; 
  defaultImage: string = "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"; 

  @Output() newItemEvent = new EventEmitter<boolean>();


  @Output() imgEmmit = new EventEmitter<string>();

  img:string="";
  fly:string="icon";
  done:boolean=false;
  screen=window.innerWidth;
  sysImage = '';
  fly2: boolean=false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrl'] && changes['imageUrl'].currentValue) {
      this.img = changes['imageUrl'].currentValue;
      console.log("🚀 ~ Se detectó un cambio en imageUrl:", this.img);
    } else {
      console.log("❌ No llegó imageUrl, se usará la imagen predeterminada");
    }
  }
  ngOnInit() {


  }
  public getSnapshot(): void {
    this.fly="isTaken";
    this.trigger.next(void 0);
    this.newItemEvent.emit(false);
   
  }
  openCamera(){
    this.fly="open";
    this.clickOutput(false,"open");
  }
  public captureImg(webcamImage: WebcamImage): void {
    
    
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    console.info('got webcam image', this.sysImage);
    this.img=webcamImage?.imageAsDataUrl;
    this.imgEmmit.emit(this.img);

  }
  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  clickOutput(value: boolean,fly:string) {
    this.fly=fly;
    fly=="isTaken"?this.done=true:false;
    fly=='icon'?this.fly2=true:null;
   this.newItemEvent.emit(value);
  }
}







