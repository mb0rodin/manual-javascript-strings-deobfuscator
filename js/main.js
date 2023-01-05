const jsCodeEl = document.querySelector("[data-js]");
const dataLogEl = document.querySelector("[data-log]");
const addButtonEl = document.querySelector("#add");
const evalButtonEl = document.querySelector("#eval");
const clearButtonEl = document.querySelector("#clear");
const beautifierButtonEl = document.querySelector("#beautifier");

const defaultEditorSettings = {
  styleActiveLine: true,
  lineNumbers: true,
  matchBrackets: true,
  tabSize: 2,
  indentUnit: 2,
  theme: "monokai",
  lineWrapping: true,
};

const jsEditor = CodeMirror.fromTextArea(jsCodeEl, {
  ...defaultEditorSettings,
  mode: "javascript",
});

let PRIVATE_CONTEXT = {};
for (p in this)
  PRIVATE_CONTEXT[p] = undefined;

let CONTEXT_CODE = "";

for (const editor of [jsEditor]) {
  editor.on("blur", (codeMirror) => {
    codeMirror.save();
  });
}

function addToLog(text){
  dataLogEl.value = dataLogEl.value + text + "\r\n"
}

function evalInContext(context, js) {
  try {
    let result = null;
    with(context) {
      result = eval(CONTEXT_CODE + js); 
    }
    addToLog('DONE!');
    return result;
    
  } catch (error) {
    addToLog("ERROR: " + error);
    return "[error]"; 
  }
}

function beautify(source) {

  let opts = {
    brace_style: "collapse",
    break_chained_methods: false,
    comma_first: false,
    e4x: false,
    end_with_newline: false,
    indent_char: " ",
    indent_empty_lines: false,
    indent_inner_html: false,
    indent_scripts: "normal",
    indent_size: "4",
    jslint_happy: false,
    keep_array_indentation: false,
    max_preserve_newlines: "5",
    preserve_newlines: true,
    space_before_conditional: true,
    unescape_strings: false,
    wrap_line_length: "0",
  };

  return js_beautify(source, opts);
}

addButtonEl.addEventListener("click", () => {
  let selectionText = jsEditor.getSelection().toString();
  let result = evalInContext(PRIVATE_CONTEXT, selectionText);
  if(result != "[error]") {
    jsEditor.replaceSelection("");
    CONTEXT_CODE += selectionText + "\r\n";
    addToLog("ADDED: " + selectionText);
  }
});

evalButtonEl.addEventListener("click", () => {
  let selectionText = jsEditor.getSelection().toString();
  let result = evalInContext(PRIVATE_CONTEXT, selectionText);
  addToLog(selectionText + " => " + result);
  addToLog("typeof " + result + " => " + typeof result);
  if(typeof result == "string") result = `"${result}"`
   
  if(result != "[error]") jsEditor.replaceSelection(result.toString());
  
});

clearButtonEl.addEventListener("click", () => {
  jsEditor.setValue("");
  dataLogEl.value = "";
  CONTEXT_CODE = "";
  PRIVATE_CONTEXT = {};
  
});

beautifierButtonEl.addEventListener("click", () => {
  
  let result = beautify(jsEditor.getValue());
  jsEditor.setValue(result);
});