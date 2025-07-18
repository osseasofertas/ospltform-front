import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
  Image,
  Video,
  Award,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const {
    user,
    transactions,
    userStats,
    getDailyStats,
    getTodaysStats,
    getWeeklyEarnings,
    setPaypalAccount,
  } = useAppState();
  const [paypalInput, setPaypalInput] = React.useState(
    user?.paypalAccount || ""
  );
  const [editingPaypal, setEditingPaypal] = React.useState(false);

  const handleBack = () => {
    setLocation("/main");
  };

  const handlePaypalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPaypalAccount(paypalInput);
    setEditingPaypal(false);
    toast({
      title: "PayPal updated",
      description: "Your PayPal account has been saved.",
    });
  };

  const dailyStats = getDailyStats();
  const todaysStats = getTodaysStats();
  const weeklyEarnings = getWeeklyEarnings();

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Sort daily stats by date (newest first)
  const sortedDailyStats = [...dailyStats].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-neutral-600 hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-800">Wallet</h2>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="p-4">
        {/* PayPal Account Section */}
        <Card className="border border-neutral-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              PayPal Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user?.paypalAccount && !editingPaypal ? (
              <div className="flex items-center justify-between">
                <span className="text-neutral-800">{user.paypalAccount}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingPaypal(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePaypalSave} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your-paypal@email.com"
                  value={paypalInput}
                  onChange={(e) => setPaypalInput(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  Save
                </Button>
                {user?.paypalAccount && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingPaypal(false)}
                  >
                    Cancel
                  </Button>
                )}
              </form>
            )}
            <p className="text-xs text-neutral-500 mt-2">
              Add your PayPal account to receive withdrawals.
            </p>
          </CardContent>
        </Card>
        {/* Balance Overview */}
        <Card className="border border-neutral-200 mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-800 mb-2">
                ${user?.balance || "0.00"}
              </div>
              <p className="text-sm text-neutral-600">Total Balance</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {userStats.totalEvaluations}
                </div>
                <p className="text-xs text-neutral-600">Total Evaluations</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {todaysStats?.evaluationsCount || 0}
                </div>
                <p className="text-xs text-neutral-600">Today</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  ${weeklyEarnings}
                </div>
                <p className="text-xs text-neutral-600">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        {todaysStats && (
          <Card className="border border-neutral-200 mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">
                    Evaluations Completed
                  </span>
                  <Badge className="bg-primary/10 text-primary">
                    {todaysStats.evaluationsCount}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Earnings Today</span>
                  <span className="font-semibold text-green-600">
                    ${todaysStats.earnings}
                  </span>
                </div>

                {todaysStats.contentEvaluated.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">
                      Content Evaluated Today:
                    </h4>
                    <div className="space-y-2">
                      {todaysStats.contentEvaluated.map((content, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-neutral-50 p-2 rounded"
                        >
                          <div className="flex items-center gap-2">
                            {content.type === "photo" ? (
                              <Image className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Video className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm capitalize">
                              {content.type} #{content.contentId}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-green-600">
                              +${content.earning}
                            </span>
                            <span className="text-xs text-neutral-500">
                              {formatTime(content.completedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily History */}
        <Card className="border border-neutral-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Daily History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedDailyStats.length > 0 ? (
              <div className="space-y-3">
                {sortedDailyStats.slice(0, 7).map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-neutral-800">
                        {formatDate(day.date)}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {day.evaluationsCount} evaluation
                        {day.evaluationsCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ${day.earnings}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {
                          day.contentEvaluated.filter((c) => c.type === "photo")
                            .length
                        }{" "}
                        photos,{" "}
                        {
                          day.contentEvaluated.filter((c) => c.type === "video")
                            .length
                        }{" "}
                        videos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No evaluation history yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="border border-neutral-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedTransactions.length > 0 ? (
              <div className="space-y-3">
                {sortedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border-b border-neutral-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {transaction.type === "welcome_bonus" ? (
                          <Award className="h-4 w-4 text-primary" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        +${transaction.amount}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {formatTime(transaction.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No transactions yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
