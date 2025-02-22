import { Component, ViewChild, signal, ElementRef, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { HandleDeleteProduct, Product } from '../../../shared/models/product.model';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, DropdownComponent, ModalComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  @ViewChild('dropdown', { static: false }) dropdown?: ElementRef;

  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  selectedRecords = signal<number>(5);
  private router = inject(Router);
  private productService = inject(ProductService);
  showMenu = signal(false);
  showModal = signal(false);
  searchValue = signal('');
  messageError = signal('');
  showMessageError = signal(false);
  selectedProduct: Product | null = null;
  sortOptions = [5, 10, 20];
  logo = 'https://cdnbancawebprodcx6.azureedge.net/blue/static/items/pbw-pichincha-banca-web-public-ang/assets/logo_pichincha.svg';

  columnsHeader = [
    { key: 'logo', label: 'Logo' },
    { key: 'name', label: 'Nombre del Producto' },
    { key: 'description', label: 'Descripción' },
    { key: 'date_release', label: 'Fecha de Liberación' },
    { key: 'date_revision', label: 'Fecha de Reestructuración' }
  ];

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.applyFilters();
      },
      error: (error) => this.handleError(error)
    });
  }

  private applyFilters() {
    const search = this.searchValue().toLowerCase();
    let filtered = this.products();

    if (search.length > 0) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(search));
    }

    this.filteredProducts.set(filtered.slice(0, this.selectedRecords()));
  }

  goToAdd() {
    this.router.navigate(['/product']);
  }

  editProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

  deleteProduct(id: string) {
    const productToDelete = this.products().find(product => product.id === id);
    if (productToDelete) {
      this.selectedProduct = productToDelete;
      this.showModal.set(true);
    }
  }
  handleDelete(event: HandleDeleteProduct) {
    this.showModal.set(false);
    if (event.isDelete) {
      this.productService.deleteProduct(event.product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }


  handleSort(event: Event) {
    this.selectedRecords.set(Number((event.target as HTMLSelectElement).value));
    this.applyFilters();
  }

  handleSearch(event: Event) {
    this.searchValue.set((event.target as HTMLInputElement).value);
    this.applyFilters();
  }

  private handleError(error: any) {
    this.messageError.set(error.message);
    this.showMessageError.set(true);
  }
}
