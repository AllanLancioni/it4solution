import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '../../services/posts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  form: FormGroup;
  maxTitleSize: number = 30;
  maxDescriptionSize: number = 200;

  get descriptionSize() {
    return Math.min(this.form.controls.description.value.length / this.maxDescriptionSize * 100, 100);
  }

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private postsService: PostsService) {

    this.form = formBuilder.group({
      id: [route.snapshot.params.id || null],
      title: ['', [Validators.required, Validators.maxLength(this.maxTitleSize), Validators.minLength(3)]],
      description:  ['', [Validators.required, Validators.maxLength(this.maxDescriptionSize), Validators.minLength(3)]],
      tags: [[]]
    });

    if (route.snapshot.params.id) {
      const foundPost = this.postsService.getPostById(parseInt(route.snapshot.params.id, 10));
      if (foundPost) {
        this.form.patchValue(foundPost);
      } else {
        Swal.fire('Error 404', `Can not found post with id ${route.snapshot.params.id}`, 'error');
      }
    }
  }

  ngOnInit() {}

  changeTag(e: any) {
    e.target.value = e.target.value.replace(/[\s,]/, '');
    if (e.keyCode === 13 || e.keyCode === 188) {
      const value = e.target.value.trim();
      if (!value || this.form.controls.tags.value.find(x => x.toLowerCase() === value.toLowerCase())) {
        return;
      }
      this.form.controls.tags.value.push(value);
      e.target.value = '';
    }
  }

  removeTag(tag: string) {
    this.form.controls.tags.value.splice(this.form.controls.tags.value.find(x => x === tag), 1);
  }

  submit() {

    if (this.form.invalid) {
      Swal.fire('Error', 'Invalid form!', 'error');
      return;
    }
    if (!this.route.snapshot.params.id) {
      this.postsService.createPost(this.form.value);
    } else {
      this.postsService.updatePost(this.form.value);
    }
  }

}
