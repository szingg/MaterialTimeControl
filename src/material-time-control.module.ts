
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
    MatButtonModule, MatButtonToggleModule,
    MatDialogModule, MatIconModule, MatInputModule,
    MatSelectModule, MatToolbarModule,
    MatFormFieldModule
} from '@angular/material';

import { WMatTimePickerComponent } from './time-control/w-mat-timepicker/w-mat-timepicker.component';
import { WTimeDialogComponent } from './time-control/w-time-dialog/w-time-dialog.component';
import { WClockComponent } from './time-control/w-clock/w-clock.component';
import { WTimeComponent } from './time-control/w-time/w-time.component';


@NgModule({
  declarations: [
    WMatTimePickerComponent,
    WTimeDialogComponent,
    WClockComponent,
    WTimeComponent,
  ],
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [
    WMatTimePickerComponent,
    WTimeDialogComponent,
    WClockComponent,
    WTimeComponent,
  ],
  providers: [
    DatePipe
  ],
  entryComponents: [
    WTimeDialogComponent
  ]
})
export class MaterialTimeControlModule { }
