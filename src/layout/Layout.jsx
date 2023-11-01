/* eslint-disable react/prop-types */

import { Footer } from "../components/footer/footer"
import { TopNavbar } from "../components/navigation/TopNavbar"

const Layout = ({ children }) => {
    return (

        <>
            <TopNavbar />
            <div className="px-4 py-2 lg:px-8 lg:py-4 max-w-screen-2xl mx-auto min-h-screen">
            {children}

            </div>
            <Footer />
        </>
    )
}

export default Layout