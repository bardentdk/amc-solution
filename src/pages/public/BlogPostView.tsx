import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Home, ArrowRight, Loader2, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types';

export default function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      // 1. Récupérer l'article actuel avec sa catégorie
      const { data: postData, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(name, slug)')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error || !postData) {
        navigate('/blog');
        return;
      }
      setPost(postData);

      // 2. Récupérer les catégories actives
      const { data: catData } = await supabase.from('blog_categories').select('*');
      if (catData) setCategories(catData);

      // 3. Récupérer les 3 derniers articles (hors article actuel)
      const { data: recentData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .neq('id', postData.id)
        .order('created_at', { ascending: false })
        .limit(3);
      if (recentData) setRecentPosts(recentData);

      setLoading(false);
    };

    if (slug) fetchAllData();
  }, [slug, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-creamy"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!post) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-creamy selection:bg-primary selection:text-white">
      <div className="container mx-auto max-w-6xl">
        
        {/* --- BREADCRUMBS --- */}
        <nav className="flex items-center gap-2 text-sm text-dark/50 font-sans mb-10 font-medium overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1"><Home size={16} /> Accueil</Link>
          <ChevronRight size={16} />
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          {post.blog_categories && (
            <>
              <ChevronRight size={16} />
              <span className="text-primary">{post.blog_categories.name}</span>
            </>
          )}
          <ChevronRight size={16} />
          <span className="text-dark/80 truncate max-w-[200px] md:max-w-md">{post.title}</span>
        </nav>

        {/* --- LAYOUT PRINCIPAL (Grid) --- */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ARTICLE (Côté Gauche - 2/3) */}
          <article className="lg:w-2/3">
            <header className="mb-10">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-dark mb-6 font-sans leading-tight">
                {post.title}
              </motion.h1>
              <div className="flex items-center gap-6 text-dark/60 font-sans font-medium text-sm">
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"><Calendar size={16} className="text-primary" /> {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                {post.blog_categories && <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"><Tag size={16} className="text-primary" /> {post.blog_categories.name}</span>}
              </div>
            </header>

            {post.cover_image && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 shadow-lg border-8 border-white">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] shadow-sm p-8 md:p-12 prose prose-emerald prose-lg max-w-none font-sans text-dark/80"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* SIDEBAR (Côté Droit - 1/3) */}
          <aside className="lg:w-1/3 flex flex-col gap-8">
            
            {/* Widget: Catégories */}
            <div className="bg-white rounded-3xl shadow-bento p-8">
              <h3 className="text-xl font-bold text-dark mb-6 font-sans flex items-center gap-2"><Tag size={20} className="text-primary" /> Catégories</h3>
              <ul className="space-y-3">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button className="w-full text-left flex items-center justify-between text-dark/70 hover:text-primary font-medium transition-colors group">
                      <span>{cat.name}</span>
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget: Articles récents */}
            <div className="bg-white rounded-3xl shadow-bento p-8 sticky top-28">
              <h3 className="text-xl font-bold text-dark mb-6 font-sans">À lire aussi</h3>
              <div className="flex flex-col gap-6">
                {recentPosts.map(rp => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group flex gap-4 items-center">
                    {rp.cover_image ? (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-transparent group-hover:border-primary/20 transition-all">
                        <img src={rp.cover_image} className="w-full h-full object-cover" alt="" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-creamy shrink-0"></div>
                    )}
                    <div>
                      <h4 className="font-bold text-dark text-sm line-clamp-2 group-hover:text-primary transition-colors font-sans">{rp.title}</h4>
                      <p className="text-xs text-dark/50 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">Lire <ArrowRight size={12} /></p>
                    </div>
                  </Link>
                ))}
                {recentPosts.length === 0 && <p className="text-sm text-dark/50">Aucun autre article disponible.</p>}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}