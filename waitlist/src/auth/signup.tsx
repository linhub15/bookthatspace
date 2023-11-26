import { useForm } from "@tanstack/react-form";
import { useSignupWithPassword } from "./use_signup_password.mutation";

export function Signup() {
  const signupMutation = useSignupWithPassword();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      signupMutation.mutateAsync({ ...values, data: { name: "test" } });
    },
  });

  return (
    <form.Provider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (field.state.value !== undefined &&
            (
              <>
                <label>Email</label>
                <input
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            ))}
        </form.Field>

        <form.Field name="password">
          {(field) => (field.state.value !== undefined &&
            (
              <>
                <label>Password</label>
                <input
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            ))}
        </form.Field>

        <button type="submit">Sign up</button>
      </form>
    </form.Provider>
  );
}
