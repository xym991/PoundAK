import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const infoSlice = createSlice({
  name: "gameInfo",
  initialState: {
   
  },
  reducers: {
    setInfoData:(state:any, action:{payload:any})=>{
state[Object.keys(action.payload)[0]]=Object.values(action.payload)[0] || state[Object.keys(action.payload)[0]]
 return state
    },
    clearInfoData:(state, action)=>{
      return {}
    }
 
   
  },
});

export const { setInfoData, clearInfoData} = infoSlice.actions;

export default infoSlice.reducer;
