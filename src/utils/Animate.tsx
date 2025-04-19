import { Box, BoxProps, SxProps, Theme } from "@mui/material";
import React, { useEffect, useState } from "react";

interface AnimateProps extends BoxProps {
  type?: "fade";     
  delay?: number;     
}

const Animate: React.FC<AnimateProps> = ({
  sx,
  type,
  delay = 0,
  children,
  ...rest
}) => {
  const [translateY, setTranslateY] = useState(1000);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTranslateY(0);
      setOpacity(1);
    });
    return () => clearTimeout(timeout);
  }, []);

  // build a common style object
  const style: SxProps<Theme> = {
    ...sx,
    opacity,
    transitionDelay: `${delay}s`,
    ...(type === "fade"
      ? { transition: "opacity 1s ease" }
      : {
          transform: `translateY(${translateY}px)`,
          transition: "transform 1s ease, opacity 2s ease",
        }),
  };

  return (
    <Box sx={style} {...rest}>
      {children}
    </Box>
  );
};

export default Animate;



// import { Box } from '@mui/material';
// import React, { useEffect, useState } from 'react';

// const Animate = ({ sx, ...props }) => {
//   const [translateY, setTranslateY] = useState(1000);
//   const [opacity, setOpacity] = useState(0);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setTranslateY(0);
//       setOpacity(1);
//     });

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, []);

//   if (props.type === "fade") {
//     return (
//       <Box sx={{
//         ...sx,
//         transition: "opacity 1s ease",
//         opacity: opacity,
//         transitionDelay: props.delay + "s" || "unset"
//       }}>
//         {props.children}
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{
//       ...sx,
//       transform: `translateY(${translateY}px)`,
//       transition: "transform 1s ease, opacity 2s ease",
//       opacity: opacity,
//       transitionDelay: props.delay + "s" || "unset"
//     }}>
//       {props.children}
//     </Box>
//   );
// };

// export default Animate;