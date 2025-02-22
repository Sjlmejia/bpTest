import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from './list.component';
import { ProductService } from '../../../shared/services/product.service';
import { of, throwError } from 'rxjs';
import { HandleDeleteProduct, Product } from '../../../shared/models/product.model';
import { Router } from '@angular/router';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let productServiceMock: jest.Mocked<ProductService>;
  let router: Router;

  beforeEach(() => {
    productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of([
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          logo: 'Test Logo',
          date_release: new Date(),
          date_revision: new Date(),
        },
      ])),
      deleteProduct: jest.fn().mockReturnValue(of('Producto eliminado correctamente')),
    } as unknown as jest.Mocked<ProductService>;

    const routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProducts on initialization', () => {
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products()).toHaveLength(1);
  });

  it('should show the modal when deleteProduct is called', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    };
    component.products.set([mockProduct]);
    fixture.detectChanges();

    component.deleteProduct(mockProduct.id);
    expect(component.selectedProduct).toEqual(mockProduct);
    expect(component.showModal()).toBe(true);
  });

  it('should handle delete product correctly', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    };
    component.products.set([mockProduct]);
    fixture.detectChanges();

    component.handleDelete({
      isDelete: true,
      product: mockProduct,
      showModal: false,
    });

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    expect(component.showModal()).toBe(false);
  });

  it('should handle errors in loadProducts', () => {
    const errorMessage = 'Error fetching products';
    productServiceMock.getProducts.mockReturnValueOnce(throwError(() => new Error(errorMessage)));

    component['loadProducts']();
    fixture.detectChanges();

    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.messageError()).toBe(errorMessage);
    expect(component.showMessageError()).toBe(true);
  });

  it('should not delete product if isDelete is false', () => {
    const event: HandleDeleteProduct = {
      showModal: false,
      isDelete: false,
      product: {
        id: '1',
        name: '',
        description: '',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
    };

    component.handleDelete(event);
    expect(productServiceMock.deleteProduct).not.toHaveBeenCalled();
  });

  it('should navigate to /product when goToAdd is called', () => {
    component.goToAdd();
    expect(router.navigate).toHaveBeenCalledWith(['/product']);
  });

  it('should navigate to /product/:id when editProduct is called', () => {
    const id = '1';
    component.editProduct(id);
    expect(router.navigate).toHaveBeenCalledWith(['/product', id]);
  });

  it('should update search value when handleSearch is called', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.handleSearch(event);
    fixture.detectChanges();

    expect(component.searchValue()).toBe('test');
  });

  it('should filter products based on search input', () => {
    const mockProducts = [
      { id: '1', name: 'Apple', description: '', logo: '', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Banana', description: '', logo: '', date_release: new Date(), date_revision: new Date() },
      { id: '3', name: 'Cherry', description: '', logo: '', date_release: new Date(), date_revision: new Date() },
    ];
    component.products.set(mockProducts);
    component.searchValue.set('Apple');
    component['applyFilters']();
    fixture.detectChanges();

    expect(component.filteredProducts()).toEqual([mockProducts[0]]);
  });

  it('should limit products to selectedRecords value', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', description: '', logo: '', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Product 2', description: '', logo: '', date_release: new Date(), date_revision: new Date() },
      { id: '3', name: 'Product 3', description: '', logo: '', date_release: new Date(), date_revision: new Date() },
    ];
    component.products.set(mockProducts);
    component.selectedRecords.set(2);
    component['applyFilters']();
    fixture.detectChanges();

    expect(component.filteredProducts().length).toBe(2);
  });

  it('should change the number of displayed records when handleSort is called', () => {
    const event = { target: { value: '10' } } as unknown as Event;

    component.handleSort(event);
    fixture.detectChanges();

    expect(component.selectedRecords()).toBe(10);
  });

});
