"use client";

import { Separator } from "@radix-ui/react-select";
import {
  Plus,
  Table2,
  X,
  Save,
  FileKey2,
  FileLock2,
  FileDown,
  FileUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import GradeComposition from "../Card/GradeComposition";
import CompositionDialog from "../Dialog/CompositionDialog";

import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "../ui/dialog";
import GradeTable from "../Table/GradeTable";

import { gradeComposition } from "@/constants/mockdata";
import ShowGradeDialog from "../Dialog/ShowGradeDialog";
import TooltipPro from "../TooltipPro";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  scale: z.string(),
  status: z.string(),
});

interface dndProps {
  compositionList: any[];
  classroomId: string;
}

const DragNDropBox = (props: dndProps) => {
  const [itemList, setItemList] = useState(props.compositionList);
  const [openDialog, setOpenDialog] = useState(false);
  const [composition, setComposition] = useState<string>("");
  const [totalScale, setTotalScale] = useState<string>("0");
  const [isChange, setIsChange] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [isSave, setIsSave] = useState(true);

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;

    const items = Array.from(itemList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setItemList(items);
  }

  const calcSum = useCallback(() => {
    let sum = 0;
    for (let i = 0; i < itemList.length; i++) {
      sum += parseInt(itemList[i].grade_percent, 10) || 0;
    }
    setTotalScale(sum.toString());
  }, [itemList]);
  

  const handleScaleChange = (id: string, newScale: string) => {
    if (parseInt(newScale, 10) > 100) {
      newScale = "100";
    }
    if (parseInt(newScale, 10) <= 0 || newScale === "") {
      newScale = "0";
    }
    setIsChange(true);
    setItemList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, scale: newScale } : item
      )
    );
    setIsChange(false);
    // setIsSave(false);
  };

  const handleStatusChange = (id: string, newStatus: boolean) => {
    setItemList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    // setIsSave(false);
  };

  const handleNameChange = (id: string, newName: string) => {
    setItemList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItemList(itemList.filter((item) => item.id != id));
  };

  const handleDialog = (type: string, compoID: string) => {
    setOpenDialog((current) => !current);
    if (openDialog === false) form.reset();
    setDialogType(type);
    setComposition(compoID);
  };

  const handleUpload = () => {
    // Update the status property of each item to "public"
    console.log("Upload success");
  };

  const handleDownload = () => {
    // Update the status property of each item to "public"
    console.log("Download success");
  };

  const handleSaveBox = () => {
    console.log("Success");
    setIsSave(true);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      scale: "0",
      status: "private",
    },
  });

  useEffect(() => {
    calcSum();
    setIsSave(false);
  }, [itemList, isChange, calcSum]);

  useEffect(() => {
    setItemList(props.compositionList);
  }, [props.compositionList]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!values.name) {
      // Nếu không, đặt lỗi vào trường name
      form.setError("name", {
        type: "manual",
        message: "Name is required",
      });
      return; // Dừng lại nếu có lỗi
    }

    //check if name is already exist
    if (
      itemList.filter((item) => item.name === values.name).length > 0 &&
      values.id === ""
    ) {
      form.setError("name", {
        type: "manual",
        message: "Name is already exist",
      });
      return;
    }

    const newItem = {
      id: values.id || Date.now().toString(), // Use existing ID or generate a timestamp-based ID
      name: values.name || "",
      scale: values.scale || 0,
      status: values.status || "private",
    };

    // Update the itemList state with the new item
    setItemList((prevItems) => [...prevItems, newItem]);

    // Close the composition dialog
    handleDialog("addDialog", newItem.id);
  };

  return (
    <div className="dnd-list-container">
      <div className="dnd-list-wrapper">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="itemlist">
            {(provided) => (
              <div
                className="dndl-content"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Array.isArray(itemList) &&
                  itemList.map((grade, index) => {
                    return (
                      <GradeComposition
                        key={`${grade.id}-${index}`}
                        index={index}
                        id={String(grade.id)}
                        name={grade.name}
                        scale={grade.grade_percent}
                        status={grade.is_finalized}
                        onScaleChange={handleScaleChange}
                        onNameChange={handleNameChange}
                        onStatusChange={handleStatusChange}
                        onRemoveChange={handleDelete}
                        onOpenTable={handleDialog}
                      />
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Separator className="bg-black h-[2px]" />
        <div className="dndl-tools">
          <div className="flex flex-row dndl-tools-actions">
            <TooltipPro description="Upload Student List">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 addIPlustbtn"
                onClick={handleUpload}
              >
                <FileUp />
              </Button>
            </TooltipPro>
            <TooltipPro description="Download Student List">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 addIPlustbtn"
                onClick={handleDownload}
              >
                <FileDown />
              </Button>
            </TooltipPro>
          </div>

          <div className="flex flex-row gap-1 items-center justify-between p-0">
            <div className="block text-[16px] font-bold">Total Scale: </div>
            <input
              type="text"
              className="w-9 text-center rounded-sm"
              value={totalScale}
              readOnly
            />
          </div>

          <div className="flex flex-row gap-1 dndl-tools-actions">
            <TooltipPro description="Add Composition">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 addIPlustbtn"
                onClick={() => handleDialog("addDialog", "all")}
              >
                <Plus />
              </Button>
            </TooltipPro>

            <TooltipPro description="Show Grade Board">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 createTbtn"
                onClick={() => handleDialog("tableDialog", "all")}
              >
                <Table2 />
              </Button>
            </TooltipPro>

            <TooltipPro description="Save Compostions">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 saveTbtn"
                onClick={handleSaveBox}
              >
                <Save />
              </Button>
            </TooltipPro>
          </div>
        </div>
      </div>

      {/* Add Dialog */}
      <CompositionDialog
        id="addDialog"
        isOpen={openDialog && dialogType === "addDialog"}
        onClose={() => handleDialog("addDialog", "all")}
        classname="h-fit w-[32rem] block"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-1 mb-3 mt-3 flex gap-3 flex-col h-[10rem] w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-start flex-col">
                      <FormLabel className="w-[15%] truncate">
                        Name (<span className="text-red-500">*</span>)
                      </FormLabel>
                      <FormControl>
                        <div className="w-full">
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter Grade Composition Name"
                            className="mt-1"
                          />
                          {form.formState.errors.name && (
                            <div className="text-red-500 text-sm mt-1">
                              {form.formState.errors.name.message}
                            </div>
                          )}
                        </div>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-center items-start flex-col">
                      <FormLabel className="w-[15%] truncate">Scale</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter Scale"
                          className="mt-1"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row justify-end gap-2">
              <Button type="submit">Add</Button>
              <DialogClose asChild>
                <Button id="closeDia" type="button" variant="destructive">
                  Close
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </CompositionDialog>

      {/* ---------------------------------------------------------- */}

      {/* Show Table Dialog */}
      <ShowGradeDialog
        id="tableDialog"
        compositionID={composition}
        typeTable="tableDialog"
        onHandleDialog={handleDialog}
        isOpen={openDialog && dialogType === "tableDialog"}
        classroomId={props.classroomId}
      />
      {/* <CompositionDialog
        id="tableDialog"
        isOpen={openDialog && dialogType === "tableDialog"}
        onClose={() => handleDialog("tableDialog", "all")}
        classname="tableDialog"
      >
        <div className="table-nav">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDialog("tableDialog", "all")}
          >
            <X />
          </Button>
          <input type="text" value={composition} />
          <Button
            className=" bg-blue-300 hover:bg-blue-600 text-[16px] font-bold text-gray-800"
            variant="ghost"
            onClick={() => handleDialog("tableDialog", "all")}
          >
            <Save />
            Save
          </Button>
        </div>
        <div className="table-box">
          <GradeTable composition={composition} />
        </div>
      </CompositionDialog> */}
    </div>
  );
};

export default DragNDropBox;
