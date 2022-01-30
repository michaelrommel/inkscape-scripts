### Collection of small inkscape scripts

Install with `npm i`.

`convert-to-symbol.js` iterates over a SVG file and converts every shape
that is a top level group into a symbol. The title and id of each symbol is
taken from the id of the shape. The resulting file can be put under the
standard inkscape `.../share/inkscape/symbols` directoy. It is then available
via the Symbols dropdown menu.

`extract-std-icons.js` iterates over a SVG file and exports every shape
that is a top level group as a separate minimalistic svg file. The id of the
file and its filename are derived from the shape's id attribute. The resulting
files will be put in a subdirectory.

Variables have to be changed in source code, I had no need for cmd line
argument parsing as this scripts are called only once in a blue moon and then
they usually have to be adapted to whatever file I am dealing with anyway.

