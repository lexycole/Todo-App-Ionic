import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoaderComponentModule } from 'vicky-ionic-ng-lib';
import { TodosDetailsEditorPageModule } from '../todos-details-editor/todos-details-editor.module';
import { TodosPageRoutingModule } from './todos-routing.module';
import { TodosPage } from './todos.page';
import { ComponentsModule } from '../../components/components.module';
import { TodosService } from '../../todos.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodosPageRoutingModule,
    TodosDetailsEditorPageModule,
    ComponentsModule,
    LoaderComponentModule,
  ],
  declarations: [TodosPage],
  providers:[
    TodosService
  ],

  exports: [TodosPage]
})
export class TodosPageModule {
}
