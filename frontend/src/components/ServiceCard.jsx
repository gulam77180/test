export default function ServiceCard() {
  return (
    <div className="bg-white text-black rounded-xl p-6 shadow-md flex gap-6">

      {/* IMAGE */}
      <img
        src="https://img.freepik.com/free-photo/mechanic-repairing-car_23-2148973177.jpg"
        className="w-40 h-32 object-cover rounded"
        alt=""
      />

      {/* DETAILS */}
      <div className="flex-1">

        <h2 className="text-xl font-bold mb-2">Regular AC Service</h2>

        <p className="text-sm text-gray-600 mb-2">
          Takes 4 hours • Every 5000 Kms or 3 Months
        </p>

        <div className="grid grid-cols-2 text-sm text-gray-700">

          <p>✔ AC Vent Cleaning</p>
          <p>✔ AC Inspection</p>
          <p>✔ AC Gas</p>
          <p>✔ Condenser Cleaning</p>

        </div>

      </div>

      {/* BUTTON */}
      <div className="flex items-end">
        <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition">
          SELECT CAR
        </button>
      </div>

    </div>
  );
}