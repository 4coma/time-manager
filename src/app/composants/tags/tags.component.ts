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
  selectedTagsForActiveWS: Tag[] = [];

  @Output() tagsUpdated = new EventEmitter<Tag[]>();

  @Output() tagCreation = new EventEmitter<Tag>();


  constructor() { }

  ngOnInit() {}

  filterTags() {    
    if (this.newTag !== '') {
      const query = this.newTag.toLowerCase();
      this.filteredTags = this.tags.filter(tag => 
        tag.label.toLowerCase().startsWith(query) &&
        !this.selectedTagsForActiveWS.some(selectedTag => selectedTag.id === tag.id) // Exclude tags that are already in the selected tags
      );
    } else {
      this.filteredTags = [];
    }
  }

  selectTag(tag: Tag) {
    if(this.selectedTagsForActiveWS.filter(t => t.id === tag.id).length === 0) {
      this.selectedTagsForActiveWS.push(tag);
      this.filteredTags = [];
      this.tagsUpdated.emit(this.selectedTagsForActiveWS);
      this.newTag = '';
    }

  }

  createNewTag() { 
       
    if (this.newTag.trim() !== '') {
      this.currentTag = {
        id: 0,
        label: this.newTag
      }
      
      this.tagCreation.emit(this.currentTag);
      this.selectTag(this.currentTag);

      this.newTag = '';
    }
  }

  removeTag(tag: Tag) {
    const index = this.selectedTagsForActiveWS.indexOf(tag);
    if (index > -1) {
      this.selectedTagsForActiveWS.splice(index, 1);
    }
  }

  get isTagEmpty(): boolean | string {
    return this.newTag && this.newTag.length === 0;
 }

 ngOnChanges(changes: SimpleChanges) {
  if (changes['selectedTagsForActiveWS']) {
      this.selectedTagsForActiveWS = changes['selectedTagsForActiveWS'].currentValue;
  }
}

}
