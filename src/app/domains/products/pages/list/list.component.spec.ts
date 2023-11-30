import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListComponent } from './list.component';
import { ProductService } from '../../../shared/services/product.service';
import { of, throwError } from 'rxjs';
import { HandleDeleteProduct } from '../../../shared/models/product.model';
import { Router } from '@angular/router';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let productServiceMock: jest.Mocked<ProductService>;
  let router: Router;

  beforeEach(() => {
    productServiceMock = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn().mockReturnValue(of({})),
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check products on initialization', () => {
    const mockProducts = [{
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    }];
    productServiceMock.getProducts.mockReturnValueOnce(of(mockProducts));

    component.ngOnInit();

    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(mockProducts);
  });

  it('should handle delete product', () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    };
    component.products.set([mockProduct]);

    productServiceMock.deleteProduct.mockReturnValueOnce(of({
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    }));

    component.deleteProduct(mockProduct.id);
    expect(component.showModal()).toBe(true);

    component.handleDelete({
      isDelete: true, 
      product: mockProduct,
      showModal: false
    });

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    expect(component.showModal()).toBe(false);
  });

  it('should handle errors during product check', () => {
    const errorMessage = 'Error fetching products';
    productServiceMock.getProducts.mockReturnValueOnce(throwError({ message: errorMessage }));

    component.ngOnInit();

    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.messageError()).toBe(errorMessage);
    expect(component.showMessageError()).toBe(true);
  });


  it('should delete product and check products if isDelete is true', () => {
    const event: HandleDeleteProduct = {
      isDelete: true,
      product: {
        id: '1',
        name: '',
        description: '',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
      showModal: false
    };
    (productServiceMock.deleteProduct as jest.Mock).mockReturnValue(of({})); // Replace 'productService' with 'productServiceMock'
    component.checkProducts = jest.fn();

    component.handleDelete(event);
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith('1'); // Replace 'productService' with 'productServiceMock'
    expect(component.checkProducts).toHaveBeenCalled();
  });

  it('should not delete product or check products if isDelete is false', () => {
    const event: HandleDeleteProduct = {
      isDelete: false,
      product: {
        id: '1',
        name: '',
        description: '',
        logo: '',
        date_release: new Date(),
        date_revision: new Date(),
      },
      showModal: false
    };
    component.checkProducts = jest.fn();

    component.handleDelete(event);
    expect(productServiceMock.deleteProduct).not.toHaveBeenCalled(); // Replace 'productService' with 'productServiceMock'
    expect(component.checkProducts).not.toHaveBeenCalled();
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

  it('should call checkProducts when ngOnInit is called', () => {
    component.checkProducts = jest.fn();
    component.ngOnInit();
    expect(component.checkProducts).toHaveBeenCalled();
  });

  it('should set search value when handleSearch is called', () => {
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'test' } });
    component.searchValue = {
      set: jest.fn()
    } as any;
  
    component.handleSearch(event);
    expect(component.searchValue.set).toHaveBeenCalledWith('test');
  });

  it('should filter products by name when searchValue is not empty', () => {
    (component.defaultValue as unknown) = jest.fn().mockReturnValue(2);
    (component.products as unknown)= jest.fn().mockReturnValue([
      { name: 'Product 1' },
      { name: 'Product 2' },
      { name: 'Product 3' }
    ]);
    (component.searchValue as unknown) = jest.fn().mockReturnValue('Product 1');
  
    const filteredProducts = component.productsByFilter();
    expect(filteredProducts).toEqual([{ name: 'Product 1' }]);
  });
  

});
