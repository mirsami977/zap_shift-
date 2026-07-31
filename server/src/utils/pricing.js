const DOCUMENT_WITHIN_CITY = 60;
const DOCUMENT_OUTSIDE_CITY = 80;
const PARCEL_BASE_WITHIN_CITY = 110;
const PARCEL_BASE_OUTSIDE_CITY = 150;
const EXTRA_KG_RATE = 40;
const OUTSIDE_CITY_SURCHARGE = 40;
const FREE_WEIGHT_LIMIT = 3;

export const calculateCost = ({ type, weight = 0, senderDistrict, receiverDistrict }) => {
  const withinCity =
    String(senderDistrict || "").trim().toLowerCase() ===
    String(receiverDistrict || "").trim().toLowerCase();
  const breakdown = [];

  if (type === "document") {
    const cost = withinCity ? DOCUMENT_WITHIN_CITY : DOCUMENT_OUTSIDE_CITY;
    breakdown.push(`Document base rate (${withinCity ? "within city" : "outside city"}): ৳${cost}`);
    return { cost, breakdown, withinCity };
  }

  const base = withinCity ? PARCEL_BASE_WITHIN_CITY : PARCEL_BASE_OUTSIDE_CITY;
  breakdown.push(`Parcel base rate up to ${FREE_WEIGHT_LIMIT}kg (${withinCity ? "within city" : "outside city"}): ৳${base}`);
  let cost = base;

  const extraWeight = Math.max(0, Number(weight) - FREE_WEIGHT_LIMIT);
  if (extraWeight > 0) {
    const extraCost = extraWeight * EXTRA_KG_RATE;
    cost += extraCost;
    breakdown.push(`Extra weight ${extraWeight}kg x ৳${EXTRA_KG_RATE}: ৳${extraCost}`);
    if (!withinCity) {
      cost += OUTSIDE_CITY_SURCHARGE;
      breakdown.push(`Outside city heavy parcel surcharge: ৳${OUTSIDE_CITY_SURCHARGE}`);
    }
  }

  return { cost: Math.round(cost), breakdown, withinCity };
};
