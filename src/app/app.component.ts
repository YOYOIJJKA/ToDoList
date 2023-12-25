import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from './Components/task/task.component';
import { CathegoriesComponent } from './Components/cathegories/cathegories.component';
import { PrioritiesComponent } from './Components/priorities/priorities.component';
import { AuthService } from './Services/auth.service';
import { StorageService } from './Services/storage.service';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';
import {
  DIALOGSTYLE,
  REDACTSTYLE
} from './constants';
import { AutorizationService } from './Services/autorization.service';
import { User } from './Interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'ToDoList';
  users?: User[];
  panelOpenState = false;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private storageService: StorageService,
    private router: Router,
    private http: AutorizationService
  ) { }

  ngOnInit() {
    this.getUsers()
  }
  openDialog(componentType: ComponentType<any>): void {
    if (this.auth.canActivate()) {
      this.dialog.open(componentType, DIALOGSTYLE);
    }
  }
  openRedactDialog(componentType: ComponentType<any>): void {
    if (this.auth.canActivate()) {
      this.dialog.open(componentType, REDACTSTYLE);
    }
  }
  openTaskDialog() {
    this.openDialog(TaskComponent)
  }
  openCathegoriesDialog(): void {
    this.openRedactDialog(CathegoriesComponent)
  }
  openPrioritiesDialog(): void {
    this.openRedactDialog(PrioritiesComponent)
  }
  logOut() {
    this.storageService.clearStorage();
    this.router.navigateByUrl('');
  }
  getUsers(): void {
    const usersSubs = this.http.getUsers().subscribe(
      {
        next: (value) => {
          this.users = value;
        },
        error: (e) => console.log(e),
        complete: () => {
          this.auth.getUsers(this.users)
          usersSubs.unsubscribe()
        }
      }
    )
  }
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
