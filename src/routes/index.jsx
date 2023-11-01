import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/home";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    }
]);

export default Router;
