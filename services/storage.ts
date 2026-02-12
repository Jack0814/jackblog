import { Post, User } from '../types';
import { MOCK_POSTS, ADMIN_USER } from '../constants';

const KEYS = {
  POSTS: 'lumina_posts',
  USER: 'lumina_user',
  THEME: 'lumina_theme',
};

// Initialize DB if empty
const init = () => {
  const existing = localStorage.getItem(KEYS.POSTS);
  if (!existing) {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(MOCK_POSTS));
  }
};

init();

export const storageService = {
  getPosts: (): Post[] => {
    const data = localStorage.getItem(KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  },

  getPostBySlug: (slug: string): Post | undefined => {
    const posts = storageService.getPosts();
    return posts.find((p) => p.slug === slug);
  },

  savePost: (post: Post): void => {
    const posts = storageService.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  },

  deletePost: (id: string): void => {
    const posts = storageService.getPosts();
    const newPosts = posts.filter((p) => p.id !== id);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(newPosts));
  },

  // Mock Auth
  login: async (password: string): Promise<User | null> => {
    // Mock simple password check
    if (password === 'admin123') {
      localStorage.setItem(KEYS.USER, JSON.stringify(ADMIN_USER));
      return ADMIN_USER;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.USER);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  }
};
