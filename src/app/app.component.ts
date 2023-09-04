import { Component } from '@angular/core';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from './interfaces/tag.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  userTags: Tag[] = []; 

  constructor(
    private tagsService: TagService
  ) {
    this.tagsService.o_tags.subscribe((tags: Tag[]) => {
      this.userTags = tags;
    });
  }
}
