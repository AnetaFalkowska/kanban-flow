import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControl,
  NgForm,
} from '@angular/forms';
import { BoardService } from '../../shared/board.service';
import { Board } from '../../shared/board.model';
import { Column } from '../../shared/column.model';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-add-board',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.scss',
})
export class AddBoardComponent implements OnInit {
  columns: { name: string; taskLimit?: number }[] = [
    { name: 'Todo' },
    { name: 'In progress' },
    { name: 'Done' },
  ];

  boardForm!: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private boardService: BoardService,
    private route: Router
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

  get items(): FormArray {
    return <FormArray>this.boardForm?.get('items');
  }

  populateExistingData() {
    this.columns.forEach((c) => this.items.push(this.createExistingItem(c)));
  }

  createExistingItem(column: any): AbstractControl {
    return new FormGroup({
      columnName: new FormControl(column.name, Validators.required),
      taskLimit: new FormControl(column.taskLimit || null),
    });
  }

  createItem(): FormGroup {
    return new FormGroup({
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

  onAddBoard(form: FormGroup<any>) {
    const { boardName, items } = form.value;

    const columns = items.map(
      (item: any) =>
        new Column(item.columnName, [], item.taskLimit || undefined)
    );

    this.boardService.addBoard(new Board(boardName, columns));
    this.route.navigateByUrl('');
  }
}
