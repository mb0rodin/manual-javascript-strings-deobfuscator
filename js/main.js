const jsCodeEl = document.querySelector("[data-js]");
const dataLogEl = document.querySelector("[data-log]");
const addButtonEl = document.querySelector("#add");
const evalButtonEl = document.querySelector("#eval");
const clearButtonEl = document.querySelector("#clear");

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

var PRIVATE_CONTEXT = {};
var CONTEXT_CODE = "";

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
    with(context) { 
      var result = eval(CONTEXT_CODE + js); 
      addToLog('DONE!');
      return result;
    };
  } catch (error) {
    addToLog("ERROR: " + error);
    return "[error]"; 
  }
}

addButtonEl.addEventListener("click", () => {
  var selectionText = jsEditor.getSelection().toString();
  var result = evalInContext(PRIVATE_CONTEXT, selectionText);
  if(result != "[error]") {
    jsEditor.replaceSelection("");
    CONTEXT_CODE += selectionText + "\r\n";
    addToLog("ADDED: " + selectionText);
  }
});

evalButtonEl.addEventListener("click", () => {
  var selectionText = jsEditor.getSelection().toString();
  var result = evalInContext(PRIVATE_CONTEXT, selectionText);
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
