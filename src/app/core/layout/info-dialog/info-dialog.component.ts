import { animate, style, transition, trigger } from '@angular/animations';

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  imports: [],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
  animations: [
    trigger('quickGuideAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class InfoDialogComponent {
  @Input() isQuickGuideVisible: boolean = false;
  @Output() emitCloseQuickGuide: EventEmitter<void> = new EventEmitter<void>();

  closeQuickGuide() {
    this.isQuickGuideVisible = false;
    this.emitCloseQuickGuide.emit();
  }
}
