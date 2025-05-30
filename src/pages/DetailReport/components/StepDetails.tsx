import { Badge } from "@/components/ui/badge";

interface TestStep {
  step: string;
  status: "passed" | "failed" | "skipped";
  message?: string;
  sub_steps?: TestStep[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "passed":
      return "bg-green-500";
    case "failed":
      return "bg-red-500";
    case "skipped":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export const StepDetails = ({ steps }: { steps: TestStep[] }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-start gap-2">
            <Badge className={getStatusColor(step.status)}>
              {step.status}
            </Badge>
            <div>
              <div className="font-medium">{step.step}</div>
              {step.message && (
                <div className="text-sm text-red-500">{step.message}</div>
              )}
            </div>
          </div>
          {step.sub_steps && step.sub_steps.length > 0 && (
            <div className="ml-6 border-l-2 border-gray-200 pl-4 space-y-2">
              {step.sub_steps.map((subStep, subIndex) => (
                <div key={subIndex} className="flex items-start gap-2">
                  <Badge className={getStatusColor(subStep.status)}>
                    {subStep.status}
                  </Badge>
                  <div>
                    <div className="font-medium">{subStep.step}</div>
                    {subStep.message && (
                      <div className="text-sm text-red-500">{subStep.message}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 