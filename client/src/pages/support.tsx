import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Support() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/main");
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="text-neutral-600 hover:text-neutral-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-800">Frequently Asked Questions (FAQ)</h2>
            <p className="text-xs text-neutral-500">Last updated: 07/10 – 05:15</p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-primary" />
          <p className="text-sm text-neutral-600">
            Find answers to the most common questions about SafeMoney
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {/* General and Access */}
          <AccordionItem value="general" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">General and Access</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I log into the application?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Enter your <strong>Email address</strong> on the login screen and tap "Log in". No password required.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What if I can't access my account?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Simply enter any email address to create a new account with $50.00 starting balance.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Product Evaluation */}
          <AccordionItem value="evaluacion" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">Product Evaluation</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I start evaluating products?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    On the main screen, tap any product card to start the evaluation questionnaire.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What is the daily evaluation limit?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Up to <strong>10 evaluations</strong> per day; your progress is shown on the main screen.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How much can I earn per evaluation?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Between <strong>$1.00</strong> and <strong>$4.00</strong>, depending on the product and complexity; the range appears on each product card.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Where can I see my recent earnings?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In the "Recent Earnings" section on the main screen, with product, date and amount details.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* My Wallet and Earnings */}
          <AccordionItem value="billetera" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">My Wallet and Earnings</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I see my total balance?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Your balance appears prominently in "My Wallet" above the transaction list.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What do "Today's Earnings" and "Today's Evaluations" mean?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    "Today's Earnings" shows what you earned today; "Today's Evaluations" shows how many you completed today.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I withdraw my funds?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "My Wallet", tap "Withdraw Funds" and follow the instructions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Why are my withdrawals blocked?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    For security reasons, new users must wait a period before withdrawing funds.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How long do I need to wait for my first withdrawal?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    The app shows how many days remain before withdrawals are enabled.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Where can I see my earnings history?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "Earnings History" within "My Wallet", with details from each evaluation.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Profile Management */}
          <AccordionItem value="perfil" className="border border-neutral-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">Profile Management</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I edit my profile?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Profile information is automatically managed. Your data is stored locally on your device.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Where can I see my evaluation and earnings statistics?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "Profile", you'll see totals for evaluations, earnings and daily statistics.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Can I adjust settings in my profile?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Basic profile information is shown. Contact support for advanced changes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I log out?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "Profile", tap "Log out" to end your session.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}