import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { ElementRef } from '@angular/core';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let elementRefMock: ElementRef;

  beforeEach(() => {
    elementRefMock = {
      nativeElement: document.createElement('div')
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, DropdownComponent],
      providers: [
        { provide: ElementRef, useValue: elementRefMock }
      ]
    });

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit event on goToEdit', () => {
    const id = 'testId';
    const emitSpy = jest.spyOn(component.edit, 'emit');

    component.goToEdit(id);

    expect(emitSpy).toHaveBeenCalledWith(id);
    expect(component.isOpen()).toBe(false);
  });

  it('should emit delete event on goToDelete', () => {
    const id = 'testId';
    const emitSpy = jest.spyOn(component.delete, 'emit');

    component.goToDelete(id);

    expect(emitSpy).toHaveBeenCalledWith(id);
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle isOpen on toggleDropdown', () => {
    expect(component.isOpen()).toBe(false);

    component.toggleDropdown();
    expect(component.isOpen()).toBe(true);

    component.toggleDropdown();
    expect(component.isOpen()).toBe(false);
  });

  it('should close dropdown when clicking outside', () => {
    const event = new Event('click');
    jest.spyOn(component, 'closeDropdown');

    document.dispatchEvent(event);

    expect(component.closeDropdown).toHaveBeenCalled();
  });

  it('should not close dropdown when clicking inside', () => {
    jest.spyOn(component, 'closeDropdown');

    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: elementRefMock.nativeElement });

    component.closeDropdown(event);

    expect(component.isOpen()).toBe(false);
  });
});
