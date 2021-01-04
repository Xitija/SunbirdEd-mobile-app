import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CamelToTitlePipe } from './pipe/camel-to-title.pipe';
import { UtilsService } from '../core/services/utils.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CommonListCardComponent,
  MultipleTypeInputComponent,
  AudioListComponent,
  CommonHeaderComponent,
  DateTypeInputComponent,
  FooterButtonsComponent,
  ImageUploadComponent,
  ItemListCardComponent,
  MatrixTypeInputComponent,
  PageQuestionsComponent,
  QuestionHeadingComponent,
  RadioTypeInputComponent,
  SliderTypeInputComponent,
  RemarksComponent,
  PopoverComponent,
  EntityfilterComponent,
  TextTypeInputComponent,
  ProgressBarComponent,
} from './components';
import { TranslateModule } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Media } from '@ionic-native/media/ngx';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { GetLabelsPipe } from './pipe/get-labels.pipe';
import { ScroreReportMenusComponent } from './components/scrore-report-menus/scrore-report-menus.component';
import { ReportsTextComponent } from './components/reports-text/reports-text.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { MatrixChartComponent } from './components/matrix-chart/matrix-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { QuestionListComponent } from './components/question-list/question-list.component';

@NgModule({
  declarations: [
    CreateTaskComponent,
    MultipleTypeInputComponent,
    RadioTypeInputComponent,
    RemarksComponent,
    DateTypeInputComponent,
    AudioListComponent,
    FooterButtonsComponent,
    ImageUploadComponent,
    MatrixTypeInputComponent,
    PageQuestionsComponent,
    QuestionHeadingComponent,
    SliderTypeInputComponent,
    TextTypeInputComponent,
    CamelToTitlePipe,
    CommonListCardComponent,
    ItemListCardComponent,
    CommonHeaderComponent,
    EntityfilterComponent,
    PopoverComponent,
    ProgressBarComponent,
    GetLabelsPipe,
    ScroreReportMenusComponent,
    ReportsTextComponent,
    PieChartComponent,
    BarChartComponent,
    MatrixChartComponent,
    AttachmentComponent,
    QuestionListComponent,
  ],

  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslateModule, HighchartsChartModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CreateTaskComponent,
    MultipleTypeInputComponent,
    RadioTypeInputComponent,
    RemarksComponent,
    DateTypeInputComponent,
    AudioListComponent,
    FooterButtonsComponent,
    ImageUploadComponent,
    MatrixTypeInputComponent,
    PageQuestionsComponent,
    QuestionHeadingComponent,
    SliderTypeInputComponent,
    CamelToTitlePipe,
    CommonListCardComponent,
    ItemListCardComponent,
    CommonHeaderComponent,
    EntityfilterComponent,
    PopoverComponent,
    TextTypeInputComponent,
    ProgressBarComponent,
    GetLabelsPipe,
    AttachmentComponent,
    ReportsTextComponent,
    PieChartComponent,
    BarChartComponent,
    MatrixChartComponent,
    QuestionListComponent,
  ],
  providers: [
    Camera,
    ImagePicker,
    PhotoLibrary,
    FilePath,
    FileChooser,
    FileOpener,
    AndroidPermissions,
    Diagnostic,
    Media,
    CommonModule,
    HttpClientModule, //TODO:remove after api integration
    ReactiveFormsModule,
  ],
  entryComponents: [
    EntityfilterComponent,
    PopoverComponent,
    CreateTaskComponent,
    ScroreReportMenusComponent,
    QuestionListComponent,
  ],
})
export class SharedModule {}
