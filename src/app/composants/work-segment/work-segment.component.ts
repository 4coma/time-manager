import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Tag } from 'src/app/interfaces/tag.interface';
import { WorkSegment } from 'src/app/interfaces/workSegment.interface';
import { ChronoService } from 'src/app/services/chrono.service';
import { TagService } from 'src/app/services/tag.service';
import { TimerService } from 'src/app/services/timer.service';
import { WorkSegmentService } from 'src/app/services/work-segment.service';
import { WorkSegmentListComponent } from '../work-segment-list/work-segment-list.component';

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

  startValidity: boolean = false;
  stopValidity: boolean = false;
  saveValidity: boolean = false;

  isTimeActive: boolean = false;
  wasSaved: boolean = false;
  wasStarted: boolean = false;
  wasStopped: boolean = false;

  selectValidity: boolean = true;

  userSpecifiedTimerValue:number = 0;

  workSegments: WorkSegment[] = [];

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

  ngOnInit() {}

  handleTimeValueChange(newValue: string) {
    this.timeValue = this.timerService.convertInputFieldValueToMS(newValue);
    this.userSpecifiedTimerValue = this.timerService.convertInputFieldValueToMS(newValue);
    
  }

  selectOption(event: any) {
    this.selectedMode = event.detail.value;
    this.checkValidities();
  }

  handleStart() {  
    this.wasStarted = true;  
    if(!this.stopValidity){
      if(this.selectedMode === 'Chrono') {
        this.chronoService.restartChronometer();        
      } else if(this.selectedMode === 'Timer') {
        this.timerService.initializeTimer(this.timeValue);
        this.timerService.startTimer(1000);
      } else {
        console.log('Error : unknown mode');
      }
      this.checkValidities();
    } else if (this.stopValidity){
      if(this.selectedMode === 'Chrono') {
        this.chronoService.startChronometer(1000);
      } else if(this.selectedMode === 'Timer') {
        this.timerService.initializeTimer(this.timeValue);
        this.timerService.startTimer(1000);
      } else {
        console.log('Error : unknown mode');
      }
      this.checkValidities();
    }
  }
  
  handleStop() {
    if(this.selectedMode === 'Chrono') {
      this.chronoService.stopChronometer();
      this.wasStopped = true;
    } else if(this.selectedMode === 'Timer') {
      this.timerService.stopTimer();
      this.wasStopped = true;
    } else {
      console.log('Error : unknown mode');
    }
    this.checkValidities();
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

    this.checkValidities();
  }

  checkStartValidity() {
    this.startValidity = !this.startValidity && (this.workSegmentName !== '' && 
                         this.selectedMode !== undefined && 
                         this.selectedTags.length > 0);
  }

  checkStopValidity() {
    this.stopValidity = !this.stopValidity && (this.workSegmentName !== '' && 
    this.selectedMode !== undefined && 
    this.selectedTags.length > 0);
  }

  checkSaveValidity() {
    this.saveValidity = this.timeValue > 0 && !this.stopValidity;
  }

  checkValidities(){
    this.checkStartValidity();
    this.checkStopValidity();
    this.checkSaveValidity();
    this.checkSelectValidity();    
  }

  checkSelectValidity() {
    this.selectValidity = (!this.wasStarted && this.wasSaved) || 
    (!this.wasStarted && !this.wasSaved);  }

  updateSelectedTags(tags: Tag[]) {
    this.selectedTags = tags;
    this.checkStartValidity();    
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
    this.checkValidities();
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
