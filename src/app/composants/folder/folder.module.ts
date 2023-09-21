import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FolderPageRoutingModule } from './folder-routing.module';
import { FolderPage } from './folder.page';
import { GenericButtonComponent } from '../generic-button/generic-button.component';
import { WorkSegmentComponent } from '../work-segment/work-segment.component';
import { SelectComponent } from '../select/select.component';
import { TimeFormatPipe } from 'src/app/pipes/time-format.pipe';
import { TimeValueComponent } from '../time-value/time-value.component';
import { TagsComponent } from '../tags/tags.component';
import { WorkSegmentNameComponent } from '../work-segment-name/work-segment-name.component';
import { WorkSegmentListComponent } from '../work-segment-list/work-segment-list.component';
import { WorkSegmentRowComponent } from '../work-segment-row/work-segment-row.component';
import { SelectModeComponent } from '../select-mode/select-mode.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule
  ],
  declarations: [FolderPage, 
    WorkSegmentComponent, 
    GenericButtonComponent, 
    SelectComponent, 
    TimeFormatPipe,
    TimeValueComponent,
    TagsComponent,
    WorkSegmentNameComponent,
    WorkSegmentListComponent,
    WorkSegmentRowComponent,
    SelectModeComponent
  ]
})
export class FolderPageModule {}
