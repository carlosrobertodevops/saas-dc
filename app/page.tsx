"use client";

import Link from "next/link";

import Image from "next/image";
import { FaPencilAlt } from "react-icons/fa";
import { AiFillRobot } from "react-icons/ai";

import { Search, Tag, ClipboardList } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { FaCog, FaChartBar, FaLock } from "react-icons/fa";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";

export default function Home() {
  return (
    <div className="poppins">
      <Navbar />
      <CTASection />
      <div className="w-full flex justify-center items-center mt-10">
        <Image
          src={"/ai-verse-dashboard.png"}
          alt="dashboard"
          width={900}
          height={400}
          className="shadow-xl aspect-auto sm:w-auto w-[398px] rounded-lg max-w-full   sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
        />
      </div>
      <KeyFeatures />
      <PricingSection />
    </div>
  );
}

function Navbar() {
  return (
    <div className="flex m-5 max-sm:mt-9 mx-8 items-center justify-between max-sm:flex-col  ">
      <AppLogo />
      <Buttons />
    </div>
  );
}

function AppLogo() {
  return (
    <div className="flex items-center justify-between space-x-2 mt-1">
      {/* // Container for the logo and title */}
      <div className="flex gap-2 items-center">
        {/* // Purple rounded background with centered robot icon */}
        <div className="w-9 h-9 bg-purple-600 rounded-md flex items-center justify-center">
          <AiFillRobot className="text-white text-[19px]" />
        </div>
        {/* // Title with bold and light parts */}
        <h1 className={`text-[20px] flex gap-1  `}>
          <span className="font-bold text-purple-600">AI</span>
          <span className="font-light text-slate-600">Verse</span>
        </h1>
      </div>
    </div>
  );
}

function Buttons() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    // Optionally render a loading state
    return (
      <div className="flex gap-2 max-sm:flex-col max-sm:w-full max-sm:mt-8">
        <button className="p-2 bg-gray-200 rounded-md">Loading...</button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 max-sm:flex-col max-sm:w-full max-sm:mt-8">
      {!userId ? (
        <>
          <Link href="/sign-in">
            <button
              className={`max-sm:w-full text-sm border border-purple-600 text-white bg-purple-600 p-[8px] px-6 rounded-md`}
            >
              Sign In
            </button>
          </Link>

          <Link href="/sign-up">
            <button
              className={`max-sm:w-full text-sm border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white p-[8px] px-6 rounded-md`}
            >
              Sign Up
            </button>
          </Link>
        </>
      ) : (
        <Link href="/dashboard">
          <button
            className={`max-sm:w-full text-sm border bg-purple-600
            text-white hover:bg-purple-600 hover:text-white p-[8px] px-6 rounded-md`}
          >
            Dashboard
          </button>
        </Link>
      )}
    </div>
  );
}

function CTASection() {
  return (
    <div className="flex flex-col mx-16 items-center mt-[120px] gap-6">
      <h2 className="font-bold text-2xl text-center">
        Boost Your Content Creation
        <span className="text-purple-600"> with Ease and Precision!</span>
      </h2>
      <p className="text-center text-sm w-[550px] max-sm:w-full text-slate-500">
        Generate high-quality content effortlessly. With customizable templates,
        real-time analytics, and flexible subscription options, you’ll have
        everything you need to elevate your content strategy. Get started and
        see the difference!
      </p>
      <button
        className="block px-9 py-3 text-sm font-medium text-white bg-purple-600
        transition focus:outline-none rounded-lg hover:bg-primary-dark"
        type="button"
      >
        {`Start Creating Now!`}
      </button>
    </div>
  );
}

function KeyFeatures() {
  const features = [
    {
      title: "Customized Content Generation",
      description:
        "Create tailored content easily with our customizable templates and options, including dropdowns and validation to ensure high-quality results.",
      icon: <FaCog size={24} />,
    },
    {
      title: "Real-Time Analytics Dashboard",
      description:
        "Track your content generation with a comprehensive dashboard displaying real-time statistics, visual charts, and a recent history section in a responsive layout.",
      icon: <FaChartBar size={24} />,
    },
    {
      title: "Flexible Subscription and Usage Tracking",
      description:
        "Enjoy a free plan with word count tracking and upgrade to pro for unlimited content generation. Restrictions on the free plan encourage flexibility and choice.",
      icon: <FaLock size={24} />,
    },
  ];

  return (
    <div className="mt-12 text-center bg-slate-50 p-14">
      <h2 className="text-2xl font-bold mb-6">Key Features</h2>
      <p className="text-slate-500 mb-10">
        Explore powerful features designed to simplify content creation and
        management.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-7">
        {features.map((feature, index) => (
          <div key={index} className="transition shadow-none">
            <div className="flex items-center justify-center">
              <div className="p-5 rounded-full border-none bg-purple-200 text-purple-600">
                {feature.icon}
              </div>
            </div>
            <h3 className="mt-9 font-semibold text-[18px]">{feature.title}</h3>
            <p className="text-slate-500 mt-3 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <div className="mx-8  text-center p-8 py-14">
      <h2 className="text-2xl font-bold mb-6">Pricing Plans</h2>
      <p className="text-slate-500 mb-8">
        Choose the plan that suits you best. Enjoy a seamless note-taking
        experience!
      </p>
      <div className=" flex justify-center w-full max-sm:flex-col  gap-10 mt-12">
        {/* Free Plan */}
        <PlanCard
          title="Free Plan"
          price="$0"
          features={[
            "Access to 5 Templates",
            "Generate up to 1,000 words per month",
            "Basic Customer Support",
            "Standard Content Tone",
            "Limited Word Count Tracking",
          ]}
          buttonLabel="Get Started for Free"
          isPro={false}
        />
        <PlanCard
          title="Pro Plan"
          price="$9,99"
          features={[
            "Unlimited Access to All 14 Templates",
            "Generate up to 100,000 words per month.",
            "Priority Customer Support",
            "Custom Content Tone",
            "Priority Customer Support",
          ]}
          buttonLabel="Get Started"
          isPro={true}
        />
        {/* Pro Plan */}
      </div>
    </div>
  );
}

interface PlanProps {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  isPro: boolean;
}

function PlanCard({ title, price, features, buttonLabel, isPro }: PlanProps) {
  return (
    <div
      className={` rounded-lg shadow-lg 
        px-10 flex flex-col gap-3 relative  mt-6  pt-6 pb-10   w-[30%] max-sm:w-full`}
    >
      {/* plan and price */}
      <div className="mt-5">
        <h3 className="text-xl  text-center">{title}</h3>
        <div className="text-[32px] font-semibold text-center mb-8">
          {price}
        </div>
      </div>

      {/* Features */}
      <ul className={`mb-6 flex gap-3 flex-col   `}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <IoCheckmarkCircle className="text-purple-600" />
            <span className={` `}>{feature}</span>
          </li>
        ))}
      </ul>
      {isPro && (
        <button
          className={`w-full py-2 px-4 rounded text-white ${
            isPro ? "bg-purple-600" : "bg-gray-500"
          } hover:opacity-90 transition duration-300`}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
