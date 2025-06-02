import { useState } from "react";
import CreateCommunity from "../modals/CreateCommunity";
import { useUserStore } from "../../../store/userStore";
import useUserData from "../../../hooks/useUserData";

export default function Header() {
  const { role } = useUserStore();
  useUserData();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <div className="mt-8 flex gap-y-4 flex-wrap justify-end items-center">
      <div className="flex flex-row-reverse md:flex-row justify-end items-center gap-x-4">
        {/* <div className="hidden md:flex justify-start items-center gap-x-4">
          <p>Filter by:</p>
          <select className="border border-gray-400 rounded-md p-2">
            <option value="">Today</option>
            <option value="">Last Week</option>
            <option value="">Last Month</option>
          </select>
        </div> */}
        <div>
          {role === "admin" && (
            <button
              onClick={openModal}
              className=" cursor-pointer bg-purple-500 rounded-xl p-2 px-5 text-white"
            >
              Create +
            </button>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && <CreateCommunity onClose={closeModal} />}
    </div>
  );
}
