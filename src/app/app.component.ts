import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ToDoList';

  panelOpenState = false;

}

// <p>
// <mat-toolbar color="primary">
//     <mat-toolbar-row>
//         <span>My App</span>
//         <span class="spacer"></span>
//         <button mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
//             <mat-icon>menu</mat-icon>
//         </button>
//     </mat-toolbar-row>

//     <mat-toolbar-row style="gap: 10px;">
//         <button [hidden]="isShow" mat-raised-button color="basic">Add task</button>
//         <button [hidden]="isShow" mat-raised-button color="basic">Redact cathegories</button>
//         <button [hidden]="isShow" mat-raised-button color="basic">Redact priorities</button>
//     </mat-toolbar-row>

// </mat-toolbar>
// </p>