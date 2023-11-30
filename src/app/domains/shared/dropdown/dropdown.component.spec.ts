import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { EventEmitter } from '@angular/core';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DropdownComponent],
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
});
