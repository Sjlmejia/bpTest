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
  selecteValue?: string;
  defaultValue = signal(5);
  private router = inject(Router);
  private productService = inject(ProductService);
  showMenu = signal(false);
  showModal = signal(false);
  searchValue = signal('');
  messageError = signal('');
  showMessageError = signal(false);
  sortOptions = [5,10, 20];
  logo = 'https://cdnbancawebprodcx6.azureedge.net/blue/static/items/pbw-pichincha-banca-web-public-ang/assets/logo_pichincha.svg';

  productsByFilter = computed(() => {
    const filter = this.defaultValue();
    const products = this.products();
    const search = this.searchValue();
    if(this.searchValue().length > 0) {
      return products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
    }
    const filterProducts = [...products.slice(0, filter)]
    return filterProducts;
  });

  columnsHeader = [
    { key: 'logo', label: 'Logo' },
    { key: 'name', label: 'Nombre del Producto' },
    { key: 'description', label: 'Descripcion' },
    { key: 'date_realease', label: 'Fecha de Liberación' },
    { key: 'date_revision', label: 'Fecha de Restructuracion' }
  ];

  ngOnInit(){
    this.checkProducts();
  }

  checkProducts() {
    this.productService.getProducts()
    .subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (error) => {
        this.messageError.set(error.message);
        this.showMessageError.set(true);
      }
    })
  }
  goToAdd() {
    this.router.navigate(['/product']);
  }

  handleMenu() {
    this.showMenu.set(!this.showMenu());
  }

  editProduct(id:string) {
    this.router.navigate(['/product', id]);
  }

  deleteProduct(id: string) {
    this.showModal.set(true);
  }

  handleDelete(event: HandleDeleteProduct) {
    this.showModal.set(false);
    const { isDelete, product } = event;
    if(isDelete) {
      this.productService.deleteProduct(product.id)
      .subscribe({
        next: (res) => {
          this.checkProducts();
        },
        error: (error) => {
          this.messageError.set(error.message);
          this.showMessageError.set(true);
        }
      })
    }
  }

  handleSort(event: Event) {
    this.selecteValue = this.dropdown?.nativeElement.value;
    this.defaultValue.set(Number(this.selecteValue));
  }

  handleSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
  }
}
