import { Component, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialogRef, MatSnackBar } from "@angular/material";
import { LevelRule } from "../../models/LevelRule";
import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import * as Reducers from "../../store/reducers";
import { Store } from "@ngrx/store";
import { Upgrade } from "../../models/Upgrade";
import { isArray } from "util";

@Component({
  selector: 'stc-upgrade-add-dialog',
  templateUrl: './upgrade-add-dialog.component.html',
  styleUrls: ['./upgrade-add-dialog.component.scss']
})
export class UpgradeAddDialogComponent implements OnDestroy {

  type: number = 0;
  level: number[] = [];
  every: number = 1;
  minimum: number;
  limit: number;

  separatorKeysCodes = [ENTER, COMMA, SPACE];

  levelRules: LevelRule[] = [];
  levelRulessSubscription = null;

  constructor(public dialogRef: MatDialogRef<UpgradeAddDialogComponent>,
              private store: Store<Reducers.State>,
              public snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.levelRulessSubscription = this.store.select(Reducers.getSelectedUpgrades).subscribe(upgrades => {
      this.levelRules = [];
      if (!upgrades) {
        this.dialogRef.close();
        return;
      }
      upgrades.forEach((upgrade: Upgrade) => {
        this.levelRules.push(upgrade.rule);
      })
    });
  }

  ngOnDestroy(): void {
    if (this.levelRulessSubscription) {
      this.levelRulessSubscription.unsubscribe();
    }
  }

  done() {
    let newRule: LevelRule = {};

    if (this.type == 0) {
      newRule.exact = this.level.sort();
    } else if (this.type == 1) {
      newRule.every = this.every;
      newRule.minimum = this.minimum;
      newRule.limit = this.limit;
    }

    let found = this.levelRules.find(rule => {
      return this.compareLevelRule(rule, newRule);
    });
    if (!found) {
      this.dialogRef.close(newRule)
    } else {
      this.snackBar.open("There is already a rule with these values.", "Error", {
        duration: 2000,
      });
    }
  }

  addLevel(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {
      let n = parseInt(value.trim());
      if (!isNaN(n) && this.level.indexOf(n) == -1) {
        this.level.push(n);
      }
    }

    if (input) {
      input.value = '';
    }
  }

  removeLevel(fruit: any): void {
    let index = this.level.indexOf(fruit);

    if (index >= 0) {
      this.level.splice(index, 1);
    }
  }

  compareLevelRule(ruleA: LevelRule, ruleB: LevelRule): any {
    if (this.type == 0) {
      if (isArray(ruleA.exact) && isArray(ruleB.exact)) {
        if (ruleA.exact.slice().sort().join(',') === ruleB.exact.sort().join(',')) {
          return true;
        }
      }
    } else if (this.type == 1) {
      return ruleA.every == ruleB.every && ruleA.limit == ruleB.limit && ruleA.minimum == ruleB.minimum;
    }
    return false;
  }
}
