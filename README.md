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

- **Framework**: [Next.js 15](https://nextjs.org/)🎬 Support for Images and Videos
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 🎬 Support for Images and Videostailwindcss.com/
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Media Processing**: [ImageKit](https://imagekit.io/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [custom auth using leerob' starter-kit](https://github.com/leerob/next-saas-starter)
- **Database**: PostgreSQL hosting on [Supabase](https://supabase.com/)
- **Rate Limit** [Upstash](https://upstash.com/)

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

#upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
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

# upcoming feacture
- [ ] image collage
- [ ] paywall for certain feacture
- [ ] Sentry logging

# メディアギャラリー＆エディター

カスタムテキストオーバーレイを使用してメディアファイルを管理・編集する最新のウェブアプリケーションです。Next.js 15、Tailwind CSS、Drizzle ORM、ImageKitを使用して構築されています。

## 機能

- 🖼️ メディアギャラリー管理
- 🔠 カスタムテキストオーバーレイ
- 🎬 画像と動画のサポート
- 📝 その場でのメディア編集
- 💾 編集したメディアのダウンロード
- 🔐 ユーザー認証
- 📱 レスポンシブデザイン

## 技術スタック

- **フレームワーク**: [Next.js 15](https://nextjs.org/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **データベースORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **メディア処理**: [ImageKit](https://imagekit.io/)
- **UIコンポーネント**: [shadcn/ui](https://ui.shadcn.com/)
- **認証**: [leerobのstarter-kitを使用したカスタム認証](https://github.com/leerob/next-saas-starter)
- **データベース**: [Supabase](https://supabase.com/)でホスティングされたPostgreSQL
- **レート制限**: [Upstash](https://upstash.com/)

## 前提条件

開始する前に、以下を確認してください：
- Node.js 18+がインストールされていること
- PostgreSQLデータベース
- ImageKitアカウントと認証情報

## 環境変数

ルートディレクトリに`.env.local`ファイルを作成し、以下の内容を記入してください：

```env
# データベース
POSTGRES_URL="postgresql://user:password@localhost:5432/dbname"

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
BASE_URL=
AUTH_SECRET=

# ImageKit
NEXT_PUBLIC_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id"
NEXT_PUBLIC_PUBLIC_KEY="your_public_key"
PRIVATE_KEY="your_private_key"

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## インストール

1. リポジトリをクローンします：
```bash
git clone https://github.com/yuyaYS/saas-test
cd saas-test
```

2. 依存関係をインストールします：
```bash
pnpm install
```

3. データベースをセットアップします：
```bash
pnpm db:push
```

4. 開発サーバーを起動します：
```bash
pnpm dev
```

## 謝辞

- [ImageKitドキュメント](https://docs.imagekit.io/)
- [Drizzle ORMドキュメント](https://orm.drizzle.team/docs/overview)
- [Next.jsドキュメント](https://nextjs.org/docs)
- [Tailwind CSSドキュメント](https://tailwindcss.com/docs)
- [shadcn/uiコンポーネント](https://ui.shadcn.com/)

特定のセクションの拡張や追加の機能のドキュメント化が必要な場合は、お知らせください！
