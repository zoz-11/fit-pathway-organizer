-- Performance optimization indexes for high-traffic queries
-- These indexes will significantly improve query performance

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_recipient_created 
ON messages(recipient_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_sender_created 
ON messages(sender_id, created_at DESC);

-- Workout schedules indexes  
CREATE INDEX IF NOT EXISTS idx_workout_schedules_athlete_date 
ON workout_schedules(athlete_id, scheduled_date DESC);

CREATE INDEX IF NOT EXISTS idx_workout_schedules_trainer_date 
ON workout_schedules(trainer_id, scheduled_date DESC);

CREATE INDEX IF NOT EXISTS idx_workout_schedules_status 
ON workout_schedules(status) WHERE status != 'completed';

-- Trainer-athlete relationship indexes
CREATE INDEX IF NOT EXISTS idx_trainer_athletes_trainer_status 
ON trainer_athletes(trainer_id, status);

CREATE INDEX IF NOT EXISTS idx_trainer_athletes_athlete_status 
ON trainer_athletes(athlete_id, status);

-- Exercise completions indexes
CREATE INDEX IF NOT EXISTS idx_exercise_completions_athlete_date 
ON exercise_completions(athlete_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_exercise_completions_workout 
ON exercise_completions(workout_id, athlete_id);

-- Profiles indexes for lookups
CREATE INDEX IF NOT EXISTS idx_profiles_trainer 
ON profiles(trainer_id) WHERE trainer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON profiles(role);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created 
ON audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created 
ON audit_logs(action, created_at DESC);

-- Analyze tables to update statistics for query planner
ANALYZE messages;
ANALYZE workout_schedules;
ANALYZE trainer_athletes;
ANALYZE exercise_completions;
ANALYZE profiles;
ANALYZE audit_logs;