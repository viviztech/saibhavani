# Sai Bhavani Tours & Travels

A Next.js website with a searchable travel catalogue, trip enquiries, and a password-protected administration area. A request is an enquiry for manual follow-up, not a booking or a payment. Business details and offerings must be verified before publication.

## Requirements

- Node.js 20.9 or later and npm.
- A MySQL 8-compatible database. Production database connections require TLS with certificate and hostname verification. A persistent MySQL service is required on Vercel; its serverless filesystem is not a database.
- A canonical HTTPS site URL in production and a trusted edge or WAF rate limit for enquiry and login endpoints.

## Local setup

1. Run `npm ci`.
2. Create a MySQL database and import `db/schema.sql` using your database provider's SQL console or a MySQL client.
3. Copy `.env.example` to `.env.local` and supply the database connection details. For local development, set `APP_URL=http://localhost:3000`. Set `DB_SSL=true` for a trusted TLS connection; set `DB_SSL_CA` to the CA PEM when the provider uses a private CA. Do not commit credentials. Production refuses a database connection without TLS.
4. Run `node scripts/bootstrap-admin.mjs` in an interactive terminal to create the first administrator. The password is entered without echo; no default account is created. The script refuses to run once users exist. Node 20.12+ supports loading `.env.local` directly in the script; on older supported Node versions export the variables in your shell first.
5. Run `npm run dev` and open `/admin`. Add only approved business details, offerings and content. Admin accounts can manage accounts and settings; staff can manage content and enquiries. Up to three accounts may be active, and at least one active administrator must remain.

The site works with an empty catalogue. Without a database, public catalogue and gallery pages show an unavailable state and enquiries cannot be submitted; no request is silently recorded. Configure a real database before launch.

For an existing database installed before page image support, run `db/migrations/001-page-image.sql` once using the database provider's SQL console. New installations include the column in `db/schema.sql`.

## Content and enquiries

The public site shows published catalogue, itinerary, gallery and testimonial records. Images are configured as URLs; use permitted HTTPS-hosted images or local paths. Page records with slugs `home`, `services`, `destinations`, `visitor-guide`, `about`, and `contact` can replace each page's introductory title and body and set its SEO title and description. The home hero and About journey image can also be changed using the page image URL. Other page sections keep their built-in copy. Catalogue entries have separate SEO fields. Publish only content approved for this business.

Trip requests are stored in MySQL, with an offering snapshot if one was selected. Staff can review enquiries, update status, add internal notes, delete enquiries and export CSV. No email or WhatsApp notification is sent automatically. The team must sign in to check requests. Contact and WhatsApp links appear only after their details are configured and validated.

## Vercel deployment

Import the GitHub repository as a Next.js project with the repository root as the root directory. Provision a compatible external MySQL database, import the schema, and configure the environment variables in Vercel. Set `APP_URL` to the canonical production HTTPS origin, including for mutations and the sitemap. Create the first administrator using the bootstrap script in an environment that can reach the production database, with production variables and TLS enabled. Then deploy and test the entire enquiry and admin flow. The canonical origin check means preview deployments need an appropriate `APP_URL` for their own origin and an isolated database; do not point public previews at production customer data.

If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured, analytics is optional and requires the visitor's consent. Obtain the client's analytics and Search Console access and agree the consent and privacy requirements before enabling it. Disable GA enhanced and automatic measurement in the property to prevent collection beyond the application's explicit page and enquiry events. The sitemap is generated only when `APP_URL` is configured; submit it in the client's Search Console account.

The application has a database-backed global enquiry limit and per-email login throttling. Configure trusted edge/IP rate limiting for both `/api/enquiries` and `/admin/action`, especially on Vercel; arbitrary client-supplied forwarding headers are not treated as verified identities. Enable HTTPS and protect database credentials in the hosting provider.

## Backups and maintenance

Arrange encrypted, automated MySQL backups with the database provider, including offsite retention and periodic restoration tests. Image URLs point to separately hosted files; include any owned image storage in backups. Apply `db/maintenance.sql` periodically to remove expired sessions and stale rate-limit/authentication records; it does not delete customer enquiries. Agree a customer-data retention and deletion policy with the business. The project does not schedule backups or cleanup itself. Review dependency updates, access, logs and backups regularly.

## Image credits

Illustrative photographs from Unsplash: [Jaikishan Patel](https://unsplash.com/photos/a-winding-road-winding-through-a-lush-green-hillside-oKpdcoE7ip8), [Sourav Dhar](https://unsplash.com/photos/an-aerial-view-of-the-ruins-of-a-city-2I9aLCmgI2w), [Vivek Kumar](https://unsplash.com/photos/tea-gardens-on-munnar-hills-JS_ohjocm00), [Sreehari Devadas](https://unsplash.com/photos/a-road-in-the-mountains-Y_5awA1CvGY), and [coast image](https://images.unsplash.com/photo-1628628942209-3281f7f84fe5). Images are illustrative and do not establish the client's service areas.
