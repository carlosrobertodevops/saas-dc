import { IoSparklesSharp } from 'react-icons/io5';
import MainTopic from './MainTopic';
import ToneOrStyle from './ToneOrStyle';
import Audience from './Audience';
import TemplatesHeader from './TemplateHeader';
import { useAppContext } from '@/src/app/AppContext';
import { IoClose } from 'react-icons/io5';
import Keywords from './OtherComponents/Keywords';
import LanguageSelector from './OtherComponents/LanguageSelector';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

export type SingleError = {
  label: string;
  show: boolean;
  message: string;
};
type ContentGeneratorFormType = {
  mainTopicInputObject: {
    mainTopicInput: string;
    setMainTopicInput: React.Dispatch<React.SetStateAction<string>>;
  };
  toneOrStyleInputObject: {
    toneOrStyleInput: string;
    setToneOrStyleInput: React.Dispatch<React.SetStateAction<string>>;
  };
  audienceInputObject: {
    audienceInput: string;
    setAudienceInput: React.Dispatch<React.SetStateAction<string>>;
  };

  selectLanguageObject: {
    selectLanguage: string;
    setSelectLanguage: React.Dispatch<React.SetStateAction<string>>;
  };

  errorsObject: {
    errors: SingleError[];
    setErrors: React.Dispatch<React.SetStateAction<SingleError[]>>;
  };

  keywordsObject: {
    keywords: string[];
    setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  };
};
//Default state of the content form context
const defaultGeneratorFormState = {
  mainTopicInputObject: {
    mainTopicInput: '',
    setMainTopicInput: () => {},
  },
  toneOrStyleInputObject: {
    toneOrStyleInput: '',
    setToneOrStyleInput: () => {},
  },
  audienceInputObject: {
    audienceInput: '',
    setAudienceInput: () => {},
  },
  selectLanguageObject: {
    selectLanguage: '',
    setSelectLanguage: () => {},
  },

  keywordsObject: {
    keywords: [],
    setKeywords: () => {},
  },
  errorsObject: {
    errors: [],
    setErrors: () => {},
  },
};

//Creating the context
const ContentGeneratorFormContext = createContext<ContentGeneratorFormType>(
  defaultGeneratorFormState,
);

export default function ContentGeneratorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mainTopicInput, setMainTopicInput] = useState('');
  const [toneOrStyleInput, setToneOrStyleInput] = useState('');
  const [audienceInput, setAudienceInput] = useState('');
  const [selectLanguage, setSelectLanguage] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [errors, setErrors] = useState<SingleError[]>([
    { label: 'mainTopic', show: false, message: 'This filed is required' },
    {
      label: 'selectedLanguage',
      show: false,
      message: 'Please select a language',
    },

    {
      label: 'keywords',
      show: false,
      message: 'Please set a least one keyword',
    },
  ]);
  //

  const {
    openContentGeneratorFormObject: { openContentGeneratorForm },
    selectedTemplatesObject: { selectedTemplate },
  } = useAppContext();

  //Reset the mainTopicInput when the content form is closed
  useEffect(() => {
    setMainTopicInput('');
    setToneOrStyleInput('Catchy');
    setAudienceInput('');
    setKeywords([]);
  }, [openContentGeneratorForm, selectedTemplate]);

  return (
    <ContentGeneratorFormContext.Provider
      value={{
        mainTopicInputObject: { mainTopicInput, setMainTopicInput },
        audienceInputObject: { audienceInput, setAudienceInput },
        toneOrStyleInputObject: { toneOrStyleInput, setToneOrStyleInput },
        selectLanguageObject: { selectLanguage, setSelectLanguage },
        errorsObject: { errors, setErrors },
        keywordsObject: { keywords, setKeywords },
      }}
    >
      {children}
    </ContentGeneratorFormContext.Provider>
  );
}

//Adding the custom hook
export function useContentGeneratorForm() {
  return useContext(ContentGeneratorFormContext);
}
