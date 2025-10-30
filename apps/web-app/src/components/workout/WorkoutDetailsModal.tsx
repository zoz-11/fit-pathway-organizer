import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Target, Flame } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { useState } from "react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  thumbnailUrl: string;
  videoUrl?: string;
  description: string;
}

interface WorkoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: () => void;
}

export const WorkoutDetailsModal = ({
  isOpen,
  onClose,
  onStartWorkout,
}: WorkoutDetailsModalProps) => {
  const { t } = useLanguage();
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const exercises: Exercise[] = [
    {
      name: t("workoutDetails.exercises.pushups.name"),
      sets: 3,
      reps: "10-15",
      thumbnailUrl: "https://example.com/pushup_thumbnail.jpg",
      videoUrl: "https://example.com/pushup_demo.mp4",
      description:
        t("workoutDetails.exercises.pushups.description"),
    },
    {
      name: t("workoutDetails.exercises.pullups.name"),
      sets: 3,
      reps: "5-10",
      thumbnailUrl: "https://example.com/pullup_thumbnail.jpg",
      videoUrl: "https://example.com/pullup_demo.mp4",
      description: t("workoutDetails.exercises.pullups.description"),
    },
    {
      name: t("workoutDetails.exercises.benchPress.name"),
      sets: 4,
      reps: "8-12",
      thumbnailUrl: "https://example.com/benchpress_thumbnail.jpg",
      videoUrl: "https://example.com/benchpress_demo.mp4",
      description:
        t("workoutDetails.exercises.benchPress.description"),
    },
    {
      name: t("workoutDetails.exercises.shoulderPress.name"),
      sets: 3,
      reps: "10-12",
      thumbnailUrl: "https://example.com/shoulderpress_thumbnail.jpg",
      videoUrl: "https://example.com/shoulderpress_demo.mp4",
      description: t("workoutDetails.exercises.shoulderPress.description"),
    },
    {
      name: t("workoutDetails.exercises.bicepCurls.name"),
      sets: 3,
      reps: "12-15",
      thumbnailUrl: "https://example.com/bicepcurl_thumbnail.jpg",
      videoUrl: "https://example.com/bicepcurl_demo.mp4",
      description: t("workoutDetails.exercises.bicepCurls.description"),
    },
    {
      name: t("workoutDetails.exercises.tricepDips.name"),
      sets: 3,
      reps: "8-12",
      thumbnailUrl: "https://example.com/tricepdip_thumbnail.jpg",
      videoUrl: "https://example.com/tricepdip_demo.mp4",
      description: t("workoutDetails.exercises.tricepDips.description"),
    },
  ];

  const handleStartWorkout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(t("workoutDetails.toast.startWorkout"));
    onStartWorkout();
    onClose();
  };

  const handleWatchDemo = (exercise: Exercise, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (exercise.videoUrl) {
      setPlayingVideo(exercise.videoUrl);
    } else {
      toast.error(t("workoutDetails.toast.noVideo", { exerciseName: exercise.name }));
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleCloseButton = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {t("workoutDetails.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-card rounded-lg border border-blue-100 dark:border-blue-900">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">{t("workoutDetails.duration")}</p>
              <p className="text-lg font-bold text-blue-600">{t("workoutDetails.durationValue")}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-card rounded-lg border border-green-100 dark:border-green-900">
              <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">{t("workoutDetails.exercisesLabel")}</p>
              <p className="text-lg font-bold text-green-600">{t("workoutDetails.exercisesValue")}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-card rounded-lg border border-orange-100 dark:border-orange-900">
              <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">{t("workoutDetails.difficulty")}</p>
              <p className="text-lg font-bold text-orange-600">{t("workoutDetails.difficultyValue")}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-card rounded-lg border border-purple-100 dark:border-purple-900">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">{t("workoutDetails.target")}</p>
              <p className="text-lg font-bold text-purple-600">{t("workoutDetails.targetValue")}</p>
            </div>
          </div>

          {/* Video Player Section */}
          {playingVideo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t("assignedWorkouts.videoPreview")}</h3>
                <Button variant="ghost" size="sm" onClick={() => setPlayingVideo(null)}>
                  Close
                </Button>
              </div>
              <VideoPlayer
                videoUrl={playingVideo}
                title={t("assignedWorkouts.videoPreview")}
                isOpen={!!playingVideo}
                onClose={() => setPlayingVideo(null)}
              />
            </div>
          )}

          {/* Exercise List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("workoutDetails.exercises.title")}</h3>
            {exercises.map((exercise) => (
              <div
                key={exercise.name}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">💪</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg text-gray-900 truncate">
                        {exercise.name}
                      </h4>
                      <div className="flex space-x-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {exercise.sets} {t("workoutDetails.sets")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {exercise.reps} {t("workoutDetails.reps")}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {exercise.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleWatchDemo(exercise, e)}
                        className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900"
                      >
                        <Play className="h-4 w-4 me-1" />
                        {t("workoutDetails.watchDemoButton")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleStartWorkout}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
            >
              <Play className="h-4 w-4 me-2" />
              {t("workoutDetails.startButton")}
            </Button>
            <Button
              variant="outline"
              size="default"
              onClick={handleCloseButton}
              className="hover:bg-gray-50"
            >
              {t("workoutDetails.closeButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
