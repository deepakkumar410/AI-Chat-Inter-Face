import { useState } from "react";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory, darkMode }) {
    const clearHistory = (index) => {
        console.log(index);
        const updatedHistory = recentHistory.filter((_, item) => item !== index);
        setRecentHistory(updatedHistory);
         localStorage.setItem('history', JSON.stringify(updatedHistory));
    };

    const [showmenu, setShowMenu] = useState(false);

    return (
        <>
            <section >
                <button
                    onClick={() => setShowMenu(!showmenu)}
                    className={` ${showmenu ? "hidden" : "block"} ${ darkMode ? "text-white" : "text-black "} flex w-full text-3xl px-4 mt-3 cursor-pointer`}
                >
                 <CgMenuRightAlt />
                </button>
                <div
                    className={`${
                        showmenu ? "translate-x-0" : "-translate-x-full"
                    } absolute  top-0 left-0 h-screen w-[80vw] sm:w-[60vw] md:w-[40vw]  lg:w-[25vw] xl:w-[20vw] col-span-1  ${darkMode ? "dark:bg-zinc-800" : "bg-gray-200"} pt-3 transition-transform duration-300 z-50`}
                >
                    <div className="flex justify-between px-4">
                        <h1 className="text-xl dark:text-white text-zinc-800 flex text-center font-[600] justify-center">
                            <span>Recent Search</span>
                        </h1>
                        <button
                            onClick={() => setShowMenu(false)}
                            className={` ${darkMode ? "text-white" : "text-black" } mb-3 cursor-pointer hover:text-red-400 transition-all duration-300  text-2xl`}
                        >
                            <IoCloseOutline />
                        </button>
                    </div>
                    <ul className="text-left overflow-auto mt-2 w-full max-h-[80vh] px-2">
                        {recentHistory &&
                            recentHistory.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center px-2 b"
                                >
                                    <li
                                        onClick={() => setSelectedHistory(item)}
                                        className="mb-4  truncate dark:text-zinc-400 text-zinc-700 cursor-pointer dark:hover:bg-zinc-700 dark:hover:text-zinc-200  hover:text-zinc-800 w-full"
                                    >
                                        {item}
                                    </li>
                                    <button
                                        onClick={() => clearHistory(index)}
                                        className="cursor-pointer text-xl text-gray-400 pl-2 hover:text-red-400"
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            ))}
                    </ul>
                </div>
            </section>
        </>
    );
}

export default RecentSearch;
