import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskComponent } from './Components/task/task.component';
////////
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, matFormFieldAnimations} from '@angular/material/form-field';
import {MatSelectModule } from '@angular/material/select'
import {MatButtonModule} from '@angular/material/button'
import { HttpClientModule} from "@angular/common/http";
import { TaskRedactComponent } from './Components/task-redact/task-redact.component';
import { TaskListComponent } from './Components/task-list/task-list.component';
import {MatTableModule} from '@angular/material/table'
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule, matDialogAnimations} from '@angular/material/dialog'


@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskRedactComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ///////
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    ///////////////////////
    MatTableModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
