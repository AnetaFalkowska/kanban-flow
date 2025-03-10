import {Injectable } from '@angular/core';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string, action?: string, duration: number = 1500, undoCallback?: () => void) {
    const snackBarRef =   this._snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'end', 
      verticalPosition: 'bottom', 
      // panelClass: ['custom-snackbar'] 
    })
    snackBarRef.onAction().subscribe(() => {
      if (action === "Undo" && undoCallback) {
        undoCallback();
      }
    });
  }
}
