import React from "react";

const Achievements: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(/achievement-box.svg)`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "600px",
        height: "400px",
      }}
    >
      <h2 className="text-2xl font-bold text-center text-black mt-8">
        Achievements
      </h2>
      {/* Add your achievement content here */}
    </div>
  );
};

export default Achievements;
