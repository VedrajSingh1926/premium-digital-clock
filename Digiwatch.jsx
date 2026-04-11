import React, { useState } from "react";

const Digiwatch = () => {
    const Time = new Date().toLocaleTimeString();
    const [ctime, utime] = useState(Time);

    const fun = () => {
        const time = new Date().toLocaleTimeString();
        utime(time);
    };

    setInterval(fun, 1000);

    return (
        <>
            
            <div className="flex flex-col items-center justify-center h-screen bg-black font-mono">
                
               
                <p className="text-blue-400 text-sm  mb-4 animate-pulse">
                    DIGITAL WATCH
                </p>

              
                <h1 className="text-blue-500 text-7xl p-10 border-2 border-blue-500 shadow-[0_0_30px_#3b82f6] rounded-xl bg-gray-900 bg-opacity-30">
                    {ctime}
                </h1>

          
                <p className="mt-6 text-lg text-blue-300 ">
                   By: <span className="underline decoration-blue-800">VEDRAJ SINGH</span>
                </p>

            </div>
        </>
    );
};

export default Digiwatch;