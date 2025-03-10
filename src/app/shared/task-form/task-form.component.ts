import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../api/task.service';
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
import { Task } from '../../api/task.model';
import { StateService } from '../../core/services/state.service';
import { of, Subject, switchMap, takeUntil } from 'rxjs';


@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  boardId: string | null = null;
  columnId: string | null = null;
  taskId: string | null = null;
  task: Task | null = null;
  priorityOptions = [null, 'low', 'medium', 'high'];
  source: string | null = null;
  unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private stateService: StateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((params) => {
          const taskContext = this.stateService.getTaskContext();
          this.boardId = params['boardId'] ?? taskContext?.boardId ?? null;
          this.columnId = params['columnId'] ?? taskContext?.columnId ?? null;
          this.source = params['source'] ?? null;
          this.taskId = this.route.snapshot.paramMap.get('taskId');
          if (!this.boardId || !this.columnId || !this.taskId) {
            return of(null);
          }

          return this.taskService
            .getTask(this.boardId, this.columnId, this.taskId)
            .pipe(takeUntil(this.unsubscribe$));
        })
      )
      .subscribe((task) => {
        this.task = task;
        this.populateExistingData();
      });
  }

  ngOnDestroy(): void {
    this.stateService.clearTaskContext();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [''],
      duedate: ['', this.dateNotInPast],
      completed: [false],
    });
  }

  dateNotInPast(control: FormControl): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const inputDate = new Date(control.value);
    if (inputDate < currentDate) {
      return { dateInPast: true };
    }
    return null;
  }

  populateExistingData() {
    if (this.task) {
      this.taskForm.patchValue({
        name: this.task.name,
        description: this.task.description ?? '',
        priority: this.task.priority ?? '',
        duedate: this.task.duedate ?? '',
        completed: this.task.completed ?? false,
      });
    }
  }

  isFormValid(): boolean {
    return this.taskForm.valid && !this.taskForm.pristine;
  }

  onSubmit(form: FormGroup<any>): void {
    if (!this.boardId || !this.columnId) {
      console.error('Missing boardId or columnId');
      return;
    }

    const { name, description, priority, duedate, completed } = form.value;

    this.taskId
      ? this.updateTask(name, description, priority, duedate, completed)
      : this.createTask(name, description, priority, duedate);
  }

  private updateTask(
    name: string,
    description: string,
    priority: 'low' | 'medium' | 'high' | undefined,
    duedate: string,
    completed: boolean
  ) {
    this.taskService
      .updateTask(this.boardId!, this.columnId!, this.taskId!, {
        name,
        description,
        priority,
        duedate,
        completed,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {if (this.source) {
          this.router.navigate([`/${this.source}`]);
        } else this.router.navigate([`/${this.boardId}`]);},
        error: (err) => console.error('Task update failed', err),
      });
  }

  private createTask(
    name: string,
    description: string,
    priority: 'low' | 'medium' | 'high' | undefined,
    duedate: string
  ) {
    const newTask = new Task({ name, description, priority, duedate });
    this.taskService
      .addTask(this.boardId!, this.columnId!, newTask)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {if (this.source) {
          this.router.navigate([`/${this.source}`]);
        } else this.router.navigate([`/${this.boardId}`]);},
        error: (err) => console.error('Adding task failed', err),
      });
  }

  onCancel() {
    if (this.source) {
      this.router.navigate([`/${this.source}`]);
    } else this.router.navigate([`/${this.boardId}`]);
  }

  deleteTask() {
    if (!this.boardId || !this.columnId || !this.taskId) {
      console.error('Cannot delete task - missing IDs');
      return;
    }

    this.taskService
      .deleteTask(this.boardId, this.columnId, this.taskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {if (this.source) {
        this.router.navigate([`/${this.source}`]);
      } else this.router.navigate([`/${this.boardId}`]);
      });
  }
}

// ngOnInit(): void {
//   this.initializeForm();

//   combineLatest([this.route.paramMap, this.stateService.currentTaskCtx])
//     .pipe(
//       takeUntil(this.unsubscribe$),
//       switchMap(([paramMap, context]) => {

//         if (!context || !context.boardId || !context.columnId) {
//           console.log('missing');

//           this.router.navigate(['../../'], { relativeTo: this.route });
//           return of(null);
//         }

//         const { boardId, columnId } = context;
//         this.boardId = boardId;
//         this.columnId = columnId;
//         this.taskId = paramMap.get('taskId');
//         console.log('on init: ', this.boardId, this.columnId, this.taskId);

//         return this.boardId && this.columnId && this.taskId
//           ? this.taskService.getTask(this.boardId, this.columnId, this.taskId)
//           : of(null);
//       })
//     )
//     .subscribe((task) => {
//       this.task = task;

//       this.populateExistingData();
//     });
// }
