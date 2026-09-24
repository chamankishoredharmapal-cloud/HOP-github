import https from 'https';

https.get('https://hop.pages.dev/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Length:', data.length);
    console.log('Head 1000 chars:\n', data.substring(0, 1000));
  });
});
