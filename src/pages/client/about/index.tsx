import React from "react";
import {
  CiShop,
  CiDollar,
  CiTwitter,
  CiInstagram,
  CiLinkedin,
} from "react-icons/ci";
import { TiShoppingBag } from "react-icons/ti";
import { TbMoneybag } from "react-icons/tb";
import BottomCards from "../home/components/bottom-cards";
import { useNavigate } from "react-location";
import seth from "@/assets/images/seth.jpg";
import pastore from "@/assets/images/pastore.jpg";
import luxora from "@/assets/images/luxora.jpg";

const stats = [
  {
    icon: <CiShop className="w-8 h-8 text-white" />,
    value: "10.5K",
    label: "Active Sellers",
    bg: "bg-white",
    fg: "text-gray-900",
    border: "border-gray-200",
  },
  {
    icon: <CiDollar className="w-8 h-8 text-black" />,
    value: "33K",
    label: "Monthly Sales",
    bg: "bg-red-600",
    fg: "text-white",
    border: "border-red-600",
  },
  {
    icon: <TiShoppingBag className="w-8 h-8 text-white" />,
    value: "45.5K",
    label: "Active Buyers",
    bg: "bg-white",
    fg: "text-gray-900",
    border: "border-gray-200",
  },
  {
    icon: <TbMoneybag className="w-8 h-8 text-white" />,
    value: "10.5K",
    label: "Annual Sales",
    bg: "bg-white",
    fg: "text-gray-900",
    border: "border-gray-200",
  },
];

const team = [
  {
    name: "Seth Annan Addo",
    role: "Founder & Chairman",
    img: seth,
  },
  {
    name: "Neequaye Prosper Pastore Kotei",
    role: "Co-Founder",
    img: pastore,
  },
  {
    name: "Laura Sampong",
    role: "CTO",
    img: luxora,
  },
];

const About: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-8" aria-label="Breadcrumb">
        <ol className="flex space-x-2">
          <li>
            <button
              onClick={() => navigate({ to: "/" })}
              className="hover:underline"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">About</li>
        </ol>
      </nav>

      {/* Our Story */}
      <section className="flex flex-col lg:flex-row items-center gap-8 mb-16">
        <div className="lg:w-1/2 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Our Story
          </h1>
          <p className="text-gray-600 leading-relaxed">
            To empower businesses and customers worldwide by providing a
            seamless, secure, and personalized online shopping
            experience—delivering quality products, exceptional services, and
            innovation at every click to revolutionize how people shop and do
            business.
          </p>
        </div>
        <div className="lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1536336076412-fd2a4de236f0?q=80&w=2071"
            alt="Our Story"
            className="rounded-lg w-full h-auto object-cover shadow"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-6 border ${s.border} rounded-lg ${s.bg}`}
          >
            <div className="p-4 rounded-full bg-gray-200 mb-4">{s.icon}</div>
            <h2 className={`text-3xl font-bold ${s.fg}`}>{s.value}</h2>
            <p className={`mt-2 text-center ${s.fg}`}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-medium text-gray-800">{m.name}</h3>
                <p className="text-gray-500">{m.role}</p>
                <div className="flex space-x-3 mt-3 text-gray-600">
                  <a href="#" className="hover:text-blue-500">
                    <CiTwitter size={20} />
                  </a>
                  <a href="#" className="hover:text-pink-500">
                    <CiInstagram size={20} />
                  </a>
                  <a href="#" className="hover:text-blue-700">
                    <CiLinkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Cards */}
      <section>
        <BottomCards />
      </section>
    </div>
  );
};

export default About;
