import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private baseUrl = '/bp/products';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor() {}

  /**
   * Obtener todos los productos financieros
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(this.baseUrl, { headers: this.headers })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Agregar un producto financiero
   * @param product Producto a agregar
   */
  addProduct(product: Product): Observable<Product> {
    return this.http.post<{ message: string, data: Product }>(this.baseUrl, product, { headers: this.headers })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Actualizar un producto financiero
   * @param id Identificador del producto
   * @param product Datos a actualizar
   */
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<{ message: string, data: Product }>(`${this.baseUrl}/${id}`, product, { headers: this.headers })
      .pipe(
        map(response => response.data),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Eliminar un producto financiero
   * @param id Identificador del producto a eliminar
   */
  deleteProduct(id: string): Observable<string> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { headers: this.headers })
      .pipe(
        map(response => response.message),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Buscar un producto por ID
   * @param id Identificador del producto
   */
  findProduct(id: string): Observable<Product | null> {
    return this.getProducts()
      .pipe(
        map(products => products.find(product => product.id === id) || null)
      );
  }

  /**
   * Verificar existencia de un ID de producto
   * @param id Identificador a verificar
   */
  checkId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`, { headers: this.headers })
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Manejo de errores en las peticiones HTTP
   * @param error Error de respuesta HTTP
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en la API:', error);
    return throwError(() => new Error(error?.error?.message || 'Error desconocido en el servidor'));
  }
}
