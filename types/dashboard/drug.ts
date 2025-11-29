import { SetStateAction } from "react";

export interface DrugDetailsProps {
  activeView: string;
  setActiveView: React.Dispatch<SetStateAction<"details" | "list">>
  tab: string;
  setActiveModal: (value: string) => void;
  activeAction: string;
  setActiveAction: (value: string) => void;
  options: boolean;
  setOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DrugData {
  totalDoses: number;
  remainingDoses: number;
  missedDoses: number;
  compliance: number;
  completedDoses: number;
  pastDoses: number;
  completedPastDoses: number;
  missedPastDoses: number;
}

export interface ExtendedDrugData extends DrugData {
  scheduledTimestamps: Date[];
  completedTimestamps: Date[];
  missedTimestamps: Date[];
  remainingTimestamps: Date[];
}

export interface Detail {
  name: string;
  details: string | number;
  unit?: string;
}

export interface DrugsProps {
  screen: boolean;
  setAdd: React.Dispatch<React.SetStateAction<boolean>>;
  add: boolean;
  activeAction: string;
  setActiveAction: (value: string) => void;
  activeModal: string;
  setActiveModal: (value: string) => void;
}