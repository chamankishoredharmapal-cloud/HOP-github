import https from 'https';

const routes = [
  '/',
  '/collections/',
  '/cart',
  '/checkout',
  '/customer-care/',
  '/product/d31d9bdc-1975-4acd-acb2-c1b90857e0ea/'
];

for (const r of routes) {
  https.get(`https://hop-staging.chamankishoredharmapal.workers.dev${r}`, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const isHtml = (res.headers['content-type'] || '').includes('text/html');
      const hasRoot = data.includes('id="root"');
      const titleMatch = data.match(/<title>(.*?)<\/title>/i);
      const scripts = [...data.matchAll(/src=["'](.*?)["']/gi)].map(m => m[1]);
      console.log(`${r.padEnd(45)} -> Status: ${res.statusCode} | HTML: ${isHtml} | Root: ${hasRoot} | Title: ${titleMatch ? titleMatch[1] : 'none'} | Asset: ${scripts[0] || 'none'}`);
    });
  }).on('error', e => console.error(r, e.message));
}
