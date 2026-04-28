import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  List, ListOrdered, Image as ImageIcon, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Quote, Link as LinkIcon, Unlink, Sparkles, Loader2 
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onRewrite?: (text: string) => Promise<string>;
}

const MenuBar = ({ editor, onRewrite }: { editor: any, onRewrite?: (text: string) => Promise<string> }) => {
  const [isAILoading, setIsAILoading] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien :', previousUrl);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleRewrite = async () => {
    if (!onRewrite) return;
    const { empty, from, to } = editor.state.selection;
    if (empty) return alert("Veuillez sélectionner le texte à reformuler.");
    
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    setIsAILoading(true);
    try {
      const rewrittenText = await onRewrite(selectedText);
      editor.chain().focus().insertContentAt({ from, to }, rewrittenText).run();
    } catch (error) {
      alert("Erreur lors de la reformulation IA.");
    } finally {
      setIsAILoading(false);
    }
  };

  const btnClass = (isActive: boolean) => `p-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-primary/10 text-dark/70'}`;
  const Divider = () => <div className="w-px h-6 bg-primary/20 mx-1"></div>;

  return (
    <div className="flex flex-wrap gap-1.5 p-3 border-b border-primary/20 bg-creamy/50 rounded-t-xl items-center">
      {/* Styles de texte */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><UnderlineIcon size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))}><Strikethrough size={18} /></button>
      
      <Divider />
      
      {/* Titres */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}><Heading3 size={18} /></button>
      
      <Divider />
      
      {/* Alignements */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}><AlignLeft size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}><AlignCenter size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))}><AlignRight size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))}><AlignJustify size={18} /></button>

      <Divider />

      {/* Listes & Citations */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18} /></button>

      <Divider />

      {/* Médias & Liens */}
      <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))}><LinkIcon size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className={btnClass(false)} disabled={!editor.isActive('link')}><Unlink size={18} className={!editor.isActive('link') ? 'opacity-30' : ''} /></button>
      <button type="button" onClick={() => {
        const url = window.prompt('URL de l\'image:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }} className={btnClass(false)}><ImageIcon size={18} /></button>
      
      {/* Bouton IA (Groq) */}
      {onRewrite && (
        <>
          <Divider />
          <button 
            type="button" 
            onClick={handleRewrite}
            disabled={isAILoading}
            className="flex items-center gap-2 p-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity ml-auto text-sm"
          >
            {isAILoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isAILoading ? 'Génération...' : 'Reformuler avec l\'IA'}
          </button>
        </>
      )}
    </div>
  );
};

export const TiptapEditor = ({ content, onChange, onRewrite }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Image, 
      Underline,
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline cursor-pointer' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-emerald max-w-none p-6 min-h-[400px] outline-none font-sans',
      },
    },
  });

  return (
    <div className="border border-primary/20 rounded-xl bg-white shadow-sm flex flex-col">
      <MenuBar editor={editor} onRewrite={onRewrite} />
      <div className="flex-1 overflow-y-auto max-h-[700px] custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};