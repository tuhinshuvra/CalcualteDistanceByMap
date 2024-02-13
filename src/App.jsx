import { RouterProvider } from 'react-router-dom';
// import './App.css';
import { Toaster } from 'react-hot-toast';
import Router from './Routes/Router'

function App() {
  return (
    <div>
      <RouterProvider router={Router}></RouterProvider>
      <Toaster />
    </div>
  );
}

export default App;