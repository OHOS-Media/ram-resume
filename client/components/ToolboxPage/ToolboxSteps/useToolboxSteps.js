import { useCallback } from "react";
import ToolboxStep1 from "./ToolboxStep1";
import ToolboxStep2 from "./ToolboxStep2";
import ToolboxStep3 from "./ToolboxStep3";
import ToolboxStep4 from "./ToolboxStep4";
import ToolboxStep5 from "./ToolboxStep5";

export const useToolboxSteps = ({ state, updateState, navigateStep }) => {
  const renderStep = useCallback(() => {
    const steps = {
      1: (
        <ToolboxStep1
          jobDescription={state.jobDescription}
          setJobDescription={(value) => updateState({ jobDescription: value })}
          setKeywords={(keywords) => updateState({ keywords })}
          incrementStep={() => navigateStep("next")}
          company={state.company}
          setCompany={(value) => updateState({ company: value })}
          jobTitle={state.jobTitle}
          setJobTitle={(value) => updateState({ jobTitle: value })}
        />
      ),
      2: (
        <ToolboxStep2
          keywords={state.keywords}
          setConfirmationModalActive={(value) => updateState({ confirmationModalActive: value })}
          incrementStep={() => navigateStep("next")}
        />
      ),
      3: (
        <ToolboxStep3
          resume={state.resume}
          setResume={(value) => updateState({ resume: value })}
          jobDescription={state.jobDescription}
          incrementStep={() => navigateStep("next")}
          setBulletPoints={(points) => updateState({ bulletPoints: points })}
        />
      ),
      4: (
        <ToolboxStep4
          bulletPoints={state.bulletPoints}
          incrementStep={() => navigateStep("next")}
        />
      ),
      5: (
        <ToolboxStep5
          resume={state.resume}
          jobDescription={state.jobDescription}
          setCoverLetter={(value) => updateState({ coverLetter: value })}
          coverLetter={state.coverLetter}
          incrementStep={() => navigateStep("next")}
        />
      ),
    };

    return steps[state.activeStep] || null;
  }, [state, updateState, navigateStep]);

  return { renderStep };
};
