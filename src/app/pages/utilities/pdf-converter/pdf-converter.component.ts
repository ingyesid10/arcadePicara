import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';

interface ConvertedPage {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-pdf-converter',
  templateUrl: './pdf-converter.component.html',
  styleUrls: ['./pdf-converter.component.css']
})
export class PdfConverterComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dropZone') dropZone!: ElementRef<HTMLDivElement>;

  selectedFile: File | null = null;
  format: 'jpeg' | 'png' = 'jpeg';
  dpi = 150;
  isConverting = false;
  progress = 0;
  totalPages = 0;
  pages: ConvertedPage[] = [];
  isDragging = false;
  errorMsg = '';
  isDownloadingZip = false;

  dpiOptions = [72, 96, 150, 200, 300];

  ngOnInit(): void {}

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.setFile(input.files[0]);
    }
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
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.setFile(files[0]);
    }
  }

  private setFile(file: File): void {
    this.errorMsg = '';
    this.pages = [];
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') {
      this.errorMsg = 'Por favor selecciona un archivo PDF válido.';
      return;
    }
    this.selectedFile = file;
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  async convert(): Promise<void> {
    if (!this.selectedFile) return;
    this.isConverting = true;
    this.progress = 0;
    this.errorMsg = '';
    this.pages = [];

    try {
      const arrayBuffer = await this.selectedFile.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      this.totalPages = pdf.numPages;

      const mimeType = this.format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const quality = this.format === 'jpeg' ? 0.92 : 1;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = this.dpi / 72;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const context = canvas.getContext('2d');
        if (!context) throw new Error('No se pudo inicializar el canvas.');

        await page.render({ canvasContext: context, viewport }).promise;

        const dataUrl = canvas.toDataURL(mimeType, quality);
        this.pages.push({
          pageNum: i,
          dataUrl,
          width: canvas.width,
          height: canvas.height
        });

        this.progress = Math.round((i / pdf.numPages) * 100);
      }
    } catch (err) {
      this.errorMsg = 'Error al convertir el PDF. Asegúrate de que el archivo no esté protegido.';
      console.error(err);
    } finally {
      this.isConverting = false;
    }
  }

  downloadPage(page: ConvertedPage): void {
    const ext = this.format === 'jpeg' ? 'jpg' : 'png';
    const fileName = `${this.selectedFile?.name.replace('.pdf', '') ?? 'pagina'}_${String(page.pageNum).padStart(3, '0')}.${ext}`;
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = fileName;
    link.click();
  }

  async downloadAll(): Promise<void> {
    if (!this.pages.length) return;
    this.isDownloadingZip = true;
    const ext = this.format === 'jpeg' ? 'jpg' : 'png';
    const baseName = this.selectedFile?.name.replace('.pdf', '') ?? 'paginas';

    try {
      const zip = new JSZip();
      const folder = zip.folder(baseName);
      if (!folder) throw new Error('Error creando carpeta ZIP');

      for (const page of this.pages) {
        const response = await fetch(page.dataUrl);
        const blob = await response.blob();
        folder.file(`pagina_${String(page.pageNum).padStart(3, '0')}.${ext}`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      this.errorMsg = 'Error al crear el ZIP.';
      console.error(err);
    } finally {
      this.isDownloadingZip = false;
    }
  }

  reset(): void {
    this.selectedFile = null;
    this.pages = [];
    this.progress = 0;
    this.totalPages = 0;
    this.errorMsg = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
