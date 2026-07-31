const Loading = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20">
    <span className="loading loading-spinner loading-lg text-[#024950]" />
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default Loading;
