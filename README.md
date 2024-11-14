# Media Gallery & Editor

A modern web application for managing and editing media files with custom text overlays. Built with Next.js 15, Tailwind CSS, Drizzle ORM, and ImageKit.

## Features

- 🖼️ Media Gallery Management
- 🔠 Custom Text Overlays
- 🎬 Support for Images and Videos
- 📝 In-place Media Editing
- 💾 Download Edited Media
- 🔐 User Authentication
- 📱 Responsive Design

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Media Processing**: [ImageKit](https://imagekit.io/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [custom auth using leerob' starter-kit](https://github.com/leerob/next-saas-starter)
- **Database**: PostgreSQL

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- PostgreSQL database
- ImageKit account and credentials

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
POSTGRES_URL="postgresql://user:password@localhost:5432/dbname"

#stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
BASE_URL=
AUTH_SECRET=

# ImageKit
NEXT_PUBLIC_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
NEXT_PUBLIC_PUBLIC_KEY="your_public_key"
PRIVATE_KEY="your_private_key"

```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yuyaYS/saas-test
cd saas-test
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
pnpm db:push
```

4. Run the development server:
```bash
pnpm dev
```

## Acknowledgments

- [ImageKit Documentation](https://docs.imagekit.io/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)


Let me know if you need any specific section expanded or have additional features to document!
