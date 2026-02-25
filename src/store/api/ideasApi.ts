import { baseApi } from "./baseApi";
import type { IdeaFormValues } from "@/lib/validations/idea";

export interface UserProfile {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface UserProfileResponse {
    status: number;
    results: UserProfile;
}

export interface SwotAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}



export interface Step {
    task: string;
    status: string;
}

export interface AiAnalysis {
    swot: SwotAnalysis;
    competitors: string[];
    steps: Step[];
    market_gap: string;
    full_report_markdown: string;
    score: number;
}

export interface IdeaReport {
    id: number;
    score: number;
    ai_analysis?: AiAnalysis;
    steps?: Step[];
}

export interface Idea {
    id: number;
    title: string;
    created_at: string;
    score?: number;
    reports: IdeaReport[];
}

export interface IdeaDetailResponse extends Idea { }

export interface IdeasResponse {
    count: number;
    results: Idea[];
}

export interface ValidationItem {
    id: number;
    user: number;
    title: string;
    description: string;
    is_deleted: boolean;
    created_at: string;
    score: number;
}

export interface ValidationsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ValidationItem[];
}

export interface BusinessPlan {
    id: number;
    idea_id: number;
    title: string;
    description: string;
    created_at: string;
}

export interface BusinessPlansResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: BusinessPlan[];
}

export interface CreateIdeaResponse {
    id: number;
}

export interface BusinessPlanDetailResponse {
    id: number;
    title: string;
    description: string;
    executive_summary: string;
    market_analysis: string;
    competitor_positioning: string;
    target_audience: string;
    revenue_model: string;
    marketing_strategy: string;
    tech_architecture: string;
    roadmap: Array<{ focus: string; month: string }>;
    created_at: string;
}

export const ideasApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<UserProfileResponse, void>({
            query: () => "/users/my-profile/",
            providesTags: ["User"],
        }),
        getRecentIdeas: builder.query<IdeasResponse, void>({
            query: () => "/ideas/my-ideas/",
            providesTags: ["Idea"],
        }),
        getIdeaById: builder.query<IdeaDetailResponse, string>({
            query: (id) => `/ideas/my-ideas/${id}/`,
            providesTags: (_result, _error, id) => [{ type: "Idea", id }],
        }),
        createIdeaAnalysis: builder.mutation<CreateIdeaResponse, IdeaFormValues>({
            query: (data) => ({
                url: "/ideas/analyze-create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Idea"],
        }),
        getMyValidations: builder.query<ValidationsResponse, { page?: number; search?: string; ordering?: string }>(
            {
                query: ({ page = 1, search = "", ordering = "-created_at" }) => {
                    const params = new URLSearchParams();
                    params.set("page", String(page));
                    if (search) params.set("search", search);
                    if (ordering) params.set("ordering", ordering);
                    return `/ideas/my-ideas/?${params.toString()}`;
                },
                providesTags: ["Idea"],
            },
        ),
        deleteIdea: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/ideas/idea-delete/${id}/`,
                method: "PATCH",
                body: { is_deleted: true },
            }),
            invalidatesTags: ["Idea"],
        }),
        getBusinessPlans: builder.query<BusinessPlansResponse, { page?: number; search?: string; ordering?: string }>({
            query: ({ page = 1, search = "", ordering = "-created_at" }) => {
                const params = new URLSearchParams();
                params.set("page", String(page));
                if (search) params.set("search", search);
                if (ordering) params.set("ordering", ordering);
                return `/ideas/business-plans/?${params.toString()}`;
            },
            providesTags: ["Report"],
        }),
        updateReportSteps: builder.mutation<{ message: string }, { id: number | string, steps: any[] }>({
            query: (data) => ({
                url: `/ideas/update-report-steps/${data.id}/`,
                method: "PATCH",
                body: { steps: data.steps },
            }),
            invalidatesTags: ["Report", "Idea"],
        }),
        getBusinessPlanDetail: builder.query<BusinessPlanDetailResponse, string>({
            query: (id) => `/ideas/business-plan-detail/${id}/`,
            providesTags: (_result, _error, id) => [{ type: "Report", id }],
        }),
        deleteBusinessPlan: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/ideas/business-plans/${id}/delete/`,
                method: "PATCH",
            }),
            invalidatesTags: ["Report"],
        }),
        generateBusinessPlan: builder.mutation<{ message: string; business_plan_id: number }, string>({
            query: (id) => ({
                url: `/ideas/generate-business-plan/${id}/`,
                method: "POST",
            }),
            invalidatesTags: ["Report"],
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useGetRecentIdeasQuery,
    useGetIdeaByIdQuery,
    useCreateIdeaAnalysisMutation,
    useDeleteIdeaMutation,
    useGetMyValidationsQuery,
    useGetBusinessPlansQuery,
    useGetBusinessPlanDetailQuery,
    useDeleteBusinessPlanMutation,
    useGenerateBusinessPlanMutation,
    useUpdateReportStepsMutation,
} = ideasApi;
