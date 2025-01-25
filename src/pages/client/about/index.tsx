import React from "react";

const About = () => {
  return (
    <div className="max-w-[80rem] mx-auto">
      {/* home / cart */}
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p>Home</p> <span>/</span> <p className="text-black">About</p>
      </div>

      <div className="mt-[3rem]">
        <div className="flex flex-col gap-5">
          {/* About / My story */}
          <div className="w-full  flex gap-x-3">
            <div className=" w-1/2 flex flex-col justify-center">
              <h1 className="font-semibold text-[54px]">Our Story</h1>
              <p>
                Launced in 2015, Exclusive is South Asia’s premier online
                shopping makterplace with an active presense in Bangladesh.
                Supported by wide range of tailored marketing, data and service
                solutions, Exclusive has 10,500 sallers and 300 brands and
                serves 3 millioons customers across the region.{" "}
              </p>
              <p>
                Launced in 2015, Exclusive is South Asia’s premier online
                shopping makterplace with an active presense in Bangladesh.
                Supported by wide range of tailored marketing, data and service
                solutions, Exclusive has 10,500 sallers and 300 brands and
                serves 3 millioons customers across the region.{" "}
              </p>
            </div>
            <div className="w-1/2">
              <img
                src="https://s3-alpha-sig.figma.com/img/fcc8/9aaa/7b85f8c1dcce81e71e2eb178be13bd4d?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=imexDryZgDM1HfWASx~LWewQrgzDWr4dT2HMdB8YpwH5bAHrvVvDTpt7CBMK1OC9-758dcKG7NG3iarHrwYRrGfUYG0Shv5rWMZX-rAGH6LKckc~CzOCAMGPqTq7K5O~58RbYA4i-qJZRb4rSduf8UIErEFNxW22Oo~TzI867GxIbaPhK0ybls-kPnN6bJ8LqAV4t1hUL6AJja5JBuXffe30Nos0o9K2VYuTcJsqsbziyeP8TICl-CjoQBi~~3o9zOTt4FtLd~Fss7Y6lBpbbf3aH3yKLKIusL6jujDvg9liu6K2phjKhKyBzT65g3IH59xG2swW4DR9kZ1i~QEe~g__"
                alt=""
                className="rounded-md"
              />
            </div>
          </div>
          {/* stats */}
          <div className="bg-rose-300">
            the stats
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
