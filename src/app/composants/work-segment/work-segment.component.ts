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
  tags: Tag[] = [];
  selectedTagsForActiveWS: Tag[] = [];
  workSegmentName: string = '';

  isTimeActive: boolean = false;
  wasSaved: boolean = false;
  wasStarted: boolean = false;
  wasStopped: boolean = false;
  private wasPaused: boolean = false;
  timeValue: number = 0;
  centiSeconds: number = 0;
  private centiSecondsIntervalId?: number;

  userSpecifiedTimerValue:number = 0;

  workSegments: WorkSegment[] = [];

  private subscriptions: Subscription[] = [];

  activeRowIndex: number | null = null;

  isInitializing: boolean = true;

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
          
      if(this.isInitializing && this.workSegments.length > 0){      
        this.handleWSSelection(0);
        this.isInitializing = false;
        this.timeValue = this.workSegments[0].duration;
      }        
    })
  }

//! lier le chrono au ws actif : repartir de handleWSSelection pour permettre enregistrement, lors du click sur un autre
//! ws, du temps écoulé (duration) du ws que l'on quitte
//! régler le souci des centièmes de s qui se remettent à jour

  ngOnInit() {
    this.timerService.getTimerEndObservable().subscribe(() => {
      this.handleTimerEnd();
    });
    this.tagService.o_tags.subscribe((tags: Tag[]) => {
      this.tags = tags;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // changements à effectuer : chaque fois que je crée un nouveau ws dans l'interface, celui-ci doit être
  // sauvegardé en db
  // de sorte que dès que j'ajoute des tags, ceux-ci sont associés au ws en db

  removeWS(id: any){    
    this.workSergmentService.deleteWorkSegment(id);
  } 

  newWSName(name: any){    
    this.updateWS(this.activeRowIndex!, 'label', name); 
  }

  removeTag(tag: any){
    this.selectedTagsForActiveWS = this.workSegments[this.activeRowIndex!].tagRefs?.filter(tagRef => tagRef !== tag.id).map(tagRef => this.tags.find(tag => tag.id === tagRef) as Tag);
    
    this.updateWS(this.activeRowIndex!, 'tagRefs', this.selectedTagsForActiveWS);
  }

  updateWSMode(mode: any){
    this.updateWS(this.activeRowIndex!, 'mode', mode);    
  }


  updateWS(index: number, prop: keyof WorkSegment, value: any){
    
    if(this.workSegments[index]){      
      this.workSegments[index][prop] = value as never;       
      if(prop === 'tagRefs'){
        console.log('updating tagRefs : ', this.selectedTagsForActiveWS);
        
        this.workSegments[index].tagRefs = this.selectedTagsForActiveWS.map(tag => tag.id);
      }
      console.log('updating : ', this.workSegments[index]);
      this.workSergmentService.updateWorkSegment(this.workSegments[index]);
    }
  }

  updateSelectedTagsForWS(selectedTags: Tag[]) {    
    this.selectedTagsForActiveWS = selectedTags;    
    this.workSegments[this.activeRowIndex!].tagRefs = selectedTags.map(t => t.id);
    this.updateWS(this.activeRowIndex!, 'tagRefs', this.workSegments[this.activeRowIndex!].tagRefs);
  }

  async createNewTagAndAddItToWS(tag: Tag){
    
    const newTag = await this.tagService.newTag(tag);
    this.workSegments[this.activeRowIndex!].tagRefs.push(newTag.id);
    this.updateWS(this.activeRowIndex!, 'tagRefs', this.workSegments[this.activeRowIndex!].tagRefs);

  }


  handleWSSelection(index: number) {
    if(!this.isInitializing){
    this.workSegments[this.activeRowIndex!].duration = this.timeValue;
    console.log('duration :  ', this.workSegments[this.activeRowIndex!].duration);
    this.timeValue = this.workSegments[index].duration;

    this.updateWS(this.activeRowIndex!, 'duration', this.workSegments[this.activeRowIndex!].duration);
    }

    this.activeRowIndex = index; // màj de l'index selon le clic
    this.selectedTagsForActiveWS = this.workSegments[this.activeRowIndex!].tagRefs?.map(tagRef => this.tags.find(tag => tag.id === tagRef) as Tag);
    this.selectedMode = this.workSegments[this.activeRowIndex!].mode;
    const selectedDuration = this.workSegments[index].duration;
    this.chronoService.setElapsedTime(selectedDuration);
  }

  // adds a new work segment to the workSegments list
  addWS(){

    const newWS: Partial<WorkSegment> = {
      createdAt: new Date(),
      tagRefs: []
    };

    this.workSegments.push({} as WorkSegment);
    if(this.workSegments.length === 1){
      this.handleWSSelection(0);
    }
    this.workSergmentService.newWorkSegment(newWS);
  }

  handleTimeValueChange(newValue: string) {
    this.timeValue = this.timerService.convertInputFieldValueToMS(newValue);
    this.userSpecifiedTimerValue = this.timerService.convertInputFieldValueToMS(newValue);    
  }

  handleTimerEnd() {
    // your logic when the timer reaches zero, for example:
    this.handleStop();
    this.showToaster();
  }

  handleStart() {  
    console.log('starting');
    
    this.wasStarted = true;  
    this.isTimeActive = true;
    
    if (!this.wasPaused) {
        this.startCentiSecondsInterval(true);  // Reset centiseconds if starting fresh
    } else {
        this.startCentiSecondsInterval();
    }
  
    if(this.selectedMode === 'Chrono') {
      this.chronoService.startChronometer(this.workSegments[this.activeRowIndex!].duration);
    } else if(this.selectedMode === 'Timer') {
      this.timerService.initializeTimer(this.timeValue);
      this.timerService.startTimer(this.userSpecifiedTimerValue);
    } else {
      console.log('Error : unknown mode');
    }
}



  handlePause(){
    this.isTimeActive = false;
    this.stopCentiSecondsInterval();
    this.wasPaused = true;
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
  
  handleStop() {
    console.log('handling stop : ', this.activeRowIndex);
    console.log('workSegments length : ', this.workSegments.length);
    
    this.centiSeconds = 0;
    this.wasPaused = false;
    if(this.activeRowIndex && this.activeRowIndex < this.workSegments.length - 1){
      this.activeRowIndex = this.activeRowIndex + 1;
      console.log('handling stop : ', this.activeRowIndex);

    } else if (this.activeRowIndex && this.activeRowIndex >= this.workSegments.length - 1){
      this.activeRowIndex = null;
    }
  }
  
  private startCentiSecondsInterval(reset: boolean = false) {
    if (reset) {
        this.centiSeconds = 0;
    }
    this.stopCentiSecondsInterval(); 
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

    this.selectedTagsForActiveWS = this.selectedTagsForActiveWS.filter(tag => tag);

    for (const tag of this.selectedTagsForActiveWS) {
      
      const newTag = await this.tagService.newTag(tag);
      newTags.push(newTag);
    }

    const newWorkSegment: WorkSegment = {
      id: 0,
      label: this.workSegmentName,
      createdAt: new Date(),
      endedAt: new Date(),
      duration: duration,
      mode: this.selectedMode,
      tagRefs: newTags.map(tag => tag.id)
    }    

    await this.workSergmentService.newWorkSegment(newWorkSegment);
    
    this.showToaster();
    this.reinitializeForm();
    let testWorkSegments = await this.workSergmentService.getWorkSegments();
    
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
    this.selectedTagsForActiveWS = [];
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
