import express from 'express'
const router = express.Router()
import { auth } from '../middlewares/auth.js'
import { pool } from '../db/db.js'


router.post('/createChat', auth, async (req, res) => {

    try {
        const { user1, user2 } = req.body

        if(!user1?.user_id || !user2?.user_id){
            res.status(400).json({'error': 'You need two users with valid data to create a chat!'})
            return
        }

        const checkIfTheChatAlreadyExists = await pool.query('SELECT cu1.chat_id FROM chat_users cu1 JOIN chat_users cu2 ON cu1.chat_id = cu2.chat_id WHERE cu1.chatuser_id = $1 AND cu1.chatuser_type = $2 AND cu2.chatuser_id = $3 AND cu2.chatuser_type = $4', [user1.user_id, user1.role, user2.user_id, user2.role])

        if(checkIfTheChatAlreadyExists.rows.length > 0){
            res.status(409).json({'Error': 'This chat already exist!', 'chat_id': checkIfTheChatAlreadyExists.rows[0].chat_id})
            return
        }

        const newChat = await pool.query('INSERT INTO chats DEFAULT VALUES RETURNING *')

        const chatUser1 = await pool.query('INSERT INTO chat_users (chat_id, chatuser_id, chatuser_type) VALUES ($1, $2, $3)', [newChat.rows[0].chat_id, user1.user_id, user1.role])
        const chatUser2 = await pool.query('INSERT INTO chat_users (chat_id, chatuser_id, chatuser_type) VALUES ($1, $2, $3)', [newChat.rows[0].chat_id, user2.user_id, user2.role])

        res.status(200).json(newChat.rows[0].chat_id)

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong!'})
    }
})

router.post('/addMessage', auth, async (req, res) => {
    try {
        const { chat_id, user_id, user_role, content } = req.body

        if (!chat_id || !user_id || !user_role){
            res.status(400).json({'error': 'Not able to create chat!'})
            return
        }

        const checkIfUserIsInChat = await pool.query('SELECT chat_id FROM chat_users WHERE chat_id = $1 AND chatuser_id = $2 AND chatuser_type = $3', [chat_id, user_id, user_role])

        if(checkIfUserIsInChat.rows.length === 0){
            res.status(400).json({'error': 'You are not member of this chat!'})
            return
        }

        await pool.query('INSERT INTO messages (chat_id, sender_id, sender_type, content) VALUES ($1, $2, $3, $4)', [chat_id, user_id, user_role, content])

        res.status(200).json({'msg': 'Message sent!'})
    } catch (error) {
        res.status(400).json({'error': 'Something went wrong!'})
    }
})

router.get('/viewChats', auth, async (req, res) => {
    try {
        const { user_id, user_role } = req.query

        if (!user_id || !user_role){
            res.status(400).json({'error': "You can't view chats without providing whos chats you want to seeeeeeee, also as always this error should not be possible to get from frontend. Hats off!!"})
            return
        }

        const checkIfTheUserHasChatsOrIsLonely = await pool.query('SELECT chat_id FROM chat_users WHERE chatuser_id = $1 AND chatuser_type = $2', [user_id, user_role])

        
        if(checkIfTheUserHasChatsOrIsLonely.rows.length === 0){
            res.status(200).json([])
            return
        }

        const chatIds = checkIfTheUserHasChatsOrIsLonely.rows.map(row => row.chat_id)

        const chatUsers = await pool.query('SELECT * FROM chat_users WHERE chat_id = ANY($1)', [chatIds])
        
        const chatUsersWithoutMe = chatUsers.rows.filter(user => user.chatuser_id !== user_id && user.chatuser_type !== user_role)

        res.status(200).json(chatUsersWithoutMe)

    } catch (error) {
        console.log(error)
    }
})

router.get('/viewMessages', auth, async (req, res) => {
    try {
        const { chat_id, user_id, user_role } = req.query

        if(!chat_id || !user_id || !user_role){
            res.status(400).json({'error': "You can't view this message!"})
            return
        }

        const checkIfUserIsInChat = await pool.query('SELECT chat_id FROM chat_users WHERE chat_id = $1 AND chatuser_id = $2 AND chatuser_type = $3', [chat_id, user_id, user_role])

        if(checkIfUserIsInChat.rows.length === 0){
            res.status(400).json({'error': 'You are not member of this chat!'})
            return
        }

        const messages = await pool.query('SELECT * FROM messages WHERE chat_id = $1', [chat_id])

        res.status(200).json(messages.rows)

    } catch (error) {
        res.status(400).json({'error': 'Something went wrong!'})
    }
})

router.get('/', async (req, res) => {
    res.send('Test')
})

export default router