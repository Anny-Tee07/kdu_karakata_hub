# KDU Karakata

A React and Vite campus marketplace. Supabase is the supported authentication and database provider. Without local Supabase configuration, the public catalogue runs in demo mode; authentication and shared seller persistence remain unavailable.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check the project:

```sh
npm run lint
npm run build
```

## Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com/) and keep its database password in your password manager.
2. Copy `.env.example` to `.env.local`. In Supabase **Project Settings → API**, copy the **Project URL** and the public **anon/publishable key** into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. These are browser-client configuration values. **Never put the `service_role` key or database password in Vite variables or frontend code.** `.env.local` is ignored by Git.
3. Apply the schema and initial 100 demo listings using the Supabase CLI:

   ```sh
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

   The migrations under `supabase/migrations/` create the tables, triggers, row-level security policies, exact KDU locations, categories, and demo listings. To regenerate the catalog seed migration from the checked-in local listing data, run `node scripts/generate-demo-seed.mjs` before applying migrations.
4. In Supabase **Authentication → URL Configuration**, set the Site URL to your local development origin (usually `http://localhost:5173`) and add the deployed website origin to the allowed redirect URLs. Configure SMTP/email delivery before requiring email confirmation in production.
5. Restart `npm run dev` after editing `.env.local`. Sign-up and sign-in use email and password; Supabase stores credentials and persists/refreshes the session. `karakata_admin` is a reserved username and public sign-up cannot claim it or assign roles.

## Provision the first administrator

An administrator has **not** been provisioned in this repository. After creating the Supabase project, provide the real email address to invite; do not put it in source control. In Supabase **Authentication → Users**, invite that email. The invitee sets a unique password through the provider's email flow (use a password manager to generate and save it). Then, in the Supabase SQL Editor, replace the email placeholder with that exact address and run:

```sql
update public.profiles as p
set username = 'karakata_admin',
    role = 'admin'
from auth.users as u
where p.id = u.id
  and lower(u.email) = lower('REPLACE_WITH_THE_REAL_ADMIN_EMAIL')
returning p.username, p.role;
```

Confirm that exactly one row returns `karakata_admin | admin`. The SQL Editor is privileged; never expose its credentials or a service-role key in the frontend. Supabase Auth sign-in accepts the **email address**, not this username. The username is the account's display handle. Login URL: `/signin` (for local development: `http://localhost:5173/signin`).

The dashboard route is `/admin`. The frontend checks the fetched profile for navigation, but every privileged data operation is separately enforced by database RLS. Public sign-up always creates a buyer profile; the database trigger ignores role metadata and blocks users from claiming the reserved admin username or changing their own role/suspension state.

## Explore the marketplace

- Search the product name, description, category, or seller display name from the home page or navigation bar.
- Browse all 100 distinct demonstration listings, filter by category, one of the approved KDU locations, and maximum price, and sort by newest or price. When Supabase is configured, the catalogue and options load from the database.
- The home page shows 8 listings and links to the complete catalogue. Location tiles open the catalogue with that location selected.
- Open Quick view or a listing detail route to review the available information. A WhatsApp action appears only when a seller has supplied a number; the seeded demo records do not include real contact numbers.
- Save a listing with the heart button. Saved listing IDs are stored in this browser's local storage.
- Without Supabase, the Vendor Hub creates only browser-local previews. With Supabase configured, it requires a signed-in account and saves to the database; row-level policies restrict editing to the owner or an administrator.

The original catalog had 16 unique listings. Eighty-four distinct, clearly labeled demonstration listings have been added, for a total of exactly 100 seeded items. Product examples, seller display names, prices, and assigned locations are demo data, not live inventory, verified sellers, or confirmed vendor addresses. Location options are Abebi, Jayieola, Bolanle, Subomi Balogun, New Boys Hostel, KDU Cafe Shop 1 through KDU Cafe Shop 10, and Cafeteria.

## Remaining service setup

Supabase features cannot work until you create and configure the project, apply migrations, configure email delivery/redirects, and provision the first administrator as described above. This repository cannot verify live sessions or RLS behavior without that project. The demo sellers have no real contact details. Image upload storage, checkout, orders, and payments are not implemented; listing images are optional HTTPS URLs, and transactions remain direct between users.
