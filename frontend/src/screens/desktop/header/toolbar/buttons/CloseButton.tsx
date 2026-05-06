import { FC } from "react";
import ButtonWrapper from "./ButtonWrapper";
import CloseIcon from "./images/CloseIcon";

const CloseButton: FC<{ windowName: string }> = ({ windowName }) => (
  <ButtonWrapper
    onClick={() => overwolf.windows.close("desktop")}
    className={"_close"}
  >
    <CloseIcon id="close" />
  </ButtonWrapper>
);

export default CloseButton;
