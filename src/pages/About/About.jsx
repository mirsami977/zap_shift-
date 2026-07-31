const milestones = [
  { year: "2019", text: "zapShift started same-day delivery in Dhaka with 5 riders." },
  { year: "2021", text: "Expanded to 64 districts with regional warehouses and hubs." },
  { year: "2023", text: "Launched cash on delivery and merchant fulfillment services." },
  { year: "2025", text: "Delivering over 100,000 parcels a month nationwide." },
];

const About = () => (
  <div className="mx-auto my-10 max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
    <h1 className="text-3xl font-extrabold text-[#0D3B36]">About zapShift</h1>
    <p className="mt-3 text-sm leading-relaxed text-gray-600">
      zapShift is a logistics platform built for Bangladesh. We move documents and parcels between all 64
      districts with live tracking, 100% safe delivery and 24/7 support. Merchants get fulfillment,
      warehousing and cash on delivery, while customers get door to door pickup and drop.
    </p>

    <div className="mt-8 space-y-4">
      {milestones.map((milestone) => (
        <div key={milestone.year} className="flex gap-4 rounded-2xl bg-[#F2F5F6] p-5">
          <span className="text-xl font-extrabold text-[#024950]">{milestone.year}</span>
          <p className="text-sm text-gray-600">{milestone.text}</p>
        </div>
      ))}
    </div>
  </div>
);

export default About;
