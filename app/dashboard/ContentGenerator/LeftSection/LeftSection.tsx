import { IoSparklesSharp } from 'react-icons/io5';
import TemplatesHeader from './TemplateHeader';
import { useAppContext } from '@/app/AppContext';
import { v4 as uuidv4 } from 'uuid';

import { FormEvent, ReactNode, useContext, useEffect, useState } from 'react';
import { RenderFormFields } from './leftSectionFunctions';
import ContentGeneratorProvider, {
  SingleError,
  useContentGeneratorForm,
} from './LeftSectionContext';

import { generateContent } from './leftSectionFunctions';
import { HistoryData, User } from '@/app/types/AppType';
import toast from 'react-hot-toast';

import { MdOutlineTitle } from 'react-icons/md';
import { IconType } from 'react-icons';

import {
  AiOutlineFileText,
  AiFillProduct,
  AiOutlineProfile,
} from 'react-icons/ai';
import {
  FaHashtag,
  FaCode,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { BiHeading, BiMessageAltEdit } from 'react-icons/bi';
import { BsTextParagraph } from 'react-icons/bs';
import { countWords } from '../../Hisotry/Components/SingleHistoryItem';

export default function LeftSection() {
  const {
    selectedTemplatesObject: { selectedTemplate, setSelectedTemplate },
    windowWidthObject: { windowWidth },
    allHistoryDataObject: { allHistoryData, setAllHistoryData },
    contentGeneratedObject: { setContentGenerated },
    fakeUser,
    setFakeUser,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  function TemplateForm() {
    const {
      mainTopicInputObject: { mainTopicInput, setMainTopicInput },
      errorsObject: { setErrors, errors },
      selectLanguageObject: { selectLanguage },
      keywordsObject: { keywords },
      toneOrStyleInputObject: { toneOrStyleInput },
      audienceInputObject: { audienceInput },
    } = useContentGeneratorForm();

    async function submitForm(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const fieldsToCheck = [
        {
          label: 'mainTopic',
          value: mainTopicInput.trim(),
          message: 'This field is required',
        },
        {
          label: 'selectedLanguage',
          value: selectLanguage.trim(),
          message: 'Please select a language',
        },
        {
          label: 'keywords',
          value: keywords,
          message: 'Please add at least a keyword',
          condition: (val: string[]) => val.length === 0,
        },
      ];

      const updateErrors: SingleError[] = errors.map((singleError) => {
        const field = fieldsToCheck.find((f) => f.label === singleError.label);
        let hasError = false;

        if (field) {
          if (field.condition) {
            hasError = field.condition(field.value);
          } else {
            hasError = field.value === '';
          }
        }

        return { ...singleError, show: hasError };
      });

      setErrors(updateErrors);

      const isMainTopicValid = !updateErrors.find(
        (error) => error.label === 'mainTopic',
      )?.show;
      const isSelectedLanguageValid = !updateErrors.find(
        (error) => error.label === 'selectedLanguage',
      )?.show;
      const isKeywordsValid = !updateErrors.find(
        (error) => error.label === 'keywords',
      )?.show;

      console.log(isSelectedLanguageValid);

      if (isMainTopicValid || isSelectedLanguageValid || isKeywordsValid) {
        try {
          setIsLoading(true);

          const result = await generateContent(
            selectedTemplate,
            mainTopicInput,
            toneOrStyleInput,
            selectLanguage,
            audienceInput,
            keywords,
          );

          if (result && selectedTemplate) {
            const newHistory: HistoryData = {
              id: uuidv4(),
              clerkUserId: fakeUser.userId,
              template: selectedTemplate.title,
              title: result?.theTitle,
              content: result.content || '',
              createdAt: new Date().toISOString(),
              totalWords: countWords(result.content),
            };

            // Calculate new cumulative words
            const updatedCumulativeWords =
              fakeUser.cumulativeWords + countWords(result.content);

            // Update the user data in the database
            const updateResponse = await updateUserInDatabase(
              fakeUser.userId,
              updatedCumulativeWords,
            );

            console.log(updatedCumulativeWords);

            if (updateResponse) {
              // Update the fakeUser object
              const updateFakeUser = {
                ...fakeUser,
                cumulativeWords: updatedCumulativeWords,
              };

              // Add the new history to the database using the function
              await addHistoryToDatabase(newHistory);

              // Update the UI
              setContentGenerated(result.content);
              setAllHistoryData([...allHistoryData, newHistory]);
              setFakeUser(updateFakeUser);

              toast.success(
                'The content has been generated and saved to history successfully',
              );
            }
          }
        } catch (error) {
          console.log(error);
          toast.error('Something went wrong...');
        } finally {
          setIsLoading(false);
        }
      }
    }

    return (
      <form
        onSubmit={submitForm}
        className="flex flex-col h-[100%]   justify-between  "
      >
        <div className="flex flex-col gap-8">
          <RenderFormFields />
        </div>

        <div className={`flex justify-end ${windowWidth < 836 && 'mt-10'}`}>
          <button
            type="submit"
            className="   bg-purple-600 text-[13px] mb-1 text-white py-2 px-10 rounded-md hover:bg-purple-700 transition duration-300 flex items-center justify-center"
          >
            <IoSparklesSharp className="mr-2" />
            {isLoading ? '...Generating' : 'Generate'}
          </button>
        </div>
      </form>
    );
  }
  return (
    <div
      className={` ${
        windowWidth <= 836 ? 'w-full' : 'w-1/2'
      }  rounded-lg p-6 flex flex-col gap-12`}
    >
      <ContentGeneratorProvider>
        <TemplatesHeader />
        <TemplateForm />
      </ContentGeneratorProvider>
    </div>
  );
}

// Function to update user in the database
async function updateUserInDatabase(userId: string, cumulativeWords: number) {
  console.log('userId', userId);
  console.log('cumulativewords:', cumulativeWords);

  try {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userId,
        accumulatedWords: cumulativeWords, // Update cumulative words
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user in database');
    }

    const data = await response.json();
    return data; // Return the response data if needed
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user in database');
    return null; // Return null or some indication of failure
  }
}

// Function to add history to the database using POST
async function addHistoryToDatabase(newHistory: HistoryData) {
  try {
    const postHistoryResponse = await fetch('/api/histories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHistory), // Convert newHistory to JSON for the request
    });

    if (!postHistoryResponse.ok) {
      throw new Error('Failed to save history');
    }

    return postHistoryResponse.json(); // Return the response if needed
  } catch (error) {
    console.error('Error saving history:', error);
    throw error;
  }
}

export function convertFomNodeToText(icon: React.ReactElement): string {
  // Compare the 'type' property of the React element
  if (icon.type === MdOutlineTitle) return 'MdOutlineTitle';
  if (icon.type === AiOutlineFileText) return 'AiOutlineFileText';
  if (icon.type === FaHashtag) return 'FaHashtag';
  if (icon.type === FaCode) return 'FaCode';
  if (icon.type === HiOutlineMail) return 'HiOutlineMail';
  if (icon.type === RiQuestionAnswerLine) return 'RiQuestionAnswerLine';
  if (icon.type === BiHeading) return 'BiHeading';
  if (icon.type === BiMessageAltEdit) return 'BiMessageAltEdit';
  if (icon.type === FaFacebook) return 'FaFacebook';
  if (icon.type === BsTextParagraph) return 'BsTextParagraph';
  if (icon.type === FaLinkedin) return 'FaLinkedin';
  if (icon.type === FaInstagram) return 'FaInstagram';

  return 'MdOutlineTitle'; // Default case
}

export function convertFromTextToReactNode(
  templateName: string,
): React.ReactNode {
  console.log(templateName);

  switch (templateName) {
    case 'Post Title':
      return <MdOutlineTitle className="text-[16px] text-purple-600" />;
    case 'Blog Tags':
      return <AiOutlineFileText className="text-[16px] text-purple-600" />;
    case 'Youtube Hashtags':
      return <FaHashtag className="text-[16px] text-purple-600" />;
    case 'Code Generator':
      return <FaCode className="text-[16px] text-purple-600" />;
    case 'Email Newsletter':
      return <HiOutlineMail className="text-[16px] text-purple-600" />;
    case 'Question & Answer':
      return <RiQuestionAnswerLine className="text-[16px] text-purple-600" />;
    case 'Text Summarizer':
      return <BiHeading className="text-[16px] text-purple-600" />;
    case 'Content Rewriter':
      return <BiMessageAltEdit className="text-[16px] text-purple-600" />;
    case 'Product Description':
      return <AiFillProduct className="text-[16px] text-purple-600" />;
    case 'Facebook Ads':
      return <FaFacebook className="text-[16px] text-purple-600" />;
    case 'Blog Section':
      return <BsTextParagraph className="text-[16px] text-purple-600" />;
    case 'SEO Meta Description':
      return <FaInstagram className="text-[16px] text-purple-600" />;
    case 'LinkedIn Bio':
      return <FaLinkedin className="text-[16px] text-purple-600" />;
    case 'Instagram Captions':
      return <FaInstagram className="text-[16px] text-purple-600" />;
    default:
      return <MdOutlineTitle className="text-[16px] text-purple-600" />; // Default icon
  }
}
