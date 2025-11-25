import { Book, Calendar, Shield, BotMessageSquare, Shell, AlertCircle } from "lucide-react";

export const tips = [
  {
    title: "Follow Prescribed Dosage",
    desc: "Adhere to your prescription. Altering the dosage, either by increasing or decreasing it, can result in ineffective treatment or adverse effects.",
    bgColor: "rgb(241,236,254)",
    textColor: "#753FF6",
    icon: Shell,
  },
  {
    title: "Read Labels Carefully",
    desc: "Always read medication labels carefully. Note the dosage, frequency, special instructions (like taking with food), and warnings about side effects or interactions.",
    bgColor: "rgb(255,234,245)",
    textColor: "rgb(231,67,156)",
    icon: Book,
  },
  {
    title: "Store Medications Properly",
    desc: "Store medications in a cool, dry place away from heat and sunlight. Follow storage instructions on the label. Keep out of reach of children and pets.",
    bgColor: "rgb(204,240,254)",
    textColor: "rgb(13,96,216)",
    icon: Shield,
  },
  {
    title: "Communicate with Healthcare Providers",
    desc: "Keep your healthcare provider and pharmacist informed about all your medications, including over-the-counter drugs and supplements.",
    bgColor: "rgb(220,255,235)",
    textColor: "rgb(39,174,100)",
    icon: BotMessageSquare,
  },
  {
    title: "Keep Track of Expiration Dates",
    desc: "Regularly check medication expiration dates and discard any expired or unused ones. Expired medications can lose effectiveness or become harmful.",
    bgColor: "rgb(231,246,255)",
    textColor: "rgb(34,149,242)",
    icon: Calendar,
  },
  {
    title: "Report Allergies and Side Effects",
    desc: "Inform your healthcare provider of any allergies or side effects from medications promptly. Allergic reactions can vary and might need urgent medical attention.",
    bgColor: "rgb(239,244,245)",
    textColor: "rgb(0,0,0)",
    icon: AlertCircle,
  },
];
