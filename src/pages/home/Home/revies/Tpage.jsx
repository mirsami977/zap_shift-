
import customer from "../../../../assets/brands/live-tracking.png";
import customerd from "../../../../assets/brands/safe-delivery.png";
import boi from "../../../../assets/brands/location-merchant.png";

const Tpage = () => {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Top Dashed Line */}
        <div className="border-b-2 border-dashed border-[#a1d6cb]/70 mb-8" />

        {/* Card 1: Live Parcel Tracking */}
        <div className="bg-[#F8F9FA] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-gray-100">
          <div className="w-full md:w-1/3 flex justify-center flex-shrink-0">
            <img
              src={customer}
              alt="Live Parcel Tracking"
              className="h-32 md:h-36 object-contain"
            />
          </div>

          {/* Vertical Dashed Line */}
          <div className="hidden md:block w-px h-28 border-r-2 border-dashed border-[#a1d6cb]/70" />

          <div className="w-full md:w-2/3 text-left">
            <h3 className="text-xl md:text-2xl font-bold text-[#024950] mb-3">
              Live Parcel Tracking
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Stay updated in real-time with our live parcel tracking feature.
              From pick-up to delivery, monitor your shipment's journey and get
              instant status updates for complete peace of mind.
            </p>
          </div>
        </div>

        {/* Card 2: 100% Safe Delivery */}
        <div className="bg-[#F8F9FA] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-gray-100">
          <div className="w-full md:w-1/3 flex justify-center flex-shrink-0">
            <img
              src={customerd}
              alt="100% Safe Delivery"
              className="h-32 md:h-36 object-contain"
            />
          </div>

          {/* Vertical Dashed Line */}
          <div className="hidden md:block w-px h-28 border-r-2 border-dashed border-[#a1d6cb]/70" />

          <div className="w-full md:w-2/3 text-left">
            <h3 className="text-xl md:text-2xl font-bold text-[#024950] mb-3">
              100% Safe Delivery
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We ensure your parcels are handled with the utmost care and
              delivered securely to their destination. Our reliable process
              guarantees safe and damage-free delivery every time.
            </p>
          </div>
        </div>

        {/* Card 3: 24/7 Call Center Support */}
        <div className="bg-[#F8F9FA] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-gray-100">
          <div className="w-full md:w-1/3 flex justify-center flex-shrink-0">
            <img
              src={customerd}
              alt="24/7 Call Center Support"
              className="h-32 md:h-36 object-contain"
            />
          </div>

          {/* Vertical Dashed Line */}
          <div className="hidden md:block w-px h-28 border-r-2 border-dashed border-[#a1d6cb]/70" />

          <div className="w-full md:w-2/3 text-left">
            <h3 className="text-xl md:text-2xl font-bold text-[#024950] mb-3">
              24/7 Call Center Support
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our dedicated support team is available around the clock to assist
              you with any questions, updates, or delivery concerns—anytime you
              need us.
            </p>
          </div>
        </div>

        {/* Bottom Dashed Line */}
        <div className="border-b-2 border-dashed border-[#a1d6cb]/70 mt-8" />
      </div>

      <div>
        <div className="relative bg-[#02383C] text-white rounded-[32px] p-8 md:p-12 overflow-hidden my-8 max-w-6xl mx-auto shadow-xl">
          {/* Top Background Glow Effect */}
          <div className="absolute top-0 left-1/3 w-96 h-32 bg-cyan-400/20 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-xl text-left space-y-5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white">
                Merchant and Customer Satisfaction is Our First Priority
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
                We offer the lowest delivery charge with the highest value along
                with 100% safety of your product. Pathao courier delivers your
                parcels in every corner of Bangladesh right on time.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button className="bg-[#D2F051] hover:bg-[#bce038] text-[#02383C] font-bold text-sm px-6 py-3 rounded-full transition-all duration-200 cursor-pointer">
                  Become a Merchant
                </button>
                <button className="bg-transparent border border-[#D2F051] text-[#D2F051] hover:bg-[#D2F051]/10 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 cursor-pointer">
                  Earn with ZapShift Courier
                </button>
              </div>
            </div>

            {/* Right Illustration Image */}
            <div className="w-full md:w-auto flex justify-center flex-shrink-0">
              <img
                src={boi}
                alt="Customer Satisfaction Illustration"
                className="w-64 sm:w-72 md:w-80 h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tpage;
