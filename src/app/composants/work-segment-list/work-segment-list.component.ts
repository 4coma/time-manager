import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WorkSegment } from 'src/app/interfaces/workSegment.interface';

@Component({
  selector: 'app-work-segment-list',
  templateUrl: './work-segment-list.component.html',
  styleUrls: ['./work-segment-list.component.scss'],
})
export class WorkSegmentListComponent  implements OnInit {

@Input()
workSegments: WorkSegment[] = [];

  constructor(
    private modalCtrl: ModalController
  ) {
    
  }

  ngOnInit() {}

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
