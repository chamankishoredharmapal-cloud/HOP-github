import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const findings = [];

async function scanDir(dir, isDist = false) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.vscode', '.idea', 'screenshots', 'playwright-report', 'test-results'].includes(entry.name)) {
        continue;
      }
      await scanDir(fullPath, isDist || entry.name === 'dist');
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.js', '.ts', '.tsx', '.mjs', '.html', '.css', '.json', '.toml', '.env', '.example', '.sql', '.md', '.txt', '.xml'].includes(ext)) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          scanContent(relPath, content, isDist);
        } catch (e) {}
      }
    }
  }
}

function scanContent(file, content, isDist) {
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Check 1: Service role key pattern
    if (/service_role|SUPABASE_SERVICE_ROLE/i.test(line)) {
      // Exclude documentation or Edge Function internal server-side usage
      const isDoc = file.endsWith('.md');
      const isEdgeFunc = file.startsWith('supabase/functions/');
      findings.push({
        file,
        lineNum,
        pattern: 'service_role / SUPABASE_SERVICE_ROLE',
        classification: isDoc ? 'DOCUMENTATION' : (isEdgeFunc ? 'EDGE_FUNCTION_SERVER_ENV' : (isDist ? 'CRITICAL_BUNDLE_LEAK' : 'LOCAL_CONFIG')),
        risk: isDist ? 'HIGH' : 'LOW',
        disposition: isDist ? 'UNSAFE' : 'SAFE'
      });
    }

    // Check 2: Razorpay Live Key
    if (/rzp_live_[a-zA-Z0-9]+/i.test(line)) {
      findings.push({
        file,
        lineNum,
        pattern: 'rzp_live_ key',
        classification: 'RAZORPAY_LIVE_KEY',
        risk: 'HIGH',
        disposition: 'UNSAFE'
      });
    }

    // Check 3: Razorpay Test Key
    if (/rzp_test_[a-zA-Z0-9]+/i.test(line)) {
      findings.push({
        file,
        lineNum,
        pattern: 'rzp_test_ key',
        classification: 'RAZORPAY_TEST_KEY',
        risk: 'LOW',
        disposition: 'SAFE_TEST_MOCK'
      });
    }

    // Check 4: Production Supabase Ref (kbvjmcnaaogkbnerjcoc)
    if (/kbvjmcnaaogkbnerjcoc/i.test(line)) {
      const isDoc = file.endsWith('.md');
      const isVideo = file === 'src/data/collectionVideos.ts';
      const isEnv = file === '.env';
      const isConfig = file === 'supabase/config.toml';
      const isPrerenderedDist = isDist && file.endsWith('.html');
      findings.push({
        file,
        lineNum,
        pattern: 'Production Supabase Ref (kbvjmcnaaogkbnerjcoc)',
        classification: isDoc ? 'DOCUMENTATION' : (isVideo ? 'PUBLIC_MEDIA_CDN' : (isEnv ? 'LOCAL_ENV_CONFIG' : (isConfig ? 'SUPABASE_CONFIG_TOML' : (isPrerenderedDist ? 'PRERENDERED_HTML_MEDIA_REF' : 'CLIENT_CODE')))),
        risk: 'LOW (READ-ONLY PUBLIC)',
        disposition: 'SAFE'
      });
    }

    // Check 5: Staging Supabase Ref (zalbmbhczouhrdboucfe)
    if (/zalbmbhczouhrdboucfe/i.test(line)) {
      findings.push({
        file,
        lineNum,
        pattern: 'Staging Supabase Ref (zalbmbhczouhrdboucfe)',
        classification: 'STAGING_INFRASTRUCTURE_REF',
        risk: 'NONE',
        disposition: 'SAFE'
      });
    }
  });
}

async function run() {
  await scanDir(rootDir);
  const outPath = path.resolve(rootDir, 'production/phase-4/leakage_sweep_results.json');
  await fs.writeFile(outPath, JSON.stringify(findings, null, 2), 'utf-8');
  console.log(`Leakage sweep complete. Found ${findings.length} occurrences. Results saved to ${outPath}`);
}

run().catch(console.error);
