import React, { ReactElement, ReactNode } from "react";
import "./index.css";
const Button = ({ children, active, onClick, title }: any) => {
  return (
    <div
      title={title}
      className={"_button" + (active ? " active" : "")}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Button;
