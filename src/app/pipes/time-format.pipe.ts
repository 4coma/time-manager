import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

transform(value: number): any {
  const hours = String(Math.floor(value / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((value % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((value % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(value % 1000).padStart(3, '0');
  
  return {
    hours,
    minutes,
    seconds,
    milliseconds
  };
}


}
