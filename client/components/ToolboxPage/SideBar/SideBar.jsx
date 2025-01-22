import Button from "../../ui/Button";
import { SideBarToolGroup } from "./SideBarToolGroup";

const toolGroupData = [
  {
    groupNumber: 1,
    groupTitle: "Keyword extractor",
    groupSteps: [
      { stepTitle: "Upload job description", stepNumber: 1 },
      { stepTitle: "Get keywords", stepNumber: 2 },
    ],
  },
  {
    groupNumber: 3,
    groupTitle: "Resume enhancer",
    groupSteps: [
      { stepTitle: "Upload resume", stepNumber: 3 },
      { stepTitle: "Get bullet points", stepNumber: 4 },
    ],
  },
  {
    groupNumber: 5,
    groupTitle: "Cover letter",
    groupSteps: [{ stepTitle: "Get cover letter", stepNumber: 5 }],
  },
];

export const Sidebar = ({
  activeStep,
  highestCompletedStep,
  updateState,
  handleReturnBtn,
}) => {
  const calculateActiveGroup = () => {
    if (activeStep >= 1 && activeStep < 3) {
      return 1;
    } else if (activeStep >= 3 && activeStep < 5) {
      return 3;
    } else if (activeStep >= 5 && activeStep < 6) {
      return 5;
    }
    return null;
  };
  const activeGroup = calculateActiveGroup();

  const toolGroupElements = toolGroupData.map((group, idx) => (
    <SideBarToolGroup
      key={idx}
      activeStep={activeStep}
      activeGroup={activeGroup}
      highestCompletedStep={highestCompletedStep}
      updateState={updateState}
      {...group}
    />
  ));

  return (
    <div className="w-[300px] flex flex-shrink-0 flex-col justify-between min-h-full bg-fordham-brown rounded-[16px] border-[1px] border-[#3B3533]">
      {/* Top Section */}
      <div>
        <h2 className="font-medium body-text-md text-fordham-white p-6 border-b-[1px] border-[#3B3533]">
          Progress
        </h2>

        <div className="p-6">
          {/* Tool Selection */}
          <div className="space-y-4">{toolGroupElements}</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col justify-center items-center w-full">
        {/* Progress Bar */}
        <div className="flex justify-stretch items-center space-y-2 w-full h p-6 gap-2">
          <div className="h-3 bg-fordham-dark-gray rounded-full w-full">
            <div
              className="h-full bg-gradient-to-r from-[#7E1515] via-[#BE2929] to-[#F34848] rounded-full transition-all duration-300"
              style={{ width: `${(highestCompletedStep / 5) * 100}%` }}
            />
          </div>
          <p className="body-txt-sm text-fordham-gray -translate-y-1">
            {Math.round((highestCompletedStep / 5) * 100)}%
          </p>
        </div>

        {/* Back to Dashboard */}
        <div className="w-full border-t-[1px] border-[#3B3533]">
          <div className="flex justify-center items-center p-6">
            <Button
              className="w-full"
              variant="secondary"
              text={"Back to dashboard"}
              onClick={handleReturnBtn}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};
