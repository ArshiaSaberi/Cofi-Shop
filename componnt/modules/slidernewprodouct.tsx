import Image from "next/image";
import Button from "./button";
import Link from "next/link";

interface SliderProdouctProps {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  images: string;
  loading?: boolean;
  
}

export default function SliderNewProdouct(props: SliderProdouctProps) {
  if (props.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-2 sm:p-[15px] animate-pulse">
        <div className="relative w-full aspect-square bg-gray-100 rounded-md mb-3">
          <div className="absolute right-2 top-2 w-[40px] h-[40px] rounded-full bg-gray-200"></div>
        </div>
        <div className="h-5 sm:h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  // کارت واقعی با استایل اصلی خودت
  const productSlug = props.description.replace(/\s+/g, "-");
  console.log(props.images);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-[15px]">
      <Link
        className="relative w-full aspect-square"
        href={`/item/${productSlug}`}
      >
        <div className="relative w-full aspect-square">
          <Image
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            src={
              `/fill-font-img-svg-icon/images${props.images[0]}` ||
              "/fill-font-img-svg-icon/images/product11.jpg"
            }
            alt={`Product ${props.title}`}
            className="object-cover rounded-md"
          />
        </div>
        <p className="mt-3 mb-2 text-base sm:text-lg leading-snug font-bold text-charcoal text-center">
          {props.title}
        </p>
      </Link>
      <div className="flex items-center justify-center gap-[5px] whitespace-nowrap">
        <p className="text-lg sm:text-xl text-sand-beige leading-[40px] text-Yekan">
          {props.price} تومان
        </p>
      </div>
      <Button id={props._id} />
    </div>
  );
}
