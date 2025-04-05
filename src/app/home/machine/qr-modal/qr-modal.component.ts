import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss']
})
export class QrModalComponent {
  constructor(
    public dialogRef: MatDialogRef<QrModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { qrCode: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  printQr(): void {
    const qrValue = this.data.qrCode;
    const sizeOption = prompt(
      '¿Cómo deseas imprimir el QR?\n1: Hoja completa\n2: Mitad de hoja (centrado)\n3: Tamaño pequeño (tipo etiqueta)',
      '2'
    );
  
    let qrSize = '5cm';
    let padding = '1cm';
  
    switch (sizeOption) {
      case '1': // Hoja completa
        qrSize = '18cm';
        padding = '0';
        break;
      case '2': // Mitad de hoja centrado
        qrSize = '9cm';
        padding = '5cm 0';
        break;
      case '3': // Tamaño etiqueta
        qrSize = '4cm';
        padding = '1cm';
        break;
      default:
        alert('Opción no válida, se usará tamaño estándar.');
        break;
    }
  
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrValue)}&size=300x300`;
    const printWindow = window.open('', '_blank', 'width=400,height=400');
  
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir Código QR</title>
            <style>
              body {
                text-align: center;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: ${padding};
              }
              img#qrImg {
                width: ${qrSize};
                height: ${qrSize};
              }
              p {
                font-size: 12pt;
                margin-top: 1cm;
                word-break: break-word;
              }
              @media print {
                body {
                  margin: 0;
                }
                img#qrImg {
                  width: ${qrSize};
                  height: ${qrSize};
                }
              }
            </style>
          </head>
          <body>
            <h3>Código QR</h3>
            <img id="qrImg" src="${qrImgUrl}" />
            <p>${qrValue}</p>
            <script>
              const img = document.getElementById('qrImg');
              img.onload = function () {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 200);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
  
  
  editQr(): void {
    // Por ahora solo hacemos un log, puedes abrir un formulario o emitir un evento
    console.log('Editar QR:', this.data.qrCode);
    alert('Aquí se abriría el formulario de edición del QR');
  }
}
