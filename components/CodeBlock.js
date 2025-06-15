// components/CodeBlock.js
import { useState, useEffect, useRef } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export default function CodeBlock({ code }) {
  const [activeFile, setActiveFile] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [fileTree, setFileTree] = useState({});
  const [parsedFiles, setParsedFiles] = useState({});
  const codeRef = useRef(null);

  
  useEffect(() => {
    try {
      const files = typeof code === "string" ? JSON.parse(code) : code;
      setParsedFiles(files);

      
      const tree = {};
      Object.keys(files).forEach((filePath) => {
        const parts = filePath.split("/");
        let current = tree;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];

          if (i === parts.length - 1) {
            
            current[part] = filePath;
          } else {
            
            if (!current[part]) {
              current[part] = {};
            }
            current = current[part];
          }
        }
      });

      setFileTree(tree);

      
      if (Object.keys(files).length > 0 && !activeFile) {
        setActiveFile(Object.keys(files)[0]);
      }

      
      const folders = {};
      Object.keys(files).forEach((filePath) => {
        const parts = filePath.split("/");
        if (parts.length > 1) {
          
          for (let i = 1; i < parts.length; i++) {
            const dirPath = parts.slice(0, i).join("/");
            folders[dirPath] = true;
          }
        }
      });
      setExpandedFolders(folders);
    } catch (e) {
      
      const files = { "programs/counter/src/lib.rs": code };
      setParsedFiles(files);
      setFileTree({
        programs: {
          counter: { src: { "lib.rs": "programs/counter/src/lib.rs" } },
        },
      });
      setActiveFile("programs/counter/src/lib.rs");
    }
  }, [code]);

  const getLanguage = (fileName) => {
    if (fileName.endsWith(".rs")) return "rust";
    if (fileName.endsWith(".toml")) return "toml";
    if (fileName.endsWith(".json")) return "json";
    if (fileName.endsWith(".ts") || fileName.endsWith(".js"))
      return "typescript";
    if (fileName.endsWith(".sh")) return "bash";
    return "text";
  };

  const toggleFolder = (folderPath) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  
  const FileTreeNode = ({ node, path = "", level = 0 }) => {
    
    const sortedKeys = Object.keys(node).sort((a, b) => {
      const aIsDir = typeof node[a] === "object";
      const bIsDir = typeof node[b] === "object";

      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    return (
      <div style={{ marginLeft: level > 0 ? "16px" : "0" }}>
        {sortedKeys.map((key) => {
          const value = node[key];
          const currentPath = path ? `${path}/${key}` : key;

          if (typeof value === "object") {
            
            const isExpanded = expandedFolders[currentPath];

            return (
              <div key={currentPath}>
                <div
                  className="flex items-center py-1 px-1 text-gray-300 cursor-pointer hover:bg-gray-700 rounded text-sm"
                  onClick={() => toggleFolder(currentPath)}
                >
                  <span className="mr-1 flex-shrink-0">
                    {isExpanded ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    )}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 text-yellow-400 flex-shrink-0">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="truncate">{key}</span>
                </div>
                {isExpanded && (
                  <FileTreeNode
                    node={value}
                    path={currentPath}
                    level={level + 1}
                  />
                )}
              </div>
            );
          } else {
            return (
              <div
                key={currentPath}
                className={`flex items-center py-1 px-1 cursor-pointer rounded text-sm ${
                  activeFile === value
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setActiveFile(value)}
              >
                <span className="ml-4 mr-1 flex-shrink-0">
                  {key.endsWith(".rs") && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                  {key.endsWith(".toml") && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                  {key.endsWith(".json") && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                  {key.endsWith(".ts") && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-300">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                  {key.endsWith(".sh") && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                </span>
                <span className="truncate">{key}</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const handleCopy = () => {
    if (!activeFile || !parsedFiles[activeFile]) return;

    const textToCopy = parsedFiles[activeFile];
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div
        className="code-block rounded-md border border-gray-800 shadow-lg flex w-full"
        style={{ height: "500px" }}
      >
        <div className="w-40 lg:w-48 bg-gray-900 border-r border-gray-800 overflow-y-auto p-2 flex-shrink-0">
          <div className="text-gray-300 mb-2 font-medium flex items-center text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 flex-shrink-0">
              <path d="M3 3h18v18H3zM7 7h.01M7 12h.01M7 17h.01M12 7h5M12 12h5M12 17h5"></path>
            </svg>
            <span className="truncate">Files</span>
          </div>
          <FileTreeNode node={fileTree} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="bg-gray-800 px-3 py-2 text-gray-400 text-xs border-b border-gray-700 flex justify-between items-center min-w-0">
            <span className="truncate flex-1 mr-2">{activeFile}</span>
            <button
              onClick={handleCopy}
              className="hover:text-white flex items-center transition-colors"
            >
              {copySuccess ? (
                <>
                  <svg className="h-4 w-4 mr-1 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden relative min-w-0">
            {activeFile && parsedFiles[activeFile] && (
              <div className="h-full w-full overflow-auto">
                <SyntaxHighlighter
                  language={getLanguage(activeFile)}
                  style={atomOneDark}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    height: '100%',
                    overflow: 'auto',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                >
                  {parsedFiles[activeFile]}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}