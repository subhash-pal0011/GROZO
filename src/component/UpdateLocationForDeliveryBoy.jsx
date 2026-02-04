"use client";
import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from "react-leaflet";
import L from "leaflet";
import { MdDeliveryDining } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";


const house = new L.Icon({ // 🧠 JB DO ICON RKHNI HOTE HII TO VERIABEL BAN KE RKHNA PADTA HII 
       iconUrl: "/household.gif",
       iconRetinaUrl: "/household.gif",
       iconSize: [30, 30],
       iconAnchor: [15, 30],
       popupAnchor: [0, -30],
       shadowUrl: null,
});

const deliveryBoyIcon = L.divIcon({
       html: renderToStaticMarkup(
              <MdDeliveryDining size={30} color="red" />
       ),
       className: "",            // 🧠 important (default CSS avoid)  auto fill
       iconSize: [30, 30],
       iconAnchor: [15, 15],
});


const limeOptions = { color: "lime", weight: 2 };
const purpleOptions = { color: "purple", fillColor: "purple", fillOpacity: 0.2 };

const UpdateLocationForDeliveryBoy = ({ orderLocation, deliveryBoyLocation }) => {
       if (!orderLocation || !deliveryBoyIcon) return null;

       const orderLatLng = [orderLocation.latitude, orderLocation.longitude];

       // AGR                 deliveryBoyLocation &&(HII) TBHI AGE BADHO.
       const deliveryLatLng = deliveryBoyLocation && deliveryBoyLocation.latitude && deliveryBoyLocation.longitude ? [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude] : null;

       const center = deliveryLatLng || orderLatLng;


       const polylinePositions = deliveryLatLng ? [orderLatLng, deliveryLatLng] : null;
              
              

       const polygonPositions = [
              //  4 TRF 100M RHNA CHHIYE AREYA GIRA HUA
              [orderLocation.latitude + 0.001, orderLocation.longitude + 0.001],
              [orderLocation.latitude + 0.001, orderLocation.longitude - 0.001],
              [orderLocation.latitude - 0.001, orderLocation.longitude - 0.001],
              [orderLocation.latitude - 0.001, orderLocation.longitude + 0.001],
       ];


       return (
              <div className="p-2">
                     <MapContainer
                            key={center.join(",")}
                            center={center}
                            zoom={15}
                            scrollWheelZoom={false}
                            className="h-120 w-full rounded"
                     >
                            <TileLayer
                                   attribution="&copy; OpenStreetMap contributors"
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={orderLatLng} icon={house}>
                                   <Popup>Order Location 📌</Popup>
                            </Marker>

                            {deliveryLatLng && (
                                   <Marker position={deliveryLatLng} icon={deliveryBoyIcon}>
                                          <Popup>Delivery Boy 📍</Popup>
                                   </Marker>
                            )}


                            {/* POLYLINE DO CHIJO KE BICHH MEA LINE DIKHNI RHTI HII TO USE KRTE HII */}
                            {polylinePositions && (
                                   <Polyline
                                          pathOptions={limeOptions}
                                          positions={polylinePositions}
                                   />
                            )}

                            {/* ISKA USE Polygon ka use hota hai jab tu map par kisi area / boundary / zone ko dikhana chahta hai */}
                            <Polygon
                                   pathOptions={purpleOptions}
                                   positions={polygonPositions}
                            />
                     </MapContainer>
              </div>
       );
};

export default UpdateLocationForDeliveryBoy;