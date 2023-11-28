import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { AutorizationComponent } from './Components/autorization/autorization.component';
import { AuthService } from './Services/auth.service';

const routes: Routes = [
  {
    path:"",
    component:AutorizationComponent
  },
  {
    path:"list",
    component:TaskListComponent,
    canActivate: [AuthService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
