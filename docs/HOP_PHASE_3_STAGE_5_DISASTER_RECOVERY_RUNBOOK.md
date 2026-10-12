# House of Padmavati — Phase 3, Stage 5: Disaster Recovery Runbook

**Document ID:** `HOP-OPS-DR-001`  
**Classification:** Operational Security & Disaster Recovery Standard  
**Effective Date:** 2026-10-13  
**Author:** Principal Reliability Engineer & Production Operations Lead  
**Target Environment:** Production  
- **Canonical Website:** `https://houseofpadmavati.pages.dev`  
- **Hosting:** Cloudflare Pages (Project: `houseofpadmavati`)  
- **Database & Storage:** Supabase Production Project `kbvjmcnaaogkbnerjcoc` (AWS ap-south-1 Mumbai)  
- **Source Repository:** `HOP-github` (`main`)  

---

## 1. Incident Classification Matrix

| Severity | Definition | Examples | Maximum Target RTO (Recovery Time) | Maximum Target RPO (Data Loss) |
|---|---|---|---|---|
| **P1 — Critical** | Complete store outage, customer checkout failure, or database corruption. | Dropped database table, corrupted schema, site inaccessible, Razorpay webhook failure. | < 30 minutes | < 1 hour |
| **P2 — High** | Core content defacement, broken storefront media, or unauthorized admin mutation. | Overwritten homepage hero section, trashed hero film, erroneous policy terms published. | < 15 minutes | Zero (Revisions available) |
| **P3 — Moderate** | Editorial error, draft overwrite, or non-blocking catalog misconfiguration. | Accidental edit to Journal reflection, missing alt text, duplicate slug entry. | < 10 minutes | Zero (Revisions available) |

---

## 2. Emergency Contacts & Access Credentials

- **Primary Operator:** House of Padmavati Store Administrator  
- **Cloudflare Pages Dashboard:** Cloudflare Console -> Workers & Pages -> `houseofpadmavati`  
- **Supabase Production Dashboard:** `https://supabase.com/dashboard/project/kbvjmcnaaogkbnerjcoc`  
- **Local CLI Access Requirements:** Node.js v20+, Supabase CLI (`2.109.1+`), Cloudflare Wrangler (`4.x`).  

---

## 3. Recovery Procedure A — Editorial & Content Rollback

### 3.1 Scenario: Accidental Overwrite or Bad Publication of a Site Section
All 11 site sections maintain immutable revisions in `public.site_section_revisions`.

1. **Option 1: Rollback via Studio UI**
   - Navigate to `/studio/site-update`.
   - Select the affected page (Homepage, About, Customer Care, or Policies) and open the section editor.
   - Click **Revision History**.
   - Review historical snapshots and select the desired known-good revision.
   - Click **Restore This Version**, then click **Publish Section** to activate immediately.
2. **Option 2: Emergency Rollback via Supabase SQL**
   If Studio is unreachable, execute the following SQL in Supabase SQL Editor:
   ```sql
   -- 1. Identify previous healthy revision
   SELECT revision_number, change_summary, created_at, published_by
   FROM public.site_section_revisions
   WHERE section_key = 'home.hero'
   ORDER BY revision_number DESC
   LIMIT 5;

   -- 2. Restore section payload from chosen revision (e.g., revision #3)
   UPDATE public.site_sections
   SET
     published_payload = (
       SELECT payload
       FROM public.site_section_revisions
       WHERE section_key = 'home.hero' AND revision_number = 3
     ),
     draft_payload = (
       SELECT payload
       FROM public.site_section_revisions
       WHERE section_key = 'home.hero' AND revision_number = 3
     ),
     version = version + 1,
     updated_at = now(),
     published_at = now()
   WHERE key = 'home.hero';
   ```

### 3.2 Scenario: Accidental Overwrite or Deletion of a Journal Reflection
Journal reflections maintain immutable snapshots in `public.journal_article_revisions`.

1. **Option 1: Rollback via Studio Journal**
   - Navigate to `/studio/journal`.
   - Click **History** on the affected article.
   - Select the revision snapshot to inspect.
   - Click **Restore This Version**.
2. **Option 2: Rollback via Database RPC**
   ```sql
   -- Restore article by calling security definer RPC
   SELECT public.restore_journal_article_revision(
     'c08f4c28-9717-48f5-a337-b9f471df0c10'::uuid, -- Article UUID
     1 -- Revision Number
   );
   ```
3. **Option 3: Recovering an Archived Reflection**
   If an article was mistakenly archived:
   ```sql
   SELECT public.restore_journal_article('c08f4c28-9717-48f5-a337-b9f471df0c10'::uuid);
   ```

---

## 4. Recovery Procedure B — Media Catalog & Storage Recovery

### 4.1 Scenario: Trashed Media Asset Recovery
If a media asset was moved to Trash:
1. Open `/studio/media`.
2. Toggle status to **Trash**.
3. Locate the asset and click **Restore** (or click the asset card and select **Restore Asset** in the modal).
4. SQL alternative:
   ```sql
   SELECT public.restore_media_asset('6cf4ad41-2b10-4493-bdc2-6aa29c4ef35c'::uuid);
   ```

### 4.2 Scenario: Missing or Uncataloged Storage File
If an image or film exists in Supabase Storage (`product-images` or `HOP-films`) but is missing from the database catalog:
```sql
SELECT public.register_media_asset(
  p_bucket_id       => 'product-images',
  p_storage_path    => '1728472500000-fabric.jpg',
  p_public_url      => 'https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/product-images/1728472500000-fabric.jpg',
  p_file_name       => 'fabric.jpg',
  p_display_name    => 'Loom Fabric Texture',
  p_media_type      => 'image',
  p_mime_type       => 'image/jpeg',
  p_file_size_bytes => 269107,
  p_alt_text        => 'House of Padmavati loom fabric texture',
  p_category        => 'general'
);
```

---

## 5. Recovery Procedure C — Supabase Point-in-Time Recovery (PITR)

In the event of catastrophic database corruption or dropped tables:

1. **Initiating PITR in Supabase Console:**
   - Log into `https://supabase.com/dashboard/project/kbvjmcnaaogkbnerjcoc`.
   - Go to **Project Settings** -> **Database** -> **Backups**.
   - Under **Point in time recovery**, select the target timestamp prior to the incident.
   - Click **Restore database**. (Supabase performs an isolated clone/restore).
2. **Re-applying Migrations Post-Restore:**
   After PITR completes, sync schema from the authoritative repository:
   ```bash
   cd e:\HOP
   npx supabase db push --linked
   ```
3. **Verify Site Content Integrity:**
   - Run system diagnostics from Studio (`/studio/settings` -> **Resilience & Health**) or execute automated tests:
   ```bash
   npx vitest run
   npx playwright test src/__tests__/StudioRemediation.spec.ts --project=chromium
   ```

---

## 6. Recovery Procedure D — Frontend Rollback (Cloudflare Pages)

If a bad frontend release causes white-screen errors, routing failures, or rendering issues:

1. **Option 1: Instant Rollback via Cloudflare Dashboard (Fastest — < 60s)**
   - Open Cloudflare Console -> Workers & Pages -> `houseofpadmavati`.
   - View **Deployments**.
   - Locate the previous known-healthy deployment.
   - Click the three-dots menu -> **Rollback to this deployment**.
   - Traffic shifts instantaneously at Cloudflare edge nodes worldwide.
2. **Option 2: Redeploying Known Good Commit via Wrangler CLI**
   ```bash
   cd e:\HOP
   git checkout <KNOWN_STABLE_COMMIT_HASH>
   npm run build
   npx wrangler pages deploy dist --project-name=houseofpadmavati --branch=main
   ```

---

## 7. Post-Incident Verification Checklist

Immediately following any disaster recovery procedure, complete the following verification steps:

- [ ] **1. Public Availability:** `https://houseofpadmavati.pages.dev` returns HTTP 200 with complete SSR HTML.
- [ ] **2. Navigation & Catalog:** `/collections`, `/journal`, `/about`, and `/product/:id` load cleanly without 404s.
- [ ] **3. Cart & Checkout:** Add product to cart, verify flat ₹99 shipping calculation, and verify Razorpay checkout modal opens.
- [ ] **4. Studio Authentication:** Admin login at `/studio/login` succeeds with valid session tokens.
- [ ] **5. Section Integrity:** `/studio/site-update` loads all 11 sections; draft preview functions on `?studio_preview=true`.
- [ ] **6. Media Library:** Active catalog and Trash tabs load; usage check blocks deletion of active media.
- [ ] **7. Automated Health Audit:** Execute `npm run test:e2e` and verify 100% test pass.
- [ ] **8. Log Incident:** Document root cause, recovery action taken, and preventative improvements in `docs/`.
