import Image from "next/image";
import { FC } from "react";
import ImageIcon from "@/components/icons/ImageIcon";

interface ImageIconProps {
  size?: number;
  className?: string;
}

const BennyBever: FC<ImageIconProps> = ({ size = 24, className = "" }) => {
  return (
    <ImageIcon
      src={`${process.env.NEXT_PUBLIC_ASSETS_URL}722b612f-b083-4a34-bef7-4b884bbeb2dc.png`}
      alt={"Benny bever maskott"}
      className={"h-16 w-16"}
      size={size}
    />
  );
};

export default BennyBever;
