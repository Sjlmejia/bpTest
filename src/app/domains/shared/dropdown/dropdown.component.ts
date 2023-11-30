import { Component, signal, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() id!: string;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  goToEdit(id:string) {
    this.edit.emit(id);
    this.isOpen.set(false);
  }

  goToDelete(id:string) {
    this.delete.emit(id);
    this.isOpen.set(false);
  }

}
