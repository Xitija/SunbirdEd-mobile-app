import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreferenceKey, RouterLinks } from '@app/app/app.constant';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, UtilsService } from '../../core';
import { urlConstants } from '../../core/constants/urlConstants';
import { AssessmentApiService } from '../../core/services/assessment-api.service';
import { KendraApiService } from '../../core/services/kendra-api.service';
import { Location } from '@angular/common';
import { AppGlobalService, CommonUtilService } from '@app/services';
import { SharedPreferences } from 'sunbird-sdk';

@Component({
  selector: 'app-deeplink-redirect',
  templateUrl: './deeplink-redirect.component.html',
  styleUrls: ['./deeplink-redirect.component.scss'],
})
export class DeeplinkRedirectComponent implements OnInit {
  data: any;
  translateObject: any;
  link: any;
  extra: string;
  selectedUserType;

  constructor(
    @Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
    public navCtrl: NavController,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private assessmentService: AssessmentApiService,
    private utils: UtilsService,
    private http: HttpClient,
    private kendra: KendraApiService,
    private toast: ToastService,
    private location: Location,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService
  ) {
    this.extra = this.route.snapshot.paramMap.get('extra');
    const extrasState = this.router.getCurrentNavigation().extras.state;
    if (extrasState) {
      this.data = extrasState.data;
    }
  }

  ionViewDidLoad() {}
  ngOnInit() {
    this.translate.get(['message.canNotOpenLink']).subscribe((translations) => {
      this.translateObject = translations;
    });
    this.switch(this.extra);
  }

  async switch(key) {
    this.selectedUserType = await this.preferences.getString(PreferenceKey.SELECTED_USER_TYPE).toPromise();

    switch (key) {
      case 'observationLink':
        this.verifyLink(this.data.create_observation_id);
        break;
      case 'projectLink':
        this.verifyLink(this.data.create_project_id);
        break;
      default:
        break;
    }
  }

  async redirectProject(data) {
    if (!this.appGlobalService.isUserLoggedIn()) {
      this.commonUtilService.showToast("FRMELEMNTS_MSG_PLEASE_LOGIN_HT_OTHER");
      this.location.back()
      return;
    } else if(this.selectedUserType !== "administrator"){
      this.commonUtilService.showToast('FRMELEMNTS_MSG_CONTENT_NOT_AVAILABLE_FOR_ROLE');
      this.location.back()
      return;
    }
    await this.router.navigate([`/${RouterLinks.HOME}`]);
    if (data.projectId) {// project id will only come if its created alreday for user
      await this.router
        .navigate([`/${RouterLinks.PROJECT}`], {
          queryParams: {
            selectedFilter: data.isATargetedSolution ? 'assignedToMe' : 'discoveredByMe',
          },
        })
      setTimeout(() => {
        this.router.navigate([`${RouterLinks.PROJECT}/${RouterLinks.DETAILS}`], {
          queryParams: {
            projectId: data.projectId,
            programId: data.programId,
            solutionId: data.solutionId,
          },
        });
      },500);
      return
    }
    this.router.navigate([`${RouterLinks.PROJECT}/${RouterLinks.TEMPLATE}`, data.solutionId], {
      queryParams: data,
      skipLocationChange: true,
    });
  }

  async redirectObservation(resp) {
    await this.router.navigate([`/${RouterLinks.HOME}`]);
    if (
      resp.assessment.evidences.length > 1 ||
      resp.assessment.evidences[0].sections.length > 1 ||
      (resp.solution.criteriaLevelReport && resp.solution.isRubricDriven)
    ) {
      this.router.navigate([RouterLinks.DOMAIN_ECM_LISTING], { state: resp });
    } else {
      this.router.navigate([RouterLinks.QUESTIONNAIRE], {
        queryParams: {
          evidenceIndex: 0,
          sectionIndex: 0,
        },
          state: resp,
      });
    }
  }

  async getTemplateDetails(data) {
    let payload = await this.utils.getProfileInfo();
    const config = {
      url: urlConstants.API_URLS.TEMPLATE_DETAILS + data.solutionId,
      payload: payload,
    };
    this.assessmentService.post(config).subscribe((success) => {
      if (success.result) {
        success.result.isATargetedSolution = data.isATargetedSolution;
        success.result.programId = data.programId;
        this.redirectObservation(success.result);
      }else{
      this.location.back();
      this.toast.showMessage('FRMELEMNTS_MSG_TEMPLATE_DETAILS_NOTFOUND','danger');
      }
    },error =>{
      this.location.back();
      this.toast.showMessage('FRMELEMNTS_MSG_TEMPLATE_DETAILS_NOTFOUND','danger');
    });
  }

   async goToEntities(data) {
    await  this.router.navigate([`/${RouterLinks.HOME}`])
    this.router.navigate([`/${RouterLinks.OBSERVATION}/${RouterLinks.OBSERVATION_DETAILS}`], {
      queryParams: { solutionId: data.solutionId, solutionName: data.name, programId: data.programId }
    });
  }

  async verifyLink(link) {
    let payload = await this.utils.getProfileInfo();

    const config = {
      url: urlConstants.API_URLS.DEEPLINK.VERIFY_LINK + link,
      payload: payload,
    };
    let resp = await this.kendra.post(config).toPromise();
    if (resp && resp.result) {
      switch (resp.result.type) {
        case 'improvementProject':
          this.redirectProject(resp.result);
          break;
        case 'observation':
          resp.result.observationId ? this.goToEntities(resp.result) : this.getTemplateDetails(resp.result);
        default:
          break;
      }
    }else{
      if(resp && resp.status){
        this.toast.showMessage('FRMELEMNTS_MSG_INVALID_LINK','danger');
      }
      this.location.back();
    }
  }
}
