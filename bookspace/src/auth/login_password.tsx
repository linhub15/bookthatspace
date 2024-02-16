import { useForm } from "@tanstack/react-form";
import { useLoginWithPassword } from "./hooks/use_login_password.mutation";
import { Link, useSearch } from "@tanstack/react-router";
import { loginRoute } from "./auth.routes";
import { FormField } from "../components/form/form_field";
import { Label } from "../components/form/label";
import { supabase } from "../clients/supabase";
import { useMutation } from "@tanstack/react-query";

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
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12 space-y-8">
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
          <OAuthSection />
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

function OAuthSection() {
  const signInGoogle = useMutation({
    mutationFn: async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-6 text-gray-900">or</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
          onClick={() => signInGoogle.mutateAsync()}
        >
          <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
              fill="#EA4335"
            />
            <path
              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
              fill="#4285F4"
            />
            <path
              d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
              fill="#34A853"
            />
          </svg>
          <span className="text-sm font-semibold leading-6">
            Continue with Google
          </span>
        </button>

        <button className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent">
          <svg className="h-5 w-5" aria-hidden="true">
            <path fill="#f25022" d="M1 1h9v9H1z" />
            <path fill="#00a4ef" d="M1 11h9v9H1z" />
            <path fill="#7fba00" d="M11 1h9v9h-9z" />
            <path fill="#ffb900" d="M11 11h9v9h-9z" />
          </svg>
          <span className="text-sm font-semibold leading-6">
            Continue with Microsoft
          </span>
        </button>
      </div>
    </div>
  );
}
