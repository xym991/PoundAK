import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import XP from "../../../../assets/images/track/xp.svg";
import Lock from "../../../../assets/images/track/lock.svg";
import { performanceTrackTask } from "@/repositories/track.repository";
import { useDispatch, useSelector } from "react-redux";
import cn from "@/utils/classname";
import calculateTotal from "@/utils/calculateTrackTotal";
import { isTimePassed } from "@/utils/time";
import { useLocalStorage } from "react-use";

const Task = ({
  task,
  name,
  tasks,
  today,
}: {
  task: performanceTrackTask;
  name: string;
  tasks: performanceTrackTask[];
  today: string;
}) => {
  const dispatch = useDispatch();
  const rendered = tasks.filter((t: any) => t.rendered);

  const [updateTask, setUpdateTask] = useState<Function>(() => null);
  const [clearTask, setClearTask] = useState<Function>(() => null);
  const [setRendered, setSetRendered] = useState<Function>(() => null);
  useEffect(() => {
    import(`../../../../state/${name}Slice`).then((mod) => {
      setUpdateTask(
        () => (options: any) => dispatch(mod?.updateTasks(options))
      );
      setClearTask(() => (taskId: string) => dispatch(mod?.clearTask(taskId)));
      setSetRendered(
        () => (taskId: string) => dispatch(mod?.setRendered(taskId))
      );
    });
  }, [name]);

  const taskDependency = useMemo(() => {
    return task?.taskDependency?.split("~");
  }, [task]);

  const locked = useMemo(() => {
    let locked = false;
    if (taskDependency?.[0]) {
      const dependentTask = tasks.filter((t) => t.id == taskDependency[0])[0];
      if (dependentTask) {
        if (taskDependency[1]) {
          locked = !dependentTask.options
            .filter((o) => o.selected)
            .reduce(
              (acc, o: any) =>
                o.label.toLowerCase() == taskDependency[1]?.toLowerCase() ||
                acc,
              false
            );
        } else {
          locked = !dependentTask.options.filter((o) => o.selected).length;
        }

        if (locked)
          return (
            <div className="flex gap-1 w-full flex-col justify-center items-center flex-wrap">
              complete{" "}
              <div className="tag">
                <span>{dependentTask.id}</span>
              </div>
              to unlock.
            </div>
          );
      }
    }
    if (task.timeDependency) {
      if (!isTimePassed(task.timeDependency)) {
        return (
          <div className="flex gap-1 w-full flex-col justify-center items-center flex-wrap">
            Unlocks after {task.timeDependency.replace(":00", "")}
          </div>
        );
      }
    }
    return locked;
  }, [tasks, taskDependency, task]);

  useEffect(() => {
    if (!locked) {
      setRendered && setRendered({ taskId: task.id, value: true });
    } else {
      clearTask && clearTask(task.id);
      setRendered && setRendered({ taskId: task.id, value: false });
    }
  }, [locked]);
  useEffect(() => {
    return () => {
      setRendered && setRendered({ taskId: task.id, value: false });
    };
  }, []);

  return (
    <div className={cn("_task", locked ? "locked" : "")}>
      {Boolean(locked) && (
        <div className="overlay p-4 gap-1 min-h-fit">
          <Lock />
          {locked}
        </div>
      )}
      <div className="top">
        {Boolean(task.id) ? (
          <div className="tag">
            <span>{task.id}</span>
          </div>
        ) : (
          <p></p>
        )}
        <div className="xp">
          {Boolean(task.xp) && (
            <>
              +
              {name == "fitness"
                ? Math.floor((task.xp * 3) / rendered.length)
                : task.xp}
              <XP />
            </>
          )}
        </div>
      </div>
      <p title={task.tooltip}>{task.text}</p>
      <div className="options">
        {task.options.map((option, index) => {
          return (
            <div
              className={cn("option", option.selected ? " active" : "")}
              onClick={updateTask?.bind(null, {
                taskId: task.id,
                optionIndex: index,
              })}
              title={option.tooltip}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Card = ({ name, img }: { name: string; img: ReactElement }) => {
  const track = useSelector((state: any) => state[name]);
  const today = new Date().toLocaleDateString("en-US");
  const value = useMemo(
    () => calculateTotal(track?.data?.[today], true, name),
    [track?.data?.[today]?.tasks]
  );
  const ref = useRef<any>();
  if (value == 500) ref.current?.scrollTo({ left: 0, top: 0 });
  const [edit, setEdit] = useState(false);

  return (
    <div className="_card">
      <h2>
        <p> {track.name}</p>{" "}
        <span className="flex items-center xp">
          {value}/500 <XP />{" "}
        </span>{" "}
        <div
          className="slider"
          style={{ width: (value / 500) * 100 + "%" }}
        ></div>
      </h2>
      <div className="header">
        <div className="image">{img}</div> <p>{track.description}</p>
      </div>

      <main>
        <div
          className={cn(
            "tasks",
            value == 500 && !edit && !localStorage.getItem("preview")
              ? "completed"
              : ""
          )}
          ref={ref}
          onClick={() => setEdit(false)}
        >
          {value == 500 && !edit && !localStorage.getItem("preview") && (
            <a
              className="edit"
              onClick={(e) => {
                e.stopPropagation();
                setEdit(true);
              }}
            >
              Edit Tasks
            </a>
          )}
          {(
            track?.data?.[today]?.tasks?.filter(
              (t: any) =>
                t.rendered !== false || t.id?.toLowerCase() == "training type"
            ) || []
          )
            .concat(
              track?.data?.[today]?.tasks?.filter(
                (t: any) =>
                  t.rendered === false &&
                  t.id?.toLowerCase() !== "training type"
              ) || []
            )
            .map((task: any) => (
              <Task
                name={name}
                task={task}
                tasks={track?.data?.[today]?.tasks}
                today={today}
              />
            ))}
        </div>
      </main>
    </div>
  );
};

export default Card;
