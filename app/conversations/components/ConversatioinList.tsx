'use client'

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from "./ConversationBox";
import GroupChatModal from "@/components/modals/GroupChatModal";
import { User } from "@prisma/client";
import { find, uniq } from 'lodash';
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversatioinList: React.FC<ConversationListProps> = ({ initialItems, users }) => {
  const [items, setItems] = useState(initialItems);
  const [isModelOpen, setIsModalOpen] = useState(false);
  const router = useRoutes();
  const session = useSession();
  const { conversationId, isOpen } = useConversation();
  
  const pusherKey = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) => current.map((currentConversation) => {
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            messages: conversation.messages
          };
        }

        return currentConversation;
      }));
    }

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current]
      });
    }

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)]
      });
    }

   
    pusherClient.bind('conversation:update', updateHandler)
    pusherClient.bind('conversation:new', newHandler)
    pusherClient.bind('conversation:remove', removeHandler)
  }, [pusherKey, router]);
  return (
  <>
    <GroupChatModal users={users} isOpen={isModelOpen} onClose={() => setIsModalOpen(false)}/>
     <aside
      className={clsx(
        `fixed inset-y-0 pb-20 lg:pb-0 lg:left-24 lg:w-80 lg:block overflow-y-auto border-r border-gray-200`,
        isOpen ? 'hidden lg:block' : 'block w-full left-0'
      )}
    >
      <div className="px-8">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral">
            Messages
          </div>
          <div onClick={() => setIsModalOpen(true)} className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
            <MdOutlineGroupAdd size={20}/>
          </div>
        </div>
        {items.map((item) => (
          <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />
        ))}
      </div>
   </aside>
  </>
  )
}

export default ConversatioinList;