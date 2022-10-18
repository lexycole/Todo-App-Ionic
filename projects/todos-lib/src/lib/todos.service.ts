import { Injectable, Inject } from '@angular/core';
import { TodosDataBroker } from './abstracts/interfaces/todos-data-broker';
import { TodosDataBrokerConfig, TodosDataBrokerServiceToken } from './abstracts/interfaces/todos-data-broker-config.interface';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private config!: TodosDataBrokerConfig;

  public readonly defaultFavicon !:string;

  constructor(@Inject(TodosDataBrokerServiceToken) private todosDataBroker:TodosDataBroker) {
    this.config = this.todosDataBroker.getConfig();
  }
}
