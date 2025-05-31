import { useState } from "react";
import CreateCommunity from "../modals/CreateCommunity";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <div className="mt-8 flex gap-y-4 flex-wrap justify-between items-center">
      <div className="flex flex-wrap gap-y-4 justify-start items-center gap-x-2">
        <h2>Search for communities:</h2>
        <form className="w-full md:w-xl">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
              required
            />
          </div>
        </form>
      </div>

      <div className="flex flex-row-reverse md:flex-row justify-start items-center gap-x-4">
        <div className="hidden md:flex justify-start items-center gap-x-4">
          <p>Filter by:</p>
          <select className="border border-gray-400 rounded-md p-2">
            <option value="">Today</option>
            <option value="">Last Week</option>
            <option value="">Last Month</option>
          </select>
        </div>
        <div>
          <button
            onClick={openModal}
            className=" cursor-pointer bg-purple-500 rounded-xl p-2 px-5 text-white"
          >
            Create +
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && <CreateCommunity onClose={closeModal} />}
    </div>
  );
}
