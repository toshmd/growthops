import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export const LoginForm = () => (
  <Card className="w-full max-w-md p-8" role="form" aria-labelledby="login-title">
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'hsl(var(--primary))',
              brandAccent: 'hsl(var(--primary))',
            }
          }
        },
        className: {
          container: 'flex flex-col gap-4',
          button: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2',
          input: 'bg-background focus:ring-2 focus:ring-primary focus:ring-offset-2',
          message: 'text-destructive text-sm',
          anchor: 'text-primary hover:text-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        }
      }}
      providers={[]}
    />
  </Card>
);