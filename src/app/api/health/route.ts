import { checkDatabase } from "@/src/lib/database/health";



export async function GET() {
  const database = await checkDatabase();

  if (!database.ok) {
    return Response.json(
      {
        status: "unhealthy",
        database: "unavailable",
      },
      {
        status: 503,
      }
    );
  }

  return Response.json({
    status: "healthy",
    database: "connected",
  });
}