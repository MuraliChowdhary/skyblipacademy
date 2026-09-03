import { prisma } from "@/src/lib/prisma";


export async function getCourse(id : string){
    return prisma.course.findFirst({where:{id}});
}