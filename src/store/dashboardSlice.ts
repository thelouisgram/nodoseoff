import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DrugProps, ScheduleItem } from "../types/dashboard";
import { Info } from "../utils/store";
import { fetchData } from "../utils/fetchData";

export interface DashboardData {
    userInfo: Info[];
    profilePicture: string;
    allergies: DrugProps[];
    herbs: string;
    otcDrugs: string;
    schedule: ScheduleItem[];
    activeDrugs: DrugProps[];
    expiredDrugs: any[];
    updatedCompletedList: DrugProps[];
}

export interface DashboardState {
    data: DashboardData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DashboardState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (userId: string) => {
        const data = await fetchData(userId);
        return data as DashboardData;
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDashboardData: (state, action: PayloadAction<DashboardData>) => {
            state.data = action.payload;
        },
        updateDashboardCache: (state, action: PayloadAction<Partial<DashboardData>>) => {
            if (state.data) {
                state.data = { ...state.data, ...action.payload };
            }
        },
        clearDashboardData: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch dashboard data';
            });
    },
});

export const { setDashboardData, updateDashboardCache, clearDashboardData } = dashboardSlice.actions;

export default dashboardSlice.reducer;
