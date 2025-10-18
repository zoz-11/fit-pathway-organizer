import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Simple translation function for now
const translations: Record<string, Record<string, string>> = {
  en: {
    "settings.title": "Settings",
    "settings.description": "Manage your app preferences and account settings",
    "settings.language": "Language",
    "settings.language.description": "Choose your preferred language",
    "language.english": "English",
    "language.spanish": "Spanish",
    "language.arabic": "Arabic",
    "language.changed": "Language changed to",
    "settings.notifications": "Notifications",
    "settings.notifications.description":
      "Get notified before scheduled workouts",
    "settings.notifications.progress": "Progress Updates",
    "settings.notifications.progress.description":
      "Weekly progress reports and achievements",
    "settings.notifications.meal": "Meal Reminders",
    "settings.notifications.meal.description":
      "Reminders for meals and hydration",
    "settings.notifications.social": "Social Notifications",
    "settings.notifications.social.description":
      "Messages from trainers and community",
    "settings.privacy": "Privacy & Security",
    "settings.privacy.description": "Control who can see your profile",
    "settings.privacy.data": "Data Sharing",
    "settings.privacy.data.description": "Control how your data is shared",
    "settings.privacy.2fa": "Two-Factor Authentication",
    "settings.privacy.2fa.description": "Add extra security to your account",
    "settings.privacy.password": "Change Password",
    "settings.privacy.password.description": "Update your account password",
    "settings.preferences": "App Preferences",
    "settings.preferences.description": "Switch to dark theme",
    "settings.preferences.units": "Units",
    "settings.preferences.units.description": "Weight and distance units",
    "workout.reminders": "Workout Reminders",
    "progress.updates": "Progress Updates",
    "meal.reminders": "Meal Reminders",
    "social.notifications": "Social Notifications",
    "profile.visibility": "Profile Visibility",
    "data.sharing": "Data Sharing",
    "two.factor.auth": "Two-Factor Authentication",
    // 2FA specific status/messages (English)
    "2fa.enrollment.initiated":
      "2FA enrollment initiated. Please complete setup in your authenticator app.",
    "2fa.disabled": "Two-factor authentication disabled.",
    "2fa.not.found": "No TOTP factor found to disable.",
    "2fa.error": "Failed to enable/disable 2FA.",
    "change.password": "Change Password",
    "dark.mode": "Dark Mode",
    "export.data": "Export Data",
    "contact.support": "Contact Support",
    "delete.account": "Delete Account",
    "sign.out": "Sign Out",
    "sign.out.description": "Sign out of your account",
    "sign.out.success": "Signed out successfully",
    manage: "Manage",
    configure: "Configure",
    loading: "Loading...",
    enabled: "enabled",
    disabled: "disabled",
    disable: "Disable",
    enable: "Enable",
    update: "Update",
    export: "Export",
    contact: "Contact",
    delete: "Delete",
    "units.changed": "Units changed to",
    "data.export.requested": "Data export requested",
    "data.export.description": "Your data will be emailed to you shortly.",
    "data.export.error": "Failed to export data",
    "settings.account": "Account Management",
    "settings.account.description": "Export your data or delete your account",
    "settings.account.support": "Support",
    "settings.account.support.description": "Get help from our support team",
    "settings.account.delete": "Delete Account",
    // Profile visibility translations (cleaned up)
    "profile.visibility.title": "Profile Visibility",
    "profile.visibility.description":
      "Control who can see your profile information",
    "profile.visibility.level": "Visibility Level",
    "profile.visibility.public": "Public - Anyone can see your profile",
    "profile.visibility.connections":
      "Connections Only - Only your connections can see your profile",
    "profile.visibility.private": "Private - Only you can see your profile",
    // Adding password change / update translations
    "password.change.title": "Change Password",
    "password.change.description": "Update your account password",
    "password.change.current": "Current Password",
    "password.change.new": "New Password",
    "password.change.confirm": "Confirm New Password",
    "password.mismatch": "Passwords do not match",
    "password.updated": "Password updated successfully",
    "password.update.error": "Error updating password",
    // Newly added: message displayed when profile visibility is changed
    "profile.visibility.updated": "Profile visibility updated",
    // Data sharing translations (cleaned up)
    "data.sharing.title": "Data Sharing Preferences",
    "data.sharing.description": "Control how your data is shared",
    "data.sharing.analytics": "Analytics Data",
    "data.sharing.analytics.description":
      "Share anonymous usage data to improve the app",
    "data.sharing.thirdparty": "Third-Party Integration",
    "data.sharing.thirdparty.description":
      "Share data with connected third-party services",
    "data.sharing.marketing": "Marketing Communications",
    "data.sharing.marketing.description":
      "Receive personalized offers and updates",
    "data.sharing.updated": "Data sharing preferences updated",
    "support.contact.placeholder": "Describe your issue or question...",
    "support.message.required": "Please enter a message",
    "support.request.sent": "Support request sent",
    "support.request.description":
      "We will respond to your inquiry within 24 hours.",
    "account.deletion.initiated": "Account deletion initiated",
    "account.deletion.description":
      "Your account will be deleted within 30 days.",
    "account.deletion.error": "Failed to delete account",
    "support.contact.title": "Contact Support",
    "support.contact.message": "Message",
    "account.delete.title": "Delete Account",
    "account.delete.confirm": "Are you sure you want to delete your account?",
    cancel: "Cancel",
    "save.changes": "Save Changes",
    "send.message": "Send Message",
    "delete.account.confirm": "Delete Account",
    imperial: "Imperial",
    metric: "Metric",
    // Profile completion banner translations
    "profile.completion.title": "Complete Your Profile",
    "profile.completion.description":
      "Your profile is incomplete. Please update it to get the most out of FitPathway Organizer.",
    "profile.completion.button": "Complete Profile",
    // Profile page translations
    "profile.title": "Profile",
    "profile.description": "Manage your personal information.",
    "profile.picture.title": "Profile Picture",
    "profile.picture.upload.label": "Upload profile picture",
    "profile.personal.title": "Personal Information",
    "profile.edit.label": "Edit profile information",
    "profile.personal.fullName": "Full Name",
    "profile.personal.email": "Email",
    "profile.personal.phone": "Phone",
    "profile.personal.location": "Location",
    "profile.personal.joinDate": "Join Date",
    "profile.personal.fitnessLevel": "Fitness Level",
    "profile.personal.fitnessLevel.placeholder":
      "e.g., Beginner, Intermediate, Advanced",
    "profile.personal.goals": "Fitness Goals",
    "profile.personal.goals.placeholder":
      "e.g., Weight loss, Muscle gain, Endurance",
    "profile.edit.cancel": "Cancel",
    "profile.edit.save": "Save",
    "profile.edit.saving": "Saving...",
    "dashboard.athlete.title": "Athlete Dashboard",
    "dashboard.athlete.welcome": "Welcome back,",
    "dashboard.athlete.defaultName": "Athlete",
    "dashboard.athlete.viewWorkout": "View Upcoming Workout",
    "dashboard.athlete.stats.workoutsCompleted": "Workouts Completed",
    "dashboard.athlete.stats.workoutsDescription": "Great job this month",
    "dashboard.athlete.stats.nextWorkout": "Next Workout",
    "dashboard.athlete.stats.nextWorkoutDescription": "Tomorrow 7:00 AM",
    "dashboard.athlete.stats.currentProgram": "Current Program",
    "dashboard.athlete.stats.programDescription": "Week 3 of 8",
    "dashboard.athlete.stats.achievements": "Achievements",
    "dashboard.athlete.stats.achievementsDescription": "Keep it up!",
    "dashboard.athlete.progress.title": "Your Progress Overview",
    "dashboard.athlete.progress.description":
      "Progress charts and analytics will appear here.",
    "dashboard.trainer.title": "Trainer Dashboard",
    "dashboard.trainer.welcome": "Welcome back,",
    "dashboard.trainer.defaultName": "Trainer",
    "dashboard.trainer.description":
      "Here is what is happening with your athletes.",
    "dashboard.trainer.addAthlete": "Add New Athlete",
    "dashboard.trainer.stats.totalAthletes": "Total Athletes",
    "dashboard.trainer.stats.athletesChange": "+2 since last month",
    "dashboard.trainer.stats.scheduledWorkouts": "Scheduled Workouts",
    "dashboard.trainer.stats.workoutsThisWeek": "This week",
    "dashboard.trainer.stats.activePrograms": "Active Programs",
    "dashboard.trainer.stats.runningPrograms": "Programs in progress",
    "dashboard.trainer.stats.completionRate": "Completion Rate",
    "dashboard.trainer.stats.rateChange": "+3% from last week",
    "dashboard.trainer.quickActions.title": "Quick Actions",
    "dashboard.trainer.quickActions.scheduleWorkout": "Schedule Workout",
    "dashboard.trainer.quickActions.scheduleDescription":
      "Plan training sessions",
    "dashboard.trainer.quickActions.addAthlete": "Add New Athlete",
    "dashboard.trainer.quickActions.expandRoster": "Expand your roster",
    "dashboard.trainer.quickActions.sendMessage": "Send Message",
    "dashboard.trainer.quickActions.communicate": "Communicate with athletes",
    "dashboard.trainer.quickActions.createExercise": "Create Exercise",
    "dashboard.trainer.quickActions.buildLibrary": "Build exercise library",
    "dashboard.trainer.activities.athleteAdded":
      "New athlete '{name}' has been added to your roster",
    "dashboard.trainer.activities.justNow": "Just now",
    "dashboard.trainer.activities.workoutScheduled":
      "Workout scheduled for {name} - {workout} ({time})",
    "dashboard.trainer.activities.exerciseCreated":
      "New exercise '{exercise}' added to the exercise library",
    "dashboard.trainer.toasts.athleteAdded.title":
      "New athlete added successfully!",
    "dashboard.trainer.toasts.athleteAdded.description":
      "{name} has been added to your athlete roster",
    "dashboard.trainer.toasts.workoutScheduled.title": "Workout Scheduled!",
    "dashboard.trainer.toasts.workoutScheduled.description":
      "{workout} workout scheduled for {name} {time}",
    "dashboard.trainer.toasts.messageSent.title": "Message Sent!",
    "dashboard.trainer.toasts.messageSent.description":
      "Workout reminder sent to all active athletes",
    "dashboard.trainer.toasts.exerciseCreated.title": "Exercise created!",
    "dashboard.trainer.toasts.exerciseCreated.description":
      "{exercise} has been added to your exercise library",
    "activityFeed.title": "Recent Activity",
    "activityFeed.mockDataWarning":
      "Showing sample data - Edge Functions unavailable",
    "activityFeed.noActivity": "No recent activity to display.",
    "progressCharts.title": "Workout Progress",
    "progressCharts.mockDataWarning":
      "Showing sample data - Edge Functions unavailable",
    "progressCharts.noData": "No progress data available yet.",
    "progressCharts.workouts": "Workouts",
    "advancedAnalytics.noData": "No analytics data available yet.",
    "advancedAnalytics.mockDataWarning":
      "Showing sample analytics data - Edge Functions unavailable",
    "advancedAnalytics.workoutTypes.title": "Workout Types",
    "advancedAnalytics.weeklyActivity.title": "Weekly Activity",
    "advancedAnalytics.weeklyActivity.workouts": "Workouts",
    "advancedAnalytics.weeklyActivity.duration": "Duration (min)",
    "advancedAnalytics.monthlyProgress.title": "Monthly Progress",
    "advancedAnalytics.monthlyProgress.totalWorkouts": "Total Workouts",
    "advancedAnalytics.monthlyProgress.avgDuration": "Avg Duration",
    "assignWorkoutDialog.toasts.success": "Workout assigned successfully!",
    "assignWorkoutDialog.toasts.error":
      "Failed to assign workout. Please try again.",
    "assignWorkoutDialog.trigger": "Assign Workout",
    "assignWorkoutDialog.title": "Assign a Workout",
    "assignWorkoutDialog.form.title.label": "Workout Title",
    "assignWorkoutDialog.form.title.placeholder": "Enter workout title",
    "assignWorkoutDialog.form.athlete.label": "Athlete",
    "assignWorkoutDialog.form.athlete.placeholder": "Select an athlete",
    "assignWorkoutDialog.form.dueDate.label": "Due Date",
    "assignWorkoutDialog.form.submit.assigning": "Assigning...",
    "assignWorkoutDialog.form.submit.assign": "Assign Workout",
    "workoutLibrary.title": "Workout Library",
    "workoutLibrary.description": "Manage your custom workout plans.",
    "workoutLibrary.noWorkouts":
      'No workouts created yet. Click "Create New Workout" to get started!',
    "createWorkoutDialog.createWorkout": "Create New Workout",
    "createWorkoutDialog.title": "Create New Workout",
    "createWorkoutForm.toasts.success": "Workout created successfully!",
    "createWorkoutForm.toasts.error":
      "Failed to create workout. Please try again.",
    "createWorkoutForm.title.label": "Workout Title",
    "createWorkoutForm.title.placeholder": "Enter workout title",
    "createWorkoutForm.description.label": "Description",
    "createWorkoutForm.description.placeholder":
      "Enter workout description (optional)",
    "createWorkoutForm.exercises.title": "Exercises",
    "createWorkoutForm.exercises.add": "Add Exercise",
    "invitationNotifications.title": "Invitations",
    "invitationNotifications.invitationFrom":
      "You have an invitation from {trainerName}",
    "invitationNotifications.accept": "Accept",
    "invitationNotifications.decline": "Decline",
    "inviteAthleteDialog.trigger": "Invite Athlete",
    "inviteAthleteDialog.title": "Invite a New Athlete",
    "inviteAthleteDialog.form.email.label": "Athlete's Email",
    "inviteAthleteDialog.form.submit": "Send Invitation",
    "removeAthleteDialog.trigger": "Remove Athlete",
    "removeAthleteDialog.title": "Are you sure?",
    "removeAthleteDialog.description":
      "This will permanently remove {athleteName} from your roster. This action cannot be undone.",
    "removeAthleteDialog.cancel": "Cancel",
    "removeAthleteDialog.confirm": "Yes, remove",
    "createWorkoutForm.exercises.exerciseNumber": "Exercise {number}",
    "createWorkoutForm.exercises.name.label": "Exercise Name",
    "createWorkoutForm.exercises.name.placeholder": "e.g., Push-ups, Squats",
    "createWorkoutForm.exercises.sets.label": "Sets",
    "createWorkoutForm.exercises.sets.placeholder": "3",
    "createWorkoutForm.exercises.reps.label": "Reps",
    "createWorkoutForm.exercises.reps.placeholder": "10-12 or 30 seconds",
    "createWorkoutForm.exercises.rest.label": "Rest (seconds)",
    "createWorkoutForm.exercises.rest.placeholder": "60",
    "createWorkoutForm.submit.creating": "Creating...",
    "createWorkoutForm.submit.create": "Create Workout",
    "header.appName": "FitPathway Organizer",
    "header.notifications.ariaLabel": "Notifications",
    "header.account.title": "Account",
    "header.account.profile": "Profile",
    "header.account.settings": "Settings",
    "header.account.logout": "Logout",
    "athleteProgress.loading.title": "Athlete Progress",
    "athleteProgress.loading.description":
      "Overview of their fitness journey and recent activity.",
    "athleteProgress.notFound.title": "Athlete Not Found",
    "athleteProgress.notFound.description":
      "Could not load or find the athlete profile.",
    "athleteProgress.notFound.message":
      "The requested athlete could not be found.",
    "athleteProgress.title": "{name}'s Progress",
    "athleteProgress.description":
      "An overview of their fitness journey and recent activity.",
    "athleteProgress.athlete": "Athlete",
    "athleteProgress.stats.completed.title": "Completed Workouts",
    "athleteProgress.stats.completed.description": "Total workouts completed",
    "athleteProgress.stats.upcoming.title": "Upcoming Workouts",
    "athleteProgress.stats.upcoming.description": "Workouts yet to be done",
    "athleteProgress.stats.goals.title": "Goals Achieved",
    "athleteProgress.stats.goals.value": "N/A",
    "athleteProgress.stats.goals.description": "Feature coming soon",
    "athleteProgress.stats.streak.title": "Current Streak",
    "athleteProgress.stats.streak.value": "N/A",
    "athleteProgress.stats.streak.description": "Feature coming soon",
    "athleteProgress.workoutHistory.title": "Recent Workout History",
    "athleteProgress.workoutHistory.scheduled": "Scheduled",
    "athleteProgress.workoutHistory.noHistory":
      "No workout history available for this athlete yet.",
    "members.title": "Members",
    "members.description": "Manage your athletes and their progress.",
    "members.search.placeholder": "Search by name...",
    "members.filter.status.placeholder": "Filter by status",
    "members.filter.status.all": "All Statuses",
    "members.filter.status.active": "Active",
    "members.filter.status.pending": "Pending",
    "members.actions.viewProgress": "View Progress",
    "members.actions.sendMessage": "Send Message",
    "members.athlete": "Athlete",
  },
  es: {
    "settings.language": "Idioma",
    "settings.language.description": "Elige tu idioma preferido",
    "language.english": "Inglés",
    "language.spanish": "Español",
    "language.arabic": "Árabe",
    "settings.notifications": "Notificaciones",
    "settings.notifications.description":
      "Recibe notificaciones antes de los entrenamientos programados",
    "settings.notifications.progress": "Actualizaciones de Progreso",
    "settings.notifications.progress.description":
      "Informes semanales de progreso y logros",
    "settings.notifications.meal": "Recordatorios de Comida",
    "settings.notifications.meal.description":
      "Recordatorios para comidas e hidratación",
    "settings.notifications.social": "Notificaciones Sociales",
    "settings.notifications.social.description":
      "Mensajes de entrenadores y comunidad",
    "settings.privacy": "Privacidad y Seguridad",
    "settings.privacy.description": "Controla quién puede ver tu perfil",
    "settings.privacy.data": "Compartir Datos",
    "settings.privacy.data.description": "Controla cómo se comparten tus datos",
    "settings.privacy.2fa": "Autenticación de Dos Factores",
    "settings.privacy.2fa.description":
      "Agrega seguridad adicional a tu cuenta",
    "settings.privacy.password": "Cambiar Contraseña",
    "settings.privacy.password.description":
      "Actualiza la contraseña de tu cuenta",
    "settings.preferences": "Preferencias de la Aplicación",
    "settings.preferences.description": "Cambiar al tema oscuro",
    "settings.preferences.units": "Unidades",
    "settings.preferences.units.description": "Unidades de peso y distancia",
    "settings.account": "Gestión de Cuenta",
    "settings.account.description": "Exporta tus datos o elimina tu cuenta",
    "settings.account.support": "Soporte",
    "settings.account.support.description":
      "Obtén ayuda de nuestro equipo de soporte",
    "settings.account.delete": "Eliminar Cuenta",
    "settings.account.delete.description":
      "Elimina permanentemente tu cuenta y todos los datos",
    "workout.reminders": "Recordatorios de Entrenamiento",
    "progress.updates": "Actualizaciones de Progreso",
    "meal.reminders": "Recordatorios de Comida",
    "social.notifications": "Notificaciones Sociales",
    "profile.visibility": "Visibilidad del Perfil",
    "data.sharing": "Compartir Datos",
    "two.factor.auth": "Autenticación de Dos Factores",
    "change.password": "Cambiar Contraseña",
    "dark.mode": "Modo Oscuro",
    "export.data": "Exportar Datos",
    "contact.support": "Contactar Soporte",
    "delete.account": "Eliminar Cuenta",
    "sign.out": "Cerrar Sesión",
    "password.change.title": "Cambiar Contraseña",
    "password.change.description": "Actualiza la contraseña de tu cuenta",
    "password.change.current": "Contraseña Actual",
    "password.change.new": "Nueva Contraseña",
    "password.change.confirm": "Confirmar Nueva Contraseña",
    "password.mismatch": "Las contraseñas no coinciden",
    "password.updated": "Contraseña actualizada exitosamente",
    "password.update.error": "Error al actualizar la contraseña",
    "2fa.enrollment.initiated":
      "Registro de 2FA iniciado. Por favor, completa la configuración en tu aplicación de autenticación.",
    "2fa.disabled": "Autenticación de dos factores desactivada.",
    "2fa.not.found": "No se encontró factor TOTP para desactivar.",
    "2fa.error": "Error al activar/desactivar 2FA.",
    "profile.visibility.title": "Visibilidad del Perfil",
    "profile.visibility.description":
      "Controla quién puede ver la información de tu perfil",
    "profile.visibility.level": "Nivel de Visibilidad",
    "profile.visibility.public": "Público - Cualquiera puede ver tu perfil",
    "profile.visibility.connections":
      "Solo Contactos - Solo tus contactos pueden ver tu perfil",
    "profile.visibility.private": "Privado - Solo tú puedes ver tu perfil",
    "profile.visibility.updated": "Visibilidad del perfil actualizada",
    "data.sharing.title": "Preferencias de Compartir Datos",
    "data.sharing.description": "Controla cómo se comparten tus datos",
    "support.contact.placeholder": "Describe tu problema o pregunta...",
    "support.message.required": "Por favor, introduce un mensaje",
    "support.request.sent": "Solicitud de soporte enviada",
    "support.request.description":
      "Responderemos a tu consulta dentro de 24 horas.",
    "account.deletion.initiated": "Eliminación de cuenta iniciada",
    "account.deletion.description":
      "Tu cuenta será eliminada dentro de 30 días.",
    "account.deletion.error": "Error al eliminar la cuenta",
    "delete.account.confirm": "Eliminar Cuenta",
    imperial: "Imperial",
    metric: "Métrico",
    "profile.completion.title": "Completa tu Perfil",
    "profile.completion.description":
      "Tu perfil está incompleto. Por favor, actualízalo para obtener el máximo provecho de FitPathway Organizer.",
    "profile.completion.button": "Completar Perfil",
    "dashboard.trainer.title": "Panel de Entrenador",
    "dashboard.trainer.welcome": "Bienvenido de nuevo,",
    "dashboard.trainer.defaultName": "Entrenador",
    "dashboard.trainer.description":
      "Aquí está lo que está pasando con tus atletas.",
    "dashboard.trainer.addAthlete": "Agregar Nuevo Atleta",
    "dashboard.trainer.stats.totalAthletes": "Atletas Totales",
    "dashboard.trainer.stats.athletesChange": "+2 desde el mes pasado",
    "dashboard.trainer.stats.scheduledWorkouts": "Entrenamientos Programados",
    "dashboard.trainer.stats.workoutsThisWeek": "Esta semana",
    "dashboard.trainer.stats.activePrograms": "Programas Activos",
    "dashboard.trainer.stats.runningPrograms": "Programas en ejecución",
    "dashboard.trainer.stats.completionRate": "Tasa de Finalización",
    "dashboard.trainer.stats.rateChange": "+3% desde la semana pasada",
    "dashboard.trainer.quickActions.title": "Acciones Rápidas",
    "dashboard.trainer.quickActions.scheduleWorkout": "Programar Entrenamiento",
    "dashboard.trainer.quickActions.scheduleDescription":
      "Planificar sesiones de entrenamiento",
    "dashboard.trainer.quickActions.addAthlete": "Agregar Nuevo Atleta",
    "dashboard.trainer.quickActions.expandRoster": "Expandir tu plantel",
    "dashboard.trainer.quickActions.sendMessage": "Enviar Mensaje",
    "dashboard.trainer.quickActions.communicate": "Comunicarse con atletas",
    "dashboard.trainer.quickActions.createExercise": "Crear Ejercicio",
    "dashboard.trainer.quickActions.buildLibrary":
      "Construir biblioteca de ejercicios",
    "dashboard.trainer.activities.athleteAdded":
      "Nuevo atleta '{name}' ha sido agregado a tu plantel",
    "dashboard.trainer.activities.justNow": "Justo ahora",
    "dashboard.trainer.activities.workoutScheduled":
      "Entrenamiento programado para {name} - {workout} ({time})",
    "dashboard.trainer.activities.exerciseCreated":
      "Nuevo ejercicio '{exercise}' agregado a la biblioteca de ejercicios",
    "dashboard.trainer.toasts.athleteAdded.title":
      "¡Nuevo atleta agregado exitosamente!",
    "dashboard.trainer.toasts.athleteAdded.description":
      "{name} ha sido agregado a tu plantel de atletas",
    "dashboard.trainer.toasts.workoutScheduled.title":
      "¡Entrenamiento programado!",
    "dashboard.trainer.toasts.workoutScheduled.description":
      "Entrenamiento {workout} programado para {name} {time}",
    "dashboard.trainer.toasts.messageSent.title": "¡Mensaje enviado!",
    "dashboard.trainer.toasts.messageSent.description":
      "Recordatorio de entrenamiento enviado a todos los atletas activos",
    "dashboard.trainer.toasts.exerciseCreated.title": "¡Ejercicio creado!",
    "dashboard.trainer.toasts.exerciseCreated.description":
      "{exercise} ha sido agregado a tu biblioteca de ejercicios",
    "dashboard.athlete.progress.title": "Resumen de Tu Progreso",
    "dashboard.athlete.progress.description":
      "Los gráficos de progreso y análisis aparecerán aquí.",
  },
  ar: {
    "settings.language": "اللغة",
    "settings.language.description": "اختر لغتك المفضلة",
    "profile.edit.save": "حفظ",
    "profile.edit.saving": "جاري الحفظ...",
    "profile.edit.cancel": "إلغاء",
    "dashboard.athlete.title": "لوحة الرياضي",
    "dashboard.athlete.welcome": "مرحبًا بعودتك،",
    "dashboard.athlete.defaultName": "الرياضي",
    "dashboard.athlete.viewWorkout": "عرض التمرين القادم",
    "dashboard.athlete.stats.workoutsCompleted": "التدريبات المكتملة",
    "dashboard.athlete.stats.workoutsDescription": "عمل جيد هذا الشهر",
    "dashboard.athlete.stats.nextWorkout": "التمرين التالي",
    "dashboard.athlete.stats.nextWorkoutDescription": "غدًا 7:00 ص",
    "dashboard.athlete.stats.currentProgram": "البرنامج الحالي",
    "dashboard.athlete.stats.programDescription": "الأسبوع 3 من 8",
    "dashboard.athlete.stats.achievements": "الإنجازات",
    "dashboard.athlete.stats.achievementsDescription": "استمر هكذا!",
    "dashboard.trainer.title": "لوحة المدرب",
    "dashboard.trainer.welcome": "مرحبًا بعودتك،",
    "dashboard.trainer.defaultName": "المدرب",
    "dashboard.trainer.description": "إليك ما يحدث مع لاعبيك.",
    "dashboard.trainer.addAthlete": "إضافة لاعب جديد",
    "dashboard.trainer.stats.totalAthletes": "إجمالي اللاعبين",
    "dashboard.trainer.stats.athletesChange": "+2 منذ الشهر الماضي",
    "dashboard.trainer.stats.scheduledWorkouts": "التمارين المجدولة",
    "dashboard.trainer.stats.workoutsThisWeek": "هذا الأسبوع",
    "dashboard.trainer.stats.activePrograms": "البرامج النشطة",
    "dashboard.trainer.stats.runningPrograms": "برامج جارية",
    "dashboard.trainer.stats.completionRate": "معدل الإكمال",
    "dashboard.trainer.stats.rateChange": "+3% عن الأسبوع الماضي",
    "dashboard.trainer.quickActions.title": "إجراءات سريعة",
    "dashboard.trainer.quickActions.scheduleWorkout": "جدولة تمرين",
    "dashboard.trainer.quickActions.scheduleDescription": "تخطيط جلسات التدريب",
    "dashboard.trainer.quickActions.addAthlete": "إضافة لاعب جديد",
    "dashboard.trainer.quickActions.expandRoster": "توسيع قائمتك",
    "dashboard.trainer.quickActions.sendMessage": "إرسال رسالة",
    "dashboard.trainer.quickActions.communicate": "التواصل مع اللاعبين",
    "dashboard.trainer.quickActions.createExercise": "إنشاء تمرين",
    "dashboard.trainer.quickActions.buildLibrary": "بناء مكتبة التمارين",
    "dashboard.trainer.activities.athleteAdded":
      "تمت إضافة اللاعب '{name}' إلى قائمتك",
    "dashboard.trainer.activities.justNow": "الآن",
    "dashboard.trainer.activities.workoutScheduled":
      "تم جدولة تمرين لـ {name} - {workout} ({time})",
    "dashboard.trainer.activities.exerciseCreated":
      "تمت إضافة التمرين '{exercise}' إلى مكتبة التمارين",
    "dashboard.trainer.toasts.athleteAdded.title": "تمت إضافة اللاعب بنجاح!",
    "dashboard.trainer.toasts.athleteAdded.description":
      "تمت إضافة {name} إلى قائمتك",
    "dashboard.trainer.toasts.workoutScheduled.title": "تم جدولة التمرين!",
    "dashboard.trainer.toasts.workoutScheduled.description":
      "تم جدولة تمرين {workout} لـ {name} {time}",
    "dashboard.trainer.toasts.messageSent.title": "تم إرسال الرسالة!",
    "dashboard.trainer.toasts.messageSent.description":
      "تم إرسال تذكير التمرين إلى جميع اللاعبين النشطين",
    "dashboard.trainer.toasts.exerciseCreated.title": "Exercise created!",
    "dashboard.trainer.toasts.exerciseCreated.description":
      "تمت إضافة {exercise} إلى مكتبة التمارين الخاصة بك",
    "language.english": "الإنجليزية",
    "language.spanish": "الإسبانية",
    "language.arabic": "العربية",
    "settings.notifications": "الإشعارات",
    "settings.notifications.description":
      "احصل على إشعارات قبل جلسات التدريب المجدولة",
    "support.request.description": "سنقوم بالرد على استفسارك خلال 24 ساعة.",
    "account.deletion.initiated": "تم بدء حذف الحساب",
    "activityFeed.title": "النشاط الأخير",
    "activityFeed.mockDataWarning":
      "عرض بيانات تجريبية - وظائف الحافة غير متوفرة",
    "activityFeed.noActivity": "لا يوجد نشاط حديث لعرضه.",
    "progressCharts.title": "تقدم التمرين",
    "progressCharts.mockDataWarning":
      "عرض بيانات تجريبية - وظائف الحافة غير متوفرة",
    "progressCharts.noData": "لا توجد بيانات تقدم متاحة بعد.",
    "progressCharts.workouts": "التدريبات",
    "advancedAnalytics.noData": "لا توجد بيانات تحليلات متاحة بعد.",
    "advancedAnalytics.mockDataWarning":
      "عرض بيانات تحليل نموذجية - Edge Functions غير متاحة",
    "advancedAnalytics.workoutTypes.title": "أنواع التمارين",
    "advancedAnalytics.weeklyActivity.title": "النشاط الأسبوعي",
    "advancedAnalytics.weeklyActivity.workouts": "التمارين",
    "advancedAnalytics.weeklyActivity.duration": "المدة (دقيقة)",
    "advancedAnalytics.monthlyProgress.title": "التقدم الشهري",
    "advancedAnalytics.monthlyProgress.totalWorkouts": "إجمالي التمارين",
    "advancedAnalytics.monthlyProgress.avgDuration": "متوسط المدة",
    "account.deletion.description": "سيتم حذف حسابك خلال 30 يومًا.",
    "account.deletion.error": "فشل في حذف الحساب",
    "workoutLibrary.title": "مكتبة التدريب",
    "workoutLibrary.description": "إدارة خطط التدريب المخصصة الخاصة بك.",
    "workoutLibrary.noWorkouts":
      'لم يتم إنشاء تدريبات حتى الآن. انقر على "إنشاء تدريب جديد" للبدء!',
    "createWorkoutDialog.createWorkout": "إنشاء تدريب جديد",
    "createWorkoutDialog.title": "إنشاء تدريب جديد",
    "createWorkoutForm.toasts.success": "تم إنشاء التدريب بنجاح!",
    "createWorkoutForm.toasts.error":
      "فشل إنشاء التدريب. يرجى المحاولة مرة أخرى.",
    "createWorkoutForm.title.label": "عنوان التدريب",
    "createWorkoutForm.title.placeholder": "أدخل عنوان التدريب",
    "createWorkoutForm.description.label": "الوصف",
    "createWorkoutForm.description.placeholder": "أدخل وصف التدريب (اختياري)",
    "createWorkoutForm.exercises.title": "التمارين",
    "createWorkoutForm.exercises.add": "إضافة تمرين",
    "createWorkoutForm.exercises.exerciseNumber": "تمرين {number}",
    "createWorkoutForm.exercises.name.label": "اسم التمرين",
    "createWorkoutForm.exercises.name.placeholder":
      "مثال: ضغط أرضي، تمارين جلوس",
    "createWorkoutForm.exercises.sets.label": "المجموعات",
    "createWorkoutForm.exercises.sets.placeholder": "3",
    "createWorkoutForm.exercises.reps.label": "التكرارات",
    "createWorkoutForm.exercises.reps.placeholder": "10-12 أو 30 ثانية",
    "createWorkoutForm.exercises.rest.label": "الراحة (بالثواني)",
    "createWorkoutForm.exercises.rest.placeholder": "60",
    "createWorkoutForm.submit.creating": "جاري الإنشاء...",
    "createWorkoutForm.submit.create": "إنشاء تدريب",
    "settings.notifications.progress.description":
      "تقارير أسبوعية عن التقدم والإنجازات",
    "settings.notifications.meal": "تذكيرات الوجبات",
    "settings.notifications.meal.description": "تذكيرات للوجبات والترطيب",
    "settings.notifications.social": "الإشعارات الاجتماعية",
    "settings.notifications.social.description": "رسائل من المدربين والمجتمع",
    "settings.privacy": "الخصوصية والأمان",
    "settings.privacy.description": "تحكم في من يمكنه رؤية ملفك الشخصي",
    "settings.privacy.data": "مشاركة البيانات",
    "settings.privacy.data.description": "تحكم في كيفية مشاركة بياناتك",
    "settings.privacy.2fa": "المصادقة الثنائية",
    "settings.privacy.2fa.description": "أضف أمانًا إضافيًا إلى حسابك",
    "settings.privacy.password": "تغيير كلمة المرور",
    "settings.privacy.password.description": "حدث كلمة مرور حسابك",
    "settings.preferences": "تفضيلات التطبيق",
    "settings.preferences.description": "التبديل إلى السمة الداكنة",
    "settings.preferences.units": "الوحدات",
    "settings.preferences.units.description": "وحدات الوزن والمسافة",
    "settings.account": "إدارة الحساب",
    "settings.account.description": "قم بتصدير بياناتك أو حذف حسابك",
    "settings.account.support": "الدعم",
    "settings.account.support.description":
      "احصل على المساعدة من فريق الدعم لدينا",
    "settings.account.delete": "حذف الحساب",
    "settings.account.delete.description":
      "احذف حسابك وجميع البيانات بشكل دائم",
    "workout.reminders": "تذكيرات التدريب",
    "progress.updates": "تحديثات التقدم",
    "meal.reminders": "تذكيرات الوجبات",
    "social.notifications": "الإشعارات الاجتماعية",
    "profile.visibility": "رؤية الملف الشخصي",
    "data.sharing": "مشاركة البيانات",
    "two.factor.auth": "المصادقة الثنائية",
    "change.password": "تغيير كلمة المرور",
    "dark.mode": "الوضع الداكن",
    "export.data": "تصدير البيانات",
    "contact.support": "الاتصال بالدعم",
    "delete.account": "حذف الحساب",
    "sign.out": "تسجيل الخروج",
    "sign.out.description": "تسجيل الخروج من حسابك",
    manage: "إدارة",
    configure: "تكوين",
    loading: "جار التحميل...",
    enabled: "مفعل",
    disabled: "معطل",
    disable: "تعطيل",
    enable: "تفعيل",
    update: "تحديث",
    export: "تصدير",
    contact: "اتصال",
    delete: "حذف",
    "units.changed": "تم تغيير الوحدات إلى",
    "profile.visibility.title": "رؤية الملف الشخصي",
    "profile.visibility.description":
      "تحكم في من يمكنه رؤية معلومات ملفك الشخصي",
    "profile.visibility.level": "مستوى الرؤية",
    "profile.visibility.public": "عام - يمكن لأي شخص رؤية ملفك الشخصي",
    "profile.visibility.connections":
      "الاتصالات فقط - يمكن لاتصالاتك فقط رؤية ملفك الشخصي",
    "profile.visibility.private": "خاص - يمكنك فقط رؤية ملفك الشخصي",
    "profile.title": "الملف الشخصي",
    "profile.description": "قم بإدارة معلوماتك الشخصية.",
    "profile.picture.title": "صورة الملف الشخصي",
    "profile.picture.upload.label": "رفع صورة الملف الشخصي",
    "profile.personal.title": "المعلومات الشخصية",
    "profile.edit.label": "تعديل معلومات الملف الشخصي",
    "profile.personal.fullName": "الاسم الكامل",
    "profile.personal.email": "البريد الإلكتروني",
    "profile.personal.phone": "الهاتف",
    "header.appName": "منظم مسار اللياقة",
    "header.notifications.ariaLabel": "الإشعارات",
    "header.account.title": "الحساب",
    "header.account.profile": "الملف الشخصي",
    "header.account.settings": "الإعدادات",
    "header.account.logout": "تسجيل الخروج",
    "support.contact.message": "الرسالة",
    "support.contact.placeholder": "صف مشكلتك أو سؤالك...",
    "account.delete.title": "حذف الحساب",
    "account.delete.description":
      "لا يمكن التراجع عن هذا الإجراء. سيتم حذف حسابك وجميع البيانات المرتبطة به بشكل دائم.",
    "account.delete.confirm": "هل أنت متأكد أنك تريد حذف حسابك؟",
    cancel: "إلغاء",
    "save.changes": "حفظ التغييرات",
    "send.message": "إرسال الرسالة",
    "delete.account.confirm": "حذف الحساب",
    imperial: "النظام الإمبراطوري",
    metric: "متري",
    "profile.completion.button": "أكمل الملف الشخصي",
    "password.mismatch": "كلمات المرور غير متطابقة",
    "dashboard.athlete.progress.title": "نظرة عامة على تقدمك",
    "dashboard.athlete.progress.description":
      "ستظهر الرسوم البيانية والتحليلات هنا.",
    "assignWorkoutDialog.toasts.success": "تم تعيين التدريب بنجاح!",
    "assignWorkoutDialog.toasts.error":
      "فشل تعيين التدريب. يرجى المحاولة مرة أخرى.",
    "assignWorkoutDialog.trigger": "تعيين تدريب",
    "assignWorkoutDialog.title": "تعيين تدريب",
    "invitationNotifications.title": "الدعوات",
    "invitationNotifications.invitationFrom": "لديك دعوة من {trainerName}",
    "invitationNotifications.accept": "قبول",
    "inviteAthleteDialog.trigger": "دعوة رياضي",
    "inviteAthleteDialog.title": "دعوة رياضي جديد",
    "removeAthleteDialog.trigger": "إزالة الرياضي",
    "removeAthleteDialog.title": "هل أنت متأكد؟",
    "removeAthleteDialog.description":
      "سيتم إزالة {athleteName} بشكل دائم من قائمة رياضيّك. لا يمكن التراجع عن هذا الإجراء.",
    "removeAthleteDialog.cancel": "إلغاء",
    "removeAthleteDialog.confirm": "نعم، أزل",
    "inviteAthleteDialog.form.email.label": "بريد الرياضي الإلكتروني",
    "inviteAthleteDialog.form.submit": "إرسال الدعوة",
    "invitationNotifications.decline": "رفض",
    "members.title": "الأعضاء",
    "members.description": "إدارة رياضيّك وتقدمهم.",
    "members.search.placeholder": "البحث بالاسم...",
    "members.filter.status.placeholder": "تصفية حسب الحالة",
    "members.filter.status.all": "جميع الحالات",
    "members.filter.status.active": "نشط",
    "members.filter.status.pending": "قيد الانتظار",
    "members.actions.viewProgress": "عرض التقدم",
    "members.actions.sendMessage": "إرسال رسالة",
    "members.athlete": "رياضي",
    "assignWorkoutDialog.form.title.label": "عنوان التدريب",
    "assignWorkoutDialog.form.title.placeholder": "أدخل عنوان التدريب",
    "assignWorkoutDialog.form.athlete.label": "الرياضي",
    "assignWorkoutDialog.form.athlete.placeholder": "اختر رياضيًا",
    "assignWorkoutDialog.form.dueDate.label": "تاريخ الاستحقاق",
    "assignWorkoutDialog.form.submit.assigning": "جاري التعيين...",
    "assignWorkoutDialog.form.submit.assign": "تعيين تدريب",
    "profile.completion.title": "أكمل ملفك الشخصي",
    "profile.completion.description":
      "أضف رقم هاتفك، تاريخ ميلادك، ومعلومات جهة الاتصال في حالات الطوارئ لإكمال ملفك الشخصي.",
    "athleteProgress.loading.title": "تقدم الرياضي",
    "athleteProgress.loading.description":
      "نظرة عامة على رحلته اللياقية ونشاطه الأخير.",
    "athleteProgress.notFound.title": "الرياضي غير موجود",
    "athleteProgress.notFound.description":
      "تعذر تحميل ملف الرياضي أو لم يتم العثور عليه.",
    "athleteProgress.notFound.message": "تعذر العثور على الرياضي المطلوب.",
    "athleteProgress.title": "تقدم {name}",
    "athleteProgress.description":
      "نظرة عامة على رحلته اللياقية ونشاطه الأخير.",
    "athleteProgress.athlete": "رياضي",
    "athleteProgress.stats.completed.title": "التدريبات المكتملة",
    "athleteProgress.stats.completed.description": "إجمالي التدريبات المكتملة",
    "athleteProgress.stats.upcoming.title": "التدريبات القادمة",
    "athleteProgress.stats.upcoming.description": "التدريبات التي لم تُنجز بعد",
    "athleteProgress.stats.goals.title": "الأهداف المحققة",
    "athleteProgress.stats.goals.value": "غير متوفر",
    "athleteProgress.stats.goals.description": "الميزة قادمة قريبًا",
    "athleteProgress.stats.streak.title": "السلسلة الحالية",
    "athleteProgress.stats.streak.value": "غير متوفر",
    "athleteProgress.stats.streak.description": "الميزة قادمة قريبًا",
    "athleteProgress.workoutHistory.title": "سجل التدريبات الأخيرة",
    "athleteProgress.workoutHistory.scheduled": "مجدول",
    "athleteProgress.workoutHistory.noHistory":
      "لا يوجد سجل تدريبات متوفر لهذا الرياضي حتى الآن.",
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>("en");

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (
      savedLanguage &&
      (savedLanguage === "en" ||
        savedLanguage === "es" ||
        savedLanguage === "ar")
    ) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // Update document direction for RTL languages
    if (language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", language);
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  // Ensure Arabic translations include the requested keys
  if (!translations["ar"]) {
    // If the 'ar' translations object doesn't exist, create it
    // so we can safely merge the new keys.
    translations["ar"] = {};
  }
  translations["ar"] = {
    ...translations["ar"],
    "profile.completion.button": "أكمل الملف الشخصي",
    // Password mismatch translation
    "password.mismatch": "كلمات المرور غير متطابقة",
  };

  const value = {
    language,
    setLanguage: (newLanguage: string) => {
      if (
        newLanguage === "en" ||
        newLanguage === "es" ||
        newLanguage === "ar"
      ) {
        setLanguage(newLanguage);
      }
    },
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
