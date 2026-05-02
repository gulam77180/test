import { useState } from "react";

export default function Booking() {
  const [data, setData] = useState({
    name: "",
    service: "",
    date: ""
  });

  return (
    <div className="bg-black text-white min-h-screen flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl mb-6">Book Appointment</h2>

        <input
          placeholder="Name"
          className="w-full mb-3 p-2 bg-black border border-gray-700"
          onChange={(e)=>setData({...data,name:e.target.value})}
        />

        <input
          placeholder="Service"
          className="w-full mb-3 p-2 bg-black border border-gray-700"
          onChange={(e)=>setData({...data,service:e.target.value})}
        />

        <input
          type="date"
          className="w-full mb-4 p-2 bg-black border border-gray-700"
          onChange={(e)=>setData({...data,date:e.target.value})}
        />

        <button className="w-full bg-red-500 py-2 rounded hover:scale-105 transition">
          Book Now
        </button>
      </div>
    </div>
  );
}