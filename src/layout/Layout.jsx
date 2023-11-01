/* eslint-disable react/prop-types */

import Footer from "../components/footer/footer"
import TopNavbar from "../components/navigation/TopNavbar"

const Layout = ({ children }) => {
    return (

        <>
            <TopNavbar />
            {children}
            <Footer />
        </>
    )
}

export default Layout