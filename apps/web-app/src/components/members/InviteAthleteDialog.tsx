import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useTrainerAthletes } from "@/hooks/useTrainerAthletes";
import { useLanguage } from "@/contexts/LanguageContext";

const inviteSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;
export const InviteAthleteDialog = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
  });
  const { inviteAthlete } = useTrainerAthletes();

  const onSubmit = (data: InviteFormValues) => {
    inviteAthlete.mutate(data.email);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="default">
          {t('inviteAthleteDialog.trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('inviteAthleteDialog.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('inviteAthleteDialog.form.email.label')}</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <Button type="submit" size="default" className="w-full">{t('inviteAthleteDialog.form.submit')}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Athlete's Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <Button type="submit" size="default" className="w-full">Send Invitation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};