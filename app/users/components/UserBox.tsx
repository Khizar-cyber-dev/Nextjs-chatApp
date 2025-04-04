import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import Avator from "@/components/Avator";
import LoadingModal from "@/components/modals/LoadingModal";

interface UserBoxProps {
  data: User
}

const UserBox: React.FC<UserBoxProps> = ({ 
  data
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    console.log("Creating conversation with user ID:", data.id);
    setIsLoading(true);

    axios.post('/api/conversations', { userId: data.id })
    .then((response) => {
      router.push(`/conversations/${response.data.id}`);
    })
    .finally(() => setIsLoading(false));
}, [data, router]);

  return (
    <>
      {isLoading && (
        <LoadingModal />
      )}
      <div onClick={handleClick} className="w-full relative flex items-center space-x-3 p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer">
        <Avator user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default UserBox;