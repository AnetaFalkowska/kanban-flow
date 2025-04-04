import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, UrlSegment } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map, Observable, timer } from 'rxjs';
import { TaskService } from './api/task.service';
import { DialogService } from './core/services/dialog.service';
import { InfoDialogComponent } from './core/layout/info-dialog/info-dialog.component';
import { IntroDialogComponent } from './core/layout/intro-dialog/intro-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    RouterModule,
    AsyncPipe,
    DatePipe,
    IntroDialogComponent,
    InfoDialogComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeAnimations', [
      transition('*=>*', [
        style({ position: 'relative', overflow: 'hidden' }),
        query(
          ':enter',
          [
            style({
              transform: 'scale(0.98)',
              opacity: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }),
            animate(
              '350ms 100ms ease-out',
              style({ transform: 'scale(1)', opacity: 1 })
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
      transition('intro => quickGuide, mobileNotice <=> intro, quickGuide => intro', [
        group([
          query(':leave', [animate('100ms ease-in', style({ opacity: 0 }))], {
            optional: true,
          }),
          query(
            ':enter',
            [
              style({ opacity: 0 }),
              animate('200ms ease-out', style({ opacity: 1 })),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'kanban-flow';
  dateTime!: Observable<Date>;
  visibleDialog: 'intro' | 'quickGuide' | 'mobileNotice' | null = null;
  isIntroBlocked: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  constructor(
    private readonly taskService: TaskService,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit() {
    this.dateTime = timer(0, 1000).pipe(
      map(() => {
        const now = new Date();

        if (
          now.getHours() === 0 &&
          now.getMinutes() === 0 &&
          now.getSeconds() === 0
        ) {
          this.taskService.countOverdueTasks();
        }

        return now;
      })
    );
    this.checkScreenSize();
    setTimeout(() => {
      if (this.visibleDialog !== 'mobileNotice') {
        this.visibleDialog = 'intro';
      } else {
        this.isIntroBlocked = true;
      }
    }, 1000);
  }

  checkScreenSize() {
    if (window.innerWidth <= 1024) {
      this.visibleDialog = 'mobileNotice';
    } else if (this.visibleDialog === 'mobileNotice') {
      this.visibleDialog = null;

      if (this.isIntroBlocked) {
        this.visibleDialog = 'intro';
        this.isIntroBlocked = false;
      }
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    if (outlet.isActivated) {
      // transition for the secondary view:
      // const tab = outlet.activatedRouteData['tab'];
      // const boardView = outlet.activatedRouteData['boardView'];
      // if (!tab && !boardView) return 'secondary';
      // if (boardView) return 'board-view';
      // return tab;
      return outlet.activatedRoute.snapshot.url;
    }
    return null;
  }

  showInfoDialog() {
    this.visibleDialog = 'quickGuide';
  }

  closeDialog(openDialog: 'quickGuide' | null) {
    this.visibleDialog = openDialog;
  }
}

// translate for the router outlet
// animations: [
//   trigger('routeAnimations', [
//     transition(':increment', [
//       style({ position: 'relative', overflow: 'hidden' }),
//       query(
//         ':enter, :leave',
//         [
//           style({
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//           }),
//         ],
//         { optional: true }
//       ),
//       query(':enter', [style({ opacity: 0 })], { optional: true }),
//       group([
//         query(
//           ':leave',
//           [
//             animate(
//               '200ms ease-in',
//               style({ transform: 'translateX(-40px)', opacity: 0 })
//             ),
//           ],
//           { optional: true }
//         ),
//         query(
//           ':enter',
//           [
//             style({ transform: 'translateX(40px)' }),
//             animate(
//               '250ms 200ms ease-out',
//               style({ transform: 'translateX(0)', opacity: 1 })
//             ),
//           ],
//           { optional: true }
//         ),
//       ]),
//     ]),
//     transition(':decrement', [
//       style({ position: 'relative', overflow: 'hidden' }),
//       query(
//         ':enter, :leave',
//         [
//           style({
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//           }),
//         ],
//         { optional: true }
//       ),
//       query(':enter', [style({ opacity: 0 })], { optional: true }),
//       group([
//         query(
//           ':leave',
//           [
//             animate(
//               '200ms ease-in',
//               style({ transform: 'translateX(40px)', opacity: 0 })
//             ),
//           ],
//           { optional: true }
//         ),
//         query(
//           ':enter',
//           [
//             style({ transform: 'translateX(-40px)' }),
//             animate(
//               '250ms 150ms ease-out',
//               style({ transform: 'translateX(0)', opacity: 1 })
//             ),
//           ],
//           { optional: true }
//         ),
//       ]),
//     ]),
//   ]),
// ],

// transitions for the secondary view

// transition('*=>secondary', [
//   style({
//      position: 'relative',
//     }),
//   query(
//     ':enter, :leave',
//     [
//       baseStyles,
//     ],
//     { optional: true }
//   ),
//   query(':enter', [style({ opacity: 0 })], { optional: true }),
//   group([
//     query(
//       ':leave',
//       [
//         animate(
//           '200ms ease-in',
//           style({ opacity: 0, transform: 'scale(0.95)' })
//         ),
//       ],
//       {
//         optional: true,
//       }
//     ),
//     query(
//       ':enter',
//       [
//         style({ transform: 'scale(1.05)' }),
//         animate(
//           '250ms 120ms ease-out',
//           style({ opacity: 1, transform: 'scale(1)' })
//         ),
//       ],
//       {
//         optional: true,
//       }
//     ),
//   ]),
// ]),
// transition('secondary=>*', [
//   style({
//      position: 'relative',
//     // overflow can't be hidden, otherwise only content of the box will sacle down, while the whole box is the same size during the animation
//     //  overflow: 'hidden'
//     }),
//   query(
//     ':enter, :leave',
//     [
//       baseStyles,
//     ],
//     { optional: true }
//   ),
//   query(':enter', [style({ opacity: 0 })], { optional: true }),
//   group([
//     query(
//       ':leave',
//       [
//         animate(
//           '200ms ease-in',
//           style({ opacity: 0, transform: 'scale(1.05)' })
//         ),
//       ],
//       {
//         optional: true,
//       }
//     ),
//     query(
//       ':enter',
//       [
//         style({ transform: 'scale(0.98)' }),
//         animate(
//           '250ms 120ms ease-out',
//           style({ opacity: 1, transform: 'scale(1)' })
//         ),
//       ],
//       {
//         optional: true,
//       }
//     ),
//   ]),
// ]),
