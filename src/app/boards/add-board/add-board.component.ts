import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';


@Component({
  selector: 'app-add-board',
  imports: [ReactiveFormsModule],
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.boardForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      items: this.formBuilder.array([]),
    });

    this.populateExistingData();
  }

  get items(): FormArray {
    return <FormArray>this.boardForm?.get('items');
  }

  populateExistingData() {
    this.columns.forEach((c) =>
      this.items.push(this.createExistingItem(c))
    );
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
      taskLimit: new FormControl(null)
    });
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
    console.log(this.getFormData());
  }

  getFormData() {
    const finalData = <{ name: string; taskLimit?: number }[]>this.boardForm.value.items;
    return finalData;
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.boardForm.markAsDirty();
    this.items.markAsDirty();
  }

}
