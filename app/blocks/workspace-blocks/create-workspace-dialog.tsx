"use client";

import { useState } from "react";

import { useUser } from "@/context/User.context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import LoaderIcon from "@/app/blocks/loading/Loader";


export default function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  
  // Context
  const { createWorkspace, createWorkspaceLoading } = useUser();
  
  const [name, setName] = useState("");


  const handleCreate = async () => {
    if (!name.trim()) return;

    const created = await createWorkspace(name.trim());

    if (created) {
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>

          <DialogDescription className="my-2">
            You will be the owner of this new workspace.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="workspace-name">Workspace name</Label>
          <Input
            id="workspace-name"
            value={name}
            maxLength={100}
            placeholder="e.g. Inkwell Studio"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleCreate();
            }}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={createWorkspaceLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={createWorkspaceLoading || !name.trim()}
            onClick={handleCreate}
          >
            {createWorkspaceLoading 
                ? 
              <LoaderIcon 
                size="xl"
              />
                : 
              "Create workspace"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
