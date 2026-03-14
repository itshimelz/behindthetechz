import { prisma } from "@/lib/prisma";

/**
 * Placeholder for notifying newsletter subscribers when a post is published.
 *
 * Currently just queries confirmed subscribers and logs. Will be wired to an
 * email provider (Resend, Postmark, etc.) in a future phase.
 */
export async function notifySubscribers(slug: string, title: string) {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: {
        confirmed: true,
        unsubscribedAt: null,
      },
      select: { email: true, token: true },
    });

    if (subscribers.length === 0) {
      console.log(
        JSON.stringify({
          event: "newsletter.notify.skipped",
          slug,
          reason: "no_active_subscribers",
        }),
      );
      return;
    }

    // TODO: Integrate email provider (Resend, Postmark, etc.)
    // For each subscriber, send an email with:
    //   - Post title and excerpt
    //   - Link to the post
    //   - Unsubscribe link: `/api/newsletter/unsubscribe?token=${subscriber.token}`

    console.log(
      JSON.stringify({
        event: "newsletter.notify.pending",
        slug,
        title,
        subscriberCount: subscribers.length,
        message: "Email sending not yet configured — subscribers queried but no emails sent",
      }),
    );
  } catch (error) {
    // Non-blocking: don't let notification failures break the publish flow
    console.error("[notifySubscribers]", error);
  }
}
