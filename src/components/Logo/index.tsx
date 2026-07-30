import logo from "../../assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" ;
  className?: string;
}

export function Logo({
  size = "md",
  className = "",
}: LogoProps) {

  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-24",
  };

  return (
    <img
      src={logo}
      alt="Care Home"
      className={`
        object-contain
        ${sizes[size]}
        ${className}
      `}
    />
  );
}