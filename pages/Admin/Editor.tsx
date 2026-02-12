import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Eye, Edit2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { storageService } from '../../services/storage';
import { Post, User } from '../../types';

interface EditorProps {
  user: User;
}

export const Editor: React.FC<EditorProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slug && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, slug]);

  const handleSave = useCallback(async (status: 'draft' | 'published' = 'draft') => {
    if (!title) return alert('Title is required');
    setIsSaving(true);

    const post: Post = {
      id: `p_${Date.now()}`,
      title,
      slug: slug || `post-${Date.now()}`,
      excerpt,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      coverImage,
      status,
      author: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: Math.ceil(content.split(' ').length / 200),
    };

    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    storageService.savePost(post);
    
    setIsSaving(false);
    setLastSaved(new Date());
    
    if (status === 'published') {
      navigate('/');
    }
  }, [title, slug, excerpt, content, tags, coverImage, user, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave('draft');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave('published');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="min-h-screen pt-20 pb-10 bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Editor Header */}
      <header className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-30 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-4 text-slate-500 hover:text-slate-800 dark:hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-sm text-slate-500 hidden sm:block">
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Unsaved changes'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleSave('draft')} isLoading={isSaving}>
            <Save size={16} className="mr-2" />
            Save Draft
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleSave('published')} isLoading={isSaving}>
            Publish
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Settings Sidebar (Mobile: Top) */}
        <aside className="lg:w-80 space-y-6 order-2 lg:order-1">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
              <input 
                value={slug} 
                onChange={e => setSlug(e.target.value)}
                className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Excerpt</label>
              <textarea 
                value={excerpt} 
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
                className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
              <input 
                value={tags} 
                onChange={e => setTags(e.target.value)}
                placeholder="React, Design, Tech"
                className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image URL</label>
              <div className="flex gap-2">
                 <input 
                  value={coverImage} 
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button 
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                  onClick={() => setCoverImage(`https://picsum.photos/800/400?random=${Date.now()}`)}
                  title="Generate Random"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden order-1 lg:order-2 h-[80vh]">
          {/* Title Input */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <input
              type="text"
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold bg-transparent border-none placeholder-slate-300 dark:placeholder-slate-600 outline-none text-slate-900 dark:text-white"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
            <button 
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'write' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-r border-slate-200 dark:border-slate-800' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('write')}
            >
              <Edit2 size={14} className="mr-2" /> Write
            </button>
            <button 
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l border-r border-slate-200 dark:border-slate-800' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              onClick={() => setActiveTab('preview')}
            >
              <Eye size={14} className="mr-2" /> Preview
            </button>
          </div>

          <div className="flex-1 relative">
            {activeTab === 'write' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell your story..."
                className="w-full h-full p-6 resize-none outline-none bg-transparent font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200"
              />
            ) : (
              <div className="w-full h-full p-6 overflow-y-auto prose prose-slate dark:prose-invert max-w-none">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || '*Nothing to preview*'}
                  </ReactMarkdown>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
};