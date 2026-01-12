"use client";
import React, { useState } from "react";
import MainPage from "@/component/MainPage";
import Register from "@/component/Register";
import VerifyUser from "@/component/VerifyUser";

const Page = () => {
  const [step, setStep] = useState(1); // 1=MainPage, 2=Register, 3=OTP
  const [userData, setUserData] = useState(null); // store registered user info

  return (
    <div>
      {step === 1 && <MainPage setStep={setStep} />}

      {step === 2 && (
        <Register
        // 🔍           (data) IS DATA ME USER KA EMAIL HII JO HUM REGISTER SE BHEJ RHE HII ISME .   
          onRegistered={(data) => {
            console.log("REGISTER DATA:", data); //  DEBUG
            setUserData(data);
            setStep(3);
          }}
        />
      )}


      {step === 3 && userData && (
        <VerifyUser
          email={userData.email}
          onVerified={() => { //  YE KOI FUNCTION HNI HII ISE VERIFY USER MEA CALL KRA RHE HII  ISME HUM STEP 1 BHEJ RHE HII CHHE HOME PAGE BHI BHEJ SKTE HII USER KO.
            setStep(1); // OTP verified → go to main/login
          }}
        />
      )}
    </div>
  );
};

export default Page;

