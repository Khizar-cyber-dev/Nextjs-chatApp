import Sidebar from "@/components/sidebar/Sidebar";
import ConversatioinList from "./components/ConversatioinList";
import getConversations from "../actions/getConversation";
import getUsers from "../actions/getUsers";

export default async function UsersLayout({
    children
  }: {
    children: React.ReactNode,
  }) {
    const conversation = await getConversations();
    const users = await getUsers();
    return (
    <Sidebar>
         <div className="h-full">
            <ConversatioinList users={users} initialItems={conversation}/>
            {children}
        </div>
    </Sidebar>
    );
};