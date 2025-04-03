import getCurrentUser from "@/app/actions/getCurrentUser";
import DeskstopSidebar from "./DeskstopSidebar";
import MobileFooter from "./MobileFooter";

export default async function Sidebar({
    children
  }: {
    children: React.ReactNode,
  }) {
    const currentUser = await getCurrentUser();
    return (
         <div className="h-screen">
           <main className="lg:pl-20 h-full">
            <DeskstopSidebar currentUser={currentUser!}/>
            <MobileFooter />
              {children}
           </main>
        </div>
    )};