import arrowDown from "@/assets/images/settings/arrow-down";
import { useNotification } from "@/services/NotificationService";
import { setUser } from "@/state/userSlice";
import cn from "@/utils/classname";
import paths from "@/utils/routes";
import axios from "axios";
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import "./settings.css";
import Button from "@/components/Button";
import { setPortal } from "@/state/routerSlice";
import person from "@/assets/images/person.png";
import Img from "next/image";
import { IconButton } from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForeverSharp";
import AddPhotoAlternateSharpIcon from "@mui/icons-material/AddPhotoAlternateSharp";

const isAlpha = (str: string) => /^[A-Za-z]+$/.test(str);
const isAlphanumeric = (str: string) =>
  str.length ? /^[A-Za-z0-9]+$/.test(str) : true;
const isValidDateUS = (str: string) => str.length == 10;

export const Field = forwardRef(
  (
    {
      value,
      setValue,
      label = "",
      type,
      options,
      placeholder,
      children,
      icon,
      arrow,
      onClick,
      endIcon,
      tooltip,
      multiple,
      onKeyDown,
    }: {
      value: any;
      setValue: (value: any) => void;
      type?: string;
      options?: any[];
      placeholder?: string;
      children?: React.ReactNode;
      icon?: React.ReactNode;
      onClick?: () => void;
      arrow?: boolean;
      tooltip?: string;
      endIcon?: React.ReactNode;
      multiple?: boolean;
      label?: string;
      onKeyDown?: any;
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    const handleSelection = (option: string) => {
      if (multiple) {
        const current = value ? value.split(",") : [];
        const updated = current.includes(option)
          ? current.filter((v: any) => v !== option)
          : [...current, option];
        setValue(updated.join(","));
      } else {
        setValue(option);
      }
    };

    return (
      <div className="_field" onClick={onClick}>
        <h3 className="label">
          {icon}
          {label}
        </h3>

        {(!type || type === "password") && (
          <input
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            type={type || "text"}
            title={tooltip}
            onKeyDown={onKeyDown}
          />
        )}

        {arrow && arrow}

        {type === "select" && (
          <div className="selections">
            {options?.map((op) => (
              <div
                key={op}
                onClick={() => handleSelection(op)}
                className={value?.split(",").includes(op) ? "active" : ""}
              >
                <span>{op}</span>
              </div>
            ))}
          </div>
        )}

        {type === "dropdown" && (
          <div
            className="dropdown"
            onClick={() =>
              document
                .querySelector(".options." + label)
                ?.classList.toggle("active")
            }
          >
            <div className="selected">
              {value || placeholder} {arrow}
            </div>
            <div className={cn("options", label)}>
              {options?.map((op) => (
                <div
                  key={op}
                  className="option"
                  onClick={() => handleSelection(op)}
                >
                  {op}
                </div>
              ))}
            </div>
          </div>
        )}

        {children}
        {endIcon && endIcon}
      </div>
    );
  }
);

const Profile = ({ onSave, onBoarding }: any) => {
  const [profile, setProfile] = useState<any>({
    firstName: "",
    lastName: "",
    playerTag: null,
    birthday: "",
    gender: "",
    country: "",
    image: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const info = useSelector((state: any) => state.user?.info);
  console.log(info);
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { notify } = useNotification();

  useEffect(() => {
    info && setProfile(info);

    window?.overwolf?.profile?.getCurrentUser?.((res) => {
      if (res?.success) {
        setImage(res?.avatar || null);
      }
    });
  }, [info]);
  console.log("Profile info:", info);

  const validate = () => {
    let isValid = true;

    if (!isAlpha(profile.firstName)) {
      notify("Please enter a valid first name.", "error");
      return false;
    }
    if (!isAlpha(profile.lastName)) {
      notify("Please enter a valid last name.", "error");
      return false;
    }
    if (!isAlphanumeric(profile.playerTag) || profile.playerTag.length > 15) {
      notify("Player tag must be 5–15 alphanumeric characters.", "error");
      return false;
    }
    if (!isValidDateUS(profile.birthday)) {
      notify("Date must be in mm/dd/yyyy format.", "error");
      return false;
    }
    if (!profile.country) {
      notify("Please select a country.", "error");
      return false;
    }
    if (!profile.gender) {
      notify("Please select a gender.", "error");
      return false;
    }

    return isValid;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await axios.put(paths.info, {
        ...profile,
        playerTag: profile.playerTag || null,
        image: profile.image || image,
      });
      notify("Profile updated successfully", "info");
      dispatch(setUser(res.data));
      onSave && onSave();
    } catch (err: any) {
      console.error(err);
      notify(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const cleanAlpha = (v: string) => v.replace(/[^A-Za-z]/g, "");
  const cleanAlphanumeric = (v: string) => v.replace(/[^A-Za-z0-9]/g, "");
  const cleanBirthday = (v: string) => {
    const digits = v.replace(/[^0-9]/g, "").slice(0, 8);

    let month = digits.slice(0, 2);
    let day = digits.slice(2, 4);
    let year = digits.slice(4, 8);

    if (month.length === 2) {
      let m = parseInt(month);
      if (m < 1) m = 1;
      if (m > 12) m = 12;
      month = m.toString().padStart(2, "0");
    }

    if (day.length === 2) {
      let d = parseInt(day);
      if (d < 1) d = 1;
      if (d > 31) d = 31;
      day = d.toString().padStart(2, "0");
    }

    if (year.length === 4) {
      let y = parseInt(year);
      if (y < 1900) y = 1900;
      if (y > 2024) y = 2024;
      year = y.toString();
    }

    let result = "";
    if (month) result += month;
    if (day) result += "/" + day;
    if (year) result += "/" + year;

    return result;
  };

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64 = e.target?.result as string;

      const img = new window.Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 256;

        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height *= maxSize / width;
            width = maxSize;
          } else {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.7);
          setProfile({ ...profile, image: compressed });
        }
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="_settings-page">
      <h2>Profile</h2>
      {!onBoarding && (
        <div className="page-buttons">
          <button>Cancel</button>
          <button onClick={onSubmit}>Save</button>
        </div>
      )}

      <div className="flex justify-between gap-4 profile-img-container">
        <div
          className="min-w-[33%] flex justify-center items-center relative"
          onClick={() => inputRef.current?.click()}
        >
          <Img
            src={profile.image || image || person}
            alt="Profile Preview"
            className="h-[125px] w-[125px] profile-img object-cover"
            height={125}
            width={125}
          />
          {/* Delete Button */}
          {profile.image && (
            <div
              className="absolute  flex justify-center items-center  opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-full h-[130px] w-[130px]"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                onClick={() => setProfile({ ...profile, image: "" })}
                style={{
                  backgroundColor: "rgba(17, 26, 34, 0.7)",
                  color: "white",
                  transition: "background-color 0.3s ease",
                  height: "100%",
                  width: "100%",
                }}
                className="transition-opacity duration-300 hover:bg-opacity-90"
              >
                <DeleteForever />
              </IconButton>
            </div>
          )}
          {!profile.image && (
            <div
              className="absolute flex justify-center items-center opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-full h-[130px] w-[130px]"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                onClick={() => inputRef.current?.click()}
                style={{
                  backgroundColor: "rgba(17, 26, 34, 0.7)",
                  color: "white",
                  transition: "background-color 0.3s ease",
                  height: "100%",
                  width: "100%",
                }}
                className="transition-opacity duration-300 hover:bg-opacity-90"
              >
                <AddPhotoAlternateSharpIcon />
              </IconButton>
            </div>
          )}
        </div>
        <div className="flex flex-col w-[66%] gap-4">
          <Field
            value={profile.firstName}
            setValue={(v) =>
              setProfile({ ...profile, firstName: cleanAlpha(v) })
            }
            label="First Name"
            placeholder="John"
          />
          <Field
            value={profile.lastName}
            setValue={(v) =>
              setProfile({ ...profile, lastName: cleanAlpha(v) })
            }
            label="Last Name"
            placeholder="Doe"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={(e) =>
            e.target.files?.[0] && handleImageUpload(e.target.files[0])
          }
        />
      </div>

      {/* <div className="section"></div> */}

      <div className="section">
        <Field
          value={profile.playerTag}
          setValue={(v) =>
            setProfile({ ...profile, playerTag: cleanAlphanumeric(v) })
          }
          label="Player Tag"
          placeholder="5–15 alphanumeric characters"
        />
      </div>

      <div className="section">
        <Field
          value={profile.birthday}
          setValue={(v) =>
            setProfile({ ...profile, birthday: cleanBirthday(v) })
          }
          label="Birthday"
          placeholder="mm/dd/yyyy"
        />
      </div>

      <div className="section">
        <Field
          value={profile.country}
          setValue={(v) => setProfile({ ...profile, country: v })}
          label="Country"
          type="dropdown"
          placeholder="Select country"
          options={[
            "United States of America",
            "Canada",
            "United Kingdom",
            "Japan",
            "South Korea",
          ]}
        />
      </div>

      <div className="section">
        <Field
          value={profile.gender}
          setValue={(v) => setProfile({ ...profile, gender: v })}
          label="Gender"
          type="select"
          options={["male", "non-binary", "female"]}
        />
      </div>

      {onBoarding && (
        <div className="onboarding_buttons flex gap-4 py-4 justify-end ">
          <Button onClick={() => dispatch(setPortal("preferences"))}>
            Back
          </Button>
          <Button onClick={onSubmit}>Next</Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
