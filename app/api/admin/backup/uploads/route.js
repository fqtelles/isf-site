import { requireAdmin } from "../../../../../lib/auth";
import { join } from "path";
import { spawn } from "child_process";

export async function GET() {
  if (!(await requireAdmin())) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const uploadsDir = join(process.cwd(), "public", "uploads");
  const date = new Date().toISOString().split("T")[0];
  const filename = `uploads-backup-${date}.tar.gz`;

  const tar = spawn("tar", ["czf", "-", "-C", join(process.cwd(), "public"), "uploads"]);

  const stream = new ReadableStream({
    start(controller) {
      tar.stdout.on("data", chunk => controller.enqueue(chunk));
      tar.stdout.on("end", () => controller.close());
      tar.on("error", err => controller.error(err));
      tar.stderr.on("data", d => console.error("[backup]", d.toString()));
    },
    cancel() {
      tar.kill();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
