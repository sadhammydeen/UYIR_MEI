import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/contexts/SessionContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const SessionInfo: React.FC = () => {
  const { sessionId, startTime, lastActivity, activitiesLog } = useSession();

  const sessionDuration = () => {
    const now = new Date();
    const durationMs = now.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getActivityIcon = (activity: string) => {
    if (activity.includes('voice_recognition')) {
      return '🎤';
    } else if (activity.includes('text_to_speech')) {
      return '🔊';
    } else {
      return '📝';
    }
  };

  const formatActivityName = (activity: string) => {
    return activity
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Session Information</CardTitle>
        <CardDescription>Tracking your current session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Session ID</p>
          <p className="text-xs text-muted-foreground break-all">{sessionId}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm">{sessionDuration()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Activity</p>
            <p className="text-sm">{formatDistanceToNow(lastActivity, { addSuffix: true })}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Activity Log ({activitiesLog.length})</p>
          <ScrollArea className="h-60 rounded-md border">
            <div className="p-4 space-y-2">
              {activitiesLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activities recorded yet.</p>
              ) : (
                [...activitiesLog].reverse().map((entry, index) => (
                  <div key={index} className="border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {getActivityIcon(entry.activity)} {formatActivityName(entry.activity)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    {entry.details && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Object.entries(entry.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}: </span>
                            {typeof value === 'string' && value.length > 30
                              ? `${value.substring(0, 30)}...`
                              : String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionInfo; 