
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';

import { WTimeDialogComponent } from '../w-time-dialog/w-time-dialog.component';
import { ITime } from '../w-clock/w-clock.component';
import { DatePipe } from '@angular/common';



@Component({
    selector: 'w-mat-timepicker',
    styleUrls: ['./w-mat-timepicker.component.scss'],
    templateUrl: './w-mat-timepicker.component.html'
})

export class WMatTimePickerComponent implements OnInit, OnChanges {
    private _is24: boolean;
    @Input() userTime: ITime;
    @Output() userTimeChange: EventEmitter<ITime> = new EventEmitter();

    @Input() date: Date;
    @Output() dateChange: EventEmitter<Date> = new EventEmitter();

    @Input() color: string;

    @Input() layout: 'row' | 'column';

    @Input() closeAfterSelection: boolean;

    constructor(private dialog: MatDialog, private datePipe: DatePipe) { }

    ngOnInit() {
        if (!this.userTime) {
            this.userTime = this.dateToTime(new Date())
        }
        if (!this.date) {
            this.date = new Date();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // tslint:disable-next-line:forin
        for (let change in changes) {
            switch (change) {
                case 'date':
                    if (this.userTime) {
                        const date: Date = <Date>changes['date'].currentValue;
                        this.userTime = this.dateToTime(date);
                    }
                    break;
            }

        }
    }

    private dateToTime(date: Date): ITime {
        return {
            hour: this.is24Hours ? date.getHours() % 24 : date.getHours() % 12,
            minute: date.getMinutes(),
            meriden: date.getHours() > 12 ? 'PM' : 'AM',
            format: this.is24Hours ? 24 : 12
        };
    }

    private timeToDate(time: ITime, date: Date): Date {
        date.setHours(this.is24Hours === false && time.meriden === 'PM' ? time.hour + 12 : time.hour);
        date.setMinutes(time.minute);
        return date;
    }

    private is24HoursFormat(time: ITime): boolean {
        return time && time.format === 24;
    }

    private get is24Hours(): boolean {
        if (!this._is24) {
            const offset = new Date().getTimezoneOffset() / 60;
            const time = this.datePipe.transform('1999-12-31T' + (18 + offset) + ':00:00.000Z', 'shortTime');
            this._is24 = time.length === '18:00'.length;
        }
        return this._is24;
    }

    public get time(): string {

        if (!this.userTime) {
            return '';
        }

        let meriden = `${this.userTime.meriden}`;
        if (this.userTime.format === 24) {
            meriden = '';
        }

        let hour = `${this.userTime.hour}`;
        if (this.userTime.hour === 24) {
            hour = '00';
        }

        if (this.userTime.minute === 0) {
            return `${hour}:00 ${meriden}`;

        } else if (this.userTime.minute < 10) {

            const tt = '0' + String(this.userTime.minute);
            return `${hour}:${tt} ${meriden}`;

        } else {
            return `${hour}:${this.userTime.minute} ${meriden}`;
        }
    }


    public showPicker($event) {

        const dialogRef = this.dialog.open(WTimeDialogComponent, {

            data: {
                time: {
                    hour: this.userTime.hour,
                    minute: this.userTime.minute,
                    meriden: this.userTime.meriden,
                    format: this.userTime.format
                },
                color: this.color,
                layout: this.layout,
                closeAfterSelection: this.closeAfterSelection
            }
        });

        dialogRef.afterClosed()
            .subscribe((result: ITime | -1) => {

                // result will be update userTime object or -1 or undefined (closed dialog w/o clicking cancel)
                if (result === undefined) {
                    return;
                } else if (result !== -1) {
                    this.userTime = result;
                    this.emituserTimeChange();
                }
            });
        return false;
    }

    private emituserTimeChange() {
        this.userTimeChange.emit(this.userTime);
        this.dateChange.emit(this.timeToDate(this.userTime, this.date));
    }
}
