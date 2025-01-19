import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { Board } from '../../shared/board.model';
import { BoardService } from '../../shared/board.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-view',
  imports: [ColumnComponent, DragDropModule],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
})
export class BoardViewComponent implements OnInit, OnDestroy {
  public board?: Board;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap

      .subscribe((paramMap: ParamMap) => {
        const idParam = paramMap.get('id');
        if (idParam) this.board = this.boardService.getBoard(idParam);

      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // board = {
  //   name: 'example',
  //   columns: [
  //     {
  //       id:"1",
  //       name: 'todo',
  //       tasks: [{id:"3", name:'Get to work'}, {id:"4", name:'Pick up groceries'}, {id:"5", name: 'Go home'}],
  //     },
  //     {
  //       id:"2",
  //       name: 'done',
  //       tasks: [{id:"6", name:'Get up'}, {id:"7", name: 'Brush teeth'}, {id:"8", name: 'Take a shower'}, {id:"9", name: 'Check e-mail'}, {id:"10", name: 'Walk dog'}],
        
  //     },
  //   ],
  // };

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
