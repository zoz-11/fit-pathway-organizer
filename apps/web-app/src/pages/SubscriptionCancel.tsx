import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl text-orange-700">
            Subscription Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            No worries! Your subscription process was cancelled and no charges
            were made.
          </p>
          <p className="text-sm text-gray-500">
            You can try again anytime or continue using FitPathway with our free
            features.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate("/")} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/?tab=subscription")}
              className="w-full"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCancel;
