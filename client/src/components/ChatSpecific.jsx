import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'


export default function({ currentChat, user }){

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef(null)
    const messagesRef = useRef([])

    useEffect(() => {
        getChatMessages()
    }, [currentChat])

    useEffect(() => {
    const interval = setInterval(() => {
        if (currentChat) {
            getChatMessages()
        }
    }, 2000)

    return () => clearInterval(interval)
    }, [currentChat])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        messagesRef.current = messages
    }, [messages])

    async function getChatMessages() {
        try {

            const res = await api.get('chats/viewMessages/',{
                params: {
                    chat_id: currentChat,
                    user_id: user.role === 'manager' ? user.manager_id : user.worker_id,
                    user_role: user.role
                }
            })

            const testData = res.data

            const chatMessagesWithNames = await Promise.all(
                testData.map(async (p) => {
                    let userData

                    if (p.sender_type === 'worker') {
                        const res = await api.get(`/workers/${p.sender_id}`)
                        userData = res.data
                    } else {
                        const res = await api.get(`/managers/${p.sender_id}`)
                        userData = res.data
                    }

                    return {
                        chat_id: p.chat_id,
                        user_id: p.sender_id,
                        role: p.sender_type,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        content: p.content,
                        message_id: p.message_id,
                        created_at: p.created_at
                    }
                })
            )

            const oldMessages = messagesRef.current

            const isSame = oldMessages.length === chatMessagesWithNames.length &&
                            oldMessages.every((msg, i) => msg.message_id === chatMessagesWithNames[i].message_id)
            if (isSame) {
                return
            }

            setMessages(chatMessagesWithNames)


        } catch (error) {
            console.log('Something went wrong!')
        }
    }

    async function sendMessage(){
        try {
            if(message.trim().length === 0){
                console.log('You cant send empty msg!')
                return
            }

            const res = await api.post('/chats/addMessage', {
                chat_id: currentChat,
                user_id: user.role === 'manager' ? user.manager_id : user.worker_id,
                user_role: user.role,
                content: message,
            })

            setMessage('')
            getChatMessages()

        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className='flex flex-col flex-1 overflow-hidden'>
            <ul className='flex-1 overflow-y-auto no-scrollbar space-y-2 pb-5'>
                {messages.map(msg => {

                    const currentUserId = user.role === 'manager' ? user.manager_id : user.worker_id
                    const isMe = msg.user_id === currentUserId && msg.role === user.role

                    return(
                    <li key={msg.message_id}>
                        {isMe ?
                        <div className='ml-auto w-fit mr-4 sm:mr-8'>
                            <p className='text-right text-xs text-gray-300'>
                                {new Date(msg.created_at).toLocaleString('sk-SK', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <p className='bg-blue-500 w-fit max-w-[70%] sm:max-w-60 px-3 py-0.5 rounded-2xl ml-auto wrap-break-word'>{msg.content}</p>
                        </div>
                        :
                        <div className='gap-3 min-h-3 ml-4 sm:ml-8'>
                            <div className='flex gap-2 text-xs text-gray-300'>
                                <p>{msg.first_name}:</p>
                                <p>{new Date(msg.created_at).toLocaleString('sk-SK', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <p className='bg-gray-600 w-fit max-w-[70%] sm:max-w-60 px-3 py-0.5 rounded-2xl wrap-break-word'>{msg.content}</p>
                        </div>
                    }
                </li>)})}
                <div ref={messagesEndRef} />
            </ul>

            <div className='bg-gray-700 py-2 px-3 sm:px-5 shrink-0'>
                <div className='bg-gray-800 flex justify-center py-3 rounded-2xl'>
                    <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') {sendMessage()}}} placeholder='Your msg...' className='border-r-2 border-black pl-3 w-full focus:outline-0'></input>
                    <button onClick={() => sendMessage()} className='cursor-pointer text-center w-16 sm:w-1/2 shrink-0'>Send!</button>
                </div>
            </div>
        </div>
    )
}
