import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subarea-titulo',
  template: `
  <div>
    <p class="titulo_subarea">{{ texto }}</p>
  </div>
`,
  styleUrls: ['./subarea-titulo.component.scss'],
  standalone:true
})
export class SubareaTituloComponent {
  @Input() texto: string = ''; // Aquí se recibe el texto desde el padre

}
