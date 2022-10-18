import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodosDetailsEditorPage } from './todos-details-editor.page';

const routes: Routes = [
  {
    path: '',
    component: TodosDetailsEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodosDetailsEditorPageRoutingModule {}
