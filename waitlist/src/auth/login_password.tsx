import { useForm } from "@tanstack/react-form";
import { useLoginWithPassword } from "./use_login_password.mutation";
import { Link } from "@tanstack/react-router";

export function LoginPassword() {
  const loginWithPassword = useLoginWithPassword();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      await loginWithPassword.mutateAsync(values);
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
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            ))}
        </form.Field>

        <form.Field name="password">
          {(field) => (field.state.value !== undefined &&
            (
              <div>
                <label>Password</label>
                <input
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            ))}
        </form.Field>

        <div>
          <Link to="/forgot-password">Forgot password</Link>
        </div>

        <button type="submit">Login</button>
      </form>
    </form.Provider>
  );
}
