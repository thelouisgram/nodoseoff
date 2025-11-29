//  async function updateCompleted(item: ScheduleItem) {
//     if (!user) {
//       toast.error("Authentication required to update dose.");
//       return;
//     }

//     try {
//       const updatedSchedule = schedule.map((dose) => {
//         if (
//           dose.date === item.date &&
//           dose.time === item.time &&
//           dose.drug === item.drug
//         ) {
//           return {
//             ...dose,
//             completed: !dose.completed,
//           };
//         }
//         return dose;
//       });

//       dispatch(updateSchedule(updatedSchedule));
//       await uploadScheduleToServer({
//         userId: user.id,
//         schedule: updatedSchedule,
//       });
//     } catch (error) {
//       toast.error(
//         "Failed to update dose. Please check your network connection."
//       );
//       // Rollback logic...
//       const previousSchedule = schedule.map((dose) => {
//         if (
//           dose.date === item.date &&
//           dose.time === item.time &&
//           dose.drug === item.drug
//         ) {
//           return { ...dose, completed: !dose.completed };
//         }
//         return dose;
//       });
//       dispatch(updateSchedule(previousSchedule));
//     }
//   }

 
