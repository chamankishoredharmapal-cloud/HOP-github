import https from 'https';

const routes = ['/', '/collections', '/cart', '/checkout', '/customer-care'];

for (const r of routes) {
  https.get(`https://hop-staging.chamankishoredharmapal.workers.dev${r}`, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const isHtml = (res.headers['content-type'] || '').includes('text/html');
      const hasRoot = data.includes('id="root"');
      const titleMatch = data.match(/<title>(.*?)<\/title>/i);
      console.log(`${r.padEnd(16)} -> Status: ${res.statusCode} | Content-Type: ${res.headers['content-type']} | Root: ${hasRoot} | Title: ${titleMatch ? titleMatch[1] : 'none'}`);
    });
  }).on('error', e => console.error(r, e.message));
}
