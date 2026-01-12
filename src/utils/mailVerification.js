import nodemailer from "nodemailer";

export async function mailVerification(email, otp) {
       try {
              const transporter = nodemailer.createTransport({
                     service: "gmail",
                     auth: {
                            user: process.env.EMAIL, 
                            pass: process.env.PASS,  
                     },
              });

              const mailOptions = {
                     from: `"Your App Name"<${process.env.EMAIL}>`,
                     to: email,
                     subject: "Your OTP for Registration GROZO",
                     html: `
                            <div style="font-family: sans-serif; text-align: center;">
                              <h2 style="color: #4caf50;">OTP Verification</h2>
                              <p>Your OTP is: <b style="font-size: 20px;">${otp}</b></p>
                              <p>This OTP will expire in 5 minutes.</p>
                            </div>
                     `,
              };

              const info = await transporter.sendMail(mailOptions);
              console.log("OTP email sent:", info.messageId);

              return true; 
       } 
       catch (error) {
              console.error("Error sending OTP:", error);
              throw new Error("Failed to send OTP email");
       }
}
