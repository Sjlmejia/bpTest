import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalComponent],
    });

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'Test Logo',
      date_release: new Date(),
      date_revision: new Date(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit handleDelete event on closeModal', () => {
    const isDelete = true;
    const emitSpy = jest.spyOn(component.handleDelete, 'emit');

    component.closeModal(isDelete);

    const expectedResponse = {
      showModal: false,
      isDelete: isDelete,
      product: component.product,
    };

    expect(emitSpy).toHaveBeenCalledWith(expectedResponse);
  });

  it('should close modal when clicking outside of it', () => {
    const closeModalSpy = jest.spyOn(component, 'closeModal');

    const modalBackdrop = document.createElement('div');

    const mockEvent = {
      target: modalBackdrop,
      currentTarget: modalBackdrop
    } as unknown as Event;

    component.onBackdropClick(mockEvent);

    expect(closeModalSpy).toHaveBeenCalled();
  });


  it('should not close modal when clicking inside modal-content', () => {
    const closeModalSpy = jest.spyOn(component, 'closeModal');

    const modalContent = document.createElement('div');
    const modalContainer = document.createElement('div');

    modalContainer.appendChild(modalContent);

    const mockEvent = {
      target: modalContent,
      currentTarget: modalContainer
    } as unknown as Event;

    component.onBackdropClick(mockEvent);

    expect(closeModalSpy).not.toHaveBeenCalled();
  });
});
