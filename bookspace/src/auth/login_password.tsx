import { useForm } from "@tanstack/react-form";
import { useLoginWithPassword } from "./use_login_password.mutation";
import { Link, useSearch } from "@tanstack/react-router";
import { loginRoute } from "./auth.routes";
import { FormField } from "../components/form/form_field";
import { Label } from "../components/form/label";

export function LoginPassword() {
  const { redirect } = useSearch({ from: loginRoute.id });
  const loginWithPassword = useLoginWithPassword(redirect);
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
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form.Provider>
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <h1 className="text-2xl text-center">Login</h1>
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
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{" "}
        <Link
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          to="/signup"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
