import { Badge } from "@/components/ui/badge";

interface TestStep {
  step: string;
  isSuccess: boolean;
  description: string;
  errorMessage?: string;
}

const getStatusColor = (isSuccess: boolean) => {
  return isSuccess ? "bg-green-500" : "bg-red-500";
};

const StepItem = ({ step, level = 0 }: { step: TestStep; index: number; level?: number }) => {
  const indentClass = level > 0 ? `ml-${level * 6}` : "";

  return (
    <div className={`space-y-2 ${indentClass}`}>
      <div className="flex items-start gap-2">
        <div className="min-w-[2rem] font-medium text-gray-500">{step.step}</div>
        <div className="flex-1 space-y-1">
          {step.description && (
            <div className="text-sm text-dark-500">{step.description}</div>
          )}
          {step.errorMessage && (
            <div className="text-sm text-red-500 whitespace-pre-line">{step.errorMessage}</div>
          )}
        </div>
        <Badge className={getStatusColor(step.isSuccess)}>
          {step.isSuccess ? "Passed" : "Failed"}
        </Badge>
      </div>
    </div>
  );
};

export const StepDetails = ({ steps }: { steps: TestStep[] }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <StepItem key={index} step={step} index={index} />
      ))}
    </div>
  );
}; 