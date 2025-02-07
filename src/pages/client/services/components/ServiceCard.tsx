import React from "react";
import { useNavigate } from "react-location";

const ServiceCard = ({
  id,
  img,
  title,
  description,
  startPrice,
  endPrice,
}: {
  id: number;
  img: string;
  title: string;
  description: string;
  startPrice: number;
  endPrice: number;
}) => {
  const navigate = useNavigate();

  const handleServiceClick = (id: number) => {
    navigate({
      to: `/services/${id}`,
      search: {
        img,
        title,
        description,
        startPrice,
        endPrice,
      },
    });
  };

  return (
    <div
      onClick={() => handleServiceClick(id)}
      className="w-[300px] flex flex-col justify-between mb-6 rounded-xl relative hover:scale-90 tranform transition-transform duration-500 ease-in-out shadow-lg"
    >
      <img
        src={img}
        alt="thumbnails"
        className="w-full object-cover rounded-t-lg mb-3"
      />
      <div className="p-2">
        <h1 className="font-medium text-xl">{title}</h1>
        <p className="font-normal text-base text-gray-400">{description}</p>
        <p className="font-medium">
          ${startPrice} - ${endPrice}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;

{
  /* <div className="rounded-xl h-[500px] bg-blue-200 w-full flex-1">
<img
  src={img}
  alt="thumbnails"
  className="w-full object-contain h-full rounded-xl"
/>

<div className="flex flex-col ">
  <div>
    <h1 className="font-medium text-xl">{title}</h1>
  </div> */
}
{
  /* a faint line */
}

{
  /* <div className="">
    <p className="font-normal text-base text-gray-400">{description}</p>
  </div>
  <div className="">
    <p className="font-medium">
      ${startPrice} - ${endPrice}
    </p>
  </div>
</div>
</div> */
}
