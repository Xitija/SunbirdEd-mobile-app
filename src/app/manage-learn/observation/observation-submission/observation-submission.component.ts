import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderService } from '@app/services';
import { Platform, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ObservationService } from '../observation.service';
import { Location } from '@angular/common';
import { RouterLinks } from '@app/app/app.constant';
import { LocalStorageService, UtilsService } from '../../core';
import { storageKeys } from '../../storageKeys';
import { EvidenceService } from '../../core/services/evidence.service';
import { ScroreReportMenusComponent } from '../../shared/components/scrore-report-menus/scrore-report-menus.component';
import { ObservationReportsComponent } from '../../observation-report/observation-reports/observation-reports.component';

@Component({
  selector: 'app-observation-submission',
  templateUrl: './observation-submission.component.html',
  styleUrls: ['./observation-submission.component.scss'],
})
export class ObservationSubmissionComponent implements OnInit {
  private backButtonFunc: Subscription;
  headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [],
  };
  programIndex: any;
  solutionIndex: any;
  entityIndex: any;
  submissionList: any;
  inProgressObservations = [];
  completedObservations = [];
  submissions: any[];
  currentTab = 'all';
  // height: number;
  selectedSolution: any;
  programList: any;
  showEntityActionsheet: boolean;
  showActionsheet: boolean;
  submissionIdArr: any;
  constructor(
    private location: Location,
    private headerService: AppHeaderService,
    private platform: Platform,
    private httpClient: HttpClient,
    private observationService: ObservationService,
    private router: Router,
    private localStorage: LocalStorageService,
    private utils: UtilsService,
    private evdnsServ: EvidenceService,
    private popoverCtrl: PopoverController
  ) {}
  ionViewWillEnter() {
    this.headerConfig = this.headerService.getDefaultPageConfig();
    this.headerConfig.actionButtons = [];
    this.headerConfig.showHeader = true;
    this.headerConfig.showBurgerMenu = false;
    this.headerService.updatePageConfig(this.headerConfig);
  }

  ionViewWillLeave() {
    if (this.backButtonFunc) {
      this.backButtonFunc.unsubscribe();
    }
  }

  ngOnInit() {
    this.programIndex = this.observationService.getProgramIndex();
    this.solutionIndex = this.observationService.getSolutionIndex(); //
    this.entityIndex = this.observationService.getEntityIndex(); //
    this.getProgramFromStorage();
  }

  getProgramFromStorage(stopLoader?, noLoader?) {
    this.localStorage
      .getLocalStorage(storageKeys.observationSubmissionIdArr)
      .then((ids) => {
        this.submissionIdArr = ids;
      })
      .catch((err) => {
        this.submissionIdArr = [];
      })
      .finally(() => {
        this.httpClient.get('assets/dummy/programs.json').subscribe((data: any) => {
          console.log(data);
          this.programList = data.result;
          this.selectedSolution = this.programList[this.programIndex].solutions[this.solutionIndex];
          this.submissionList = this.programList[this.programIndex].solutions[this.solutionIndex].entities[
            this.entityIndex
          ].submissions;
          this.applyDownloadedflag();
          this.splitCompletedAndInprogressObservations();
          this.tabChange(this.currentTab ? this.currentTab : 'all');
        });
      });

    /* await this.localStorage
      .getLocalStorage(storageKeys.observationSubmissionIdArr)
      .then((ids) => {
        this.submissionIdArr = ids;
      })
      .catch((err) => {
        this.submissionIdArr = [];
      });

    stopLoader ? null : noLoader ? null : this.utils.startLoader();

    await this.localStorage
      .getLocalStorage(storageKeys.programList)
      .then((data) => {
        if (data) {
          this.programList = data;
          this.selectedSolution = this.programList[this.programIndex].solutions[this.solutionIndex];
          this.submissionList = this.programList[this.programIndex].solutions[this.solutionIndex].entities[
            this.entityIndex
          ].submissions;
          this.applyDownloadedflag();

          this.splitCompletedAndInprogressObservations();
          this.recentlyUpdatedEntityFn();

          this.tabChange(this.currentTab ? this.currentTab : "all");
        } else {
          this.submissionList = null;
        }
        noLoader ? null : this.utils.stopLoader();
      })
      .catch((error) => {
        noLoader ? null : this.utils.stopLoader();
        this.submissionList = null;
      }); */
  }

  applyDownloadedflag() {
    this.submissionList.map((s) => {
      this.submissionIdArr.includes(s._id) ? (s.downloaded = true) : null;
    });
  }
  splitCompletedAndInprogressObservations() {
    this.completedObservations = [];
    this.inProgressObservations = [];
    for (const submission of this.submissionList) {
      submission.status === 'completed'
        ? this.completedObservations.push(submission)
        : this.inProgressObservations.push(submission);
    }
  }

  tabChange(value) {
    // this.height = 100;
    this.submissions = [];
    this.currentTab = value;
    switch (value) {
      case 'inProgress':
        this.submissions = this.inProgressObservations;

        break;
      case 'completed':
        this.submissions = this.completedObservations;
        break;
      case 'all':
        this.submissions = this.submissions.concat(this.inProgressObservations, this.completedObservations);
        break;
      default:
        this.submissions = this.submissions.concat(this.inProgressObservations, this.completedObservations);
        console.log(this.submissions);
    }
  }
  getAssessmentDetails(submission) {
    this.showActionsheet = false;
    this.showEntityActionsheet = false;

    this.localStorage
      .getLocalStorage(this.utils.getAssessmentLocalStorageKey(submission._id))
      .then((data) => {
        if (!data) {
          this.getAssessmentDetailsApi(submission);
        } else {
          this.goToEcm(submission);
        }
      })
      .catch((error) => {
        this.getAssessmentDetailsApi(submission);
      });
  }

  getAssessmentDetailsApi(submission) {
    let event = {
      programIndex: this.programIndex,
      solutionIndex: this.solutionIndex,
      entityIndex: this.entityIndex,
      submission: submission,
    };
    this.observationService
      .getAssessmentDetailsForObservation(event, this.programList)
      .then(async (programList) => {
        await this.getProgramFromStorage();
        this.goToEcm(submission);
      })
      .catch((error) => {});
  }

  goToEcm(submission) {
    // TODO: Remove
    // this.router.navigate([`/${RouterLinks.OBSERVATION}/${RouterLinks.SECTION_LISTING}`]);
    let submissionId = submission._id;
    let heading = this.selectedSolution.entities[this.entityIndex].name;

    this.localStorage
      .getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId))
      .then((successData) => {
        if (successData.assessment.evidences.length > 1) {
          this.router.navigate([RouterLinks.ECM_LISTING], {
            queryParams: {
              submisssionId: submissionId,
              schoolName: heading,
            },
          });

          // this.navCtrl.push('EvidenceListPage', {
          //   _id: submissionId,
          //   name: heading,
          //   recentlyUpdatedEntity: this.recentlyUpdatedEntity,
          // });
        } else {
          if (successData.assessment.evidences[0].startTime) {
            this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId);
            this.router.navigate([RouterLinks.SECTION_LISTING], {
              queryParams: {
                submisssionId: submissionId,
                evidenceIndex: 0,
                schoolName: heading,
              },
            });
            // this.navCtrl.push('SectionListPage', {
            //   _id: submissionId,
            //   name: heading,
            //   selectedEvidence: 0,
            //   recentlyUpdatedEntity: this.recentlyUpdatedEntity,
            // });
          } else {
            const assessment = { _id: submissionId, name: heading };
            this.openAction(assessment, successData, 0);
          }
        }
      })
      .catch((error) => {});
  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id);
    const options = {
      _id: assessment._id,
      name: assessment.name,
      selectedEvidence: evidenceIndex,
      entityDetails: aseessmemtData,
      // recentlyUpdatedEntity: this.recentlyUpdatedEntity, //TODO
    };
    console.log(JSON.stringify(options));
    this.evdnsServ.openActionSheet(options, 'Observation');
  }
  async openMenu(event, submission, index) {
    if (submission.ratingCompletedAt) {
      let popover = await this.popoverCtrl.create({
        component: ScroreReportMenusComponent,
        componentProps: {
          submission: submission,
          entityType: this.selectedSolution.entities[this.entityIndex].entityType,
        },
        event: event,
      });
      popover.present();
    } else {
      this.router.navigate([
        RouterLinks.OBSERVATION_REPORTS,
        {
          queryParams: {
            submissionId: submission._id,
            entityType: this.selectedSolution.entities[this.entityIndex].entityType,
          },
        },
      ]);
      // this.navCtrl.push(ObservationReportsPage, {
      //   submissionId: submission._id,
      //   entityType: this.selectedSolution.entities[this.entityIndex].entityType,
      // });
    }
  }
}
