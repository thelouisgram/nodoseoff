export const links = [
  { title: "Overview", id: "overview" },
  { title: "Features", id: "features" },
  { title: "AMANDA 6", id: "amanda" },
  { title: "How it works", id: "how-it-works" },
  { title: "Who it’s for", id: "who" },
];

export const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
