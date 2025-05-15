

import { Suspense } from "react";
import Productpage from "./Productpage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'All Products - Unique Store bd',
  description: 'Unique Store bd - All Products,',
  keywords: 'Unique Store BD , Unique Store Bd all products ,uniquestorebd , unique store ,  unique product',
}
export default function AllProduct() {




  return (

    <Suspense fallback={<div>Loading...</div>}>
      <Productpage />
  </Suspense>
  
  );
}
