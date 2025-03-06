'use client'
import { useState, useEffect} from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs"

// Types
type VarkScores = {
  Visual: number
  Aural: number
  Read_Write: number
  Kinesthetic: number
}

type LearningPreference = "Visual" | "Aural" | "Read/Write" | "Kinesthetic" | "Multimodal"

type Question = {
  id: number
  text: string
  options: {
    value: string
    label: string
  }[]
}

const VARK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "You are helping someone who wants to go to your airport, the center of town or railway station. You would:",
    options: [
      { value: "K", label: "Go with her." },
      { value: "V", label: "Draw, or show her a map." },
      { value: "R", label: "Write down the directions." },
      { value: "A", label: "Tell her the directions." },
    ],
  },
  {
    id: 2,
    text: "A website has a video showing how to make a special graph. There is a person speaking, some lists and words describing what to do and some diagrams. You would learn most from:",
    options: [
      { value: "R", label: "Reading the words." },
      { value: "A", label: "Listening." },
      { value: "K", label: "Watching the actions." },
      { value: "V", label: "Seeing the diagrams." },
    ],
  },
  {
    id: 3,
    text: "You are planning a vacation for a group. You want some feedback from them about the plan. You would:",
    options: [
      { value: "V", label: "Use a map or website to show them the places." },
      { value: "R", label: "Give them a copy of the printed itinerary." },
      { value: "K", label: "Phone, text or email them." },
      { value: "A", label: "Describe some of the highlights." },
    ],
  },
  {
    id: 4,
    text: "You are going to cook something as a special treat. You would:",
    options: [
      { value: "K", label: "Cook something you know without the need for instructions." },
      { value: "V", label: "Look through the cookbook for ideas from the pictures." },
      { value: "R", label: "Refer to a specific cookbook where there is a good recipe." },
      { value: "A", label: "Ask friends for suggestions." },
    ],
  },
  {
    id: 5,
    text: "A group of tourists want to learn about the parks or wildlife reserves in your area. You would:",
    options: [
      { value: "V", label: "Show them maps and internet pictures." },
      { value: "R", label: "Give them a book or pamphlets about the parks or wildlife reserves." },
      { value: "K", label: "Take them to a park or wildlife reserve and walk with them." },
      { value: "A", label: "Talk about, or arrange a talk for them about parks or wildlife reserves." },
    ],
  },
  {
    id: 6,
    text: "You are about to purchase a digital camera or mobile phone. Other than price, what would most influence your decision?",
    options: [
      { value: "K", label: "Trying or testing it." },
      { value: "R", label: "Reading the details about its features." },
      { value: "A", label: "It is a modern design and looks good." },
      { value: "V", label: "The salesperson telling me about its features." },
    ],
  },
  {
    id: 7,
    text: "Remember a time when you learned how to do something new. Try to avoid choosing a physical skill, e.g. riding a bike. You learned best by:",
    options: [
      { value: "K", label: "Watching a demonstration." },
      { value: "A", label: "Listening to somebody explaining it and asking questions." },
      { value: "V", label: "Diagrams and charts - visual clues." },
      { value: "R", label: "Written instructions – e.g. a manual or textbook." },
    ],
  },
  {
    id: 8,
    text: "You have a problem with your heart. You would prefer that the doctor:",
    options: [
      { value: "V", label: "Used a plastic model to show what was wrong." },
      { value: "R", label: "Gave you something to read to explain what was wrong." },
      { value: "K", label: "Showed you a diagram of what was wrong." },
      { value: "A", label: "Described what was wrong." },
    ],
  },
  {
    id: 9,
    text: "You want to learn a new program, skill or game on a computer. You would:",
    options: [
      { value: "A", label: "Talk with people who know about the program." },
      { value: "V", label: "Read the written instructions that came with the program." },
      { value: "K", label: "Use the controls or keyboard." },
      { value: "R", label: "Follow the diagrams in the book that came with it." },
    ],
  },
  {
    id: 10,
    text: "I like websites that have:",
    options: [
      { value: "K", label: "Things I can click on, shift or try." },
      { value: "A", label: "Interesting design and visual features." },
      { value: "R", label: "Interesting written descriptions, lists and explanations." },
      { value: "V", label: "Audio channels where I can hear music, radio programs or interviews." },
    ],
  },
  {
    id: 11,
    text: "Other than price, what would most influence your decision to buy a new non-fiction book?",
    options: [
      { value: "R", label: "The way it looks is appealing." },
      { value: "A", label: "Quickly reading parts of it." },
      { value: "K", label: "A friend talks about it and recommends it." },
      { value: "V", label: "It has real-life stories, experiences and examples." },
    ],
  },
  {
    id: 12,
    text: "You are using a book, CD or website to learn how to take photos with your new digital camera. You would like to have:",
    options: [
      { value: "V", label: "Clear written instructions with lists and bullet points about what to do." },
      { value: "K", label: "A chance to ask questions and talk about the camera and its features." },
      { value: "R", label: "Diagrams showing the camera and what each part does." },
      { value: "A", label: "Many examples of good and poor photos and how to improve them." },
    ],
  },
  {
    id: 13,
    text: "Do you prefer a teacher or a presenter who uses:",
    options: [
      { value: "K", label: "Demonstrations, models or practical sessions." },
      { value: "V", label: "Question and answer, talk, group discussion, or guest speakers." },
      { value: "A", label: "Handouts, books, or readings." },
      { value: "R", label: "Diagrams, charts or graphs." },
    ],
  },
  {
    id: 14,
    text: "You have finished a competition or test and would like some feedback. You would like to have feedback:",
    options: [
      { value: "A", label: "Using examples from what you have done." },
      { value: "R", label: "Using a written description of your results." },
      { value: "K", label: "From somebody who talks it through with you." },
      { value: "V", label: "Using graphs showing what you had achieved." },
    ],
  },
  {
    id: 15,
    text: "You are going to choose food at a restaurant or cafe. You would:",
    options: [
      { value: "V", label: "Look at what others are eating or look at pictures of each dish." },
      { value: "K", label: "Choose from the descriptions in the menu." },
      { value: "A", label: "Listen to the waiter or ask friends to recommend choices." },
      { value: "R", label: "Choose something that you have had there before." },
    ],
  },
  {
    id: 16,
    text: "You have to make an important speech at a conference or special occasion. You would:",
    options: [
      { value: "A", label: "Make diagrams or get graphs to help explain things." },
      { value: "R", label: "Write a few key words and practice saying your speech over and over." },
      { value: "K", label: "Write out your speech and learn from reading it over several times." },
      { value: "V", label: "Gather many examples and stories to make the talk real and practical." },
    ],
  },
]

const calculateVarkScores = (selectedOptions: Record<number, string>): VarkScores => {
  const scores = {
    Visual: 0,
    Aural: 0,
    Read_Write: 0,
    Kinesthetic: 0,
  }

  Object.values(selectedOptions).forEach((option) => {
    if (option === "V") scores.Visual++
    if (option === "A") scores.Aural++
    if (option === "R") scores.Read_Write++
    if (option === "K") scores.Kinesthetic++
  })

  return scores
}

// const determineLearningPreference = (scores: VarkScores): LearningPreference => {
//   const entries = Object.entries(scores) as [keyof VarkScores, number][]
//   const maxScore = Math.max(...entries.map(([_, score]) => score))
//   const maxCategories = entries.filter(([_, score]) => score === maxScore).map(([category]) => category)

//   if (maxCategories.length > 1) return "Multimodal"

//   if (maxCategories[0] === "Visual") return "Visual"
//   if (maxCategories[0] === "Aural") return "Aural"
//   if (maxCategories[0] === "Read_Write") return "Read/Write"
//   return "Kinesthetic"
// }

const determineLearningPreference = (scores: VarkScores): LearningPreference => {
  const entries = Object.entries(scores) as [keyof VarkScores, number][];
  const maxScore = Math.max(...entries.map(([, score]) => score)); // `_` removed

  const maxCategories = entries
    .filter(([, score]) => score === maxScore) // `_` removed
    .map(([category]) => category);

  if (maxCategories.length > 1) return "Multimodal";

  switch (maxCategories[0]) {
    case "Visual":
      return "Visual";
    case "Aural":
      return "Aural";
    case "Read_Write":
      return "Read/Write";
    default:
      return "Kinesthetic";
  }
};


const getLearningPreferenceNote = (preference: LearningPreference): string => {
  switch (preference) {
    case "Visual":
      return "You prefer visual learning methods such as diagrams, charts, and maps. Try using color-coding, highlighting, and visual organizers when studying."
    case "Aural":
      return "You learn best through listening and speaking. Consider recording lectures, participating in discussions, and explaining concepts out loud."
    case "Read/Write":
      return "You prefer learning through reading and writing. Take detailed notes, rewrite information in your own words, and use lists to organize your thoughts."
    case "Kinesthetic":
      return "You learn best through hands-on experiences. Try practical exercises, role-playing, and physical activities to reinforce learning."
    case "Multimodal":
      return "You have multiple strong learning preferences. This gives you flexibility to learn in different ways depending on the context."
    default:
      return ""
  }
}

export default function VarkQuestionnaire() {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<{
    scores: VarkScores | null;
    preference: LearningPreference | null;
    note: string | null;
  }>({
    scores: null,
    preference: null,
    note: null,
  });

  

  const handleOptionSelect = (questionId: number, optionValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < VARK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // const sendResultsToBackend = async (results: {
  //   preference: LearningPreference;
  // }) => {
  //   try {
  //     const response = await fetch("http://localhost:3005/result", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //       body: JSON.stringify({
  //         preference: results.preference,
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  
  //     // Check the Content-Type header
  //     const contentType = response.headers.get("content-type");
  //     if (contentType && contentType.includes("application/json")) {
  //       const data = await response.json();
  //       console.log("Results successfully sent to backend:", data);
  //     } else {
  //       const text = await response.text();
  //       console.log("Non-JSON response from backend:", text);
  //     }
  //   } catch (error) {
  //     console.error("Error sending results to backend:", error);
  //   }
  // };

  const sendResultsToBackend = async (results: { preference: LearningPreference }, token: string) => {
    try {
      const response = await fetch("http://localhost:3005/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token here
        },
        credentials: "include",
        body: JSON.stringify({ preference: results.preference }),
      });
  
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (err) {
          console.error("Error parsing error message:", err);
        }
        throw new Error(errorMessage);
      }
  
      const contentType = response.headers.get("content-type")?.toLowerCase();
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("✅ Results successfully sent to backend:", data);
      } else {
        const text = await response.text();
        console.warn("⚠️ Non-JSON response from backend:", text);
      }
    } catch (error) {
      console.error("❌ Error sending results to backend:", error);
    }
  };
  
  const { getToken } = useAuth(); // Import from Clerk

const submitQuestionnaire = async () => {
  // Validation: Ensure all questions are answered
  if (Object.keys(selectedOptions).length !== VARK_QUESTIONS.length) {
    const missingQuestions = VARK_QUESTIONS.filter((q) => !selectedOptions[q.id]).map((q) => q.id);
    alert(`Please select an option for question(s): ${missingQuestions.join(", ")}`);
    return;
  }

  // Calculate the VARK scores and determine the learning preference
  const scores = calculateVarkScores(selectedOptions);
  const preference = determineLearningPreference(scores);
  const note = getLearningPreferenceNote(preference);

  // Set results in state
  setResults({ scores, preference, note });

  try {
    // 🔹 Get the authentication token
    const token = await getToken();

    // 🔹 Send results to the backend with token
    await sendResultsToBackend({ preference }, token ?? "");
  } catch (error) {
    console.error("❌ Failed to submit results:", error);
  }
};

  // const submitQuestionnaire = () => {
  //   // Validation
  //   if (Object.keys(selectedOptions).length !== VARK_QUESTIONS.length) {
  //     const missingQuestions = VARK_QUESTIONS.filter((q) => !selectedOptions[q.id]).map((q) => q.id);

  //     alert(`Please select an option for question(s): ${missingQuestions.join(", ")}`);
  //     return;
  //   }

  //   const scores = calculateVarkScores(selectedOptions);
  //   const preference = determineLearningPreference(scores);
  //   const note = getLearningPreferenceNote(preference);

  //   // Set results in state
  //   setResults({ scores, preference, note });

  //   // Send results to the backend
  //   sendResultsToBackend({ preference });
  // };

  const resetQuestionnaire = () => {
    setSelectedOptions({});
    setCurrentQuestionIndex(0);
    setResults({
      scores: null,
      preference: null,
      note: null,
    });
    router.push("/ask");
  };

  const currentQuestion = VARK_QUESTIONS[currentQuestionIndex];
  const progress = (Object.keys(selectedOptions).length / VARK_QUESTIONS.length) * 100;
  const isCurrentQuestionAnswered = !!selectedOptions[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === VARK_QUESTIONS.length - 1;

  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  console.log(user?.publicMetadata.formSubmitted);

  useEffect(() => {
    if(isLoaded && !userId){
      router.push("/sign-in");
    }
    if(user?.publicMetadata.formSubmitted){
      alert("You have already submitted the questionnaire");
      router.push("/");
    }
  }, [userId, isLoaded, router, user?.publicMetadata.formSubmitted, user]);

  return (
    <div className="min-h-screen bg-[#f0f9f0] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-emerald-100">
        <CardHeader className="bg-emerald-600 text-white text-center rounded-t-lg">
          <CardTitle className="text-2xl font-bold">VARK Learning Styles Questionnaire</CardTitle>
          <CardDescription className="text-emerald-50">
            Complete all 16 questions to discover your learning style
          </CardDescription>
        </CardHeader>

        {!results.preference ? (
          <>
            <CardContent className="p-6 pt-8">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-emerald-700 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-emerald-100" />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-emerald-800">
                  Question {currentQuestionIndex + 1} of {VARK_QUESTIONS.length}
                </h3>
                <p className="text-lg font-medium mb-4 text-emerald-900">{currentQuestion.text}</p>

                <div className="space-y-3 mt-4">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${
                        selectedOptions[currentQuestion.id] === option.value
                          ? "bg-emerald-50 border-emerald-400 shadow-sm"
                          : "border-gray-200 hover:border-emerald-200"
                      }`}
                      onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-600">
                        <div
                          className={`h-2.5 w-2.5 rounded-full bg-emerald-600 ${
                            selectedOptions[currentQuestion.id] === option.value ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                      <label
                        htmlFor={`q${currentQuestion.id}-${option.value}`}
                        className="text-base cursor-pointer leading-tight"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between p-6 pt-0">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={submitQuestionnaire}
                  disabled={!isCurrentQuestionAnswered}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Submit Questionnaire
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                  disabled={!isCurrentQuestionAnswered}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardFooter>
          </>
        ) : (
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-emerald-700">Your Learning Preference</h2>
              <div className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-full text-xl font-semibold">
                {results.preference}
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-emerald-800">Your VARK Scores</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Object.entries(results.scores || {}).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                    <p className="font-medium text-emerald-700 text-sm">{key.replace("_", "/")}</p>
                    <p className="text-emerald-600 font-bold text-2xl">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-emerald-100 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-emerald-800">What This Means</h3>
              <p className="text-emerald-700">{results.note}</p>
            </div>
            <Button onClick={resetQuestionnaire} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Ask AI
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}