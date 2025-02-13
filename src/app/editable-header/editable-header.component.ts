import { NgClass } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';


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
  readonly dialog = inject(MatDialog);

  @Output() deleteClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() saveEdit: EventEmitter<string> = new EventEmitter<string>();

  
  openDialog() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { name: this.boardStyle ? 'board' : 'column' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteClick.emit();
      }
    });
  }

  onEditClick() {
    this.tempName = this.name;
    this.editMode = true;
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
