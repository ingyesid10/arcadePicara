import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UtilitiesComponent } from './utilities.component';
import { PdfConverterComponent } from './pdf-converter/pdf-converter.component';
import { ImageToPdfComponent } from './image-to-pdf/image-to-pdf.component';

const routes: Routes = [
  { path: '', component: UtilitiesComponent }
];

@NgModule({
  declarations: [UtilitiesComponent, PdfConverterComponent, ImageToPdfComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UtilitiesModule {}
