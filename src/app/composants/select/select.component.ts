import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent  implements OnInit {

  @Input() modes: any[] = [];
  @Input() selectedMode: any;
  @Input() selectValidity: boolean = true;
  @Output() ionChange = new EventEmitter();

  constructor() { }

  ngOnInit() {}


  onModeChange(event: any) {
    this.ionChange.emit(event);
  }
  
}
