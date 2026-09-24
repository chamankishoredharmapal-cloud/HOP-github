import https from 'https';

https.get('https://hop-staging.chamankishoredharmapal.workers.dev/', (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('CONTENT-TYPE:', res.headers['content-type']);
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('LENGTH:', data.length);
    const titleMatch = data.match(/<title>(.*?)<\/title>/i);
    console.log('TITLE:', titleMatch ? titleMatch[1] : 'none');
    console.log('CONTAINS_ROOT:', data.includes('id="root"'));
    console.log('CONTAINS_HOP_TEXT:', data.includes('House of Padmavati'));
    console.log('SNIPPET:\n', data.substring(0, 300));
  });
}).on('error', e => console.error('ERROR:', e.message));
