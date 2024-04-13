"use client"

import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { DynamicModalProvider } from "@/components/dynamic-modal";
import React from "react";
import PopIn from "@/components/framer/pop-in";

const Hero = () => {
    return (
        <PopIn duration={0.4}>
            <div className="flex h-screen justify-center items-center">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 items-center">
                        <div className="flex flex-col justify-center space-y-8 text-center gap-1">
                            <h1 className={`text-6xl`}>Hi, </h1>
                            <p className={`text-2xl`}>My name is RunTheBot</p>

                        </div>
                    </div>
                </div>
            </div>
        </PopIn>
    );

}

export default Hero;
