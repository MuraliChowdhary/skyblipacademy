import { getCourse } from "@/src/backend/courses/getCouse";
import { withApiHandler } from "@/src/lib/api-handler";
import { AppError } from "@/src/lib/errors";

type Params = { courseId: string };

export const GET = withApiHandler<Params>(async(req,{ params }) =>{

    const {courseId} = await params;
    const course = await getCourse(courseId);

    if(!course){
        throw new AppError("NOT_FOUND","Course not found",404);
    }
    
    return course;
})