import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChronoService {

  private chronoValue = new BehaviorSubject<number>(0);
  private startTime?: number;
  private elapsedTime: number = 0;
  private intervalId?: number;
  private timeInMs: number = 1000; 

  constructor() {}

  get chronoValueObservable(): Observable<number> {
    return this.chronoValue.asObservable();
  }

  startChronometer(): void {
    if (!this.startTime) {
      this.startTime = new Date().getTime() - this.elapsedTime;
    }
    this.startInterval();
  }

  restartChronometer(): void {
    if (this.startTime !== undefined) {
      this.startTime = new Date().getTime() - this.chronoValue.value;
      this.startInterval();
    }
  }

  stopChronometer(): void {
    this.clearInterval();
    if (this.startTime) {
      this.elapsedTime = new Date().getTime() - this.startTime;
      this.startTime = undefined;
    }
  }

  reinitializeChronometer(): void {
    this.clearInterval();
    this.chronoValue.next(0);
    this.elapsedTime = 0;
    this.startTime = undefined;
  }

  private startInterval(): void {
    this.clearInterval();
    this.intervalId = window.setInterval(() => {
      if (this.startTime !== undefined) {
        const currentTime = new Date().getTime();
        this.chronoValue.next(currentTime - this.startTime);
      }
    }, this.timeInMs);
  }

  private clearInterval(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
