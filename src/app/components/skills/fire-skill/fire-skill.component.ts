import { Component } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/skill";
import { LevelRule } from "../../../util/helpers";
import { Fire, FireDefault } from "../../../models/skills/fire";
import { MatDialog } from "@angular/material";
import { Skilltree } from "../../../models/skilltree";
import { Upgrade } from "../../../models/upgrade";
import { Observable } from "rxjs";
import * as Reducers from "../../../store/reducers";
import { SkillInfo } from "../../../data/skills";
import { select, Store } from "@ngrx/store";
import { UpdateSkilltreeUpgradeAction } from "../../../store/actions/skilltree";

@Component({
  selector: 'stc-fire-skill',
  templateUrl: './fire-skill.component.html',
  styleUrls: ['./fire-skill.component.scss']
})
export class FireSkillComponent {

  LevelRule = LevelRule;
  skill: Skill<Fire> = null;
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
    if (changes.Fire[changes.Fire.indexOf(upgrade)][field] != value) {
      changes = JSON.parse(JSON.stringify(changes));
      changes.Fire[skilltree.skills.Fire.indexOf(upgrade)][field] = value;
      this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    }
  }

  addUpgrade(skilltree: Skilltree) {
    if (skilltree) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let changes = {skills: JSON.parse(JSON.stringify(skilltree.skills))};

          if (!changes.skills.Fire) {
            changes.skills.Fire = [];
          }

          let fire: Fire = Object.assign({rule: result}, new FireDefault);
          changes.skills.Fire.push(fire);
          this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes, id: skilltree.id}))
        }
      });
    }
  }

  deleteRule(skilltree: Skilltree, upgrade) {
    let changes = JSON.parse(JSON.stringify(skilltree.skills));
    changes.Fire.splice(skilltree.skills.Fire.indexOf(upgrade), 1);
    this.store.dispatch(new UpdateSkilltreeUpgradeAction({changes: {skills: changes}, id: skilltree.id}));
    this.selectedUpgrade = -1;
  }

  trackById(index, item) {
    return item.id;
  }
}
