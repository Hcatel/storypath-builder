import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-inter">
      <div className="text-center">
        <h1 className="text-6xl font-bold font-outfit mb-4 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! This page seems to be lost in the story.</p>
        <Button asChild>
          <Link to="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;