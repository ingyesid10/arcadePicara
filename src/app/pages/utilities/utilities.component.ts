import { Component } from '@angular/core';

interface UtilityTool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.css']
})
export class UtilitiesComponent {
  activeTool: string | null = null;

  tools: UtilityTool[] = [
    {
      id: 'pdf-converter',
      name: 'PDF a Imagen',
      description: 'Convierte cada página de un PDF a JPG o PNG. 100% en tu navegador, sin subir archivos a ningún servidor.',
      icon: '📄'
    }
  ];

  selectTool(id: string): void {
    this.activeTool = id;
  }

  goBack(): void {
    this.activeTool = null;
  }
}
