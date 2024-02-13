import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import WrongRoute from "./WrongRoute";
import Home from "../Pages/Home/Home";
import NewConnectionEntry from "../Components/TransmissionModule/NewConnectionEntry";
import Signup from "../Pages/Signup/Signup";
import Login from "../Pages/Login/Login";
import ExistingConnectionStatus from "../Components/ExistingConnectionStatus";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/newConnection",
                element: <NewConnectionEntry></NewConnectionEntry>
            },
            {
                path: "/connectionList",
                element: <ExistingConnectionStatus></ExistingConnectionStatus>
            },
            {
                path: "/signup",
                element: <Signup></Signup>
            },
            {
                path: "/login",
                element: <Login></Login>
            },
        ]
    },
    {
        path: "*",
        element: <WrongRoute></WrongRoute>
    }
]);

export default Router;