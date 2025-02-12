import { NgClass } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-editable-header',
  imports: [FormsModule, NgClass],
  templateUrl: './editable-header.component.html',
  styleUrl: './editable-header.component.scss',
})
export class EditableHeaderComponent {
  @Input() name: string = '';
  @Input() boardStyle: boolean = false;
  editMode: boolean = false;
  tempName: string = '';
  showValidationErrors: boolean = false;


  @Output() deleteClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() saveEdit: EventEmitter<string> = new EventEmitter<string>();


  onEditClick() {
    this.tempName = this.name;
    this.editMode = true;
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }

  onSaveEdit(nameField: NgModel) {
    if (!this.editMode) return;
    if (nameField.invalid) {
      this.showValidationErrors = true;
      return;
    }
    console.log('saving');
    this.showValidationErrors = false;
    this.saveEdit.emit(this.tempName);
    this.name = this.tempName;
    this.editMode = false;
  }

  onCancelEdit() {
    this.editMode = false;
    this.showValidationErrors = false;
  }
}
