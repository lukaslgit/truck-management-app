import { ChatBubbleLeftIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
            {opened && <div className='fixed bg-gray-800 w-[calc(100vw-16px)] sm:w-100 h-[85vh] sm:h-120 right-2 sm:right-10 bottom-2 sm:bottom-10 flex flex-col text-white rounded-3xl shadow-xl shadow-black/50 overflow-hidden'>
                {!currentChat && <div className='flex flex-col h-full'>
                    <div className='relative flex justify-center items-center bg-gray-700 h-12 shrink-0'>
                        <p className='text-lg font-bold'>CHAT</p>
                        <button onClick={() => setOpened(false)} className='sm:hidden absolute right-3 cursor-pointer text-red-400'>
                            <XMarkIcon className='h-6 w-6' />
                        </button>
                    </div>
                    <div className='flex-1 overflow-y-auto no-scrollbar'>
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
                                    <div className='w-10 h-10 rounded-full bg-green-700 shrink-0'></div>
                                    <div className='min-w-0'>
                                        <p className='truncate'>{chat.name}</p>
                                        {chat.lastMessage?.content ? <p className='text-sm text-gray-300 truncate'>last msg: {chat.lastMessage.content}</p> : <p></p>}
                                    </div>
                                </div>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>}
                {currentChat && <div className='flex flex-col h-full'>
                    <div className='bg-gray-700 px-3 h-12 w-full flex items-center gap-3 shrink-0'>
                        <button onClick={() => setCurrentChat(null)} className='cursor-pointer'>
                            <ArrowLeftIcon className='h-6 w-6'/>
                        </button>
                        <p className='flex-1'>{currentPartner}</p>
                        <button onClick={() => setOpened(false)} className='sm:hidden cursor-pointer text-red-400'>
                            <XMarkIcon className='h-6 w-6' />
                        </button>
                    </div>
                    <ChatSpecific currentChat={currentChat} user={user}/>
                </div>}
            </div>}
            <ChatBubbleLeftIcon onClick={() => setOpened(!opened)} className={`cursor-pointer fixed z-1 right-4 sm:right-10 bottom-4 sm:bottom-10 w-12 h-12 border-2 border-white rounded-full p-2 bg-white shadow-lg shadow-black/10 ${opened ? 'hidden sm:block' : ''}`} />
        </div>
    )
}
