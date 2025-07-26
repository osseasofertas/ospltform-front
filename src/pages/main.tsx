import { getTodaysContent } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  AlertCircle,
  User,
  HelpCircle,
  TrendingUp,
  Play,
  Image,
} from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useLocation } from "wouter";
import { AppContent } from "@/types";
import ContentCard from "@/components/content-card";
import { useEffect, useState } from "react";

export default function Main() {
  const {
    user,
    evaluations,
    fetchEvaluations,
    stats,
    fetchStats,
    setCurrentContent,
    updateEvaluationLimit,
  } = useAppState();
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchEvaluations();
    fetchStats();
  }, [fetchEvaluations, fetchStats]);

  // Fallbacks to ensure the page never breaks
  const todayEvaluations = stats?.todayEvaluations ?? 0;
  const userEvaluationLimit = user?.evaluationLimit ?? 10; // Use user's limit or default to 10
  const isDailyLimitReached = todayEvaluations >= userEvaluationLimit;
  const evaluatedIds = new Set((evaluations ?? []).map((e) => e.productId || e.contentId));
  const content = user
    ? getTodaysContent(user.registrationDate).filter(
        (item) => !evaluatedIds.has(item.id)
      )
    : [];

  // Debug logs
  useEffect(() => {
    console.log("=== Main page DEBUG ===");
    console.log("Main page - User registration date:", user?.registrationDate);
    console.log("Main page - User evaluation limit:", user?.evaluationLimit);
    console.log("Main page - Current evaluations:", evaluations);
    console.log("Main page - Evaluations count:", evaluations?.length);
    console.log("Main page - Today evaluations:", todayEvaluations);
    console.log("Main page - Daily limit reached:", isDailyLimitReached);
    console.log("Main page - Evaluated IDs:", Array.from(evaluatedIds));
    console.log("Main page - Evaluated IDs count:", evaluatedIds.size);
    console.log("Main page - Available content:", content);
    console.log("Main page - Available content count:", content?.length);
    console.log("Main page - Total content before filter:", getTodaysContent(user?.registrationDate || "").length);
    
    // Debug each content item
    const allContent = getTodaysContent(user?.registrationDate || "");
    console.log("Main page - All content items:", allContent.map(item => ({ id: item.id, title: item.title })));
    
    // Debug filtering process
    allContent.forEach(item => {
      const isEvaluated = evaluatedIds.has(item.id);
      console.log(`Content ${item.id} (${item.title}): evaluated = ${isEvaluated}`);
    });
    
    // Debug user info
    console.log("Main page - User info:", user);
    console.log("=== Main page DEBUG END ===");
  }, [evaluations, evaluatedIds, content, user?.registrationDate, user, todayEvaluations, isDailyLimitReached]);

  const handleContentSelect = (selectedContent: AppContent) => {
    setCurrentContent(selectedContent);
    setLocation("/evaluation");
  };

  const handleUnlockMoreEvaluations = () => {
    // Reset daily evaluations count in localStorage
    const today = new Date().toDateString();
    const dailyStats = JSON.parse(localStorage.getItem('dailyStats') || '{}');
    
    // Reset today's evaluation count
    dailyStats[today] = 0;
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
    
    // Refresh stats
    fetchStats();
    
    // Show success message
    alert("More evaluations unlocked! You can now continue evaluating.");
  };

  const handleIncreaseLimit = () => {
    setLocation("/limit-upgrade");
  };

  if (!user) return null;

  // Loading visual only if stats are loading for the first time
  if (!stats && todayEvaluations === 0 && !isDailyLimitReached) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isDailyLimitReached) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-800">
                Evaluations
              </h2>
              <p className="text-sm text-neutral-600">Daily limit reached</p>
            </div>
            <button
              onClick={() => setLocation("/wallet")}
              className="text-primary hover:text-primary-600 transition-colors"
            >
              <Wallet className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Limit Message */}
        <div className="p-4">
          <Card className="border border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-orange-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Daily limit reached
              </h3>
              <p className="text-neutral-600 mb-4">
                You've completed {userEvaluationLimit} evaluations today. Come back tomorrow to
                continue earning money by evaluating products.
              </p>
              <p className="text-sm text-neutral-500 mb-4">
                The limit resets at midnight (00:00).
              </p>
              <Button
                onClick={handleIncreaseLimit}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary/90"
              >
                Upgrade Daily Limit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="px-4 py-6">
          {/* Welcome section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                Hello, {user?.name || "User"}!
              </h1>
              <p className="text-white/80 text-sm">
                Earn money by evaluating products
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${user?.balance || "0.00"}</p>
              <p className="text-white/80 text-xs">Available balance</p>
            </div>
          </div>

          {/* Quick access menu */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => setLocation("/wallet")}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
            >
              <Wallet className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">My Wallet</span>
            </button>
            <button
              onClick={() => setLocation("/profile")}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
            >
              <User className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Profile</span>
            </button>
            <button
              onClick={() => setLocation("/support")}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
            >
              <HelpCircle className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Support</span>
            </button>
          </div>

          {/* Detailed daily progress */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily progress</span>
              <span className="text-sm">
                {todayEvaluations}/{userEvaluationLimit} evaluations
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (todayEvaluations / userEvaluationLimit) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-white/80">
              <span>Completed: {todayEvaluations}</span>
              <span>Remaining: {userEvaluationLimit - todayEvaluations}</span>
            </div>
            {todayEvaluations >= userEvaluationLimit && (
              <div className="mt-2 text-center">
                <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                  🎉 Daily limit reached!
                </span>
              </div>
            )}
          </div>
          
          {/* Unlock more evaluations button */}
          {todayEvaluations >= userEvaluationLimit && (
            <div className="mt-4">
              <button
                onClick={handleUnlockMoreEvaluations}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg"
              >
                🔓 Unlock More Evaluations
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products section header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-neutral-800">
          Today's Content
        </h2>
        <p className="text-sm text-neutral-600">
          Rate photos and videos to earn money
        </p>
      </div>

      {/* Content Grid - Photos and Videos */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {content.map((item) => (
          <ContentCard
            key={item.id}
            content={item}
            onSelect={() => handleContentSelect(item)}
          />
        ))}
      </div>
    </div>
  );
}
