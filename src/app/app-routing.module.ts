import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './Components/task/task.component';
import { TaskRedactComponent } from './Components/task-redact/task-redact.component';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { CathegoriesComponent } from './Components/cathegories/cathegories.component';

const routes: Routes = [
  {
    path:"",
    component:CathegoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
