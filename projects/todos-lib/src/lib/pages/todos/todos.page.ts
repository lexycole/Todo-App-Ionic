import { Component, Inject, OnInit } from '@angular/core';
import { ActionSheetController, ActionSheetOptions, AlertController, InfiniteScrollCustomEvent, IonInfiniteScroll, IonRefresher, ModalController, RefresherCustomEvent, SpinnerTypes } from '@ionic/angular';
import { TodosDetailsEditorPage } from '../todos-details-editor/todos-details-editor.page';
import { TodosDataBrokerConfig, TodosDataBrokerServiceToken } from '../../abstracts/interfaces/todos-data-broker-config.interface';
import { CRUD, RESULT, PaginatedDataManager, ACTION_SHEET_FUNCTION } from 'app-base-lib';
import { TodosDataBroker } from '../../abstracts/interfaces/todos-data-broker';
import { Todo } from '../../abstracts/interfaces/todos.interface';
import { AfterViewInit } from '@angular/core';
import { LOADER_STATE, ListDataBrokerLoadUIManager, LoaderComponent} from 'vicky-ionic-ng-lib';
import { from, Observable, Subject } from 'rxjs';
import { TodosDataBrokerEvent } from '../../abstracts/interfaces/todos-data-broker-event.interface';
import { ViewChild } from '@angular/core';
import { TodosDataBrokerSearchConstraint } from '../../abstracts/interfaces/todos-data-broker-search-constraint.interface';
import { TodosService } from '../../todos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'todos-ui-todos-page',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
})
export class TodosPage implements OnInit {

  @ViewChild(LoaderComponent,{static:true})
  private loaderComponent!:LoaderComponent;

  /**
   * Stores the spinner type used throughout the library
   */
  public spinnerType !: SpinnerTypes;

  /**
   * Stores the configuration from the data broker
   */
  private config !: TodosDataBrokerConfig;

   /**
   * Determines if the add button should be shown
   */
  public showAddBtn!:boolean;

   /**
   * Stores the title of the page
   */
  public pageTitle!:string;

  /**
   * Determines if the page title should be shown
   */
  public showTitle!:boolean;

 /**
   * Determines if refresh functionality should be enabled
   */
  public refreshEnabled!:boolean;

   /**
   * Determines if Infinite Scroll functionality should be enabled
   */
  public infiniteScrollEnabled!:boolean;

   /**
   * Determines if user have delete permission
   */
  public canDelete!: boolean;

  /**
   * Determines if user have edit permission
   */
  public canEdit!: boolean;

  public actionSheetFunction:ACTION_SHEET_FUNCTION;

   /**
   * Manages how the todos are loaded to the UI
   */
  private listDataBrokerLoadUIManager!:ListDataBrokerLoadUIManager<Todo,Todo,TodosDataBrokerSearchConstraint,TodosDataBrokerEvent>;


   /**
   * Manages the pagination of the library
   */
  private paginatedDataManager!:PaginatedDataManager<Todo>;


   /**
   * Getting more Todos through pagination
   */
  public get todos():Todo[]{
    return this.paginatedDataManager.data;
  }

  constructor(@Inject(TodosDataBrokerServiceToken)
   private todosDataBroker:TodosDataBroker,
    public modalCtlr: ModalController, public alertController: AlertController, private router: Router,
    public actionSheetController: ActionSheetController) {

    this.config = this.todosDataBroker.getConfig();

    this.actionSheetFunction = this.todosDataBroker.showActionSheet;

    const thiz = this;

    this.listDataBrokerLoadUIManager = new class extends ListDataBrokerLoadUIManager<Todo,Todo,TodosDataBrokerSearchConstraint,TodosDataBrokerEvent>{
      protected getLoaderComponent(): LoaderComponent {
        return thiz.loaderComponent;
      }
      constructor(){
        super({append:true},thiz.todosDataBroker);
      }
    };

    this.paginatedDataManager = this.listDataBrokerLoadUIManager.getPaginatedDataManager();
  }

  async ngOnInit(): Promise<void> {

    /**
     * Assigning a value as the spinner type. The value is gotten through @Input() or the config file. If no value is set, it will use the fallback label 'Bubbles'
     */
    this.spinnerType = this.config.ui.general.spinner.type || 'bubbles';

    /**
     * The add button is shown if the user have create permission
     */
    this.showAddBtn = await this.todosDataBroker.canCRUD(CRUD.CREATE);

    /**
     * Delete button is shown if the user have delete permission
     */
    this.canDelete = await this.todosDataBroker.canCRUD(CRUD.DELETE);
    // this.canEdit = await this.todosDataBroker.canCRUD(CRUD.EDIT);

    this.refreshEnabled = this.config.ui.general.swipeRefresh.enabled;
    this.infiniteScrollEnabled = this.config.ui.general.pagination.enabled;

    const config = this.config;
    this.pageTitle = config.ui.pages.todos.title.label;
    this.showTitle = !config.ui.pages.todos.title.invisible;
  }

  async addNewTodo() {

    const afterCreateSubject = new Subject<Todo>();

    afterCreateSubject.subscribe({
      next:(todo:Todo)=>{
        this.listDataBrokerLoadUIManager.reflectDataIntoPaginatedDataManager( 'create' , todo );
      }
    });

    const todosConfig = this.config.ui.pages.todos;

    await this.todosDataBroker.runCreateUIFlow({
      input:{
        get:async ()=>{

          return new Promise<RESULT<Todo,any>>((resolve,reject)=>{

            this.modalCtlr.create({
              component: TodosDetailsEditorPage,
              componentProps:{
                mode:CRUD.CREATE
              }
            }).then((modal)=>{
              modal.onDidDismiss().then(async (resp)=>{

                const result = resp.data as RESULT<Todo,any>;

                resolve(result);
              });
              modal.present().then();
            });
          });
        },
        //progress message shown while the link is being created
        messages:{
          failure: todosConfig.crud?.create?.messages?.failure || 'Oops something went wrong, pls try again'
        },
      },
      crudEvent:{
        before:{
          progress:{
            title: 'Please wait...',
            // spinner: this.config.spinner.type || 'bubbles',
            message: 'Creating your todo', //ask question
          },
        },
                //progress message shown after the todo has been created
        after:{
          subject: afterCreateSubject,
          messages:{
            success:todosConfig.crud?.create?.messages?.success || 'Todo added successfully',
            failure: todosConfig.crud?.create?.messages?.failure || 'Oops something went wrong, pls try again',
          }
        }
      }
    });
  }

  async delete(todo:Todo){

    console.log('TodosPage.delete() :',todo);

    //await this.presentAlertConfirm();

    const todosConfig = this.config.ui.pages.todos;
    const afterDeleteSubject = new Subject<Todo>();

    afterDeleteSubject.subscribe({
      next:(todo:Todo)=>{
      },
      error:(err:any)=>{
        this.listDataBrokerLoadUIManager.reflectDataIntoPaginatedDataManager( 'create' , todo );
      }
    });

    await this.todosDataBroker.runDeleteUIFlow({
      data:todo,
      crudEvent:{
        before:{
          callback:async ()=>{
            this.listDataBrokerLoadUIManager.reflectDataIntoPaginatedDataManager( 'delete' , todo );
            console.log('TodosPage.delete() ', todo , this.todos);
          }
        },
        after:{
          subject: afterDeleteSubject,
          messages:{
            failure: todosConfig. .crud?.delete?.messages?.failure || 'Sorry, could not delete todo'
          }
        }
      }
    });
  }

    async view(todo: Todo) {
      this.router.navigate(['todo-view'],{state:{
        todo
      },queryParams:{id:todo.id}});
    }

    async edit(todo: Todo) {

    const afterUpdateSubject = new Subject<Todo>();

    afterUpdateSubject.subscribe({
      next:(todo:Todo)=>{
        this.listDataBrokerLoadUIManager.reflectDataIntoPaginatedDataManager( 'update' , todo );
      }
    });

    const todosConfig = this.config.ui.pages.todos;

    await this.todosDataBroker.runUpdateUIFlow({
      input:{
        get:async ()=>{

          return new Promise<RESULT<Todo,any>>((resolve,reject)=>{

            this.modalCtlr.create({
              component: TodosDetailsEditorPage,
              componentProps:{
                mode:CRUD.UPDATE
              }
            }).then((modal)=>{
              modal.onDidDismiss().then(async (resp)=>{

                const result = resp.data as RESULT<Todo,any>;

                resolve(result);
              });
              modal.present().then();
            });
          });
        },

        //progress message shown while the link is being created
        messages:{
          failure: todosConfig.crud?.update?.messages?.failure || 'Oops something went wrong, pls try again'
        },
      },
      crudEvent:{
        before:{
          progress:{
            title: 'Please wait...',
            // spinner: this.config.spinner.type || 'bubbles',
            message: this.config.ui.pages.todos.crud?.update?.messages?.progress ||'Updating your todo..',
          },
        },
                //progress message shown after the todo has been updated
        after:{
          subject: afterUpdateSubject,
          messages:{
            success:todosConfig.crud?.update?.messages?.success || 'Todo Updated successfully',
            failure: todosConfig.crud?.update?.messages?.failure || 'Oops something went wrong, pls try again',
          }
        }
      }
    });
  }

  onLoaderStateChange(s: any){
    const state = s as unknown as LOADER_STATE;
    console.log(s + ' as ' + state);
    if( state == LOADER_STATE.LOADING ){
      this.loadInitial();
    }
  }

  private async loadInitial(){
    this.listDataBrokerLoadUIManager.handleLoader(this.loaderComponent).subscribe((todos:Todo[])=>{
      console.log('todosDetailEditorPage.loadInitial() success :',todos);
    },(err)=>{
      console.log('todosDetailEditorPage.loadInitial() error :',err);
    });
  }

  public paginate(ev: Event): void{
    const event = ev as InfiniteScrollCustomEvent ;
    this.listDataBrokerLoadUIManager.handleInfiniteScroll( event.target as unknown as IonInfiniteScroll ).subscribe((todos:Todo[])=>{
      console.log('todosDetailEditorPage.paginate() success :',todos);
    },
    err => {
      console.log('todosDetailEditorPage.paginate() error :',err);
    });
  }

  // Called when a user swipes to refresh
  refresh(ev: Event) {
    const event = ev as RefresherCustomEvent;
    console.log(ev);

    this.listDataBrokerLoadUIManager.handleSwipeRefresh( event.target as unknown as IonRefresher ).subscribe((todos:Todo[])=>{
      console.log('todosDetailEditorPage.refresh() success :',todos);
    },
    err => {
      console.log('todosDetailEditorPage.refresh() error :',err);
    });
  }
}


