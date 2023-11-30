import { TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
describe('ProductComponent', () => {
  let component: ProductComponent;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    const productServiceMock = {
      findProduct: jest.fn().mockReturnValue(of([{
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'Test Logo',
        date_release: new Date(),
        date_revision: new Date(),
      }])),
      addProduct: jest.fn().mockReturnValue(of({})),
      updatedProduct: jest.fn().mockReturnValue(of({})),
      checkId: jest.fn().mockReturnValue(of(false)),
    };
    
    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ ProductComponent, ReactiveFormsModule ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    })
    .compileComponents();
  
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable id field if there is id input', () => {
    component.id = '1';
    component.ngOnInit();
    expect(component.myForm.get('id')?.disabled).toBe(true);
  });

  it('should return correct error message for required field', () => {
    component.myForm = new FormGroup({
      'test': new FormControl('', Validators.required)
    });

    expect(component.getMessageError('test')).toEqual('Este campo es requerido');
  });

  it('should return correct error message for minlength field', () => {
    component.myForm = new FormGroup({
      'test': new FormControl('a', Validators.minLength(3))
    });

    expect(component.getMessageError('test')).toEqual('Este campo debe tener minimo 3 letras');
  });
  it('should call addProduct and navigate to root on success', () => {
    component.pushProduct();
    expect(productService.addProduct).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set error message on failure', () => {
    (productService.addProduct as jest.Mock).mockReturnValue(throwError({ message: 'error' }));
    component.pushProduct();
    expect(component.messageError()).toEqual('error');
    expect(component.showMessageError()).toBe(true);
  });

  it('should return true if field is invalid and touched', () => {
    component.myForm = new FormGroup({
      'test': new FormControl('', Validators.required)
    });
    component.myForm.controls['test'].markAsTouched();
  
    expect(component.isValidField('test')).toBe(true);
  });
  
  
  it('should add one year to the date', () => {
    const date = new Date('2022-01-01');
    const expectedDate = new Date('2023-01-01');
  
    expect(component.addOneYear(date)).toEqual(expectedDate);
  });

  it('should mark all fields as touched if form is invalid', () => {
    component.myForm = new FormGroup({
      'test': new FormControl('', Validators.required)
    });
  
    component.onSave();
    expect(component.myForm.touched).toBe(true);
  });
  
  it('should update product if id exists', () => {
    component.myForm = new FormGroup({
      'test': new FormControl('valid value', Validators.required)
    });
    component.id = '1';
    (productService.updatedProduct as jest.Mock).mockReturnValue(of({}));
  
    component.onSave();
    expect(productService.updatedProduct).toHaveBeenCalledWith({ test: 'valid value', id: '1' });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
  
  it('should check id and push product if id does not exist and is not taken', () => {
    component.myForm = new FormGroup({
      'id': new FormControl('1', Validators.required),
      'test': new FormControl('valid value', Validators.required)
    });
    (productService.checkId as jest.Mock).mockReturnValue(of(false));
    component.pushProduct = jest.fn();
  
    component.onSave();
    expect(productService.checkId).toHaveBeenCalledWith('1');
    expect(component.pushProduct).toHaveBeenCalled();
  });
  
  it('should set id field error if id is taken', () => {
    component.myForm = new FormGroup({
      'id': new FormControl('1', Validators.required),
      'test': new FormControl('valid value', Validators.required)
    });
    (productService.checkId as jest.Mock).mockReturnValue(of(true));
  
    component.onSave();
    expect(component.myForm.get('id')?.errors).toEqual({ exist: true });
  });
  
});