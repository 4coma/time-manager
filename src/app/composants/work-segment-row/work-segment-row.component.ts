import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/app/interfaces/tag.interface';
import { WorkSegment } from 'src/app/interfaces/workSegment.interface';

@Component({
  selector: 'app-work-segment-row',
  templateUrl: './work-segment-row.component.html',
  styleUrls: ['./work-segment-row.component.scss'],
})
export class WorkSegmentRowComponent  implements OnInit {

// note : WS = workSession / workSegment

  @Input()
  wsRow: WorkSegment= {} as WorkSegment;

  modes: string[] = ['Chrono', 'Timer'];

  selectedMode: string = 'Chrono';

  workSegmentName: string = '';

  tags: Tag[] = [{id:0, label: "example"}];
  selectedTags: Tag[] = [];

  constructor() { }

  ngOnInit() {

  }

  selectModeEvent(event: string) {
    this.selectedMode = event;
  }
  

  updateSelectedTags(tags: Tag[]) {
    this.selectedTags = tags;
  }

  handleInputBlur(value: string) {
    this.workSegmentName = value;

  }


}
