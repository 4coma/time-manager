import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Tag } from 'src/app/interfaces/tag.interface';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent  implements OnInit {

  currentTag: Tag = {
    id: 0,
    label: ""
  };

  newTag = '';

  @Input()
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  @Input()
  selectedTags: Tag[] = [];

  @Output() tagsUpdated = new EventEmitter<Tag[]>();


  constructor() { }

  ngOnInit() {}

  filterTags() {
    if (this.currentTag && this.currentTag.label) {
      const query = this.currentTag.label.toLowerCase();
      this.filteredTags = this.tags.filter(tag => 
        tag.label.toLowerCase().startsWith(query) &&
        !this.selectedTags.some(selectedTag => selectedTag.id === tag.id) // Exclude tags that are already in the selected tags
      );
    } else {
      this.filteredTags = [];
    }
  }

  selectTag(tag: Tag) {
    if(this.selectedTags.filter(t => t.id === tag.id).length === 0) {
      this.selectedTags.push(tag);
      this.currentTag = {} as Tag;
      this.filteredTags = [];
    }

  }

  addTag() {    
    if (this.newTag.trim() !== '') {
      this.currentTag = {
        id: 0,
        label: this.newTag
      }
      this.selectedTags.push(this.currentTag);
      this.filteredTags = [];
      this.newTag = '';
    }
    this.tagsUpdated.emit(this.selectedTags);
  }

  removeTag(tag: Tag) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    }
  }

  get isTagEmpty(): boolean | string {
    return this.newTag && this.newTag.length === 0;
 }

 ngOnChanges(changes: SimpleChanges) {
  if (changes['selectedTags']) {
      this.selectedTags = changes['selectedTags'].currentValue;
  }
}

}
