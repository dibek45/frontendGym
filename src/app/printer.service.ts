import { Injectable } from '@angular/core';
import { CartItemModel } from './home/product/cart/cart-item.model';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class PrinterService {
  server: BluetoothRemoteGATTServer | undefined;
  characteristic!: globalThis.BluetoothRemoteGATTCharacteristic;
  totalAmount: number = 0;          // Almacena el total del carrito
  
  constructor() {}
// 49535343-fe7d-4ae5-8fa9-9fafd205e455 (Unknown Service)
// e7810a71-73ae-499d-8c15-faa9aef0c3f2 (Unknown Service)
imgQr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAFAZJREFUeF7tnNFyXMkNQ6P//2in5Eq869qVcTTEUD3qk9fLBkEQDbW0rrz9+PHjx3/8nwqowJUKvBkAV+7doVXgpwIGgEZQgYsVMAAuXr6jq4ABoAdU4GIFDICLl+/oKmAA6AEVuFgBA+Di5Tu6ChgAekAFLlbAALh4+Y6uAgaAHlCBixUwAC5evqOrgAGgB1TgYgUMgIuX7+gqYADoARW4WAED4OLlO7oKGAB6QAUuVsAAuHj5jq4CBoAeUIGLFTAALl6+o6uAAaAHVOBiBQyAi5fv6CpgAOgBFbhYAQPg4uU7ugoYAHpABS5WwAC4ePmOrgIGgB5QgYsVMAAuXr6jq4ABoAdU4GIFDICLl+/oKmAA6AEVuFgBA+Di5Tu6ChgAekAFLlbAALh4+Y6uAgaAHlCBixUwAC5evqOrwHEB8Pb2duVWfvz4cd3c7vrrV24AfP0OfjIwAA5ZxAKNk3ZtACwsnLQ4yRSEb6PGF0BDxRmGATDTr3baAKhJeTzQSbs2AA6xy0mm2JLEF8CW0h/3MQC+fgf+DeCQHWzROCnsDYCtrYc+J5liSxJfAFtK+wL4eqUNgH8oYAB8vS19AXz9DvwV4JAdbNE46bX3kgFwkoDENOQnXWMm0ofwbXAhfQjfLS6EL6l5tZkMALLVYc2WKUgfMsrWpSN8t7gQXUjNq81kAJCtDmu2TEH6kFG2Lh3hu8WF6EJqXm0mA4BsdVizZQrSh4yydekI3y0uRBdS82ozGQBkq8OaLVOQPmSUrUtH+G5xIbqQmlebyQAgWx3WbJmC9CGjbF06wneLC9GF1LzaTAYA2eqwZssUpA8ZZevSEb5bXIgupObVZjIAyFaHNVumIH3IKFuXjvDd4kJ0ITWvNtO3DACyBLJMUkMMSvgkHIJB+JKaxIVgkBoyE+FCcAgfUpP4EC4Jg/Bo1RgAQyXJMhumIBjDUX4dJzM1epGZCBeC0+D7jpH4EC4Jo8WV4BgARKU/1JBlNkxBMIajGABAwLRvsqeEAWjUSgyAoZRkmQ1TEIzhKAYAEDDtm+wpYQAatRIDYCglWWbDFARjOIoBAARM+yZ7ShiARq3EABhKSZbZMAXBGI5iAAAB077JnhIGoFErMQCGUpJlNkxBMIajGABAwLRvsqeEAWjUSgyAoZRkmQ1TEIzhKAYAEDDtm+wpYQAatRIDYCglWWbDFARjOIoBAARM+yZ7ShiARq3EABhKSZbZMEUD433Uk3A2uQzXjMOxNVOLb8IxAJJC4bsB8LFASZvWZSE4wzUbAC0BEw5ZZsNYiQf9nri0fuo2dGlxaeFszkT3merSvlszJR6t774AhkomQ7ziZfmOMw3X7AugJWDCaSQowUg86PfveFm+40x0n6kuaUO8lzASh+Z3XwBDNckyG6ZoYLReIy2czZmGa/YF0BIw4TRMQTASD/rdAPhYqaQN2VPCoGFE95nqEp/WTIlH67svgKGSyRDUoAmnZayTcDa5DNfsC6AlYMJpmIJgJB70e7q4BsDHSpI9tfSl+0x1iU9rpsSj9d0XwFDJZIjNACCjtPg2erUuC8EhfElN0o9wSRiER6vGABgqSZbZMAXBIKO0+DZ6kZk2+Z40E+HSqDEAhiq2DJpwyGUho6Q+9MXS6EVm2uR70kyES6PGABiq2DJowiGXhYyS+hgAf1Yx6Uf2lDDIHls1BsBQSbLMhikIBhmlxbfRi8y0yfekmQiXRo0BMFSxZdCEQy4LGSX18QXgC4D46Gk1xOjJxASjNUDiQi9UwmnNlPpQvkS/1IvMlDCafE+aiXBp1PgCGKrYMmjCIZeFjJL6NC9U6kVmShhNvg39WjMRLo0aA2CoYsugCYcYi4yS+jQvVOpFZkoYTb4N/VozES6Nmm8ZAA1hmhgNUzQw6GVpXbqE05qpuasp1qvNZABMNw7ON0zRwDAAwLKGJa09DWng4wYAlurxwoYpGhgGwOM7pCdbe6L9pnUGwFRBcL5higaGAQCWNSxp7WlIAx83ALBUjxc2TNHAMAAe3yE92doT7TetMwCmCoLzDVM0MAwAsKxhSWtPQxr4uAGApXq8sGGKBoYB8PgO6cnWnmi/aZ0BMFUQnG+YooFhAIBlDUtaexrSwMcNACzV44UNUzQwDIDHd0hPtvZE+03rXjIApkOfeH7rH820DNrAIRgn7mrKKe16iv+Z8wbAZ9R6Ym0yBbksCeMVXwBPlPzLoMmetsgZAFtKhz7JFAbAIYsq0Ei7LrTAEAYAluq5hckUBsBz9d9ET7ve5GIAbKr9h17JFAbAIYsq0Ei7LrTAEAYAluq5hckUBsBz9d9ET7ve5GIAbKrtC+A3BUioHbKeKg0D4A9yaop/F4foQox1Eg7hUr15h4CRPW1R9QWwpbT/FeAfChgAX2++4wLg6yU5kwG5LK2fLKQXUanFh/Sy5jEFDIDHdFs/RS5l68KRXkSAFh/Sy5rHFDAAHtNt/RS5lK0LR3oRAVp8SC9rHlPAAHhMt/VT5FK2LhzpRQRo8SG9rHlMAQPgMd3WT5FL2bpwpBcRoMWH9LLmMQUMgMd0Wz9FLmXrwpFeRIAWH9LLmscUMAAe0239FLmUrQtHehEBWnxIL2seU8AAeEy39VPkUrYuHOlFBGjxIb2seUyB4wKAmC8Zi2A8JtfzTqWZWp2JNoRLA4dgtOZu4RBtWr02cAyADZVBjy1jkUtHuDRwCAaQbrWEaLNKaNjMABgK2Dq+ZSxy6QiXBg7BaOnbwiHatHpt4BgAGyqDHlvGIpeOcGngEAwg3WoJ0WaV0LCZATAUsHV8y1jk0hEuDRyC0dK3hUO0afXawDEANlQGPbaMRS4d4dLAIRhAutUSos0qoWEzA2AoYOv4lrHIpSNcGjgEo6VvC4do0+q1gWMAbKgMemwZi1w6wqWBQzCAdKslRJtVQsNmBsBQwNbxLWORS0e4NHAIRkvfFg7RptVrA+e4ANgY+sQeJ10GYnLCl+CkXbT6EJzEpfW9oUuLiwHQUnKI82oGJXwbRm/1ITjDFeLjDV1ws1BoALSUHOK8mkEJ34bRW30IznCF+HhDF9zMAGhJ9VycVzMo4dsweqsPwXnuhv9Cb+jS4uoLoKXkEOfVDEr4Noze6kNwhivExxu64Ga+AFpSPRfn1QxK+DaM3upDcJ67YV8AW/q+ZJ9XMyjhawD8uxUburRM7q8ALSWHOORCDVvg48SghC/BSaRafQhO4tL63tClxcUAaCk5xHk1gxK+DaO3+hCc4Qrx8YYuuNmr/Q2ALCoJSDBaAm7hpJnfeZC5T8IhXIi+ZG6C0+BDuDT6kHlIzXEvgIaABIOIc1INMQ2Z+yQcwoXsgMxNcBp8CJdGHzIPqTEAiEoH1BDTtMy3hUNmItITvgSnwYdwafQh85AaA4CodEANMU3LfFs4ZCYiPeFLcBp8CJdGHzIPqTEAiEoH1BDTtMy3hUNmItITvgSnwYdwafQh85AaA4CodEANMU3LfFs4ZCYiPeFLcBp8CJdGHzIPqTEAiEoH1BDTtMy3hUNmItITvgSnwYdwafQh85AaA4CodEANMU3LfFs4ZCYiPeFLcBp8CJdGHzIPqTEAiEoH1BDTtMy3hUNmItITvgSnwYdwafQh85CabxkAaPC3t1h20qIi2eI/BCK9tmrIhSJcyC5bvRIfwiVhtL4bAH9Q8qRFkYUTA3/HmYg2ZG6iH+mVagiXhNH6bgAYAC0vPQWndSnJpWv1SkIQLgmj9d0AMABaXnoKTutSkkvX6pWEIFwSRuu7AWAAtLz0FJzWpSSXrtUrCUG4JIzWdwPAAGh56Sk4rUtJLl2rVxKCcEkYre8GgAHQ8tJTcFqXkly6Vq8kBOGSMFrfDQADoOWlp+C0LiW5dK1eSQjCJWG0vhsABkDLS0/BaV1KculavZIQhEvCaH0/LgDIYGlRROCEQXi812z2Spw2uTR6EYw08/t3ssutXq0+ZO5GjQEwVJEsnBh0SOPn8U0ujV4Eg+hC9N3q1epD5m7UGABDFcnCiUGHNAyAICDZE9lB2mWrD+HSqDEAhiqShSfTDCn8Or7JpdGLYBBtiL5bvVp9yNyNGgNgqCJZODHokIYvAF8AD1nIAHhItr8OGQAfC5iCj2hH1pP60L+PNHq1ZiJcGjUGwFBFsnBi0CENXwC+AB6ykAHwkGy+ABrBRzDIekjAbvVq9SFzN2oMgKGKZOHEoEMavgB8ATxkoZcMgIcmffFDWyFymkwkYFucicabfFpz/QnHANhQudCDmLPQ5jiIzQtHNN7ks7EMA2BD5UIPYs5Cm+MgNi8c0XiTz8YyDIANlQs9iDkLbY6D2LxwRONNPhvLMAA2VC70IOYstDkOYvPCEY03+WwswwDYULnQg5iz0OY4iM0LRzTe5LOxDANgQ+VCD2LOQpvjIDYvHNF4k8/GMgyADZULPYg5C22Og9i8cETjTT4byzguAMgSNoTZ7tEwFtGu0eddm0YvgkH2QGYivRo4BIPMtFVjAGwpHfo0jNMyOZGk0YtgEC5EO9KrgUMwyExbNQbAltIGwD8UIJeSrIdcOtKrgUMwyExbNQbAltIGgAFwiNf+TsMAOGQpjZ8crZ9yRJJGL4JBuBDtSK8GDsEgM23VGABbSvsC8AVwiNd8ARy4iMZPjtZPOSJPoxfBIFyIdqRXA4dgkJm2anwBbCntC8AXwCFe8wVw4CIaPzlaP+WIPI1eBINwIdqRXg0cgkFm2qp5yRfAy4n89hb3mWZqGTgSgf/Ih+A0apIujR7/x2ho3MBozpSwDICkUOF7wxQNDDoK6UWxpnUGwFTBP583AJ6r7090cqGS0RsYdFTSi2JN65IuU/zffh9+sZdaY3YDoKFiwCAXKhm9gUFHJb0o1rQu6TLFNwA2FQbbIuY7jHKcqjFTAyMS/V8B6UWxpnWbuyZzJz4NjKlmnznvC+Azaj1Y2zBFA4PSJ70o1rQuXbgpvi+ATYXBtoj5DqMcp2rM1MCIRH0BRImS9zb3FMmCAl8AQKRpScMUDQw6B+lFsaZ16cJN8X0BbCoMtkXMdxjlOFVjpgZGJOoLIEqUvLe5p0gWFHzLFwBZAtAGlSRDvIMQPgmngdHi0sRJIm/Onbi8f097Ihgn1RgAw20QQzRM3MBoXtwWnyR/qw/BSVwMAKLQsIYsKl06gjGk+et44tK6dGSmLS6tmcgONucmfIjGBOeUGl8Aw00QQzRM3MBoXtwWnyR/qw/BSVx8ARCFhjVkUenSEYwhTV8AhX82S3ZAdpn8QIOP8CG9CM4pNb4AhpsghmiYuIFBL8LWTET6zbkJH6INwTmlxgAYboIYomHiBoYBMFy2/xVgLmBCaBidYCQe9LsB8LFSRJukM9kl6UNwEhf/BkAUGtaQRaWFE4whTf8G4N8AWhb6Uhx/BRjKn8Ko9ewmoUa4DMf9dXyLT6sPwSHabGpM+ExrDIChgsQQxHwJp4ExHPW341t8Wn0IDtEn7YlgnFRjAAy3QQxBzJdwGhjDUQ0A/wjYtNC/YzWMTjBak6SL668AM6XJLls7IExJL4JzSo0vgOEmiCEaJm5gDEf1BeALoGkhXwB/VyAFiQHwsfeSdvQVRtxNehGcU2p8AQw3QQzRuLwNjOGovgB8ATQt5AvAF0D2Uyv4CE5m4/8fANFoVEMWlX7qEowRyb8dTlzo8zPhkJkSRmvm1kyET2tugkP4bGpM+Exr/BVgqCAxBDFfwiEYw1E+dTzxJSFBMAipTW1anMlcGzUGwFBlYghi0IRDMIajfOp44msAfErOLys2AIbSNy7CO4WEYwB8vKhNbdKehnZaP24ADCUnhiAGTTgEYzjKp44nvr4APiXnlxUbAEPpGxfBF8BsCZvhSPY9m2b3tAEw1JsYghg04RCM4SifOp74+gL4lJxfVmwADKVvXARfALMlbIYj2fdsmt3TBsBQb2IIYtCEQzCGo3zqeOLrC+BTcn5ZsQEwlL5xEXwBzJawGY5k37Npdk9/ywDYlTB3IwZtGGurT564V0FmIt2Ivo1epA/hu1VjACwoTYzVMM5WnwXJfrUgMxE+RN9GL9KH8N2qMQAWlCbGahhnq8+CZAbAksgGwILQWxdzq8+CZAbAksgGwILQWxdzq8+CZAbAksgGwILQWxdzq8+CZAbAksgGwILQWxdzq8+CZAbAksgGwILQWxdzq8+CZAbAksgvGQBL2qy2Sf8VgFxuQjj1eccgvRo4BIPMtMX3nUuLM5lro8YA2FAZ9EjGIiYHbZCBSa/ElwQJwSAzbfE1AMg2hjVkmcMWRx5Pl6GlS+pDLi69CIkz4UKWlfq0+FIcwvmUGl8Ah2wiXQZicjJK6mMA/FlFoh/Zwyk1BsAhm0jGMgA+XhTRJunbDL5DLIVoGABIpucXJYMSkxOWqU/zIiTOhAuZKfWhT/cWDuF8So0BcMgm0mUg5iSjpD4GgL8CEB89raZl9KcRfBJwupgtXVIfA8AAeJLFGWzL6KzbOVXpYrZ0SX0MAAPgnFshExVQgacqcNzfAJ46reAqoAK/KWAAaAgVuFgBA+Di5Tu6ChgAekAFLlbAALh4+Y6uAgaAHlCBixUwAC5evqOrgAGgB1TgYgUMgIuX7+gqYADoARW4WAED4OLlO7oKGAB6QAUuVsAAuHj5jq4CBoAeUIGLFTAALl6+o6uAAaAHVOBiBQyAi5fv6CpgAOgBFbhYAQPg4uU7ugoYAHpABS5WwAC4ePmOrgIGgB5QgYsVMAAuXr6jq4ABoAdU4GIFDICLl+/oKmAA6AEVuFgBA+Di5Tu6ChgAekAFLlbAALh4+Y6uAgaAHlCBixUwAC5evqOrgAGgB1TgYgUMgIuX7+gqYADoARW4WIH/ApZOYPFUmtdEAAAAAElFTkSuQmCC";

async connectToPrinter() {
  try {
    // Si ya está conectado, omite la reconexión
    if (this.server?.connected) {
      console.log("El dispositivo ya está conectado.");
    } else {
      // Solicita el dispositivo si no está conectado
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455'] // UUID del servicio de impresión
      });

      this.server = await device.gatt?.connect();
      if (!this.server) throw new Error("No se pudo conectar al GATT server");

      // Obtén el servicio de impresión
      const service = await this.server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');

      // Obtén la característica de datos para enviar comandos de impresión
      this.characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3');
      console.log("Conexión y características de impresión listas");

      
    }
  } catch (error) {
    console.error("Error al conectar con la impresora:", error);
  }
}

async printTicketWithQR(gymName: string, clientName: string, membershipDuration: string, renewalDate: string) {
  try {
   
      // Construir el contenido del ticket
      const ticketContent = `
\x1B\x40
    ${gymName} 
-------------------------
Cliente: ${clientName}
Fecha de renovacion: ${renewalDate}
Duracion de membresía: ${membershipDuration}
-------------------------
      ¡Gracias por tu preferencia!
  Sigue disfrutando de nuestros servicios.
-------------------------
     www.migym.com
-------------------------
Codigo QR:
`;

      // Codificar el texto del ticket en binario
      const encoder = new TextEncoder();
      const textData = encoder.encode(ticketContent);

      // Divide el texto en fragmentos de 512 bytes o menos y envía
      const chunkSize = 512;
      for (let i = 0; i < textData.length; i += chunkSize) {
          const chunk = textData.slice(i, i + chunkSize);
          await this.characteristic.writeValue(chunk);
      }

      // Convertir la imagen QR Base64 a raster en blanco y negro
      const rasterData = await this.convertBase64ToEscPosRaster(this.imgQr);
      
      // Enviar los datos rasterizados en fragmentos de 512 bytes
      for (let i = 0; i < rasterData.length; i += chunkSize) {
          const chunk = rasterData.slice(i, i + chunkSize);
          await this.characteristic.writeValue(chunk);
      }

      console.log("Ticket de renovación con QR enviado a la impresora");
  } catch (error) {
      console.error("Error al imprimir el ticket con QR:", error);
  }
}

async convertBase64ToEscPosRaster(base64Image: string): Promise<Uint8Array> {
  // Limpia la cadena Base64 del encabezado
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg);base64,/, "");
  const binaryData = Uint8Array.from(atob(cleanBase64), char => char.charCodeAt(0));

  // Crear un canvas para convertir la imagen a blanco y negro
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Coloca la imagen en el canvas y escala si es necesario
  const img = new Image();
  img.src = `data:image/png;base64,${cleanBase64}`;
  await new Promise((resolve) => (img.onload = resolve));

  canvas.width = img.width;
  canvas.height = img.height;
  ctx!.drawImage(img, 0, 0);

  // Convertir a blanco y negro
  const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
  const bwData = this.imageToMonochrome(imageData);

  // Crear el comando ESC/POS para imprimir en formato raster
  const escPosCommand = new Uint8Array([
    0x1D, 0x76, 0x30, 0x00, // Comando ESC/POS para impresión de imagen raster
    canvas.width / 8,
    0x00,
    canvas.height % 256,
    canvas.height / 256
  ]);

  const rasterData = new Uint8Array(escPosCommand.length + bwData.length);
  rasterData.set(escPosCommand);
  rasterData.set(bwData, escPosCommand.length);

  return rasterData;
}

imageToMonochrome(imageData: ImageData): Uint8Array {
  const pixels = imageData.data;
  const monochromeData = new Uint8Array((imageData.width * imageData.height) / 8);

  for (let i = 0; i < pixels.length; i += 4) {
    const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    const bit = avg < 128 ? 1 : 0; // Umbral para blanco/negro
    const byteIndex = Math.floor(i / 32);
    const bitIndex = (i / 4) % 8;
    monochromeData[byteIndex] |= bit << (7 - bitIndex);
  }

  return monochromeData;
}


async generateticketCarrito(
  gymName: string, customerName: string, saleDate: string, 
  cart: CartItemModel[], totalAmount: number) {
  try {
    let ticketContent = `\n${gymName}\n\n`;
    ticketContent += `Cliente: ${customerName}\n`;
    ticketContent += `Fecha: ${saleDate}\n\n`;
    ticketContent += `--- Detalles de Compra ---\n`;
   ticketContent += 'Producto  Costo/U Cantidad Total\n';
    ticketContent += `-----------------------------------------------------\n`;
    
    // Agregar detalles del carrito al ticket
    cart.forEach((item: any) => {
      ticketContent += `${item.name.padEnd(2)} ${item.costo.toFixed(2).padStart(2)} ${item.quantity.toString().padStart(4)} ${((item.costo * item.quantity).toFixed(2)).padStart(10)}\n`;
    });
    
    ticketContent += `\nTotal de la venta: $${totalAmount}\n`;
    ticketContent += `------------------------\n`;
    ticketContent += `Gracias por su compra!\n`;
    
    console.log(ticketContent);
    
    // Convertir a un array de bytes para enviar a la impresora
    const encoder = new TextEncoder();
    const ticketData = encoder.encode(ticketContent);

    // Enviar el ticket a la impresora
    await this.characteristic.writeValue(ticketData);
    console.log("Ticket impreso correctamente");

  } catch (error) {
    console.error("Error al imprimir el ticket:", error);
  }
}







async printQRAndNombre(data: string, size: 'grande' | 'chico', texto?: string) {
  try {
    // 1. Generar el código QR en Base64
    const qrBase64 = await this.generateQRCode(data);

    // 2. Redimensionar la imagen del QR y agregar el nombre debajo
    const resizedImgQrBase64 = await this.resizeImageConTexto(qrBase64, size, texto);

    // 3. Construir el contenido del ticket (solo el código QR y nombre del cliente)
    const ticketContent = `
\x1B\x40
   ${texto}
`;

    // Codificar el texto del ticket en binario
    const encoder = new TextEncoder();
    const textData = encoder.encode(ticketContent);

    // Dividir el texto en fragmentos de 512 bytes o menos y enviarlos
    const chunkSize = 512;
    for (let i = 0; i < textData.length; i += chunkSize) {
      const chunk = textData.slice(i, i + chunkSize);
      await this.characteristic.writeValue(chunk);
    }

    // 4. Enviar el código QR con el texto redimensionado a la impresora
    await this.printRaster(resizedImgQrBase64);

    console.log("Ticket con QR y nombre enviado a la impresora");
  } catch (error) {
    console.error("Error al imprimir el ticket con QR:", error);
  }
}

// Método para generar el código QR en Base64 a partir de una cadena
async generateQRCode(data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(data, { errorCorrectionLevel: 'H', width: 300 }, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url); // Retorna la imagen QR como Base64
      }
    });
  });
}

// Método para imprimir los datos rasterizados (enviar a la impresora)
async printRaster(resizedImgQrBase64: string) {
  try {
    // Convertir la imagen QR redimensionada (Base64) a datos rasterizados
    const rasterData = await this.convertBase64ToEscPosRaster(resizedImgQrBase64);

    // Dividir los datos rasterizados en fragmentos de 512 bytes o menos y enviarlos a la impresora
    const chunkSize = 512;
    for (let i = 0; i < rasterData.length; i += chunkSize) {
      const chunk = rasterData.slice(i, i + chunkSize);
      await this.characteristic.writeValue(chunk);
    }

    console.log("Código QR enviado a la impresora");
  } catch (error) {
    console.error("Error al imprimir el código QR:", error);
  }
}

// Método para redimensionar la imagen QR y agregar texto debajo (nombre)
async resizeImageConTexto(base64Image: string, size: 'grande' | 'chico', texto?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Establecer el tamaño del QR según el tamaño deseado
      let width, height;
      const maxWidth = 384; // Ancho máximo para la impresora

      // Definir tamaño del QR según `size`
      switch (size) {
        case 'grande':
          width = maxWidth;
          height = (img.height / img.width) * width;
          break;
        case 'chico':
          width = maxWidth * 0.5;
          height = (img.height / img.width) * width;
          break;
        default:
          width = maxWidth;
          height = (img.height / img.width) * width;
      }

      // Crear una nueva imagen combinada (QR + texto)
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');

      // Ajustar el canvas para el QR y el texto
      const textHeight = texto ? 20 : 0; // Espacio para el texto si existe
      combinedCanvas.width = width;
      combinedCanvas.height = height + textHeight;

      // Limpiar el fondo para hacerlo transparente
      ctx?.clearRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      // Dibujar el QR en el canvas
      ctx?.drawImage(img, 0, 0, width, height);

      // Dibujar el texto debajo del QR si se proporciona
      if (ctx && texto) {
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black'; // Color del texto en negro
        ctx.fillText(texto, width / 2, height + textHeight - 5);
      }

      // Obtener la imagen combinada (QR + texto debajo) en formato Base64
      const resizedBase64 = combinedCanvas.toDataURL('image/png');
      resolve(resizedBase64);
    };
    img.onerror = reject;
    img.src = base64Image;
  });
}


}
