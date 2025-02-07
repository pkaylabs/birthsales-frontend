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
                src="https://images.unsplash.com/photo-1536336076412-fd2a4de236f0?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          <div className="max-w-full flex justify-between space-x-5 overflow-x-auto custom-scrollbar mt-5">
            <div className="grid grid-cols-4 gap-5">
              {/* image */}
              <div className="w-full h-[70%] bg-[#F5F5F5] hover:scale-90 tranform transition-transform duration-500 ease-in-out">
                <img
                  src="https://images.unsplash.com/photo-1491349174775-aaafddd81942?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="team member"
                  className="w-full h-full mb-5 object-cover rounded-t-lg"
                />
                <h1 className="font-medium text-3xl">Abdul Nasir Jamal</h1>
                <p className="text-base font-normal">Founder & Chairman</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>
              <div className="w-full h-[70%] bg-[#F5F5F5] hover:scale-90 tranform transition-transform duration-500 ease-in-out">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="team member"
                  className="w-full h-full mb-5 object-cover rounded-t-lg"
                />
                <h1 className="font-medium text-3xl">Isaac Abu</h1>
                <p className="text-base font-normal">Founder & Chairman</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>
              <div className="w-full h-[70%] bg-[#F5F5F5] hover:scale-90 tranform transition-transform duration-500 ease-in-out">
                <img
                  src="https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="team member"
                  className="w-full h-full mb-5 object-cover rounded-t-lg"
                />
                <h1 className="font-medium text-3xl">Prince Kyeremateng</h1>
                <p className="text-base font-normal">Founder & Chairman</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>
              <div className="w-full h-[70%] bg-[#F5F5F5] hover:scale-90 tranform transition-transform duration-500 ease-in-out">
                <img
                  src="https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="team member"
                  className="w-full h-full mb-5 object-cover rounded-t-lg"
                />
                <h1 className="font-medium text-3xl">Harriet Kyeremateng</h1>
                <p className="text-base font-normal">Founder & Chairman</p>
                <div className="flex gap-2 items-center">
                  <CiTwitter />
                  <CiInstagram />
                  <CiLinkedin />
                </div>
              </div>

              {/*  */}
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
