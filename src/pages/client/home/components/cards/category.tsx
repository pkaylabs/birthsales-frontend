// import React from "react";
// import { IoPhonePortraitOutline } from "react-icons/io5";

// const CategoryCard = () => {
//   return (
//     <div
//       className="group h-36  border border-black hover:border-white hover:bg-[#DB4444] rounded-md
//      flex flex-col space-y-2 justify-center items-center cursor-pointer transition-all duration-150 ease-in-out
//       mobile:w-24 mobile:h-20 mobile:space-y-3"
//     >
//       <IoPhonePortraitOutline
//         className="size-10 group-hover:text-white transition-all duration-150 ease-in-out mobile:size-5"
//         aria-hidden="true"
//       />
//       <p className="text-base text-black group-hover:text-white transition-all duration-150 ease-in-out mobile:text-[12px]">
//         HeadPhones
//       </p>
//     </div>
//   );
// };

// export default CategoryCard;

// import { IoPhonePortraitOutline } from "react-icons/io5";

// const CategoryCard = () => {
//   return (
//     <div
//       className="group border border-gray-300 rounded-md transition-all duration-150 ease-in-out cursor-pointer
//       flex flex-col items-center justify-center
//       mobile:w-24 mobile:h-24
//       tablets:w-32 tablets:h-32
//       desktop:w-40 desktop:h-40
//       hover:bg-[#DB4444] hover:border-transparent"
//     >
//       <IoPhonePortraitOutline
//         className="transition-all duration-150 ease-in-out text-gray-700
//           group-hover:text-white
//           mobile:text-2xl
//           tablets:text-4xl
//           desktop:text-5xl"
//         aria-hidden="true"
//       />
//       <p
//         className="mt-2 transition-all duration-150 ease-in-out text-gray-700
//           group-hover:text-white
//           mobile:text-sm
//           tablets:text-base
//           desktop:text-lg"
//       >
//         HeadPhones
//       </p>
//     </div>
//   );
// };

// export default CategoryCard;
import React from "react";
import { IoPhonePortraitOutline } from "react-icons/io5";

const CategoryCard = () => {
  return (
    <div
      className="group w-full h-full border border-gray-300 rounded-md transition-all duration-150 ease-in-out cursor-pointer
      flex flex-col items-center justify-center p-4 hover:bg-[#DB4444] hover:border-transparent"
    >
      <IoPhonePortraitOutline
        className="transition-all duration-150 ease-in-out text-gray-700 group-hover:text-white text-5xl
          mobile:text-2xl tablets:text-4xl desktop:text-5xl"
        aria-hidden="true"
      />
      <p
        className="mt-2 text-center transition-all duration-150 ease-in-out text-gray-700 group-hover:text-white
          mobile:text-sm tablets:text-base desktop:text-lg"
      >
        HeadPhones
      </p>
    </div>
  );
};

export default CategoryCard;
