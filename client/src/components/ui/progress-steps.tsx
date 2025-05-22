import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <span 
            key={index} 
            className={cn(
              "important",
              index + 1 === currentStep ? "text-azure" : ""
            )}
          >
            {step}
          </span>
        ))}
      </div>
      <div className="flex">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "progress-step flex-1",
              index + 1 <= currentStep ? "active" : ""
            )}
          ></div>
        ))}
      </div>
    </div>
  );
}
