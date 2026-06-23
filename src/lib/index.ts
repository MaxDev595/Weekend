import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

let prisma: any = null
let prismaAvailable = false

const users: any[] = []
const posts: any[] = []
let postId = 1

async function startServer() {
    try {
        const mod = await import('./prisma')
        prisma = mod.prisma
        prismaAvailable = true
        console.log('✅ Prisma loaded')
    } catch {
        console.warn('⚠️ Prisma not available, using in-memory storage')
    }

    app.listen(3000, () => {
        console.log('🚀 Server running on port 3000')
    })
}

// Получить пользователей
app.get('/users', async (req, res) => {
    try {
        if (prismaAvailable) {
            const dbUsers = await prisma.user.findMany()
            return res.json(dbUsers)
        }

        return res.json(users)
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load users' })
    }
})

// Создать пользователя
app.post('/users', async (req, res) => {
    const { email, name, picture } = req.body

    if (!email) {
        return res.status(400).json({
            error: 'Email is required'
        })
    }

    try {
        if (prismaAvailable) {
            const user = await prisma.user.upsert({
                where: { email },
                update: { name, picture },
                create: { email, name, picture }
            })

            return res.json(user)
        }

        let user = users.find((u) => u.email === email)

        if (user) {
            user.name = name
            user.picture = picture
        } else {
            user = {
                id: users.length + 1,
                email,
                name,
                picture,
                createdAt: new Date()
            }

            users.push(user)
        }

        return res.json(user)
    } catch {
        return res.status(500).json({
            error: 'Failed to save user'
        })
    }
})

// Получить посты
app.get('/posts', async (req, res) => {
    try {
        if (prismaAvailable) {
            const dbPosts = await prisma.post.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            picture: true
                        }
                    }
                }
            })

            return res.json(dbPosts)
        }

        const sortedPosts = [...posts].sort(
            (a, b) => b.createdAt - a.createdAt
        )

        return res.json(sortedPosts)
    } catch {
        return res.status(500).json({
            error: 'Failed to load posts'
        })
    }
})

// Создать пост
app.post('/posts', async (req, res) => {
    const {
        text,
        image,
        email,
        name,
        picture
    } = req.body

    if (!email) {
        return res.status(400).json({
            error: 'Email is required'
        })
    }

    if (!text?.trim() && !image?.trim()) {
        return res.status(400).json({
            error: 'Post cannot be empty'
        })
    }

    try {
        if (prismaAvailable) {
            let user = await prisma.user.findUnique({
                where: { email }
            })

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        name: name || null,
                        picture: picture || null
                    }
                })
            }

            const post = await prisma.post.create({
                data: {
                    text,
                    image,
                    authorId: user.id
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            picture: true
                        }
                    }
                }
            })

            return res.json(post)
        }

        let author = users.find(
            (u) => u.email === email
        )

        if (!author) {
            author = {
                id: users.length + 1,
                email,
                name,
                picture,
                createdAt: new Date()
            }

            users.push(author)
        }

        const newPost = {
            id: postId++,
            text,
            image,
            createdAt: Date.now(),
            author
        }

        posts.push(newPost)

        return res.json(newPost)
    } catch {
        return res.status(500).json({
            error: 'Failed to create post'
        })
    }
})

// Удалить пост
app.delete('/posts/:id', async (req, res) => {
    const id = Number(req.params.id)

    try {
        if (prismaAvailable) {
            await prisma.post.delete({
                where: { id }
            })

            return res.json({
                success: true
            })
        }

        const index = posts.findIndex(
            (post) => post.id === id
        )

        if (index !== -1) {
            posts.splice(index, 1)
        }

        return res.json({
            success: true
        })
    } catch {
        return res.status(404).json({
            error: 'Post not found'
        })
    }
})

startServer()