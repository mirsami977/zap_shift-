import { useEffect, useState } from "react";

import { api } from "../../../api/client";
import Banner from "../Banner/Banner";
import BAnner from "./BAnner";
import Hero from "./Hero";
import Brands from "./Brands";
import Reviews from "./revies/Reviews";
import Tpage from "./revies/Tpage";
import Last from "./revies/Last";
import CreaLa from "./revies/CreaLa";
const Home = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api
      .get("/reviews", { params: { limit: 12 } })
      .then(({ data }) => setReviews(data))
      .catch(() =>
        fetch("/reviews.json")
          .then((response) => response.json())
          .then(setReviews)
          .catch(() => setReviews([]))
      );
  }, []);

  return (
    <div>
      <Banner></Banner>
      <BAnner></BAnner>
      <Hero></Hero>
      <Brands></Brands>
      <Tpage></Tpage>
      <Reviews reviews={reviews}></Reviews>
      <Last></Last>
      <CreaLa></CreaLa>
    </div>
  );
};

export default Home;
