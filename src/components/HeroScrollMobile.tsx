"use client";
import React from "react";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollMobile() {
  return (
    <div className="flex flex-col overflow-hidden pb-[500px] pt-[1000px]">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Opplev Flittig <br />
              <span className="text-4xl md:text-7xl font-bold mt-1 leading-none">
                På farten
              </span>
            </h1>
          </>
        }
      >
        <Image
          src="https://panel.flittigub.no/assets/51461e4a-53bb-4aba-bc67-ee067ef7610e.png"
          alt="Mobil App"
          width={390}
          height={844}
          className="mx-auto rounded-2xl object-cover h-full object-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
