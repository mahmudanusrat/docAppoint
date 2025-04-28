import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to dashboard or homepage after successful login
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  // If already logged in, redirect to the dashboard
  if (session) {
    router.push("/dashboard");
  }

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { redirect: false });
    if (result?.error) {
      setError("Google Sign-In failed.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Sign In</h1>
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Sign In
        </button>
        <div className="flex justify-center items-center my-4">
          <p className="text-gray-500">Or</p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full p-2 bg-red-500 text-white rounded mb-4"
        >
          Sign In with Google
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
