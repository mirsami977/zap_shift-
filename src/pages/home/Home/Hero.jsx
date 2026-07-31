

const OurServices = () => {
  const services = [
    {
      id: 1,
      title: "Express & Standard Delivery",
      description: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    },
    {
      id: 2,
      title: "Nationwide Delivery",
      description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    },
    {
      id: 3,
      title: "Fulfillment Solution",
      description: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    },
    {
      id: 4,
      title: "Cash on Home Delivery",
      description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    },
    {
      id: 5,
      title: "Corporate Service / Contract In Logistics",
      description: "Customized corporate services which includes warehouse and inventory management support.",
    },
    {
      id: 6,
      title: "Parcel Return",
      description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    },
  ];

  return (
    <section className="bg-[#012E2E] py-16 px-6 md:px-12 lg:px-20 rounded-[2.5rem] max-w-7xl mx-auto my-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
          Our Services
        </h2>
        <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed px-4">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. 
          From personal packages to business shipments — we deliver on time, every time.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group bg-white text-[#012E2E] hover:bg-[#CBE966] rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 shadow-sm cursor-pointer"
          >
            {/* Icon Wrapper */}
            <div className="w-16 h-16 rounded-full bg-[#F3F4FD] flex items-center justify-center mb-6 relative overflow-hidden shadow-inner group-hover:bg-white/50 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/40 via-blue-200/30 to-transparent rounded-full" />
              
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-7 h-7 relative z-10 opacity-80"
                style={{ color: '#FF7A7A' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                />
              </svg>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-4 tracking-tight min-h-[56px] flex items-center justify-center">
              {service.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 group-hover:text-[#012E2E]/90 transition-colors duration-300">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;