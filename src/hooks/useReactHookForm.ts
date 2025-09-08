import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";

import type { DefaultValues } from "react-hook-form";

interface UseCustomFormProps<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
}

const useCustomForm = <T extends FieldValues>({
  defaultValues,
  onSubmit,
}: UseCustomFormProps<T>) => {
  const {
    register,
    handleSubmit,
    reset,
    watch ,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    defaultValues,
    mode: "onBlur",
  });



  return {
    register,
  handleFormSubmit: handleSubmit(onSubmit), // rename để tránh nhầm lẫn
    reset,
    watch ,
    errors,
    isSubmitting,
  };
};

export default useCustomForm;
