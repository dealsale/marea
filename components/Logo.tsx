/* Brand logo — uses the real Marea Tours artwork (public/logo*.png). */

export function LogoMark({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo-mark.png" alt="Marea Tours" className={className} />;
}

export function LogoFull({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="Marea Tours" className={className} />;
}

export function Logo({ withText = true, className = "" }: { withText?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-10 w-auto" />
      {withText && (
        <span className="font-display text-xl font-semibold tracking-wide text-gradient">
          MAREA <span className="font-sans text-sm tracking-[0.3em] text-marea-300">TOURS</span>
        </span>
      )}
    </div>
  );
}
