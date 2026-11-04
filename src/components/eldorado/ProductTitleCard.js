import { PRODUCT } from "./data/productData";

/* Product title card + screenshot strip.
   Desktop (capture): white rounded card — 24px title row with hairline
   border-b, then a horizontally scrollable strip of 255px rounded images
   (capture ships one image).
   Mobile (live @390): the image is full-bleed first, then the white section
   carries the 24px title; the offer chip / price / rows continue below via
   ProductOfferCard. */

export default function ProductTitleCard() {
  return (
    <>
      {/* mobile: inset image on white, then white title section (live @390) */}
      <div className="lg:hidden">
        <div className="flex justify-center bg-white p-[10px]">
          <img alt={PRODUCT.title} src={PRODUCT.image} className="block h-auto w-full max-w-[355px] rounded-lg object-cover align-middle" />
        </div>
        <div className="bg-white px-4 pb-4 pt-3">
          <h1 className="text-[24px] font-bold leading-[29px]">{PRODUCT.title}</h1>
        </div>
      </div>

      {/* desktop: white card — title row + 255px image strip (capture) */}
      <div className="hidden overflow-hidden rounded-lg bg-white shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,rgba(9,9,11,0.02)_0px_12px_8px_0px] lg:block">
        <div className="border-b-[0.8px] border-cardborder p-6">
          <h1 className="text-[24px] font-bold leading-[29px]">{PRODUCT.title}</h1>
        </div>
        <div className="p-[17px]">
          <div className="overflow-x-auto whitespace-nowrap">
            <img
              alt={PRODUCT.title}
              src={PRODUCT.image}
              className="mx-[24px] inline-block h-[255px] w-[255px] rounded-lg object-cover align-middle"
            />
          </div>
        </div>
      </div>
    </>
  );
}
