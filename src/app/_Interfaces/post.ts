import { Timestamp } from 'firebase/firestore';

export interface IPost {
  id?: string;
  author: string;
  authorId: string;
  content: string;
  image: string;
  published: Timestamp;
  title: string;
  views: String[];
  likes: string[];
  dislikes: string[];
  tags: string[]
}
