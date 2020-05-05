import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteComponent } from './autocomplete.component';
import { FormControl } from '@angular/forms';
import { SearchPipe } from '../search.pipe';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteComponent, SearchPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.parentControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show panel if no option is selected when user starts typing in the input box', () => {
    component.parentControl.setValue('some value');
    expect(component.showPanel).toBeTruthy();
  });

  it('should set input box value to the option selected from autocomplete drodpwn and hide dropdown when user selects an option', () => {
    component.updateControlVal('some value');
    expect(component.showPanel).toBeFalsy();
    expect(component.parentControl.value).toBe('some value');
  });

  it('should return search value', () => {
    component.parentControl.setValue('some value');
    expect(component.getSearchValue()).toBe('some value');
  });

  it('should hide autocomplete dropdown when close panel is triggered on clickin outside', () => {
    component.closePanel();
    expect(component.showPanel).toBeFalsy();
  });
});
