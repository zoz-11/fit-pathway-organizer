import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Search, Filter } from "lucide-react";
import { useExercises } from "@/hooks/useExercises";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExerciseLibrary = () => {
  const { t } = useLanguage();
  const { data: exercises, isLoading } = useExercises();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string>("all");
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");

  const categories = ["all", "strength", "cardio", "flexibility", "balance", "sports"];
  const workoutTypes = ["all", "bodyweight", "machine", "barbell", "dumbbell", "cable", "resistance_band", "other"];

  const filteredExercises = exercises?.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesWorkoutType = selectedWorkoutType === "all" || exercise.workout_type === selectedWorkoutType;
    return matchesSearch && matchesCategory && matchesWorkoutType;
  });

  const handlePlayVideo = (youtubeLink: string) => {
    setSelectedVideoUrl(youtubeLink);
    setVideoModalOpen(true);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <PageLayout
          title={t("exerciseLibrary.title")}
          description={t("exerciseLibrary.description")}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </PageLayout>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageLayout
        title={t("exerciseLibrary.title")}
        description={t("exerciseLibrary.description")}
      >
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("exerciseLibrary.filters.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("exerciseLibrary.filters.category")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? t("exerciseLibrary.filters.all") : t(`exerciseLibrary.categories.${cat}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedWorkoutType} onValueChange={setSelectedWorkoutType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("exerciseLibrary.filters.workoutType")} />
            </SelectTrigger>
            <SelectContent>
              {workoutTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? t("exerciseLibrary.filters.all") : t(`exerciseLibrary.workoutTypes.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Exercise Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises && filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-muted">
                  {exercise.youtube_link ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={`https://img.youtube.com/vi/${exercise.youtube_link.split("v=")[1]?.split("&")[0] || exercise.youtube_link.split("/").pop()}/mqdefault.jpg`}
                        alt={exercise.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="lg"
                          onClick={() => handlePlayVideo(exercise.youtube_link!)}
                          className="rounded-full"
                        >
                          <Play className="h-6 w-6 mr-2" />
                          {t("exerciseLibrary.card.playVideo")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {t("exerciseLibrary.card.noVideo")}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                    {exercise.difficulty_level && (
                      <Badge variant="outline" className="shrink-0">
                        {t("exerciseLibrary.card.difficulty", { level: exercise.difficulty_level })}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">
                      {t(`exerciseLibrary.categories.${exercise.category}`)}
                    </Badge>
                    {exercise.workout_type && (
                      <Badge variant="outline">
                        {t(`exerciseLibrary.workoutTypes.${exercise.workout_type}`)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exercise.description}
                  </p>
                  {exercise.video_duration && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("exerciseLibrary.card.duration", { 
                        minutes: Math.floor(exercise.video_duration / 60) 
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">{t("exerciseLibrary.noExercises")}</p>
            </div>
          )}
        </div>

        {/* Video Modal */}
        <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{t("exerciseLibrary.card.playVideo")}</DialogTitle>
            </DialogHeader>
            {selectedVideoUrl && (
              <VideoPlayer url={selectedVideoUrl} />
            )}
          </DialogContent>
        </Dialog>
      </PageLayout>
    </AppLayout>
  );
};

export default ExerciseLibrary;
