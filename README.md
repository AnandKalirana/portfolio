This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Admin dashboard

Content (projects, experience, skills) is stored in Neon and edited at `/admin`.

Environment variables (see `.env.example`): `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.

1. `node scripts/hash-password.mjs "your-long-password"` and copy the printed hash.
2. Set the variables in `.env.local` (use the escaped hash there) and in Vercel (use the plain hash).
3. Open `/admin/login`. Five wrong attempts per IP lock sign-in for 15 minutes.

### File uploads (portrait, resume, project images)

Files live in a public Neon Object Storage bucket (`portfolio-public`) and are managed at `/admin/files` and in the project forms. Set `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY_ID` and `STORAGE_SECRET_ACCESS_KEY` (see `.env.example`). Uploads are limited to 3.5 MB, and the file type is checked from the file contents. The hero's resume button points at `/api/resume`, which serves the uploaded PDF as a download.
