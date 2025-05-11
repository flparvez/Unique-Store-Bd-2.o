"use client"

import { Suspense } from "react";
import Productpage from "./Productpage";

export default function AllProduct() {




  return (

    <Suspense fallback={<div>Loading...</div>}>
      <Productpage />
  </Suspense>
  
  );
}
