import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginEmailComponent } from './components/authentication/login-email/login-email.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { PostDetailedViewComponent } from './components/posts/post-detailed-view/post-detailed-view.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['blog']);

const routes: Routes = [
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'login-email',
    component: LoginEmailComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'signup',
    component: SignupComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'blog',
    component: PostListComponent,
  },
  {
    path: 'blog/:id',
    component: PostDetailedViewComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'dashboard',
    component: PostCreateComponent,
    ...canActivate(redirectToLogin),
  },
  { path: '**', redirectTo: 'blog', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
