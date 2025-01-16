import React from "react";
import WishCard from "./component/WishCard";

const WishList = () => {
  return (
    <div className="max-w-[80rem] m-auto mt-5">
      {/* wishlist */}
      <div className="flex flex-col gap-5 mb-5">
        {/* Headers */}
        <div className="flex justify-between items-center">
          <h1 className="">WishList (4)</h1>
          <button className="p-2 border border-gray-300 rounded-md">
            Move All To Bag
          </button>
        </div>
        {/* wishcards */}
        <div className="flex flex-wrap justify-center gap-5 slide-up">
          <WishCard
            price={"$600"}
            title={"RGB liquid CPU Cooler"}
            img={
              "https://s3-alpha-sig.figma.com/img/6739/d39d/c218c97b645d616c8188a4f2e6aaf84b?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LrIo0X3pxrg2ZDDQm1D2uZLZn1B9wlB5fS7wkJkiBDmKIhNrChETsHi7GQ4X6paGCN-wq5o6GFuC~f2V4JlyZ7IdLT-A9SGNTkEGjslxan2zT~DSkesAs9q3Y2FKTbCuk7UGzHHgtlPJqXf-QuQhrU3CklMBUNVFikbGPbaKnlvmfidLrlRi0xhGBFugigdaXWQ4rYf-SbLrq5crWrh9koEahyrUayvQ0bHuPSPhXG~eFO9fhWuOIuE3UYffrQx6iA3EQh26gV4SpNk3o7v6bGvOVC4ga5BPBkY4xo4DMX~k1AEjYuWCRmD2RQfjbsohUZpzcewTAenSwf5FiP-vXg__"
            }
          />
          <WishCard
            price={"$450"}
            title={"Gucci duffle bag"}
            img={
              "https://s3-alpha-sig.figma.com/img/4f3c/a1d1/2722dbdf98f25179d3c0b785988c513d?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iA0crnI392D3e3Z9VeDwKwWdCbEy7mX-fgABU1fMN00imHJIuxqM4DZwmKNEwwdnEqC9Q6n7Oo3WhezM9jRMwkMABxo79w6UbK9w~MGWeqbPDk52JZY1gqK~OWguGU4VfEaugNwutnOD5NVuZ~AiEhInbF8puYiDqH7hlkw7~ULvVNMoRPtSURnSFEdxGg4eh8xm72wsYTAHFtTUXOUKH-LSZeyhavH3CcWgP6yF5pMmIVUJbt4dIN0bVCWKnRDSfM8vcYQb7QHzy6lxS7uAy4zTAiJlUOSsPLvgIzYwGckssk5YmQMZ3CBwbbeQ-C1PEjaTdNCp~dAVtA5SL4~uzw__"
            }
          />
          <WishCard
            price={"$550"}
            title={"GP11 Shooter USB Gamepad"}
            img={
              "https://s3-alpha-sig.figma.com/img/288e/0133/65fe639fccc1fe4168fca740ef1f85e7?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HNk7VuWjqrbNmMsYUH0EWdMt7Z1Ndf7Nv597FjsVS70K4oPYFXWeqPnNb3j83rYmhqncv1PWWlJICu14dGiSwRBvcWUqJRTqMNtGLCSmdngToYWbBck24~rCvvQqADEfkCyz4qClf93MjSSjkRWFw3RgdkE4S03I3tOU-Hz1XgG1JH00bnA8hSD1e-ywZnwvyErJBRJ-PoCN2nLyXsPZn-xCVZmKNKeus~e0IKkKD9Z9mYR7Hzu3KNumobE6fHxJb9u244sId6cZS7J4lbz9az7c4kRUTmiBJ4EaKCfPCwCRRjsZBL-mWeozn7CzoBCz7zQTpXldgOijypVsxLZLVg__"
            }
          />
          <WishCard
            price={"$750"}
            title={"Quilted Satin Jacket"}
            img={
              "https://s3-alpha-sig.figma.com/img/04a1/915f/d6cedd7c8b1073685c5f1be1b50e1ac6?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EtgMC9jiFrs0EcWRDmVWwGT6gLVeThTBS~80pL1XCZYPuH-W71vSgj7sirtDajsg8NRNWEZyaDxq0xWcB8lA0uHgLzAclnfHNRbwRHFdzFkbNgfZGApPJy2VHl0ftm07LOa68Ulomu3etHonG864xn9TmuXMt1OhM3Ym2DjCn7VkISiwh4N7SXXjupIN3XcF~gMH~JWxzOTucGx-YFssWW4PiDqhxp0eDgEEJ1YvSnehX5sDpXyZYpEnB689udpVMNTfHyJJZLGWidT2zeo0KYloHKzBTQKnwr-AH0ZwXh6B5MJ33XFlWYwXX5zGxPtCxC4ui66ez0CcbCp6x08SrQ__"
            }
          />
          {/* <WishCard />
               <WishCard /> */}
        </div>
      </div>
      {/* just for you */}
      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between gap-2">
            <div className="w-4 bg-red h-8 rounded-md"></div>
            <h1 className="">Just For You</h1>
          </div>
          <button className="p-2 border border-gray-300 rounded-md">See All</button>
        </div>
        {/* wishcards */}
        <div className="flex flex-wrap justify-center gap-5 slide-up">
          <WishCard
            price={"$960"}
            title={"ASUS FHD Gaming Laptop"}
            img={
              "https://s3-alpha-sig.figma.com/img/203b/e522/b7b02d10672f6f6147762cf52bfcfc54?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dlC-d-hX5hQkowPviPy8hNWDGvuRxUQH~vw3sEn0g1QBg6aB~Ud~fPlxSXqKkYOi7cz6uRziC0y4dRlo9bA6RA7JlqaJFlyfCSz3HUnfKBnQ01mWM5IVseQ4ZrINCKccqmW9WZ6eRAFYSBEjxsvDpGnfPmacWEMtUX2nQBc71xkMJhM7qalqUbTkLQbIW7Du6YSykUFgpJebdBPn-gQcccTkpNyKITF0QAIa4k~s4POKqyvxm1vjIb~yrcmuc~jdVfgUabLWYNkvOFVA77Dk61ZN3IcpwJ6ap287DE~1z-Uc~OldUp6d23xC459meQ7Ef7K09NGViNJhx2nlpccTZg__"
            }
          />
          <WishCard
            price={"$450"}
            title={"IPS LCD Gaming Monitor"}
            img={
              "https://s3-alpha-sig.figma.com/img/5e63/4682/db5174aff99bb9337d2dc9598a0b44e4?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Yoi~-qXJLOyUV5X5G7geN0H4zjHySD4QoYlVuNDen2f95gpJQWI2zi-HFPyMp2-tFIjwW2WDEMrdGetIsKJTzoWNifqVwOCAPiIERZpVhgGvtdlleIfE6zCBR4e2A9GYmNUPb~RnOp7pi5ETnh7ZeyAlq5dno1o8V0ok~riEkoBYEa~QPoo-kh4703RHG0Nc5c0lkNk2f2d8-z7kOcCf-d5JHA-jsQXE2THEmCgUyQYgqriAMcZfVaBhHCFI0EO4iLq0oSyj0YNCzIQVC1u3cw1MlO3OabWBhLMmh1xE6E2Po6QUwaBqpjn-ZHWbi5I9Ly4rYsdsesN76JBX8nlo2g__"
            }
          />
          <WishCard
            price={"$550"}
            title={"HAVIT HV-G92 Gamepad"}
            img={
              "https://s3-alpha-sig.figma.com/img/5d5c/2e52/50752d55f8b60f2aa2923183dadbc135?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RJNy7mMw6v4N95SheyRr6eTN4GKuZHV6BhckEq1EOtOE7gTOjG2E8xXrJFcKzyWsAeEXatsRKxYU~7zP4BkH28bQfXfSzNPYngrcNcGvE5uXvXfUa4Bv-tr3cHGfVLidOhunPf2XgRQGsIbuEBtzHh~Y9B~Q~Wsshj2z6RJmHvPAXt2h7xtSgm24oShXcKKD9gdQBPFPG-6GcQgcysjh7Y3hN-SfopsIJ1eQ9sWO-MVtoV6N1Lj8lfaYjMvu~2acIHcJMz-MXjyZ1fFDFx34-~Lhc3j---qxS46ccYbMUhaO6y-Q6v3miIFjL58rFOj2F2QD1scXphYHzxG9vIQwRg__"
            }
          />
          <WishCard
            price={"$750"}
            title={"AK-900 Wired Keyboard"}
            img={
              "https://s3-alpha-sig.figma.com/img/e59d/9f34/8cc24eeff489863523b63971c3ff8e4a?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FSE78Tz65VlRUa-zDh5rc5FzVbnlnot2ZPm4CpqwvLMcskCBZX0xYfv-9PsAv2n-NjX6Qe8IUh9hGtMtwkXpDGpzE25i6LQpOFx0dHwu~l5iTH1WnHQo3W9hJSEXqKtqJ~KQyqpOKGvJ32pTcQNLZuOfZiSW6adSC5YkodQs9243pOEohF6YyJdhQeqAIk36pv36de0o~A8QR1ATC5x644aj6SVMazXC7sSElN38avZc2cAq8yZ7bhiPyEVvL0MYpxEuiP9RpAsgyVnHisow9hXhnuL7YYMte6Bfnr1RfXlxZNVAxz9ROMQUeh~RbJHunSVDLFXBztmKZm9pL9ClgA__"
            }
          />
          
        </div>
      </div>
    </div>
  );
};

export default WishList;
