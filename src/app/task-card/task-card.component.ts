import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Task } from '../shared/task.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskViewComponent } from '../task-view/task-view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-card',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input() task?: Task;

  @Output() editClick:EventEmitter<void> = new EventEmitter<any>();
  @Output() deleteClick:EventEmitter<void> = new EventEmitter<any>();

  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  openDialog() {
    const dialogRef = this.dialog.open(TaskViewComponent, {
      data: { task: this.task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate([`/tasks/${this.task?.id}/edit`]);
    });
  }

  f() {
    console.log("clicked")
  }

  onEditClick() {
    this.editClick.emit();
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }
}
