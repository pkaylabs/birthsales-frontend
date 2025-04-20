import React, { FC, Fragment } from "react";

type Props = {
  children: React.ReactNode;
  when: boolean | number | string | null | undefined;
};

const Show: FC<Props> = ({ children, when }) => {
  return when ? <Fragment>{children}</Fragment> : null;
};

export default Show;
