import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private $storage: Subject<Storage> = new BehaviorSubject<Storage>({} as Storage);
  public o_storage: Observable<Storage> = this.$storage.asObservable();

  constructor(
    private storage: Storage
  ) {
    
    this.init();
  }

  async init() {
  
    const storage = await this.storage.create();
    
    this.$storage.next(storage);
  }
}
