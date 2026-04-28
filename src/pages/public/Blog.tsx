import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (!error && data) setPosts(data);
      setLoading(false);
    };

    fetchPublishedPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-creamy">
      <div className="container mx-auto max-w-6xl">
        
        {/* En-tête du Blog */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-dark mb-4 font-sans"
            >
              Notre <span className="text-primary">Blog</span> Juridique
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-lg text-dark/70 max-w-2xl font-sans"
            >
              Actualités, conseils et décryptages sur le droit des étrangers et les démarches de titres de séjour en France.
            </motion.p>
          </div>

          {/* Barre de recherche */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="relative w-full md:w-72"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-none rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary outline-none font-sans"
            />
          </motion.div>
        </div>

        {/* Grille des articles */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={48} /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-dark/50 text-lg font-sans">Aucun article ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-bento overflow-hidden group flex flex-col h-full"
              >
                <Link to={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden bg-creamy block">
                  {post.cover_image ? (
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/20">
                      <ShieldCheck size={64} />
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs text-dark/50 mb-3 font-sans font-medium">
                    {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors font-sans mb-4 line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <Link to={`/blog/${post.slug}`} className="mt-auto text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Lire la suite <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}