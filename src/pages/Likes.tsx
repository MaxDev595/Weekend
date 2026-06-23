import '../assets/sccs/pages.scss'


function Likes() {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')

    return (
        <div className="page">
            <div className="page__header">
                <h2>Лайки</h2>
                <p>Посты которые вам понравились</p>
            </div>
            {likedPosts.length === 0 ? (
                <p className="page__empty">Вы ещё не лайкали посты</p>
            ) : (
                <div className="posts-list">
                    {likedPosts.map((post: any) => (
                        <article key={post.id} className="post-card">
                            <div className="post-card__header">
                                <img src={post.author?.picture} alt={post.author?.name} />
                                <div>
                                    <p className="post-card__author">{post.author?.name}</p>
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
    )
}

export default Likes