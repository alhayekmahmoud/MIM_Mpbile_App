import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private appStorage: Storage | null = null;

  constructor(private storage: Storage) {
    // Yes we are calling an async method from the constructor but this is like in the documentation of ionic/storage-angular
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this.appStorage = storage;
  }

  public async set<T>(key: string, value: T): Promise<void> {
    return await this.appStorage?.set(key, value);
  }

  public async get<T>(key: string): Promise<T> {
    return await this.appStorage?.get(key);
  }

  public async remove(key: string): Promise<void> {
    return await this.storage?.remove(key);
  }
}
