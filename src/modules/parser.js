const dummy = `__DUMMY__${Date.now()}__`;

function tokenize(strToParse) {
  const chars = strToParse.split("");
  const chunks = [];
  let lastChar = " ";
  let oldIsWhitespace = true;
  while (chars.length) {
    const char = chars.shift();
    const isWhitespace = char.match(/\s/);
    if (char === "<") chunks.push("");
    if (char !== "<" && lastChar === ">") chunks.push("");
    if (isWhitespace && chunks[chunks.length - 1] && !oldIsWhitespace)
      chunks[chunks.length - 1] += " ";
    else if (!isWhitespace) chunks[chunks.length - 1] += char;
    if (!isWhitespace || !oldIsWhitespace) {
      lastChar = char;
      oldIsWhitespace = lastChar.match(/\s/);
    }
  }

  return chunks.filter((e) => e.length).map((e) => e.trim());
}

function parseTag(tagStr, values) {
  let cleanedStr = tagStr.slice(1, -1);
  let closing = false;
  let selfClosing = false;
  if (cleanedStr[0] === "/") {
    closing = true;
    cleanedStr = cleanedStr.slice(1);
  }
  if (cleanedStr[cleanedStr.length - 1] === "/") {
    selfClosing = true;
    cleanedStr = cleanedStr.slice(0, -1);
  }
  cleanedStr = cleanedStr.trim();

  //костыльный завод
  const tagTokens = cleanedStr.split(" ");
  const tagChunks = [];
  let inEscape = false;
  for (let i = 0; i < tagTokens.length; i++) {
    const currentToken = tagTokens[i];
    const escapeChange =
      currentToken.match(/"/g) && currentToken.match(/"/g).length % 2 !== 0;
    if (!inEscape) {
      tagChunks.push(currentToken);
    } else {
      tagChunks[tagChunks.length - 1] += " " + currentToken;
    }
    inEscape = escapeChange ? !inEscape : inEscape;
  }

  let type = tagChunks.shift();
  if (type === dummy) type = values.shift();
  const props = {};
  tagChunks.forEach((el) => {
    let [k, v] = ["", ""];
    if (el.indexOf("=")) {
      [k, v] = el.split("=");
      if (v[0] === '"') v = v.slice(1, -1);
      if (v === dummy) v = values.shift();
    } else {
      k = el;
      v = true;
    }
    props[k] = v;
  });

  return { type, props, children: [], closing, selfClosing };
}

function buildVDOM(chunks, values) {
  const root = {
    parent: null,
    children: [],
  };
  let parent = root;
  while (chunks.length) {
    const chunk = chunks.shift();
    if (chunk[0] !== "<") {
      if (chunk === dummy) {
        const v = values.shift();
        if (Array.isArray(v)) parent.children.push(...v);
        else parent.children.push(v);
      } else parent.children.push(chunk);
    } else {
      const tag = parseTag(chunk, values);
      tag.parent = parent;
      if (!tag.closing) parent.children.push(tag);
      if (!tag.closing && !tag.selfClosing) {
        parent = tag;
      } else if (tag.closing) {
        const t = parent;
        parent = parent.parent;
        delete t.parent;
      } else if (tag.selfClosing) {
        delete tag.parent;
      }
      delete tag.closing;
      delete tag.selfClosing;
    }
  }
  return root.children[0];
}

function parser(unparsedString, ...values) {
  const chunks = tokenize(unparsedString.join(dummy));
  return buildVDOM(chunks, values);
}

export default parser;
