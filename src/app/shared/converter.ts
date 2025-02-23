export class FileConverter {
    /**
     * Convierte una imagen en formato Base64 a un archivo Blob.
     * @param base64Data La cadena Base64 que representa la imagen.
     * @param fileName El nombre del archivo resultante.
     * @returns El objeto File listo para enviarse.
     */
    static base64ToFile(base64Data: string, fileName: string): File {
      if (!base64Data) {
        throw new Error('La cadena Base64 no puede estar vacía.');
      }
  
      // Elimina la cabecera data:image/png;base64, o data:image/jpeg;base64,
      const byteString = atob(base64Data.split(',')[1]); 
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
  
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
  
      const mimeType = FileConverter.getMimeType(base64Data);
      const blob = new Blob([uint8Array], { type: mimeType });
  
      return new File([blob], fileName, { type: mimeType });
    }
  
    /**
     * Extrae el tipo MIME (image/png, image/jpeg, etc.) de una cadena Base64.
     * @param base64Data La cadena Base64 de la imagen.
     * @returns El tipo MIME de la imagen (por ejemplo, 'image/png').
     */
    static getMimeType(base64Data: string): string {
      const match = base64Data.match(/^data:(image\/\w+);base64,/);
      return match ? match[1] : 'image/png'; // Valor predeterminado: image/png
    }
  }
  