import { Button } from "../ui/button";

const GoogleButton = ({ className, ...props }) => (
  <Button
    variant="outline"
    type="button"
    className={`flex items-center justify-center gap-2 ${className || ""}`}
    {...props}
  >
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M19.6 10.23c0-.82-.07-1.42-.23-2.05H10v3.83h5.48c-.15 1.05-.75 2.58-2.23 3.6l3.32 2.58c1.93-1.78 3.03-4.4 3.03-7.96z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.32-2.58c-.9.63-2.07 1-3.3 1-2.55 0-4.7-1.68-5.47-4.05l-3.41 2.62C2.75 17.58 6.07 20 10 20z"
        fill="#34A853"
      />
      <path
        d="M4.53 11.95c-.2-.6-.32-1.25-.32-1.95s.12-1.35.32-1.95l-3.41-2.62C.41 6.8 0 8.35 0 10s.41 3.2 1.12 4.57l3.41-2.62z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.98c1.88 0 3.14.81 3.86 1.48l2.9-2.83C14.96.88 12.7 0 10 0 6.07 0 2.75 2.42 1.12 5.43l3.41 2.62c.77-2.37 2.92-4.07 5.47-4.07z"
        fill="#EA4335"
      />
    </svg>
    Login with Google
  </Button>
);

export default GoogleButton;