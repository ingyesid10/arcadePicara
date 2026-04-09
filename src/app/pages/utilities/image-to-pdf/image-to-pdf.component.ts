import { Component, ElementRef, ViewChild } from '@angular/core';
import JSZip from 'jszip';

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
const SUPPORTED_EXT = /\.(jpe?g|png|webp|gif|bmp|tiff?)$/i;

interface ImageEntry {
  file: File;
  objectUrl: string;
  name: string;
  sizeKb: number;
}

@Component({
  selector: 'app-image-to-pdf',
  templateUrl: './image-to-pdf.component.html',
  styleUrls: ['./image-to-pdf.component.css']
})
export class ImageToPdfComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  images: ImageEntry[] = [];
  isDragging = false;
  isConverting = false;
  errorMsg = '';
  outputName = 'documento';

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files) this.addFiles(Array.from(event.dataTransfer.files));
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  private addFiles(files: File[]): void {
    this.errorMsg = '';
    for (const file of files) {
      if (!SUPPORTED_TYPES.includes(file.type) && !SUPPORTED_EXT.test(file.name)) {
        this.errorMsg = `Formato no soportado: ${file.name}. Usa JPG, PNG, WEBP, GIF, BMP o TIFF.`;
        continue;
      }
      this.images.push({
        file,
        objectUrl: URL.createObjectURL(file),
        name: file.name,
        sizeKb: Math.round(file.size / 1024)
      });
    }
  }

  removeImage(index: number): void {
    URL.revokeObjectURL(this.images[index].objectUrl);
    this.images.splice(index, 1);
  }

  moveUp(index: number): void {
    if (index === 0) return;
    [this.images[index - 1], this.images[index]] = [this.images[index], this.images[index - 1]];
  }

  moveDown(index: number): void {
    if (index === this.images.length - 1) return;
    [this.images[index], this.images[index + 1]] = [this.images[index + 1], this.images[index]];
  }

  async convert(): Promise<void> {
    if (!this.images.length) return;
    this.isConverting = true;
    this.errorMsg = '';

    try {
      // Use jsPDF-style approach: draw each image on a canvas sized to the image, export as PDF
      // We'll use the browser's built-in canvas + a minimal PDF builder via data URIs
      const pages: { dataUrl: string; width: number; height: number }[] = [];

      for (const entry of this.images) {
        const result = await this.loadImageToCanvas(entry.file);
        pages.push(result);
      }

      const pdfBytes = this.buildPdf(pages);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.outputName.trim() || 'documento'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      this.errorMsg = 'Error al generar el PDF. Intenta con imágenes en formato JPG o PNG.';
      console.error(err);
    } finally {
      this.isConverting = false;
    }
  }

  private loadImageToCanvas(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas context failed')); return; }
        // Fill white background so transparent PNGs don't become black in the PDF
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        // Always JPEG — avoids the async image-reload issue in buildPdf for PNG
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.92), width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Failed to load ${file.name}`)); };
      img.src = url;
    });
  }

  /**
   * Builds a minimal valid PDF from an array of JPEG/PNG images using raw PDF syntax.
   * Each image fills one page (page size = image pixel size mapped to 72dpi points).
   */
  private buildPdf(pages: { dataUrl: string; width: number; height: number }[]): Uint8Array {
    const encoder = new TextEncoder();
    const chunks: Uint8Array[] = [];
    const offsets: number[] = [];
    let pos = 0;

    const write = (s: string) => {
      const bytes = encoder.encode(s);
      chunks.push(bytes);
      pos += bytes.length;
    };
    const writeBytes = (bytes: Uint8Array) => {
      chunks.push(bytes);
      pos += bytes.length;
    };

    // PDF header
    write('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

    const imageObjects: { objId: number; width: number; height: number; colorSpace: string }[] = [];
    const pageObjectIds: number[] = [];

    let nextObjId = 1;

    // Write image XObjects
    for (const page of pages) {
      const b64 = page.dataUrl.split(',')[1];
      const imgBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const colorSpace = 'DeviceRGB';

      offsets.push(pos);
      const imgObjId = nextObjId++;
      imageObjects.push({ objId: imgObjId, width: page.width, height: page.height, colorSpace });

      // Always JPEG (loadImageToCanvas always returns image/jpeg)
      write(`${imgObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /${colorSpace} /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`);
      writeBytes(imgBytes);
      write('\nendstream\nendobj\n');
    }

    // Write page content streams + page objects
    const pageTree: number[] = [];
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const imgObj = imageObjects[i];
      // Point size = pixels * 72 / 96 (screen DPI assumption for reasonable PDF page size)
      const ptW = Math.round(page.width * 72 / 96);
      const ptH = Math.round(page.height * 72 / 96);

      // Content stream: place image filling the entire page
      const contentStr = `q ${ptW} 0 0 ${ptH} 0 0 cm /Im${i + 1} Do Q\n`;
      const contentBytes = encoder.encode(contentStr);

      offsets.push(pos);
      const contentObjId = nextObjId++;
      write(`${contentObjId} 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n`);
      writeBytes(contentBytes);
      write('\nendstream\nendobj\n');

      offsets.push(pos);
      const pageObjId = nextObjId++;
      pageObjectIds.push(pageObjId);

      write(`${pageObjId} 0 obj\n<< /Type /Page /MediaBox [0 0 ${ptW} ${ptH}] /Contents ${contentObjId} 0 R /Resources << /XObject << /Im${i + 1} ${imgObj.objId} 0 R >> >> >>\nendobj\n`);
    }

    // Pages dictionary
    offsets.push(pos);
    const pagesDictId = nextObjId++;
    write(`${pagesDictId} 0 obj\n<< /Type /Pages /Count ${pages.length} /Kids [${pageObjectIds.map(id => `${id} 0 R`).join(' ')}] >>\nendobj\n`);

    // Catalog
    offsets.push(pos);
    const catalogId = nextObjId++;
    write(`${catalogId} 0 obj\n<< /Type /Catalog /Pages ${pagesDictId} 0 R >>\nendobj\n`);

    // xref table
    const xrefPos = pos;
    const totalObjects = nextObjId;
    write(`xref\n0 ${totalObjects}\n0000000000 65535 f \n`);
    for (const offset of offsets) {
      write(`${String(offset).padStart(10, '0')} 00000 n \n`);
    }

    write(`trailer\n<< /Size ${totalObjects} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`);

    // Combine all chunks
    const totalLen = chunks.reduce((s, c) => s + c.length, 0);
    const result = new Uint8Array(totalLen);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  reset(): void {
    for (const img of this.images) URL.revokeObjectURL(img.objectUrl);
    this.images = [];
    this.errorMsg = '';
    this.outputName = 'documento';
  }
}
