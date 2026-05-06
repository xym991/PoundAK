import React, { useState, useEffect, useRef, useMemo } from "react";
import Calendar from "./Calender";
import Coach from "../../../../../public/icons/IconMouseOver.png";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import axios from "@/utils/axios"; // Use your custom axios instance
import paths from "@/utils/routes"; // Use defined API paths
import usePlayerContext from "@/screens/background/hooks/usePlayerContext";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/state/chatSlice";
import { setPortal, setTab } from "@/state/routerSlice";
import Image from "next/image";
import cn from "@/utils/classname";
import DOMPurify from "dompurify";
import { DailyXP } from "../Home/Home";

function Message({ content, coach, name }: any) {
  const html = useMemo(() => DOMPurify.sanitize(content), [content]);
  return (
    <div className={cn("message", coach ? "coach" : "user")}>
      {coach && (
        <h2 className="uppercase">
          <Image src={Coach} alt="coach" height={24} width={24}></Image>
          COACH
        </h2>
      )}

      <p className="content" dangerouslySetInnerHTML={{ __html: html }}></p>
    </div>
  );
}
const Journal = () => {
  try {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state?.user);
    const [username, setUsername] = useState("");
    //console.log(user);
    // useEffect(() => {
    //   if (!user) {
    //     dispatch(setTab("home"));
    //     dispatch(setPortal("login"));
    //   }
    // }, [user, dispatch]);
    const playerContext = usePlayerContext();

    // if (!user) return null;

    const today = new Date().toLocaleDateString("en-US");
    const [selectedDate, setSelectedDate] = useState(today);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messages = useSelector(
      (state: any) => state.chat[selectedDate] || []
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      window?.overwolf?.profile?.getCurrentUser((res) => {
        if (res && res.success) {
          setUsername(res.username || "Player");
        } else {
          console.error("Failed to get current user:", res);
        }
      });
    }, [messages]);

    const handleSendMessage = async (e?: any, message?: any) => {
      if ((!message && !input.trim()) || loading) return;
      dispatch(addMessage({ sender: "You", text: message || input }));
      setInput("");
      setLoading(true);
      try {
        const { data } = await axios.post(paths.chat, {
          chat: messages.slice(Math.max(messages.length - 5, 0)),
          playerData: playerContext,
          message: message || input,
        });

        dispatch(addMessage({ sender: "Coach", text: data.message }));
      } catch (error) {
        console.error("AI Chat Error:", error);
        dispatch(
          addMessage({ sender: "Coach", text: "Error fetching response." })
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="_journal screen w-full flex justify-between flex-1 gap-4 relative">
        <h2>
          Journal <DailyXP />
        </h2>
        <Calendar
          year={new Date().getFullYear()}
          month={new Date().getMonth()}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="chat flex-1 overflow-hidden py-4 gap-4 flex flex-col">
          <div className="messages flex flex-col gap-4 overflow-y-scroll max-h-[400px] px-4">
            <Message
              content={`
                What's up, ${
                  user?.info?.playerTag || username
                }? <br /> To improve accuracy ensure your stats, habits, and
                progress are all logged — ask me anything when you're ready.
              `}
              name={"Coach"}
              coach={true}
              key={"intro"}
            />
            {messages?.map((msg: any, i: any) => (
              <Message
                content={msg.text}
                name={msg.sender}
                coach={msg.sender !== "You"}
                key={i}
              />
            ))}
            {loading && <p className="loading">Coach is typing...</p>}
            {/* Empty div to scroll to last message */}
            <div ref={messagesEndRef} />
          </div>
          {selectedDate == today && (
            <div className="message-box mx-4 flex-1 h-[74px] max-h-[74px] flex items-center gap-4 p-2 pl-4 mt-auto">
              {!messages?.length && (
                <div className="suggestions">
                  <p
                    onClick={() =>
                      handleSendMessage(null, "How do I train like a gamer?")
                    }
                  >
                    How do I train like a gamer?
                  </p>
                  <p
                    onClick={() =>
                      handleSendMessage(
                        null,
                        "Help me build a pre-game routine."
                      )
                    }
                  >
                    Help me build a pre-game routine.
                  </p>
                  <p
                    onClick={() =>
                      handleSendMessage(
                        null,
                        "Help me build a pre-game routine."
                      )
                    }
                  >
                    Help me build a pre-game routine.
                  </p>
                  <p
                    onClick={() =>
                      handleSendMessage(null, "How do I train like a gamer?")
                    }
                  >
                    How do I train like a gamer?
                  </p>
                </div>
              )}
              <input
                type="text"
                className="flex-1 bg-transparent outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  user
                    ? "Ask me anything gaming and fitness ..."
                    : "Please login to chat "
                }
                disabled={!user}
              />
              <SendRoundedIcon
                className="text-primary cursor-pointer"
                onClick={handleSendMessage}
              />
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.log(e);
  }
};

export default Journal;
