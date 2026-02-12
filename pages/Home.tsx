import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ChevronRight } from 'lucide-react';
import { storageService } from '../services/storage';
import { Post } from '../types';
import { Badge } from '../components/ui/Badge';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API Fetch
    const allPosts = storageService.getPosts().filter(p => p.status === 'published');
    setPosts(allPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Ideas that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">illuminate</span>.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A collection of thoughts on technology, design, and the future of web development.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-12 space-y-6">
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedTag 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article 
            key={post.id} 
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
          >
            {post.coverImage && (
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex gap-2 mb-3">
                {post.tags.slice(0, 2).map(tag => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <Link to={`/post/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4 flex-1 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-500">
                  <Clock size={14} className="mr-1.5" />
                  {post.readTimeMinutes} min read
                </div>
                <Link 
                  to={`/post/${post.slug}`} 
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center hover:underline"
                >
                  Read more <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </article>
        ))}
        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-20 text-slate-500">
            No posts found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
};
