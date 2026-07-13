import Input from "@/app/components/input/Input";

export default function page() {
  return (
    <section className="section">
      <div className="container">
        <div className="card flex flex-col gap-4 items-center justify-center py-12">
          <h1>Create your workspace</h1>
          <p>Join the editorial approach to task management.</p>
          <form className="w-3/4 space-y-4 ">
            <Input />
            <Input />
            <Input />
            <div className="flex gap-4 items-center justify-center">
              <Input />
              <Input />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
