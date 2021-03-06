import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { MobTypes } from '../../data/mob-types';
import { LevelRule } from '../../models/level-rule';
import { Backpack } from '../../models/skills/backpack';
import { Beacon, BeaconDefault } from '../../models/skills/beacon';
import { Behavior } from '../../models/skills/behavior';
import { Control } from '../../models/skills/control';
import { Damage } from '../../models/skills/damage';
import { Fire } from '../../models/skills/fire';
import { Heal } from '../../models/skills/heal';
import { Knockback } from '../../models/skills/knockback';
import { Life } from '../../models/skills/life';
import { Lightning } from '../../models/skills/lightning';
import { Pickup } from '../../models/skills/pickup';
import { Poison } from '../../models/skills/poison';
import { Ranged } from '../../models/skills/ranged';
import { Ride } from '../../models/skills/ride';
import { Shield } from '../../models/skills/shield';
import { Slow } from '../../models/skills/slow';
import { Sprint } from '../../models/skills/sprint';
import { Stomp } from '../../models/skills/stomp';
import { Thorns } from '../../models/skills/thorns';
import { Wither } from '../../models/skills/wither';
import { Skilltree } from '../../models/skilltree';
import { Upgrade } from '../../models/upgrade';
import { NbtImportService } from '../../services/nbt-import.service';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';
import { SkilltreeService } from '../../stores/skilltree/skilltree.service';

@Component({
  selector: 'stc-skilltree-import-legacy',
  templateUrl: './skilltree-import-legacy.component.html',
  styleUrls: ['./skilltree-import-legacy.component.scss'],
})
export class SkilltreeImportLegacyComponent implements OnDestroy, OnInit {

  subs = new SubSink();

  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  @ViewChild('selectedSkilltreeNames', { static: true }) selectedSkilltreeNames: MatSelectionList;

  stepCompleted: boolean[] = [false, false, false];
  types = [];
  nbtData: any = null;
  existingSkilltreeIds: string[];
  newSkilltreeNames: string[];
  selectedNewSkilltreeNames: string[];
  renamedSkilltrees: any = {};
  legacyPrefix = 'legacy';

  constructor(
    public snackBar: MatSnackBar,
    public importNbt: NbtImportService,
    private translate: TranslateService,
    private router: Router,
    private skilltreeQuery: SkilltreeQuery,
    private skilltreeService: SkilltreeService,
  ) {
    this.subs.sink = this.skilltreeQuery.skiltreeIds$
      .subscribe((data: string[]) => {
        this.existingSkilltreeIds = data.slice();
      });

    MobTypes.forEach(name => {
      this.types.push({
        name,
        selected: false,
      });
    });
  }

  ngOnInit() {
    this.selectedSkilltreeNames.registerOnChange(v => {
      this.selectedNewSkilltreeNames = v.slice();
      this.stepCompleted[1] = this.selectedNewSkilltreeNames.length > 0;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSelectFile(event) {
    this.stepCompleted[0] = false;
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.loadTypeFromFilename(file.name);
      this.importNbt.importFile(file).subscribe(
        data => {
          this.nbtData = data;
          if (this.nbtData != null) {
            this.stepCompleted[0] = true;
            this.loadNewSkilltreeNames();
            this.stepper.next();
          }
        },
        error => {
          this.translate.get('COMPONENTS__SKILLTREE_IMPORT_LEGACY__INVALID_FILE')
            .subscribe((trans) => {
              this.snackBar.open(trans, null, { duration: 2000 });
            });
          console.error(error);
        },
      );
    }
  }

  loadTypeFromFilename(filename) {
    filename = filename.substr(0, filename.length - 3).toLowerCase();
    if (filename == 'default') {
      this.types.forEach(type => {
        type.selected = true;
      });
    } else {
      this.legacyPrefix = filename;
      this.types.forEach(type => {
        type.selected = type.name.toLowerCase() == filename;
      });
    }
    this.stepCompleted[2] = this.types.filter(t => t.selected).length > 0;
  }

  loadNewSkilltreeNames() {
    if (!this.nbtData) {
      return;
    }
    let data = this.nbtData.value;
    if (data.Skilltrees) {
      let skilltrees: any[] = data.Skilltrees.value.value;

      this.newSkilltreeNames = [];
      this.selectedNewSkilltreeNames = [];
      skilltrees.forEach(skilltree => {
        let oldName = skilltree.Name.value;
        let newName = oldName;
        if (this.legacyPrefix != 'legacy' || this.existingSkilltreeIds.indexOf(newName) != -1) {
          newName = oldName + '-' + this.legacyPrefix;
        }
        if (this.existingSkilltreeIds.indexOf(newName) != -1) {
          newName = oldName + '-' + this.legacyPrefix + '-' + Date.now();
        }

        this.renamedSkilltrees[oldName] = newName;

        this.newSkilltreeNames.push(newName);
        this.selectedNewSkilltreeNames.push(newName);
      });
    }
  }

  toggleMobType(type) {
    type.selected = !type.selected;
    this.stepCompleted[2] = this.types.filter(t => t.selected).length > 0;
  }

  selectAllMobTypes() {
    this.types.forEach(type => {
      type.selected = true;
    });
    this.stepCompleted[2] = true;
  }

  selectNoneMobTypes() {
    this.types.forEach(type => {
      type.selected = false;
    });
    this.stepCompleted[2] = false;
  }

  done() {
    let mobTypes = [];
    this.types.forEach(type => {
      if (type.selected) {
        mobTypes.push(type.name);
      }
    });
    let data = this.nbtData.value;
    if (data.Skilltrees) {
      let skilltrees: any[] = data.Skilltrees.value.value;
      skilltrees.forEach(skilltreeData => {
        let name = skilltreeData.Name.value;
        let id = this.renamedSkilltrees[name];
        if (this.selectedNewSkilltreeNames.indexOf(id) != -1) {
          let skilltree: Skilltree = { id, skills: {}, mobtypes: mobTypes.slice(), messages: [], requirements: [] };

          skilltree.order = skilltreeData.Place.value;
          if (skilltreeData.Permission) {
            skilltree.requirements.push('Permission:' + skilltreeData.Permission.value);
          }
          if (skilltreeData.Display) {
            skilltree.name = skilltreeData.Display.value;
          }
          if (skilltreeData.MaxLevel && skilltreeData.MaxLevel.value != 2147483647) {
            skilltree.maxLevel = skilltreeData.MaxLevel.value;
          }
          if (skilltreeData.RequiredLevel) {
            skilltree.requiredLevel = skilltreeData.RequiredLevel.value;
          }
          if (skilltreeData.Description) {
            skilltree.description = skilltreeData.Description.value.value.slice();
          }
          if (skilltreeData.IconItem) {
            skilltree.icon = {};
            if (skilltreeData.IconItem.value.id) {
              skilltree.icon.material = '' + skilltreeData.IconItem.value.id.value;
            }
            if (skilltreeData.IconItem.value.tag && skilltreeData.IconItem.value.tag.value.ench) {
              skilltree.icon.glowing = true;
            }
          }
          if (skilltreeData.Inherits) {
            skilltree.inheritance = { skilltree: skilltreeData.Inherits.value };
            if (this.renamedSkilltrees[skilltree.inheritance.skilltree]) {
              skilltree.inheritance.skilltree = this.renamedSkilltrees[skilltree.inheritance.skilltree];
            }
          }
          skilltreeData.Level.value.value.forEach(l => {
            let level = l.Level.value;

            if (l.Message) {
              let rule: LevelRule = { exact: [level] };
              skilltree.messages.push({ rule, content: l.Message.value });
            }

            l.Skills.value.value.forEach(s => {
              let skillname = s.Name.value;
              if (skillname == 'Inventory') {
                skillname = 'Backpack';
              }
              if (skillname == 'HPregeneration') {
                skillname = 'Heal';
              }
              if (skillname == 'HP') {
                skillname = 'Life';
              }
              if (!skilltree.skills[skillname]) {
                skilltree.skills[skillname] = [];
              }
              let rule: LevelRule = { exact: [level] };
              let upgrade: Upgrade = this.importSkillData(skillname, s.Properties.value);
              upgrade.rule = rule;

              skilltree.skills[skillname].push(upgrade);
            });
          });

          this.skilltreeService.add(skilltree);
        }
      });

      this.translate.get('COMPONENTS__SKILLTREE_IMPORT_LEGACY__SKILLTREE_IMPORTED')
        .subscribe((trans) => {
          this.snackBar.open(trans, null, { duration: 2000 });
        });
      this.router.navigate(['/']);
    }
  }

  importSkillData(skillname, skill): Upgrade {
    switch (skillname) {
      case 'Beacon': {
        let beacon: Beacon = new BeaconDefault();

        if (skill.range) {
          beacon.range = skill.range.value >= 0 ? '+' + skill.range.value : '' + skill.range.value;
        }
        if (skill.duration) {
          beacon.duration = skill.duration.value >= 0 ? '+' + skill.duration.value : '' + skill.duration.value;
        }
        if (skill.selection_count) {
          beacon.count = skill.selection_count.value >= 0 ? '+' + skill.selection_count.value : '' + skill.selection_count.value;
        }

        let buffs: any = {};
        if (skill.buff_absorption_enable && skill.buff_absorption_level) {
          buffs.absorption = '+' + skill.buff_absorption_level.value;
        }
        if (skill.buff_resistance_enable && skill.buff_resistance_level) {
          buffs.resistance = '+' + skill.buff_resistance_level.value;
        }
        if (skill.buff_jump_boost_enable && skill.buff_jump_boost_level) {
          buffs.jumpBoost = '+' + skill.buff_jump_boost_level.value;
        }
        if (skill.buff_strength_enable && skill.buff_strength_level) {
          buffs.strength = '+' + skill.buff_strength_level.value;
        }
        if (skill.buff_haste_enable && skill.buff_haste_level) {
          buffs.haste = '+' + skill.buff_haste_level.value;
        }
        if (skill.buff_speed_boost_enable && skill.buff_speed_boost_level) {
          buffs.speed = '+' + skill.buff_speed_boost_level.value;
        }
        if (skill.buff_luck_enable) {
          buffs.luck = skill.buff_luck_enable.value == 1;
        }
        if (skill.buff_night_vision_enable) {
          buffs.nightVision = skill.buff_night_vision_enable.value == 1;
        }
        if (skill.buff_invisibility_enable) {
          buffs.invisibility = skill.buff_invisibility_enable.value == 1;
        }
        if (skill.buff_water_breathing_enable) {
          buffs.waterBreathing = skill.buff_water_breathing_enable.value == 1;
        }
        if (skill.buff_fire_resistance_enable) {
          buffs.fireResistance = skill.buff_fire_resistance_enable.value == 1;
        }
        beacon.buffs = buffs;

        return beacon;
      }
      case 'Backpack': {
        let rows = skill.add.value >= 0 ? '+' + skill.add.value : '' + skill.add.value;
        let drop = skill.drop.value == 1;
        return { rows, drop } as Backpack;
      }
      case 'Behavior': {
        let aggro = skill.aggro.value == 1;
        let duel = skill.duel.value == 1;
        let farm = skill.farm.value == 1;
        let friend = skill.friend.value == 1;
        let raid = skill.raid.value == 1;
        return { aggro, duel, farm, friend, raid } as Behavior;
      }
      case 'Control': {
        return { active: true } as Control;
      }
      case 'Damage': {
        let damage = skill.damage_double.value >= 0 ? '+' + skill.damage_double.value : '' + skill.damage_double.value;
        return { damage } as Damage;
      }
      case 'Fire': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let duration = skill.duration.value >= 0 ? '+' + skill.duration.value : '' + skill.duration.value;
        return { chance, duration } as Fire;
      }
      case 'Heal': {
        let health = skill.hp_double.value >= 0 ? '+' + skill.hp_double.value : '' + skill.hp_double.value;
        let timer = skill.time.value >= 0 ? '+' + skill.time.value : '' + skill.time.value;
        return { health, timer } as Heal;
      }
      case 'Life': {
        let health = skill.hp_double.value >= 0 ? '+' + skill.hp_double.value : '' + skill.hp_double.value;
        return { health } as Life;
      }
      case 'Knockback': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        return { chance } as Knockback;
      }
      case 'Lightning': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let damage = skill.damage_double.value >= 0 ? '+' + skill.damage_double.value : '' + skill.damage_double.value;
        return { chance, damage } as Lightning;
      }
      case 'Pickup': {
        let range = skill.range.value >= 0 ? '+' + skill.range.value : '' + skill.range.value;
        let exp = skill.exp_pickup.value == 1;
        return { range, exp } as Pickup;
      }
      case 'Poison': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let duration = skill.duration.value >= 0 ? '+' + skill.duration.value : '' + skill.duration.value;
        return { chance, duration } as Poison;
      }
      case 'Ranged': {
        let damage = skill.damage_double.value >= 0 ? '+' + skill.damage_double.value : '' + skill.damage_double.value;
        let rate = skill.rateoffire.value >= 0 ? '+' + skill.rateoffire.value : '' + skill.rateoffire.value;
        let projectile = skill.projectile.value;
        return { damage, rate, projectile } as Ranged;
      }
      case 'Ride': {
        let jumpHeight = skill.jump_height.value >= 0 ? '+' + skill.jump_height.value : '' + skill.jump_height.value;
        let speed = skill.speed_percent.value >= 0 ? '+' + skill.speed_percent.value : '' + skill.speed_percent.value;
        let active = null;
        if (jumpHeight != '+0' || speed != '+0') {
          active = true;
        }
        return { jumpHeight, speed, active } as Ride;
      }
      case 'Shield': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let redirect = skill.redirection.value >= 0 ? '+' + skill.redirection.value : '' + skill.redirection.value;
        return { chance, redirect } as Shield;
      }
      case 'Slow': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let duration = skill.duration.value >= 0 ? '+' + skill.duration.value : '' + skill.duration.value;
        return { chance, duration } as Slow;
      }
      case 'Sprint': {
        return { active: true } as Sprint;
      }
      case 'Stomp': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let damage = skill.damage.value >= 0 ? '+' + skill.damage.value : '' + skill.damage.value;
        return { chance, damage } as Stomp;
      }
      case 'Thorns': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let reflection = skill.reflection.value >= 0 ? '+' + skill.reflection.value : '' + skill.reflection.value;
        return { chance, reflection } as Thorns;
      }
      case 'Wither': {
        let chance = skill.chance.value >= 0 ? '+' + skill.chance.value : '' + skill.chance.value;
        let duration = skill.duration.value >= 0 ? '+' + skill.duration.value : '' + skill.duration.value;
        return { chance, duration } as Wither;
      }
    }
    return {};
  }
}
