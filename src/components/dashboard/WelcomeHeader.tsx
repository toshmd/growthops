import { useUser } from "@supabase/auth-helpers-react";

const WelcomeHeader = () => {
  const user = useUser();
  const firstName = user?.user_metadata?.first_name || 'there';
  const title = user?.user_metadata?.title || 'User';

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900">
        Welcome back, {firstName}!
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        {title}
      </p>
    </div>
  );
};

export default WelcomeHeader;