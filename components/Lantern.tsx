type Props = {
  lit?: boolean;
  size?: "sm" | "md";
};

export function Lantern({ lit = true, size = "sm" }: Props) {
  const dim = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  if (!lit) {
    return <span className={`${dim} rounded-full bg-foreground/30 inline-block`} />;
  }
  return (
    <span
      className={`${dim} rounded-full bg-flame inline-block shadow-[0_0_12px_2px_rgba(244,162,60,0.55)]`}
    />
  );
}
