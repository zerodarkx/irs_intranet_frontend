import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'shared-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() titulo: string = 'Modal';
  @Input() modalId: string = 'myModal';
  @ViewChild('modal', { static: true }) modalElement!: ElementRef;

  private modalInstance!: Modal;

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  abrirModal() {
    this.modalInstance.show();
  }

  cerrarModal() {
    this.modalInstance.hide();
  }
}
