import { X } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from 'src/app/_Interfaces/post';
import { AuthService } from 'src/app/_Services/auth.service';
import { PostService } from 'src/app/_Services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts!: IPost[];
  links = ['Relavent', 'Popular'];
  activeLink = this.links[0];
  constructor(private postService: PostService, public auth: AuthService) {}

  ngOnInit() {
    this.postService.getPostsList().subscribe(posts =>{
      this.posts = posts;
    })
  }

  delete(id: string) {
    this.postService.deletePost(id);
  }

  filterPosts(link: any)
  {
    this.activeLink = link;
    if(this.activeLink === this.links[0])
    {
    }else
    {
      this.posts.sort((a,b)=> {
        let aLikesLength = a.likes.length;
        let bLikesLength = b.likes.length;
        if (aLikesLength < bLikesLength) {
          return 1;
        }
        if (aLikesLength > bLikesLength) {
          return -1;
        }
        return 0;

      })
    }
  }
}
