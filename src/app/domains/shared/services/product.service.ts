import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private url = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros'
  private headers;

  constructor() {
    this.headers = new HttpHeaders()
    .set('authorId', '11111')
  }

  getProducts() {
    return this.http.get<Product[]>(`${this.url}/bp/products`, {'headers': this.headers})
  }

  addProduct(product: Product) { 
    return this.http.post<Product>(`${this.url}/bp/products`, product, {'headers': this.headers})
  }

  updatedProduct(product: Product) {
    return this.http.put<Product>(`${this.url}/bp/products`, product , {'headers': this.headers})
  }

  deleteProduct(id: string) {
    return this.http.delete<Product>(`${this.url}/bp/products?id=${id}`, {'headers': this.headers})
  }

  findProduct(id: string) { 
    return this.getProducts();
  }

  checkId(id: string) {
    return this.http.get<Product>(`${this.url}/bp/products/verification?id=${id}}`, {'headers': this.headers})
  }
}

