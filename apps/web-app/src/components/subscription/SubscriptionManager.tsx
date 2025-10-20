import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Crown, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface SubscriptionStatus {
  subscribed: boolean;
  plan: string | null;
}

export const SubscriptionManager = () => {
  const { t } = useLanguage();
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>({
      subscribed: false,
      plan: null,
    });
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const plans = [
    {
      id: "basic",
      name: t("subscriptionManager.plans.basic.name"),
      price: "$9.99",
      icon: Check,
      features: [
        t("subscriptionManager.plans.basic.feature1"),
        t("subscriptionManager.plans.basic.feature2"),
        t("subscriptionManager.plans.basic.feature3"),
        t("subscriptionManager.plans.basic.feature4"),
      ],
    },
    {
      id: "premium",
      name: t("subscriptionManager.plans.premium.name"),
      price: "$19.99",
      icon: Star,
      popular: true,
      features: [
        t("subscriptionManager.plans.premium.feature1"),
        t("subscriptionManager.plans.premium.feature2"),
        t("subscriptionManager.plans.premium.feature3"),
        t("subscriptionManager.plans.premium.feature4"),
        t("subscriptionManager.plans.premium.feature5"),
      ],
    },
    {
      id: "enterprise",
      name: t("subscriptionManager.plans.enterprise.name"),
      price: "$49.99",
      icon: Crown,
      features: [
        t("subscriptionManager.plans.enterprise.feature1"),
        t("subscriptionManager.plans.enterprise.feature2"),
        t("subscriptionManager.plans.enterprise.feature3"),
        t("subscriptionManager.plans.enterprise.feature4"),
        t("subscriptionManager.plans.enterprise.feature5"),
      ],
    },
  ];

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "check-subscription",
      );
      if (error) {
        handleApiError(error, t("subscriptionManager.toast.checkStatusError"));
        throw error;
      }

      setSubscriptionStatus(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      handleApiError(error, t("subscriptionManager.toast.checkStatusError"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType: string) => {
    setUpgrading(planType);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-subscription",
        {
          body: { planType },
        },
      );

      if (error) {
        handleApiError(error, t("subscriptionManager.toast.createSubscriptionError"));
        throw error;
      }

      // Open Stripe checkout in new tab
      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error creating subscription:", error);
      handleApiError(error, t("subscriptionManager.toast.createSubscriptionError"));
    } finally {
      setUpgrading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg md:text-xl">{t("subscriptionManager.title")}</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {t("subscriptionManager.description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptionStatus.subscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-600 me-2 flex-shrink-0" />
              <span className="text-green-800 text-sm">
                {t("subscriptionManager.subscribedMessage", { plan: subscriptionStatus.plan })}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = subscriptionStatus.plan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative w-full ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white text-xs">
                      {t("subscriptionManager.mostPopular")}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-base">{plan.name}</h3>
                        <div className="text-lg font-bold text-blue-600">
                          {plan.price}
                          <span className="text-xs text-gray-500">{t("subscriptionManager.pricePerMonth")}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isCurrentPlan || upgrading === plan.id}
                      onClick={() => handleUpgrade(plan.id)}
                      className="min-w-[80px]"
                    >
                      {upgrading === plan.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white me-1"></div>
                          <span className="text-xs">{t("subscriptionManager.loadingButton")}</span>
                        </div>
                      ) : isCurrentPlan ? (
                        t("subscriptionManager.currentPlanButton")
                      ) : (
                        (() => {
                          const buttonText = subscriptionStatus.subscribed
                            ? t("subscriptionManager.upgradeButton")
                            : t("subscriptionManager.subscribeButton");
                          return (
                            <>
                              <CreditCard className="h-3 w-3 me-1" />
                              {buttonText}
                            </>
                          );
                        })()
                      )}
                    </Button>
                  </div>

                  <ul className="space-y-1 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-3 w-3 text-green-500 me-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
