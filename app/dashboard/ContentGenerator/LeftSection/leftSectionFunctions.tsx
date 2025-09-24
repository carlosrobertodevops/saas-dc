import { SingleTemplate } from "@/app/types/AppType";
import { prompts } from "./prompts";
import { v4 as uuidv4 } from "uuid";

import MainTopic from "./MainTopic";
import ToneOrStyle from "./ToneOrStyle";
import Audience from "./Audience";
import LanguageSelector from "./OtherComponents/LanguageSelector";
import Keywords from "./OtherComponents/Keywords";
import { useAppContext } from "@/app/AppContext";
import { Dispatch, SetStateAction } from "react";

export async function generateContent(
  selectedTemplate: SingleTemplate | null,
  mainTopicInput: string,
  toneOrStyleInput: string,
  selectLanguage: string,
  audienceInput: string,
  keywords: string[]
) {
  let prompt = "";
  let theTitle = "";

  switch (selectedTemplate?.title) {
    case "Post Title":
      prompt = `
        Generate a post title for "${mainTopicInput}" in a ${toneOrStyleInput} tone.
        Use an <h1> tag for the title.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Blog Tags":
      prompt = `
        Generate blog tags for "${mainTopicInput}".
        Format the tags in a comma-separated list within a <p> tag.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Youtube Hashtags":
      prompt = `
        Generate YouTube hashtags for "${mainTopicInput}".
        Format the hashtags in a comma-separated list within a <p> tag.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Text Summarizer":
      prompt = `
        Summarize the following content: "${mainTopicInput}".
        Use a <p> tag for the summary.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Content Rewriter":
      prompt = `
        Rewrite the following content: "${mainTopicInput}".
        Use a <p> tag for the rewritten content.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Product Description":
      prompt = `
        Generate a product description for "${mainTopicInput}".
        Use an <h2> tag for the product name and a <p> tag for the description.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Blog Section":
      prompt = `
        Create a blog section about "${mainTopicInput}".
        Use an <h2> tag for the section title and <p> tags for the content.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Link Bio":
      prompt = `
        Generate a link bio for "${mainTopicInput}".
        Use <ul> and <li> tags to format the links.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Instagram Captions":
      prompt = `
        Create Instagram captions for "${mainTopicInput}".
        Use a <p> tag for each caption.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Code Generator":
      prompt = `
      Generate a code snippet for the topic "${mainTopicInput}" in ${selectLanguage}.
      Include the code only inside <pre><code></code></pre> tags without any Markdown formatting, and after the code
      add an explanation in <p> tags.
    `;

      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Email Newsletter":
      prompt = `
        Create an email newsletter for "${mainTopicInput}".
        Structure it with:
        - A greeting in a <div id="greeting">
        - Main content in a <div id="main-content"> with <p> tags
        - Closing in a <div id="closing">.
        Tone: ${toneOrStyleInput}
        Audience: ${audienceInput.trim()}
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Question & Answer":
      prompt = `
        Generate a Q&A format for "${mainTopicInput}".
        Use <h3> for questions and <p> for answers.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "Facebook Ads":
      prompt = `
        Create a Facebook ad for "${mainTopicInput}".
        Use <h2> for the headline and <p> for the ad content.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    case "SEO Meta Description":
      prompt = `
        Generate an SEO Meta Description in HTML format for "${mainTopicInput}".
        Include relevant keywords: ${keywords.join(", ")}.
        Use a <meta> tag for the description.
      `;
      theTitle = prompts[selectedTemplate.title].title(mainTopicInput);
      break;

    default:
      console.log("Unknown template");
      return;
  }

  console.log("prompt", prompt);

  // Make a POST request to your API route to generate content
  try {
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt, // Your prompt here
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    const content = data.output; // Assuming your API returns `output` as the generated content

    // Format the output for specific templates
    switch (selectedTemplate.title) {
      case "Post Title":
        return { theTitle, prompt, content: `<h1>${content}</h1>` };

      case "Blog Tags":
      case "Youtube Hashtags":
        return { theTitle, prompt, content: `<p>${content}</p>` };

      case "Text Summarizer":
      case "Content Rewriter":
      case "Product Description":
      case "Blog Section":
      case "Instagram Captions":
        return { theTitle, prompt, content: `<p>${content}</p>` };

      case "Link Bio":
        return {
          theTitle,
          prompt,
          content: `<ul>${content
            .split(",")
            .map((tag: string) => `<li>${tag.trim()}</li>`)
            .join("")}</ul>`,
        };

      case "Code Generator":
        return { theTitle, prompt, content: `${content}` };

      case "Email Newsletter":
        return {
          theTitle,
          prompt,
          content: `
            <div id="greeting"><p>${content.greeting}</p></div>
            <div id="main-content"><p>${content.mainContent}</p></div>
            <div id="closing"><p>${content.closing}</p></div>
          `,
        };

      case "Question & Answer":
        return {
          theTitle,
          prompt,
          content: content
            .map(
              (qna: { question: string; answer: string }) =>
                `<h3>${qna.question}</h3><p>${qna.answer}</p>`
            )
            .join(""),
        };

      case "Facebook Ads":
        return {
          theTitle,
          prompt,
          content: `<h2>${content.headline}</h2><p>${content.body}</p>`,
        };

      case "SEO Meta Description":
        return {
          theTitle,
          prompt,
          content: `<meta name="description" content="${content}" />`,
        };

      default:
        return {
          theTitle,
          prompt,
          content: "<p>Error generating content. Please try again.</p>",
        };
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      theTitle,
      prompt,
      content: "<p>Error generating content. Please try again.</p>",
    };
  }
}

export const RenderFormFields = () => {
  const {
    selectedTemplatesObject: { selectedTemplate },
  } = useAppContext();

  switch (selectedTemplate?.title) {
    case "Post Title":
      return (
        <>
          <MainTopic
            label="Blog Post Topic"
            placeholder="Enter your blog post topic"
          />
          <ToneOrStyle />
        </>
      );
    case "Blog Tags":
      return (
        <>
          <MainTopic
            label="Blog Post Content"
            placeholder="Enter a brief description of your blog post"
          />
          <Audience />
        </>
      );
    case "Youtube Hashtags":
      return (
        <>
          <MainTopic
            label="Video Topic"
            placeholder="Enter your YouTube video topic"
          />
          <Audience />
        </>
      );
    case "Code Generator":
      return (
        <>
          <MainTopic
            label="Programming Task"
            placeholder="Enter a description of the task you want code for"
          />
          <LanguageSelector />
        </>
      );
    case "Email Newsletter":
      return (
        <>
          <MainTopic
            label="Newsletter Topic"
            placeholder="Enter the main topic of your newsletter"
          />
          <Audience />
          <ToneOrStyle />
        </>
      );
    case "Question & Answer":
      return (
        <>
          <MainTopic
            label="Main Question"
            placeholder="Enter the question you want answered"
          />
          <ToneOrStyle />
          <Audience />
        </>
      );
    case "Text Summarizer":
      return (
        <>
          <MainTopic
            label="Text to Summarize"
            placeholder="Enter the text you want summarized"
          />
          <ToneOrStyle />
        </>
      );
    case "Content Rewriter":
      return (
        <>
          <MainTopic
            label="Content to Rewrite"
            placeholder="Enter the content you want rewritten"
          />
          <ToneOrStyle />
        </>
      );
    case "Product Description":
      return (
        <>
          <MainTopic
            label="Product Name"
            placeholder="Enter the name of the product"
          />
          {/* <ProductFeatures /> */}
          <ToneOrStyle />
        </>
      );
    case "Facebook Ads":
      return (
        <>
          <MainTopic
            label="Ad Content"
            placeholder="Enter the content for your Facebook ad"
          />
          <Audience />
          <ToneOrStyle />
        </>
      );
    case "Blog Section":
      return (
        <>
          <MainTopic
            label="Section Topic"
            placeholder="Enter the topic of this blog section"
          />
          <ToneOrStyle />
        </>
      );
    case "SEO Meta Description":
      return (
        <>
          <MainTopic
            label="Page Content"
            placeholder="Describe the content of the page"
          />
          <Keywords />
        </>
      );
    case "LinkedIn Bio":
      return (
        <>
          <MainTopic
            label="Your Profession"
            placeholder="Enter your profession or role"
          />
          {/* <CareerAchievements /> */}
        </>
      );
    case "Instagram Captions":
      return (
        <>
          <MainTopic
            label="Post Topic"
            placeholder="Enter the topic of your Instagram post"
          />
          <ToneOrStyle />
          {/* <Hashtags /> */}
        </>
      );
    default:
      return (
        <>
          <MainTopic
            label="Blog Post Topic"
            placeholder="Enter your blog post topic"
          />
          <ToneOrStyle />
          <Audience />
        </>
      );
  }
};
