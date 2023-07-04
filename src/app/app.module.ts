import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavbarComponent } from './components/_Layout/navbar/navbar.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/authentication/login/login.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostDetailedViewComponent } from './components/posts/post-detailed-view/post-detailed-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { LoginEmailComponent } from './components/authentication/login-email/login-email.component';
import { environment } from 'src/environments/environment';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from "@angular/fire/auth";
import { provideStorage, getStorage } from "@angular/fire/storage";
import { AngularFireModule } from '@angular/fire/compat';
import { AddTagsComponent } from './components/add-tags/add-tags.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    PostListComponent,
    PostDetailedViewComponent,
    PostCreateComponent,
    SignupComponent,
    LoginEmailComponent,
    AddTagsComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
