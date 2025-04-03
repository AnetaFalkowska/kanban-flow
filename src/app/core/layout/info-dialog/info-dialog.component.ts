import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  imports: [],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
  
})
export class InfoDialogComponent {
  @Output() emitCloseQuickGuide: EventEmitter<'quickGuide' | null> = new EventEmitter<'quickGuide' | null>();

  closeQuickGuide() {
    this.emitCloseQuickGuide.emit(null);
  }
}
