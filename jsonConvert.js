function escapeSpecialChars(jsonString) {
  return jsonString
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f");
}

class jsonConvert {
  static toJSON(obj) {
    var final = JSON.stringify(obj);

    var a = 0;
    var count = 0;
    for (a = 0; a < JSON.stringify(obj).length; a++) {
      if (JSON.stringify(obj).charAt(a) == "'") {
        final = [final.slice(0, a + count), "\\", final.slice(a + count)].join(
          ""
        );
        count++;
      }
    }
    return final.replace(/\\"/g, '\\\\"');
  }

  static toOBJ(string) {
    return JSON.parse(escapeSpecialChars(string));
  }
}
