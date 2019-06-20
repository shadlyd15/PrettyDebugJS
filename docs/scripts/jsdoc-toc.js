(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"global.html\">Globals</a>","id":"global","children":[]},{"label":"<a href=\"module-ANSI%2520Color%2520Codes.html\">ANSI Color Codes</a>","id":"module:ANSI Color Codes","children":[]},{"label":"<a href=\"module-Default%2520Options.html\">Default Options</a>","id":"module:Default Options","children":[]},{"label":"<a href=\"module-pretty-debug.html\">pretty-debug</a>","id":"module:pretty-debug","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: true,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
