import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, User as UserIcon, Tag } from 'lucide-react';
import { storageService } from '../services/storage';
import { Post } from '../types';
import { trackEvent } from '../services/analytics';
import { Badge } from '../components/ui/Badge';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const found = storageService.getPostBySlug(slug);
      setPost(found || null);
      if (found) {
        trackEvent('view_post', { slug: found.slug, title: found.title });
      }
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen pt-32 text-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Progress Bar placeholder - could use scroll listener */}
      <div className="fixed top-0 left-0 h-1 bg-indigo-600 z-50 w-full origin-left scale-x-0 animate-scroll-progress" />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to feed
        </Link>

        <header className="mb-10 text-center">
          <div className="flex justify-center gap-2 mb-6">
            {post.tags.map(tag => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 space-x-6 text-sm">
            <div className="flex items-center">
              <UserIcon size={16} className="mr-2" />
              {post.author.name}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden shadow-lg mb-12 border border-slate-200 dark:border-slate-800">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 md:p-8 flex items-center shadow-inner">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-16 h-16 rounded-full border-2 border-white dark:border-slate-800 mr-6" 
            />
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Written by {post.author.name}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Full-stack developer and UI enthusiast. Creating clean, performant web experiences.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
