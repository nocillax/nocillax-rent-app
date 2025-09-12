export default function Page() {
  return (
    <div>
      <h1>Test Page</h1>
      <iframe
        src="/test"
        className="w-full h-[500px] border-2 border-gray-300 rounded"
      />
    </div>
  );
}
