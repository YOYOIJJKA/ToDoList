import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskComponent } from './Components/task/task.component';
////////
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { TaskRedactComponent } from './Components/task-redact/task-redact.component';
import { TaskListComponent } from './Components/task-list/task-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CathegoriesComponent } from './Components/cathegories/cathegories.component';
import { MatChipsModule } from '@angular/material/chips';
import { AutorizationComponent } from './Components/autorization/autorization.component';
import { PrioritiesComponent } from './Components/priorities/priorities.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http';
import { httpInterceptor } from './Interceptors/http.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskRedactComponent,
    TaskListComponent,
    CathegoriesComponent,
    AutorizationComponent,
    PrioritiesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: httpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
