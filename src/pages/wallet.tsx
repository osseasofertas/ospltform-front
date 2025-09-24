import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
  Video,
  Award,
  Users,
  Crown,
  ArrowUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const {
    user,
    transactions,
    evaluations,
    stats,
    withdrawalQueue,
    withdrawalRequests,
    fetchStats,
    fetchTransactions,
    fetchEvaluations,
    fetchWithdrawalQueue,
    fetchWithdrawalRequests,
    updatePaypal,
    updateBank,
    requestWithdrawal,
    becomePremiumReviewer,
  } = useAppState();
  const [paypalInput, setPaypalInput] = React.useState(user?.paypalAccount || "");
  const [editingPaypal, setEditingPaypal] = React.useState(false);
  const [bankInput, setBankInput] = React.useState(user?.bankAccount || "");
  const [editingBank, setEditingBank] = React.useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isRequestingWithdrawal, setIsRequestingWithdrawal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
  }>({ days: 0, hours: 0, minutes: 0 });

  // Calculate time remaining for withdrawal (based on queue end time)
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!withdrawalQueue?.queueEndsAt) return;

      const queueEndTime = new Date(withdrawalQueue.queueEndsAt).getTime();
      const now = Date.now();
      const difference = queueEndTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining({ days, hours, minutes });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [withdrawalQueue?.queueEndsAt]);

  // Check if withdrawal period has expired (queue countdown reached zero)
  const isWithdrawalExpired = withdrawalQueue ? new Date(withdrawalQueue.queueEndsAt).getTime() <= Date.now() : false;

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    fetchEvaluations();
    fetchWithdrawalQueue();
    fetchWithdrawalRequests();
  }, [fetchStats, fetchTransactions, fetchEvaluations, fetchWithdrawalQueue, fetchWithdrawalRequests]);

  const handleBack = () => {
    setLocation("/main");
  };

  const handleContactSupport = () => {
    setLocation("/support");
  };

  const handlePaypalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePaypal(paypalInput);
    setEditingPaypal(false);
    toast({
      title: "PayPal updated",
      description: "Your PayPal account has been saved.",
    });
  };

  const handleBankSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBank(bankInput);
    setEditingBank(false);
    toast({
      title: "Bank account updated",
      description: "Your bank account has been saved.",
    });
  };

  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert and validate amount
    const amountFloat = parseFloat(withdrawalAmount);
    if (!withdrawalAmount || isNaN(amountFloat) || amountFloat <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    // Use the calculated balance from transactions (which is what's displayed)
    if (amountFloat > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    setIsRequestingWithdrawal(true);
    try {
      await requestWithdrawal(withdrawalAmount);
      setWithdrawalAmount("");
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal has been added to the queue.",
      });
      
      // Force refresh all data
      setTimeout(async () => {
        await fetchStats();
        await fetchTransactions();
        await fetchWithdrawalQueue();
        await fetchWithdrawalRequests();
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "Failed to request withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingWithdrawal(false);
    }
  };

  const handleBecomePremium = () => {
    // Redirect to Mundpay payment page
    window.open('https://pay.mundpay.com/01997747-2c9e-70bb-968a-42cee05e17d8?ref=', '_blank');
    
    toast({
      title: "Redirecting to payment",
      description: "You will be redirected to complete your premium membership purchase.",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Time";
      }
      return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    } catch (error) {
      return "Invalid Time";
    }
  };

  // Fallbacks to ensure the page never breaks
  const totalEvaluations = stats?.totalEvaluations ?? 0;
  const todayEvaluations = stats?.todayEvaluations ?? 0;
  const totalEarned = stats?.totalEarned ?? "0.00";

  // Sort transactions by date
  const sortedTransactions = [...(transactions ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calculate balance from transactions minus pending withdrawals
  const earningsFromTransactions = transactions.reduce((sum, t) => {
    const amount = Number(t.amount);
    console.log(`Transaction ${t.id}: ${t.type} - ${amount} (${t.description})`);
    return sum + amount;
  }, 0);
  
  // Calculate total pending withdrawals
  const totalPendingWithdrawals = withdrawalRequests
    .filter(request => request.status === "pending")
    .reduce((sum, request) => {
      const amount = typeof request.amount === 'string' ? parseFloat(request.amount) : request.amount;
      console.log(`Pending withdrawal ${request.id}: ${amount}`);
      return sum + amount;
    }, 0);
  
  // Final balance = earnings - pending withdrawals
  const balance = earningsFromTransactions - totalPendingWithdrawals;
  
  console.log("Earnings from transactions:", earningsFromTransactions);
  console.log("Total pending withdrawals:", totalPendingWithdrawals);
  console.log("Final calculated balance:", balance);

  // Queue/form rules
  const hasActiveWithdrawalRequest = withdrawalRequests.some(
    (r) => r.status === "pending" || r.status === "processing"
  );

  // Debug logs
  useEffect(() => {
    console.log("=== WALLET DEBUG ===");
    console.log("User balance (backend):", user?.balance);
    console.log("Calculated balance (transactions):", balance);
    console.log("Transactions count:", transactions?.length);
    console.log("Withdrawal transactions:", transactions?.filter(t => t.type === "withdrawal"));
    console.log("Withdrawal queue:", withdrawalQueue);
    console.log("Withdrawal requests:", withdrawalRequests);
    console.log("Current transactions:", transactions);
    console.log("Sorted transactions:", sortedTransactions);
    console.log("=== END WALLET DEBUG ===");
  }, [evaluations, stats, transactions, sortedTransactions, user?.balance, balance, withdrawalQueue, withdrawalRequests]);

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

        {/* Bank Account Section */}
        <Card className="border border-neutral-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Bank Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user?.bankAccount && !editingBank ? (
              <div className="flex items-center justify-between">
                <span className="text-neutral-800">{user.bankAccount}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingBank(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBankSave} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Bank, agency, account, type..."
                  value={bankInput}
                  onChange={(e) => setBankInput(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  Save
                </Button>
                {user?.bankAccount && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingBank(false)}
                  >
                    Cancel
                  </Button>
                )}
              </form>
            )}
            <p className="text-xs text-neutral-500 mt-2">
              Add your bank account to receive withdrawals.
            </p>
          </CardContent>
        </Card>

        {/* Withdrawal Queue Section */}
        {withdrawalRequests.length > 0 && (
          <Card className="border border-neutral-200 mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Withdrawal Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalQueue ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-neutral-600" />
                      <span className="text-sm text-neutral-600">Your Position</span>
                    </div>
                    <Badge variant="outline" className="text-lg font-semibold">
                      #{withdrawalQueue.position || 2064}
                    </Badge>
                  </div>
                
          

                  {/* Error Message after 13 days in Queue Section */}
                  {isWithdrawalExpired && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Withdrawal Error</span>
                      </div>
                      <p className="text-sm text-red-700 mb-3">
                        It was not possible to verify the user's identity. Please contact support for assistance.
                      </p>
                      <Button
                        onClick={handleContactSupport}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      >
                        Contact Support
                      </Button>
                    </div>
                  )}
                  
                  {!user?.isPremiumReviewer && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Become a Premium Reviewer</span>
                      </div>
                      <p className="text-sm text-yellow-700 mb-3">
                        Get priority in the withdrawal queue and other exclusive benefits!
                      </p>
                      <Button
                        onClick={handleBecomePremium}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Become Premium
                      </Button>
                    </div>
                  )}

                  {user?.isPremiumReviewer && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-800">Premium Reviewer</span>
                      </div>
                      <p className="text-sm text-purple-700">
                        You have priority in the withdrawal queue!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-neutral-500">Loading queue information...</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Withdrawal Request Section */}
        <Card className="border border-neutral-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-primary" />
              Request Withdrawal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdrawalRequest} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Available: ${balance.toFixed(2)}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isRequestingWithdrawal ||
                  balance <= 0 ||
                  (!user?.paypalAccount && !user?.bankAccount) ||
                  hasActiveWithdrawalRequest ||
                  isWithdrawalExpired
                }
              >
                {isRequestingWithdrawal ? "Requesting..." : "Request Withdrawal"}
              </Button>

              {(!user?.paypalAccount && !user?.bankAccount) && (
                <p className="text-xs text-amber-600">
                  Add your PayPal or bank account above to receive withdrawals.
                </p>
              )}

              {hasActiveWithdrawalRequest && (
                <p className="text-xs text-neutral-600">
                  You already have a withdrawal request in the queue. Please wait until it is processed.
                </p>
              )}

              {isWithdrawalExpired && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Withdrawal Error</span>
                  </div>
                  <p className="text-xs text-red-700">
                    It was not possible to verify the user's identity. Please contact support for assistance.
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
        {/* Balance Overview */}
        <Card className="border border-neutral-200 mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-800 mb-2">
                ${balance.toFixed(2)}
              </div>
              <p className="text-sm text-neutral-600">Total Balance</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {totalEvaluations}
                </div>
                <p className="text-xs text-neutral-600">Total Evaluations</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {todayEvaluations}
                </div>
                <p className="text-xs text-neutral-600">Today</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  ${totalEarned}
                </div>
                <p className="text-xs text-neutral-600">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Requests History */}
        <Card className="border border-neutral-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-primary" />
              Withdrawal Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawalRequests.length > 0 ? (
              <div className="space-y-3">
                {withdrawalRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border-b border-neutral-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        request.status === "completed" ? "bg-green-100" :
                        request.status === "processing" ? "bg-blue-100" :
                        request.status === "failed" ? "bg-red-100" :
                        "bg-yellow-100"
                      }`}>
                        <ArrowUp className={`h-4 w-4 ${
                          request.status === "completed" ? "text-green-600" :
                          request.status === "processing" ? "text-blue-600" :
                          request.status === "failed" ? "text-red-600" :
                          "text-yellow-600"
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">
                          Withdrawal Request
                        </div>
                        <div className="text-sm text-neutral-600">
                          {request.requestDate || request.requestedAt ? (
                            <>
                              {formatDate(request.requestDate || request.requestedAt!)}
                              <span className="text-xs text-neutral-500 ml-2">
                                {formatTime(request.requestDate || request.requestedAt!)}
                              </span>
                            </>
                          ) : (
                            "Date not available"
                          )}
                        </div>
                        <div className="text-xs text-neutral-500">
                          Queue Position: #{request.queuePosition}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">
                        -${typeof request.amount === 'string' ? request.amount : request.amount.toFixed(2)}
                      </div>
                      <Badge variant={
                        request.status === "completed" ? "default" :
                        request.status === "processing" ? "secondary" :
                        request.status === "failed" ? "destructive" :
                        "outline"
                      }>
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No withdrawal requests yet
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
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        +${transaction.amount}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {formatTime(transaction.createdAt)}
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
