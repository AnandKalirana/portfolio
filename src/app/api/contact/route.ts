const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  botcheck?: unknown;
};

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error("WEB3FORMS_ACCESS_KEY is not set");
    return Response.json(
      { ok: false, error: "Contact form is not configured." },
      { status: 500 }
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (clean(body.botcheck, 10)) {
    return Response.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 150);
  const message = clean(body.message, 5000);

  if (!name || !EMAIL_RE.test(email) || !subject || message.length < 10) {
    return Response.json(
      { ok: false, error: "Please fill in all fields correctly." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: "Portfolio Contact Form",
        subject: `[Portfolio] ${subject}`,
        name,
        email, // visitor's address, so replying goes straight to them
        message,
      }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    if (!res.ok || !data?.success) {
      console.error("Web3Forms rejected the submission", res.status, data);
      return Response.json(
        { ok: false, error: "Could not send message." },
        { status: 502 }
      );
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Web3Forms request failed", err);
    return Response.json({ ok: false, error: "Could not send message." }, { status: 502 });
  }
}
