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
          <button
            onClick={handleBack}
            className="text-neutral-600 hover:text-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-800">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs text-neutral-500">
              Last updated: 15/01 – 14:30
            </p>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-primary" />
          <p className="text-sm text-neutral-600">
            Find answers to the most common questions about OnlyCash
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {/* General and Access */}
          <AccordionItem
            value="general"
            className="border border-neutral-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">
                General and Access
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I register and log into the application?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Enter your <strong>email address</strong> on the registration
                    screen and tap "Register". You'll need to upload ID documents
                    for verification before accessing the platform.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What if I can't access my account?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    If you can't access your account, you'll need to register again
                    with a new email address and complete the document verification process.
                    Each account requires valid ID documents for verification.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What is a Demo account?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Demo accounts are for testing and demonstration purposes. They have limited functionality
                    and are clearly identified in your profile.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Account Verification */}
          <AccordionItem
            value="verification"
            className="border border-neutral-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">
                Account Verification
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Why do I need to verify my account?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Verification is required to ensure platform security
                    and allow fund withdrawals. It's mandatory for all users.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How does free verification work?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Upload a valid ID document. Verification will be
                    processed automatically within 24 hours.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What is instant verification?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Instant verification for $9.99 that approves your account immediately
                    after payment, without needing to upload documents.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What documents are accepted?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Official ID documents such as driver's license, passport, or
                    other government-issued documents with photo.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Product Evaluation */}
          <AccordionItem
            value="evaluation"
            className="border border-neutral-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">
                Product Evaluation
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I start evaluating products?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    On the main screen, tap any product card to start
                    the evaluation questionnaire.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What is the daily evaluation limit?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Up to <strong>10 evaluations</strong> per day by default; your progress
                    is shown on the main screen. You can increase this limit.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How can I increase my daily limit?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Tap "Unlock More Evaluations" on the main screen to see
                    available upgrade options with one-time payment.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How much can I earn per evaluation?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Between <strong>$1.00</strong> and <strong>$4.00</strong>,
                    depending on the product and complexity; the range appears
                    on each product card.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What are the evaluation types?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    <strong>Photo</strong> evaluations (3 stages) and <strong>video</strong> evaluations.
                    Each type has different question structures and earnings.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Where can I see my recent earnings?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In the "Recent Earnings" section on the main screen, with
                    product, date and amount details.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* My Wallet and Earnings */}
          <AccordionItem
            value="wallet"
            className="border border-neutral-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">
                My Wallet and Earnings
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I see my total balance?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Your balance appears prominently in "My Wallet" above the
                    transaction list.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What do "Today's Earnings" and "Today's Evaluations" mean?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    "Today's Earnings" shows what you earned today; "Today's
                    Evaluations" shows how many you completed today.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I set up payment methods?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "My Wallet", you can set up your PayPal account or
                    bank details to receive withdrawals.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I withdraw my funds?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "My Wallet", tap "Withdraw Funds" and follow the
                    instructions. You need to have a verified account.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Why are my withdrawals blocked?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    For security reasons, new users must wait 7 days
                    after registration and have a verified account to withdraw funds.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How long do I need to wait for my first withdrawal?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    The app shows how many days remain before withdrawals are
                    enabled. You also need to have a verified account.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Where can I see my earnings history?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "Earnings History" within "My Wallet", with details
                    from each evaluation.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Profile Management */}
          <AccordionItem
            value="profile"
            className="border border-neutral-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">
                Profile Management
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I edit my profile?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Profile information is automatically managed. Your data
                    is stored locally on your device.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Where can I see my evaluation and earnings statistics?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    In "Profile", you'll see totals for evaluations, earnings
                    and daily statistics.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Can I adjust settings in my profile?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Basic profile information is shown. Contact support for
                    advanced changes.
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

          {/* Results and Completion */}
          <AccordionItem
            value="results"
            className="border border-neutral-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">
                Results and Completion
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What happens after completing an evaluation?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    You'll be directed to the results page showing
                    how much you earned and evaluation details.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do stage earnings work in photo evaluations?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Photo evaluations have 3 stages. The total earnings are divided
                    equally between stages, shown on the results page.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Can I see details of previous evaluations?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Yes, on the results page you can see the content type,
                    title and earnings of each evaluation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I continue evaluating after completing one?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    On the results page, tap "Continue Evaluating"
                    to return to the main screen and choose another product.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Technical Support */}
          <AccordionItem
            value="technical"
            className="border border-neutral-200 rounded-lg"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="font-medium text-neutral-800">
                Technical Support
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    What should I do if the application doesn't load?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Check your internet connection and try reloading the page.
                    If the problem persists, contact support.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    How do I report a problem?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Use the support section in the application or contact
                    through official channels listed in the profile.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Are data saved automatically?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    Yes, all data is automatically synchronized with the server.
                    There's no risk of losing progress or earnings.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-800 mb-2">
                    Does the application work offline?
                  </h4>
                  <p className="text-sm text-neutral-600 ml-4">
                    No, the application requires internet connection to work
                    properly and synchronize data.
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
