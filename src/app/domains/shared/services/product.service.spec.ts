import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = '/bp/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Producto 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Producto 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should find a product by ID', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Producto 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() }
    ];

    service.findProduct('1').subscribe(product => {
      expect(product).toEqual(mockProducts[0]);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should return null if product is not found', () => {
    service.findProduct('99').subscribe(product => {
      expect(product).toBeNull();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [] });
  });

  it('should check if product ID exists', () => {
    service.checkId('1').subscribe(exists => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`${baseUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should handle API errors correctly', () => {
    service.getProducts().subscribe({
      next: () => fail('No debería haber pasado'),
      error: (error) => {
        expect(error.message).toBe('Error desconocido en el servidor');
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush({ message: 'Error en el servidor' }, { status: 500, statusText: 'Server Error' });
  });

  it('should add a product', () => {
    const newProduct: Product = {
      id: '3',
      name: 'Producto 3',
      description: 'Descripción 3',
      logo: 'logo3.png',
      date_release: new Date(),
      date_revision: new Date()
    };

    service.addProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Producto agregado', data: newProduct });
  });

  it('should update a product', () => {
    const updatedProduct: Partial<Product> = {
      name: 'Producto actualizado',
      description: 'Nueva descripción'
    };

    service.updateProduct('1', updatedProduct).subscribe(product => {
      expect(product.name).toBe(updatedProduct.name);
      expect(product.description).toBe(updatedProduct.description);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Producto actualizado', data: updatedProduct });
  });

});
