import Input from "../input/Input";

export default function EpicForm() {
  return (
    <div className="max-w-212 mx-auto bg-white mt-10 p-8">
      <form action="" className="w-full">
        <div className="flex  items-center gap-5">
          <p className="w-full">Title *</p>
          <Input
            name="title"
            placeholder="e.g. Structural Foundation Phase"
            type="text"
            className=" grow "
          />
        </div>
      </form>
    </div>
  );
}
