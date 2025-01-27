import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import successful from "@/assets/images/successful.gif";
import { useNavigate } from "react-location";
import { HOME } from "@/constants";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(true);

  const handleBackToHome = () => {
    navigate({ to: HOME });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-poppins max-w-[75rem] mx-auto  mb-[10rem]">
      {showLoader ? (
        <div className="loader fade-in flex items-center justify-between mt-[15rem]">
          <div className="mx-auto text-center">
            <div className="payment-loader mx-auto mb-6"></div>
            <h1 className="font-semibold text-2xl text-gray-600">
              Processing your payment...
            </h1>
          </div>
        </div>
      ) : (
        <div className="paid w-full h-[40rem]">
          <div className="zoom-in mt-10 md:mt-0">
            <img
              src={successful}
              alt="successful"
              className="md:w-[40rem] w-[25rem] pt-[2rem] m-auto pulse"
            />
            <h1 className="text-center font-semibold md:text-3xl text-2xl text-gray-500 mt-2">
              Order Placed!
            </h1>
            <p className="text-center mt-2 text-sm md:text-lg text-gray-800 font-semibold">
              Thank you for your order{" "}
              <span className="text-rose-500">Asumasi</span>. Your order will
              arrive shortly.
            </p>
          </div>
          <button
            className="btn-backhome px-4 py-2 mx-auto flex items-center justify-center mt-10 text-white bg-green-500 hover:bg-green-600"
            onClick={handleBackToHome}
          >
            <FontAwesomeIcon icon={faCircleArrowLeft} className="mr-2" />
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmOrder;
