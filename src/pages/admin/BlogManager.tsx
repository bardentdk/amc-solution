import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon, FolderPlus } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types';
import { Button } from '../../components/ui/Button';
import { TiptapEditor } from '../../components/admin/TiptapEditor';

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({ 
    title: '', slug: '', content: '', published: false, cover_image: '', category_id: '' 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [postsRes, catRes] = await Promise.all([
      supabase.from('blog_posts').select('*, blog_categories(name)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('name')
    ]);
    if (postsRes.data) setPosts(postsRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleAddCategory = async () => {
    const name = prompt("Nom de la nouvelle catégorie :");
    if (name) {
      const { data } = await supabase.from('blog_categories').insert([{ name, slug: generateSlug(name) }]).select().single();
      if (data) {
        setCategories([...categories, data]);
        setCurrentPost({ ...currentPost, category_id: data.id });
      }
    }
  };

  const handleRewriteAI = async (text: string) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Clé API Groq manquante");
    
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-70b-8192", // Excellent modèle de Groq
        messages: [
          { role: "system", content: "Tu es un expert juridique spécialisé dans le droit des étrangers. Reformule le texte fourni pour qu'il soit plus clair, professionnel et convaincant. Ne renvoie QUE le texte reformulé, sans introduction." },
          { role: "user", content: text }
        ],
        temperature: 0.7
      },
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    return response.data.choices[0].message.content;
  };

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.content) return alert('Titre et contenu obligatoires');
    setSaving(true);
    
    let finalImageUrl = currentPost.cover_image;

    // Upload de l'image de couverture si modifiée
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `blog/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('attachments').upload(fileName, imageFile);
      if (!uploadError) {
        const { data } = supabase.storage.from('attachments').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
    }

    const { data: userData } = await supabase.auth.getUser();
    const payload = {
      ...currentPost,
      slug: currentPost.slug || generateSlug(currentPost.title),
      cover_image: finalImageUrl,
      author_id: userData?.user?.id
    };

    if (currentPost.id) {
      await supabase.from('blog_posts').update(payload).eq('id', currentPost.id);
    } else {
      await supabase.from('blog_posts').insert([payload]);
    }

    setSaving(false);
    setIsEditing(false);
    setImageFile(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet article ?')) {
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchData();
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="h-full flex flex-col pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Gestion du Blog</h1>
          <p className="text-dark/60">Gérez vos articles, vos catégories et utilisez l'IA Groq.</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => { setCurrentPost({ title: '', slug: '', content: '', published: false }); setIsEditing(true); }}>
            <Plus size={20} className="mr-2" /> Nouvel Article
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl shadow-bento p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-creamy pb-4">
              <h2 className="text-2xl font-bold text-primary">{currentPost.id ? 'Modifier l\'article' : 'Créer un article'}</h2>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
                <Button variant="primary" onClick={handleSave} isLoading={saving}>Enregistrer</Button>
              </div>
            </div>

            {/* Upload Image & Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-creamy/30 p-6 rounded-2xl border border-creamy">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-dark/80 mb-2">Image de couverture</label>
                <div className="relative aspect-video w-full rounded-xl border-2 border-dashed border-primary/30 overflow-hidden hover:bg-primary/5 transition-colors cursor-pointer group flex flex-col items-center justify-center">
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {imageFile || currentPost.cover_image ? (
                    <img src={imageFile ? URL.createObjectURL(imageFile) : currentPost.cover_image} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-primary/50"><ImageIcon size={32} className="mx-auto mb-2" /><span className="text-sm font-medium">Ajouter une image</span></div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark/80 mb-2">Catégorie</label>
                  <div className="flex gap-2">
                    <select 
                      value={currentPost.category_id || ''} 
                      onChange={(e) => setCurrentPost({...currentPost, category_id: e.target.value})}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="">Sélectionner une catégorie...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <Button variant="outline" type="button" onClick={handleAddCategory}><FolderPlus size={20} /></Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2">Titre</label>
                    <input type="text" value={currentPost.title} onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value, slug: generateSlug(e.target.value) })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark/80 mb-2">Slug</label>
                    <input type="text" value={currentPost.slug} onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark/80 mb-2">Contenu de l'article</label>
              <TiptapEditor 
                content={currentPost.content || ''} 
                onChange={(html) => setCurrentPost({ ...currentPost, content: html })}
                onRewrite={handleRewriteAI}
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" checked={currentPost.published || false} onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })} className="w-5 h-5 accent-primary cursor-pointer" id="pub" />
              <label htmlFor="pub" className="text-sm font-bold text-dark cursor-pointer">Publier l'article pour le rendre visible</label>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl shadow-bento p-6 flex flex-col gap-4">
                {post.cover_image && <div className="h-32 w-full rounded-xl overflow-hidden mb-2"><img src={post.cover_image} alt="" className="w-full h-full object-cover" /></div>}
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.published ? 'bg-primary/10 text-primary' : 'bg-orange-100 text-orange-600'}`}>{post.published ? 'Publié' : 'Brouillon'}</span>
                  <div className="flex gap-2">
                    <button onClick={async () => { await supabase.from('blog_posts').update({published: !post.published}).eq('id', post.id); fetchData(); }} className="text-dark/40 hover:text-primary"><Eye size={18} /></button>
                    <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="text-dark/40 hover:text-blue-500"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(post.id)} className="text-dark/40 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-dark font-sans line-clamp-2">{post.title}</h3>
                <p className="text-xs text-primary font-bold">{post.blog_categories?.name || 'Sans catégorie'}</p>
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}