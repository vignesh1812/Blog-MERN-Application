import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="error-page">
      <div className="center">
        <Link className="px-6 py-4 rounded-md bg-primary text-white">Go Back Home</Link>
        <h2 className="mt-12">Page Not Found</h2>
      </div>
    </section>
  );
};

export default ErrorPage;
