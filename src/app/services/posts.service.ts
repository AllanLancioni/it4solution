import { Injectable } from '@angular/core';
import { postsCollection } from '../../database-simulation/collections/posts';
import { likesCollection } from '../../database-simulation/collections/likes';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { Data } from '../../database-simulation/database.class';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private router: Router, private usersService: UsersService) { }

  createPost(post: any): Promise<Data> {

    return postsCollection.insert({...post, userId: UsersService.loggedInUser.id});

  }

  async updatePost(post: any): Promise<Data> {

    return postsCollection.update(post.id, post);

  }

  async getPosts(): Promise<Data[]> {

    try {
      let postsResponse = await postsCollection.get({}, [{collectionName: 'user'}]);

      postsResponse = await Promise.all(
        postsResponse.map(async post => ({
          ...post,
          likes: await likesCollection.get({ postId: post.id, type: 0 }, [{collectionName: 'user'}]),
          unlikes: await likesCollection.get({ postId: post.id, type: 1 }, [{collectionName: 'user'}])
        }))
      );
      return postsResponse;
    } catch (err) {
      return Promise.reject();
    }

  }

  getPostById(id: number|string): Promise<Data> {

    return postsCollection.getById(+id, [{collectionName: 'user'}]);

  }

  deletePost(postId: number): Promise<void> {

    return postsCollection.deleteById(postId);

  }

}
