import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { IProfileUser } from '../_Interfaces/profile-user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: AngularFirestore,
  ) {}

  getCurrentUserProfile(id: string): Observable<IProfileUser | undefined> {
    return this.getProfileUserList().pipe(
      map(collection => collection.find(item => item.uid === id))
    );
  }

  getProfileUserList(): Observable<IProfileUser[]> {
    return this.firestore
      .collection('users-collection')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as IProfileUser;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  addUser(user: IProfileUser) {
    return from(this.firestore.collection('users-collection').add(user));
  }

  updateUser(user: Partial<IProfileUser>, id: string): Observable<void> {
    return from(
      this.firestore
        .collection('users-collection')
        .doc(id)
        .update({
          ...user,
        })
    );
  }
}
