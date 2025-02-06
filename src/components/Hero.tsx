import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative isolate">
      <div className="absolute inset-x-0 top-20 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-500 to-secondary-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-outfit text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent animate-fade-in">
            Learn Through Stories
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in">
            Create and experience interactive learning journeys. Build decision-based simulations that adapt to each learner's choices.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in">
            <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700">
              <Link to="/explore">Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/create">Create Module</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}