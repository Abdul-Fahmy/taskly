"use client";

export default function Projects() {
  // const router = useRouter();
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  // async function handleLogout() {
  //   setIsLoggingOut(true);

  //   try {
  //     await fetch("/api/auth/logout", { method: "POST" });
  //     router.push("/login");
  //     router.refresh();
  //   } finally {
  //     setIsLoggingOut(false);
  //   }
  // }

  return (
    <section className="section">
      <div className="container space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">Projects</h1>
          {/* <div className="w-40">
            <Button
              type="button"
              displayText={isLoggingOut ? "Logging out..." : "Log out"}
              disabled={isLoggingOut}
              onClick={handleLogout}
            />
          </div> */}
        </div>
        <p>Your projects will show up here.</p>
      </div>
    </section>
  );
}
