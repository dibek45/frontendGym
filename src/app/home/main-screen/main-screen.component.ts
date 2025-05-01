import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss']
})
export class MainScreenComponent {
  constructor(    private router: Router,
  ){

  }

  route(route:string){
    this.router.navigate([route]);
  }
}
