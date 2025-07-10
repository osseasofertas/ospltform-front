import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Info, CreditCard, CheckCircle, Mail, Building } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";
import { AppTransaction, AppStats } from "@/types";
import { apiRequest } from "@/lib/queryClient";

export default function Wallet() {
  const [, setLocation] = useLocation();
  const { user, transactions, userStats } = useAppState();
  const { toast } = useToast();
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<string>('');
  const [currentPayoutMethod, setCurrentPayoutMethod] = useState<string>('');
  const [payoutDetails, setPayoutDetails] = useState({
    email: '',
    accountName: '',
    bankName: '',
    accountNumber: ''
  });

  // Load payout method from localStorage on component mount
  useEffect(() => {
    const savedPayoutMethod = localStorage.getItem('payoutMethod');
    const savedPayoutDetails = localStorage.getItem('payoutDetails');
    if (savedPayoutMethod) {
      setCurrentPayoutMethod(savedPayoutMethod);
    }
    if (savedPayoutDetails) {
      setPayoutDetails(JSON.parse(savedPayoutDetails));
    }
  }, []);

  // Mutation for registering payout method
  const payoutMethodMutation = useMutation({
    mutationFn: async (method: string) => {
      console.log('Registering payout method:', method, 'for user:', user?.id || 1);
      try {
        const response = await apiRequest(
          'POST',
          '/api/payout-method',
          { 
            userId: user?.id || 1, 
            method,
            details: method === 'PayPal' ? {
              email: payoutDetails.email
            } : {
              accountName: payoutDetails.accountName,
              bankName: payoutDetails.bankName,
              accountNumber: payoutDetails.accountNumber
            }
          }
        );
        console.log('Payout method registration response:', response);
        return await response.json();
      } catch (error) {
        console.error('Error registering payout method:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Payout method registration successful:', data);
      // Store in localStorage
      localStorage.setItem('payoutMethod', selectedPayoutMethod);
      localStorage.setItem('payoutDetails', JSON.stringify(payoutDetails));
      setCurrentPayoutMethod(selectedPayoutMethod);
      
      // Show success toast
      toast({
        title: "Method registered!",
        description: `Your payout method (${selectedPayoutMethod}) has been successfully registered.`,
        duration: 3000,
      });
      
      // Reset selection
      setSelectedPayoutMethod('');
      setPayoutDetails({
        email: '',
        accountName: '',
        bankName: '',
        accountNumber: ''
      });
    },
    onError: (error) => {
      console.error('Payout method registration error:', error);
      toast({
        title: "Error",
        description: `Could not register payout method: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleRegisterPayoutMethod = () => {
    if (selectedPayoutMethod && isFormValid()) {
      payoutMethodMutation.mutate(selectedPayoutMethod);
    }
  };

  const handleChangePayoutMethod = () => {
    setCurrentPayoutMethod('');
    setSelectedPayoutMethod('');
    setPayoutDetails({
      email: '',
      accountName: '',
      bankName: '',
      accountNumber: ''
    });
    localStorage.removeItem('payoutMethod');
    localStorage.removeItem('payoutDetails');
  };

  const isFormValid = () => {
    if (selectedPayoutMethod === 'PayPal') {
      return payoutDetails.email.trim() !== '' && payoutDetails.email.includes('@');
    } else if (selectedPayoutMethod === 'Bank deposit') {
      return payoutDetails.accountName.trim() !== '' && 
             payoutDetails.bankName.trim() !== '' && 
             payoutDetails.accountNumber.trim() !== '';
    }
    return false;
  };

  const getCurrentPayoutInfo = () => {
    const savedDetails = localStorage.getItem('payoutDetails');
    if (savedDetails && currentPayoutMethod) {
      const details = JSON.parse(savedDetails);
      if (currentPayoutMethod === 'PayPal') {
        return details.email;
      } else {
        return `${details.bankName} - ${details.accountName}`;
      }
    }
    return currentPayoutMethod;
  };

  const handleBack = () => {
    setLocation("/main");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Always show the actual date in MM/DD/YYYY format
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="text-neutral-600 hover:text-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold text-neutral-800">My Wallet</h2>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-primary to-secondary mx-4 mt-4 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">Available balance</p>
            <p className="text-4xl font-bold mb-4">${user?.balance || "0.00"}</p>
            <div className="bg-white/20 rounded-lg p-3 text-sm flex items-center justify-center">
              <Info className="h-4 w-4 mr-2" />
              Withdrawal available after 7 days
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Method Card */}
      <Card className="mx-4 mt-4 border border-neutral-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-neutral-800">Payout Method</h3>
          </div>
          
          {currentPayoutMethod ? (
            // Show active payout method
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Active payout method: {currentPayoutMethod}</p>
                  <p className="text-sm text-neutral-600">{getCurrentPayoutInfo()}</p>
                </div>
              </div>
              <Button 
                onClick={handleChangePayoutMethod}
                variant="outline"
                className="w-full"
              >
                Change method
              </Button>
            </div>
          ) : (
            // Show payout method selection
            <div className="space-y-4">
              <RadioGroup value={selectedPayoutMethod} onValueChange={setSelectedPayoutMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PayPal" id="paypal" />
                  <Label htmlFor="paypal" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    PayPal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Bank deposit" id="bank" />
                  <Label htmlFor="bank" className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Bank deposit
                  </Label>
                </div>
              </RadioGroup>

              {/* PayPal Details */}
              {selectedPayoutMethod === 'PayPal' && (
                <div className="space-y-3 p-3 bg-blue-50 rounded-lg border">
                  <Label htmlFor="email" className="text-sm font-medium text-blue-800">
                    PayPal Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    value={payoutDetails.email}
                    onChange={(e) => setPayoutDetails({
                      ...payoutDetails,
                      email: e.target.value
                    })}
                    className="border-blue-200 focus:border-blue-400"
                  />
                  <p className="text-xs text-blue-600">
                    Enter the email associated with your PayPal account
                  </p>
                </div>
              )}

              {/* Bank Details */}
              {selectedPayoutMethod === 'Bank deposit' && (
                <div className="space-y-3 p-3 bg-green-50 rounded-lg border">
                  <Label className="text-sm font-medium text-green-800">
                    Basic bank details
                  </Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Account holder name"
                      value={payoutDetails.accountName}
                      onChange={(e) => setPayoutDetails({
                        ...payoutDetails,
                        accountName: e.target.value
                      })}
                      className="border-green-200 focus:border-green-400"
                    />
                    <Input
                      placeholder="Bank name"
                      value={payoutDetails.bankName}
                      onChange={(e) => setPayoutDetails({
                        ...payoutDetails,
                        bankName: e.target.value
                      })}
                      className="border-green-200 focus:border-green-400"
                    />
                    <Input
                      placeholder="Account number"
                      value={payoutDetails.accountNumber}
                      onChange={(e) => setPayoutDetails({
                        ...payoutDetails,
                        accountNumber: e.target.value
                      })}
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                  <p className="text-xs text-green-600">
                    Basic information for payment processing
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleRegisterPayoutMethod}
                disabled={!selectedPayoutMethod || !isFormValid() || payoutMethodMutation.isPending}
                className="w-full"
              >
                {payoutMethodMutation.isPending ? 'Registering...' : 'Register method'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-4">
        <Card className="border border-neutral-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userStats.totalEvaluations}</p>
              <p className="text-sm text-neutral-600">Evaluations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-neutral-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{userStats.todayEvaluations}</p>
              <p className="text-sm text-neutral-600">Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Transaction History</h3>
        
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="border border-neutral-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-neutral-800">{transaction.description}</p>
                    <p className="text-sm text-neutral-600">{transaction.type === 'welcome_bonus' ? 'Registration completed' : 'Evaluation completed'}</p>
                    <p className="text-xs text-neutral-400">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">+${transaction.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
