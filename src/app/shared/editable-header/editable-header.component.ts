import { NgClass } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogService } from '../../core/services/dialog.service';

@Component({
  selector: 'app-editable-header',
  imports: [FormsModule, NgClass],
  templateUrl: './editable-header.component.html',
  styleUrl: './editable-header.component.scss',
})
export class EditableHeaderComponent implements AfterViewChecked {
  @Input() name: string = '';
  @Input() boardStyle: boolean = false;
  editMode: boolean = false;
  tempName: string = '';
  showValidationErrors: boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly dialogService: DialogService
  ) {}

  @Output() deleteClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() saveEdit: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.editMode && !this.isClickInsideInput(event)) {
      this.onCancelEdit();
    }
  }

  ngAfterViewChecked(): void {
    if (this.editMode) {
      setTimeout(() => {
        const inputElement = document.querySelector('.edit-name') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus(); 
        }
      }, 0); 
    }
  }

  isClickInsideInput(event: MouseEvent): boolean {
    const clickedElement = event.target as HTMLElement;
    const nameInput = document.querySelector('.edit-mode');
    return nameInput?.contains(clickedElement) ?? false;
  }

  openDialog() {
    this.dialogService.openConfirmationDialog(`column ${this.name}`, () =>
      this.deleteClick.emit()
    );
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
    this.showValidationErrors = false;
    this.editMode = false;
  }

  onBlur() {
    setTimeout(() => this.onCancelEdit(), 100);

  }
}
