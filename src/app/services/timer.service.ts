import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timerValue = new BehaviorSubject<number>(0);
  private centisecondsValue = new BehaviorSubject<number>(0); 
  private intervalId?: number;
  private centisecondsIntervalId?: number; 

  timerEndObservable = new Subject<void>();

  constructor() {}

  get timerValueObservable(): Observable<number> {
    return this.timerValue.asObservable();
  }

  get centisecondsValueObservable(): Observable<number> { 
    return this.centisecondsValue.asObservable();
  }

  initializeTimer(initialValue: number): void {
    this.timerValue.next(initialValue);
    this.centisecondsValue.next(99); 
    console.log('initialValue : ' + initialValue);
  }
  

  getTimerEndObservable() {
    return this.timerEndObservable.asObservable();
  }

  startTimer(timeInMs: number): void {
    this.clearInterval();
  
    this.intervalId = window.setInterval(() => {
      let currentValue = this.timerValue.value;
      if (currentValue > 0) {
        this.timerValue.next(currentValue - 1000);
      } else {
        this.clearInterval();
        this.timerEndObservable.next();
      }
    }, 1000); 
  
    this.centisecondsValue.next(99); 
    this.centisecondsIntervalId = window.setInterval(() => { 
      let currentCentiseconds = this.centisecondsValue.value;
      this.centisecondsValue.next((currentCentiseconds - 1 + 100) % 100); 
      if (currentCentiseconds === 0 && this.timerValue.value === 0) {
        this.clearInterval(); 
      }
    }, 10);
  }
  

  stopTimer(): void {
    this.clearInterval();
  }

  reinitializeTimer(): void {
    this.clearInterval();
    this.timerValue.next(0);
    this.centisecondsValue.next(0); 
  }

  private clearInterval(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    if (this.centisecondsIntervalId !== undefined) { 
      window.clearInterval(this.centisecondsIntervalId);
      this.centisecondsIntervalId = undefined;
    }
  }

  convertInputFieldValueToMS(value: string): number {
    const timeParts = value.split(':');
    if (timeParts.length === 3) {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
    } else {
      console.error('Invalid time format');
      return 0;
    }
  }
}
