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
  ENTERANIMATIONDURATION,
  EXITANIMATIONDURATION,
  REDACTSTYLE,
} from './constants';
import { AutorizationService } from './Services/autorization.service';
import { User } from './Interfaces/user';
import { TaskRedactComponent } from './Components/task-redact/task-redact.component';

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
  ) {}

  ngOnInit() {
    this.getUsers();
  }
  openDialog(
    componentType: ComponentType<any>,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    if (this.auth.canActivate()) {
      this.dialog.open(componentType, {
        data: {
          id: undefined,
          redact: false,
        },
        width: 'auto',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }
  }
  openRedactDialog(componentType: ComponentType<any>): void {
    if (this.auth.canActivate()) {
      this.dialog.open(componentType, REDACTSTYLE);
    }
  }
  openTaskDialog() {
    this.openDialog(
      TaskRedactComponent,
      ENTERANIMATIONDURATION,
      EXITANIMATIONDURATION
    );
  }
  openCathegoriesDialog(): void {
    this.openRedactDialog(CathegoriesComponent);
  }
  openPrioritiesDialog(): void {
    this.openRedactDialog(PrioritiesComponent);
  }
  logOut() {
    this.storageService.clearStorage();
    this.router.navigateByUrl('');
    this.getUsers();
  }
  getUsers(): void {
    this.http.getUsers().subscribe({
      next: (value) => {
        this.auth.setUsers(value);
      },
      error: (e) => console.log(e),
      complete: () => {
        console.log('users pulled');
      },
    });
  }
}
