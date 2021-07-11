const renderLine = (line) => {
  const leftpadding = line.search(/\S/);
  const trimmed = line.trim();
  const split = trimmed.split(' ');
  const link = `<a href="/pmap/${split[0]}">${split[0]}</a>`;
  return `${Array.from({length: leftpadding}).map(()=>' ').join('')}${link}  ${split.slice(1).join(' ')}`;
}
export default (raw) => {
  const lines = raw.split('\n');
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>memhunt psaux</title>
      <meta charset="utf-8">
      <meta name="description" content="psaux output">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="resource://content-accessible/plaintext.css">
      <style type="text/css">
        a {
          color: white;
        }
        a:visited{
          color: white;
        }
      </style>

    </head>
    <body>
    <pre>${lines[0].trim()}\n
${lines.slice(1).map(renderLine).join(`\n`)}
    </pre>
    </body>
  </html>`;
};
