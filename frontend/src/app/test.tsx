"use client";

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">Tailwind Test</h1>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-lg">Testing basic Tailwind classes</p>
      </div>
      <div className="mt-4">
        <p className="text-navy-600">This should be navy color</p>
        <p className="text-teal-600">This should be teal color</p>
        <p className="text-skyblue-600">This should be skyblue color</p>
        <p className="text-beige-600">This should be beige color</p>
      </div>
    </div>
  );
}
