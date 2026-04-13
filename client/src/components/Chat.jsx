import { ChatBubbleLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ChatSpecific from './ChatSpecific'

export default function({ user }){

    const [opened, setOpened] = useState(false)
    const [chats, setChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [currentPartner, setCurrentPartner] = useState('')

    useEffect(() => {

        if(user){
            getUsersChats()
        }

    }, [opened])

    useEffect(() => {
    if (!user) {
        setOpened(false)
        setCurrentChat(null)
        setChats([])
        setCurrentPartner('')
    }
    }, [user])

    async function getUsersChats() {
        try {

            const resChat = await api.get('chats/viewChats/', {
                params: {
                    user_id: user.role === 'manager' ? user.manager_id : user.worker_id,
                    user_role: user.role
                }
            });

            if (resChat.data.length === 0) {
                console.log('No chats!');
                return;
            }

            const chatPartners = resChat.data

            const chatPartnersWithNames = await Promise.all(
                chatPartners.map(async (p) => {
                    let userData

                    if (p.chatuser_type === 'worker') {
                        const res = await api.get(`/workers/${p.chatuser_id}`)
                        userData = res.data
                    } else {
                        const res = await api.get(`/managers/${p.chatuser_id}`)
                        userData = res.data
                    }

                    return {
                        chat_id: p.chat_id,
                        user_id: p.chatuser_id,
                        role: p.chatuser_type,
                        name: `${userData.first_name} ${userData.last_name}`,
                        lastMessage: p.lastMessage
                    }
                })
            )
            
            setChats(chatPartnersWithNames)
            

        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className='z-100'>
            {opened && <div className='fixed bg-gray-800 w-100 h-120 right-10 bottom-10 overflow-y-auto no-scrollbar text-white rounded-3xl shadow-xl shadow-black/50'>
                {!currentChat && <div> 
                    <div className='flex justify-center mb-3 bg-gray-700'>
                        <p className='mt-3 mb-3 text-lg font-bold'>CHAT</p>
                    </div>
                    {user && chats.length === 0 && 
                        <div className='mt-8'>
                            <p className='text-center'>You don't have any chats yet.</p>
                        </div>}
                    {!user && 
                        <div className='mt-8 text-center'>
                            <p className='mb-5'>You need to log in to use the chat!</p>
                            <Link to={'/login'} onClick={() => setOpened(false)} className='py-2 px-5 bg-gray-600 rounded-md'>LOG IN</Link>
                        </div>}
                    <ul className='space-y-4'>
                    {chats.map(chat => 
                        <li key={chat.chat_id}>
                            <div onClick={() => {setCurrentChat(chat.chat_id); setCurrentPartner(chat.name)}} className='py-3 px-3 flex items-center gap-5 bg-gray-600 w-full cursor-pointer'>
                                <div className='w-10 h-10 rounded-full bg-green-700'></div>
                                <div>
                                    <p>{chat.name}</p>
                                    {chat.lastMessage?.content ? <p>last msg: {chat.lastMessage.content}</p> : <p></p>}
                                </div>
                                
                            </div>
                        </li>
                    )}
                    </ul>
                </div>}
                {currentChat && <div className='flex flex-col'>
                    <div className='sticky top-0 z-10 bg-gray-700 pl-8 pt-5 pb-2 mb-2 w-full flex gap-5'>
                        <button onClick={() => setCurrentChat(null)} className='cursor-pointer'>
                            <ArrowLeftIcon className='h-6 w-6'/>
                        </button>
                        <p>{currentPartner}</p>
                    </div>
                    <ChatSpecific currentChat={currentChat} user={user}/>
                </div>}
            </div>}
            <ChatBubbleLeftIcon onClick={() => setOpened(!opened)} className='cursor-pointer fixed z-1 right-10 bottom-10 w-12 h-12 border-2 border-white rounded-full p-2 bg-white shadow-lg shadow-black/10' />
        </div>
    )
}