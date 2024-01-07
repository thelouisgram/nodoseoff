export const sectionDetails = [
  { key: "indications_and_usage", title: "Indications and Usage", startIndex: 3 },
  { key: "openfda.route", title: "Route", startIndex: 0 },
  { key: "adverse_reactions", title: "Adverse Reactions", startIndex: 2 },
  { key: "overdosage", title: "Overdosage", startIndex: 2 },
  { key: "dosage_and_administration", title: "Dosage and Administration", startIndex: 3 },
  { key: "contraindications", title: "Contraindications", startIndex: 2 },
  { key: "laboratory_tests", title: "Laboratory Tests", startIndex: 2 },
  { key: "drug_interactions", title: "Drug Interactions", startIndex: 2 },
  { key: "storage_and_handling", title: "Storage and Handling", startIndex: 2 },
  { key: "references", title: "References", startIndex: 1 },
  // Add more sections with respective keys, titles, and start indices as needed
];

import axios, { AxiosError } from 'axios';

export const searchDrug = async (searchedDrug: string) => {
  try {
    const response = await axios.get<any>(
      `https://api.fda.gov/drug/label.json?search=openfda.substance_name:${searchedDrug}`
    );
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Axios Error:', axiosError.message);
      console.error('Response data:', axiosError.response?.data);
      console.error('Status code:', axiosError.response?.status);
    } else {
      console.error('Error fetching data:', error);
    }
    throw new Error('Failed to fetch drug data');
  }
};
