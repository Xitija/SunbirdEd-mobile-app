import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonFab, ModalController, Platform } from '@ionic/angular';
import { LoaderService } from '../../core';
import { QuestionListComponent } from '../../shared/components/question-list/question-list.component';

@Component({
  selector: 'app-observation-reports',
  templateUrl: './observation-reports.component.html',
  styleUrls: ['./observation-reports.component.scss'],
})
export class ObservationReportsComponent implements OnInit {
  reportObj;
  submissionId;
  observationId;
  solutionId;
  entityId;
  error;
  payload;
  appFolderPath;
  isIos;
  fileName;
  action;
  entityType;
  immediateChildEntityType;
  reportType: string;
  allQuestions: Array<Object> = [];
  filteredQuestions: Array<any> = [];
  selectedTab: any;
  reportObjCriteria: any;
  allCriterias: any = [];
  filteredCriterias: any = [];
  // @ViewChild(FabContainer) fab: FabContainer //TODO:check fab action
  @ViewChild(IonFab) fab; //TODO check fab with this.
  from: any;
  constructor(
    private routerParam: ActivatedRoute,
    private platform: Platform,
    private loader: LoaderService,
    private httpClient: HttpClient,
    private modal: ModalController
  ) {
    this.routerParam.queryParams.subscribe((params) => {
      this.submissionId = params.submissionId;
      this.observationId = params.observationId;
      this.solutionId = params.solutionId;
      this.entityId = params.entityId;
      this.entityType = params.entityType;
      this.from = params.from;
      this.immediateChildEntityType = params.immediateChildEntityType;
      this.reportType = params.reportType;
    });
  }

  ngOnInit() {
    this.selectedTab = 'questionwise';

    this.payload = {
      entityId: this.entityId,
      submissionId: this.submissionId,
      observationId: this.observationId,
      entityType: this.entityType,
    };
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos
      ? cordova.file.documentsDirectory + '/Download/'
      : cordova.file.externalRootDirectory + '/Download/';
    this.getObservationReports();
  }
  ionViewDidLoad() {
    //TODO:moved to contructor
    // this.selectedTab = 'questionwise';
    // this.submissionId = this.navParams.get('submissionId');
    // this.observationId = this.navParams.get('observationId');
    // this.solutionId = this.navParams.get('solutionId');
    // this.entityId = this.navParams.get('entityId');
    // this.entityType = this.navParams.get('entityType');
    // this.from = this.navParams.get('from');
    // this.immediateChildEntityType = this.navParams.get('immediateChildEntityType');
    // this.reportType = this.navParams.get('reportType');
    // this.selectedTab = 'questionwise';
    // this.payload = {
    //   entityId: this.entityId,
    //   submissionId: this.submissionId,
    //   observationId: this.observationId,
    //   entityType: this.entityType,
    // };
    // this.isIos = this.platform.is('ios') ? true : false;
    // this.appFolderPath = this.isIos
    //   ? cordova.file.documentsDirectory + '/Download/'
    //   : cordova.file.externalRootDirectory + '/Download/';
    // this.getObservationReports();
  }

  getObservationReports(download = false) {
    //TODO:remove
    // this.loader.startLoader();
    this.httpClient.get('assets/dummy/observationInstanceReport.json').subscribe((success: any) => {
      this.allQuestions = success.allQuestions && !this.allQuestions.length ? success.allQuestions : this.allQuestions;
      if (success) {
        this.reportObj = success;
      } else {
        this.error = 'No data found';
      }
      // this.loader.stopLoader();
      !this.filteredQuestions.length ? this.markAllQuestionSelected() : null;
    });
    //TODO:till here

    // this.utils.startLoader();
    //  this.loader.startLoader()
    // let url;
    // if (this.entityType && this.reportType) {
    //   this.payload = {
    //     entityId: this.entityId,
    //     entityType: this.entityType,
    //     solutionId: this.solutionId,
    //     immediateChildEntityType: this.immediateChildEntityType,
    //     reportType: this.reportType,
    //   };
    //   url = AppConfigs.observationReports.entitySolutionReport;
    // } else if (this.submissionId) {
    //   url = AppConfigs.observationReports.instanceReport;
    // } else if (!this.submissionId && !this.entityId) {
    //   url = AppConfigs.observationReports.observationReport;
    // } else {
    //   url = AppConfigs.observationReports.entityReport;
    // }

    // this.payload.filter = {
    //   questionId: this.filteredQuestions,
    // };
    // console.log(JSON.stringify(this.payload));
    // this.apiService.httpPost(
    //   url,
    //   this.payload,
    //   (success) => {
    //     //this will be initialized only on page load
    //     this.allQuestions =
    //       success.allQuestions && !this.allQuestions.length
    //         ? success.allQuestions
    //         : this.allQuestions;
    //     if (success) {
    //       this.reportObj = success;
    //     } else {
    //       this.error = "No data found";
    //     }
    //     // this.utils.stopLoader()
    //     this.loader.stopLoader()
    //     !this.filteredQuestions.length ? this.markAllQuestionSelected() : null;
    //   },
    //   (error) => {
    //     this.error = "No data found";
    //     // this.utils.stopLoader();
    //     this.loader.stopLoader()
    //   },
    //   {
    //     baseUrl: "dhiti",
    //     version: this.entityType && this.reportType ? "v2" : "v1",
    //   }
    // );
  }

  markAllQuestionSelected() {
    for (const question of this.allQuestions) {
      this.filteredQuestions.push(question['questionExternalId']);
    }
  }

  markAllCriteriaSelected() {
    for (const criteria of this.allCriterias) {
      this.filteredCriterias.push(criteria['criteriaId']);
    }
  }
  onTabChange(tabName) {
    this.fab ? this.fab.close() : null;
    this.selectedTab = tabName;
    !this.allCriterias.length ? this.getObservationCriteriaReports() : null;
  }

  getObservationCriteriaReports() {
    // this.utils.startLoader();
    // let url;
    // if (this.entityType && this.reportType) {
    //   this.payload = {
    //     entityId: this.entityId,
    //     entityType: this.entityType,
    //     solutionId: this.solutionId,
    //     immediateChildEntityType: this.immediateChildEntityType,
    //     reportType: this.reportType,
    //   };
    //   // url = AppConfigs.criteriaReports.entitySolutionReport;
    // } else if (this.submissionId) {
    //   url = AppConfigs.criteriaReports.instanceReport;
    // } else if (!this.submissionId && !this.entityId) {
    //   url = AppConfigs.criteriaReports.observationReport;
    // } else {
    //   url = AppConfigs.criteriaReports.entityReport;
    // }
    // this.payload.filter = {
    //   criteria: this.filteredCriterias,
    // };
    // this.apiService.httpPost(
    //   url,
    //   this.payload,
    //   (success) => {
    //     //this will be initialized only on page load
    //     this.allCriterias =
    //       success.allCriterias && !this.allCriterias.length
    //         ? success.allCriterias
    //         : this.allCriterias;
    //     if (success) {
    //       this.reportObjCriteria = success;
    //     } else {
    //       this.error = "No data found";
    //     }
    //     this.utils.stopLoader();
    //     !this.filteredCriterias.length ? this.markAllCriteriaSelected() : null;
    //   },
    //   (error) => {
    //     this.error = "No data found";
    //     this.utils.stopLoader();
    //   },
    //   {
    //     baseUrl: "dhiti",
    //     version: "v1",
    //   }
    // );
  }
  async openFilter() {
    const modal = await this.modal.create({
      component: QuestionListComponent,
      componentProps: {
        allQuestions: this.allQuestions,
        filteredQuestions: JSON.parse(JSON.stringify(this.filteredQuestions)),
      },
    });
    await modal.present();
    await modal.onDidDismiss().then((response: any) => {
      if (
        response &&
        response.action === 'updated' &&
        JSON.stringify(response.filter) !== JSON.stringify(this.filteredQuestions)
      ) {
        this.filteredQuestions = response.filter;
        this.getObservationReports();
      }
    });
  }
}
