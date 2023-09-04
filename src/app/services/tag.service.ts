import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tag } from '../interfaces/tag.interface';
import { LocalStorageService } from './local-storage.service';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class TagService {

  private $tags: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);
  public o_tags: Observable<Tag[]> = this.$tags.asObservable();

  private storageReady: boolean = false;

  constructor(
    private storageService: LocalStorageService,
    private storage: Storage
  ) {
    this.storageService.o_storage.subscribe((storage) => {
      if(storage){
        this.storageReady = true;
        this.loadInitialData();
      }
    })
  }

  private async loadInitialData() {
    try {
      const dataFromDb = await this.getTags();
      this.$tags.next(dataFromDb);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  async getTags(): Promise<Tag[]> {
    const workSegment: Tag[] = await this.storage.get('tags') || [];
    return workSegment;
  }

  async newTag(tag: Tag): Promise<Tag>{
    if (this.storageReady) {
      const tags = await this.storage.get('tags') || [];
      const maxId = tags.reduce((max: number, t: Tag) => Math.max(max, t.id || 0), 0);
      tag.id = maxId + 1;
      tags.push(tag);
      await this.storage.set('tags', tags);
      this.$tags.next(tags);
      return tag;
    } else {
      throw new Error('Storage not initialized');
    }
  }

  async deleteTag(id: number) {
    if (this.storageReady) {
      let tags = await this.storage.get('tags') || [];
      tags = tags.filter((t: { id: number; }) => t.id !== id);
      await this.storage.set('tags', tags);
      this.$tags.next(tags);
    } else {
      throw new Error('Storage not initialized');
    }
  }

  async updateTag(tag: Tag) {
    if (this.storageReady) {
      let tags = await this.storage.get('tags') || [];
      const index = tags.findIndex((t: { id: number; }) => t.id === tag.id);
      if (index !== -1) {
        tags[index] = tag;
        await this.storage.set('tags', tags);
        this.$tags.next(tags);
      } else {
        throw new Error('Tag not found');
      }
    } else {
      throw new Error('Storage not initialized');
    }
  }
}
