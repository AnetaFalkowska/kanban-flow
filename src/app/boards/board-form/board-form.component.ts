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
import { Subject, takeUntil } from 'rxjs';

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
  unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.boardForm = this.formBuilder.group({
      boardName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      items: this.formBuilder.array([], this.uniqueColumnNames),
    });

    this.populateExistingData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get items(): FormArray {
    return <FormArray>this.boardForm?.get('items');
  }

  populateExistingData() {
    this.columns.forEach((c) => this.items.push(this.createExistingItem(c)));
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
    const { boardName, items } = form.value;
    const columns = items.map(
      (item: any) =>
        new Column(item.columnName, [], item.taskLimit || undefined)
    );
    this.boardService
      .addBoard(new Board(boardName, columns))
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
