import React from "react";
import Chart from "../components/chart/Chart";
import Tables from "../components/table/Table";

const UserDetails = () => {

  return (
    <div>
      {/* top */}
      <div className="p-5 flex  gap-5">
        {/* left */}
        <div className="flex-1 shadow-lg p-5 relative">
          <div className="absolute top-0 right-0 p-[5px] text-xs text-[#7451f8] bg-[#7551f818] cursor-pointer rounded-t-[5px]">
            Edit
          </div>
          <h1 className="text-base text-gray-400 mb-[20px]">Information</h1>
          <div className="flex gap-5">
            <img
              src={
                "data:image/jpeg;base64,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"
              }
              alt="avatar"
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
            <div>
              <h1 className="mb-[10px] text-[#555] text-2xl font-bold">
                Jamal Nasir
              </h1>
              <div className="mb-[10px]">
                <span className="font-bold text-[#555] mr-[5px]">Email:</span>
                <span className="font-light">Jamal@gmail.com</span>
              </div>
              <div className="mb-[10px]">
                <span className="font-bold text-[#555] mr-[5px]">Phone:</span>
                <span className="font-light">0044745543433</span>
              </div>
              <div className="mb-[10px]">
                <span className="font-bold text-[#555] mr-[5px]">Address:</span>
                <span className="font-light">KNUST, Kumasi</span>
              </div>
              <div className="mb-[10px]">
                <span className="font-bold text-[#555] mr-[5px]">Country:</span>
                <span className="font-light">Ghana</span>
              </div>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="flex-[2]">
          <Chart aspect={3 / 1} title="User Transactions (last 6 months)" />
        </div>
      </div>
      {/* bottom */}
      <div className="shadow-lg p-5 mx-5 my-[10px]">
        <h1 className="text-base text-gray-400 mb-[20px]">Last Transactions</h1>
        <Tables />
      </div>
    </div>
  );
};

export default UserDetails;
