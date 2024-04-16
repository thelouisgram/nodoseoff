export const links = [
  { title: "Home", id: "home" },
  { title: "Features", id: "features" },
  { title: "How it works", id: "steps" },
  { title: "Tips", id: "tips" },
];

export const steps = [
  {
    title: "Create an Account",
    desc: "Creating an account is the first step to ensuring absolute drug compliance, granting access to vital tools for managing medication.",
  },{
    title: "Add and Track Medication",
    desc: "Input your prescribed medications into the app, including dosage, frequency, and start/end dates.",
  },{
    title: "Add Allergies and Side Effects",
    desc: "Incorporate allergies and side effects for a thorough medication profile.",
  },{
    title: "Monitoring and Reporting",
    desc: "The app tracks users' medication adherence over time, providing insights into their compliance behavior.",
  },
];

export const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
};
