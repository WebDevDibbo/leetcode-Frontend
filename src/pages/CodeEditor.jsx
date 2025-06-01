import Editor from '@monaco-editor/react';

function CodeEditor (){

   

    function handleEditorChange(value, event) {
        console.log('here is the current model value:', value)
    }

    return (
        <div>
       
        <Editor
        theme='vs-dark'
          height="75vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          onChange={handleEditorChange}
        />
        </div>
    )
}

export default CodeEditor;