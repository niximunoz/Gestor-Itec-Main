import { createSlice } from '@reduxjs/toolkit';


export const appUserSlice = createSlice({
name: 'appUser',
initialState: {
   nombre: '',
   apellido: '',
   fullName : '',
   username: '',
   email: '',
   rol: ''
},
reducers: {
   login: (state, { payload } ) => {      
        state.fullName = payload.fullName
        state.username = payload.username
        state.email = payload.email
        state.rol = payload.token
   },
}
});

export default appUserSlice.reducer