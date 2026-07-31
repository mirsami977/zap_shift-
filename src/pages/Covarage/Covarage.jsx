import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { api } from "../../api/client";

// Leaflet এর CSS
import "leaflet/dist/leaflet.css";

// React Leaflet - এ ডিফল্ট Marker Icon গায়েব হওয়া সমস্যার সমাধান
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// বাংলাদেশের কেন্দ্রবিন্দুর অক্ষাংশ ও দ্রাঘিমাংশ
const position = [23.685, 90.3563];

const Coverage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    api
      .get("/warehouses")
      .then(({ data }) => setWarehouses(data))
      .catch(() =>
        fetch("/warehouses.json")
          .then((response) => response.json())
          .then(setWarehouses)
          .catch(() => setWarehouses([]))
      );
  }, []);

  // সার্চের মাধ্যমে জেলা বা কাভার্ড এরিয়া ফিল্টার করার লজিক
  const filteredWarehouses = warehouses?.filter((warehouse) => {
    if (!searchText) return true;
    const query = searchText.toLowerCase();
    return (
      warehouse.district?.toLowerCase().includes(query) ||
      warehouse.city?.toLowerCase().includes(query) ||
      warehouse.region?.toLowerCase().includes(query) ||
      warehouse.covered_area?.some((area) => area.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-6xl mx-auto my-10 p-8 sm:p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D3B36] mb-6">
        We are available in 64 districts
      </h1>

      {/* Search Bar Container */}
      <div className="flex items-center bg-[#F3F4F6] rounded-full p-1.5 max-w-md mb-10">
        <div className="pl-4 pr-2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search district or area..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm px-2"
        />
        <button className="bg-[#C1E840] hover:bg-[#b2d935] text-[#0D3B36] font-semibold px-6 py-2.5 rounded-full transition-all text-sm cursor-pointer">
          Search
        </button>
      </div>

      {/* Sub Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#0D3B36] mb-6">
        We deliver almost all over Bangladesh
      </h2>

      {/* Map Section */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-[450px] w-full z-0">
        <MapContainer
          center={position}
          zoom={7}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredWarehouses?.map((warehouse, index) => (
            <Marker
              key={warehouse.id || warehouse._id || index}
              position={[warehouse.latitude, warehouse.longitude]} // latitude & longitude পাস করা হয়েছে
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-[#0D3B36] text-base">
                    {warehouse.district} Warehouse
                  </h3>
                  <p className="text-xs text-gray-600">
                    <strong>Region:</strong> {warehouse.region}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Covered Areas:</strong>{" "}
                    {warehouse.covered_area?.join(", ")}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-semibold rounded-full capitalize">
                    {warehouse.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;