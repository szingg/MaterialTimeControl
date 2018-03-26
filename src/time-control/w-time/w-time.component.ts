
import { Component, Input, Output, OnInit, Inject, EventEmitter } from '@angular/core';

import { CLOCK_TYPE, ITime } from '../w-clock/w-clock.component';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'w-time',
  templateUrl: './w-time.component.html',
  styleUrls: ['./w-time.component.scss']
})
export class WTimeComponent implements OnInit {

  @Input() userTime: ITime;
  @Output() userTimeChange: EventEmitter<ITime> = new EventEmitter();
  @Output() viewChange = new EventEmitter<CLOCK_TYPE>();

  @Input() revertLabel: string;
  @Input() submitLabel: string;

  @Output() onRevert: EventEmitter<null> = new EventEmitter();
  @Output() onSubmit: EventEmitter<ITime> = new EventEmitter();

  @Input() color: string;
  @Input() layout: 'row' | 'column' | undefined;

  public VIEW_HOURS = CLOCK_TYPE.HOURS;
  public VIEW_MINUTES = CLOCK_TYPE.MINUTES;
  public currentView: CLOCK_TYPE = this.VIEW_HOURS;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {

    if (!this.userTime) {
      const time = new Date();
      this.userTime = {
        hour: this.is24Hours ? time.getHours() % 24 : time.getHours() % 12,
        minute: time.getMinutes(),
        meriden: time.getHours() > 12 ? 'PM' : 'AM',
        format: this.is24Hours ? 24 : 12
      }
    }

    if (!this.revertLabel) {

      this.revertLabel = 'Cancel'
    }

    if (!this.submitLabel) {

      this.submitLabel = 'Ok'
    }

    if (!this.layout) {
      this.layout = 'row';
    }
  }

  private get is24Hours(): boolean {
    const offset = new Date().getTimezoneOffset() / 60;
    const time = this.datePipe.transform('1999-12-31T' + (18 + offset) + ':00:00.000Z', 'shortTime');
    return time.length === '18:00'.length;
}

  public formatHour(): string {

    if (this.userTime.format === 24) {
      if (this.userTime.hour === 24) {
        return '00';
      } else if (this.userTime.hour < 10) {
        return '0' + String(this.userTime.hour);
      }
    }
    return String(this.userTime.hour);
  }

  public formatMinute(): string {

    if (this.userTime.minute === 0) {
      return '00';
    } else if (this.userTime.minute < 10) {
      return '0' + String(this.userTime.minute);
    } else {
      return String(this.userTime.minute);
    }
  }

  public setCurrentView(type: CLOCK_TYPE) {
    this.viewChange.emit(type);
    this.currentView = type;
  }

  public setMeridien(m: 'PM' | 'AM') {

    this.userTime.meriden = m;
  }

  public revert() {

    this.onRevert.emit();
  }

  public submit() {

    this.onSubmit.emit(this.userTime);
  }

  public emituserTimeChange(event) {

    this.userTimeChange.emit(this.userTime);
  }
}
