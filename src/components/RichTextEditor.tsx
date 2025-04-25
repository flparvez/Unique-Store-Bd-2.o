// components/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import TextAlign from '@tiptap/extension-text-align'
import { useState, useEffect } from 'react'
import EditorMenuBar from './EditorMenuBar'

interface RichTextEditorProps {
  content?: string
  onChange: (content: string) => void
  placeholder?: string
  characterLimit?: number
}

const RichTextEditor = ({
  content = '',
  onChange,
  placeholder = 'Write your product description here...',
  characterLimit = 10000,
}: RichTextEditorProps) => {
  const [hydrated, setHydrated] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'object-cover rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          class: 'text-blue-600 hover:underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: characterLimit,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 border border-gray-300 rounded-b-lg',
      },
    },
  })

  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content)
      setHydrated(true)
    }
  }, [editor, content, hydrated])

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col">
      <EditorMenuBar editor={editor} />
      
      <EditorContent editor={editor} />
      
      {editor.isActive('link') && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex gap-2 p-2 bg-white border border-gray-200 rounded shadow-lg">
            <input
              type="text"
              value={editor.getAttributes('link').href || ''}
              onChange={(e) => editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: e.target.value })
                .run()}
              placeholder="https://example.com"
              className="px-2 py-1 text-sm border rounded"
            />
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </BubbleMenu>
      )}
      
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <div>
          {editor.storage.characterCount.characters()}/{characterLimit} characters
        </div>
        <div>
          {editor.storage.characterCount.words()} words
        </div>
      </div>
    </div>
  )
}

export default RichTextEditor