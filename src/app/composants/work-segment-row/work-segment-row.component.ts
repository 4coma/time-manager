import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { Tag } from 'src/app/interfaces/tag.interface';
import { WorkSegment } from 'src/app/interfaces/workSegment.interface';

@Component({
  selector: 'app-work-segment-row',
  templateUrl: './work-segment-row.component.html',
  styleUrls: ['./work-segment-row.component.scss'],
})
export class WorkSegmentRowComponent implements OnInit{

  @Input() wsRow: WorkSegment = {} as WorkSegment;
  @Input() tags: Tag[] = [];
  @Input() index: number = 0;
  @Input() activeRowIndex: number | null = null;
  @Output() modeChanged = new EventEmitter<string>();
  @Output() nameChanged = new EventEmitter<string>();
  @Output() elapsedTimeChanged = new EventEmitter<number>();
  @Output() removeWSEvent = new EventEmitter<number>();
  @Output() removeTagEvent = new EventEmitter<Tag>();

  @Input()
  timeValue: number = 0;

  rowTimeValue: number = 0;

  selectedTags: Tag[] = [];

  ngOnInit(): void {    
    this.rowTimeValue = this.wsRow.duration;
  }

  selectModeEvent(mode: string) {
    this.modeChanged.emit(mode);
    
    
  }

  handleInputBlur(event: any) {
    this.nameChanged.emit(event.target.value);
  }

  removeWS(){    
    this.removeWSEvent.emit(this.wsRow.id);
  }

  getWSTags(): Tag[]{
    this.selectedTags = this.wsRow.tagRefs?.map(tagRef => this.tags.find(tag => tag.id === tagRef) as Tag);
    //console.log('selected Tags : ', this.selectedTags);

    if(this.selectedTags && this.selectedTags.length > 0){
      return this.selectedTags;
    } else {
      return [];
    }
  }

  removeTag(tag: Tag) {
    this.removeTagEvent.emit(tag);
  }

  ngOnChanges(changes: SimpleChanges) {

    
    
    if (changes['timeValue']) {
      if(this.activeRowIndex === this.index){
      this.rowTimeValue = changes['timeValue'].currentValue;
      //this.wsRow.duration = this.formatTime(this.timeValue);
      }
    }
  }
  formatTime(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  
}
