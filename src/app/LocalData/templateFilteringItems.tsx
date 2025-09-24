import { MdOutlineFormatListBulleted } from 'react-icons/md';
import { AiOutlineGlobal, AiOutlineTool } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { TbCategory2 } from 'react-icons/tb';
import {
  FaCode,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa';

export const templatesFilteringItemsArray = [
  {
    id: 1,
    name: 'All Templates',
    icon: <MdOutlineFormatListBulleted />,
    isSelected: true,
    templates: [],
  },
  {
    id: 2,
    name: 'Website Contents',
    icon: <AiOutlineGlobal />,
    isSelected: false,
    templates: [
      'blog tags',
      'post title',
      'content rewriter',
      'text summarizer',
      'blog section',
    ],
  },
  {
    id: 3,
    name: 'Coding Tools',
    icon: <FaCode />,
    isSelected: false,
    templates: ['code generator'],
  },
  {
    id: 4,
    name: 'Facebook',
    icon: <FaFacebook />,
    isSelected: false,
    templates: ['facebook ads'],
  },
  {
    id: 5,
    name: 'Youtube',
    icon: <FaYoutube />,
    isSelected: false,
    templates: ['youtube hashtags'],
  },
  {
    id: 6,
    name: 'Seo Tools',
    icon: <AiOutlineTool />,
    isSelected: false,
    templates: ['seo meta description'],
  },
  {
    id: 7,
    name: 'Linkedin',
    icon: <FaLinkedin />,
    isSelected: false,
    templates: ['linkedin bio'],
  },
  {
    id: 8,
    name: 'Instagram',
    icon: <FaInstagram />,
    isSelected: false,
    templates: ['instagram captions'],
  },
  {
    id: 9,
    name: 'Email Content',
    icon: <MdEmail />,
    isSelected: false,
    templates: ['email newsletter'],
  },
  {
    id: 10,
    name: 'Others',
    icon: <TbCategory2 />,
    isSelected: false,
    templates: ['question & answer', 'product description'],
  },
];
