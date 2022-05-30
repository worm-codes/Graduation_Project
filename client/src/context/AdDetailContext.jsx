import { createContext, useState } from "react";

export const AdDetailContext = createContext([]);

export const AdDetailProvider = ({ children }) => {

    const [advertisement, setAdvertisement] = useState([])
    const [adOwner, setAdOwner] = useState([])
    
    
    const values = { advertisement, setAdvertisement, adOwner, setAdOwner }
    return <AdDetailContext.Provider value={values}>{children}</AdDetailContext.Provider>
}

export default AdDetailContext;