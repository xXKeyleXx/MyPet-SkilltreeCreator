import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import * as Reducers from "../../store/reducers/index";
import * as LayoutActions from "../../store/actions/layout";
import * as SkilltreeActions from "../../store/actions/skilltree";
import { NavigationEnd, Router } from "@angular/router";
import { RedoAction, UndoAction } from "../../store/reducers/undoable";

@Component({
  selector: 'skilltree-creator',
  templateUrl: './skilltree-creator.component.html',
  styleUrls: ['./skilltree-creator.component.scss']
})
export class SkilltreeCreatorComponent {
  showSidenav$: Observable<boolean>;
  selectedSkilltree$: Observable<string | null>;
  pastStates$: Observable<any[] | null>;
  futureStates$: Observable<any[] | null>;
  isRootPath: boolean = false;

  constructor(private store: Store<Reducers.State>,
              private router: Router) {
    this.showSidenav$ = this.store.select(Reducers.getShowSidenav);
    this.selectedSkilltree$ = this.store.select(Reducers.getSelectedSkilltreeId);
    this.pastStates$ = this.store.select(Reducers.getPastStates);
    this.futureStates$ = this.store.select(Reducers.getFutureStates);

    this.router.events.subscribe(data => {
      if (data instanceof NavigationEnd) {
        this.isRootPath = data.url == "/";
      }
    });
  }

  back() {
    this.router.navigate(["/"]);
  }

  openSidenav() {
    this.store.dispatch(new LayoutActions.OpenSidenavAction());
  }

  closeSidenav() {
    this.store.dispatch(new LayoutActions.CloseSidenavAction());
  }

  save() {
    this.store.dispatch(new LayoutActions.CloseSidenavAction());
    this.store.dispatch(new SkilltreeActions.SaveSkilltreesAction());
  }

  undo() {
    this.store.dispatch(new UndoAction());
  }

  redo() {
    this.store.dispatch(new RedoAction());
  }
}