// src/lib/api/lessons.ts
export type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface LessonDetail {
    id: string;
    title: string;
    contentStatus: "DRAFT" | "PUBLISHED";
    videoStatus: "NOT_RECORDED" | "EDITING" | "PUBLISHED";
    videoUrl: string | null;
    contentBody: string | null;
    progress: { status: LessonProgressStatus; videoPositionSeconds: number } | null;
}

// src/lib/api/lessons.ts

export async function getLesson(lessonId: string): Promise<LessonDetail> {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/lessons/${lessonId}`, {
        cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(
            json.error?.message ?? "Failed to fetch lesson"
        );
    }

    return json.data;
}

export async function updateLessonProgress(
    lessonId: string,
    body: { status?: LessonProgressStatus; videoPositionSeconds?: number }
) {
    const res = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error.message);
    return json.data;
}