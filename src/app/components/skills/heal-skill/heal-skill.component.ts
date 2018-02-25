import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Heal, HealDefault } from "app/models/skills/Heal";
import { Skilltree } from "../../../models/Skilltree";
import { Upgrade } from "../../../models/Upgrade";
import { Observable } from "rxjs/Observable";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/Skills";
import { Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "app/store/actions/skilltree";

@Component({
  selector: 'app-heal-skill',
  templateUrl: './heal-skill.component.html',
  styleUrls: ['./heal-skill.component.scss']
})
export class HealSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Heal> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;
  selectedUpgrade = -1;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.select(Reducers.getSelectedUpgrades);
    this.selectedSkill$ = this.store.select(Reducers.getSelectedSkill);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltree);
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value) {
    let changes = skilltree.skills;
    if (changes.Heal[changes.Heal.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Heal[skilltree.skills.Heal.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Heal) {
            changes.skills.Heal = [];
          }

          let heal: Heal = Object.assign({rule: result}, new HealDefault);
          changes.skills.Heal.push(heal);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }
}
