import Image from "next/image";
import React from "react";
import done from "@/assets/images/home/done.png";
import wallet2 from "@/assets/images/wallet/wallet2.png";
const TaskItem = ({ name, xp, completed }: any) => (
  <div className="task-item">
    {completed ? (
      <Image
        src={done}
        alt="done"
        height={16}
        width={16}
        className="task-done"
      />
    ) : (
      <div className="task-circle" />
    )}
    <div className="task-name">{name}</div>
    <div className="task-xp flex items-center gap-1 justify-center">
      <span className="flex items-center justify-center relative top-[2px]">
        {" "}
        +{xp}
      </span>{" "}
      <Image src={wallet2} alt="wallet" height={16} />
    </div>
  </div>
);

export default TaskItem;
