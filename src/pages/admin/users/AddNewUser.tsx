import { ArrowUpTrayIcon, CameraIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const AddNewUser = ({ inputs, title }) => {
  const [file, setFile] = useState("");

  return (
    <div>
      {/* top */}
      <div className="p-[10px] shadow-lg mb-5">
        <h1 className="text-gray-400 text-xl">{title}</h1>
      </div>
      {/* bottom */}
      <div className="p-[10px] shadow-lg mb-5 flex">
        {/* left */}
        <div className="flex-1 items-center flex justify-center">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="w-[200px] h-[200px] rounded-full object-cover"
            />
          ) : (
            <CameraIcon className="w-[100px] h-[100px] rounded-full object-cover" />
          )}
        </div>
        {/* right */}
        <div className="flex-[2]">
          <form className="flex flex-wrap gap-[30px] ">
            <div className="w-[40%]">
              <label htmlFor="file" className="flex gap-2 items-center">
                <span>Main Image: </span>
                {/* <ArrowUpTrayIcon className="w-[20px] h-[20px] rounded-full object-cover cursor-pointer" /> */}
              </label>
              <input
                className="w-full p-[5px]"
                type="file"
                id="file"
                style={{ display: "" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            {inputs.map((input) => (
              <div className="w-[40%]" key={input.id}>
                <label htmlFor="username">{input.label}</label>
                <input
                  className="w-full p-[5px]  border-b border-gray-300"
                  type={input.type}
                  placeholder={input.placeholder}
                />
              </div>
            ))}
           {title === "Add New Product" && <div className="w-[65%]">
              <label htmlFor="file" className="flex gap-2 items-center">
                <span>Other Images: </span>
                {/* <ArrowUpTrayIcon className="w-[20px] h-[20px] rounded-full object-cover cursor-pointer" /> */}
              </label>
              <input
                className="w-full p-[5px] border-b border-gray-300"
                type="file"
                id="file"
                style={{ display: "" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>}
            <button className="w-[150px] p-[10px] border-none bg-blue-500 text-white font-bold cursor-pointer mt-[10px]">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;
