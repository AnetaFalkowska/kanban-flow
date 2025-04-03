import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-intro-dialog',
  imports: [],
  templateUrl: './intro-dialog.component.html',
  styleUrl: './intro-dialog.component.scss',
  animations: [
      trigger('introAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('200ms ease-out', style({ opacity: 1 })),
        ]),
        transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
      ]),
    ],
})
export class IntroDialogComponent {
  @Output() emitCloseIntro: EventEmitter<'quickGuide' | null> = new EventEmitter<'quickGuide' | null>();

  closeIntro(openDialog?: 'quickGuide') {
    this.emitCloseIntro.emit(openDialog || null);
  }

}
