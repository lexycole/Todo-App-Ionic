import { ListDataBroker, UIDataBroker} from "app-base-lib";
import { TodosDataBrokerEvent } from './todos-data-broker-event.interface';
import { Todo } from './todos.interface';
import { TodosDataBrokerConfig } from "./todos-data-broker-config.interface";
import { TodosDataBrokerSearchConstraint } from "./todos-data-broker-search-constraint.interface";

//
export interface TodosDataBroker extends ListDataBroker<Todo,Todo,TodosDataBrokerSearchConstraint,TodosDataBrokerEvent> , UIDataBroker<Todo,Todo,TodosDataBrokerSearchConstraint, TodosDataBrokerEvent> {

  getConfig(): TodosDataBrokerConfig;
}

