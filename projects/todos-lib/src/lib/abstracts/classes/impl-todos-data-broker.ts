import {IonListDataBroker} from "vicky-ionic-ng-lib";
import { Todo } from "../interfaces/todos.interface";
import { TodosDataBroker } from "../interfaces/todos-data-broker";
import { TodosDataBrokerConfig}from '../interfaces/todos-data-broker-config.interface';
import { TodosDataBrokerEvent } from "../interfaces/todos-data-broker-event.interface";
import { LoadingController, ToastController, Platform, AlertController, ActionSheetController } from '@ionic/angular';
import { TodosDataBrokerSearchConstraint } from "../interfaces/todos-data-broker-search-constraint.interface";

export abstract class ImplTodosDataBroker extends IonListDataBroker<Todo, Todo,TodosDataBrokerSearchConstraint, TodosDataBrokerEvent> implements TodosDataBroker {

  constructor(actionSheetController: ActionSheetController,  toastCtrl: ToastController,
      alertCtrl: AlertController,
    loadingCtrl: LoadingController ,paginationOptions: {
    perPage: number;
    append?: boolean;
  }, fetchOneResultAsLatest: boolean=true){
    super( actionSheetController, alertCtrl, toastCtrl, loadingCtrl,paginationOptions,'id',fetchOneResultAsLatest);
  }

  abstract override getConfig():TodosDataBrokerConfig;
}
