import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CloseIcon from "@/screens/desktop/header/toolbar/buttons/images/CloseIcon";
import { useDispatch, useSelector } from "react-redux";
import { setPortal } from "@/state/routerSlice";
const Modal = ({
  children,
  close,
  className = "",
}: {
  children: ReactNode;
  close?: () => void;
  className?: string;
}) => {
  const router = useSelector((state: any) => state.router);
  const dispatch = useDispatch();
  return ReactDOM.createPortal(
    <div className={"_modal-overlay " + className}>
      <div className={"modal " + className}>
        <button
          className="close"
          onClick={close || (() => dispatch(setPortal("")))}
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("portal") as HTMLElement
  );
};

export default Modal;
