import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-mode',
  templateUrl: './select-mode.component.html',
  styleUrls: ['./select-mode.component.scss'],
})
export class SelectModeComponent  implements OnInit {

  @Input()
  selectedMode: string = 'Chrono';

  @Output() selectMode = new EventEmitter<string>();
  

  constructor() { }

  ngOnInit() {}

switchModeSelection(selectedMode: string){
  this.selectMode.emit(selectedMode);
}


}
