import search from "@/assets/images/search.png";

const TableSearch = () => {
  return (
    <div className="w-full md:w-auto sm:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 text-gray-700">
      <img src={search} alt="search" width={14} height={14} />
      <input
        className="w-[200px] h-8 p-2 bg-transparent focus:ring-0 border-none"
        type="text"
        placeholder="Search.."
      />
    </div>
  );
};

export default TableSearch;
