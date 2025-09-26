import MainTopic from "./MainTopic";
import ToneOrStyle from "./ToneOrStyle";
import Audience from "./Audience";
import LanguageSelector from "./OtherComponents/LanguageSelector";
import Keywords from "./OtherComponents/Keywords";
import { useAppContext } from "@/src/app/AppContext";

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
