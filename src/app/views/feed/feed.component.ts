import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../services/users.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {LikesService} from '../../services/likes.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  filter: string;
  filteringBy: string = null;
  posts: any[] = [];
  user: any = UsersService.loggedInUser;

  constructor(private postsService: PostsService, private usersService: UsersService, private likesService: LikesService, private router: Router) {
  }

  ngOnInit() {
    this.getPosts();
  }

  edit(post) {
    this.router.navigateByUrl(`post/${post.id}`);
  }

  getPosts() {
    this.posts = this.postsService.getPosts();
  }

  async delete(post) {
    try {
      await Swal.fire('Are you sure?', 'This action is unreversible (until next refresh)!', 'warning');
      const deleted = this.postsService.deletePost(post.id);
      if (deleted) {
        Swal.fire({toast: true, type: 'success', text: 'Deleted!', position: 'bottom-end'});
        this.getPosts();
      } else {
        Swal.fire({toast: true, type: 'error', text: 'Delete failed!', position: 'bottom-end'});
      }

    } catch (e) {}

  }

  like(type: number, postId: number) {
    this.likesService.react(type, postId, this.user.id);
    this.getPosts();
  }

  search() {

    if (!this.filter) {
      return;
    }
    this.posts = this.postsService.getPosts().filter(x =>
      x.title.toLowerCase().includes(this.filter.toLowerCase()) ||
      x.description.toLowerCase().includes(this.filter.toLowerCase()) ||
      x.tags.some(tag => tag.toLowerCase().includes(this.filter.toLowerCase()))
    );
    this.filteringBy = this.filter;
    this.filter = '';
  }

  clearFilter() {
    this.getPosts();
    this.filteringBy = null;
  }

  userLikes(post) {
    return post.likes.map(x => x.user.user).join(', ');
  }
  userUnlikes(post) {
    return post.unlikes.map(x => x.user.user).join(', ');
  }

}
