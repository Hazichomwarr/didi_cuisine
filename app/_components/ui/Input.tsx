// components/ui/Input.tsx
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  inputError?: string;
};

export function Input({ inputError, error, className, ...props }: InputProps) {
  return (
    <div>
    <input
      className={clsx(
        "ui-input focus:ui-input-focus disabled:ui-input-disabled",
        error && "border-red-500 ring-red-500",
        className
      )}
      {...props}
    />
    {inputError && <p className="text-red-600 ml-2">{inputError}</p>}
    </div>
  );
}
