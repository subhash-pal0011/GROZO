"use client";

import GetSelfUser from "./app/customHooks/GetSelfUser";

const AppInit = ({ children }) => {
       return (
              <>
                     <GetSelfUser /> 
                     {children}
              </>
       );
};

export default AppInit;
