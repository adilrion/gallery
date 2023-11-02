import { createContext, useContext } from "react";


const gContext = createContext();


// eslint-disable-next-line react/prop-types
export const GProvider = ({ children }) => {
    
    const data  = 'dd'
    return (
        <gContext.Provider value={{data}}>
            {children}
        </gContext.Provider>
    )
}



// eslint-disable-next-line react-refresh/only-export-components
export const useGallery = () =>{
return useContext(gContext)
}