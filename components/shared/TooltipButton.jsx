import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UIButton from "./UIButton";

export function TooltipButton({
  icon,
  text,
  onClick,
  className = "",
  ...props
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <UIButton
          onClick={onClick}
          className={`rounded-full ${className}`}
          {...props}
        >
          {icon}
        </UIButton>
      </TooltipTrigger>

      <TooltipContent side="top">
        <p className="text-xs">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
