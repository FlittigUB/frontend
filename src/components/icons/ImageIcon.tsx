import Image from "next/image";
import { FC } from "react";

interface ImageIconProps {
  src: string;
  size?: number;
  alt?: string;
  className?: string;
}

const ImageIcon: FC<ImageIconProps> = ({ src, size = 24, alt = "icon", className = "w-4 h-4" }) => {
  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={alt}
      className={className}
      style={{ display: "block", verticalAlign: "middle"}}
    />
  );
};

export default ImageIcon;
