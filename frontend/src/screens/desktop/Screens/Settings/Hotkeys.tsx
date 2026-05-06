import React, { useEffect, useState } from "react";
import { Field } from "./Profile";
import Modal from "@/components/Modal/Modal";
import AssignHotkey from "@/components/AssignHotKey";
import useHotKeys from "@/screens/background/hooks/useHotKeys";
const { log } = console;

const Hotkeys = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [keyToSet, setKeyToSet] = useState<any>(null);
  function getKeys() {
    overwolf.settings.hotkeys.get((keys) => {
      // console.log("keys", keys);
      setKeys(keys.globals);
    });
  }
  useEffect(() => {
    getKeys();
  }, []);
  return (
    <div className="_settings-page hotkeys">
      <h2>Hot keys</h2>
      <div className="page-buttons">
        <button>Cancel</button>
        <button>Save</button>
      </div>
      <div className="section flex flex-col overflow-auto max-h-[480px]">
        {keys.map((k) => (
          <div className="hotkey flex w-full justify-between gap-x-12 items-center">
            <div className="flex flex-col gap-1">
              <h2 className="font-normal capitalize">{k.title}</h2>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <Field
              value={k.binding}
              label=""
              setValue={() => {}}
              arrow={true}
              onClick={() => setKeyToSet(k.name)}
            />
          </div>
        ))}
      </div>
      {keyToSet && (
        <Modal close={() => setKeyToSet(null)}>
          <AssignHotkey
            close={() => {
              setKeyToSet(null);
              getKeys();
            }}
            name={keyToSet}
          />
        </Modal>
      )}
    </div>
  );
};

export default Hotkeys;
