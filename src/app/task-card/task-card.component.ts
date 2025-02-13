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
import { StateService } from '../shared/state.service';

@Component({
  selector: 'app-task-card',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input() task?: Task;
  @Input() columnId?: string;

  @Output() editClick: EventEmitter<void> = new EventEmitter<any>();
  @Output() deleteClick: EventEmitter<void> = new EventEmitter<any>();

  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  constructor(private readonly stateService: StateService) {}

  openDialog() {
    if (this.columnId) this.stateService.setColumnId(this.columnId);

    const dialogRef = this.dialog.open(TaskViewComponent, {
      data: { task: this.task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.router.navigate([`/tasks/${this.task?.id}/edit`]);
      }
    });
  }

  onEditClick() {
    this.editClick.emit();
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }
}
