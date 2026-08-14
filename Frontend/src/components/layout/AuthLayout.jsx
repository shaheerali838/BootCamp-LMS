import React from "react";
import { Outlet } from "react-router-dom";
import img from "../../../public/imges/images-removebg-preview.png";

const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen flex overflow-hidden bg-gray-50">
      {/* Left Pane: Information / Branding */}
      <div className="hidden lg:flex lg:w-1/2 h-screen bg-white text-blue-900 px-8 xl:px-10 py-6 flex-col justify-between overflow-hidden border-r border-gray-200">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-wide">SMIT</span>
            <span className="text-blue-700">|</span>
            <span className="text-blue-700 text-sm">
              Saylani Mass IT Training
            </span>
          </div>
        </div>

        {/* Center Image */}
        <div className="flex flex-1 items-center justify-center px-4">
          <img
            src={img}
            alt="SMIT Free IT Training"
            className="w-40 xl:w-48 max-w-full h-auto object-contain"
          />
        </div>

        {/* Content & Stats */}
        <div className="px-4">
          <p className="text-blue-700 text-sm tracking-[3px] mb-2">
            SAYLANI WELFARE INTERNATIONAL TRUST
          </p>

          <h2 className="text-2xl xl:text-3xl font-bold leading-tight text-blue-900">
            SMIT Bootcamp for{" "}
            <span className="text-amber-400 italic">Future</span> IT
            Professionals.
          </h2>

          <p className="text-blue-700 text-sm leading-6 py-3 max-w-2xl">
            SMIT is Pakistan's largest non-profit IT learning initiative — web
            development, AI, networking, and design, taught by industry experts,
            with no tuition fees, ever.
          </p>

          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-amber-400">•</span>
              <p className="text-blue-700 text-xs">
                Zero tuition fees, from enrollment to certificate
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-amber-400">•</span>
              <p className="text-blue-700 text-xs">
                50+ industry-aligned courses across IT and design
              </p>
            </div>

            <div className="flex gap-3">
              <span className="text-amber-400">•</span>
              <p className="text-blue-700 text-xs">
                Verified certification plus lifetime alumni support
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 xl:gap-4 mt-5 mb-5 pt-4 border-t border-blue-200">
            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-lg xl:text-xl font-bold text-blue-900">
                400K+
              </h3>
              <p className="text-blue-600 text-xs">Students trained</p>
            </div>

            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-lg xl:text-xl font-bold text-blue-900">
                50+
              </h3>
              <p className="text-blue-600 text-xs">Courses</p>
            </div>

            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-lg xl:text-xl font-bold text-blue-900">
                100+
              </h3>
              <p className="text-blue-600 text-xs">Instructors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Auth Forms (Outlet) */}
      <div className="w-full lg:w-1/2 h-screen flex items-center justify-center bg-blue-800/75 px-4 sm:px-6 lg:px-8 py-6 overflow-hidden auth-scrollbar-none">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
