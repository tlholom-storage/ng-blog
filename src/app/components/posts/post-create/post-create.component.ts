import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { finalize, Observable, timestamp } from 'rxjs';
import { IPost } from 'src/app/_Interfaces/post';
import { AuthService } from 'src/app/_Services/auth.service';
import { PostService } from 'src/app/_Services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  content!: string;
  image!: string;
  title!: string;
  tags!: string[];

  saving = 'Create Post';

  uploadPercent!: Observable<number | undefined>;
  currentUser!: User | null;

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private storage: AngularFireStorage
  ) {
    if (this.auth.authenticated) {
      this.auth.currentUser$.subscribe((currentUser) => {
        this.currentUser = currentUser;
      });
    }
  }

  ngOnInit() {}

  createPost() {
    if (!this.currentUser) return;
    const postData = {
      author: this.currentUser!.displayName || this.currentUser!.email,
      authorId: this.currentUser.uid,
      content: this.content,
      image: this.image || null,
      published: Timestamp.now(),
      title: this.title,
      likes: [],
      dislikes: [],
      views: [],
      tags: this.tags,
    } as IPost;
    this.postService.createPost(postData);
    console.log('test', this.postService);
    this.title = '';
    this.content = '';
    this.image = '';

    this.saving = 'Post Created!';
    setTimeout(() => (this.saving = 'Create Post'), 3000);
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    const path = `posts/${file.name}`;
    if (file.type.split('/')[0] !== 'image') {
      return alert('only image files');
    } else {
      const task = this.pushToFireStorage(file, path);
      console.log('Image Uploaded!');
    }
  }

  basePath = 'uploads';
  pushToFireStorage(image: File, path: string) {
    const storageRef = this.storage.ref(`${this.basePath}/${path}`);
    const uploadTask = storageRef.put(image);

    // observe percentage changes
    this.uploadPercent = uploadTask.percentageChanges();
    // get notified when the download URL is available
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((url) => {
            this.image = url;
          });
        })
      )
      .subscribe();
  }

  getUpdatedTags($event: string[])
  {
    this.tags = $event;
  }
}
