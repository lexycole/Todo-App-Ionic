import { EventEmitter } from '@angular/core';
import { Component, OnInit, Input, Output } from '@angular/core';
import {ACTION_SHEET_FUNCTION , ACTION_SHEET_OPTIONS, TOAST_FUNCTION} from 'app-base-lib';
import { Todo } from '../../abstracts/interfaces/todos.interface';

@Component({
  selector: 'todos-ui-todos-item',
  templateUrl: './todos-item.component.html',
  styleUrls: ['./todos-item.component.scss'],
})
export class TodosItemComponent implements OnInit {

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();

  @Input() actionSheetTitle!:string;

  @Input() actionSheetFunction!:ACTION_SHEET_FUNCTION;

  @Input() toastFunction!:TOAST_FUNCTION;

  @Input()
  todo!: Todo;

  @Input() deletable!: boolean;

  @Input() editable!: boolean;

  constructor() {}

  ngOnInit() {
  }

  private deleteFunc() {
    this.delete.emit();
  }

  private editFunc() {
    this.edit.emit();
  }

  viewFunc() {
    this.view.emit();
  }

  async sayStatus(){

    const resp = await this.toastFunction({
      message:`This todo ${this.todo.completed?'has been completed':'is in progress'}`
    }).then();

    resp.onEnd.then(()=>{
    });
  }

  async presentActionSheet() {

    const buttons:ACTION_SHEET_OPTIONS['buttons'] = [];

    if(this.editable){
      buttons.push({
        id: 'edit',
        label: 'Edit',
        role:'update',
      });
    }
    else if(this.deletable){
      buttons.push({
        id:'delete',
        label: 'Delete',
        role: 'delete',
      });
    }

    buttons.push({
      id:'cancel',
      label: 'Cancel',
      role: 'cancel',
    });

    const resp = await this.actionSheetFunction({
      title:this.actionSheetTitle,
      buttons
    });

    resp.onEnd.then((result)=>{
      if(result.id == 'edit'){
        this.editFunc();
      }
      else if(result.id == 'delete'){
        this.deleteFunc();
      }
    });
  }

}
