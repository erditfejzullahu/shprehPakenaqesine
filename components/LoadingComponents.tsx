import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
};

// For smaller spinner
export const LoadingSpinnerSmall = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-white">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
};

// For page loading with text
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-indigo-600 font-medium">Ju lutem prisni...</p>
    </div>
  );
};