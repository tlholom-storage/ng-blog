export interface IProfileUser {
  uid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  favouriteTags?: string[];
  lastLoggedIn?: Date;
}
