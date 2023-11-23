import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './Components/task/task.component';
import { TaskRedactComponent } from './Components/task-redact/task-redact.component';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { CathegoriesComponent } from './Components/cathegories/cathegories.component';
import { AutorizationComponent } from './Components/autorization/autorization.component';

const routes: Routes = [
  {
    path:"",
    component:AutorizationComponent
  },
  {
    path:"list",
    component:TaskListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
