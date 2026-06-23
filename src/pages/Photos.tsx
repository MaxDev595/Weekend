import '../assets/sccs/pages.scss'

function Photos() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    const photoPosts = allPosts.filter((p: any) => p.image && p.author?.email === user.email)

    return (
        <div className="page">
            <div className="page__header">
                <h2>Фото</h2>
                <p>Посты с фотографиями</p>
            </div>
            {photoPosts.length === 0 ? (
                <p className="page__empty">Нет постов с фото</p>
            ) : (
                <div className="photos-grid">
                    {photoPosts.map((post: any) => (
                        <div key={post.id} className="photos-grid__item">
                            <img src={post.image} alt="post" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Photos