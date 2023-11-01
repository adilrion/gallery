import { createBrowserRouter } from "react-router-dom";

import { Gallery } from "../pages/gallery/Gallery";
import { NotFoundPage } from "../pages/Error/NotFoundPage/NotFoundPage";
import { Home } from "../pages/home/Home"

const Router = createBrowserRouter([
    {
        path: "/",
element: <Home/>,
    },
    {
        path: "/home",
element: <Home />,
    },
    {
        path: "/gallery",
        element: <Gallery />,
    },
    {   
        path: "*",
        element: <NotFoundPage />,
    },  
]);

export default Router;
