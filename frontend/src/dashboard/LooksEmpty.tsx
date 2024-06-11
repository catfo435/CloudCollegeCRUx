const LooksEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <svg
        className="w-24 h-24 mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h18v18H3V3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 7h18"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 3v18"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14 3v18"
        />
      </svg>
      <p className="text-gray-600">Looks empty here...</p>
    </div>
  );
};

export default LooksEmpty;
