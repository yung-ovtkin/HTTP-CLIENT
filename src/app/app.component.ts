
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = '';
  private errorSub = new Subscription;
  constructor(private http: HttpClient, private postsService: PostsService) {}
  ngOnInit(): void {
    this.errorSub = this.postsService.error.subscribe (errorMessage => {
      this.error = errorMessage;
    })
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    },error => {
      this.error = error.message;
    });
  }
  onCreatePost ( postData: Post) {
    this.postsService.createAndStorePost(postData.title, postData.content);
  }
  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
  }
  onClearPosts() {
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  onHandleError() {
    this.error = '';
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}