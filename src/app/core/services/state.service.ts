import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private currentTaskContext$ = new BehaviorSubject<{boardId:string | null, columnId:string | null} | null>(null)

  get currentTaskCtx() {
    return this.currentTaskContext$.asObservable()
  }

  constructor() { }

  setTaskContext(boardId:string | null, columnId:string | null): void {
    this.currentTaskContext$.next({boardId, columnId})
  }

  setBoardId(boardId: string | null): void {
    const currentContext = this.currentTaskContext$.getValue();
    this.currentTaskContext$.next({ boardId, columnId: currentContext?.columnId ?? null });
  }

  setColumnId(columnId:string | null): void {
    const currentContext = this.currentTaskContext$.getValue()
    this.currentTaskContext$.next({boardId: currentContext?.boardId ?? null, columnId})
  }

  getTaskContext(): { boardId: string | null, columnId: string | null } | null {
    return this.currentTaskContext$.getValue();
  }

  clearTaskContext():void {
    this.currentTaskContext$.next(null)
  }
  
}
