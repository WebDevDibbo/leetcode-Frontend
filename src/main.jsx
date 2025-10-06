import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import App from './App'
import { Provider}  from 'react-redux'
import {store} from './store/store'
import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer 
        
         toastStyle={{ backgroundColor: '#323232', color: 'white' }}
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          closeButton={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
