'use client';

import { useSession } from 'next-auth/react';
import VideoFeed from './components/VideoFeed';
import { IVideo } from '@/models/Video';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (session) {
        try {
          const res = await fetch('/api/video');
          if (res.ok) {
            const data = await res.json();
            setVideos(data);
          }
        } catch (error) {
          console.error('Failed to fetch videos', error);
        }
      }
    };

    fetchVideos();
  }, [session]);

  return (
    <main className="container mx-auto px-4 py-8">
      {session ? (
        <VideoFeed videos={videos} />
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to FrameFlow AI</h1>
          <p className="text-lg text-gray-600">Please log in to view the video feed.</p>
        </div>
      )}
    </main>
  );
}

