import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface SecurityAlertProps {
  level: "info" | "warning" | "error";
  message: string;
  title?: string;
}

export const SecurityAlert: React.FC<SecurityAlertProps> = ({
  level,
  message,
  title,
}) => {
  const getAlertStyles = () => {
    switch (level) {
      case "info":
        return "border-blue-200 bg-blue-50 text-blue-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "error":
        return "border-red-200 bg-red-50 text-red-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  const getIcon = () => {
    switch (level) {
      case "info":
        return <Shield className="h-4 w-4" />;
      case "warning":
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Alert className={getAlertStyles()}>
      {getIcon()}
      {title && <div className="font-semibold">{title}</div>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;
