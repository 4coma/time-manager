import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-work-segment-name',
  templateUrl: './work-segment-name.component.html',
  styleUrls: ['./work-segment-name.component.scss'],
})
export class WorkSegmentNameComponent  implements OnInit {

  @Input() workSegmentName: string = '';

  @Output() inputBlur = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  handleBlur(event: any) {    
    this.inputBlur.emit(event.target.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workSegmentName']) {
        this.workSegmentName = changes['workSegmentName'].currentValue;
    }
  }

}
