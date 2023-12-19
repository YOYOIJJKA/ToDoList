import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskComponent } from './Components/task/task.component';
import { CathegoriesComponent } from './Components/cathegories/cathegories.component';
import { PrioritiesComponent } from './Components/priorities/priorities.component';
import { AuthService } from './Services/auth.service';
import { StorageService } from './Services/storage.service';
import { Router } from '@angular/router';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
 public title = 'ToDoList';

  panelOpenState = false;
  componentType: ComponentType<any> = PrioritiesComponent;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.getUsers();
    this.componentType = CathegoriesComponent;
    console.log (this.componentType);
  }

  openTaskDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    if (this.auth.canActivate()) {
      const taskDialog = this.dialog.open(TaskComponent, {
        width: 'auto',
        enterAnimationDuration,
        exitAnimationDuration,
      }); // TODO: одинаковый код стилизации открывающегося диалогового окна в 3 методах - выносим в общий метод
    }
  }
  openCathegoriesDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    if (this.auth.canActivate())
      this.dialog.open(CathegoriesComponent, {
        width: '50%',
        enterAnimationDuration,
        exitAnimationDuration,
      });
  }

  openPrioritiesDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    if (this.auth.canActivate())
      this.dialog.open(PrioritiesComponent, {
        width: '50%',
        enterAnimationDuration,
        exitAnimationDuration,
      });
  }

  logOut() {
    this.storageService.clearStorage();
    this.router.navigateByUrl('');
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
