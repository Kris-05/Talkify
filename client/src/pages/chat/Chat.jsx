import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactContainer from './chatList/ContactContainer';
import EmptyChat from './EmptyChat';
import ChatContainer from './chatpage/ChatContainer';

const Chat = () => {

  const { userInfo } = useAppStore();
  console.log(userInfo);
  
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast.error("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactContainer/>
      {/* <EmptyChat/> */}
      <ChatContainer/>
    </div>
  )
}

export default Chat
