import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StateService } from './state.service';
import { Task } from '../../api/task.model';
import { TaskViewComponent } from '../../shared/task-view/task-view.component';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private readonly dialog: MatDialog,
      private readonly router: Router,
      private readonly stateService: StateService) { }

  openTaskDialog(task: Task, boardId?: string, columnId?: string, source?: string): void {
    const dialogRef = this.dialog.open(TaskViewComponent, {
      data: { task, source },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true && boardId && columnId) {
        this.stateService.setTaskContext(boardId, columnId);
        this.router.navigate([`/tasks/${task.id}/edit`], {
          queryParams: { source }
        });
      }
      if (result === 'openBoard' && boardId && columnId) {
        this.stateService.setHighlightedTask(columnId, task.id)
        this.router.navigate([`/${boardId}`]);
      }
    });
  }

  openConfirmationDialog(name:string, onConfirm: () => void) {
 
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
        data: { name },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          onConfirm();
        }
      });
    
  }
}
