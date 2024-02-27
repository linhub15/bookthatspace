import { useForm } from "@tanstack/react-form";
import { useLoginWithPassword } from "./hooks/use_login_password.mutation";
import { Link } from "@tanstack/react-router";
import { FormField } from "../components/form/form_field";
import { Label } from "../components/form/label";

type Props = {
  redirect: string;
};

export function LoginPasswordForm(props: Props) {
  const loginWithPassword = useLoginWithPassword(props.redirect);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      await loginWithPassword.mutateAsync(values.value);
    },
  });
  return (
    <form.Provider>
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            (
              <FormField>
                <Label htmlFor={field.name}>Email</Label>
                <input
                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="email"
                  tabIndex={1}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            (
              <FormField>
                <div className="flex justify-between">
                  <Label htmlFor={field.name}>Password</Label>
                  <Link
                    className="text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500"
                    to="/forgot-password"
                    tabIndex={2}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="password"
                  tabIndex={1}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </FormField>
            )
          )}
        </form.Field>

        <div>
          <button
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="submit"
            tabIndex={1}
          >
            Login
          </button>
        </div>
      </form>
    </form.Provider>
  );
}
