import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function Mail(to: string, code: string) {

    const error = await resend.emails.send({
        from: process.env.RESEND_FROM ?? 'MovieFinder <onboarding@resend.dev>',

        to,
        subject: "Your verification code",
        text: `
             <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
            <p>It is valid for 10 minutes.</p>\`,
        `,
        html: `
            <p>Your verification code:</p>
            <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
            <p>It is valid for 10 minutes.</p>`,
    })
    if (error) {
        console.error("Resend error:", error);   // выведет объект целиком
    }
}
