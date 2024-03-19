interface DrugProps {
  drug: string;
  end: string;
  frequency: string;
  reminder: boolean;
  route: string;
  start: string;
  time: string[];
}

export interface AllergicItemProps {
    drug: string
}

export interface ExtendedAllergicItemProps extends DrugProps {
}