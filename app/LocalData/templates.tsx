import { MdOutlineTitle } from "react-icons/md";
import {
  AiOutlineFileText,
  AiFillProduct,
  AiOutlineProfile,
} from "react-icons/ai";
import {
  FaHashtag,
  FaCode,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { BiHeading, BiMessageAltEdit } from "react-icons/bi";
import { BsTextParagraph } from "react-icons/bs";
import { SingleTemplate } from "../types/AppType";

const iconStyle = "text-[17px] text-purple-600";
//Stats drop down array
export const templatesArray: SingleTemplate[] = [
  {
    id: 1,
    title: "Post Title",
    icon: <MdOutlineTitle className={iconStyle} />,
    totalWordsCount: 132,
    description:
      "Generate a catchy and engaging title for your blog post or article.",
    isFavorite: false,
    shortSubTitle: "Generate catchy titles for your next post",
    isForPro: false,
  },
  {
    id: 2,
    title: "Blog Tags",
    icon: <AiOutlineFileText className={iconStyle} />,
    totalWordsCount: 25,
    description:
      "Create relevant tags for your blog posts to improve SEO and categorization.",
    isFavorite: true,
    shortSubTitle: "Boost SEO with relevant blog tags",
    isForPro: false,
  },
  {
    id: 3,
    title: "Youtube Hashtags",
    icon: <FaHashtag className={iconStyle} />,
    totalWordsCount: 30,
    description:
      "Generate popular and trending hashtags for your YouTube videos.",
    isFavorite: false,
    shortSubTitle: "Trending hashtags for YouTube success",
    isForPro: false,
  },
  {
    id: 4,
    title: "Code Generator",
    icon: <FaCode className={iconStyle} />,
    totalWordsCount: 400,
    description:
      "Automatically generate code snippets based on your input or requirements.",
    isFavorite: true,
    shortSubTitle: "Quick code snippets on demand",
    isForPro: false,
  },
  {
    id: 5,
    title: "Email Newsletter",
    icon: <HiOutlineMail className={iconStyle} />,
    totalWordsCount: 300,
    description:
      "Create engaging and informative email newsletters to reach your audience.",
    isFavorite: true,
    shortSubTitle: "Craft compelling email newsletters",
    isForPro: false,
  },
  {
    id: 6,
    title: "Question & Answer",
    icon: <RiQuestionAnswerLine className={iconStyle} />,
    totalWordsCount: 150,
    description:
      "Generate a set of questions and answers for FAQ sections or interviews.",
    isFavorite: false,
    shortSubTitle: "Create FAQs and interview content",
    isForPro: true,
  },
  {
    id: 7,
    title: "Text Summarizer",
    icon: <BiHeading className={iconStyle} />,
    totalWordsCount: 100,
    description:
      "Summarize lengthy texts into concise, easy-to-read summaries.",
    isFavorite: false,
    shortSubTitle: "Condense long text into brief summaries",
    isForPro: true,
  },
  {
    id: 8,
    title: "Content Rewriter",
    icon: <BiMessageAltEdit className={iconStyle} />,
    totalWordsCount: 200,
    description:
      "Rewrite content to improve clarity, SEO, or tone without losing the original meaning.",
    isFavorite: false,
    shortSubTitle: "Enhance and refresh existing content",
    isForPro: true,
  },
  {
    id: 9,
    title: "Product Description",
    icon: <AiFillProduct className={iconStyle} />,
    totalWordsCount: 120,
    description:
      "Generate compelling product descriptions to attract potential buyers.",
    isFavorite: false,
    shortSubTitle: "Create enticing product descriptions",
    isForPro: true,
  },
  {
    id: 10,
    title: "Facebook Ads",
    icon: <FaFacebook className={iconStyle} />,
    totalWordsCount: 80,
    description:
      "Create eye-catching and effective ad copy for your Facebook advertising campaigns.",
    isFavorite: false,
    shortSubTitle: "Craft engaging Facebook ad copy",
    isForPro: true,
  },
  {
    id: 11,
    title: "Blog Section",
    icon: <BsTextParagraph className={iconStyle} />,
    totalWordsCount: 350,
    description: "Generate well-structured sections for your blog posts.",
    isFavorite: false,
    shortSubTitle: "Structure your blog content effectively",
    isForPro: true,
  },
  {
    id: 12,
    title: "SEO Meta Description",
    icon: <FaLinkedin className={iconStyle} />,
    totalWordsCount: 160,
    description:
      "Generate an optimized meta description to boost your webpage's SEO ranking.",
    isFavorite: false,
    shortSubTitle: "Optimize meta descriptions for SEO",
    isForPro: true,
  },
  {
    id: 13,
    title: "LinkedIn Bio",
    icon: <FaLinkedin className={iconStyle} />,
    totalWordsCount: 150,
    isFavorite: false,
    description:
      "Create a professional and engaging LinkedIn bio to showcase your skills and experience.",
    shortSubTitle: "Craft an impressive LinkedIn profile",
    isForPro: true,
  },
  {
    id: 14,
    title: "Instagram Captions",
    icon: <FaInstagram className={iconStyle} />,
    totalWordsCount: 70,
    isFavorite: false,
    description:
      "Generate creative and catchy Instagram captions to increase engagement on your posts.",
    shortSubTitle: "Boost engagement with catchy captions",
    isForPro: true,
  },
];
