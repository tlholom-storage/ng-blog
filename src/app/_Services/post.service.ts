import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayRemove, arrayUnion } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { IPost } from '../_Interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private firestore: AngularFirestore) {
    this.firestore.collection('posts-collection', (ref) =>
      ref.orderBy('published', 'desc')
    );
  }

  getPostDoc(id: string): Observable<IPost | undefined> {
    return this.firestore
      .collection('posts-collection')
      .doc<IPost>(id)
      .valueChanges();
  }

  getPostsList(): Observable<IPost[]> {
    return this.firestore
      .collection('posts-collection')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as IPost;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  createPost(item: IPost) {
    return from(this.firestore.collection('posts-collection').add(item));
  }

  deletePost(id: string) {
    return from(this.firestore.collection('posts-collection').doc(id).delete());
  }

  updatePost(item: Partial<IPost>, id: string) {
    return from(
      this.firestore
        .collection('posts-collection')
        .doc(id)
        .update({
          ...item,
        })
    );
  }
  removeLikeByUser(id: string, currentUserEmail: string) {
    this.firestore
      .collection('posts-collection')
      .doc(id)
      .update({
        ...{ likes: arrayRemove(currentUserEmail) },
      });
  }

  addLikeByUser(id: string, currentUserEmail: string) {
    this.firestore
      .collection('posts-collection')
      .doc(id)
      .update({
        ...{ likes: arrayUnion(currentUserEmail) },
      });
  }

  removeDislikeByUser(id: string, currentUserEmail: string) {
    this.firestore
      .collection('posts-collection')
      .doc(id)
      .update({
        ...{ dislikes: arrayRemove(currentUserEmail) },
      });
  }

  addDislikeByUser(id: string, currentUserEmail: string) {
    this.firestore
      .collection('posts-collection')
      .doc(id)
      .update({
        ...{ dislikes: arrayUnion(currentUserEmail) },
      });
  }

  addView(id: string, currentUserEmail: string) {
    this.firestore
      .collection('posts-collection')
      .doc(id)
      .update({
        ...{ views: arrayUnion(currentUserEmail) },
      });
  }
}
