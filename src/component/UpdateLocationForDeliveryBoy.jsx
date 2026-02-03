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
       className: "",            // 🧠 important (default CSS avoid)
       iconSize: [30, 30],
       iconAnchor: [15, 15],
});


const limeOptions = { color: "lime", weight: 2 };
const purpleOptions = { color: "purple", fillColor: "purple", fillOpacity: 0.2 };

const UpdateLocationForDeliveryBoy = ({ orderLocation, deliveryBoyLocation }) => {

       const polyline = deliveryBoyLocation ? [[orderLocation.latitude, orderLocation.longitude], [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]] : null;

       const polygon = [
              //  4 TRF 100M RHNA CHHIYE AREYA GIRA HUA
              [orderLocation.latitude + 0.001, orderLocation.longitude + 0.001],
              [orderLocation.latitude + 0.001, orderLocation.longitude - 0.001],
              [orderLocation.latitude - 0.001, orderLocation.longitude - 0.001],
              [orderLocation.latitude - 0.001, orderLocation.longitude + 0.001],
       ];

       if (!orderLocation) return null;

       const center = deliveryBoyLocation ? [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude] : [orderLocation.latitude, orderLocation.longitude];


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

                            <Marker position={[orderLocation.latitude, orderLocation.longitude]} icon={house}>
                                   <Popup>Order Location 📌</Popup>
                            </Marker>

                            {deliveryBoyLocation && <Marker position={[deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>
                                   <Popup>Your Location 📌</Popup>
                            </Marker>}

                            {/* POLYLINE DO CHIJO KE BICHH MEA LINE DIKHNI RHTI HII TO USE KRTE HII */}
                            <Polyline pathOptions={limeOptions} positions={polyline} />

                            {/* ISKA USE Polygon ka use hota hai jab tu map par kisi area / boundary / zone ko dikhana chahta hai */}
                            <Polygon pathOptions={purpleOptions} positions={polygon} />

                     </MapContainer>
              </div>
       );
};

export default UpdateLocationForDeliveryBoy;
