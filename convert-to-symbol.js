const fs = require('fs');
const xml2js = require('xml2js');

var builder = new xml2js.Builder();

// basic svg object definition, that will be extended
const svg = {
  svg: {
  }
};

// const filebasename = './ppt-icons-0+0-applytransform';
// const filebasename = './general-icons-0+0-applytransform';
const filebasename = './ui-icons-0+0-applytransform';

var xml = fs.readFileSync(`${filebasename}.svg`);
xml2js.parseString(xml, function (err, result) {
  // take over the metadata from before
  svg.svg['$'] = result.svg['$'];
  svg.svg.defs = result.svg.defs;
  if (svg.svg.defs[0].symbol === undefined) {
    // create a symbols array, each element of that array
    // will later be one symbol tag
    svg.svg.defs[0].symbol = [];
  }
  // now iterate over the special icon file, shape is set 
  // to each first level svg group
  result.svg.g.forEach( (shape) => {
    console.log(`Original shape: ${JSON.stringify(shape, null, 2)}`);

    // get the name and path definitions
    const id = shape['$'].id;

    // in one instance I had to deal with a file which had
    // two group layers above the actual symbol, so I skipped
    // them when creating the symbol
    // const g = shape.g[0].g[0];
    const g = shape;

    // remove superfluous stuff from shapes, here there were
    // clip-paths attached, which were unnecessary
    // delete g['$']['clip-path'];

    // the symbol title will be shown, when hovering over a
    // symbol in inkscape
    const symbol = {
      '$': {
        id
      },
      title: id,
      g
    };
    console.log(`Generated symbol: ${JSON.stringify(symbol, null, 2)}`);

    // add the new symbol to the symbol array
    svg.svg.defs[0].symbol.push(symbol);
  });
});
console.log(`Resulting svg in JSON: ${JSON.stringify(svg, null, 2)}`);

const svgfile = builder.buildObject(svg);
console.log(`Resulting SVG File: ${svgfile}`);

fs.writeFileSync(`${filebasename}-symbols.svg`, svgfile);
