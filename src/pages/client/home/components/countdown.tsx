import React, { useEffect, useState } from "react";

interface CountdownProps {
  endDateTime: string;
  showInCat?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ endDateTime, showInCat }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const targetDate = new Date(endDateTime).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({
          days: String(days).padStart(2, "0"),
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      } else {
        setTimeRemaining({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        clearInterval(interval);
      }
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endDateTime]);

  const timerObjArr = [
    {
      label: "Days",
      value: timeRemaining.days,
    },
    {
      label: "Hours",
      value: timeRemaining.hours,
    },
    {
      label: "Minutes",
      value: timeRemaining.minutes,
    },
    {
      label: "Seconds",
      value: timeRemaining.seconds,
    },
  ];

  return (
    <>
      {showInCat ? (
        <div className="">
          <div className="flex items-center font-mono space-x-4 mobile:hidden">
            {timerObjArr.map((timerObj, index) => (
              <div
                key={index}
                className="bg-white w-16 h-16 rounded-full flex flex-col justify-center items-center"
              >
                <h3 className="font-semibold text-base leading-4">
                  {timerObj.value}
                </h3>
                <p className="text-[11px] font-poppins">{timerObj.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center font-mono space-x-2 mobile:hidden">
          {timerObjArr.map((timerObj, index) => (
            <>
              <div key={index} className="">
                <p className="text-xs">{timerObj.label}</p>
                <h3 className="font-semibold text-2xl">{timerObj.value}</h3>
              </div>
              {index < timerObjArr.length - 1 && (
                <span className="text-[#E07575] mt-3 font-semibold text-2xl">
                  :
                </span>
              )}
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default Countdown;
