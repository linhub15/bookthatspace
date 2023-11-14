import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvenp4bG5qbnNjbHBzY3hxc3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY0NzkzNjEsImV4cCI6MjAxMjA1NTM2MX0.V-FwV86iLr-HKFpqrU2njssmqBwXLzNNdAjBiAGMHp8";

const supbase_trumelo = createClient(
  "https://vozzxlnjnsclpscxqszg.supabase.co",
  supabaseKey,
  { db: { schema: "trumelo" } },
);

const supabase = createClient(
  "https://vozzxlnjnsclpscxqszg.supabase.co",
  supabaseKey,
);

export function Supabase() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    const { data } = await supbase_trumelo.from("colors").select();
    setMessages(data ?? []);
  };

  return (
    <>
      <Login />
      <ul>
        {messages.map((r, i) => <li key={i}>{JSON.stringify(r)}</li>)}
      </ul>
    </>
  );
}

function Login() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <div>Logged in!</div>;
  }
}

export function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const channel = supabase.channel("chat-1");
  const messageReceived = (payload: {
    [key: string]: any;
    type: "broadcast";
    event: string;
  }) => {
    setMessages((messages) => [...messages, payload]);
  };

  const ping = () => {
    channel.send({
      type: "broadcast",
      event: "test",
      payload: { message: "hello, world" },
    });
  };

  channel
    .on(
      "broadcast",
      { event: "test" },
      (payload) => messageReceived(payload),
    )
    .subscribe();
  return (
    <div>
      <button onClick={ping}>Ping</button>
      {messages.map((m, i) => <div key={i}>{JSON.stringify(m)}</div>)}
    </div>
  );
}
