import {
  GripHorizontal,
  ClipboardEdit,
  Pencil,
  Trash2,
  PencilIcon,
  AlertCircle,
} from "lucide-react";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CompositionDialog from "../Dialog/CompositionDialog";
import { useEffect, useState } from "react";
import TooltipPro from "../TooltipPro";

import { useAppSelector } from "@/redux/store";

type gradeComposition = {
  index: number;
  id: string;
  name: string;
  scale: string;
  status: boolean;
  classroomId: number;
  checkNameDuplicate: (name: string) => boolean;
};

interface gradeCompositionProps extends gradeComposition {
  // onRemove: () => void;
  // open: (type: string) => void;
  onScaleChange: (id: string, newScale: number) => void;
  onNameChange: (id: string, newName: string) => void;
  onStatusChange: (id: string, newStatus: boolean) => void;
  onRemoveChange: (id: string) => void;
  onOpenTable: (type: string, compositionID: string) => void;
  onOpenReview: (compositionID: string) => void;
}

const GradeComposition = (props: gradeCompositionProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newName, setNewName] = useState(props.name);
  const [inputText, setInputText] = useState(props.name);
  const [error, setError] = useState("");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError("");
    setInputText(props.name);
  };

  const handleSave = () => {
    if (
      inputText.length < 1 ||
      (props.checkNameDuplicate(inputText) && inputText !== props.name)
    ) {
      setError("Name is invalid");
      return;
    }

    setNewName(inputText);
    setError("");
    props.onNameChange(props.id, inputText);
    handleCloseDialog();
  };

  const handleSelectChange = (value: boolean) => {
    props.onStatusChange(props.id, value);
  };

  const userInClass = useAppSelector(
    (state) => state.classroomInfoReducer.value?.currentClassroom?.user
  );
  const isStudent = userInClass?.member_role < 2;

  return (
    <>
      <Draggable draggableId={props.id} index={props.index}>
        {(provided: DraggableProvided) => (
          <div
            className={
              `dndl-item `
              // + (props.status === "private" ? "bg-red-700" : "bg-blue-700")
            }
            ref={provided.innerRef}
            // {... provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <div className={`dndl-item-wrapper`}>
              {!isStudent && (
                <div
                  ref={provided.innerRef}
                  {...provided.dragHandleProps}
                  className="block"
                >
                  <GripHorizontal />
                </div>
              )}

              <div className="dndlina">{newName}</div>

              <div className="dndliwi">
                <input
                  type="number"
                  className="w-12 text-center border-none p-0 rounded-sm"
                  value={props.scale}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      props.onScaleChange(props.id, 0); 
                    } else {
                      const parsedValue = parseFloat(inputValue);
                      if (!isNaN(parsedValue)) {
                        props.onScaleChange(props.id, parsedValue);
                      }
                    }
                  }}
                  max={100}
                  min={0}
                  readOnly={isStudent}
                />
                <span className="text-[20px] font-bold ml-[1px]">%</span>
              </div>

              <div className="dndshare">
                {!isStudent && (
                  <Select
                    value={props.status ? "true" : "false"}
                    onValueChange={(value) =>
                      !isStudent && handleSelectChange(value === "true")
                    }
                    disabled={isStudent}
                  >
                    <SelectTrigger
                      placeholder="Select state"
                      className="w-[70px] h-[25px] p-0 pl-1"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Public</SelectItem>
                      <SelectItem value="false">Private</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="dndl-item-actions">
                <Separator
                  orientation="vertical"
                  className="bg-slate-600 m-1"
                />
                {/* Teacher function */}
                <div hidden={isStudent}>
                  <TooltipPro description="Edit composition name">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-xl"
                      onClick={handleOpenDialog}
                    >
                      <Pencil className="h-5 w-5 text-blue-800" />
                    </Button>
                  </TooltipPro>
                </div>

                <div hidden={isStudent}>
                  <TooltipPro description="Show compostion grade">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-xl"
                      onClick={() => props.onOpenTable("tableDialog", props.id)}
                    >
                      <ClipboardEdit className="h-5 w-5 text-green-800" />
                    </Button>
                  </TooltipPro>
                </div>

                <div hidden={isStudent}>
                  <TooltipPro description="Delete composition">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-xl"
                      onClick={() => props.onRemoveChange(props.id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-800" />
                    </Button>
                  </TooltipPro>
                </div>

                {/* Student functions */}

                <div hidden={!isStudent}>
                  <TooltipPro description="Create grade review">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-xl"
                      onClick={() => props.onOpenReview(props.id)}
                    >
                      <AlertCircle className="h-5 w-5" />
                    </Button>
                  </TooltipPro>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Edit Dialog */}
      <CompositionDialog
        id={props.id}
        key={props.id}
        isOpen={openDialog}
        onClose={handleCloseDialog}
        classname=" h-auto w-auto"
      >
        <div className=" mb-2">
          <Label htmlFor="grade-name">Grade name</Label>
          <Input
            id="grade-name"
            type="text"
            value={inputText}
            className="bg-slate-200 "
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {error.length > 0 && <h1 className="text-red-500 italic">{error}</h1>}

        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={handleSave}>
            Save
          </Button>
          <Button variant="destructive" onClick={handleCloseDialog}>
            Close
          </Button>
        </div>
      </CompositionDialog>
    </>
  );
};

export default GradeComposition;
