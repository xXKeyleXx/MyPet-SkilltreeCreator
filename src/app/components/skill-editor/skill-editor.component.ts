import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { SkillInfo, Skills } from '../../data/skills';
import { SkillUpgradeComponents } from '../../data/upgrade-components';
import { Skilltree } from '../../models/skilltree';
import { LayoutQuery } from '../../stores/layout/layout.query';
import { LayoutService } from '../../stores/layout/layout.service';
import { SkilltreeQuery } from '../../stores/skilltree/skilltree.query';

@Component({
  selector: 'stc-skill-editor',
  templateUrl: './skill-editor.component.html',
  styleUrls: ['./skill-editor.component.scss'],
})
export class SkillEditorComponent implements AfterViewInit, OnDestroy {

  subs = new SubSink();

  skills = Skills;
  selectedSkill: SkillInfo;
  selectedSkill$: Observable<SkillInfo>;
  selectedSkilltree$: Observable<Skilltree>;
  @ViewChild('upgradeComponentContainer', {
    read: ViewContainerRef,
    static: true,
  }) upgradeComponentContainer: ViewContainerRef;
  upgradeComponent = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private skilltreeQuery: SkilltreeQuery,
    private layoutQuery: LayoutQuery,
    private layoutService: LayoutService,
  ) {
    this.selectedSkill$ = this.layoutQuery.skill$;
    this.selectedSkilltree$ = this.skilltreeQuery.selectActive();
  }

  ngAfterViewInit(): void {
    this.subs.sink = this.selectedSkill$.subscribe(value => {
      this.upgradeComponentContainer.clear();
      if (value) {
        this.loadComponent(value);
      }
      if (!this.selectedSkill) {
        this.selectedSkill = value;
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadComponent(skill: SkillInfo) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SkillUpgradeComponents[skill.id]);
    this.upgradeComponent = this.upgradeComponentContainer.createComponent(componentFactory);
  }

  switchSkill(data) {
    this.layoutService.selectSkill(data.value);
  }

  addUpgrade(skilltree) {
    this.upgradeComponent.instance.addUpgrade(skilltree);
  }
}
