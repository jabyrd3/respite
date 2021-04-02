const parse = rawconfig => 
  rawconfig
    // split on newlines
    .split('\n')
    // remove any lines without a colon, they're likely whitespace, either way, unparseable
    .filter(ln => ln.includes(':'))
    .reduce((acc, val) => {
      // split out key and cVal from the first instance of coon
      const [key, cVal] = val.split(/:(.+)/);
      // ignore anything on a line past #
      const strippedComments = cVal.split('#')[0].trim();
      // if something is parseable as json as-is, use that
      let parsedValue;
      try{
        parsedValue = JSON.parse(strippedComments);
      } catch(e){
        // otherwise, presume its an object, and wrap it
        // in single-quotes before attempting to parse.
        parsedValue = JSON.parse(`'${strippedComments}'`);
      }
      // smush the parsed key/value of this line into the reducer accumulator
      return {
        ...acc,
        [key.trim()]: parsedValue
      };
    }, {});

export default parse;
