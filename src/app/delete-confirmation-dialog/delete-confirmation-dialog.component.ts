import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [MatDialogModule],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss',
})
export class DeleteConfirmationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteConfirmationDialogComponent>);
  readonly data = inject<{ name:string  }>(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close();
  }
}
