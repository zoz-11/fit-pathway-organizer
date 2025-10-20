import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const SubscriptionSuccess = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    toast.success(t("subscriptionSuccess.toast.success"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            {t("subscriptionSuccess.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {t("subscriptionSuccess.message")}
          </p>
          <p className="text-sm text-gray-500">
            {t("subscriptionSuccess.info")}
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="h-4 w-4 me-2" />
            {t("subscriptionSuccess.dashboardButton")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
