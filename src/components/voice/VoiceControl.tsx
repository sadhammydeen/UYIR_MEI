import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoice } from '@/contexts/VoiceContext';
import { useSession } from '@/contexts/SessionContext';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export const VoiceControl: React.FC = () => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    speak, 
    cancelSpeech, 
    isSpeaking,
    isVoiceSupported,
    error 
  } = useVoice();
  
  const { logActivity } = useSession();
  const [textToSpeak, setTextToSpeak] = useState('');

  const handleStartListening = () => {
    startListening();
    logActivity('voice_control_start_listening');
  };

  const handleStopListening = () => {
    stopListening();
    logActivity('voice_control_stop_listening');
  };

  const handleSpeak = () => {
    if (textToSpeak.trim()) {
      speak(textToSpeak);
      logActivity('voice_control_speak', { text: textToSpeak });
    }
  };

  const handleCancelSpeech = () => {
    cancelSpeech();
    logActivity('voice_control_cancel_speech');
  };

  if (!isVoiceSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Voice Control</CardTitle>
          <CardDescription>Voice features are not supported in this browser</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Voice Control</CardTitle>
        <CardDescription>Control using your voice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Speech Recognition</h3>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? handleStopListening : handleStartListening}
                disabled={!isVoiceSupported}
              >
                {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isListening ? 'Stop' : 'Start'} Listening
              </Button>
            </div>
          </div>
          <div className="border rounded-md p-3 min-h-24 bg-muted/50">
            {transcript || 'Your speech will appear here...'}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Text to Speech</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter text to speak..."
              value={textToSpeak}
              onChange={(e) => setTextToSpeak(e.target.value)}
              disabled={isSpeaking}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={handleSpeak}
              disabled={isSpeaking || !textToSpeak.trim()}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Speak
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancelSpeech}
              disabled={!isSpeaking}
            >
              <VolumeX className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Session activity is being tracked for analytics.
      </CardFooter>
    </Card>
  );
};

export default VoiceControl; 