import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { AutorizationComponent } from './Components/autorization/autorization.component';
import { AuthGuard } from './Services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AutorizationComponent,
  },
  {
    path: 'list',
    component: TaskListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
