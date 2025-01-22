import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function RouteGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Define public routes that don't need authentication
    const publicRoutes = ["/", "/about", "/blog", "/frequently-asked-questions", "/login"];
    const isPublicRoute = publicRoutes.includes(router.pathname);

    if (!user && !isPublicRoute) {
      router.replace("/");
      return;
    }

    if (user) {
      // If user hasn't accepted terms, redirect to terms page
      if (!user.hasAcceptedTerms && router.pathname !== "/terms") {
        router.replace("/terms");
        return;
      }

      // If user hasn't completed onboarding, redirect to onboarding
      if (user.hasAcceptedTerms && !user.onboardingCompleted && router.pathname !== "/onboarding") {
        router.replace("/onboarding");
        return;
      }

      // If user is on terms or onboarding page but has completed them, redirect to profile
      if (
        (router.pathname === "/terms" && user.hasAcceptedTerms) ||
        (router.pathname === "/onboarding" && user.onboardingCompleted)
      ) {
        router.replace("/profile");
        return;
      }
    }
  }, [user, loading, router.pathname]);

  // Show nothing while checking auth
  if (loading) return null;

  return children;
}
