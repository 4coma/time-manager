import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Storage } from '@ionic/storage-angular';
import { WorkSegment } from '../interfaces/workSegment.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkSegmentService {

  private $workSegments: BehaviorSubject<WorkSegment[]> = new BehaviorSubject<WorkSegment[]>([]);
  public o_workSegments: Observable<WorkSegment[]> = this.$workSegments.asObservable();

  private storageReady: boolean = false;

  constructor(
    private storageService: LocalStorageService,
    private storage: Storage
  ) {
    this.storageService.o_storage.subscribe((storage) => {
      
      if(storage){
        this.storageReady = true;
        
        this.loadInitialData();
      }
    })
  }

  private async loadInitialData() {
    try {
      const dataFromDb = await this.getWorkSegments();      
      this.$workSegments.next(dataFromDb);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  async newWorkSegment(workSegment: WorkSegment) {
    if (this.storageReady) {
      const workSegments = await this.storage.get('workSegments') || [];
      const maxId = workSegments.reduce((max: number, ws: WorkSegment) => Math.max(max, ws.id || 0), 0);
      workSegment.id = maxId + 1;
      workSegments.push(workSegment);
      await this.storage.set('workSegments', workSegments);
      this.$workSegments.next(workSegments);
    } else {
      throw new Error('Storage not initialized');
    }
  }

  async deleteWorkSegment(id: number) {
    if (this.storageReady) {
      let workSegments = await this.storage.get('workSegments') || [];
      workSegments = workSegments.filter((ws: { id: number; }) => ws.id !== id);
      await this.storage.set('workSegments', workSegments);
      this.$workSegments.next(workSegments);
    } else {
      throw new Error('Storage not initialized');
    }
  }

  async updateWorkSegment(workSegment: WorkSegment) {
    if (this.storageReady) {
      let workSegments = await this.storage.get('workSegments') || [];
      const index = workSegments.findIndex((ws: { id: number; }) => ws.id === workSegment.id);
      if (index !== -1) {
        workSegments[index] = workSegment;
        await this.storage.set('workSegments', workSegments);
        this.$workSegments.next(workSegments);
      } else {
        throw new Error('WorkSegment not found');
      }
    } else {
      throw new Error('Storage not initialized');
    }
  }

  async getWorkSegments(): Promise<WorkSegment[]> {
    const workSegment: WorkSegment[] = await this.storage.get('workSegments') || [];
    return workSegment;
  }

}
