import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { map, Observable } from 'rxjs';
import { IPost } from 'src/app/_Interfaces/post';
import { AuthService } from 'src/app/_Services/auth.service';
import { PostService } from 'src/app/_Services/post.service';

@Component({
  selector: 'app-post-detailed-view',
  templateUrl: './post-detailed-view.component.html',
  styleUrls: ['./post-detailed-view.component.scss'],
})
export class PostDetailedViewComponent implements OnInit, AfterViewInit {
  post$!: Observable<IPost | undefined>;
  editing: boolean = false;
  toBeupdatedPost!: IPost;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.getPost();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const id = this.route.snapshot.paramMap.get('id')!;

    this.post$.subscribe((post) => {
      this.auth.currentUser$
        .pipe(
          map((user) => {
            if (user) {
              this.postService.addView(id, user.email!);
            }
          })
        )
        .subscribe();
    });
  }

  getPost(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.post$ = this.postService.getPostDoc(id);
    this.postService.getPostDoc(id).subscribe((post) => {
      this.toBeupdatedPost = post!;
    });
  }

  updatePost() {
    const formData = {
      title: this.toBeupdatedPost.title,
      content: this.toBeupdatedPost.content,
      tags: this.toBeupdatedPost.tags
    };
    const id = this.route.snapshot.paramMap.get('id')!;
    this.postService.updatePost(formData, id);
    this.editing = false;
  }

  delete() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.postService.deletePost(id);
    this.router.navigate(['/blog']);
  }

  likePost(post: IPost, currentUser: User) {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (post!.likes.includes(currentUser!.email!)) {
      //unliking video
      this.postService.removeLikeByUser(id!, currentUser!.email!);
      return;
    } else {
      this.postService.addLikeByUser(id!, currentUser!.email!);
      this.postService.removeDislikeByUser(id!, currentUser!.email!);
      return;
    }
  }
  dislikePost(post: IPost, currentUser: User) {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (post!.dislikes.includes(currentUser!.email!)) {
      //unliking video
      this.postService.removeDislikeByUser(id!, currentUser!.email!);
      return;
    } else {
      this.postService.addDislikeByUser(id!, currentUser!.email!);
      this.postService.removeLikeByUser(id!, currentUser!.email!);
      return;
    }
  }

  getUpdatedTags($event: string[])
  {
    this.toBeupdatedPost.tags = $event;
  }
}
