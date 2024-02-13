import { RouterProvider } from 'react-router-dom';
// import './App.css';
import ExistingConnectionStatus from './Components/ExistingConnectionStatus';
import { Toaster } from 'react-hot-toast';
import Router from './Routes/Router'

function App() {
  return (
    <div>
      <RouterProvider router={Router}></RouterProvider>
      <Toaster />
      {/* <ShadhinWifiPoints /> */}
    </div>
  );
}

export default App;