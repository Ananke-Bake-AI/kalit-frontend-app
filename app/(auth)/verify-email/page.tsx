import { Button } from "@/components/button"
import { Container } from "@/components/container"
import { prisma } from "@/lib/prisma"
import s from "../auth.module.scss"
import clsx from "clsx"

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams
  let status: "success" | "error" = "error"
  let message = "Invalid verification link."

  if (token) {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      message = "Invalid or expired verification link."
    } else if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: verificationToken.identifier, token } },
      })
      message = "Verification link has expired. Please request a new one."
    } else {
      await prisma.user.update({
        where: { email: verificationToken.identifier },
        data: { emailVerified: new Date() },
      })
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: verificationToken.identifier, token } },
      })
      status = "success"
    }
  }

  return (
    <section className={s.page}>
      <Container>
        <div className={s.narrow}>
          <div className={clsx(s.card, s.cardCentered)}>
            {status === "success" ? (
              <>
                <h1 className={s.stateTitle}>Email verified</h1>
                <p className={s.stateTextSpaced}>
                  Your email has been verified. You can now use all features of Kalit.
                </p>
                <Button href="/dashboard">Go to dashboard</Button>
              </>
            ) : (
              <>
                <h1 className={s.stateTitle}>Verification failed</h1>
                <p className={s.stateTextSpaced}>{message}</p>
                <Button href="/login">Back to sign in</Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
