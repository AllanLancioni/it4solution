export type Data = {
  id?: number,
  createDate?: Date,
  updateDate?: Date,
  [key: string]: any
};

export interface PopulateParams {
  collectionName: string;
  fieldToMatch?: string;
}

export abstract class Database {

  private static readonly collections: { [key: string]: DatabaseCollection } = {};

  static createCollection(collectionName: string): DatabaseCollection {
    collectionName = collectionName.toLowerCase();
    this.collections[collectionName] = new DatabaseCollection(collectionName);
    return this.collections[collectionName];
  }

  static getCollectionByName(name: string): Promise<DatabaseCollection> {
    if (this.collections[name] instanceof DatabaseCollection) {
      return Promise.resolve(this.collections[name]);
    }
    return Promise.reject();
  }

}

export class DatabaseCollection {

  private lastId: number = 0;

  private get getKeyOnSession() {
    return localStorage.getItem(btoa(this.collectionName)) || null;
  }

  public get hasKeyOnSession() {
    return !!this.getKeyOnSession;
  }

  private readonly collection: Data[] = [];

  get count(): number {
    return this.collection.length;
  }

  constructor(public collectionName: string) {
    this.loadStorage();
  }

  async get(filter: Data = {}, populates?: PopulateParams[]): Promise<Data[]> {

    const data = this.collection.filter(x => Object.keys(filter).every(key => x[key] === filter[key])).reverse();

    if (!populates) {
      return data;
    }

    try {
      return this.execPopulates(data, populates);
    } catch (err) {
      return Promise.reject();
    }
  }

  async getById(id: number, populates?: PopulateParams[]): Promise<Data> {
    if (typeof id !== 'number') {
      return Promise.reject();
    }
    const dataFound = this.collection.find(x => x.id === id);
    if (dataFound) {
      return populates ? (await this.execPopulates(dataFound, populates))[0] : dataFound;
    }
    return Promise.reject();
  }

  private async execPopulates(rawData: Data | Data[], populates: PopulateParams[]): Promise<Data[]> {
    let data = [...(rawData instanceof Array ? rawData : [rawData]).map(x => ({...x}))];
    await Promise.all(
      populates.map(async populate => {
        const collection: DatabaseCollection = await Database.getCollectionByName(populate.collectionName);
        data = await Promise.all(
          data.map(async x => ({
            ...x,
            [populate.collectionName]: await collection.getById(x[populate.fieldToMatch || populate.collectionName + 'Id'])
          }))
        );
      })
    );
    return data;
  }

  insert(data: Data): Promise<Data> {
    data.createDate = new Date();
    data.updateDate = new Date();
    data.id = ++this.lastId;
    this.collection.push(data);
    this.updateStorage();
    return this.getById(this.lastId);
  }

  insertMany(dataArr: Data[]): Promise<Data[]> {
    return Promise.all(dataArr.map(data => this.insert(data)));
  }

  deleteById(id: number): Promise<void> {
    return new Promise((res, rej) => {
      const foundIndex = this.collection.findIndex(x => x.id === id);
      if (foundIndex < 0) {
        return rej();
      }
      this.collection.splice(foundIndex, 1);
      this.updateStorage();
      return res();
    });
  }

  update(id: number, data: Data, patchValues: boolean = true): Promise<Data> {
    return new Promise(async (res, rej) => {
      const foundIndex = this.collection.findIndex(x => x.id === id);
      if (foundIndex < 0) {
        return rej();
      }
      delete data.id;
      delete data.createDate;
      data.updateDate = new Date();

      if (!patchValues) {
        this.collection.splice(foundIndex, 1, {...data, id});
      } else {
        Object.keys(data).forEach(key => this.collection[foundIndex][key] = data[key]);
      }
      this.updateStorage();
      this.getById(id)
        .then((x: Data) => res(x))
        .catch(() => rej());
    });
  }

  async updateOrInsert(query: Data = {}, data: Data, patchValues: boolean = true): Promise<Data> {
    const [dataFound] = this.collection.filter(x => Object.keys(query).every(key => x[key] === query[key]));
    if (dataFound) {
      return this.update(dataFound.id, data, patchValues);
    }
    return this.insert({...data, ...query});
  }

  private loadStorage(): void {
    const items = this.getKeyOnSession;
    if (!items) {
      return;
    }
    this.collection.splice(0, this.collection.length, ...JSON.parse(atob(items)));
    this.lastId = this.collection.sort((a, b) => a.id < b.id ? 1 : -1)[0].id;
  }

  private updateStorage(): void {
    localStorage.setItem(btoa(this.collectionName), btoa(JSON.stringify(this.collection)));
  }

}

