import Image from "next/image";

type Props = {
  className?: string;
  /** White mark for dark backgrounds (e.g. home hero) */
  onDark?: boolean;
};

/** Logomark with Disney-style alarm-clock vibrate. */
export default function LogoMarkAssemble({
  className = "size-14",
  onDark = false,
}: Props) {
  return (
    <span
      className={`ndo-logo-alarm relative inline-grid place-items-center ${
        onDark ? "ndo-logo-alarm--on-dark text-[#3dcfb6]" : "text-soft-primary"
      } ${className}`}
    >
      <span
        aria-hidden
        className="ndo-logo-alarm__buzz ndo-logo-alarm__buzz--l"
      />
      <span
        aria-hidden
        className="ndo-logo-alarm__buzz ndo-logo-alarm__buzz--r"
      />
      <Image
        src={onDark ? "/assets/logo/logo-white.png" : "/assets/logo/logo-blue.png"}
        alt=""
        width={72}
        height={72}
        priority
        className="ndo-logo-alarm__mark relative z-[1] size-full select-none object-contain"
      />
    </span>
  );
}
