
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface ModuleNavigationProps {
  currentIndex: number;
  totalNodes: number;
  onPrevious: () => void;
  onNext: () => void;
  isLastNode?: boolean;
  canProceed?: boolean;
}

export function ModuleNavigation({
  currentIndex,
  totalNodes,
  onPrevious,
  onNext,
  isLastNode,
  canProceed = true,
}: ModuleNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-gray-500">
          {currentIndex + 1} of {totalNodes}
        </div>

        <Button
          onClick={onNext}
          disabled={!canProceed || (!isLastNode && currentIndex === totalNodes - 1)}
          className={isLastNode ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {isLastNode ? (
            <>
              Finish
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
