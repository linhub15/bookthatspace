import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.protocol}//${location.host}/reset-password`,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert(`Password reset email sent to ${email}!`);
    },
  });
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div className="space-y-8">
            <h1 className="text-2xl text-center">Forgot your password?</h1>
            <div className="space-y-2">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                type="email"
                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {!mutation.isPending &&
              (
                <button
                  onClick={() => mutation.mutateAsync(email)}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Reset password
                </button>
              )}
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{" "}
        <Link
          to="/signup"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
