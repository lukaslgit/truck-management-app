import jwt from 'jsonwebtoken'

export function auth(req, res, next) {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ error: 'No token!' })
        }

        const decoded = jwt.verify(token, process.env.SECRET)

        req.user = decoded

        next()

    } catch (error) {
        return res.status(400).json({ error: 'Invalid or expired token' })
    }
}
