import { MdOutlineTitle } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { HistoryData } from "../types/AppType";
import { resolveValue } from "react-hot-toast";

// Helper function to count words in a string
const countWords = (str: string) => str.trim().split(/\s+/).length;

// Function to map and aggregate data based on createdAt date
export const formatAndAggregateTotalCount = (historyData: HistoryData[]) => {
  // Create a map to store word counts by date
  const dateWordMap: { [key: string]: number } = {};

  historyData.forEach((item) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const wordCount = countWords(item.content);

    // Add word count to the existing date or create a new entry
    if (dateWordMap[formattedDate]) {
      dateWordMap[formattedDate] += wordCount;
    } else {
      dateWordMap[formattedDate] = wordCount;
    }
  });

  // Convert the map into the desired format, changing 'words' to 'value'
  return Object.entries(dateWordMap).map(([name, value]) => ({
    name,
    value, // Renamed to 'value'
  }));
};

type DataPoint = {
  name: string; // The formatted date string
  value: number; // The value associated with that date (total words, documents, etc.)
};

export const sortAndShortenMonth = (data: DataPoint[]): DataPoint[] => {
  return data
    .map((item) => {
      const shortenedDate = item.name.replace("September", "Sept.");
      return { ...item, name: shortenedDate };
    })
    .sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA.getTime() - dateB.getTime();
    });
};

//Function to format and count documents generated
export const formatAndCountDocuments = (historyData: HistoryData[]) => {
  // Create a map to store document counts by date
  const dateDocMap: { [key: string]: number } = {};

  historyData.forEach((item) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Increment document count for the existing date or create a new entry
    if (dateDocMap[formattedDate]) {
      dateDocMap[formattedDate] += 1;
    } else {
      dateDocMap[formattedDate] = 1;
    }
  });

  // Convert the map into the desired format, using 'value' instead of 'docGenerated'
  return Object.entries(dateDocMap).map(([name, value]) => ({
    name,
    value, // Use 'value' for consistency
  }));
};

export const formatAndAggregateTimeSaved = (historyData: HistoryData[]) => {
  // Create a map to store time saved by date
  const dateTimeMap: { [key: string]: number } = {};

  historyData.forEach((item) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timeSaved = item.totalWords / 40; // Default to 0 if timeSaved is missing

    // Add time saved to the existing date or create a new entry
    if (dateTimeMap[formattedDate]) {
      dateTimeMap[formattedDate] += timeSaved;
    } else {
      dateTimeMap[formattedDate] = timeSaved;
    }
  });

  // Convert the map into the desired format
  const aggregatedData = Object.entries(dateTimeMap).map(
    ([name, totalTimeSaved]) => ({
      name,
      totalTimeSaved, // Use totalTimeSaved instead of words or docGenerated
    })
  );

  // Use the sortAndShortenMonth function to sort and shorten month names
  return sortAndShortenMonth(
    aggregatedData.map((item) => ({
      name: item.name,
      value: item.totalTimeSaved, // Use value as totalTimeSaved
    }))
  );
};

export const formatAndAggregateAverageWords = (historyData: HistoryData[]) => {
  // Create a map to store word counts by date
  const dateWordMap: {
    [key: string]: { totalWords: number; docCount: number };
  } = {};

  historyData.forEach((item) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const wordCount = item.totalWords || 0; // Default to 0 if totalWords is missing

    // Add word count and document count to the existing date or create a new entry
    if (dateWordMap[formattedDate]) {
      dateWordMap[formattedDate].totalWords += wordCount;
      dateWordMap[formattedDate].docCount += 1;
    } else {
      dateWordMap[formattedDate] = { totalWords: wordCount, docCount: 1 };
    }
  });

  // Convert the map into the desired format
  const aggregatedData = Object.entries(dateWordMap).map(
    ([name, { totalWords, docCount }]) => {
      const averageWords = docCount > 0 ? totalWords / docCount : 0; // Calculate average
      return {
        name,
        averageWords, // Use averageWords instead of words or docGenerated
      };
    }
  );

  // Use the sortAndShortenMonth function to sort and shorten month names
  return sortAndShortenMonth(
    aggregatedData.map((item) => ({
      name: item.name,
      value: item.averageWords, // Use value as averageWords
    }))
  );
};

export const newHistoryData: HistoryData[] = [
  {
    id: "e288cf36-0977-4464-b786-6f84b72f820f",
    clerkUserId: "123",
    template: "Blog Tags",
    title: "Generated title 1",
    createdAt: "2024-09-27T08:17:53.901377",
    totalWords: 142,
    content: "Generated content 1 Generated content 1 Generated content 1",
  },
  {
    id: "e288cf36-0977-4462-b786-6f84b72f820f",
    clerkUserId: "123",
    template: "Blog Tags",
    title: "Generated title 1",
    createdAt: "2024-09-27T08:17:53.901377",
    totalWords: 34,
    content: "Generated content 1 Generated Generated content 1",
  },
  {
    id: "589d577e-9216-44c6-a886-a9b9a8c884d3",
    clerkUserId: "123",
    template: "Blog Tags",
    title: "Generated title 2",
    createdAt: "2024-09-26T08:17:53.901377",
    totalWords: 23,
    content: "Generated content 2",
  },
  {
    id: "589d527e-9236-44c6-a896-a9b9a8c884d3",
    clerkUserId: "123",
    template: "Blog Tags",
    title: "Generated Tags 2",
    createdAt: "2024-09-26T09:17:53.901377",
    totalWords: 3,
    content: "Generated tags 2",
  },
  {
    id: "01dff3d3-40d6-440e-8cb3-7878c5b3b12b",
    clerkUserId: "123",
    template: "Youtube Hashtags",
    title: "Generated title 3",
    createdAt: "2024-09-25T08:17:53.901377",
    totalWords: 21,
    content: "Generated content 3 content 3",
  },
  {
    id: "f2c1b49b-c5c6-4c63-a40d-ea23c010a5b9",
    clerkUserId: "123",
    template: "Code Generator",
    title: "Generated title 4",
    createdAt: "2024-09-24T08:17:53.901377",
    totalWords: 67,
    content: "Generated content 4  content 4  content 4",
  },
  {
    id: "bdc1a30e-8e7c-45b8-b4ec-6a0a7d096daf",
    clerkUserId: "123",
    template: "Youtube Hashtags",
    title: "Generated title 5",
    createdAt: "2024-09-23T08:17:53.901377",
    totalWords: 56,
    content: "Generated content 5 Generated content 5",
  },
  // {
  //   id: "bdc3a30e-8e7c-45f8-b4ec-6a0a9d096daf",
  //   clerkUserId: "123",
  //   template: "Youtube Hashtags",
  //   title: "Generated title 12",
  //   createdAt: "2024-09-23T05:17:53.901377",
  //   totalWords: 171,
  //   content: "Generated content 5 Generated content 5",
  // },
  // // New items
  // {
  //   id: "d51f03eb-2e3f-4e83-bbfb-1b6e1d3d9e4d",
  //   clerkUserId: "123",
  //   template: "Blog Tags",
  //   title: "Generated title 6",
  //   createdAt: "2024-09-22T08:17:53.901377",
  //   totalWords: 130,
  //   content: "Generated content 6",
  // },
  // {
  //   id: "b73c3c62-55ae-4786-9b3b-51de2a34a623",
  //   clerkUserId: "123",
  //   template: "Blog Tags",
  //   title: "Generated title 7",
  //   createdAt: "2024-09-21T08:17:53.901377",
  //   totalWords: 89,
  //   content: "Generated content 7",
  // },
  // {
  //   id: "b1b9b3b6-bab5-4c7e-8b41-e0cc6b61cc17",
  //   clerkUserId: "123",
  //   template: "Youtube Hashtags",
  //   title: "Generated title 8",
  //   createdAt: "2024-09-20T08:17:53.901377",
  //   totalWords: 56,
  //   content: "Generated content 8",
  // },
  // {
  //   id: "4bc8fbe8-0e3c-482c-9983-046f6b8f1e5f",
  //   clerkUserId: "123",
  //   template: "Code Generator",
  //   title: "Generated title 9",
  //   createdAt: "2024-09-19T08:17:53.901377",
  //   totalWords: 312,
  //   content: "Generated content 9",
  // },
  // {
  //   id: "a31b3e73-3c27-4fd5-bc9c-c8b1b0af882d",
  //   clerkUserId: "123",
  //   template: "Blog Tags",
  //   title: "Generated title 10",
  //   createdAt: "2024-09-18T08:17:53.901377",
  //   totalWords: 74,
  //   content: "Generated content 10",
  // },
  // {
  //   id: "6a1b5d2b-e428-4081-b9d7-3bfb91bbf63b",
  //   clerkUserId: "123",
  //   template: "Blog Tags",
  //   title: "Generated title 11",
  //   createdAt: "2024-09-17T08:17:53.901377",
  //   totalWords: 150,
  //   content: "Generated content 11",
  // },
  // {
  //   id: "fb1b1b6e-2b59-4d7f-9235-876ef674569b",
  //   clerkUserId: "123",
  //   template: "Youtube Hashtags",
  //   title: "Generated title 12",
  //   createdAt: "2024-09-16T08:17:53.901377",
  //   totalWords: 95,
  //   content: "Generated content 12",
  // },
  // {
  //   id: "82c61907-e631-4f1f-a52a-1200e79c6b38",
  //   clerkUserId: "123",
  //   template: "Code Generator",
  //   title: "Generated title 13",
  //   createdAt: "2024-09-15T08:17:53.901377",
  //   totalWords: 240,
  //   content: "Generated content 13",
  // },
  // {
  //   id: "7e88e334-01bc-4b63-bb63-0b1afef1b9ab",
  //   clerkUserId: "123",
  //   template: "Blog Tags",
  //   title: "Generated title 14",
  //   createdAt: "2024-09-14T08:17:53.901377",
  //   totalWords: 52,
  //   content: "Generated content 14",
  // },
];
