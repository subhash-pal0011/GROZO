import React from "react";

const Nav = () => {
       return (
              <div className="w-full">
                     <div className="md:h-15 bg-gradient-to-r from-green-500 via-green-500 to-orange-500 flex  text-white font-semibold items-center flex-col md:flex-row">
                            <img src="/grozo.png" alt="logo" className="h-20 w-30 md:h-4" />
                            <form className="">
                                   <input type="text" placeholder="Search"
                                          className="p-2 border"
                                   />
                            </form>
                     </div>
              </div>
       );
};

export default Nav;

