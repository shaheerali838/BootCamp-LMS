import React from "react";
import { Outlet } from "react-router-dom";
import img from '../../public/imges/laptop-illustration-blue2.png'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-[#1071b3] text-white px-10 py-8 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#111528]"></span>
            </span>
            <span className="text-ms font-bold tracking-wide">
              SMIT
            </span>
            <span className="text-white">|</span>
            <span className="text-white text-ms">
              Saylani Mass IT Training
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center px-4">
          <img
            src={img} alt="SMIT Free IT Training" className="w-[500px] max-w-full h-auto object-contain" />
        </div>
        <div className="px-4">
          <p className="text-white text-md tracking-[3px]  mt-3">
            SAYLANI WELFARE INTERNATIONAL TRUST
          </p>
          <h2 className="text-4xl font-bold leading-tight">
            SMIT
            <br />
            Bootcamp for{" "}
            <span className="text-amber-400 italic">
              Future
            </span>{" "}
            IT Professionals.
          </h2>
          <p className="text-blue-100 text-sm leading-6 py-4 max-w-xl">
            SMIT is Pakistan's largest non-profit IT learning initiative —
            web development, AI, networking, and design, taught by industry
            experts, with no tuition fees, ever.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-amber-400">•</span>
              <p className="text-blue-200 text-xs">
                Zero tuition fees, from enrollment to certificate
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-amber-400">•</span>
              <p className="text-blue-200 text-xs">
                50+ industry-aligned courses across IT and design
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-amber-400">•</span>
              <p className="text-blue-200 text-xs">
                Verified certification plus lifetime alumni support
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-7 pt-5 border-t border-gray-700">
            <div className="p-3 rounded-xl border border-blue-500/40 bg-[#8bc440] ">
              <h3 className="text-2xl font-bold">
                400K+
              </h3>
              <p className="text-blue-200 text-xs">
                Students trained
              </p>
            </div>
            <div className="p-3 rounded-xl border border-blue-500/40 bg-[#8bc440]  ">
              <h3 className="text-2xl font-bold">
                50+
              </h3>
              <p className="text-blue-200 text-xs">
                Courses
              </p>
            </div>

            <div className="p-3 rounded-xl border border-blue-500/40 bg-[#8bc440] ">
              <h3 className="text-2xl font-bold">
                100+
              </h3>

              <p className="text-blue-200 text-xs ">
                Instructors
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;