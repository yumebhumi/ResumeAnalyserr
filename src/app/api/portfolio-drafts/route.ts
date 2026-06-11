import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { savePortfolioDraft } from "@/features/portfolio/persist";

const sectionsSchema = z.object({
  name: z.string(),
  role: z.string(),
  about: z.string(),
  skills: z.array(z.string()),
  projects: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()),
  githubLink: z.string(),
  linkedinLink: z.string(),
  email: z.string(),
});

const requestSchema = z.object({
  draftId: z.string().uuid().optional().nullable(),
  template: z.enum(["minimal", "developer", "creative", "premium"]),
  sections: sectionsSchema,
});

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = requestSchema.parse(await request.json());
    const draftId = await savePortfolioDraft({
      clerkUserId,
      draftId: body.draftId,
      template: body.template,
      sections: body.sections,
    });

    return NextResponse.json({ draftId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save portfolio draft.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
