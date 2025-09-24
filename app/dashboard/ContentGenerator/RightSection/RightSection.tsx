import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useAppContext } from "@/app/AppContext";
import "quill/dist/quill.snow.css";
import "../../../custom-quil.css"; // Add css for snow theme
import { useContentGeneratorForm } from "../LeftSection/LeftSectionContext";
import { countWords } from "../../Hisotry/Components/SingleHistoryItem";

const formatResponse = (response: string) => {
  // Remove the triple backticks and format the code section for multiple languages
  const code = response
    .replace(/```python/g, '<pre><code class="language-python">') // Opening backticks for Python
    .replace(/```javascript/g, '<pre><code class="language-javascript">') // Opening backticks for JavaScript
    .replace(/```java/g, '<pre><code class="language-java">') // Opening backticks for Java
    .replace(/```c#/g, '<pre><code class="language-csharp">') // Opening backticks for C#
    .replace(/```ruby/g, '<pre><code class="language-ruby">') // Opening backticks for Ruby
    .replace(/```go/g, '<pre><code class="language-go">') // Opening backticks for Go
    .replace(/```php/g, '<pre><code class="language-php">') // Opening backticks for PHP
    .replace(/```typescript/g, '<pre><code class="language-typescript">') // Opening backticks for TypeScript
    .replace(/```/g, "</code></pre>"); // Closing backticks

  return code;
};

export default function RightSection() {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["code-block"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
  ];

  const theme = "snow";
  const { quill, quillRef } = useQuill({ modules, formats, theme });

  const {
    openContentGeneratorFormObject: {
      openContentGeneratorForm,
      setOpenContentGeneratorForm,
    },
    windowWidthObject: { windowWidth },
    contentGeneratedObject: { contentGenerated },
    selectedTemplatesObject: { selectedTemplate },
  } = useAppContext();

  // Effect to update the Quill editor when contentGenerated changes
  useEffect(() => {
    if (quill && contentGenerated) {
      if (selectedTemplate?.title === "Code Generator") {
        const codeSnippet = formatResponse(contentGenerated);

        console.log(selectedTemplate);

        quill.clipboard.dangerouslyPasteHTML(codeSnippet);
      } else {
        quill.clipboard.dangerouslyPasteHTML(contentGenerated);
      }
    }
  }, [quill, contentGenerated]);

  // Reset the quill text editor when the selected template changes
  useEffect(() => {
    if (quill && selectedTemplate) {
      quill.setContents([]); // Clear the editor
    }
  }, [quill, selectedTemplate, openContentGeneratorForm]);

  return (
    <div
      className={`p-5 py-6 w-1/2 flex flex-col rounded-lg relative ${
        windowWidth <= 836 ? "w-full" : "w-1/2"
      }`}
    >
      <div className="flex items-center gap-1 justify-between">
        <h2 className="flex items-center gap-2">
          <IoDocumentTextOutline className="text-[19px] text-purple-600" />
          <div className="flex flex-col">
            <div className="text-[18px] text-slate-600 mt-[2px] items-center flex gap-1 font-semibold">
              <span className="hover:text-purple-600 cursor-pointer">
                Output
              </span>
            </div>
          </div>
        </h2>
      </div>

      <div className="text-slate-400 mt-12 text-[13px]">
        Below is the generated content. Feel free to edit or refine it further.
      </div>

      <div className="mt-3 flex flex-col">
        <div
          className=""
          style={{ height: "calc(100vh - 310px)" }}
          ref={quillRef}
        />
        <div className="flex justify-end mt-4">
          <span className="text-[12px] text-slate-400 text-end">
            {countWords(contentGenerated)} Total Words
          </span>
        </div>
      </div>
    </div>
  );
}
