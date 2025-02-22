import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { Router } from '@angular/router';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() id?: string;
  messageError = signal('');
  showMessageError = signal(false);
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  logo = 'https://cdnbancawebprodcx6.azureedge.net/blue/static/items/pbw-pichincha-banca-web-public-ang/assets/logo_pichincha.svg';

  title = signal('Formulario de Registro');
  minDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

  public myForm: FormGroup = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    date_release: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    logo: ['', [Validators.required]],
    date_revision: [formatDate(this.addOneYear(new Date()), 'yyyy-MM-dd', 'en'), [Validators.required]],
  });

  ngOnInit() {
    if (this.id) {
      this.title.set('Formulario de Edición');
      this.productService.findProduct(this.id).subscribe({
        next: (product: Product | null) => {
          if (product) {
            this.myForm.patchValue({
              id: this.id,
              name: product.name,
              description: product.description,
              logo: product.logo,
              date_release: formatDate(product.date_release, 'yyyy-MM-dd', 'en'),
              date_revision: formatDate(product.date_revision, 'yyyy-MM-dd', 'en'),
            });
            this.myForm.get('id')?.disable();
          } else {
            this.messageError.set('Producto no encontrado');
            this.showMessageError.set(true);
          }
        },
        error: (error: any) => {
          this.messageError.set(error.message);
          this.showMessageError.set(true);
        }
      });
    }

  }

  isValidField(field: string): boolean | null {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }

  addOneYear(date: Date): Date {
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  getMessageError(field: string): string | null {
    if (!this.myForm.controls[field]) return null;
    const errors = this.myForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'exist':
          return 'ID no válido';
        case 'minlength':
          return `Este campo debe tener mínimo ${errors[key].requiredLength} caracteres`;
        case 'maxlength':
          return `Este campo debe tener máximo ${errors[key].requiredLength} caracteres`;
      }
    }
    return null;
  }

  onSave(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    if (this.id) {
      const putProduct = { ...this.myForm.value };
      this.productService.updateProduct(this.id, putProduct).subscribe({
        next: () => this.router.navigate(['/']),
        error: (error: any) => {
          this.messageError.set(error.message);
          this.showMessageError.set(true);
        }
      });
    } else {
      this.productService.checkId(this.myForm.value.id).subscribe({
        next: (existProduct: boolean) => {
          if (existProduct) {
            this.myForm.get('id')?.setErrors({ exist: true });
          } else {
            this.pushProduct();
          }
        },
        error: (error: any) => {
          this.messageError.set(error.message);
          this.showMessageError.set(true);
        }
      });
    }
  }

  pushProduct(): void {
    this.productService.addProduct(this.myForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error: any) => {
        console.error('Error:', error);
        this.messageError.set(error.message);
        this.showMessageError.set(true);
      }
    });
  }

  handleReset(): void {
    this.myForm.reset();
  }
}
