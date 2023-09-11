import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { Plugins } from '@capacitor/core';
const { App, BackgroundTask, LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ChronoService {

  private chronoValue = new BehaviorSubject<number>(0);
  private intervalId?: number;
  private timeInMs: number = 1000; 

  private backgroundTaskId: any;

  constructor() { }

  get chronoValueObservable(): Observable<number> {
    return this.chronoValue.asObservable();
  }

  startChronometer(timeInMs: number): void {
    this.backgroundTaskId = BackgroundTask["beforeExit"](async () => {
      this.chronoValue.next(0);
      this.timeInMs = timeInMs;
      this.startInterval();
    });

  }

  restartChronometer(): void {
    this.startInterval();
  }

  stopChronometer(): void {
    this.clearInterval();
    if (this.backgroundTaskId) {
      BackgroundTask["finish"]({ taskId: this.backgroundTaskId });
    }
  }

  reinitializeChronometer(): void {
    this.clearInterval();
    this.chronoValue.next(0);
  }

  private startInterval(): void {
    this.clearInterval();
    this.intervalId = window.setInterval(() => {
      this.chronoValue.next(this.chronoValue.value + 1000);
    }, this.timeInMs);
  }

  private clearInterval(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
