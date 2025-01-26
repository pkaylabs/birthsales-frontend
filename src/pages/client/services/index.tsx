import React from "react";
import ServiceCard from "./components/ServiceCard";

const Services = () => {
  return (
    <div className="max-w-[80rem] m-auto">
      <div className="flex flex-col gap-5">
        <div className="mt-6 flex items-center space-x-3 text-gray-400">
          <p className="">Home</p> <span>/</span>{" "}
          <p className="text-black text-2xl">Services</p>
        </div>
        <div className=" flex justify-between flex-wrap">
          <ServiceCard
            img={
              "https://s3-alpha-sig.figma.com/img/6739/d39d/c218c97b645d616c8188a4f2e6aaf84b?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LrIo0X3pxrg2ZDDQm1D2uZLZn1B9wlB5fS7wkJkiBDmKIhNrChETsHi7GQ4X6paGCN-wq5o6GFuC~f2V4JlyZ7IdLT-A9SGNTkEGjslxan2zT~DSkesAs9q3Y2FKTbCuk7UGzHHgtlPJqXf-QuQhrU3CklMBUNVFikbGPbaKnlvmfidLrlRi0xhGBFugigdaXWQ4rYf-SbLrq5crWrh9koEahyrUayvQ0bHuPSPhXG~eFO9fhWuOIuE3UYffrQx6iA3EQh26gV4SpNk3o7v6bGvOVC4ga5BPBkY4xo4DMX~k1AEjYuWCRmD2RQfjbsohUZpzcewTAenSwf5FiP-vXg__"
            }
            title="Laptops"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={300}
            endPrice={500}
          />

          <ServiceCard
            img={
              "https://s3-alpha-sig.figma.com/img/4f3c/a1d1/2722dbdf98f25179d3c0b785988c513d?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iA0crnI392D3e3Z9VeDwKwWdCbEy7mX-fgABU1fMN00imHJIuxqM4DZwmKNEwwdnEqC9Q6n7Oo3WhezM9jRMwkMABxo79w6UbK9w~MGWeqbPDk52JZY1gqK~OWguGU4VfEaugNwutnOD5NVuZ~AiEhInbF8puYiDqH7hlkw7~ULvVNMoRPtSURnSFEdxGg4eh8xm72wsYTAHFtTUXOUKH-LSZeyhavH3CcWgP6yF5pMmIVUJbt4dIN0bVCWKnRDSfM8vcYQb7QHzy6lxS7uAy4zTAiJlUOSsPLvgIzYwGckssk5YmQMZ3CBwbbeQ-C1PEjaTdNCp~dAVtA5SL4~uzw__"
            }
            title="Bags"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={50}
            endPrice={100}
          />

          <ServiceCard
            img={
              "https://s3-alpha-sig.figma.com/img/288e/0133/65fe639fccc1fe4168fca740ef1f85e7?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HNk7VuWjqrbNmMsYUH0EWdMt7Z1Ndf7Nv597FjsVS70K4oPYFXWeqPnNb3j83rYmhqncv1PWWlJICu14dGiSwRBvcWUqJRTqMNtGLCSmdngToYWbBck24~rCvvQqADEfkCyz4qClf93MjSSjkRWFw3RgdkE4S03I3tOU-Hz1XgG1JH00bnA8hSD1e-ywZnwvyErJBRJ-PoCN2nLyXsPZn-xCVZmKNKeus~e0IKkKD9Z9mYR7Hzu3KNumobE6fHxJb9u244sId6cZS7J4lbz9az7c4kRUTmiBJ4EaKCfPCwCRRjsZBL-mWeozn7CzoBCz7zQTpXldgOijypVsxLZLVg__"
            }
            title="Games"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={150}
            endPrice={360}
          />
          <ServiceCard
            img={
              "https://s3-alpha-sig.figma.com/img/6739/d39d/c218c97b645d616c8188a4f2e6aaf84b?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LrIo0X3pxrg2ZDDQm1D2uZLZn1B9wlB5fS7wkJkiBDmKIhNrChETsHi7GQ4X6paGCN-wq5o6GFuC~f2V4JlyZ7IdLT-A9SGNTkEGjslxan2zT~DSkesAs9q3Y2FKTbCuk7UGzHHgtlPJqXf-QuQhrU3CklMBUNVFikbGPbaKnlvmfidLrlRi0xhGBFugigdaXWQ4rYf-SbLrq5crWrh9koEahyrUayvQ0bHuPSPhXG~eFO9fhWuOIuE3UYffrQx6iA3EQh26gV4SpNk3o7v6bGvOVC4ga5BPBkY4xo4DMX~k1AEjYuWCRmD2RQfjbsohUZpzcewTAenSwf5FiP-vXg__"
            }
            title="Laptops"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={300}
            endPrice={500}
          />
          <ServiceCard
            img={
              "https://s3-alpha-sig.figma.com/img/6739/d39d/c218c97b645d616c8188a4f2e6aaf84b?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LrIo0X3pxrg2ZDDQm1D2uZLZn1B9wlB5fS7wkJkiBDmKIhNrChETsHi7GQ4X6paGCN-wq5o6GFuC~f2V4JlyZ7IdLT-A9SGNTkEGjslxan2zT~DSkesAs9q3Y2FKTbCuk7UGzHHgtlPJqXf-QuQhrU3CklMBUNVFikbGPbaKnlvmfidLrlRi0xhGBFugigdaXWQ4rYf-SbLrq5crWrh9koEahyrUayvQ0bHuPSPhXG~eFO9fhWuOIuE3UYffrQx6iA3EQh26gV4SpNk3o7v6bGvOVC4ga5BPBkY4xo4DMX~k1AEjYuWCRmD2RQfjbsohUZpzcewTAenSwf5FiP-vXg__"
            }
            title="Laptops"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            img={
               "https://s3-alpha-sig.figma.com/img/04a1/915f/d6cedd7c8b1073685c5f1be1b50e1ac6?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EtgMC9jiFrs0EcWRDmVWwGT6gLVeThTBS~80pL1XCZYPuH-W71vSgj7sirtDajsg8NRNWEZyaDxq0xWcB8lA0uHgLzAclnfHNRbwRHFdzFkbNgfZGApPJy2VHl0ftm07LOa68Ulomu3etHonG864xn9TmuXMt1OhM3Ym2DjCn7VkISiwh4N7SXXjupIN3XcF~gMH~JWxzOTucGx-YFssWW4PiDqhxp0eDgEEJ1YvSnehX5sDpXyZYpEnB689udpVMNTfHyJJZLGWidT2zeo0KYloHKzBTQKnwr-AH0ZwXh6B5MJ33XFlWYwXX5zGxPtCxC4ui66ez0CcbCp6x08SrQ__"
            }
            title="Shirts"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            img={
               "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FSE78Tz65VlRUa-zDh5rc5FzVbnlnot2ZPm4CpqwvLMcskCBZX0xYfv-9PsAv2n-NjX6Qe8IUh9hGtMtwkXpDGpzE25i6LQpOFx0dHwu~l5iTH1WnHQo3W9hJSEXqKtqJ~KQyqpOKGvJ32pTcQNLZuOfZiSW6adSC5YkodQs9243pOEohF6YyJdhQeqAIk36pv36de0o~A8QR1ATC5x644aj6SVMazXC7sSElN38avZc2cAq8yZ7bhiPyEVvL0MYpxEuiP9RpAsgyVnHisow9hXhnuL7YYMte6Bfnr1RfXlxZNVAxz9ROMQUeh~RbJHunSVDLFXBztmKZm9pL9ClgA__"
            }
            title="Laptops"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            img={
              "https://s3-alpha-sig.figma.com/img/6739/d39d/c218c97b645d616c8188a4f2e6aaf84b?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LrIo0X3pxrg2ZDDQm1D2uZLZn1B9wlB5fS7wkJkiBDmKIhNrChETsHi7GQ4X6paGCN-wq5o6GFuC~f2V4JlyZ7IdLT-A9SGNTkEGjslxan2zT~DSkesAs9q3Y2FKTbCuk7UGzHHgtlPJqXf-QuQhrU3CklMBUNVFikbGPbaKnlvmfidLrlRi0xhGBFugigdaXWQ4rYf-SbLrq5crWrh9koEahyrUayvQ0bHuPSPhXG~eFO9fhWuOIuE3UYffrQx6iA3EQh26gV4SpNk3o7v6bGvOVC4ga5BPBkY4xo4DMX~k1AEjYuWCRmD2RQfjbsohUZpzcewTAenSwf5FiP-vXg__"
            }
            title="Laptops"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
