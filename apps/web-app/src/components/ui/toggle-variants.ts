import { cva, type VariantProps } from "class-variance-authority";

export const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-1.5",
        lg: "h-11 px-6 py-2.5",
        icon: "h-10 w-10 p-2",
        "sm-icon": "h-8 w-8 p-1.5",
        "lg-icon": "h-12 w-12 p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
