import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface WorkoutTimerProps {
  sessionId: string;
  onComplete: (duration: number, exercisesCompleted: any[]) => void;
  onPause: () => void;
}

export const WorkoutTimer = ({ sessionId, onComplete, onPause }: WorkoutTimerProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsPaused(true);
    onPause();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleComplete = () => {
    setIsRunning(false);
    onComplete(time, []); // Empty exercises array for now
  };

  const handleReset = () => {
    setTime(0);
    setIsPaused(false);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardContent className="p-4">
        <div className="text-center space-y-4">
          <div className="text-3xl font-mono font-bold text-blue-600">
            {formatTime(time)}
          </div>
          
          <div className="flex justify-center gap-2">
            {isPaused ? (
              <Button onClick={handleResume} size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
            ) : (
              <Button onClick={handlePause} size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            )}
            
            <Button onClick={handleComplete} size="sm" className="bg-red-600 hover:bg-red-700">
              <Square className="h-4 w-4 mr-1" />
              Complete
            </Button>
            
            <Button onClick={handleReset} size="sm" variant="outline">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Session ID: {sessionId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 