
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { WTimeDialogComponent } from '../w-time-dialog/w-time-dialog.component';
import { ITime } from '../w-clock/w-clock.component';
import { DatePipe } from '@angular/common';



@Component({
    selector: 'w-mat-timepicker',
    styleUrls: ['./w-mat-timepicker.component.scss'],
    templateUrl: './w-mat-timepicker.component.html'
})

export class WMatTimePickerComponent implements OnInit {

    @Input() userTime: ITime;
    @Output() userTimeChange: EventEmitter<ITime> = new EventEmitter();

    @Input() color: string;

    @Input() layout: 'row' | 'column';

    @Input() closeAfterSelection: boolean;

    constructor(private dialog: MatDialog, private datePipe: DatePipe) { }

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
    }

    private get is24Hours(): boolean {
        const offset = new Date().getTimezoneOffset() / 60;
        const time = this.datePipe.transform('1999-12-31T' + (18 + offset) + ':00:00.000Z', 'shortTime');
        return time.length === '18:00'.length;
    }

    private get time(): string {

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
    }
}
