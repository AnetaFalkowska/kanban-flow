import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../shared/task.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Task } from '../shared/task.model';
import { StateService } from '../shared/state.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  editMode: boolean = false;
  boardId: string | null = null;
  columnId: string | null = null;
  taskId: string | null = null;
  task?: Task;
  unsubscribe$ = new Subject<void>()

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private stateService: StateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    combineLatest([
      this.route.paramMap,
      this.stateService.currentTaskCtx,
    ]).
    pipe(takeUntil(this.unsubscribe$)).
    subscribe(([paramMap, context]) => {
      this.taskId = paramMap.get('taskId');
      if (context && this.taskId) {
        const { boardId, columnId } = context;
        if (boardId && columnId) {
          this.boardId = boardId;
          this.columnId = columnId;
          this.task = this.taskService.getTask(
            this.boardId,
            this.columnId,
            this.taskId
          );
          this.editMode = !!this.task;
          this.populateExistingData();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.stateService.clearTaskContext();
    this.unsubscribe$.next();
    this.unsubscribe$.complete()
  }

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  populateExistingData() {
    if (this.task) {
      this.taskForm.patchValue({
        name: this.task?.name,
      });
    }
  }

  isFormValid(): boolean {
    return this.taskForm.valid && !this.taskForm.pristine;
  }

  onSubmit(form: FormGroup<any>): void {
    if (!this.boardId || !this.columnId) return;

    const taskData = form.value;
    if (this.editMode && this.taskId) {
      this.taskService.updateTask(
        this.boardId,
        this.columnId,
        this.taskId,
        taskData
      );
    } else {
      this.taskService.addTask(
        this.boardId,
        this.columnId,
        new Task(taskData.name)
      );
    }
    this.router.navigate([`/${this.boardId}`]);
  }

  deleteTask() {
    if (this.boardId && this.columnId && this.taskId) {
      this.taskService.deleteTask(this.boardId, this.columnId, this.taskId);
      this.router.navigate([`/${this.boardId}`]);
    }
  }
}
