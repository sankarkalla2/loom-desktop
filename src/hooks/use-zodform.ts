import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import z from "zod";

export const useZodForm = <T extends z.ZodTypeAny>(
  schema: T,
  defaultValue?: DefaultValues<z.TypeOf<T>> | undefined
) => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  return { register, watch, reset, errors, handleSubmit };
};
