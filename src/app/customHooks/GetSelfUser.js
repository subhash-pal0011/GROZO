"use client";

import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const GetSelfUser = () => {
       const dispatch = useDispatch();

       useEffect(() => {
              const getSelfUser = async () => {
                     try {
                            const res = await axios.get("/api/selfUser");
                            if (res.data.success) {
                                   dispatch(setUserData(res.data.data));
                            }
                     } catch (error) {
                            console.log("get user error:", error);
                     }
              };

              getSelfUser();
       }, [dispatch]);

       return null;
};

export default GetSelfUser;

