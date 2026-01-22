import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // NODEMODULE KE UNDER DEKHOGE TO MIL JYEGA.
import L from "leaflet";
import { useEffect } from "react";

// 🔴 Marker icon fix LOCATION PIN
delete L.Icon.Default.prototype._getIconUrl; // 👉iska use Leaflet default icon override karte time ye line add karni chahiye warna kabhi-kabhi build refresh pe icon load issue aa jata hai:
L.Icon.Default.mergeOptions({
       iconUrl: "/location-2.gif",
       iconRetinaUrl: "/location-2.gif",    // optional (same bhi chal jayega)
       iconSize: [50, 50],                  // width, height
       iconAnchor: [25, 50],                // bottom center of icon
       popupAnchor: [0, -50],               // popup position
       shadowUrl: null                      // YE TUHRE ICON KE SATH EK SHADOW DETA HII USE AVIDE KE LIYE
});
const RecenterMap = ({ position }) => {

       //📍PIN KO JIS TRF LE JAOGE MAP KA POSTION BHI SHI HOTA CHALA JYEGA
       const map = useMap();

       useEffect(() => {
              if (position) {

                     // map.setView(position); //📍map ko new position pe le jao ,[BITHOUT ANIMATE]

                     map.flyTo(position, map.getZoom(),{animate:true,duration: 0.9,});//[ANIMATED]
              }
       }, [position, map]);
       return null;
};

const MapComponent = ({ position, setPosition }) => {
       if (!position) {
              return (
                     <div className="h-75 flex items-center justify-center">
                            <span>📍 Getting your</span> <span><img src="/locationPin.gif" className="h-10" /></span>...
                     </div>
              );
       }

       return (
              <MapContainer
                     key={position.join(",")}   // 🔥 ye line error khatam karegi
                     center={position}
                     zoom={15}
                     scrollWheelZoom={false}
                     className="h-75 w-full rounded-md"
              >
                     <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     />

                     <RecenterMap position={position} />{/*POSTION MEA BHEJ DE RHE HII*/}

                     <Marker position={position}
                            draggable={true} // ISSE HUM ICON KISI LOCATION PE GHUMA SKTE HII.
                            eventHandlers={{
                                   dragend: (e) => {
                                          const marker = e.target;
                                          const { lat, lng } = marker.getLatLng();
                                          setPosition([lat, lng]); // ✅ correct
                                   },
                            }}
                     >
                            <Popup>Your current location 📌</Popup>
                     </Marker>
              </MapContainer>
       );
};
export default MapComponent;
