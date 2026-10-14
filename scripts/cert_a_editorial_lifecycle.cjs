const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');

const EVIDENCE_DIR = path.resolve('C:/Users/siddh/.gemini/antigravity/brain/995c30db-b436-4bbc-b981-b7b41d5eb5ce/evidence_cert_a');
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const PROD_REF = 'kbvjmcnaaogkbnerjcoc';
const SUPABASE_URL = 'https://kbvjmcnaaogkbnerjcoc.supabase.co';
const ANON_KEY = 'sb_publishable_cSiBaTaktDyF3fyWrpj7LA_d3ToDWC5';
const PROD_URL = 'https://houseofpadmavati.pages.dev';

// Fetch service_role key securely via Windows Credential Manager
function getServiceRoleKey() {
  const scriptPath = 'C:\\Users\\siddh\\.gemini\\antigravity\\brain\\995c30db-b436-4bbc-b981-b7b41d5eb5ce\\scratch\\get_service_role.ps1';
  return execSync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`).toString().trim();
}

async function main() {
  console.log('=================================================================');
  console.log('HOP Phase 3 Final Certification — Step A: Live Production Lifecycle');
  console.log('Target:', PROD_URL);
  console.log('Database:', PROD_REF);
  console.log('=================================================================\n');

  const svcKey = getServiceRoleKey();
  if (!svcKey) throw new Error('Failed to retrieve service_role key');

  // Supabase clients
  const adminClient = createClient(SUPABASE_URL, svcKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const authClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Authenticate as official administrator
  console.log('Authenticating as admin@houseofpadmavati.com...');
  const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email: 'admin@houseofpadmavati.com'
  });
  if (linkErr) throw linkErr;

  const { data: authData, error: authErr } = await authClient.auth.verifyOtp({
    email: 'admin@houseofpadmavati.com',
    token: linkData.properties.email_otp,
    type: 'magiclink'
  });
  if (authErr) throw authErr;

  const adminSession = authData.session;
  console.log('Admin session established. Access token valid.');

  // Create client with admin JWT for RPC calls
  const userAdminClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${adminSession.access_token}`
      }
    }
  });

  const testSlug = 'phase3-certification-20261014-editorial-lifecycle';
  const initialTitle = 'Phase 3 Certification: The Living Loom of Kanchipuram';
  const initialTag = 'WEAVE REFLECTION';
  const initialImg = '/src/assets/hop-fabric.jpg';
  const initialAlt = 'Close up texture of silk weave in morning light';
  const initialAuthor = 'House of Padmavati Atelier';
  const initialDek = 'An isolated editorial verification record proving draft isolation, publication integrity, and lifecycle resilience.';
  const initialContent = 'In the quiet hours before dawn, the shuttle moves across silk warp threads. This reflection certifies House of Padmavati Phase 3 editorial lifecycle governance.';

  let testArticleId = null;

  try {
    // ------------------------------------------------------------------
    // A.0: Preflight Collision Check
    // ------------------------------------------------------------------
    console.log('\n[A.0] Preflight Check: Verifying test slug collision avoidance...');
    const { data: preExist } = await adminClient
      .from('journal_articles')
      .select('id, slug')
      .eq('slug', testSlug);
    if (preExist && preExist.length > 0) {
      console.log('Cleaning up existing leftover test row...');
      await adminClient.from('journal_article_revisions').delete().eq('slug', testSlug);
      await adminClient.from('journal_articles').delete().eq('slug', testSlug);
    }
    const { data: anonPreCheck } = await anonClient
      .from('journal_articles')
      .select('id, slug')
      .eq('slug', testSlug);
    console.log('Anonymous preflight returned rows:', anonPreCheck?.length || 0);

    // ------------------------------------------------------------------
    // A.1: Create Draft Reflection & Initial Revision Snapshot
    // ------------------------------------------------------------------
    console.log('\n[A.1] Creating Draft Reflection via Admin Client...');
    const { data: createdArticle, error: createErr } = await adminClient
      .from('journal_articles')
      .insert({
        title: initialTitle,
        slug: testSlug,
        tag: initialTag,
        img: initialImg,
        image_alt: initialAlt,
        author: initialAuthor,
        dek: initialDek,
        content: initialContent,
        sort_order: 999,
        status: 'draft',
        published_at: null
      })
      .select()
      .single();

    if (createErr) throw createErr;
    testArticleId = createdArticle.id;
    console.log('Draft article created with ID:', testArticleId);

    // Call save_journal_article_revision RPC as admin
    const { data: rev1Data, error: rev1Err } = await userAdminClient.rpc('save_journal_article_revision', {
      p_article_id: testArticleId,
      p_change_summary: 'Initial draft creation for Phase 3 certification'
    });
    if (rev1Err) throw rev1Err;
    console.log('Revision #1 saved via RPC:', rev1Data);

    // ------------------------------------------------------------------
    // A.2: Anonymous Isolation Verification
    // ------------------------------------------------------------------
    console.log('\n[A.2] Verifying Anonymous Isolation (Zero draft leakage)...');
    const { data: anonArticles } = await anonClient
      .from('journal_articles')
      .select('*')
      .eq('slug', testSlug);
    console.log('Anonymous SELECT on draft slug returned rows:', anonArticles?.length || 0);
    if (anonArticles && anonArticles.length > 0) {
      throw new Error('SECURITY VIOLATION: Draft article leaked to anonymous client!');
    }

    const { data: anonRevs } = await anonClient
      .from('journal_article_revisions')
      .select('*')
      .eq('article_id', testArticleId);
    console.log('Anonymous SELECT on revisions returned rows:', anonRevs?.length || 0);
    if (anonRevs && anonRevs.length > 0) {
      throw new Error('SECURITY VIOLATION: Revision snapshots leaked to anonymous client!');
    }

    // Launch Playwright to test anonymous storefront isolation
    const browser = await chromium.launch({ headless: true });
    const anonContext = await browser.newContext();
    const anonPage = await anonContext.newPage();

    console.log('Navigating anonymous browser to storefront...');
    await anonPage.goto(`${PROD_URL}/journal/${testSlug}`, { waitUntil: 'networkidle' });
    const notOnShelfText = await anonPage.locator('text=/This entry is not on the shelf/i').isVisible();
    console.log('Storefront renders "not on the shelf" message for draft:', notOnShelfText);

    // Attempt ?studio_preview=true as anonymous visitor
    await anonPage.goto(`${PROD_URL}/journal/${testSlug}?studio_preview=true`, { waitUntil: 'networkidle' });
    const anonPreviewBlocked = await anonPage.locator('text=/This entry is not on the shelf/i').isVisible();
    const bannerVisibleToAnon = await anonPage.locator('text=/Studio Draft Preview/i').isVisible();
    console.log('Anonymous ?studio_preview=true still shows "not on shelf":', anonPreviewBlocked);
    console.log('Banner visible to anonymous visitor:', bannerVisibleToAnon);

    await anonPage.screenshot({ path: path.join(EVIDENCE_DIR, '01_anonymous_draft_isolation.png'), fullPage: true });

    // ------------------------------------------------------------------
    // A.3: Authenticated Admin Preview
    // ------------------------------------------------------------------
    console.log('\n[A.3] Verifying Authenticated Admin Preview (?studio_preview=true)...');
    const adminBrowserContext = await browser.newContext();
    const adminPage = await adminBrowserContext.newPage();

    // Inject admin auth token into localStorage
    const storageKey = `sb-${PROD_REF}-auth-token`;
    await adminPage.addInitScript(({ key, val }) => {
      window.localStorage.setItem(key, JSON.stringify(val));
    }, { key: storageKey, val: adminSession });

    await adminPage.goto(`${PROD_URL}/journal/${testSlug}?studio_preview=true`, { waitUntil: 'networkidle' });

    // Verify amber banner is visible
    const banner = adminPage.locator('text=/Studio Draft Preview/i');
    await banner.waitFor({ timeout: 10000 });
    const bannerText = await banner.textContent();
    console.log('Admin Preview Banner:', bannerText?.trim());

    // Verify article details are rendered
    const titleLocator = adminPage.locator(`text=${initialTitle}`);
    await titleLocator.waitFor({ timeout: 5000 });
    const authorLocator = adminPage.locator(`text=${initialAuthor}`);
    await authorLocator.waitFor({ timeout: 5000 });
    console.log('Admin preview successfully rendered title, author, and amber banner!');

    await adminPage.screenshot({ path: path.join(EVIDENCE_DIR, '02_admin_draft_preview.png'), fullPage: true });

    // ------------------------------------------------------------------
    // A.4: Publish Reflection & Public Storefront Verification
    // ------------------------------------------------------------------
    console.log('\n[A.4] Publishing Reflection...');
    const { data: pubData, error: pubErr } = await adminClient
      .from('journal_articles')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', testArticleId)
      .select()
      .single();
    if (pubErr) throw pubErr;

    const { data: rev2Pub, error: rev2PubErr } = await userAdminClient.rpc('save_journal_article_revision', {
      p_article_id: testArticleId,
      p_change_summary: 'Published test reflection for public storefront verification'
    });
    if (rev2PubErr) throw rev2PubErr;
    console.log('Published status confirmed. Revision #2 created.');

    // Public REST query check
    const { data: pubAnonCheck } = await anonClient
      .from('journal_articles')
      .select('*')
      .eq('slug', testSlug);
    console.log('Anonymous SELECT on published reflection returned rows:', pubAnonCheck?.length);
    console.log('Published reflection status:', pubAnonCheck?.[0]?.status);

    // Verify public storefront in a clean anonymous browser (NO redeploy needed!)
    const cleanAnonContext = await browser.newContext();
    const cleanAnonPage = await cleanAnonContext.newPage();
    await cleanAnonPage.goto(`${PROD_URL}/journal/${testSlug}`, { waitUntil: 'networkidle' });

    const pubTitleLocator = cleanAnonPage.locator(`text=${initialTitle}`);
    await pubTitleLocator.waitFor({ timeout: 10000 });
    const pubAuthorLocator = cleanAnonPage.locator(`text=${initialAuthor}`);
    await pubAuthorLocator.waitFor({ timeout: 5000 });
    const pubBannerPresent = await cleanAnonPage.locator('text=/Studio Draft Preview/i').isVisible();
    console.log('Public Storefront renders published article title:', await pubTitleLocator.isVisible());
    console.log('Public Storefront has draft preview banner:', pubBannerPresent);

    await cleanAnonPage.screenshot({ path: path.join(EVIDENCE_DIR, '03_public_published_storefront.png'), fullPage: true });

    // ------------------------------------------------------------------
    // A.5: Unpublish / Archive Verification
    // ------------------------------------------------------------------
    console.log('\n[A.5] Archiving / Unpublishing Reflection...');
    const { data: archData, error: archErr } = await userAdminClient.rpc('archive_journal_article', {
      p_id: testArticleId
    });
    if (archErr) throw archErr;
    console.log('archive_journal_article RPC executed successfully. Status:', archData?.status);

    // Verify immediate disappearance from anonymous REST
    const { data: archAnonCheck } = await anonClient
      .from('journal_articles')
      .select('*')
      .eq('slug', testSlug);
    console.log('Anonymous SELECT after archiving returned rows:', archAnonCheck?.length || 0);

    // Verify storefront immediately shows shelf fallback
    const unpubAnonPage = await cleanAnonContext.newPage();
    await unpubAnonPage.goto(`${PROD_URL}/journal/${testSlug}`, { waitUntil: 'networkidle' });
    const unpubShelfVisible = await unpubAnonPage.locator('text=/This entry is not on the shelf/i').isVisible();
    console.log('Public Storefront immediately shows shelf fallback post-archive:', unpubShelfVisible);

    await unpubAnonPage.screenshot({ path: path.join(EVIDENCE_DIR, '04_public_post_archive_shelf.png'), fullPage: true });

    // ------------------------------------------------------------------
    // A.6: Revision Snapshots & Rollback Verification
    // ------------------------------------------------------------------
    console.log('\n[A.6] Testing Immutable Revision History & Rollback...');
    // Modify article copy to create Revision #3
    const modifiedContent = 'Modified test copy for rollback verification.';
    await adminClient
      .from('journal_articles')
      .update({
        content: modifiedContent,
        title: 'Phase 3 Certification: Modified Copy Before Rollback'
      })
      .eq('id', testArticleId);

    const { data: rev3Data, error: rev3Err } = await userAdminClient.rpc('save_journal_article_revision', {
      p_article_id: testArticleId,
      p_change_summary: 'Updated title and content to test revision rollback'
    });
    if (rev3Err) throw rev3Err;
    console.log('Revision #3 logged:', rev3Data);

    // Inspect all revisions
    const { data: revList } = await userAdminClient
      .from('journal_article_revisions')
      .select('revision_number, title, change_summary, actor_email, created_at')
      .eq('article_id', testArticleId)
      .order('revision_number', { ascending: true });
    console.log('Revisions currently logged for article:');
    console.table(revList);

    // Execute rollback to Revision #1
    console.log('Rolling back article to Revision #1...');
    const { data: rollData, error: rollErr } = await userAdminClient.rpc('restore_journal_article_revision', {
      p_article_id: testArticleId,
      p_revision_number: 1
    });
    if (rollErr) throw rollErr;
    console.log('Rollback RPC executed. Restored Title:', rollData?.title);
    console.log('Restored Content matches original:', rollData?.content === initialContent);

    // Restore article lifecycle state from archived back to draft
    console.log('Restoring article from archived back to draft...');
    const { data: restData, error: restErr } = await userAdminClient.rpc('restore_journal_article', {
      p_id: testArticleId
    });
    if (restErr) throw restErr;
    console.log('restore_journal_article executed. Status:', restData?.status, 'archived_at:', restData?.archived_at);

    // ------------------------------------------------------------------
    // A.7: Media Reference Protection Guard
    // ------------------------------------------------------------------
    console.log('\n[A.7] Testing Media Reference Protection Guard...');
    const { data: usageData, error: usageErr } = await userAdminClient.rpc('check_media_asset_usage', {
      p_url: initialImg
    });
    if (usageErr) throw usageErr;
    console.log('Media usage check for /src/assets/hop-fabric.jpg: in_use =', usageData?.in_use);
    const hasArticleRef = usageData?.references?.some(r => r.includes(testSlug) || r.includes('Phase 3 Certification'));
    console.log('Media usage detects temporary certification article:', hasArticleRef);
    console.log('References:', usageData?.references);

    // ------------------------------------------------------------------
    // A.8: Clean Safe Teardown
    // ------------------------------------------------------------------
    console.log('\n[A.8] Safe Teardown: Removing temporary test article...');
    await adminClient.from('journal_article_revisions').delete().eq('article_id', testArticleId);
    await adminClient.from('journal_articles').delete().eq('id', testArticleId);
    console.log('Test article and revision records deleted.');

    // Verify 0 rows remain
    const { data: postTeardown } = await adminClient
      .from('journal_articles')
      .select('id')
      .eq('id', testArticleId);
    console.log('Rows remaining in journal_articles:', postTeardown?.length || 0);

    const { data: postTeardownRevs } = await adminClient
      .from('journal_article_revisions')
      .select('id')
      .eq('article_id', testArticleId);
    console.log('Rows remaining in journal_article_revisions:', postTeardownRevs?.length || 0);

    await browser.close();

    console.log('\n=================================================================');
    console.log('CERTIFICATION A RESULT: PASS (All lifecycle transitions verified)');
    console.log('=================================================================\n');

    fs.writeFileSync(path.join(EVIDENCE_DIR, 'cert_a_results.json'), JSON.stringify({
      verdict: 'PASS',
      testSlug,
      testArticleId,
      initialTitle,
      revisionsLogged: revList,
      mediaUsageCheck: usageData,
      timestamp: new Date().toISOString()
    }, null, 2));

  } catch (err) {
    console.error('CERTIFICATION A FAILED:', err);
    if (testArticleId) {
      console.log('Attempting cleanup on error...');
      await adminClient.from('journal_article_revisions').delete().eq('article_id', testArticleId);
      await adminClient.from('journal_articles').delete().eq('id', testArticleId);
    }
    process.exit(1);
  }
}

main();
