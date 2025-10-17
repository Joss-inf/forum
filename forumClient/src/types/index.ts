// src/types/index.ts
import type { AxiosRequestConfig } from "axios";
import type { Ref } from "vue";

export interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: (config?: AxiosRequestConfig) => Promise<void>
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user'; 
}

export interface Tag {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tag_name: string;
  user_id: number;
  created_at: string; 
  author_username: string; 
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  created_at: string;
  author_username: string;
}

export interface Params {
  limit: number;
  order: 'ASC' | 'DESC';
  cursorCreatedAt?: string;
  cursorId?: number;
  titleSearch?: string;
  tag?: number;
}

export interface UseCommentSubmitOptions {
  postId: string
  onSuccess?: (comment: Comment) => void
}

export interface AuthForm {
  username?: string;
  email?: string; 
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string; 
  newPassword?: string;
  confirmNewPassword?: string; 
}

export interface ValidationErrors {
  username?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface NewPost {
  title: string;
  content: string;
  tag_id: number | null;
}


export interface OptionType {
  value: string | number | boolean;
  label: string;
}