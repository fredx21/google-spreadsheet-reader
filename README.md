google-spreadsheet-reader
=========================

Usage:

```js
function onDataReceived(data, url) {
 // Read data
  for (var r=0; r<data.table.rows.length; r++) {
    for (var c=0; c<data.table.rows[r].c.length; c++) {
      data = data.table.rows[r].c[c];
    }
  }
}

var gssr = require("google-spreadsheet-reader");
gssr.read("'https://docs.google.com/spreadsheet/ccc?key=0AlRp2ieP7izLdGFNOERTZW0xLVpROFc3X3FJQ2tSb2c#gid=0", "select A,B", onDataReceived);
```
