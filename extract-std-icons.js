const fs = require('fs');
const xml2js = require('xml2js');

var builder = new xml2js.Builder();

// inputfile and output directory (must exist)
const inputfile = './icons/std-icons-0+0-applytransform.svg';
const outputdirectory = './icons/std-icons';

// define the dimensions of all icons
const width = 100;
const height = 100;

// define the basic attributes of a minimal svg
// file, where each group will be attached as singular
// element
const svgbase = {
  svg: {
    $: {
      width:  `${width}px`,
      height: `${height}px`,
      viewBox: `0 0 ${width} ${height}`,
      version: "1.1",
      id: "id",
      "inkscape:version": "1.1-dev (20a5364, 2020-08-19)",
      xmlns: "http://www.w3.org/2000/svg",
      "xmlns:svg": "http://www.w3.org/2000/svg",
      "xmlns:inkscape": "http://www.inkscape.org/namespaces/inkscape",
      "xmlns:sodipodi": "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    }
  }
};

const fillRe = /fill:#ffffff/;

var xml = fs.readFileSync(inputfile);
xml2js.parseString(xml, function (err, result) {
  result.svg.g.forEach( (shape) => {
    console.log(`Extracted Shape: ${JSON.stringify(shape, null, 2)}`);

    // get the name and path definitions
    const id = shape['$'].id;

    // in one instance I had to deal with a file which had
    // two group layers above the actual symbol, so I skipped
    // them when creating the symbol
    const g = shape.g[0].g[0];
    // const g = shape;

    // remove superfluous stuff from shapes, here there were
    // clip-paths attached, which were unnecessary
    delete g['$']['clip-path'];

    // remove white fill styles
    for (shapetype of Object.keys(g)) {
      if (shapetype === '$') continue;
      for (element of g[shapetype]) {
        if (element['$'].fill === '#ffffff') {
          element['$'].fill = 'none'
        }
        if (element['$'].style !== undefined &&
          element['$'].style.match(fillRe)) {
          element['$'].style = element['$'].style.replace(fillRe, 'fill:none');
        }
      }
    }

    // copy the base structure over to the new object
    const svg = { ...svgbase };
    svg.svg.g = g;
    svg.svg.g['$'].id = id;

    // take over to the overall svg id
    svg.svg['$'].id = id

    const svgfile = builder.buildObject(svg);
    console.log(`Resulting SVG: ${svgfile}`);
    fs.writeFileSync(`${outputdirectory}/${id}.svg`, svgfile);
  });
});
