import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-generic-button',
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss'],
})
export class GenericButtonComponent  implements OnInit {

  @Input() buttonType: 'start' | 'stop' | 'save' = 'start';
  @Input() validity: boolean = false;
  @Output() buttonClick = new EventEmitter<'start' | 'stop' | 'save'>();

  constructor() { }

  ngOnInit() {}


  handleClick() {
    this.buttonClick.emit(this.buttonType);
  }


}
