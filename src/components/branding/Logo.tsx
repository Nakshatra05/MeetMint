export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`font-black ${sizes[size]} flex items-center gap-1`}>
      <span className="inline-flex items-center justify-center w-10 h-10 bg-yellow brutal-border brutal-shadow-sm rounded-xl text-lg">
        M
      </span>
      <span className="inline-flex items-center justify-center w-10 h-10 bg-purple text-white brutal-border brutal-shadow-sm rounded-xl text-lg -ml-2">
        M
      </span>
      <span className="ml-2 tracking-tight">MeetMint</span>
    </div>
  );
}

export function Wordmark() {
  return (
    <div className="font-black text-sm uppercase tracking-widest text-black/60">
      MeetMint
    </div>
  );
}
