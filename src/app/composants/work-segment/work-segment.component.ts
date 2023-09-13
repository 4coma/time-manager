import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Tag } from 'src/app/interfaces/tag.interface';
import { WorkSegment } from 'src/app/interfaces/workSegment.interface';
import { ChronoService } from 'src/app/services/chrono.service';
import { TagService } from 'src/app/services/tag.service';
import { TimerService } from 'src/app/services/timer.service';
import { WorkSegmentService } from 'src/app/services/work-segment.service';
import { WorkSegmentListComponent } from '../work-segment-list/work-segment-list.component';

import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';
const { App, BackgroundTask, LocalNotifications } = Plugins;

@Component({
  selector: 'app-work-segment',
  templateUrl: './work-segment.component.html',
  styleUrls: ['./work-segment.component.scss'],
})
export class WorkSegmentComponent  implements OnInit {

  modes: string[] = ['Chrono', 'Timer'];
  selectedMode: string = 'Chrono';
  timeValue: number = 0;
  tags: Tag[] = [{id:0, label: "example"}];
  selectedTags: Tag[] = [];
  workSegmentName: string = '';

  isTimeActive: boolean = false;
  wasSaved: boolean = false;
  wasStarted: boolean = false;
  wasStopped: boolean = false;

  centiSeconds: number = 0;
  private centiSecondsIntervalId?: number;

  userSpecifiedTimerValue:number = 0;

  workSegments: WorkSegment[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private chronoService: ChronoService,
    private timerService: TimerService,
    private toaster: ToastController,
    private cdr: ChangeDetectorRef,
    private workSergmentService: WorkSegmentService,
    private tagService: TagService,
    private modalController: ModalController
  ) {
    this.chronoService.chronoValueObservable.subscribe(value => {
      this.timeValue = value;
    });
    this.timerService.timerValueObservable.subscribe(value => {
      this.timeValue = value;
    });
    this.workSergmentService.o_workSegments.subscribe((workSegments: WorkSegment[]) => {
      this.workSegments = workSegments;
    })
  }

  ngOnInit() {
    this.timerService.getTimerEndObservable().subscribe(() => {
      this.handleTimerEnd();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleTimeValueChange(newValue: string) {
    this.timeValue = this.timerService.convertInputFieldValueToMS(newValue);
    this.userSpecifiedTimerValue = this.timerService.convertInputFieldValueToMS(newValue);
    
  }

  selectOption(event: any) {
    this.selectedMode = event.detail.value;
  }

  handleTimerEnd() {
    // your logic when the timer reaches zero, for example:
    this.handleStop();
    this.showToaster();
  }

  handleStart() {  
    this.wasStarted = true;  
    this.startCentiSecondsInterval();
  
    if(this.selectedMode === 'Chrono') {
      this.chronoService.startChronometer();
    } else if(this.selectedMode === 'Timer') {
      this.timerService.initializeTimer(this.timeValue);
      this.timerService.startTimer(this.userSpecifiedTimerValue);
    } else {
      console.log('Error : unknown mode');
    }
  }
  
  handleStop() {
    this.stopCentiSecondsInterval();
  
    if(this.selectedMode === 'Chrono') {
      this.chronoService.stopChronometer();
      this.wasStopped = true;
    } else if(this.selectedMode === 'Timer') {
      this.timerService.stopTimer();
      this.wasStopped = true;
    } else {
      console.log('Error : unknown mode');
    }
  }
  
  private startCentiSecondsInterval() {
    this.stopCentiSecondsInterval(); 
    this.centiSeconds = 0;
    this.centiSecondsIntervalId = window.setInterval(() => {
      if(this.selectedMode === 'Chrono') {
        this.centiSeconds = (this.centiSeconds + 1) % 100;
      } else if(this.selectedMode === 'Timer') {
        this.centiSeconds = (this.centiSeconds - 1 + 100) % 100;
      }
    }, 10);
  }

  private stopCentiSecondsInterval() {
    if (this.centiSecondsIntervalId !== undefined) {
      window.clearInterval(this.centiSecondsIntervalId);
      this.centiSecondsIntervalId = undefined;
    }
  }
  
  async handleSave() {

    let duration:number = 0;
    if(this.selectedMode === 'Chrono'){
      duration = this.timeValue;      
    } else if(this.selectedMode === 'Timer'){
      duration = this.userSpecifiedTimerValue - this.timeValue;
    } else {
      console.log('Error : unknown mode');
    }

    let newTags: Tag[] = [];

    this.selectedTags = this.selectedTags.filter(tag => tag);

    for (const tag of this.selectedTags) {
      
      const newTag = await this.tagService.newTag(tag);
      newTags.push(newTag);
    }

    const newWorkSegment: WorkSegment = {
      id: 0,
      label: this.workSegmentName,
      date: new Date(),
      duration: duration,
      tagRefs: newTags.map(tag => tag.id)
    }    

    await this.workSergmentService.newWorkSegment(newWorkSegment);
    
    this.showToaster();
    this.reinitializeForm();
    let testWorkSegments = await this.workSergmentService.getWorkSegments();
    
  }

  handleInputBlur(value: string) {
    this.workSegmentName = value;

  }


  updateSelectedTags(tags: Tag[]) {
    this.selectedTags = tags;
  }

  reinitializeForm(){
    if(this.selectedMode === 'Chrono'){
      this.chronoService.reinitializeChronometer();
    } else if(this.selectedMode === 'Timer'){
      this.timerService.initializeTimer(this.timeValue);
    } else {
      console.log('Error : unknown mode');
    }
    this.wasStarted = false;
    this.wasSaved = false;
    this.wasStopped = false;
    this.workSegmentName = '';
    this.selectedTags = [];
    this.selectedMode = 'Chrono';
    this.timeValue = 0;
    this.cdr.detectChanges();
  }

  showToaster() {
    this.toaster.create({
      message: 'Work segment saved!',
      duration: 2000
    }).then(toast => toast.present());
  }

  async displayWorkSegmentList() {
    const modal = await this.modalController.create({
      component: WorkSegmentListComponent,
      componentProps: {'workSegments': this.workSegments}
    })
    await modal.present();
  }

}
