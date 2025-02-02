import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-editable-header',
  imports: [FormsModule],
  templateUrl: './editable-header.component.html',
  styleUrl: './editable-header.component.scss',
})
export class EditableHeaderComponent {
  @Input() name: string = '';
  showValidationErrors: boolean = false;
  editMode: boolean = false;

  @Output() deleteClick: EventEmitter<void> = new EventEmitter<any>();
  @Output() saveEdit: EventEmitter<string> = new EventEmitter<string>();

  onEditClick() {
    this.editMode = true;
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }

  onSaveEdit() {
    this.saveEdit.emit(this.name);
    this.editMode = false;
  }
  onCancelEdit() {
    this.editMode = false;
  }
}
