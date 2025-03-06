'use client'
import React, { useState, useRef, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown, Play, Pause, StopCircle, RefreshCw } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Source {
  title: string;
  link: string;
}

interface ResponseData {
  answer: string;
  sources?: Source[];
  followUpQuestions?: string[];
}

const learningStyles = [
  { id: "visual", name: "👀 Visual" },
  { id: "auditory", name: "🎧 Auditory" },
  { id: "readWrite", name: "📖 Reading/Writing" },
  { id: "kinesthetic", name: "🖐️ Kinesthetic" },
];

// Define available playback speed options.
const playbackOptions = [
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "1x" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 1.75, label: "1.75x" },
  { value: 2, label: "2x" },
];

const Audio: React.FC = () => {
  const [message, setMessage] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(learningStyles[1]); // Default to "Auditory"
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Current progress in seconds
  const [totalDuration, setTotalDuration] = useState(0); // Estimated total duration in seconds
  const [sliderValue, setSliderValue] = useState(0); // For the draggable progress bar (0–100)
  const [, setIsDragging] = useState(false);
  // Instead of a slider for speed, use a dropdown:
  const [selectedRate, setSelectedRate] = useState(playbackOptions[2]); // Default to "1x"

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Clean up on component unmount.
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  /**
   * Update the progress based on elapsed time.
   * @param offset - The offset (in seconds) when speech resumed/restarted.
   * @param remainingDuration - The remaining duration for the current utterance.
   * @param fullDuration - The full estimated duration of the text.
   */
  const updateProgress = (offset: number, remainingDuration: number, fullDuration: number) => {
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const newOverallTime = offset + elapsed;
    if (newOverallTime >= fullDuration) {
      setCurrentTime(fullDuration);
      setSliderValue(100);
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
    setCurrentTime(newOverallTime);
    setSliderValue((newOverallTime / fullDuration) * 100);
    animationFrameRef.current = requestAnimationFrame(() =>
      updateProgress(offset, remainingDuration, fullDuration)
    );
  };

  /**
   * Speaks the given text from a specified offset and at a given rate.
   * @param text - The text to speak.
   * @param offset - The offset (in seconds) to start from.
   * @param customRate - Optional custom rate (if not provided, uses the selected dropdown rate).
   */
  const speakText = (text: string, offset: number = 0, customRate?: number) => {
    stopSpeech();
    if (!text.trim()) return;

    // Use the custom rate if provided, otherwise use the selected dropdown rate.
    const effectiveRate = customRate !== undefined ? customRate : selectedRate.value;
    // Adjust estimated duration based on the effective rate.
    const fullDurationLocal = text.length / (15 * effectiveRate);

    if (offset === 0) {
      setTotalDuration(fullDurationLocal);
      setCurrentTime(0);
      setSliderValue(0);
    }

    // Determine the starting index in the text based on the offset.
    const startIndex = Math.floor((offset / fullDurationLocal) * text.length);
    const remainingText = text.substring(startIndex);
    const remainingDuration = remainingText.length / (15 * effectiveRate);

    const utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.lang = "en-US";
    utterance.rate = effectiveRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      startTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(() =>
        updateProgress(offset, remainingDuration, fullDurationLocal)
      );
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(fullDurationLocal);
      setSliderValue(100);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pauseSpeech = () => {
    speechSynthesis.pause();
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const resumeSpeech = () => {
    // Resume the progress updater from the current progress.
    startTimeRef.current = performance.now();
    const remainingDuration = totalDuration - currentTime;
    animationFrameRef.current = requestAnimationFrame(() =>
      updateProgress(currentTime, remainingDuration, totalDuration)
    );
    speechSynthesis.resume();
    setIsPlaying(true);
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentTime(0);
    setSliderValue(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const submitQuery = async (query: string) => {
    if (!query.trim()) return;

    // Stop any ongoing speech.
    stopSpeech();

    setLoading(true);
    setResponseData(null);

    try {
      const res = await fetch("http://localhost:3005/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          preferredStyle: selectedStyle.id,
        }),
      });

      const data: ResponseData = await res.json();
      setResponseData(data);
      // Start speaking from the beginning.
      speakText(data.answer, 0);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setLoading(false);
  };

  // Called when the user releases the draggable progress bar.
  const handleSeek = (percentage: number) => {
    if (responseData) {
      const newTime = (percentage / 100) * totalDuration;
      setCurrentTime(newTime);
      setSliderValue(percentage);
      speakText(responseData.answer, newTime);
    }
  };

  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  console.log(user?.publicMetadata.preference);

  useEffect(() => {
    if(isLoaded && !userId){
      router.push("/sign-in");
    }
  }, [userId, isLoaded, router]);

  return (
    <section className="pt-32 pb-16 bg-green-100">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Speech Synthesis</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitQuery(message);
          }}
          className="space-y-6"
        >
          <textarea
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your question here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />

          {/* Custom Dropdown for Preferred Learning Style */}
          <div>
            <label className="block mb-2 font-semibold text-green-900">Preferred Learning Style:</label>
            <Listbox value={selectedStyle} onChange={setSelectedStyle}>
              <div className="relative">
                <Listbox.Button className="w-full bg-white border border-green-300 rounded-lg shadow-md px-4 py-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-600">
                  {selectedStyle.name}
                  <ChevronDown className="h-5 w-5 text-green-500" />
                </Listbox.Button>

                <Listbox.Options className="absolute mt-2 w-full bg-white border border-green-300 rounded-lg shadow-lg max-h-60 overflow-auto z-10">
                  {learningStyles.map((style) => (
                    <Listbox.Option
                      key={style.id}
                      value={style}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-3 ${
                          active ? "bg-green-500 text-white" : "text-gray-900"
                        } flex items-center justify-between`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span>{style.name}</span>
                          {selected && <Check className="h-5 w-5 text-white" />}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        {/* Speech Control Section */}
        {responseData && (
          <div className="mt-6">
            {/* Draggable Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => {
                  setSliderValue(Number(e.target.value));
                  setIsDragging(true);
                }}
                onMouseUp={() => {
                  handleSeek(sliderValue);
                  setIsDragging(false);
                }}
                onTouchEnd={() => {
                  handleSeek(sliderValue);
                  setIsDragging(false);
                }}
                className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-green-600 mt-1">
                <span>{`${Math.floor(currentTime)}s`}</span>
                <span>{`${Math.floor(totalDuration)}s`}</span>
              </div>
            </div>

            {/* Control Buttons and Speed Dropdown */}
            <div className="flex justify-center items-center gap-4">
              {/* Restart Button */}
              <button
                onClick={() => responseData && speakText(responseData.answer, 0)}
                className="p-3 bg-green-500 text-white rounded-full hover:scale-105 transition-all"
                title="Restart"
              >
                <RefreshCw size={24} />
              </button>
              {/* Play/Pause Toggle */}
              {isPlaying ? (
                <button
                  onClick={pauseSpeech}
                  className="p-3 bg-lime-500 text-white rounded-full hover:scale-105 transition-all"
                  title="Pause"
                >
                  <Pause size={24} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (speechSynthesis.paused) {
                      resumeSpeech();
                    } else if (responseData) {
                      speakText(responseData.answer, currentTime);
                    }
                  }}
                  className="p-3 bg-emerald-500 text-white rounded-full hover:scale-105 transition-all"
                  title="Play"
                >
                  <Play size={24} />
                </button>
              )}
              {/* Stop Button */}
              <button
                onClick={stopSpeech}
                className="p-3 bg-red-500 text-white rounded-full hover:scale-105 transition-all"
                title="Stop"
              >
                <StopCircle size={24} />
              </button>

              {/* Speed Dropdown */}
              <div className="relative">
                <Listbox
                  value={selectedRate}
                  onChange={(option) => {
                    setSelectedRate(option);
                    // If speech is playing, restart it with the new rate.
                    if (responseData && isPlaying) {
                      speakText(responseData.answer, currentTime, option.value);
                    }
                  }}
                >
                  <Listbox.Button className="px-2 py-1 bg-green-100 border border-green-300 rounded-md text-sm">
                    {selectedRate.label}
                    <ChevronDown className="inline h-4 w-4 ml-1 text-green-600" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-20 bg-white border border-green-300 rounded-md shadow-lg">
                    {playbackOptions.map((option) => (
                      <Listbox.Option key={option.value} value={option}>
                        {({ active }) => (
                          <div
                            className={`cursor-pointer px-2 py-1 text-sm ${
                              active ? "bg-green-500 text-white" : "text-gray-900"
                            }`}
                          >
                            {option.label}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
            </div>
          </div>
        )}

        {/* Display Sources & Follow-Up Questions */}
        {responseData && (
          <div className="mt-10 p-6 bg-white rounded-lg shadow-md border border-green-200">
            {responseData.sources && responseData.sources.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2 text-green-800">Sources:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {responseData.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source.link}
                        className="text-green-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {responseData.followUpQuestions && responseData.followUpQuestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-2 text-green-800">Follow-Up Questions:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {responseData.followUpQuestions.map((q, index) => (
                    <li
                      key={index}
                      className="cursor-pointer text-green-600 hover:underline"
                      onClick={() => submitQuery(q)}
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Audio;