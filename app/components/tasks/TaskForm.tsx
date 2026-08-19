"use client";

import { FormProps } from "@/app/types/epicForm";
import Input from "../input/Input";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { tasksFormData } from "@/app/schemas/newTasksSchema";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "../button/Button";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { useEffect, useSyncExternalStore } from "react";
import { fetchEpics } from "@/app/store/features/epics.slice";
import { fetchMembers } from "@/app/store/features/members.slice";
import { statusOptions } from "@/app/constant/taskStatus";
import { selectClassNames } from "@/app/constant/classesForSelect";



const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function TaskForm({
  form,
  onSubmit,
  errorMsg,
}: FormProps<tasksFormData>) {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const isClient = useIsClient();
  const dispatch = useAppDispatch();
  const epics = useAppSelector((state) => state.epics.epics);
  const members = useAppSelector((state) => state.members.members);
  const truncate = (s: string, max = 100) =>
    s.length > max ? `${s.slice(0, max)}...` : s;

  const memberOptions = members.map((member) => ({
    value: member.user_id,
    label: member.metadata.name,
  }));
  const epicsOptions = epics.map((epic) => ({
    value: epic.id,
    label: truncate(epic.title),
  }));

  useEffect(() => {
    dispatch(fetchEpics({ projectId }));
  }, [dispatch, projectId]);

  useEffect(() => {
    dispatch(fetchMembers({ projectId }));
  }, [dispatch, projectId]);

  return (
    <div className="bg-white rounded-md p-6 w-full ">
      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="title">Title *</label>
          <Input
            placeholder="e.g., Finalize structural schematics"
            type="text"
            id="title"
            {...register("title")}
            error={errors.title?.message}
          />
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="w-full">
            <label htmlFor="status">Status * </label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) =>
                isClient ? (
                  <Select
                    instanceId="task-status"
                    unstyled
                    isClearable
                    classNames={selectClassNames}
                    options={statusOptions}
                    value={
                      statusOptions.find(
                        (option) => option.value === field.value,
                      ) ?? statusOptions[0]
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value ?? "");
                    }}
                  />
                ) : (
                  <div className="input w-full" />
                )
              }
            />
          </div>
          <div className="w-full">
            <label htmlFor="assignee_id"> Assignee</label>
            <Controller
              control={form.control}
              name="assignee_id"
              render={({ field }) =>
                isClient ? (
                  <Select
                    instanceId="task-assignee"
                    unstyled
                    isClearable
                    options={memberOptions}
                    value={
                      memberOptions.find(
                        (option) => option.value === field.value,
                      ) ?? null
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value ?? "");
                    }}
                    classNames={selectClassNames}
                  />
                ) : (
                  <div className="input w-full" />
                )
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="epic_id">Epic</label>
          <Controller
            control={form.control}
            name="epic_id"
            render={({ field }) =>
              isClient ? (
                <Select
                  instanceId="task-epic"
                  isClearable
                  unstyled
                  options={epicsOptions}
                  value={
                    epicsOptions.find(
                      (option) => option.value === field.value,
                    ) ?? null
                  }
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption?.value ?? "");
                  }}
                  classNames={selectClassNames}
                />
              ) : (
                <div className="input w-full" />
              )
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="datetime-local"
            id="due_date"
            {...register("due_date")}
            className="input "
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="input resize-none"
            rows={5}
            placeholder="Provide detailed context for this task..."
            {...register("description")}
          ></textarea>
        </div>
        <div className="flex justify-end items-center gap-4 pt-2">
          <Link
            href={`/project/${projectId}/tasks`}
            className="text-neutral-700 py-4 px-2"
          >
            Back
          </Link>
          <Button
            displayText={isSubmitting ? "Creating..." : "Create Task"}
            className="btn-primary"
            disabled={isSubmitting}
            type="submit"
          />
        </div>
      </form>
      {errorMsg && (
        <p className="text-error text-sm font-normal mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
