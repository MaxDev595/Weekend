import '../assets/sccs/home.scss'
import { useEffect, useState, useRef } from 'react'


type Story = {
    id: number
    text: string
    image?: string
    author: string
    picture?: string
    createdAt: number
}
function Home() {
    const [modalOpen, setModalOpen] = useState(false)
    const [activeStory, setActiveStory] = useState<Story | null>(null)
    const [storyModalOpen] = useState(false)
    const [text, setText] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set())
    const [commentText, setCommentText] = useState<Record<number, string>>({})
    const [shareMsg, setShareMsg] = useState<string | null>(null)
    const [bookmarkMsg, setBookmarkMsg] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const fetchPosts = async () => {
        try {
            const res = await fetch('http://localhost:3000/posts')
            if (!res.ok) return
            const data = await res.json()
            const fetched = Array.isArray(data) ? data : data?.value ?? []
            setPosts(fetched)
            localStorage.setItem('posts', JSON.stringify(fetched))
        } catch (err) {
            console.warn('Не удалось загрузить посты', err)
        }
    }

    useEffect(() => {
        fetchPosts()
        // Восстановить лайки и закладки из localStorage
        const savedLikes = JSON.parse(localStorage.getItem('likedIds') || '[]')
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]')
        setLikedPosts(new Set(savedLikes))
        setBookmarkedPosts(new Set(savedBookmarks))
    }, [])

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setImage(url)
        }
    }

    const handleClose = () => {
        setModalOpen(false)
        setText('')
        setImage(null)
        setError(null)
    }

    const handlePublish = async () => {
        if (!user?.email) {
            setError('Пользователь не найден. Авторизуйтесь снова.')
            return
        }
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, image, email: user.email, name: user.name, picture: user.picture })
            })
            if (!response.ok) {
                const data = await response.json()
                setError(data?.error || 'Ошибка при публикации поста')
                return
            }
            const createdPost = await response.json()
            setText('')
            setImage(null)
            setModalOpen(false)
            setPosts((prev) => {
                const updated = [createdPost, ...prev]
                localStorage.setItem('posts', JSON.stringify(updated))
                return updated
            })
        } catch {
            setError('Сетевая ошибка. Проверьте сервер.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' })
        setPosts((prev) => {
            const updated = prev.filter((p) => p.id !== id)
            localStorage.setItem('posts', JSON.stringify(updated))
            return updated
        })
    }

    const handleLike = (id: number) => {
        const isLiked = likedPosts.has(id)
        const next = new Set(likedPosts)
        isLiked ? next.delete(id) : next.add(id)
        setLikedPosts(next)
        localStorage.setItem('likedIds', JSON.stringify([...next]))

        // Сохранить лайкнутые посты для страницы /likes
        const post = posts.find((p) => p.id === id)
        const saved: any[] = JSON.parse(localStorage.getItem('likedPosts') || '[]')
        if (isLiked) {
            localStorage.setItem('likedPosts', JSON.stringify(saved.filter((p) => p.id !== id)))
        } else if (post) {
            localStorage.setItem('likedPosts', JSON.stringify([post, ...saved.filter((p) => p.id !== id)]))
        }

        setPosts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, likes: isLiked ? Math.max(0, (p.likes ?? 0) - 1) : (p.likes ?? 0) + 1 } : p
            )
        )
    }

    const handleBookmark = (id: number) => {
        const isBookmarked = bookmarkedPosts.has(id)
        const next = new Set(bookmarkedPosts)
        isBookmarked ? next.delete(id) : next.add(id)
        setBookmarkedPosts(next)
        localStorage.setItem('bookmarkedIds', JSON.stringify([...next]))

        // Сохранить закладки для страницы /bookmarks
        const post = posts.find((p) => p.id === id)
        const saved: any[] = JSON.parse(localStorage.getItem('bookmarks') || '[]')
        if (isBookmarked) {
            localStorage.setItem('bookmarks', JSON.stringify(saved.filter((p) => p.id !== id)))
            setBookmarkMsg('Удалено из закладок')
        } else if (post) {
            localStorage.setItem('bookmarks', JSON.stringify([post, ...saved.filter((p) => p.id !== id)]))
            setBookmarkMsg('🔖 Сохранено в закладки')
        }
        setTimeout(() => setBookmarkMsg(null), 2500)
    }

    const handleComment = (id: number) => {
        const comment = commentText[id]?.trim()
        if (!comment) return
        setPosts((prev) =>
            prev.map((post) =>
                post.id === id
                    ? { ...post, comments: [...(post.comments ?? []), { id: Date.now(), text: comment, author: user.name || 'Я' }] }
                    : post
            )
        )
        setCommentText((prev) => ({ ...prev, [id]: '' }))
    }

    const handleShare = async (post: any) => {
        const shareText = [post.text, post.image].filter(Boolean).join('\n')
        if (navigator.share) {
            try {
                await navigator.share({ title: `Пост от ${post.author?.name}`, text: post.text || '', url: post.image || window.location.href })
            } catch { }
        } else {
            try {
                await navigator.clipboard.writeText(shareText || window.location.href)
                setShareMsg('Скопировано в буфер обмена')
                setTimeout(() => setShareMsg(null), 2500)
            } catch {
                setShareMsg('Не удалось скопировать')
                setTimeout(() => setShareMsg(null), 2500)
            }
        }
    }

    const [stories, setStories] = useState<Story[]>([])
    const [storyText, setStoryText] = useState('')
    const [storyImage, setStoryImage] = useState('')
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const saved = localStorage.getItem('stories')
        if (saved) {
            setStories(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        if (!modalOpen) return
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setModalOpen(false)
            }
        }
        window.addEventListener('keydown', handleEscape)
        return () => window.removeEventListener('keydown', handleEscape)
    }, [modalOpen])

    const saveStories = (nextStories: Story[]) => {
        setStories(nextStories)
        localStorage.setItem('stories', JSON.stringify(nextStories))
    }

    const closeModal = () => {
        setModalOpen(false)
        setStoryText('')
        setStoryImage('')
    }

    const createStory = () => {
        if (!storyText.trim() && !storyImage.trim()) return

        const story: Story = {
            id: Date.now(),
            text: storyText.trim(),
            image: storyImage.trim() || undefined,
            author: user.name || 'Я',
            picture: user.picture || undefined,
            createdAt: Date.now()
        }

        saveStories([story, ...stories])
        closeModal()
    }

    const closeActiveStory = () => {
        setActiveStory(null)
    }

    const deleteStory = (id: number) => {
        const nextStories = stories.filter((story) => story.id !== id)
        saveStories(nextStories)
        setActiveStory(null)
    }


    return (<>
        <div className="home">
            <div className="home-wrapper">
                <div className="home-main main">
                    {shareMsg && <div className="share-toast">{shareMsg}</div>}
                    {bookmarkMsg && <div className="bookmark-toast">{bookmarkMsg}</div>}

                    <div className="create-post" onClick={() => setModalOpen(true)}>
                        <img src={user.picture} alt="avatar" className="create-post__avatar" />
                        <div className="create-post__input">
                            <p>Создать пост...</p>
                        </div>
                    </div>

                    <div className="posts">
                        {posts.length === 0 ? (
                            <p className="posts__empty">Постов пока нет, создайте первый.</p>
                        ) : (
                            posts.map((post) => (
                                <article key={post.id} className="post-card">
                                    <div className="post-card__header">
                                        <img src={post.author?.picture} alt={post.author?.name} />
                                        <div>
                                            <p className="post-card__author">{post.author?.name || 'Пользователь'}</p>
                                            <p className="post-card__date">{new Date(post.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {post.text && <p className="post-card__text">{post.text}</p>}
                                    {post.image && (
                                        <div className="post-card__image">
                                            <img src={post.image} alt="post" />
                                        </div>
                                    )}
                                    <div className="post-card__actions">
                                        <button
                                            type="button"
                                            className={`action-btn action-like ${likedPosts.has(post.id) ? 'action-btn--liked' : ''}`}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            {likedPosts.has(post.id) ? '❤️' : '🤍'} {post.likes ?? 0}
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn ${bookmarkedPosts.has(post.id) ? 'action-btn--bookmarked' : ''}`}
                                            onClick={() => handleBookmark(post.id)}
                                            title="Сохранить в закладки"
                                        >
                                            <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M3.515,22.875a1,1,0,0,0,1.015-.027L12,18.179l7.47,4.669A1,1,0,0,0,21,22V4a3,3,0,0,0-3-3H6A3,3,0,0,0,3,4V22A1,1,0,0,0,3.515,22.875ZM5,4A1,1,0,0,1,6,3H18a1,1,0,0,1,1,1V20.2l-6.47-4.044a1,1,0,0,0-1.06,0L5,20.2Z"></path></g></svg>

                                        </button>
                                        <button type="button" className="action-btn" onClick={() => handleShare(post)}>
                                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z" fill="#fff"></path> </g></svg>

                                        </button>
                                        <button type="button" className="action-btn action-btn--delete" onClick={() => handleDelete(post.id)}>
                                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1.5 3.75C1.08579 3.75 0.75 4.08579 0.75 4.5C0.75 4.91421 1.08579 5.25 1.5 5.25V3.75ZM22.5 5.25C22.9142 5.25 23.25 4.91421 23.25 4.5C23.25 4.08579 22.9142 3.75 22.5 3.75V5.25ZM1.5 5.25H22.5V3.75H1.5V5.25Z" fill="#fff"></path> <path d="M9.75 1.5V0.75V1.5ZM8.25 3H7.5H8.25ZM7.5 4.5C7.5 4.91421 7.83579 5.25 8.25 5.25C8.66421 5.25 9 4.91421 9 4.5H7.5ZM15 4.5C15 4.91421 15.3358 5.25 15.75 5.25C16.1642 5.25 16.5 4.91421 16.5 4.5H15ZM15.75 3H16.5H15.75ZM14.25 0.75H9.75V2.25H14.25V0.75ZM9.75 0.75C9.15326 0.75 8.58097 0.987053 8.15901 1.40901L9.21967 2.46967C9.36032 2.32902 9.55109 2.25 9.75 2.25V0.75ZM8.15901 1.40901C7.73705 1.83097 7.5 2.40326 7.5 3H9C9 2.80109 9.07902 2.61032 9.21967 2.46967L8.15901 1.40901ZM7.5 3V4.5H9V3H7.5ZM16.5 4.5V3H15V4.5H16.5ZM16.5 3C16.5 2.40326 16.2629 1.83097 15.841 1.40901L14.7803 2.46967C14.921 2.61032 15 2.80109 15 3H16.5ZM15.841 1.40901C15.419 0.987053 14.8467 0.75 14.25 0.75V2.25C14.4489 2.25 14.6397 2.32902 14.7803 2.46967L15.841 1.40901Z" fill="#fff"></path> <path d="M9 17.25C9 17.6642 9.33579 18 9.75 18C10.1642 18 10.5 17.6642 10.5 17.25H9ZM10.5 9.75C10.5 9.33579 10.1642 9 9.75 9C9.33579 9 9 9.33579 9 9.75H10.5ZM10.5 17.25V9.75H9V17.25H10.5Z" fill="#fff"></path> <path d="M13.5 17.25C13.5 17.6642 13.8358 18 14.25 18C14.6642 18 15 17.6642 15 17.25H13.5ZM15 9.75C15 9.33579 14.6642 9 14.25 9C13.8358 9 13.5 9.33579 13.5 9.75H15ZM15 17.25V9.75H13.5V17.25H15Z" fill="#fff"></path> <path d="M18.865 21.124L18.1176 21.0617L18.1176 21.062L18.865 21.124ZM17.37 22.5L17.3701 21.75H17.37V22.5ZM6.631 22.5V21.75H6.63093L6.631 22.5ZM5.136 21.124L5.88343 21.062L5.88341 21.0617L5.136 21.124ZM4.49741 4.43769C4.46299 4.0249 4.10047 3.71818 3.68769 3.75259C3.2749 3.78701 2.96818 4.14953 3.00259 4.56231L4.49741 4.43769ZM20.9974 4.56227C21.0318 4.14949 20.7251 3.78698 20.3123 3.75259C19.8995 3.7182 19.537 4.02495 19.5026 4.43773L20.9974 4.56227ZM18.1176 21.062C18.102 21.2495 18.0165 21.4244 17.878 21.5518L18.8939 22.6555C19.3093 22.2732 19.5658 21.7486 19.6124 21.186L18.1176 21.062ZM17.878 21.5518C17.7396 21.6793 17.5583 21.75 17.3701 21.75L17.3699 23.25C17.9345 23.25 18.4785 23.0379 18.8939 22.6555L17.878 21.5518ZM17.37 21.75H6.631V23.25H17.37V21.75ZM6.63093 21.75C6.44274 21.75 6.26142 21.6793 6.12295 21.5518L5.10713 22.6555C5.52253 23.0379 6.06649 23.25 6.63107 23.25L6.63093 21.75ZM6.12295 21.5518C5.98449 21.4244 5.89899 21.2495 5.88343 21.062L4.38857 21.186C4.43524 21.7486 4.69172 22.2732 5.10713 22.6555L6.12295 21.5518ZM5.88341 21.0617L4.49741 4.43769L3.00259 4.56231L4.38859 21.1863L5.88341 21.0617ZM19.5026 4.43773L18.1176 21.0617L19.6124 21.1863L20.9974 4.56227L19.5026 4.43773Z" fill="#fff"></path> </g></svg>

                                        </button>
                                    </div>
                                    <div className="post-card__comment-form">
                                        <input
                                            type="text"
                                            value={commentText[post.id] || ''}
                                            onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                            placeholder="Оставьте комментарий"
                                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                                        />
                                        <button type="button" onClick={() => handleComment(post.id)}>Отправить</button>
                                    </div>
                                    {post.comments?.length > 0 && (
                                        <div className="post-card__comments">
                                            {post.comments.map((comment: any) => (
                                                <div key={comment.id} className="post-card__comment">
                                                    <span>{comment.author}:</span> {comment.text}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </div>

                <div className="RightSidebar">
                    <div className="RightSidebar__wrapper">
                        <h3>Тренды</h3>
                        <div className="trend-RSB"><p className='trends'>Тренд №1</p><p>#React</p></div>
                        <div className="trend-RSB"><p className='trends'>Тренд №2</p><p>#JavaScript</p></div>
                        <div className="trend-RSB"><p className='trends'>Тренд №3</p><p>#TypeScript</p></div>
                        <div className="trend-RSB"><p className='trends'>Тренд №4</p><p>#node.js</p></div>
                        <div className="trend-RSB"><p className='trends'>Тренд №5</p><p>#next.js</p></div>
                    </div>
                </div>
            </div>

            {storyModalOpen && (
                <div
                    className="stories-modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="stories-modal"
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>РЎРѕР·РґР°С‚СЊ РёСЃС‚РѕСЂРёСЋ</h3>

                        <label>
                            РћРїРёСЃР°РЅРёРµ РёСЃС‚РѕСЂРёРё
                            <textarea
                                value={storyText}
                                onChange={(e) => setStoryText(e.target.value)}
                                placeholder="РўРµРєСЃС‚ РёСЃС‚РѕСЂРёРё"
                            />
                        </label>

                        <label>
                            РЎСЃС‹Р»РєР° РЅР° РёР·РѕР±СЂР°Р¶РµРЅРёРµ (РѕРїС†РёРѕРЅР°Р»СЊРЅРѕ)
                            <input
                                type="text"
                                value={storyImage}
                                onChange={(e) => setStoryImage(e.target.value)}
                                placeholder="https://..."
                            />
                        </label>

                        <div className="stories-modal__actions">
                            <button
                                type="button"
                                className="stories-modal__cancel"
                                onClick={closeModal}
                            >
                                РћС‚РјРµРЅР°
                            </button>

                            <button
                                type="button"
                                className="stories-modal__save"
                                onClick={createStory}
                            >
                                РЎРѕС…СЂР°РЅРёС‚СЊ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeStory && (
                <div className="story-viewer-overlay" onClick={closeActiveStory}>
                    <div className="story-viewer" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="story-viewer__close" onClick={closeActiveStory}>x</button>
                        <div className="story-viewer__header">
                            {activeStory.picture && <img src={activeStory.picture} alt={activeStory.author} />}
                            <div>
                                <p>{activeStory.author}</p>
                                <span>{new Date(activeStory.createdAt).toLocaleString()}</span>
                            </div>
                            <button type="button" className="story-viewer__delete" onClick={() => deleteStory(activeStory.id)}>x</button>
                        </div>
                        {activeStory.image && <img className="story-viewer__image" src={activeStory.image} alt={activeStory.author} />}
                        {activeStory.text && <p className="story-viewer__text">{activeStory.text}</p>}
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h3>Новый пост</h3>
                            <button className="modal__close" onClick={handleClose}>✕</button>
                        </div>
                        <div className="modal__body">
                            <div className="modal__user">
                                <img src={user.picture} alt="avatar" />
                                <p>{user.name}</p>
                            </div>
                            <textarea
                                className="modal__textarea"
                                placeholder="Напишите что-нибудь..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            {image && (
                                <div className="modal__preview">
                                    <img src={image} alt="preview" />
                                    <button className="modal__remove-img" onClick={() => setImage(null)}>✕</button>
                                </div>
                            )}
                        </div>
                        <div className="modal__footer">
                            <button className="modal__upload" onClick={() => fileRef.current?.click()}>
                                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#70A9E9" strokeWidth="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="#70A9E9" />
                                    <path d="M3 16L8 11L11 14L15 10L21 16" stroke="#70A9E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Загрузить фото
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                            <button className="modal__submit" disabled={(!text && !image) || loading} onClick={handlePublish}>
                                {loading ? 'Публикация...' : 'Опубликовать'}
                            </button>
                        </div>
                        {error && <p className="modal__error">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    </>)
}

export default Home