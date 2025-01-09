import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useApi } from "../hooks/useApi";
import PageContainer from "@/components/PageContainer";
import GradientContainer from "@/components/ui/GradientContainer";
import { IconChevronDown } from "@tabler/icons-react";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import { useAuth } from "@/context/AuthContext";

export default function Onboarding() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSuccess = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PageContainer marginBottom={true}>
      <GradientContainer>
        <div className="w-full flex flex-col items-center gap-2 py-20 px-6 md:px-10">
          <div className="max-w-3xl text-center">
            <h1 className="h4 md:h2 text-fordham-white mb-4">Complete Your Profile</h1>
            <p className="body-txt-sm md:body-txt-md text-center font-light text-fordham-light-gray/60 max-w-2xl mx-auto">
              Help us personalize your experience and match you with the right opportunities
            </p>
          </div>
        </div>
        <div className="shadow-lg w-full max-w-2xl mx-auto flex flex-col items-center gap-2 bg-fordham-white/10 rounded-[16px] p-6">
          <ProfileEditForm
            mode="onboarding"
            onSubmitSuccess={handleSuccess}
            onLogout={handleLogout}
          />
        </div>
      </GradientContainer>
    </PageContainer>
  );
}
