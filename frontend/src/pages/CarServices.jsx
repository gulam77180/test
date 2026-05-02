export default function CarServices() {
    return (
      <div className="bg-black text-white min-h-screen p-10">
  
        <h1 className="text-3xl text-red-500 font-bold mb-8">
          Car Services
        </h1>
  
        <div className="grid md:grid-cols-3 gap-6">
  
          <div className="bg-gray-900 p-5 rounded-xl">
            <h3 className="font-bold">Oil Change</h3>
            <p className="text-sm text-gray-400">Engine oil replacement</p>
          </div>
  
          <div className="bg-gray-900 p-5 rounded-xl">
            <h3 className="font-bold">Full Service</h3>
            <p className="text-sm text-gray-400">Complete car servicing</p>
          </div>
  
        </div>
  
      </div>
    );
  }