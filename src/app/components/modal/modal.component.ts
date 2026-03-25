import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() game: string | null = null;
  @Output() close = new EventEmitter<void>();

  backdropClick(e: MouseEvent){
    if((e.target as HTMLElement).classList.contains('modal-backdrop')) this.close.emit();
  }

    closeModal() {
    this.close.emit();
  }
}
