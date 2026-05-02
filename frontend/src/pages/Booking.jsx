import { useState } from "react";

export default function Booking() {

  const [data, setData] = useState({
    name: "",
    service: "",
    date: ""
  });

  const handleSubmit = async () => {

    if (!data.name || !data.service || !data.date) {
      alert("Please fill all fields");
      return;
    }
  
    try {
      
  
      const user = JSON.parse(sessionStorage.getItem("user"));
const user_id = user?.id;

console.log("USER:", user);
console.log("USER ID:", user_id);

if (!user_id) {
  alert("User not logged in ❌");
  return;
}
  
      const res = await fetch("http://localhost/vehicle-service/api/book.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data,
          user_id
        })
      });
      
  
      const result = await res.json();
      console.log("DATA:", data);
console.log("USER ID:", user_id);
  
      console.log("API RESPONSE:", result); // 🔥 DEBUG
  
      if (result.success) {
        alert("Booking Successful ✅");
  
        setData({
          name: "",
          service: "",
          date: ""
        });
  
      } else {
        alert(result.error || "Booking Failed ❌");
      }
  
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex justify-center items-center">

      <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-2xl w-[400px] shadow-2xl border border-gray-800">

        <h2 className="text-2xl mb-6 text-center font-bold text-red-500">
          Book Appointment
        </h2>

        <input
          value={data.name}
          placeholder="Full Name"
          className="w-full mb-3 p-3 bg-black border border-gray-700 rounded focus:border-red-500 outline-none"
          onChange={(e)=>setData({...data,name:e.target.value})}
        />

        <input
          value={data.service}
          placeholder="Service Type"
          className="w-full mb-3 p-3 bg-black border border-gray-700 rounded focus:border-red-500 outline-none"
          onChange={(e)=>setData({...data,service:e.target.value})}
        />

        <input
          type="date"
          value={data.date}
          className="w-full mb-4 p-3 bg-black border border-gray-700 rounded focus:border-red-500 outline-none"
          onChange={(e)=>setData({...data,date:e.target.value})}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-red-500 py-3 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg hover:shadow-red-500/40"
        >
          Book Now
        </button>

      </div>

    </div>
  );
}