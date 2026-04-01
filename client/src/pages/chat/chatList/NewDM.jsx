import React, { useState } from "react";
import Avatar from "@/components/common/Avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/apiClient";
import { SEARCH_CONTACT } from "@/utils/apiRoutes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const [openDm, setOpenDM] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACT,
          { searchTerm },
          { withCredentials: true }
        );
        console.log(res);

        if (res.status === 200 && res.data.contacts) {
          setSearchedContacts(res.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const selectNewContact = (contact) => {
    setOpenDM(false);

    setSelectedChatType("contact");
    setSelectedChatData(contact);

    setSearchedContacts([]);
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpenDM(true)}
              className="text-neutral-400 font-light text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            Add Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openDm} onOpenChange={setOpenDM}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 p-4 hover:bg-[#2c2e3b] rounded-lg cursor-pointer transition-all duration-300"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="cursor-pointer flex justify-center items-center gap-3">
                      <Avatar type="sm" image={contact?.profilePic} />
                      <h6>{contact?.name}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:flex flex-col justify-center items-center mt-5 md:-mt-10 duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3>
                  Hi<span className="text-purple-500">! </span>
                  Search New
                  <span className="text-purple-500"> Contact</span>{" "}
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDM;
