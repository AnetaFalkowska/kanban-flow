import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-delete-button',
  imports: [],
  templateUrl: './edit-delete-button.component.html',
  styleUrl: './edit-delete-button.component.scss',
})
export class EditDeleteButtonComponent {
  @Output() editClick: EventEmitter<void> = new EventEmitter<any>();
  @Output() deleteClick: EventEmitter<void> = new EventEmitter<any>();

  onEditClick() {
    this.editClick.emit();
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }
}
