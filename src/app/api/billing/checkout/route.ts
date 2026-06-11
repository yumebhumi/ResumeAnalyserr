import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { users } from "@/db/schema";
import { ensureUsersTableColumns } from "@/lib/db-schema";
import { getDb } from "@/lib/db";
import { getAppUrl, getDodoClient } from "@/lib/dodo";

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const db = getDb();
    await ensureUsersTableColumns();

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    const clerkProfile = await currentUser();
    const email =
      clerkProfile?.emailAddresses.find(
        (entry) => entry.id === clerkProfile.primaryEmailAddressId,
      )?.emailAddress ?? clerkProfile?.emailAddresses[0]?.emailAddress;

    const name =
      clerkProfile?.fullName ??
      clerkProfile?.firstName ??
      clerkProfile?.username ??
      undefined;

    if (!email) {
      return NextResponse.json(
        { error: "Could not resolve your account email." },
        { status: 400 },
      );
    }

    const user =
      existingUser ??
      (
        await db
          .insert(users)
          .values({
            clerkUserId,
            email,
          })
          .returning()
      )[0];

    if (user.plan === "pro") {
      return NextResponse.json(
        { error: "You are already on the Pro plan." },
        { status: 400 },
      );
    }

    const dodo = getDodoClient();
    const appUrl = getAppUrl(new URL(request.url).origin);
    const productId = process.env.DODO_PRO_PRODUCT_ID;

    if (!productId) {
      return NextResponse.json(
        { error: "Pro product is not configured in Dodo Payments." },
        { status: 500 },
      );
    }

    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email,
        name,
      },
      metadata: {
        clerkUserId,
        internalUserId: user.id,
        plan: "pro",
      },
      return_url: `${appUrl}/pricing?status=return`,
      cancel_url: `${appUrl}/pricing?status=cancelled`,
      feature_flags: {
        allow_discount_code: true,
      },
    });

    if (!session.checkout_url) {
      return NextResponse.json(
        { error: "Dodo checkout URL was not returned." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      sessionId: session.session_id,
      checkoutUrl: session.checkout_url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create checkout session.";

    if (/Dodo Payments API key is not configured|Pro product is not configured/i.test(message)) {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Could not create the Dodo checkout session." },
      { status: 502 },
    );
  }
}
