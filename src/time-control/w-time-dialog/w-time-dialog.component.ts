
import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

import { CLOCK_TYPE, ITime } from '../w-clock/w-clock.component';



@Component({
    styleUrls: ['./w-time-dialog.component.scss'],
    templateUrl: './w-time-dialog.component.html'
})
export class WTimeDialogComponent {

    public userTime: ITime;
    private VIEW_HOURS = CLOCK_TYPE.HOURS;
    private VIEW_MINUTES = CLOCK_TYPE.MINUTES;
    public color: string;
    public layout: 'row' | 'column';
    private closeAfterSelection: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: { time: ITime, color: string, layout: 'row' | 'column', closeAfterSelection: boolean },
        private dialogRef: MatDialogRef<WTimeDialogComponent>) {

        this.userTime = data.time;
        this.color = data.color;
        this.layout = data.layout;
        this.closeAfterSelection = data.closeAfterSelection;
    }

    public revert() {

        this.dialogRef.close(-1);
    }

    public submit() {

        this.dialogRef.close(this.userTime);
    }

    public viewChange(view: CLOCK_TYPE) {
        if (this.closeAfterSelection && view === CLOCK_TYPE.HOURS) {
            this.submit();
        }
    }
}
