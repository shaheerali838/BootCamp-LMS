import React from "react";
import { Outlet } from "react-router-dom";
import img from "../../public/imges/images-removebg-preview.png";

const AuthLayout = () => {
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex w-1/2 h-screen bg-white text-blue-900 px-10 py-6 flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-wide">SMIT</span>

            <span className="text-blue-700">|</span>

            <span className="text-blue-700 text-xl ">
              Saylani Mass IT Training
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 -mt-2.5">
          <img
            src={img}
            alt="SMIT Free IT Training"
            className="w-45  max-w-full h-auto object-contain"
          />
        </div>

        <div className="px-4">
          <p className="text-blue-700 text-md tracking-[3px] mb-2">
            SAYLANI WELFARE INTERNATIONAL TRUST
          </p>

          <h2 className="text-2xl font-bold leading-tight text-blue-900">
            SMIT Bootcamp for <span className="text-blue-900 ">Future</span> IT
            Professionals.
          </h2>

          <p className="text-blue-700 text-sm leading-6 py-3 max-w-xl">
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

          <div className="grid grid-cols-3 gap-4 mt-5 mb-5 pt-4 border-t border-blue-200">
            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900">400K+</h3>
              <p className="text-blue-600 text-xs">Students trained</p>
            </div>

            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900">50+</h3>
              <p className="text-blue-600 text-xs">Courses</p>
            </div>

            <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900">100+</h3>
              <p className="text-blue-600 text-xs">Instructors</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-screen flex items-center justify-center bg-blue-800/75 px-6 py-4 overflow-hidden">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
