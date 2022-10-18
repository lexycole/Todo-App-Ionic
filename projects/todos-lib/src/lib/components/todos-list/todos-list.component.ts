import { EventEmitter, Inject, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ACTION_SHEET_FUNCTION, TOAST_FUNCTION } from 'app-base-lib';
import { Todo } from '../../abstracts/interfaces/todos.interface';


@Component({
  selector: 'todos-ui-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss']
})
export class TodosListComponent implements OnInit {

  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();
  @Output() view = new EventEmitter<Todo>();

  @Input() actionSheetFunction!:ACTION_SHEET_FUNCTION;

  @Input() toastFunction!:TOAST_FUNCTION;

  @Input()
  deletable!:boolean;

  @Input()
  editable!:boolean;

  @Input()
  todos!: Todo[];

  constructor() { }

  ngOnInit() {
  }

  deleteFunc(todo: Todo) {
    this.delete.emit(todo);
  }

  editFunc(todo: Todo) {
    this.edit.emit(todo);
  }

  viewFunc(todo: Todo) {
    this.view.emit(todo);
  }
}
