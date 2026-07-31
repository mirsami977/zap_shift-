
import truck from "../../../assets/banner/bookingIcon.png";
const BAnner = () => {
  return (
      <div >
           <div className=" text-5xl font-bold ">
          
          <h1>How it Works</h1>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      <div>
       
        <section className=" bg-amber-50 w-75 m-3 p-4 rounded-3xl ">
          <div className="">
            <img src={truck} alt="" />
            <h3 className="font-extrabold font-black ">Booking Pick & Drop</h3>
            <p className=" text-[#606060]">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
        </section>
      </div>
      <div>
        <section className=" bg-amber-50 w-75 m-3 p-4 rounded-3xl ">
          <div className="">
            <img src={truck} alt="" />
            <h3 className="font-extrabold font-black ">Booking Pick & Drop</h3>
            <p className=" text-[#606060]">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
        </section>
      </div>
      <div>
        <section className=" bg-amber-50 w-75 m-3 p-4 rounded-3xl ">
          <div className="">
            <img src={truck} alt="" />
            <h3 className="font-extrabold font-black ">Booking Pick & Drop</h3>
            <p className=" text-[#606060]">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
        </section>
      </div>
      <div>
        <section className=" bg-amber-50 w-75 m-3 p-4 rounded-3xl ">
          <div className="">
            <img src={truck} alt="" />
            <h3 className="font-extrabold font-black ">Booking Pick & Drop</h3>
            <p className=" text-[#606060]">
              From personal packages to business shipments — we deliver on time,
              every time.
            </p>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
};

export default BAnner;
