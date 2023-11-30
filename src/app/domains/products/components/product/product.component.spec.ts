// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ProductComponent } from './product.component';

// describe('ProductComponent', () => {
//   let component: ProductComponent;
//   let fixture: ComponentFixture<ProductComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ProductComponent]
//     })
//     .compileComponents();
    
//     fixture = TestBed.createComponent(ProductComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { of } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    const productServiceMock = {
      findProduct: jasmine.createSpy('findProduct').and.returnValue(of([{
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        logo: 'Test Logo',
        date_release: new Date(),
        date_revision: new Date(),
      }])),
    };

    await TestBed.configureTestingModule({
      declarations: [ ProductComponent ],
      providers: [{ provide: ProductService, useValue: productServiceMock }]
    })
    .compileComponents();

    productService = TestBed.inject(ProductService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable id field if there is id input', () => {
    component.id = '1';
    component.ngOnInit();
    expect(component.myForm?.get('id')?.disabled).toBe(true);
  });
});
