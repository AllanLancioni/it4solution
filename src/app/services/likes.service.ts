import { Injectable } from '@angular/core';
import { likes } from '../../database-simulation/likes';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  react(type: number, postId: number, userId: number) {
    const like = likes.collection.find(x => x.userId === userId && x.postId === postId);
    if (like) {
      if (like.type === type) {
        likes.collection.splice(likes.collection.indexOf(like), 1);
      } else {
        like.type = type;
      }
    } else {
      likes.lastId++;
      likes.collection.push({id: likes.lastId, type, userId, postId});
    }
  }

  constructor() { }
}
