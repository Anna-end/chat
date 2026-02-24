import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

export const loginSchema = z.object({
  login: z
    .string()
    .min(3, 'Логин не меньше 3 символов')
    .regex(/[A-Z]/, 'Логин должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Логин должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Логин должен содержать хотя бы одну цифру')
    .regex(/[^A-Za-z0-9]/, 'Логин должен содержать хотя бы один спецсимвол'),
  password: z
    .string()
    .min(3, 'Пароль не меньше 3 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .regex(/[^A-Za-z0-9]/, 'Пароль должен содержать хотя бы один спецсимвол'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, dirtyFields, touchedFields },
    trigger,
    watch,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const watchLogin = watch('login');
  const watchPassword = watch('password');

  useEffect(() => {
    trigger('login');
  }, [watchLogin, trigger]);

  useEffect(() => {
    trigger('password');
  }, [watchPassword, trigger]);

  return {
    register,
    handleSubmit: handleSubmit,
    reset,
    errors,
    isSubmitting,
    isValid,
    dirtyFields,
    touchedFields,
    watchLogin,
    watchPassword,
  };
};
