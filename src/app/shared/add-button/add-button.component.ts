import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports:[    CommonModule ],
  standalone:true,

  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
})
export class AddButtonComponent {

}
