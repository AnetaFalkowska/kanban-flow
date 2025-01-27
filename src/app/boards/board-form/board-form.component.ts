import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { BoardService } from '../../shared/board.service';
import { Board } from '../../shared/board.model';
import { Column } from '../../shared/column.model';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { JsonPipe } from '@angular/common';
import { Subject, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-board-form',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './board-form.component.html',
  styleUrl: './board-form.component.scss',
})
export class BoardFormComponent implements OnInit, OnDestroy {
  columns: { name: string; taskLimit?: number }[] = [
    { name: 'Todo' },
    { name: 'In progress' },
    { name: 'Done' },
  ];

  boardForm!: FormGroup;
  editMode: boolean = false;
  boardId: string | null = null;
  unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramMap: ParamMap) => {
        this.boardId = paramMap.get('id');
        this.editMode = !!this.boardId;
      });

    this.boardForm = this.formBuilder.group({
      boardName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      items: this.formBuilder.array([], this.uniqueColumnNames),
    });

    this.populateExistingData();
  }

  get items(): FormArray {
    return <FormArray>this.boardForm?.get('items');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(), this.unsubscribe$.complete();
  }

  populateExistingData() {
    if (!this.editMode) {
      this.columns.forEach((c) => this.items.push(this.createExistingItem(c)));
    } else if (this.boardId) {
      this.boardService
        .getBoard(this.boardId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (board) => {
            console.log('Board data:', board);
            if (!board) {
              console.error('Board not found!');
              return;
            }
            board.columns.forEach((c) =>
              this.items.push(this.createExistingItem(c))
            );
            this.boardForm.patchValue({
              boardName: board.name,
            });
          },
          error: (error) => {
            console.error('Error fetching board:', error);
          },
        });
    }
  }

  createExistingItem(column: any): AbstractControl {
    return new FormGroup({
      columnId: new FormControl(column.id || ''),
      columnName: new FormControl(column.name, Validators.required),
      taskLimit: new FormControl(column.taskLimit || null),
    });
  }

  createItem(): FormGroup {
    return new FormGroup({
      columnId: new FormControl(''),
      columnName: new FormControl('', Validators.required),
      taskLimit: new FormControl(null),
    });
  }

  uniqueColumnNames(formArray: AbstractControl): { [key: string]: any } | null {
    const columnNames = (formArray as FormArray).controls.map((control) =>
      control.get('columnName')?.value.trim().toLowerCase()
    );
    const hasDuplicates = new Set(columnNames).size !== columnNames.length;
    return hasDuplicates ? { nonUniqueNames: true } : null;
  }

  isFormValid(): boolean {
    return this.boardForm.valid && this.boardForm.dirty;
  }

  validateField(item: any): boolean {
    return !item.valid && (item.dirty || item.touched);
  }

  addItem() {
    this.items.push(this.createItem());
    this.boardForm.markAsDirty();
    this.items.markAsDirty();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.boardForm.markAsDirty();
    this.items.markAsDirty();
  }

  onSubmit(form: FormGroup<any>) {
    if (this.boardId) {
      this.boardService
        .updateBoard(this.boardId, form.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.router.navigate([`/${this.boardId}`]);
          },
        });
    } else if (!this.editMode) {
      const { boardName, items } = form.value;
      const columns = items.map(
        (item: any) => new Column(item.columnName, [], item.taskLimit || null)
      );
      const newBoard = new Board(boardName, columns);
      this.boardService
        .addBoard(newBoard)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (id: string) => {
            this.router.navigateByUrl('');
          },
        });
    }
  }

  deleteBoard() {
    if (this.boardId) {
      return;
      // this.boardService.deleteBoard(this.boardId);
      // this.router.navigateByUrl('');
    }
  }
}
