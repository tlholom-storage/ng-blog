import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-tags',
  templateUrl: './add-tags.component.html',
  styleUrls: ['./add-tags.component.scss'],
})
export class AddTagsComponent implements OnInit {
  ngOnInit(): void {}
  /*Set the values of these properties
    to use them in the HTML view.*/

  visible = true;
  selectable = true;
  removable = true;

  /*set the separator keys.*/

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  /*create the tags list.*/

  Tags: string[] = [];

  @Output() tagsChangeEvent: EventEmitter<string[]> = new EventEmitter();

  /*our custom add method which will take
      matChipInputTokenEnd event as input.*/
  add(event: MatChipInputEvent): void {
    /*we will store the input and value in local variables.*/

    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      /*the input string will be pushed to the tag list.*/

      this.Tags.push(value);

      this.tagsChangeEvent.emit(this.Tags);
    }

    if (input) {
      /*after storing the input we will clear the input field.*/

      input.value = '';
    }
  }

  /*custom method to remove a tag.*/

  remove(tag: string): void {
    const index = this.Tags.indexOf(tag);

    if (index >= 0) {
      /*the tag of a particular index is removed from the tag list.*/

      this.Tags.splice(index, 1);
      this.tagsChangeEvent.emit(this.Tags);
    }
  }
}
