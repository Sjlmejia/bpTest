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
  @Input({required: true}) showModal: boolean = true;
  @Input({required:true}) product!: Product;
  @Output() handleDelete = new EventEmitter();

  closeModal(isDelete = false): void {
    this.showModal = false;
    const objResponse = {
      showModal: this.showModal,
      isDelete: isDelete,
      product: this.product, 
    }
    this.handleDelete.emit(objResponse);
  }
}
