import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input('data') data : any;
  @Input('parentControl') parentControl: AbstractControl;
  @Output() optionSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  private searchValue;
  constructor() { }

  ngOnInit(): void {
    this.parentControl.valueChanges.subscribe(val => {
      this.searchValue = val;
    });
  }

  public getSearchValue() {
    return this.searchValue;
  }

  public updateControlVal(val) {
    this.parentControl.patchValue(val);
    this.optionSelected.emit(false);
  }

}
