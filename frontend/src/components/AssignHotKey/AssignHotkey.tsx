import React, { useState, useEffect } from "react";
import "./AssignHotkey.css";
const { log } = console;

const AssignHotkey = ({ name, close }: { name: string; close: () => void }) => {
  const [keys, setKeys] = useState<string[]>([]);
  const [keyCodes, setKeyCodes] = useState<number[]>([]);

  const isModifierKey = (key: string) =>
    ["Shift", "Control", "Alt"].includes(key);

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    const key = event.key;
    const keyCode = event.keyCode;

    const modifierKeys = keys.filter(isModifierKey);
    const normalKeys = keys.filter((k) => !isModifierKey(k));

    if (isModifierKey(key)) {
      if (normalKeys.length === 0 && !modifierKeys.includes(key)) {
        setKeys((prevKeys) => [...prevKeys, key]);
        setKeyCodes((prevCodes) => [...prevCodes, keyCode]);
      }
    } else {
      if (modifierKeys.length > 0 && normalKeys.length === 0) {
        setKeys((prevKeys) => [...prevKeys, key]);
        setKeyCodes((prevCodes) => [...prevCodes, keyCode]);
      }
    }
  };

  const handleSave = () => {
    //console.log("Saved keys:", keys);
    //console.log("KeyCodes:", keyCodes);
    const modifiers: object = keys.filter(isModifierKey).reduce(
      (acc: any, key: string) => ({
        ...acc,
        [key.toLowerCase().replace("ontro", "tr")]: true,
      }),
      {}
    );
    log(modifiers);
    overwolf.settings.hotkeys.assign(
      {
        name,
        virtualKey: keyCodes[keyCodes.length - 1],
        modifiers,
      },
      (r) => {
        close();
      }
    );
  };

  const handleDiscard = () => {
    setKeys([]);
    setKeyCodes([]);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, keyCodes]);

  return (
    <div className="_assign-hot-keys">
      <h2 className="capitalize font-normal text-lg mb-4 text-center">
        Assign Hotkey for {name}
      </h2>
      <div className="border border-gray-700 container">
        {keys.length > 0 ? (
          keys.map((key, index) => (
            <span key={index} className="key">
              {key}
            </span>
          ))
        ) : (
          <span className="text-gray-500">Press keys to assign...</span>
        )}
      </div>
      <div className="buttons mt-4 flex justify-between gp-4">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDiscard}>Discard</button>
      </div>
    </div>
  );
};

export default AssignHotkey;
