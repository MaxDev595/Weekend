import '../assets/sccs/pages.scss'

function MyPage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    const myPosts = allPosts.filter((p: any) => p.author?.email === user.email)

    return (
        <div className="page">
            {/* Обложка */}
            <div className="profile__cover"></div>

            {/* Шапка профиля */}
            <div className="profile__header">
                <img className="profile__avatar" src={user.picture} alt={user.name} />
                <div className="profile__info">
                    <h2 className="profile__name">{user.name}</h2>
                    <p className="profile__email">{user.email}</p>
                </div>
                <div className="profile__stats">
                    <div className="profile__stat">
                        <span>{myPosts.length}</span>
                        <p>Постов</p>
                    </div>
                    <div className="profile__stat">
                        <span>0</span>
                        <p>Друзей</p>
                    </div>
                    <div className="profile__stat">
                        <span>0</span>
                        <p>Подписчиков</p>
                    </div>
                </div>
            </div>

            {/* Посты пользователя */}
            <div className="profile__posts">
                <h3>Записи</h3>
                {myPosts.length === 0 ? (
                    <p className="page__empty">У вас пока нет постов</p>
                ) : (
                    <div className="posts-list">
                        {myPosts.map((post: any) => (
                            <article key={post.id} className="post-card">
                                <div className="post-card__header">
                                    <img src={user.picture} alt={user.name} />
                                    <div>
                                        <p className="post-card__author">{user.name}</p>
                                        <p className="post-card__date">{new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                {post.text && <p className="post-card__text">{post.text}</p>}
                                {post.image && <img className="post-card__img" src={post.image} alt="post" />}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyPage