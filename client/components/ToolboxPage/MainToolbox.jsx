import React from "react";
import { IconPointFilled } from "@tabler/icons-react";
import Button from "../ui/Button";
import { useAuth } from "@/context/AuthContext";
import Notification from "../ui/Notification";

function MainToolbox({
  decrementStep,
  activeStep,
  renderStep,
  handleSubmit,
  handleFormReset,
  loading,
}) {
  const { usageError, checkUsage } = useAuth();

  const handleButtonClick = async (e) => {
    if (activeStep === 1 || activeStep === 3 || activeStep === 4) {
      const hasTokens = await checkUsage();
      if (!hasTokens) return;
    }
    handleSubmit(e);
  };

  const getButtonConfig = () => {
    const isDisabled = loading || !!usageError;

    switch (activeStep) {
      case 1:
        return [
          {
            text: loading ? "Processing..." : "Get keywords",
            onClick: handleButtonClick,
            disabled: isDisabled,
          },
        ];
      case 2:
        return [
          {
            text: "Enhance resume",
            onClick: handleButtonClick,
          },
        ];
      case 3:
        return {
          text: loading ? "Processing..." : "Submit resume",
          onClick: handleButtonClick,
          disabled: isDisabled,
        };
      case 4:
        return [
          {
            text: loading ? "Processing..." : "Get cover letter",
            onClick: handleButtonClick,
            disabled: isDisabled,
          },
        ];
      case 5:
        return [
          {
            text: "Start over",
            onClick: handleButtonClick,
          },
        ];
      default:
        return null;
    }
  };

  const getNotificationConfig = () => {
    if (loading) {
      return {
        type: "loading",
        title:
          activeStep === 1
            ? "Extracting keywords"
            : activeStep === 3
              ? "Extracting bullet points"
              : activeStep === 4
                ? "Generating cover letter"
                : "",
        message: `Hang tight! We are currently ${
          activeStep === 1
            ? "analyzing the keywords"
            : activeStep === 3
              ? "analyzing the bullet points"
              : activeStep === 4
                ? "generating your cover letter"
                : ""
        }.`,
      };
    }

    if (usageError) {
      return {
        type: "error",
        title: "Not enough tokens",
        message: usageError || "You do not have enough tokens. Please come back next week.",
      };
    }

    return null;
  };

  const buttonConfig = getButtonConfig();
  const notificationConfig = getNotificationConfig();

  return (
    <div className="bg-fordham-brown rounded-[16px] w-full max-h-full flex flex-col border-[1px] border-[#3B3533]">
      <div className="flex p-6 border-b-[1px] border-[#3B3533] gap-4">
        <h2 className="font-medium body-text-md text-fordham-white">TOOLBOX</h2>
        <IconPointFilled className="w-3 text-fordham-gray/60" />
        <p className="body-txt text-fordham-gray/60">
          Follow the steps to tailor your resume for the specific job application.
        </p>
      </div>

      <div className="h-full flex-1 relative flex flex-col max-h-full overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">{renderStep()}</div>

        {buttonConfig && (
          <div className="w-full border-t-[1px] border-[#3B3533]">
            <div className="w-full flex justify-end items-center p-6 gap-4">
              {activeStep > 1 && <Button variant="secondary" onClick={decrementStep} text="Back" />}

              {Array.isArray(buttonConfig) ? (
                buttonConfig.map((btn, index) => (
                  <Button
                    key={index}
                    text={btn.text}
                    onClick={btn.onClick}
                    variant={btn.variant}
                    disabled={btn.disabled}
                  />
                ))
              ) : (
                <Button
                  text={buttonConfig.text}
                  onClick={buttonConfig.onClick}
                  disabled={buttonConfig.disabled}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {notificationConfig && (activeStep === 1 || activeStep === 3 || activeStep == 4) && (
        <Notification
          type={notificationConfig.type}
          title={notificationConfig.title}
          message={notificationConfig.message}
          position="center"
        />
      )}
    </div>
  );
}

export default MainToolbox;
