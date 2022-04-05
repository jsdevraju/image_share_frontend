import React from "react";
import { Circles } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Circles
          width={50}
          height={50}
          color="#00BFFF"
          className="m-5"
          ariaLabel="loading-indicator"
        />
        <p className="text-lg text-center px-2">{message}</p>
      </div>
    </>
  );
};

export default Spinner;
