import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timerValue = new BehaviorSubject<number>(0);
  private intervalId?: number;

  constructor() { }

  get timerValueObservable(): Observable<number> {
    return this.timerValue.asObservable();
  }

  initializeTimer(initialValue: number): void {
    this.timerValue.next(initialValue);
    console.log('initialValue : ' + initialValue);
    
  }

  startTimer(timeInMs: number): void {

    this.clearInterval();

    this.intervalId = window.setInterval(() => {
      let currentValue = this.timerValue.value;
      if (currentValue > 0) {
        this.timerValue.next(currentValue - 1000);
      } else {
        this.clearInterval();
      }
    }, timeInMs);
  }

  stopTimer(): void {
    this.clearInterval();
  }

  reinitializeTimer(): void {
    this.clearInterval();
    this.timerValue.next(0);
  }

  private clearInterval(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
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