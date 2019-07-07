import { Injectable } from '@angular/core';
import { likesCollection } from '../../database-simulation/collections/likes';
import {Data} from '../../database-simulation/database.class';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  async react(type: number, postId: number, userId: number): Promise<Data|void> {
    const [alreadyLike] = await likesCollection.get({postId, userId, type});
    if (!alreadyLike) {
      return likesCollection.updateOrInsert({userId, postId}, {type});
    }
    return likesCollection.deleteById(alreadyLike.id);
  }

  constructor() { }
}
