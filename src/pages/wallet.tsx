import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
  Video,
  Award,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";
import React, { useEffect } from "react";
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
    fetchStats,
    fetchTransactions,
    fetchEvaluations,
    updatePaypal,
    updateBank,
  } = useAppState();
  const [paypalInput, setPaypalInput] = React.useState(user?.paypalAccount || "");
  const [editingPaypal, setEditingPaypal] = React.useState(false);
  const [bankInput, setBankInput] = React.useState(user?.bankAccount || "");
  const [editingBank, setEditingBank] = React.useState(false);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    fetchEvaluations();
  }, [fetchStats, fetchTransactions, fetchEvaluations]);

  const handleBack = () => {
    setLocation("/main");
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

  // Calculate balance from transactions (more accurate)
  const balance = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  // Debug logs
  useEffect(() => {
    console.log("Wallet page - User balance (backend):", user?.balance);
    console.log("Wallet page - Calculated balance (transactions):", balance);
    console.log("Wallet page - Transactions count:", transactions?.length);
    console.log("Wallet page - Current evaluations:", evaluations);
    console.log("Wallet page - Current stats:", stats);
    console.log("Wallet page - Current transactions:", transactions);
    console.log("Wallet page - Filtered evaluations:", evaluations?.filter(evaluation => evaluation.completed));
    console.log("Wallet page - Sorted transactions:", sortedTransactions);
  }, [evaluations, stats, transactions, sortedTransactions, user?.balance, balance]);

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
