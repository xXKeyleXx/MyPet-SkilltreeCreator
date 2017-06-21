import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import {OverlayModule, CompatibilityModule} from '../core';
import { MdPopover } from "./popover-directive";
import { MdPopoverTrigger } from "./popover-trigger";
import { MdRippleModule, OverlayModule } from "@angular/material";
export { MdPopover } from './popover-directive';
// export {MdPopoverItem} from './popover-item';
export { MdPopoverTrigger } from './popover-trigger';
export { MdPopoverPanel } from './popover-panel';
export { PopoverPositionX, PopoverPositionY } from './popover-positions';


@NgModule({
  imports: [OverlayModule, CommonModule, MdRippleModule],
  exports: [MdPopover, MdPopoverTrigger],
  declarations: [MdPopover, MdPopoverTrigger],
})
export class MdPopoverModule {
  /** @deprecated */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MdPopoverModule,
      providers: [],
    };
  }
}