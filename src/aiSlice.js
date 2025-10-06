import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

export const discussAI = createAsyncThunk(
    'ai/chat',
    async (sendData, {rejectWithValue} ) => {
        try{
            const response = await axiosClient.post("/api/ai/chat", sendData);
            console.log('response',response);
            return {
                role : 'model',
                parts: [{text : response?.data?.message}]
            };
        }
        catch(error){
            console.log('error from ai',error);
            return rejectWithValue({message : error.message});
        }
    }
)

const initialState = {
    messages : [
        { role: 'model', parts:[{text: "Hi, I am here to help with your problem"}]},
        { role: 'user', parts:[{text: "I am Good"}]}
    ],
    loading : false,
    error : null
}

const chatSlice = createSlice({
    name : 'chat',
    initialState,
    reducers: {
        addMessage : (state,action) => {
            state.messages.push(action.payload);
        },
        clearMessage : (state) => {
            state.messages = [];
        }
    },
    extraReducers : (builder) => {
        builder
          // send message
          .addCase(discussAI.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(discussAI.fulfilled, (state, action) => {
            state.loading = false;
            state.messages.push(action.payload);
          })
          .addCase(discussAI.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Something went wrong";
          });
    }
}) 

export const {addMessage} = chatSlice.actions;
export default chatSlice.reducer;