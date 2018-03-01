import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Skilltree } from "../../models/Skilltree";
import { MobTypes } from "../../data/MobTypes";

@Component({
  selector: 'stc-mob-type-select-dialog',
  templateUrl: './mob-type-select-dialog.component.html',
  styleUrls: ['./mob-type-select-dialog.component.scss']
})
export class MobTypeSelectDialogComponent implements OnInit {
  types = [];

  constructor(public dialogRef: MatDialogRef<MobTypeSelectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private skilltree: Skilltree) {
  }

  ngOnInit(): void {
    MobTypes.forEach(name => {
      this.types.push({
        name,
        selected: this.skilltree.mobtypes.indexOf(name) >= 0
      });
    });
  }

  done() {
    this.dialogRef.close(this.types.filter(type => {
      return type.selected;
    }))
  }

  selectAll() {
    this.types.forEach(type => {
      type.selected = true;
    });
  }

  selectNone() {
    this.types.forEach(type => {
      type.selected = false;
    });
  }
}
