import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { IconLoader2 } from "@tabler/icons-react";
import PageContainer from "@/components/PageContainer";
import GradientContainer from "@/components/ui/GradientContainer";
import toast from "react-hot-toast";

export default function Terms() {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user, loading, acceptTerms, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if:
    // 1. Not currently in the process of accepting terms
    // 2. Not loading
    // 3. Either no user or user has previously accepted terms (not just now)
    if (!isRedirecting && !loading && (!user || (user.hasAcceptedTerms && !isSubmitting))) {
      router.replace("/");
    }
  }, [user, loading, router, isRedirecting, isSubmitting]);

  const handleAccept = async () => {
    if (!accepted || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setIsRedirecting(true); // Prevent the useEffect from redirecting
      await acceptTerms();
      router.push("/onboarding");
    } catch (error) {
      setIsRedirecting(false);
      setIsSubmitting(false);
      toast.error("Failed to accept terms. Please try again.");
    }
  };

  const handleDecline = async () => {
    try {
      setIsRedirecting(true);
      await logout();
      toast.error("You must accept the terms to use RAMresume.");
      router.replace("/");
    } catch (error) {
      setIsRedirecting(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <IconLoader2 className="w-8 h-8 animate-spin text-fordham-white" />
      </div>
    );
  }

  return (
    <PageContainer marginBottom={true}>
      <GradientContainer>
        <div className="w-full flex flex-col items-center gap-6 py-24 px-4 md:px-6">
          <div className="max-w-3xl text-center">
            <h1 className="h4 md:h2 text-fordham-white mb-4">Notice About RAM Resume AI Usage</h1>
            <p className="body-txt-md md:body-txt-lg text-center font-light text-fordham-light-gray/60 max-w-2xl mx-auto">
              Please read and understand our terms of service before proceeding
            </p>
          </div>

          <div className="w-full max-w-2xl mt-8">
            <div className="bg-fordham-white/5 p-8 rounded-[24px] backdrop-blur-sm">
              <div className="space-y-6 text-fordham-white mb-8">
                <p className="text-fordham-light-gray/80">
                  Please read and acknowledge the following:
                </p>
                <ol className="list-decimal list-inside space-y-4 ml-4 text-fordham-light-gray/60">
                  <li>
                    RAMresume uses artificial intelligence to assist with resume optimization.
                  </li>
                  <li>AI technology can sometimes generate incorrect or incomplete information.</li>
                  <li>All AI-generated suggestions should be carefully reviewed and verified.</li>
                  <li>You are responsible for ensuring the accuracy of your final resume.</li>
                  <li>Always use professional judgment when applying AI suggestions.</li>
                </ol>
              </div>

              <div className="flex items-center mb-8 bg-fordham-white/5 p-4 rounded-[16px]">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-3 h-4 w-4 cursor-pointer accent-[#BE2929]"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  disabled={isSubmitting}
                />
                <label htmlFor="terms" className="text-fordham-white cursor-pointer">
                  I understand and accept these terms
                </label>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleAccept}
                  disabled={!accepted || isSubmitting}
                  className={`px-6 py-3 rounded-full text-fordham-white font-medium transition-colors flex items-center
                    ${
                      accepted && !isSubmitting
                        ? "bg-gradient-to-r from-[#7E1515] via-[#BE2929] to-[#F34848] hover:from-[#6E1313] hover:via-[#AE2727] hover:to-[#E34646]"
                        : "bg-fordham-dark-gray cursor-not-allowed"
                    }`}
                >
                  {isSubmitting && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full bg-fordham-white/5 text-fordham-white 
                    hover:bg-fordham-white/10 transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </GradientContainer>
    </PageContainer>
  );
}
