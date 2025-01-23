import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private currentTaskContext$ = new BehaviorSubject<{boardId:string | null, columnId:string} | null>(null)

  get currentTaskCtx() {
    return this.currentTaskContext$.asObservable()
  }

  constructor() { }


  setTaskContext(boardId:string | null, columnId:string): void {
    this.currentTaskContext$.next({boardId, columnId})
  }

  clearTaskContext():void {
    this.currentTaskContext$.next(null)
  }
  
}
