import { createSlice } from "@reduxjs/toolkit";

const codeSlice = createSlice({
    name : 'code',
    initialState : {
        data : [
           {lang : 'cpp', code : ''},
           {lang : 'javascript', code : ''},
           {lang : 'java', code : ''},
        ]
    },
    reducers : {
        setLanguageCode: (state,action) => {
            const {lang,code} = action.payload;
            const selectLang = state.data.find(item => item.lang === lang);
            if(selectLang) selectLang.code = code;
        }
    }
})

export const {setLanguageCode} = codeSlice.actions;
export default codeSlice.reducer;

// action.payload.lang  ||  action.payload.code