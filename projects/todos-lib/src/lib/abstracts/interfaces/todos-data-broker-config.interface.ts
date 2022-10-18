import { InjectionToken } from '@angular/core';
import { TodosDataBroker } from './todos-data-broker';
import {IonListUIDataBrokerConfig,IonUIDataBrokerUIPageConfig, IonUIDataBrokerUIPageCrudMsgsConfig} from "vicky-ionic-ng-lib";

export type TodosDataBrokerConfig = IonListUIDataBrokerConfig & {

  ui:{

    general:{
      custom?:{
        defaultWelcomeImage?:{
          url?:string
        }
      }
    },

    /**
     * contains all the properties related to the pages
     */
    pages:{

      /**
       * contains the properties related to the todos page
       */
      todos:IonUIDataBrokerUIPageConfig & IonUIDataBrokerUIPageCrudMsgsConfig,

      todosViewsPage:IonUIDataBrokerUIPageConfig,

      /**
       * @todosDetailEditor property contains all the properties related to the Todos Details Editor's page it has similar properties as the Todos page
       */
      todosDetailEditor:IonUIDataBrokerUIPageConfig & {

      /**
       * @buttons contains the properties that stores the label for the buttons on the todos-details-page
       */
        buttons:{

          main:{
        /**
         * This property stores the label/text of the button that takes the user to a previous action
         */
            backLabel?:string,
        /**
         * This property stores the label/text of the button that the users click when they need to confirm anything
         */
            confirmLabel?:string,
        /**
         * This property stores the label/text of the button that takes the user to another action
         */
            nextLabel?:string,
          }
        },
      }
    }
  }
}

export const TodosDataBrokerServiceToken = new InjectionToken<TodosDataBroker>('TodosDataBrokerService');
