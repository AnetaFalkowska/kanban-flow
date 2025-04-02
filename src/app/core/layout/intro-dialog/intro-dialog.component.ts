import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-intro-dialog',
  imports: [],
  templateUrl: './intro-dialog.component.html',
  styleUrl: './intro-dialog.component.scss',
  animations: [
      trigger('introlAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('200ms ease-out', style({ opacity: 1 })),
        ]),
        transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
      ]),
    ],
})
export class IntroDialogComponent {
  @Input() isIntroVisible: boolean = false;
  @Output() emitCloseIntro: EventEmitter<boolean> = new EventEmitter<boolean>();

  closeIntro(openQuickGuide: boolean = false) {
    this.emitCloseIntro.emit(openQuickGuide);
  }

}
