import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';

import { SatPopover } from './popover.component';
import { SatPopoverAnchor } from './popover-anchor.directive';
import { PopoverAnchoringService } from './popover-anchoring.service';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
    BidiModule,
  ],
  declarations: [
    SatPopover,
    SatPopoverAnchor,
  ],
  exports: [
    SatPopover,
    SatPopoverAnchor,
    BidiModule,
  ],
  providers: [
    PopoverAnchoringService
  ]
})
export class SatPopoverModule {
}
