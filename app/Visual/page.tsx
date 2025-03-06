'use client'
import { useState, useEffect } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react"
import { useRouter } from "next/navigation";    
import Image from 'next/image';

const Visual = () => {
  const [query, setQuery] = useState('');
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const generateDiagram = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);
  //   setDiagramUrl(null);

  //   try {
  //     const response = await fetch('https://vidyagiribackend.vercel.app/diagram', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ query }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     if (data.message && data.message.image) {
  //       setDiagramUrl(data.message.image);
  //     } else {
  //       throw new Error('No diagram URL in response');
  //     }
  //   } catch (err: Error | any) {
  //     console.error('Diagram generation error:', err);
  //     setError(err.message || 'Failed to generate diagram');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const generateDiagram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDiagramUrl(null);
  
    try {
      const response = await fetch('https://vidyagiribackend.vercel.app/diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: { message?: { image?: string } } = await response.json();
  
      if (data.message?.image) {
        setDiagramUrl(data.message.image);
      } else {
        throw new Error('No diagram URL in response');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate diagram';
  
      console.error('Diagram generation error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
    <section className="min-h-screen pt-32 pb-16 bg-[#f0f9f0] flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full  bg-white p-6 rounded-lg shadow-lg border border-emerald-200">
        <h2 className="text-3xl font-bold text-emerald-700 text-center mb-6">Diagram Generator</h2>
        <form onSubmit={generateDiagram} className="space-y-6">
          {/* Textarea for input query */}
          <textarea
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Describe the concept for diagram generation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            required
          />

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isLoading || !query}
            className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Diagram'}
          </button>
        </form>

        {/* Error Handling */}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        {/* Diagram Display */}
        {diagramUrl && (
          <div className="mt-10 p-6 bg-emerald-50 rounded-lg shadow-md border border-emerald-200">
            <h3 className="text-2xl font-bold text-emerald-700 mb-4">Generated Diagram</h3>
            <div className="prose max-w-none mb-6">
              <Image src={diagramUrl} alt="Generated Diagram" className="max-w-full h-auto rounded" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Visual;
