import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import PageContainer from "@/components/PageContainer";
import { Sidebar } from "@/components/ToolboxPage/SideBar/SideBar";
import MainToolbox from "@/components/ToolboxPage/MainToolbox";
import ToolboxEnd from "@/components/ToolboxPage/ToolboxSteps/ToolboxEnd";
import { useToolboxSteps } from "@/components/ToolboxPage/ToolboxSteps/useToolboxSteps";
import ConfirmationModal from "@/components/ToolboxPage/ConfirmationModal";
import GradientContainer from "@/components/ui/GradientContainer";
import ScanHistory from "@/components/Profile/ScanHistory";
import Head from "next/head";

import { mockKeywords, mockBulletPoints, mockCoverLetter } from "../../server/mockdata";

export default function Toolbox() {
  const { request, loading } = useApi();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isScanHistoryOpen, setIsScanHistoryOpen] = useState(false);
  const [state, setState] = useState({
    toolboxActive: true,
    activeStep: 1,
    highestCompletedStep: 1,
    confirmationModalActive: false,
    jobDescription: "",
    keywords: [],
    resume: "",
    company: "",
    jobTitle: "",
    coverLetter: "",
    scanId: "",
    bulletPoints: [],
    pendingNavigation: null,
    resetInitiated: false,
  });

  const {
    toolboxActive,
    activeStep,
    highestCompletedStep,
    confirmationModalActive,
    jobDescription,
    keywords,
    scanId,
    resume,
    bulletPoints,
    company,
    jobTitle,
    pendingNavigation,
    resetInitiated,
  } = state;

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (activeStep > 1) {
        // Store the navigation event
        updateState({
          confirmationModalActive: true,
          isLeavingPage: true,
          pendingNavigation: e,
        });

        // Cancel the event and show our custom modal
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeStep]);

  const handleReturnBtn = () => {
    if (activeStep > 1) {
      return updateState({ confirmationModalActive: true });
    } else {
      router.push("/");
    }
  };

  const handleCancel = () => {
    if (state.pendingNavigation) {
      // If there was a pending navigation, prevent it
      state.pendingNavigation.preventDefault();
    }

    updateState({
      confirmationModalActive: false,
      isLeavingPage: false,
      pendingNavigation: null,
    });
  };

  const handleDone = () => {
    // Use state.isLeavingPage and state.pendingNavigation directly
    if (state.isLeavingPage && state.pendingNavigation) {
      // If user was trying to leave/reload the page, allow it now
      window.onbeforeunload = null;
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  const navigateStep = (direction) => {
    if (direction === "next" && activeStep < 5) {
      // If the active step is greater than or equal to the highestCompletedStep,
      // update the highestCompleted step to be activeStep plus one
      if (activeStep >= highestCompletedStep) {
        updateState({ highestCompletedStep: activeStep + 1 });
      }
      updateState({ activeStep: activeStep + 1 });
    } else if (direction === "prev" && activeStep > 1) {
      updateState({ activeStep: activeStep - 1 });
    }
  };

  const sendRequest = async () => {
    try {
      if (activeStep === 1) {
        const data = await request("/api/extract-keywords", {
          method: "POST",
          body: JSON.stringify({ jobDescription, company, jobTitle }),
        });
        updateState({ keywords: data.keywords, scanId: data.scanId });

      } else if (activeStep === 3) {
        const data = await request("/api/resume", {
          method: "POST",
          body: JSON.stringify({ jobDescription, resume, scanId }),
        });
        updateState({ bulletPoints: data, scanId: data.scanId });

      } else if (activeStep === 4) {
        const data = await request("/api/cover-letter", {
          method: "POST",
          body: JSON.stringify({ jobDescription, resume, scanId }),
        });
        updateState({ coverLetter: data.coverLetter });

      }
    } catch (error) {
      console.error("Request failed:", error);
      if (error.message.includes("exceeds limit")) {
        toast.error(error.message);
      }
    }
  };

  // Handles form submission by checking if a confirmation modal is needed for specific steps,
  // updating state accordingly, and proceeding with the request and navigation if
  // no modal is required.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepsRequiringConfirmationModal = [1, 3, 4];

    if (
      (stepsRequiringConfirmationModal.includes(activeStep) && highestCompletedStep > activeStep) ||
      activeStep === 5
    ) {
      updateState({ resetInitiated: true, confirmationModalActive: true });
      return;
    }

    await sendRequest();
    navigateStep("next");
  };

  // Resets specific form data and state based on the current step, updates the highest
  // completed step if applicable, proceeds to the next step, and deactivates the
  // reset and confirmation modal states.
  const handleFormReset = async () => {
    updateState({ resetInitiated: false, confirmationModalActive: false });

    if (activeStep === 1) {
      updateState({
        highestCompletedStep: activeStep + 1,
        resume: "",
        bulletPoints: "",
        coverLetter: "",
      });
    }

    if (activeStep === 3) {
      updateState({
        highestCompletedStep: activeStep + 1,
        coverLetter: "",
      });
    }

    if (activeStep === 5) {
      updateState({
        toolboxActive: true,
        activeStep: 1,
        highestCompletedStep: 1,
        confirmationModalActive: false,
        jobDescription: "",
        keywords: [],
        resume: "",
        company: "",
        jobTitle: "",
        coverLetter: "",
        scanId: "",
        bulletPoints: [],
        pendingNavigation: null,
        resetInitiated: false,
      });
    }

    await sendRequest();
    navigateStep("next");
  };

  useEffect(() => {
    if (activeStep > 5) updateState({ toolboxActive: false });
  }, [activeStep]);

  const { renderStep } = useToolboxSteps({
    state,
    updateState,
    navigateStep,
  });

  // Add authentication check with a ref to track if we've shown the toast
  useEffect(() => {
    let redirecting = false;

    if (!authLoading && !user && !redirecting) {
      redirecting = true;
      toast.error("Please log in to use the toolbox", {
        id: "auth-error",
      });
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Add new state for mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Add useEffect for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard tablet/mobile breakpoint
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // If loading or not authenticated, don't render the page content
  if (authLoading || !user) {
    return null;
  }

  // Add mobile guard
  if (isMobile) {
    return (
      <>
        <GradientContainer />
        <PageContainer
          marginBottom={true}
          marginTop={true}
          limitedWidth={true}
          className="max-w-7xl flex flex-col items-center justify-center min-h-[50vh]"
        >
          <div className="text-center z-10">
            <h1 className="h2 text-fordham-white mb-4">Desktop Required</h1>
            <p className="body-txt-md text-fordham-light-gray/60">
              Please use a larger screen device to access the Toolbox. The toolbox is not optimized
              for small devices.
            </p>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Toolbox | RAMResume</title>
        <meta
          name="description"
          content="Follow the steps below to tailor your resume for the specific job application."
        />
        <meta property="og:title" content="Toolbox | RAMResume" />
        <meta
          property="og:description"
          content="Follow the steps below to tailor your resume for the specific job application."
        />
        <meta property="og:type" content="website" />
      </Head>
      <GradientContainer />
      <PageContainer
        marginBottom={true}
        marginTop={true}
        limitedWidth={true}
        className="max-w-7xl flex flex-col gap-20"
      >
        <div className="w-full flex flex-col items-center gap-2 z-10">
          <h1 className="h2 text-fordham-white">Toolbox</h1>
          <p className="body-txt-md text-center font-light text-fordham-light-gray/60 max-w-2xl">
            Follow the steps below to tailor your resume for the specific job application.
          </p>
        </div>

        {confirmationModalActive && (
          <ConfirmationModal
            setConfirmationModalActive={(value) => updateState({ confirmationModalActive: value })}
            handleDone={handleDone}
            handleCancel={handleCancel}
            handleFormReset={handleFormReset}
            resetInitiated={resetInitiated}
          />
        )}

        {toolboxActive ? (
          <div className="h-[700px] w-full flex flex-row gap-6 z-10">
            <Sidebar
              activeStep={activeStep}
              highestCompletedStep={highestCompletedStep}
              handleReturnBtn={handleReturnBtn}
              updateState={updateState}
              setConfirmationModalActive={(value) =>
                updateState({ confirmationModalActive: value })
              }
            />
            <MainToolbox
              activeStep={activeStep}
              decrementStep={() => navigateStep("prev")}
              incrementStep={() => navigateStep("next")}
              renderStep={renderStep}
              handleDone={handleDone}
              handleSubmit={handleSubmit}
              handleFormReset={handleFormReset}
              loading={loading}
            />
          </div>
        ) : (
          <ToolboxEnd />
        )}

        {/* Scan history */}
        <ScanHistory setOpen={setIsScanHistoryOpen} />
      </PageContainer>
    </>
  );
}
