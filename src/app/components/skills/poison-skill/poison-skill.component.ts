import { Component } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { MatDialog } from "@angular/material";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { LevelRule } from "../../../util/helpers";
import { Poison, PoisonDefault } from "../../../models/skills/poison";
import { Skill } from "../../../models/skill";
import { Skilltree } from "../../../models/skilltree";
import { Upgrade } from "../../../models/upgrade";
import { Observable } from "rxjs";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/skills";
import { select, Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "../../../store/actions/skilltree";

@Component({
  selector: 'stc-poison-skill',
  templateUrl: './poison-skill.component.html',
  styleUrls: ['./poison-skill.component.scss']
})
export class PoisonSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Poison> = null;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  upgrades$: Observable<{ [id: number]: Upgrade }>;
  selectedUpgrade = -1;

  constructor(private state: StateService,
              private dialog: MatDialog,
              private store: Store<Reducers.State>) {
    this.upgrades$ = this.store.pipe(select(Reducers.getSelectedUpgrades));
    this.selectedSkill$ = this.store.pipe(select(Reducers.getSelectedSkill));
    this.selectedSkilltree$ = this.store.pipe(select(Reducers.getSelectedSkilltree));
  }

  update(skilltree: Skilltree, upgrade: Upgrade, field, value, model) {
    if (model.errors) {
      return;
    }
    let changes = skilltree.skills;
    if (changes.Poison[changes.Poison.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Poison[skilltree.skills.Poison.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Poison) {
            changes.skills.Poison = [];
          }

          let poison: Poison = Object.assign({rule: result}, new PoisonDefault);
          changes.skills.Poison.push(poison);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Poison.splice(skilltree.skills.Poison.indexOf(upgrade), 1);
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    this.selectedUpgrade = -1;
  }

  trackById(index, item) {
    return item.id;
  }
}
