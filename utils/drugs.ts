export const drugsTab: string[] =[
   "Ongoing", "Completed", "Allergies" 
]

export function calculateTimePeriod(startDate: Date, endDate: Date): string {
    const start: any = new Date(startDate);
    const end: any = new Date(endDate);
    const durationInDays = Math.floor(
      (end - start) / (1000 * 60 * 60 * 24)
    );
    const durationInYears = Math.floor(durationInDays / 365);
    const remainingDaysAfterYears = durationInDays % 365;

    const durationInMonths = Math.floor(remainingDaysAfterYears / 30);
    const remainingDaysAfterMonths = remainingDaysAfterYears % 30;

    const durationInWeeks = Math.floor(remainingDaysAfterMonths / 7);
    const remainingDaysAfterWeeks = remainingDaysAfterMonths % 7;

    const durationText: string[] = [];

    if (durationInYears > 0) {
      durationText.push(`${durationInYears} year${durationInYears > 1 ? "s" : ""}`);
    }

    if (durationInMonths > 0) {
      durationText.push(`${durationInMonths} month${durationInMonths > 1 ? "s" : ""}`);
    }

    if (durationInWeeks > 0) {
      durationText.push(`${durationInWeeks} week${durationInWeeks > 1 ? "s" : ""}`);
    }

    if (remainingDaysAfterWeeks > 0) {
      durationText.push(`${remainingDaysAfterWeeks} day${remainingDaysAfterWeeks > 1 ? "s" : ""}`);
    }

    return durationText.join(", ");
}
