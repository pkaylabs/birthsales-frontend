import { useState } from "react";
import close from '@/assets/images/close.png'
import create from '@/assets/images/create.png'

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: "patient" | "users";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const [open, setOpen] = useState(false);
  const size = type === "create" ? "w-8 h-8" : "w-7 h-8";
  const bgColor =
    type === "create"
      ? "bg-primary"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamasKyPurple";
  return (
    <>
      <button
        className={`${size} ${bgColor} flex items-center justify-center rounded-full`}
        onClick={() => setOpen(true)}
      >
        <img src={create} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <img src={close} alt="" width={14} height={14} />
            </div>
            {/* <Form /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
