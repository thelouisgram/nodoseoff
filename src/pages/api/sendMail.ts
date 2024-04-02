import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { RootState } from '../../../store';
import { DrugProps } from '../../../types/dashboard';
import { Info } from '../../../utils/store';
import { toast } from 'sonner';

/**
 * Function to send email reminders for pending doses.
 * @param {string} userId - User ID to send reminders to.
 * @param {Info[]} info - Information about the user.
 * @param {DrugProps} dose - Dose item to send reminder for.
 */
const sendEmailReminder = async (userId: string, info: Info[], dose: DrugProps) => {
    try {
        const { email } = info[0];
        const { drug, time } = dose;
        const date = new Date(); // Current date

        // Compose email content
        const mailContent = `Reminder for dose:\n- ${drug} on ${date.toDateString()} at ${time}\n`;

        // Create transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Setup email data
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: `Dose Reminder for ${time}`,
            text: mailContent
        };

        // Send email
        const report = await transporter.sendMail(mailOptions);
        toast.success('Reminder email sent successfully');
    } catch (error) {
        console.error('Error occurred while sending reminder email:', error);
        toast.error('Error occurred while sending reminder email');
    }
};

/**
 * React component to schedule email reminders for pending doses.
 * Fetches user information and schedule from Redux store and schedules
 * cron job to send email reminders based on the schedule from start to end date.
 */
const ScheduleReminders = () => {
    const { userId, drugs, info } = useSelector((state: RootState) => state.app);

    useEffect(() => {
        drugs.forEach(dose => {
            const { frequency, start, end, time } = dose;

            // Calculate the interval between doses based on frequency
            const interval = parseFrequency(frequency);

            // Parse start and end dates
            const startDate = new Date(start);
            const endDate = new Date(end);

            // Schedule reminders from start to end date
            const task = cron.schedule('* * * * *', () => {
                // Send reminder for the current dose
                sendEmailReminder(userId, info, dose);

                // Move to the next occurrence of the dose
                startDate.setTime(startDate.getTime() + interval);

                // Check if we've reached the end date
                if (startDate > endDate) {
                    // Stop the cron job when we reach the end date
                    task.stop();
                }
            });
        });
    }, [userId, drugs, info]);

    return null; // or your JSX if needed
};

/**
 * Function to parse frequency string and return interval in milliseconds.
 * @param {string} frequency - Frequency string (e.g., 'QD', 'BID', 'W').
 * @returns {number} - Interval in milliseconds.
 */
const parseFrequency = (frequency: string): number => {
    switch (frequency) {
        case 'QD': // Once Daily
            return 24 * 60 * 60 * 1000;
        case 'BID': // Twice Daily
            return 12 * 60 * 60 * 1000;
        case 'TID': // Thrice Daily
            return 8 * 60 * 60 * 1000;
        case 'QID': // Four Times Daily
            return 6 * 60 * 60 * 1000;
        case 'EOD': // Every Other Day
            return 2 * 24 * 60 * 60 * 1000;
        case 'W': // Weekly
            return 7 * 24 * 60 * 60 * 1000;
        case 'BW': // Biweekly
            return 14 * 24 * 60 * 60 * 1000;
        case 'M': // Monthly
            // Assuming 30 days per month for simplicity
            return 30 * 24 * 60 * 60 * 1000;
        default:
            return 0; // Default to zero if frequency is not recognized
    }
};

export default ScheduleReminders;