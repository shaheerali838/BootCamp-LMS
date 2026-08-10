import React from "react";

function BatchProgressCard({ data }) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {data.title}
          </h2>

          <p className="mt-2 text-xl text-blue-600">
            {data.batch}
          </p>
        </div>

        <span className="rounded-full border border-green-500 px-5 py-2 font-medium text-green-600">
          {data.status}
        </span>
      </div>

      {/* Information */}
      <div className="mt-5 flex flex-wrap gap-3">
        <span className="rounded-full border border-blue-200 bg-white px-4 py-2 text-gray-600">
          {data.schedule}
        </span>

        <span className="rounded-full border border-blue-200 bg-white px-4 py-2 text-gray-600">
          {data.timing}
        </span>

        <span className="rounded-full border border-blue-200 bg-white px-4 py-2 text-gray-600">
          {data.campus}
        </span>

        <span className="rounded-full border border-blue-200 bg-white px-4 py-2 text-gray-600">
          {data.technology}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-7">

        <div className="mb-2 flex justify-between">
          <span className="text-lg text-gray-600">
            Batch Progress
          </span>

          <span className="text-lg font-medium text-blue-600">
            {data.progress}%
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${data.progress}%` }}
          />
        </div>

      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

        {data.stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-2xl border border-blue-100 bg-white p-4 text-center"
          >
            <p className="text-2xl font-bold text-blue-600">
              {stat.value}
            </p>

            <p className="mt-1 text-gray-500">
              {stat.label}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default BatchProgressCard;