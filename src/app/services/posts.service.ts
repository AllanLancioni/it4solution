import { Injectable } from '@angular/core';
import { posts } from '../../database-simulation/posts';
import { users } from '../../database-simulation/users';
import { likes } from '../../database-simulation/likes';
import {Router} from '@angular/router';
import {UsersService} from './users.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private router: Router, private usersService: UsersService) { }

  createPost(post: any): void {

    posts.lastId++;
    post = {
      ...post,
      id: posts.lastId,
      createDate: new Date(),
      updateDate: new Date(),
      userId: UsersService.loggedInUser.id
    };

    posts.collection.push(post);

    this.router.navigateByUrl('feed');
  }

  updatePost(post: any): void {

    post.id = parseInt(post.id, 10);

    post = {
      ...posts.collection.find(x => x.id === post.id),
      ...post,
      updateDate: new Date(),
    };

    posts.collection.splice(posts.collection.findIndex(x => x.id === post.id), 1, post);

    this.router.navigateByUrl('feed');
  }

  getPosts(): any[] {
    return posts.collection.map(post => ({
      ...post,
      user: users.collection.find(user => user.id === post.userId),
      likes: likes.collection
        .filter(x => x.postId === post.id && x.type === 0)
        .map(x => ({...x, user: users.collection.find(user => user.id === x.userId)})),
      unlikes: likes.collection
        .filter(x => x.postId === post.id && x.type === 1)
        .map(x => ({...x, user: users.collection.find(user => user.id === x.userId)})),
    })).reverse();
  }

  getPostById(id: number|string): any {
    const foundPost = posts.collection.find(post => post.id === id);
    if (!foundPost) {
      Swal.fire('Error 404', `Can not found post with id ${id}.`, 'error');
      return null;
    }
    return {...foundPost, user: users.collection.find(user => user.id === foundPost.userId) };
  }

  deletePost(postId: number): boolean {

    const index = posts.collection.findIndex(x => x.id === postId);
    if (index > -1) {
      posts.collection.splice(index, 1);
      return true;
    }
    return false;
  }

}
