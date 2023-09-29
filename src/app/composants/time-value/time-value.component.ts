import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time-value',
  templateUrl: './time-value.component.html',
  styleUrls: ['./time-value.component.scss'],
})
export class TimeValueComponent implements OnInit {
  @Input()
  timeValue: number = 0;

  @Input()
  centiSeconds: number = 0;

  @Input()
  selectedMode: string = 'Chrono';

  @Input()
  wasStarted: boolean = false;

  @Output() timeValueChange = new EventEmitter<string>();
  userSpecifiedValue: number = 0; 

  @Input() mainFontSize: string = '48px';
  @Input() secondaryFontSize: string = '12px';

  onTimeValueChange(newValue: any) {    
    this.timeValueChange.emit(newValue.target.value);
  }

  constructor() { }

  ngOnInit() {
    console.log('timeValue onInit : ', this.timeValue);
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeValue']) {
      this.timeValue = changes['timeValue'].currentValue;
      console.log('timeValue onChanges : ', this.timeValue);
      
    }
    if (changes['centiSeconds']) {
      this.centiSeconds = changes['centiSeconds'].currentValue;
    }
  }
  
}
