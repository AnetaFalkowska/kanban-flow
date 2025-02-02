import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableHeaderComponent } from './editable-header.component';

describe('EditableHeaderComponent', () => {
  let component: EditableHeaderComponent;
  let fixture: ComponentFixture<EditableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
