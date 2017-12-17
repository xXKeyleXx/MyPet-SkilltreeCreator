import { Component, OnDestroy, OnInit } from "@angular/core";
import { StateService } from "../../../services/state.service";
import { UpgradeAddDialogComponent } from "../../upgrade-add-dialog/upgrade-add-dialog.component";
import { Skill } from "../../../models/Skill";
import { LevelRule } from "../../../util/helpers";
import { Fire, FireDefault } from "../../../models/skills/Fire";
import { ISubscription } from "rxjs/Subscription";
import { MatDialog } from "@angular/material";

@Component({
  selector: 'app-fire-skill',
  templateUrl: './fire-skill.component.html',
  styleUrls: ['./fire-skill.component.scss']
})
export class FireSkillComponent implements OnInit, OnDestroy {

  LevelRule = LevelRule;
  skill: Skill<Fire> = null;

  sub: ISubscription;

  constructor(private state: StateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.sub = this.state.skill.subscribe((skill: Skill<Fire>) => {
      this.skill = skill;
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addUpgrade() {
    if (this.skill) {
      let dialogRef = this.dialog.open(UpgradeAddDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let fire: Fire = Object.assign({rule: result}, new FireDefault);
          this.skill.upgrades.push(fire);
        }
      });
    }
  }
}
