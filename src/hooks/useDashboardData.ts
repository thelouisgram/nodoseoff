import { useEffect } from "react";
import { cleanUpDatabase, fetchData } from "../utils/fetchData";
import { Appointment, DrugProps, ScheduleItem } from "../types/dashboard";
import { apiJson } from "@/lib/api-client";
import { generateDrugId } from "@/utils/drugs";
import { generateSchedule } from "../utils/dashboard/dashboard";
import { uploadScheduleToServer, removePastDoses } from "../utils/dashboard/schedule";
import { sendMail } from "../utils/sendEmail";
import { generateDrugAddedEmail } from "@/emails/newDrug";
import { generateDrugAllergyEmail } from "@/emails/drugAllergy";
import { useAppDispatch, useAppSelector, store } from "@/store";
import { fetchDashboardData, updateDashboardCache } from "@/store/dashboardSlice";

async function runMutation(action: string, payload: object) {
  return apiJson("/api/data/mutations", {
    method: "POST",
    json: { action, payload },
  });
}

/** Owns fetch + expired-drug cleanup. Call once from the dashboard page. */
export const useDashboardBootstrap = (userId: string | undefined) => {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.dashboard);
  const authLoading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    if (userId && !authLoading && status === "idle") {
      dispatch(fetchDashboardData(userId));
    }
  }, [userId, authLoading, status, dispatch]);

  useEffect(() => {
    if (!data || !userId || data.expiredDrugs.length === 0) return;
    let cancelled = false;
    (async () => {
      await cleanUpDatabase(userId, data.updatedCompletedList, data.expiredDrugs);
      if (cancelled) return;
      dispatch(updateDashboardCache({ expiredDrugs: [] }));
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, data?.expiredDrugs, data?.updatedCompletedList, dispatch]);

  return {
    data,
    isLoading: status === "loading" || status === "idle",
    error,
    isError: status === "failed",
    refetch: () => (userId ? dispatch(fetchDashboardData(userId)) : undefined),
  };
};

/** @deprecated Prefer useDashboardBootstrap once at the page root; selectors below. */
export const useDashboardData = (userId: string | undefined) =>
  useDashboardBootstrap(userId);

function useDashboardSlice() {
  return useAppSelector((state) => state.dashboard);
}

export const useDrugs = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.activeDrugs || [],
    isLoading: status === "loading",
  };
};

export const useSchedule = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.schedule || [],
    isLoading: status === "loading",
  };
};

export const useUserInfo = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.userInfo || [],
    isLoading: status === "loading",
  };
};

export const useAllergies = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.allergies || [],
    isLoading: status === "loading",
  };
};

export const useHerbs = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.herbs || "",
    isLoading: status === "loading",
  };
};

export const useOtcDrugs = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.otcDrugs || "",
    isLoading: status === "loading",
  };
};

export const useProfilePicture = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.profilePicture || "",
    isLoading: status === "loading",
  };
};

export const useAppointment = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: (data?.appointment ?? null) as Appointment | null,
    isLoading: status === "loading",
  };
};

export const useCompletedDrugs = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.updatedCompletedList || [],
    isLoading: status === "loading",
  };
};

export const useUserTheme = (_userId?: string | undefined) => {
  const { data, status } = useDashboardSlice();
  return {
    data: data?.userInfo?.[0]?.theme ?? null,
    isLoading: status === "loading",
  };
};

interface AddDrugParams {
  userId: string;
  drug: string;
  frequency: string;
  route: string;
  start: string;
  end: string;
  time: string[];
  reminder: boolean;
  userInfo: { name: string; email: string };
}

export const useAddDrugMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: AddDrugParams) => {
      const drugId = generateDrugId(params.drug);
      await runMutation("insertDrug", { ...params, drugId });

      const currentData = store.getState().dashboard.data;
      const currentSchedule = currentData?.schedule || [];
      const newScheduleItems = generateSchedule({ ...params, drugId });
      const updatedSchedule = [...currentSchedule, ...newScheduleItems];

      await uploadScheduleToServer({ userId: params.userId, schedule: updatedSchedule });

      if (params.userInfo.email) {
        const { html, subject } = generateDrugAddedEmail(
          params.userInfo.name,
          params.drug,
          params.start,
          params.end,
          params.route,
          params.time
        );
        await sendMail(params.userInfo.email, html, subject);
      }

      dispatch(
        updateDashboardCache({
          activeDrugs: [
            ...(currentData?.activeDrugs || []),
            {
              drug: params.drug,
              frequency: params.frequency,
              route: params.route,
              start: params.start,
              end: params.end,
              time: params.time,
              reminder: params.reminder,
              drugId,
            },
          ],
          schedule: updatedSchedule,
        })
      );

      return { ...params, drugId, updatedSchedule };
    },
  };
};

interface UpdateDrugParams {
  userId: string;
  activeDrug: string;
  activeDrugId: string;
  drug: string;
  frequency: string;
  route: string;
  start: string;
  end: string;
  time: string[];
  reminder: boolean;
  todayDate: string;
}

export const useUpdateDrugMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: UpdateDrugParams) => {
      await runMutation("updateDrug", params);

      const currentData = store.getState().dashboard.data;
      const currentSchedule = currentData?.schedule || [];

      const completedTimesToday = currentSchedule
        .filter(
          (s) =>
            s.drugId === params.activeDrugId &&
            s.date === params.todayDate &&
            s.completed
        )
        .map((s) => s.time);

      const strippedSchedule = removePastDoses({
        activeDrugId: params.activeDrugId,
        schedule: currentSchedule,
      });

      const newDoses = generateSchedule({
        ...params,
        drugId: params.activeDrugId,
        start: params.todayDate,
      });

      const scheduleWithPreservedStatus = newDoses.map((dose) => {
        if (
          dose.date === params.todayDate &&
          completedTimesToday.includes(dose.time)
        ) {
          return { ...dose, completed: true };
        }
        return dose;
      });

      const updatedSchedule = [...strippedSchedule, ...scheduleWithPreservedStatus];

      await uploadScheduleToServer({
        userId: params.userId,
        schedule: updatedSchedule,
      });

      dispatch(
        updateDashboardCache({
          activeDrugs: (currentData?.activeDrugs || []).map((drug) =>
            drug.drug === params.activeDrug
              ? {
                  ...drug,
                  drug: params.drug,
                  frequency: params.frequency,
                  route: params.route,
                  start: params.start,
                  end: params.end,
                  time: params.time,
                  reminder: params.reminder,
                }
              : drug
          ),
          schedule: updatedSchedule,
        })
      );

      return { ...params, updatedSchedule };
    },
  };
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface DeleteDrugParams {
  userId: string;
  drug: string;
}

export const useDeleteDrugMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: DeleteDrugParams) => {
      await runMutation("deleteDrug", params);

      const currentData = store.getState().dashboard.data;
      const currentSchedule = currentData?.schedule || [];
      const today = getTodayDate();
      const updatedSchedule = currentSchedule.filter(
        (s) => s.drug !== params.drug || s.date < today
      );

      await uploadScheduleToServer({
        userId: params.userId,
        schedule: updatedSchedule,
      });

      dispatch(
        updateDashboardCache({
          activeDrugs: (currentData?.activeDrugs || []).filter(
            (drug) => drug.drug !== params.drug
          ),
          schedule: updatedSchedule,
        })
      );

      return { ...params, updatedSchedule };
    },
  };
};

interface DeleteCompletedDrugParams {
  userId: string;
  drug: string;
}

export const useDeleteCompletedDrugMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: DeleteCompletedDrugParams) => {
      const currentData = store.getState().dashboard.data;
      const updatedCompleted = (currentData?.updatedCompletedList || []).filter(
        (d) => d.drug !== params.drug
      );

      await runMutation("updateCompletedDrugs", {
        completedDrugs: updatedCompleted,
      });

      dispatch(
        updateDashboardCache({
          updatedCompletedList: updatedCompleted,
        })
      );

      return params;
    },
  };
};

interface AddAllergyParams {
  userId: string;
  drug: string;
  userInfo?: { name: string; email: string };
}

export const useAddAllergyMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: AddAllergyParams) => {
      const drugId = generateDrugId(params.drug);
      await runMutation("insertAllergy", {
        drug: params.drug,
        drugId,
        frequency: "",
        route: "",
        start: "",
        end: "",
        time: [""],
        reminder: true,
      });

      if (params.userInfo?.email) {
        const { html, subject } = generateDrugAllergyEmail(
          params.userInfo.name,
          params.drug
        );
        await sendMail(params.userInfo.email, html, subject);
      }

      const currentData = store.getState().dashboard.data;
      dispatch(
        updateDashboardCache({
          allergies: [
            ...(currentData?.allergies || []),
            {
              drug: params.drug,
              frequency: "",
              route: "",
              start: "",
              end: "",
              time: [""],
              reminder: true,
              drugId,
            },
          ],
        })
      );

      return { ...params, drugId };
    },
  };
};

interface DeleteAllergyParams {
  userId: string;
  drug: string;
}

export const useDeleteAllergyMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: DeleteAllergyParams) => {
      await runMutation("deleteAllergy", params);
      const currentData = store.getState().dashboard.data;
      dispatch(
        updateDashboardCache({
          allergies: (currentData?.allergies || []).filter(
            (a) => a.drug !== params.drug
          ),
        })
      );
      return params;
    },
  };
};

interface MarkAsAllergyParams {
  userId: string;
  drug: string;
  tab: string;
  target: DrugProps;
  userInfo?: { name: string; email: string };
}

export const useMarkAsAllergyMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: MarkAsAllergyParams) => {
      const currentData = store.getState().dashboard.data;
      const currentSchedule = currentData?.schedule || [];
      const today = getTodayDate();
      let updatedSchedule = currentSchedule;
      let updatedCompleted = currentData?.updatedCompletedList || [];

      if (params.tab === "completed") {
        updatedCompleted = updatedCompleted.filter((d) => d.drug !== params.drug);
      }

      await runMutation("markAsAllergy", {
        tab: params.tab,
        drug: params.drug,
        target: params.target,
        updatedCompleted,
      });

      if (params.tab === "ongoing") {
        updatedSchedule = currentSchedule.filter(
          (s) => s.drug !== params.drug || s.date < today
        );
        await uploadScheduleToServer({
          userId: params.userId,
          schedule: updatedSchedule,
        });
      }

      if (params.userInfo?.email) {
        const { html, subject } = generateDrugAllergyEmail(
          params.userInfo.name,
          params.drug
        );
        await sendMail(params.userInfo.email, html, subject);
      }

      const newAllergyEntry: DrugProps = {
        drug: params.drug,
        frequency: params.target.frequency || "",
        route: params.target.route || "",
        start: params.target.start || "",
        end: params.target.end || "",
        time: params.target.time || [""],
        reminder: true,
        drugId: params.target.drugId,
      };

      if (params.tab === "ongoing") {
        dispatch(
          updateDashboardCache({
            activeDrugs: (currentData?.activeDrugs || []).filter(
              (d) => d.drug !== params.drug
            ),
            schedule: updatedSchedule,
            allergies: [...(currentData?.allergies || []), newAllergyEntry],
          })
        );
      } else {
        dispatch(
          updateDashboardCache({
            updatedCompletedList: updatedCompleted,
            allergies: [...(currentData?.allergies || []), newAllergyEntry],
          })
        );
      }

      return { ...params, updatedSchedule };
    },
  };
};

interface UpdateProfileParams {
  userId: string;
  name: string;
  phone: string;
}

export const useUpdateProfileMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: UpdateProfileParams) => {
      await runMutation("updateProfile", params);
      const currentData = store.getState().dashboard.data;
      dispatch(
        updateDashboardCache({
          userInfo: (currentData?.userInfo || []).map((info, index) =>
            index === 0 ? { ...info, name: params.name, phone: params.phone } : info
          ),
        })
      );
      return params;
    },
  };
};

interface UploadProfilePictureParams {
  userId: string;
  file: File;
  currentPicture: string;
}

export const useUploadProfilePictureMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: UploadProfilePictureParams) => {
      const arrayBuffer = await params.file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      const fileBase64 = btoa(binary);
      const result = await apiJson<{ profilePicture: string }>(
        "/api/data/mutations",
        {
          method: "POST",
          json: {
            action: "uploadProfilePicture",
            payload: {
              fileBase64,
              filename: params.file.name,
            },
          },
        }
      );

      dispatch(updateDashboardCache({ profilePicture: result.profilePicture }));
      return { ...params, newFileName: result.profilePicture };
    },
  };
};

interface UpdateDrugHistoryParams {
  userId: string;
  otcDrugs: string;
  herbs: string;
}

export const useUpdateDrugHistoryMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: UpdateDrugHistoryParams) => {
      await runMutation("updateDrugHistory", params);
      dispatch(
        updateDashboardCache({
          otcDrugs: params.otcDrugs,
          herbs: params.herbs,
        })
      );
      return params;
    },
  };
};

interface UpdateScheduleParams {
  userId: string;
  schedule: ScheduleItem[];
}

export const useUpdateScheduleMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: UpdateScheduleParams) => {
      await uploadScheduleToServer({
        userId: params.userId,
        schedule: params.schedule,
      });
      dispatch(updateDashboardCache({ schedule: params.schedule }));
      return params;
    },
  };
};

interface UpdateThemeParams {
  userId: string;
  theme: "light" | "dark";
}

export const useUpdateThemeMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: UpdateThemeParams) => {
      await runMutation("updateTheme", params);
      const currentData = store.getState().dashboard.data;
      dispatch(
        updateDashboardCache({
          userInfo: (currentData?.userInfo || []).map((info, index) =>
            index === 0 ? { ...info, theme: params.theme } : info
          ),
        })
      );
      return params;
    },
  };
};

interface UpsertAppointmentParams {
  userId: string;
  doctor: string;
  location: string;
  startsAt: string;
  notes: string;
}

export const useUpsertAppointmentMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async (params: UpsertAppointmentParams) => {
      const appointment: Appointment = {
        doctor: params.doctor.trim(),
        location: params.location.trim(),
        startsAt: params.startsAt,
        notes: params.notes.trim(),
      };
      await runMutation("upsertAppointment", appointment);
      dispatch(updateDashboardCache({ appointment }));
      return appointment;
    },
  };
};

export const useDeleteAppointmentMutation = () => {
  const dispatch = useAppDispatch();
  return {
    mutateAsync: async () => {
      await runMutation("deleteAppointment", {});
      dispatch(updateDashboardCache({ appointment: null }));
    },
  };
};
