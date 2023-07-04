import { Injectable } from '@angular/core';
import {
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserInfo,
  updateProfile,
  User,
} from '@angular/fire/auth';
import { FirebaseApp } from '@angular/fire/app';
import { concatMap, from, Observable, of } from 'rxjs';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = getAuth(this.firebaseApp);
  public currentUser$ = authState(this.auth);

  constructor(
    private firebaseApp: FirebaseApp,
    private userService: UserService
  ) {}
  get authenticated(): boolean {
    return this.currentUser$ !== null;
  }

  get currentUserId(): string | null {
    if (!this.authenticated) return null;
    let currentUserID = null;

    this.currentUser$.subscribe((currentUser) => {
      currentUserID = currentUser?.uid;
    });
    return currentUserID;
  }

  createNewUserWthEmailAndPassword(userCreationData: {
    email: string;
    password: string;
  }) {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        userCreationData.email,
        userCreationData.password
      )
    );
  }

  updateProfile(profileData: Partial<UserInfo>): Observable<any> {
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Not authenticated');

        return updateProfile(user, profileData);
      })
    );
  }

  loginEmailAndPassword(userToBeSigninData: {
    email: string;
    password: string;
  }) {
    return signInWithEmailAndPassword(
      this.auth,
      userToBeSigninData.email,
      userToBeSigninData.password
    );
  }
  async loginGoogle() {
    // Sign in using a redirect.
    const provider = new GoogleAuthProvider();
    // Start a sign in process for an unauthenticated user.
    provider.addScope('profile');
    provider.addScope('email');
    await signInWithPopup(this.auth, provider).then((result) => {
      const { uid, email } = result.user;
      let dataItem = null;
      console.log(uid);
      this.userService.getCurrentUserProfile(uid).subscribe((data) => {
        data === undefined ? (dataItem = null) : (dataItem = data);
      });

      if (dataItem === null) {
        this.userService.addUser({
          uid,
          email: email!,
          displayName: email!,
          lastLoggedIn: new Date(Date.now()),
        });
      } else if (dataItem !== null) {
        this.userService.updateUser(
          { lastLoggedIn: new Date(Date.now()) },
          uid
        );
      }
    });
  }
  logout() {
    this.auth.signOut();
  }
}
