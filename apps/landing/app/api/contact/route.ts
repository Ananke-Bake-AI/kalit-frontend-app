import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 })
    }

    // Use Resend if available, otherwise fallback to mailto-style logging
    const resendKey = process.env.RESEND_API_KEY

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: "Kalit Contact Form <noreply@kalit.ai>",
          to: ["contact@kalit.ai"],
          reply_to: email,
          subject: `[Kalit Contact] ${subject || "New message"} — from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="margin-bottom: 4px;">New contact form submission</h2>
              <p style="color: #666; margin-top: 0;">From kalit.ai/contact-us</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject || "—"}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          `
        })
      })

      if (!res.ok) {
        const err = await res.text()
        console.error("Resend error:", err)
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 })
      }
    } else {
      // Log to console if no email provider configured
      console.log("=== CONTACT FORM SUBMISSION ===")
      console.log(`Name: ${name}`)
      console.log(`Email: ${email}`)
      console.log(`Subject: ${subject}`)
      console.log(`Message: ${message}`)
      console.log("===============================")
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
