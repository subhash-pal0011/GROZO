import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google"
import dbConnect from "./connectDb/dbConnect";
import User from "./models/user";


export const { handlers, signIn, signOut, auth } = NextAuth({
       session: {
              strategy: "jwt",
              maxAge: 10 * 24 * 60 * 60 * 1000
       },

       providers: [
              //🧠 YE CREDENTIALS LOGIN VALA HII NICHE GOOGLE KA RHEGA
              Credentials({
                     name: "Credentials",
                     credentials: {
                            //🧠 HUMKO KEVL LOGIN EMAIL AUR PASSWORD SE KRNA HII TO 2 HI LIKHE HII.
                            email: { label: "Email", type: "email" },
                            password: { label: "Password", type: "password" },
                     },

                     async authorize(credentials) {
                            await dbConnect();

                            const email = credentials?.email;
                            const password = credentials?.password;

                            // 🔴 Validation
                            if (!email || !password) {
                                   throw new Error("Email and password are required");
                            }

                            // 🔴 User check
                            const user = await User.findOne({ email });
                            if (!user) {
                                   throw new Error("User not found");
                            }

                            // 🔴 Password check
                            const isMatch = await bcrypt.compare(password, user.password);
                            if (!isMatch) {
                                   throw new Error("Invalid password");
                            }

                            if (!user.isVerify) {
                                   user.isVerify = true;
                                   await user.save();
                            }

                            // ✅ SUCCESS → return user object
                            return {
                                   id: user._id.toString(),
                                   name: user.name,
                                   email: user.email,
                                   role: user.role,
                            };
                     },
              }),

              Google({
                     clientId: process.env.GOOGLE_CLIENT_ID,
                     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              })
       ],

       callbacks: {
              async signIn({ user, profile, account }) {
                     // AGR ACCOUNYT PROVIDER KI VALUE GOOGLE HOGI TBHI SIGNIN GOOGLE SE KRYENGE.
                     if (account?.provider === "google") {
                            await dbConnect();

                            if (!profile?.email_verified) {
                                   return false;
                            }

                            let dbUser = await User.findOne({ email: profile.email });

                            if (!dbUser) {
                                   dbUser = await User.create({
                                          name: profile.name,
                                          email: profile.email,
                                          profilePic: profile.picture, //Google provider me picture hi hota hai.
                                          role: "user",
                                          isVerify: true,
                                          provider: "google",//ISKA NAME JIS BITTON MEA SIGNIN KRA RHE HOGE VHI LIKHA JAYEGA.
                                   });
                            }

                            // user ka role jb set krenge to db se a jyega.
                            user.role = dbUser.role;
                     }
                     return true; //“signIn callback me return true/false decide karta hai ki login allow hoga ya reject. Last me true lagana ek default behavior hai sab providers ke liye, jo explicitly reject nahi hue.”
              },

              // 👉 Token (JWT) backend side pe hota hai, secure aur signed hota hai. Isme user ki identity aur role jaise data store karte hain taaki har request pe DB call na karna pade.

              //👉 Login ke time token banta hai, aur session token se hi data leke banta hai. 👉 Isse performance better hoti hai aur authorization fast ho jata hai.


              //    token, user IN DONO KHI SE AYE NHI HII EK TRIKE SE PERAMITER SMJH LO.
              async jwt({ token, user }) {
                     await dbConnect();

                     // Login ke time user aata hai
                     if (user) {
                            // tum direct ese bhi kr skte ho >> user.name = user.name is trike se.
                            token.role = user.role; // Role token me isliye daalte hain taaki app har baar DB se na poochhe, seedha token dekh ke decision le le. admin hii ya user hii.

                            token.email = user.email;
                     }

                     // 🔥 HAR REQUEST pe DB check
                     const dbUser = await User.findOne({ email: token.email });

                     // ❌ USER DB ME NAHI HAI → TOKEN INVALID
                     if (!dbUser) {
                            return null;
                     }

                     token.role = dbUser.role;
                     token.id = dbUser._id.toString();

                     return token;
              },

              // 👉 Session frontend ke use ke liye hota hai. UI decide karti hai ki user logged in hai ya nahi, aur uska role kya hai.
              async session({ session, token }) {

                     if (!token) {
                            return null;
                     }

                     session.user.id = token.id;
                     // tum direct ese bhi kr skte ho >> session.user.name = token.name is trike se.
                     session.user.role = token.role; // humne ise direct role ke hisb se set kr diya.

                     return session;
              },
       },
       pages: {
              signIn: "/login",
       },
       secret: process.env.AUTH_SECRET,
});
