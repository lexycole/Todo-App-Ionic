import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TodosDetailsEditorPageRoutingModule } from './todos-details-editor-routing.module';
import { TodosDetailsEditorPage } from './todos-details-editor.page';
import { TodosService } from '../../todos.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TodosDetailsEditorPageRoutingModule
  ],
  declarations: [TodosDetailsEditorPage],
  exports: [
    TodosDetailsEditorPage
  ],
  providers:[
    TodosService
  ]
})
export class TodosDetailsEditorPageModule {}
