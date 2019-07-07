import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private postsService: PostsService
  ) {}

  async ngOnInit() {

    this.form = this.formBuilder.group({
      id: [this.route.snapshot.params.id ? +this.route.snapshot.params.id : null],
      title: ['', [Validators.required, Validators.maxLength(this.maxTitleSize), Validators.minLength(3)]],
      description:  ['', [Validators.required, Validators.maxLength(this.maxDescriptionSize), Validators.minLength(3)]],
      tags: [[]]
    });

    if (this.route.snapshot.params.id) {
      const foundPost = await this.postsService.getPostById(+this.route.snapshot.params.id);
      if (foundPost) {
        this.form.patchValue(foundPost);
      } else {
        Swal.fire('Error 404', `Can not found post with id ${this.route.snapshot.params.id}`, 'error');
      }
    }
  }

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

  async submit() {

    if (this.form.invalid) {
      Swal.fire('Error', 'Invalid form!', 'error');
      return;
    }
    try {
      if (!this.route.snapshot.params.id) {
        await this.postsService.createPost(this.form.value);
      } else {
        await this.postsService.updatePost(this.form.value);
      }
      this.router.navigateByUrl('feed');

    } catch (err) {
      Swal.fire({toast: true, type: 'error', text: ' failed!', position: 'bottom-end'});
    }




  }

}
