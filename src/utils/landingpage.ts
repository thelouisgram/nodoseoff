export { landingNavLinks as links } from "@/utils/landing-nav";

export const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
