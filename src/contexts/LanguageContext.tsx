import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Simple translation function for now
const translations: Record<string, Record<string, string>> = {
  en: {
    '2fa.disabled': 'تم تعطيل المصادقة الثنائية.',
    '2fa.enrollment.initiated': 'تم بدء تسجيل المصادقة الثنائية. يرجى إكمال الإعداد في تطبيق المصادقة الخاص بك.',
    '2fa.error': 'فشل في تفعيل/تعطيل المصادقة الثنائية.',
    '2fa.not.found': 'لم يتم العثور على عامل TOTP لتعطيله.',
    'account.delete.confirm': 'Are you sure you want to delete your account?',
    'account.delete.description': 'This action cannot be undone. Your account and all associated data will be permanently deleted.',
    'account.delete.title': 'Delete Account',
    'account.deletion.description': 'Tu cuenta será eliminada dentro de 30 días.',
    'account.deletion.error': 'Error al eliminar la cuenta',
    'account.deletion.initiated': 'Eliminación de cuenta iniciada',
    'cancel': 'Cancel',
    'change.password': 'تغيير كلمة المرور',
    'configure': 'تكوين',
    'contact': 'اتصال',
    'contact.support': 'الاتصال بالدعم',
    'dark.mode': 'الوضع الداكن',
    'data.export.description': 'سيتم إرسال بياناتك إلى بريدك الإلكتروني قريبًا.',
    'data.export.error': 'فشل في تصدير البيانات',
    'data.export.requested': 'تم طلب تصدير البيانات',
    'data.sharing': 'Data Sharing',
    'data.sharing.analytics': 'Analytics Data',
    'data.sharing.analytics.description': 'Share anonymous usage data to improve the app',
    'data.sharing.description': 'Control how your data is shared',
    'data.sharing.marketing': 'Marketing Communications',
    'data.sharing.marketing.description': 'Receive personalized offers and updates',
    'data.sharing.thirdparty': 'Third-Party Integration',
    'data.sharing.thirdparty.description': 'Share data with connected third-party services',
    'data.sharing.title': 'Data Sharing Preferences',
    'data.sharing.updated': 'تم تحديث تفضيلات مشاركة البيانات',
    'delete': 'حذف',
    'delete.account': 'حذف الحساب',
    'delete.account.confirm': 'Delete Account',
    'disable': 'تعطيل',
    'disabled': 'معطل',
    'enable': 'تفعيل',
    'enabled': 'مفعل',
    'export': 'تصدير',
    'export.data': 'تصدير البيانات',
    'imperial': 'Imperial',
    'language.arabic': 'Arabic',
    'language.changed': 'Language changed to',
    'language.english': 'English',
    'language.spanish': 'Spanish',
    'loading': 'جار التحميل...',
    'manage': 'إدارة',
    'meal.reminders': 'Meal Reminders',
    'metric': 'Metric',
    'password.change.confirm': 'Confirm New Password',
    'password.change.current': 'Current Password',
    'password.change.description': 'Update your account password',
    'password.change.new': 'New Password',
    'password.change.title': 'Change Password',
    'password.mismatch': 'كلمات المرور غير متطابقة',
    'password.update.error': 'فشل في تحديث كلمة المرور',
    'password.updated': 'تم تحديث كلمة المرور بنجاح',
    'profile.visibility': 'Profile Visibility',
    'profile.visibility.connections': 'Connections Only - Only your connections can see your profile',
    'profile.visibility.description': 'Control who can see your profile information',
    'profile.visibility.level': 'Visibility Level',
    'profile.visibility.private': 'Private - Only you can see your profile',
    'profile.visibility.public': 'Public - Anyone can see your profile',
    'profile.visibility.title': 'Profile Visibility',
    'profile.visibility.updated': 'تم تحديث رؤية الملف الشخصي',
    'progress.updates': 'Progress Updates',
    'save.changes': 'Save Changes',
    'send.message': 'Send Message',
    'settings.account': 'Account Management',
    'settings.account.delete': 'Delete Account',
    'settings.account.delete.description': 'Permanently delete your account and all data',
    'settings.account.description': 'Export your data or delete your account',
    'settings.account.support': 'Support',
    'settings.account.support.description': 'Get help from our support team',
    'settings.description': 'Manage your app preferences and account settings',
    'settings.language': 'Language',
    'settings.language.description': 'Choose your preferred language',
    'settings.notifications': 'Notifications',
    'settings.notifications.description': 'Receive notifications before scheduled workouts',
    'settings.notifications.meal': 'Meal Reminders',
    'settings.notifications.meal.description': 'Reminders for meals and hydration',
    'settings.notifications.progress': 'Progress Updates',
    'settings.notifications.progress.description': 'Weekly progress reports and achievements',
    'settings.notifications.social': 'Social Notifications',
    'settings.notifications.social.description': 'Messages from coaches and community',
    'settings.preferences': 'App Preferences',
    'settings.preferences.description': 'Customize your app experience',
    'settings.preferences.units': 'Units',
    'settings.preferences.units.description': 'Weight and distance units',
    'settings.privacy': 'Privacy & Security',
    'settings.privacy.2fa': 'Two-Factor Authentication',
    'settings.privacy.2fa.description': 'Add extra security to your account',
    'settings.privacy.data': 'Data Sharing',
    'settings.privacy.data.description': 'Control how your data is shared',
    'settings.privacy.description': 'Control who can see your profile',
    'settings.privacy.password': 'Change Password',
    'settings.privacy.password.description': 'Update your account password',
    'settings.title': 'Settings',
    'sign.out': 'تسجيل الخروج',
    'sign.out.description': 'تسجيل الخروج من حسابك',
    'sign.out.success': 'تم تسجيل الخروج بنجاح',
    'social.notifications': 'Social Notifications',
    'support.contact.description': 'Get help with your account or app issues',
    'support.contact.message': 'Message',
    'support.contact.placeholder': 'Describe your issue or question...',
    'support.contact.title': 'Contact Support',
    'support.message.required': 'Por favor, introduce un mensaje',
    'support.request.description': 'Responderemos a tu consulta dentro de 24 horas.',
    'support.request.sent': 'Solicitud de soporte enviada',
    'two.factor.auth': 'المصادقة الثنائية',
    'units.changed': 'تم تغيير الوحدات إلى',
    'update': 'تحديث',
    'workout.reminders': 'Workout Reminders',
  },
  ar: {
    'account.delete.confirm': 'هل أنت متأكد أنك تريد حذف حسابك؟',
    'account.delete.description': 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف حسابك وجميع البيانات المرتبطة به بشكل دائم.',
    'account.delete.title': 'حذف الحساب',
    'account.deletion.description': 'سيتم حذف حسابك خلال 30 يومًا.',
    'account.deletion.error': 'فشل في حذف الحساب',
    'account.deletion.initiated': 'تم بدء حذف الحساب',
    'cancel': 'إلغاء',
    'change.password': 'تغيير كلمة المرور',
    'configure': 'تكوين',
    'contact': 'اتصال',
    'contact.support': 'الاتصال بالدعم',
    'dark.mode': 'الوضع الداكن',
    'data.sharing': 'مشاركة البيانات',
    'data.sharing.analytics': 'بيانات التحليلات',
    'data.sharing.analytics.description': 'شارك بيانات الاستخدام المجهولة لتحسين التطبيق',
    'data.sharing.description': 'تحكم في كيفية مشاركة بياناتك',
    'data.sharing.marketing': 'الاتصالات التسويقية',
    'data.sharing.marketing.description': 'تلقى عروضًا وتحديثات شخصية',
    'data.sharing.thirdparty': 'التكامل مع طرف ثالث',
    'data.sharing.thirdparty.description': 'شارك البيانات مع خدمات الطرف الثالث المتصلة',
    'data.sharing.title': 'تفضيلات مشاركة البيانات',
    'delete': 'حذف',
    'delete.account': 'حذف الحساب',
    'delete.account.confirm': 'حذف الحساب',
    'disable': 'تعطيل',
    'disabled': 'معطل',
    'enable': 'تفعيل',
    'enabled': 'مفعل',
    'export': 'تصدير',
    'export.data': 'تصدير البيانات',
    'imperial': 'النظام الإمبراطوري',
    'language.arabic': 'العربية',
    'language.english': 'الإنجليزية',
    'language.spanish': 'الإسبانية',
    'loading': 'جار التحميل...',
    'manage': 'إدارة',
    'meal.reminders': 'تذكيرات الوجبات',
    'metric': 'متري',
    'password.change.confirm': 'تأكيد كلمة المرور الجديدة',
    'password.change.current': 'كلمة المرور الحالية',
    'password.change.description': 'حدث كلمة مرور حسابك',
    'password.change.new': 'كلمة المرور الجديدة',
    'password.change.title': 'تغيير كلمة المرور',
    'profile.visibility': 'رؤية الملف الشخصي',
    'profile.visibility.connections': 'الاتصالات فقط - يمكن لاتصالاتك فقط رؤية ملفك الشخصي',
    'profile.visibility.description': 'تحكم في من يمكنه رؤية معلومات ملفك الشخصي',
    'profile.visibility.level': 'مستوى الرؤية',
    'profile.visibility.private': 'خاص - يمكنك فقط رؤية ملفك الشخصي',
    'profile.visibility.public': 'عام - يمكن لأي شخص رؤية ملفك الشخصي',
    'profile.visibility.title': 'رؤية الملف الشخصي',
    'progress.updates': 'تحديثات التقدم',
    'save.changes': 'حفظ التغييرات',
    'send.message': 'إرسال الرسالة',
    'settings.account': 'إدارة الحساب',
    'settings.account.delete': 'حذف الحساب',
    'settings.account.delete.description': 'احذف حسابك وجميع البيانات بشكل دائم',
    'settings.account.description': 'قم بتصدير بياناتك أو حذف حسابك',
    'settings.account.support': 'الدعم',
    'settings.account.support.description': 'احصل على المساعدة من فريق الدعم لدينا',
    'settings.language': 'اللغة',
    'settings.language.description': 'اختر لغتك المفضلة',
    'settings.notifications': 'الإشعارات',
    'settings.notifications.description': 'احصل على إشعارات قبل جلسات التدريب المجدولة',
    'settings.notifications.meal': 'تذكيرات الوجبات',
    'settings.notifications.meal.description': 'تذكيرات للوجبات والترطيب',
    'settings.notifications.progress': 'تحديثات التقدم',
    'settings.notifications.progress.description': 'تقارير أسبوعية عن التقدم والإنجازات',
    'settings.notifications.social': 'الإشعارات الاجتماعية',
    'settings.notifications.social.description': 'رسائل من المدربين والمجتمع',
    'settings.preferences': 'تفضيلات التطبيق',
    'settings.preferences.description': 'التبديل إلى السمة الداكنة',
    'settings.preferences.units': 'الوحدات',
    'settings.preferences.units.description': 'وحدات الوزن والمسافة',
    'settings.privacy': 'الخصوصية والأمان',
    'settings.privacy.2fa': 'المصادقة الثنائية',
    'settings.privacy.2fa.description': 'أضف أمانًا إضافيًا إلى حسابك',
    'settings.privacy.data': 'مشاركة البيانات',
    'settings.privacy.data.description': 'تحكم في كيفية مشاركة بياناتك',
    'settings.privacy.description': 'تحكم في من يمكنه رؤية ملفك الشخصي',
    'settings.privacy.password': 'تغيير كلمة المرور',
    'settings.privacy.password.description': 'حدث كلمة مرور حسابك',
    'sign.out': 'تسجيل الخروج',
    'sign.out.description': 'تسجيل الخروج من حسابك',
    'social.notifications': 'الإشعارات الاجتماعية',
    'support.contact.description': 'احصل على المساعدة مع مشاكل حسابك أو التطبيق',
    'support.contact.message': 'الرسالة',
    'support.contact.placeholder': 'صف مشكلتك أو سؤالك...',
    'support.contact.title': 'الاتصال بالدعم',
    'support.request.description': 'سنقوم بالرد على استفسارك خلال 24 ساعة.',
    'two.factor.auth': 'المصادقة الثنائية',
    'units.changed': 'تم تغيير الوحدات إلى',
    'update': 'تحديث',
    'workout.reminders': 'تذكيرات التدريب',
  },
  es: {
    'change.password': 'Cambiar Contraseña',
    'contact.support': 'Contactar Soporte',
    'dark.mode': 'Modo Oscuro',
    'data.sharing': 'Compartir Datos',
    'delete.account': 'Eliminar Cuenta',
    'export.data': 'Exportar Datos',
    'language.arabic': 'Árabe',
    'language.english': 'Inglés',
    'language.spanish': 'Español',
    'meal.reminders': 'Recordatorios de Comida',
    'profile.visibility': 'Visibilidad del Perfil',
    'progress.updates': 'Actualizaciones de Progreso',
    'settings.account': 'Gestión de Cuenta',
    'settings.account.delete': 'Eliminar Cuenta',
    'settings.account.delete.description': 'Elimina permanentemente tu cuenta y todos los datos',
    'settings.account.description': 'Exporta tus datos o elimina tu cuenta',
    'settings.account.support': 'Soporte',
    'settings.account.support.description': 'Obtén ayuda de nuestro equipo de soporte',
    'settings.language': 'Idioma',
    'settings.language.description': 'Elige tu idioma preferido',
    'settings.notifications': 'Notificaciones',
    'settings.notifications.description': 'Recibe notificaciones antes de los entrenamientos programados',
    'settings.notifications.meal': 'Recordatorios de Comida',
    'settings.notifications.meal.description': 'Recordatorios para comidas e hidratación',
    'settings.notifications.progress': 'Actualizaciones de Progreso',
    'settings.notifications.progress.description': 'Informes semanales de progreso y logros',
    'settings.notifications.social': 'Notificaciones Sociales',
    'settings.notifications.social.description': 'Mensajes de entrenadores y comunidad',
    'settings.preferences': 'Preferencias de la Aplicación',
    'settings.preferences.description': 'Cambiar al tema oscuro',
    'settings.preferences.units': 'Unidades',
    'settings.preferences.units.description': 'Unidades de peso y distancia',
    'settings.privacy': 'Privacidad y Seguridad',
    'settings.privacy.2fa': 'Autenticación de Dos Factores',
    'settings.privacy.2fa.description': 'Agrega seguridad adicional a tu cuenta',
    'settings.privacy.data': 'Compartir Datos',
    'settings.privacy.data.description': 'Controla cómo se comparten tus datos',
    'settings.privacy.description': 'Controla quién puede ver tu perfil',
    'settings.privacy.password': 'Cambiar Contraseña',
    'settings.privacy.password.description': 'Actualiza la contraseña de tu cuenta',
    'sign.out': 'Cerrar Sesión',
    'social.notifications': 'Notificaciones Sociales',
    'two.factor.auth': 'Autenticación de Dos Factores',
    'workout.reminders': 'Recordatorios de Entrenamiento',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document direction for RTL languages
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const value = {
    language,
    setLanguage: (newLanguage: string) => {
      if (newLanguage === 'en' || newLanguage === 'es' || newLanguage === 'ar') {
        setLanguage(newLanguage);
      }
    },
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};