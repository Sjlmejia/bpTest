import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let productService: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    productService = TestBed.inject(ProductService);
    productService['url'] = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros';
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  it('should get products', () => {
    const mockProducts = [{
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    }];
  
    productService.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  
    const req = httpMock.expectOne(`${productService['url']}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a product', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    };
    productService.addProduct(product).subscribe();

    const req = httpMock.expectOne(`${productService['url']}/bp/products`);
    expect(req.request.method).toBe('POST');
    req.flush(product);
  });

  it('should update a product', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    };

    productService.updatedProduct(product).subscribe();

    const req = httpMock.expectOne(`${productService['url']}/bp/products`);
    expect(req.request.method).toBe('PUT');
    req.flush(product);
  });

  it('should delete a product', () => {
    const id = '1';
    productService.deleteProduct(id).subscribe();

    const req = httpMock.expectOne(`${productService['url']}/bp/products?id=${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should find a product', () => {
    const id = '1';
    productService.findProduct(id).subscribe();

    const req = httpMock.expectOne(`${productService['url']}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });
});