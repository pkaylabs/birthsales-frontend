import React from "react";
import {
  CiShop,
  CiDollar,
  CiTwitter,
  CiInstagram,
  CiLinkedin,
  CiDeliveryTruck,
} from "react-icons/ci";
import { TiShoppingBag } from "react-icons/ti";
import { TbMoneybag } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";
import { AiOutlineSafety } from "react-icons/ai";

const About = () => {
  return (
    <div className="max-w-[80rem] mx-auto slide-up">
      {/* home / cart */}
      <div className="mt-6 flex items-center space-x-3 text-gray-400">
        <p>Home</p> <span>/</span> <p className="text-black">About</p>
      </div>

      <div className="mt-[3rem] w-full">
        <div className="flex flex-col gap-16">
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
          <div className=" flex justify-between items-center">
            <div className="border border-gray-200 w-[270px] h-[230px] flex flex-col justify-center items-center rounded-md">
              <div className="border-[12px] border-gray-200 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                <div className="w-full h-full bg-black rounded-full p-1">
                  <CiShop className="w-full h-full text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-[32px]">10.5K</h1>
              </div>
              <div>
                <p className="font-normal text-base">
                  Sallers active on our site
                </p>
              </div>
            </div>
            <div className="border border-gray-200 w-[270px] h-[230px] flex flex-col justify-center items-center rounded-md bg-[#DB4444] text-white">
              <div className="border-[12px] border-gray-400  rounded-full w-[80px] h-[80px] flex justify-center items-center">
                <div className="w-full h-full bg-white rounded-full p-1">
                  <CiDollar className="w-full h-full text-black" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-[32px]">33K</h1>
              </div>
              <div>
                <p className="font-normal text-base">Monthly Product Sale</p>
              </div>
            </div>
            <div className="border border-gray-200 w-[270px] h-[230px] flex flex-col justify-center items-center rounded-md">
              <div className="border-[12px] border-gray-300 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                <div className="w-full h-full bg-black rounded-full p-1">
                  <TiShoppingBag className="w-full h-full text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-[32px]">45.5K</h1>
              </div>
              <div>
                <p className="font-normal text-base">
                  Customers active on our site
                </p>
              </div>
            </div>
            <div className="border border-gray-200 w-[270px] h-[230px] flex flex-col justify-center items-center rounded-md">
              <div className="border-[12px] border-gray-300 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                <div className="w-full h-full bg-black rounded-full p-1">
                  <TbMoneybag className="w-full h-full text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-[32px]">10.5K</h1>
              </div>
              <div>
                <p className="font-normal text-base">
                  Annual gross sale on our site
                </p>
              </div>
            </div>
          </div>
          {/* Team members */}
          <div className="max-w-full flex justify-between space-x-5 overflow-x-auto custom-scrollbar">
            <div className="min-w-[300px] flex-shrink-0 h-[420px] flex flex-col justify-between hover:scale-90 tranform transition-transform duration-500 ease-in-out">
              {/* image */}
              <div className="w-full h-[70%] pt-5 bg-[#F5F5F5] rounded-lg">
                <img
                  src="https://s3-alpha-sig.figma.com/img/0881/49fd/5afc043392ee3cbb529f429b3e2098d3?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e~kGS1VlgbHlM1i4XSfHXXbkZSfU6vaJzXwXwL-n27n6WS5nh8yaC90ZPMtuMEibV9ob37j4LgUgKPalk6TFgUEo8vOirBiEjGqQDFmTTY3bgTa5mw130eU4Qz2kCU8M6HFsD0CKk8H4cC5OUD7hxGkcG1EjlQUtKj5ENUxF8BISyhFfBd3Ikcfh8KFqD8Si-RnleP2mSTMrj-eobpN9h~H7t8KXSay-mF7A7q8hlqzEMJD49nkZAL6VbREsWOXsqPMlu7MXquQObb8b7gf0rLj1SY2a2GKj5Hs6AsKCIeCfr0cO0RdC1UWWVF8lrcYlooWadDm-ecYku8Q6~8AQ-g__"
                  alt="team member"
                  className="w-full h-full m-auto object-contain"
                />
              </div>
              {/*  */}
              <div className="flex flex-col justify-between gap-3">
                <h1 className="font-medium text-3xl">Abdul Nasir Jamal</h1>
                <p className="text-base font-normal">Founder & Chairman</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>
            </div>
            <div className="min-w-[300px] flex-shrink-0 h-[420px] flex flex-col justify-between hover:scale-90 tranform transition-transform duration-500 ease-in-out">
              {/* image */}
              <div className="w-full h-[70%] pt-5 bg-[#F5F5F5] rounded-lg">
                <img
                  src="https://s3-alpha-sig.figma.com/img/8438/eab9/a2fe88af0272adecd83422d0cb7e20d7?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AagT9Md7lu2Deu3NPXXAaLTdxl9KQva8PvOWPhbvDyqKAaJTUekBRdMzmVzlXmwa46bZOXcK2VMrzE2yttlC70P4cks4E7cpOWcHPsk2Ql9n9Hy74mC-3BPmBphch2dprbTv6ulx~k5G1NmDuq6WK5rnuPKMpdShtgFRQu~H2egs15MQyID61D9b-YKJTVa4K81-L7rAUL9JChfzJI0RNKM9xdk9AbP78sJqXMoFhXescOUsiR8wtOCO~El6Ofi0glGcxsr2RxlwhsFO9cQ~mM08J-HTSKyi~qmsRue3DvkYvCcHqmXqvFuSh0AH~ouELKXVzjA1gKgMC0cSaba9tw__"
                  alt="team member"
                  className="w-full h-full m-auto object-contain"
                />
              </div>
              {/*  */}
              <div className="flex flex-col justify-between gap-3">
                <h1 className="font-medium text-3xl">Harriet Kyeremateng</h1>
                <p className="text-base font-normal">Managing Director</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>
            </div>
            <div className="min-w-[300px] flex-shrink-0 h-[420px] flex flex-col justify-between hover:scale-90 tranform transition-transform duration-500 ease-in-out">
              {/* image */}
              <div className="w-full h-[70%] pt-5 bg-[#F5F5F5] rounded-lg">
                <img
                  src="https://s3-alpha-sig.figma.com/img/ede4/8f2b/5df8103b281240ce5bafe5dd7d215ab8?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=d0ZKk8tT3rAlquWSC-aBIf8pTWzEAywPLunkIgY2hMINmu~J2ZoUXMJMW-pqjD-rEjOY0E2hfWpsynyF1ZDm46V-CuVrYC00zuYX~P4Th3VDjfWgciwh53pZFVRKjjzs3Jcblmn59~oBJRdtg6Mumkgctdol20nHQYpsZZmsaMn3~gSilHQhXh8bKwJdOqexwLeH~w7AJ-myU4qjkSj3~qz3brjqTtFuOHhXFIzffZrM~2OXa9mOAgM8LNpRZ5zC51Y44BCaCnOriH8Pr0X1AfI4T6J7Ztg7T8UHFnrpFueZ7j5mM1NCFz6v2DIXdTVnYlE5maoCVVdLy~U1LfHkxQ__"
                  alt="team member"
                  className="w-full h-full m-auto object-contain"
                />
              </div>
              {/*  */}
              <div className="flex flex-col justify-between gap-3">
                <h1 className="font-medium text-3xl">Isaac Childrex</h1>
                <p className="text-base font-normal">Product Designer</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>
            </div>
            <div className="min-w-[300px] flex-shrink-0 h-[420px] flex flex-col justify-between hover:scale-90 tranform transition-transform duration-500 ease-in-out">
              {/* image */}
              <div className="w-full h-[70%] pt-5 bg-[#F5F5F5] rounded-lg">
                <img
                  src="https://s3-alpha-sig.figma.com/img/ede4/8f2b/5df8103b281240ce5bafe5dd7d215ab8?Expires=1738540800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=d0ZKk8tT3rAlquWSC-aBIf8pTWzEAywPLunkIgY2hMINmu~J2ZoUXMJMW-pqjD-rEjOY0E2hfWpsynyF1ZDm46V-CuVrYC00zuYX~P4Th3VDjfWgciwh53pZFVRKjjzs3Jcblmn59~oBJRdtg6Mumkgctdol20nHQYpsZZmsaMn3~gSilHQhXh8bKwJdOqexwLeH~w7AJ-myU4qjkSj3~qz3brjqTtFuOHhXFIzffZrM~2OXa9mOAgM8LNpRZ5zC51Y44BCaCnOriH8Pr0X1AfI4T6J7Ztg7T8UHFnrpFueZ7j5mM1NCFz6v2DIXdTVnYlE5maoCVVdLy~U1LfHkxQ__"
                  alt="team member"
                  className="w-full h-full m-auto object-contain"
                />
              </div>
              {/*  */}
              <div className="flex flex-col justify-between gap-3">
                <h1 className="font-medium text-3xl">Abdul Nasir Jamal</h1>
                <p className="text-base font-normal">Founder & Chairman</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>
            </div>
          </div>
          <div className=" flex justify-evenly items-center">
            <div className=" w-[270px] h-[230px] flex flex-col gap-5 justify-center items-center rounded-md">
              <div className="border-[12px] border-gray-200 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                <div className="w-full h-full bg-black rounded-full p-1">
                  <CiDeliveryTruck className="w-full h-full text-white" />
                </div>
              </div>
              <div>
                <div className="w-full ">
                  <h1 className="font-bold text-lg w-full text-center">
                    FREE AND FAST DELIVERY
                  </h1>
                </div>
                <div>
                  <p className="font-normal text-base">
                    Free delivery for all orders over $140
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-[270px] h-[230px] flex flex-col gap-5 justify-center items-center rounded-md">
              <div className="border-[12px] border-gray-200 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                <div className="w-full h-full bg-black rounded-full p-1">
                  <RiCustomerServiceLine className="w-full h-full text-white" />
                </div>
              </div>
              <div>
                <div className="w-full ">
                  <h1 className="font-bold text-lg w-full text-center">
                    24/7 CUSTOMER SERVICE
                  </h1>
                </div>
                <div>
                  <p className="font-normal text-base">
                    Friendly 24/7 customer support
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-[270px] h-[230px] flex flex-col gap-5 justify-center items-center rounded-md">
              <div className="border-[12px] border-gray-200 rounded-full w-[80px] h-[80px] flex justify-center items-center">
                <div className="w-full h-full bg-black rounded-full p-1">
                  <AiOutlineSafety className="w-full h-full text-white" />
                </div>
              </div>
              <div>
                <div className="w-full ">
                  <h1 className="font-bold text-lg w-full text-center">
                    MONEY BACK GUARANTEE
                  </h1>
                </div>
                <div>
                  <p className="font-normal text-base">
                    We return money back within 30days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
