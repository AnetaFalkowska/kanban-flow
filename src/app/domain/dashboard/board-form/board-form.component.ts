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
import { BoardService } from '../../../api/board.service';
import { Board } from '../../../api/board.model';
import { Column } from '../../../api/column.model';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-board-form',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './board-form.component.html',
  styleUrl: './board-form.component.scss',
})
export class BoardFormComponent implements OnInit, OnDestroy {
  boardForm!: FormGroup;
  unsubscribe$ = new Subject<void>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly boardService: BoardService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.boardForm = this.formBuilder.group({
      boardName: ['', [Validators.required, Validators.minLength(3)]],
      columns: this.formBuilder.array(
        ['Todo', 'In progress', 'Done'].map(
          (name) => new FormControl(name, Validators.required)
        )
      ),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get columns(): FormArray {
    return this.boardForm?.get('columns') as FormArray;
  }

  addColumn() {
    this.columns.push(new FormControl('', Validators.required));
    this.boardForm.markAsDirty();
    this.columns.markAsDirty();
  }

  removeColumn(index: number): void {
    this.columns.removeAt(index);
    this.boardForm.markAsDirty();
    this.columns.markAsDirty();
  }

  isFormValid(): boolean {
    return this.boardForm.valid && this.boardForm.dirty;
  }

  validateField(column: any): boolean {
    return !column.valid && (column.dirty || column.touched);
  }

  onSubmit() {
    const { boardName, columns } = this.boardForm.value;
    const boardColumns = columns.map((column: string) => new Column(column));

    this.boardService
      .addBoard(new Board(boardName, boardColumns))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          console.log('Board added');
          this.router.navigateByUrl('');
        },
        error: (err) => console.error('Error adding board:', err),
      });
  }
}

// columns: Column[] = [
//   new Column('Todo'),
//   new Column('In progress'),
//   new Column('Done')
// ];

// boardForm!: FormGroup;
// unsubscribe$ = new Subject<void>();

// constructor(
//   private readonly formBuilder: FormBuilder,
//   private readonly boardService: BoardService,
//   private readonly router: Router,
//   private readonly route: ActivatedRoute
// ) {}

// ngOnInit(): void {
//   this.boardForm = this.formBuilder.group({
//     boardName: new FormControl('', [
//       Validators.required,
//       Validators.minLength(3),
//     ]),
//     items: this.formBuilder.array([], this.uniqueColumnNames),
//   });

//   this.populateExistingData();
// }

// ngOnDestroy(): void {
//   this.unsubscribe$.next();
//   this.unsubscribe$.complete();
// }

// get items(): FormArray {
//   return <FormArray>this.boardForm?.get('items');
// }

// populateExistingData() {
//   this.columns.forEach((c) => this.items.push(this.createExistingItem(c)));
// }

// createExistingItem(column: any): AbstractControl {
//   return new FormGroup({
//     columnId: new FormControl(column.id || ''),
//     columnName: new FormControl(column.name, Validators.required),
//     taskLimit: new FormControl(column.taskLimit || null),
//   });
// }

// createItem(): FormGroup {
//   return new FormGroup({
//     columnId: new FormControl(''),
//     columnName: new FormControl('', Validators.required),
//     taskLimit: new FormControl(null),
//   });
// }

// uniqueColumnNames(formArray: AbstractControl): { [key: string]: any } | null {
//   const columnNames = (formArray as FormArray).controls.map((control) =>
//     control.get('columnName')?.value.trim().toLowerCase()
//   );
//   const hasDuplicates = new Set(columnNames).size !== columnNames.length;
//   return hasDuplicates ? { nonUniqueNames: true } : null;
// }

// isFormValid(): boolean {
//   return this.boardForm.valid && this.boardForm.dirty;
// }

// validateField(item: any): boolean {
//   return !item.valid && (item.dirty || item.touched);
// }

// addItem() {
//   this.items.push(this.createItem());
//   this.boardForm.markAsDirty();
//   this.items.markAsDirty();
// }

// removeItem(index: number): void {
//   this.items.removeAt(index);
//   this.boardForm.markAsDirty();
//   this.items.markAsDirty();
// }

// onSubmit(form: FormGroup<any>) {
//   const { boardName, items } = form.value;
//   const columns = items.map(
//     (item: any) =>
//       new Column(item.columnName, [], item.taskLimit || undefined)
//   );
//   this.boardService
//     .addBoard(new Board(boardName, columns))
//     .pipe(takeUntil(this.unsubscribe$))
//     .subscribe({
//       next: () => {
//         console.log('Board added');
//         this.router.navigateByUrl('');
//       },
//       error: (err) => console.error('Error adding board:', err),
//     });
// }
