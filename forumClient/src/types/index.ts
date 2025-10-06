// src/types/index.ts

// Décrit la structure d'un utilisateur, tel que retourné par l'API
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user'; //Ajout ici
}

export interface Tag {
  id: number;
  name: string;
}
// Décrit la structure d'un post, notamment pour la liste du forum
export interface Post {
  id: number;
  title: string;
  content: string;
  tag_name: string;
  user_id: number;
  created_at: string; 
  author_username: string; 
}

// Pour les formulaires de connexion et d'inscription
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