import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./components/app/app.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ExampleDataService } from "./services/data.service";
import { MaterialModule } from "@angular/material";
import { SkilltreeListComponent } from "./components/skilltree-list/skilltree-list.component";
import { SkilltreeAddDialogComponent } from "./components/skilltree-add-dialog/skilltree-add-dialog.component";
import { SkilltreePropertiesComponent } from "./components/skilltree-properties/skilltree-properties.component";
import { SkilltreeComponent } from "./components/skilltree/skilltree.component";
import { SkillEditorComponent } from "./components/skill-editor/skill-editor.component";
import { StateService } from "./services/state.service";
import { FireSkillComponent } from "./components/skills/fire-skill/fire-skill.component";
import { SkillEditorUpgradeComponent } from "./components/skill-editor-upgrade/skill-editor-upgrade.component";
import { MobTypeSelectDialogComponent } from "./components/mob-type-select-dialog/mob-type-select-dialog.component";
import { UpgradeAddDialogComponent } from "./components/upgrade-add-dialog/upgrade-add-dialog.component";
import { McChatPipe } from "./pipes/mc-chat.pipe";
import { MdExpansionModule } from "./components/elements/expansion/index";
import { MdPopoverModule } from "./components/elements/popover/index";
import { KnockbackSkillComponent } from "./components/skills/knockback-skill/knockback-skill.component";
import { LightningSkillComponent } from "./components/skills/lightning-skill/lightning-skill.component";
import { PoisonSkillComponent } from "./components/skills/poison-skill/poison-skill.component";
import { RideSkillComponent } from "./components/skills/ride-skill/ride-skill.component";
import { SlowSkillComponent } from "./components/skills/slow-skill/slow-skill.component";
import { StompSkillComponent } from "./components/skills/stomp-skill/stomp-skill.component";
import { ThornsSkillComponent } from "./components/skills/thorns-skill/thorns-skill.component";
import { WitherSkillComponent } from "./components/skills/wither-skill/wither-skill.component";
import { SprintSkillComponent } from "./components/skills/sprint-skill/sprint-skill.component";
import { BeaconSkillComponent } from "./components/skills/beacon-skill/beacon-skill.component";
import { ControlSkillComponent } from "./components/skills/control-skill/control-skill.component";
import { BackpackSkillComponent } from "./components/skills/backpack-skill/backpack-skill.component";
import { BehaviorSkillComponent } from "./components/skills/behavior-skill/behavior-skill.component";
import { DamageSkillComponent } from "./components/skills/damage-skill/damage-skill.component";
import { HealSkillComponent } from "./components/skills/heal-skill/heal-skill.component";
import { HealthBoostSkillComponent } from "./components/skills/health-boost-skill/health-boost-skill.component";
import { PickupSkillComponent } from "./components/skills/pickup-skill/pickup-skill.component";
import { RangedSkillComponent } from "./components/skills/ranged-skill/ranged-skill.component";
import { ShieldSkillComponent } from "./components/skills/shield-skill/shield-skill.component";
import { SkilltreeLoaderService } from "./services/skilltree-loader.service";

import "hammerjs";
import { ContextMenuModule } from "ngx-contextmenu";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from "@ngrx/store";
import { reducer } from "./reducers/index";
import { KeysPipe } from "./pipes/keys.pipe";
import { SkilltreeExistsGuard } from "./guards/skilltree-exists.guard";
import { routes } from "./app.routing";
import { RouterModule } from "@angular/router";
import { RouterStoreModule } from "@ngrx/router-store";
import { SkilltreeEditorComponent } from "./components/skilltree-editor/skilltree-editor.component";
import { EffectsModule } from "@ngrx/effects";
import { SkilltreeEffects } from "./effects/skilltree";

@NgModule({
  declarations: [
    AppComponent,
    SkilltreeListComponent,
    SkilltreeAddDialogComponent,
    SkilltreePropertiesComponent,
    SkilltreeComponent,
    SkillEditorComponent,
    SkillEditorUpgradeComponent,
    MobTypeSelectDialogComponent,
    UpgradeAddDialogComponent,
    McChatPipe,

    BackpackSkillComponent,
    BeaconSkillComponent,
    BehaviorSkillComponent,
    ControlSkillComponent,
    DamageSkillComponent,
    FireSkillComponent,
    HealSkillComponent,
    HealthBoostSkillComponent,
    KnockbackSkillComponent,
    LightningSkillComponent,
    PickupSkillComponent,
    PoisonSkillComponent,
    RangedSkillComponent,
    RideSkillComponent,
    ShieldSkillComponent,
    SlowSkillComponent,
    SprintSkillComponent,
    StompSkillComponent,
    ThornsSkillComponent,
    WitherSkillComponent,
    KeysPipe,
    SkilltreeEditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdExpansionModule,
    MdPopoverModule,
    ContextMenuModule,
    RouterModule.forRoot(routes, {useHash: true}),
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(SkilltreeEffects),
  ],
  entryComponents: [
    SkilltreeAddDialogComponent,
    MobTypeSelectDialogComponent,
    UpgradeAddDialogComponent,
  ],
  providers: [
    StateService,
    ExampleDataService,
    SkilltreeLoaderService,
    SkilltreeExistsGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
