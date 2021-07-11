const renderLine = (pid, line) => {
  console.log('jabby', pid, line)
  const leftpadding = line.search(/[^0]/);
  const trimmed = line.trim();
  const split = trimmed.split(' ');
  const link = `<a href="/vmap/${pid}/${split[0].slice(leftpadding)}">${split[0]}</a>`;
  return `${link} ${split.slice(1).join(' ')}`;
}
export default (raw, pid) => {
  const lines = raw.split('\n');
  return `<!DOCTYPE html>
  <html>
    <head>
      <title>memhunt pmap for pid ${pid}</title>
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
${lines.slice(1).map(line => renderLine(pid, line)).join(`\n`)}
    </pre>
    </body>
  </html>`;
};
