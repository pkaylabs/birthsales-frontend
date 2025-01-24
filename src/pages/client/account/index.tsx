import React from "react";

const Account = () => {
  return (
    <main className="w-full max-w-[80rem] mx-auto ">
      <div className="mt-6 flex items-center justify-between">
        <div className=" flex items-center space-x-3 text-gray-400">
          <p className="">Home</p> <span>/</span>{" "}
          <p className="text-black">My Account</p>
        </div>
        <div className="text-black">
          Welcome! <span className="text-[#DB4444]">Jamal Nasir</span>
        </div>
      </div>

      <section className="mt-14 flex justify-between space-x-10">
        <div className="w-[25rem]  rounded px-5 py-12">
          <div className="flex flex-col justify-between gap-5 ">
            <div className=" flex flex-col gap-2">
              <h1 className="font-medium text-base">Manage My Account</h1>
              <div className=" px-3">
                <p className="font-normal text-base opacity-50 hover:text-[#DB4444]">
                  My Profile
                </p>
                <p className="font-normal text-base opacity-50 hover:text-[#DB4444]">
                  Address Book
                </p>
                <p className="font-normal text-base opacity-50 hover:text-[#DB4444]">
                  My Payment Options
                </p>
              </div>
            </div>
            <div className=" flex flex-col gap-2">
              <h1 className="font-medium text-base">My Orders</h1>
              <div className=" px-3">
                <p className="font-normal text-base opacity-50 hover:text-[#DB4444]">
                  My Returns
                </p>
                <p className="font-normal text-base opacity-50 hover:text-[#DB4444]">
                  My Cancellations
                </p>
              </div>
            </div>
            <div className=" flex flex-col gap-2">
              <h1 className="font-medium text-base">My WishList</h1>
              <div className=" px-3"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 justify-between shadow-lg rounded px-5 py-10">
          <div>
            <h1 className="font-medium text-xl text-[#DB4444]">
              Edit Your Profile
            </h1>
          </div>
          <div className="flex flex-col justify-between items-center gap-4">
            <div className="w-full flex justify-between gap-10">
              <div className="w-full">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="w-full rounded h-12 bg-[#F5F5F5] px-4 flex-1"
                  placeholder="First Name"
                />
              </div>
              <div className="w-full">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="w-full rounded h-12 bg-[#F5F5F5] px-4 flex-1"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="w-full flex justify-between gap-10">
              <div className="w-full">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full rounded h-12 bg-[#F5F5F5] px-4 flex-1"
                  placeholder="Email"
                />
              </div>
              <div className="w-full">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="w-full rounded h-12 bg-[#F5F5F5] px-4 flex-1"
                  placeholder="Address"
                />
              </div>
            </div>
            <div className="w-full">
              <p className="font-normal text-base">Password Changes</p>
              <input
                type="text"
                name="address"
                id="address"
                className=" rounded h-12 bg-[#F5F5F5] px-4 flex-1 w-full"
                placeholder="Current Password"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                name="address"
                id="address"
                className=" rounded h-12 bg-[#F5F5F5] px-4 flex-1 w-full"
                placeholder="New Password"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                name="address"
                id="address"
                className=" rounded h-12 bg-[#F5F5F5] px-4 flex-1 w-full"
                placeholder="Confirm New Password"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button className="font-medium flex justify-center items-center rounded mt-4">
              Cancel
            </button>
            <button className="font-medium bg-[#DB4444] text-white w-[200px] h-[48px] flex justify-center items-center rounded mt-4">
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Account;


{
  /* <div className="w-full bg-green-400">
<input
  type="text"
  className="rounded h-12 bg-[#F5F5F5] px-4 flex-1"
  placeholder="Your Name"
/>
<input
  type="email"
  className="rounded h-12 bg-[#F5F5F5] px-4 flex-1"
  placeholder="Your Email"
/>
</div> */
}
