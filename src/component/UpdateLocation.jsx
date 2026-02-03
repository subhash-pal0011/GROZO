
// YE IS LIYE KYUKI HUME USER KA REAL TIME LOCATION CHHAIYE REATIME LOCATION IS LIYE KYUKI NEAR MEA CHCK KRKE DELIVERY KE PASS NOTICICATION JEYEGA ORDER PUCCHANE KE LIYE.


"use client"
import { getSocket } from "@/lib/socket"
import { useEffect } from "react"

const UpdateLocation = ({ userId }) => {
       const socket = getSocket()

       useEffect(() => {

              if (!userId || !navigator.geolocation) return

              //📌 watchPosition iska use Jab user move karta rahe aur hume continuously live location chahiye ho. jese delivery boy etc.
              const watcher = navigator.geolocation.watchPosition(
                     (pos) => {
                            const latitude = pos.coords.latitude
                            const longitude = pos.coords.longitude

                            socket.emit("update-location", {
                                   userId,
                                   location: {
                                          type: "Point",
                                          coordinates: [longitude, latitude], // PAHLE longitude KYUKI JB STATUS CONFERM KROGE TO TUMHRE ORDER SE JITNE 10KM MEA DELIVERY BOY RHENGE UNKE PASS NOTIFICATION JYEGA ORDER PUCHANE KE LIYE 
                                   },
                            })
                     },
                     (error) => {
                            console.log("Location error:", error)
                     },
                     { enableHighAccuracy: true }
              )

              return () => navigator.geolocation.clearWatch(watcher)
       }, [userId])

       return null
}

export default UpdateLocation
