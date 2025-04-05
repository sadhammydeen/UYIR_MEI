import React, { useEffect } from 'react';
import VoiceControl from '@/components/voice/VoiceControl';
import SessionInfo from '@/components/voice/SessionInfo';
import { useSession } from '@/contexts/SessionContext';

const VoiceSessionDemo: React.FC = () => {
  const { logActivity } = useSession();

  useEffect(() => {
    logActivity('voice_demo_page_visited');
  }, [logActivity]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Voice Integration & Session Tracking</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Demo of basic voice recognition, text-to-speech, and session tracking
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <VoiceControl />
          </div>
          <div>
            <SessionInfo />
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How to use:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Start Listening" to begin voice recognition</li>
            <li>Speak into your microphone and see the text appear in real-time</li>
            <li>Click "Stop Listening" when you're done speaking</li>
            <li>Type text in the input field and click "Speak" to have the computer read it out loud</li>
            <li>Use "Stop" to interrupt text-to-speech</li>
            <li>Check the Session Information panel to see your session data and activity history</li>
          </ol>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> Voice features require browser permissions for microphone access.
              All session data is stored locally and not shared with external services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSessionDemo; 