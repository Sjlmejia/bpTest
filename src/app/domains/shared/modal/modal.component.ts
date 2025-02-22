import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input({ required: true }) showModal: boolean = false;
  @Input({ required: true }) product!: Product;
  @Output() handleDelete = new EventEmitter();

  closeModal(isDelete = false): void {
    if (!this.product) return;

    const objResponse = {
      showModal: false,
      isDelete: isDelete,
      product: this.product,
    };
    this.handleDelete.emit(objResponse);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

}
