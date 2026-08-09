import React from "react";
import { Outlet } from "react-router-dom";
import img from '../../public/imges/images.jpg'

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-blue-700/90 text-white px-10 py-8 flex-col justify-between">
        <div className="flex items-center justify-start px-4 pt-4">
            <img src={img} alt="smit logo" className="h-32 w-auto rounded-2xl border shadow-lg"/>
        </div>
        <div className="mb-10 px-4">
          <h2 className="text-3xl font-bold  leading-tight">
            Learn today.
            <br />
            Lead tomorrow.
          </h2>
          <p className="text-blue-100 text-lg leading-tight  py-4">
            Learn new skills, access quality courses,
            track your progress, and achieve your goals.
          </p>
          <div className="space-y-5">
            <div className="flex gap-4">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="font-semibold">
                  Quality Courses
                </h3>
                <p className="text-blue-200 text-sm">
                  Learn from structured and professional courses.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">🎓</span>
              <div>
                <h3 className="font-semibold">
                  Expert Instructors
                </h3>
                <p className="text-blue-200 text-sm">
                  Learn from experienced instructors.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-semibold">
                  Track Progress
                </h3>
                <p className="text-blue-200 text-sm">
                  Monitor your learning progress and achievements.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 ">
          <div className="w-40 p-2 rounded-2xl border border-blue-500 bg-black/30 flex flex-col items-center">
            <h3 className="text-2xl font-bold">10K+</h3>
            <p className="text-blue-200 text-lg">Students</p>
          </div>
          <div className="w-40 p-2 rounded-2xl border border-blue-500 bg-black/30 flex flex-col items-center">
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-blue-200 text-lg">Courses</p>
          </div>
          <div className="w-40 p-2 rounded-2xl border border-blue-500 bg-black/30 flex flex-col items-center">
            <h3 className="text-2xl font-bold">100+</h3>
            <p className="text-blue-200 text-lg">Instructors</p>
          </div>
        </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">

        <Outlet />

      </div>

    </div>
  );
};

export default AuthLayout;