
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border",
        sizeClasses[size]
      )}>
        <div className="h-full w-full rounded-full bg-background"></div>
      </div>
    </div>
  );
};
