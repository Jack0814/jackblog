import { Post, User } from './types';

export const ADMIN_USER: User = {
  id: 'u_1',
  name: 'Alex Dev',
  email: 'alex@lumina.dev',
  avatar: 'https://picsum.photos/200',
  role: 'admin',
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p_1',
    title: 'The Future of React Server Components',
    slug: 'future-react-server-components',
    excerpt: 'Exploring how RSCs are changing the landscape of frontend development and what it means for the next generation of web apps.',
    content: `# The Future of React Server Components

React Server Components (RSC) represent a paradigm shift in how we build React applications. By moving component rendering to the server, we can reduce bundle sizes and improve initial load performance.

## Why RSC?

1. **Zero Bundle Size**: Server components don't add to your JS bundle.
2. **Direct Database Access**: Query your DB directly inside your component.
3. **Automatic Code Splitting**: The framework handles it for you.

\`\`\`tsx
// Example of a Server Component
async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
}
\`\`\`

## Conclusion

The transition might be tricky, but the performance gains are undeniable.
    `,
    coverImage: 'https://picsum.photos/800/400?random=1',
    tags: ['React', 'Frontend', 'Performance'],
    status: 'published',
    author: ADMIN_USER,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    readTimeMinutes: 5,
  },
  {
    id: 'p_2',
    title: 'Designing for Dark Mode',
    slug: 'designing-for-dark-mode',
    excerpt: 'Best practices for implementing accessible and visually appealing dark themes in modern web applications.',
    content: `# Designing for Dark Mode

Dark mode is more than just inverting colors. It requires careful consideration of contrast, saturation, and depth.

> "Dark mode isn't just about black backgrounds. It's about reducing luminance while maintaining hierarchy."

## Key Principles

- **Avoid Pure Black**: Use dark greys (e.g., #121212) to reduce eye strain.
- **Desaturate Colors**: Bright colors vibrate against dark backgrounds.
- **Elevation**: Use lighter shades of grey to show depth instead of shadows.

## CSS Variables Strategy

Using CSS variables makes switching themes seamless.

\`\`\`css
:root {
  --bg-primary: #ffffff;
  --text-primary: #121212;
}

[data-theme="dark"] {
  --bg-primary: #121212;
  --text-primary: #ffffff;
}
\`\`\`
    `,
    coverImage: 'https://picsum.photos/800/400?random=2',
    tags: ['Design', 'UI/UX', 'CSS'],
    status: 'published',
    author: ADMIN_USER,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    readTimeMinutes: 3,
  },
  {
    id: 'p_3',
    title: 'My Draft on Microservices',
    slug: 'draft-microservices',
    excerpt: 'Thoughts on when to split the monolith...',
    content: '# Microservices\n\nTo be written...',
    tags: ['Backend', 'Architecture'],
    status: 'draft',
    author: ADMIN_USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTimeMinutes: 1,
  }
];
