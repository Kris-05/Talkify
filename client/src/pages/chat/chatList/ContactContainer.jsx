import Title from "@/components/common/Title";
import ChatListHeader from "./ChatListHeader";
import NewDM from "./NewDM";

const ContactContainer = () => {
  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b]">
      <ChatListHeader />
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Direct Messages"} />
          <NewDM/>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Channels"} />
        </div>
      </div>
    </div>
  );
};

export default ContactContainer;
