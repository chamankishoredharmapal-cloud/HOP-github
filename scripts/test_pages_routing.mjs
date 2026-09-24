import https from 'https';

const host = 'hop.pages.dev';
const routes = ['/', '/collections', '/cart', '/checkout', '/customer-care'];

for (const r of routes) {
  const req = https.get({ host, path: r }, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const isHtml = (res.headers['content-type'] || '').includes('text/html');
      const hasRoot = data.includes('id="root"');
      const titleMatch = data.match(/<title>(.*?)<\/title>/i);
      console.log(`${r.padEnd(16)} -> Status: ${res.statusCode} | Content-Type: ${res.headers['content-type']} | Root: ${hasRoot} | Title: ${titleMatch ? titleMatch[1] : 'none'}`);
    });
  });
  req.on('error', e => console.error(r, e.message));
}
