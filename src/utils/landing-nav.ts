/** Primary marketing nav — dedicated pages, not homepage hashes. */
export const landingNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/amanda", label: "AMANDA 6" },
  { href: "/who-its-for", label: "Who it’s for" },
  { href: "/about", label: "About" },
] as const;

export const landingProductLinks = [
  ...landingNavLinks,
  { href: "/#how-it-works", label: "How it works" },
] as const;
