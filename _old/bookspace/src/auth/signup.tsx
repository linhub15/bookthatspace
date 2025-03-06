import { useForm } from "@tanstack/react-form";
import { useSignupWithPassword } from "./hooks/use_signup_password.mutation";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormField } from "../components/form/form_field";
import { Label } from "../components/form/label";

export function Signup() {
  const signupMutation = useSignupWithPassword();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      signupMutation.mutateAsync({
        email: values.value.email,
        password: values.value.password,
        data: { name: values.value.name },
      }, {
        onSuccess: (data) => {
          navigate({
            to: "/confirm-email/$email",
            params: { email: data },
          });
        },
      });
    },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
            className="space-y-6"
          >
            <h1 className="text-2xl text-center">Sign up</h1>
            <form.Field name="name">
              {(field) => (field.state.value !== undefined &&
                (
                  <FormField>
                    <Label>Name</Label>
                    <input
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormField>
                ))}
            </form.Field>

            <form.Field name="email">
              {(field) => (field.state.value !== undefined &&
                (
                  <FormField>
                    <Label>Email</Label>
                    <input
                      type="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormField>
                ))}
            </form.Field>

            <form.Field name="password">
              {(field) => (field.state.value !== undefined &&
                (
                  <FormField>
                    <Label>Password</Label>
                    <input
                      type="password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FormField>
                ))}
            </form.Field>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
      <p className="mt-10 text-center text-sm text-gray-500">
        Have an account?{" "}
        <Link
          to="/login"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
