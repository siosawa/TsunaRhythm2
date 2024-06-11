import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectSelection({ projects, setSelectedProject }) {
  return (
    <Select onValueChange={(value) => setSelectedProject(value)}>
      <SelectTrigger className="w-[180px] mt-4">
        <SelectValue placeholder="案件を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {projects.map((project, index) => (
            <SelectItem key={index} value={project}>
              {project}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
