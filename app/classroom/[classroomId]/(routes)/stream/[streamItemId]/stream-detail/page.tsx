"use client";

import React, { useEffect, useState } from "react";
import "@/Styles/stream-detail.css";

import { useParams } from "next/navigation";

import { RiFileListLine } from "react-icons/ri";
import { GrScorecard } from "react-icons/gr";
import { MoreVertical, Dot } from "lucide-react";

import { Button } from "@/components/ui/button";
import CommentArea from "@/components/CommentArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AXIOS } from "@/constants/ApiCall";

import Loader from "@/components/Loader/Loader";
import EmptyState from "@/components/EmptyState";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useAppSelector } from "@/redux/store";

const StreamContentDetail = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [detail, setDetail] = useState<ReviewDetail["detail"]>();
  const [comments, setComments] = useState<ReviewDetail["comments"]>([]);
  const params = useParams();

  const currentUser = useAppSelector((state) => state.userInfoReducer.value?.userInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await AXIOS.GET({
          uri: `/announcement/get-announcement/${params.classroomId}/detail/${params.streamItemId}`,
          token: localStorage.getItem("access-token") ?? "",
        });

        if (res.statusCode && res.statusCode === 200) {
          setDetail(res.metadata.detail);
          setComments(res.metadata.comments);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.classroomId, params.streamItemId]);

  if (loading) return <Loader text="Loading..." className="w-full h-full" />;

  if (!detail) return <EmptyState title="Error" subTitle="Can't find topic" />;

  const sendComment = async (value: string) => {
    const fetchData = async (value: string) => {
      try {
        setLoadingComment(true);

        const res = await AXIOS.POST({
          uri: `/announcement/create-comment/${params.classroomId}/${params.streamItemId}`,
          token: localStorage.getItem("access-token") ?? "",
          params: {
            description: value,
          },
        });

        if (res.statusCode && res.statusCode === 201) {
          const fetchNewComments = await AXIOS.GET({
            uri: `/announcement/get-comments/${params.classroomId}/${params.streamItemId}`,
            token: localStorage.getItem("access-token") ?? "",
          });

          if (
            fetchNewComments.statusCode &&
            fetchNewComments.statusCode === 200
          ) {
            setComments(fetchNewComments.metadata);
          }
        } else {
          throw new Error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setLoadingComment(false);
      }
    };

    fetchData(value);
  };

  return (
    <div className="stream-detail-container">
      <div className="stream-detail-icon">
        <Avatar className="h-[36px] w-[36px] mt-3">
          <AvatarImage className="object-cover" />
          <AvatarFallback className="bg-[#3e9e3e]">
            {(() => {
              switch (detail?.type) {
                case "GRADE_REVIEW":
                  return <GrScorecard size={20} color="white" />;
                case "GRADE_ANNOUNCEMENT":
                  return <RiFileListLine size={20} color="white" />;
                default:
                  return <Dot size={20} color="white" />;
              }
            })()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="stream-detail-main">
        <div className="stream-detail-content">
          <div className="stream-detail-header">
            <div className="stream-detail-label">
              <span>{detail?.title}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="detail-actions">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      type="button"
                    >
                      <MoreVertical />
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30">
                  <DropdownMenuItem>Copy Link</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="stream-detail-sublabel">
              <div className="detail-creator">
                {"By: "}
                {`${detail?.created_by_fk?.first_name}
                 ${detail?.created_by_fk?.last_name}`}
              </div>

              <div className="mx-[0.25rem]">•</div>

              <div className="detail-daytime">
                {`Classroom: ${detail?.classroom_id_fk?.name}`}
              </div>

              <div className="mx-[0.25rem]">•</div>

              <div className="detail-daytime">
                {`${
                  detail?.createdAt
                    ? format(new Date(detail?.createdAt), "dd MMMM, yyyy", {
                        locale: enUS,
                      })
                    : format(new Date(), "dd MMMM, yyyy", { locale: enUS })
                }`}
              </div>
            </div>
          </div>

          {detail?.description && (
            <div className="stream-detail-description space-y-2">
              {detail?.type === "GRADE_REVIEW" && (
                <span className="space-y-2">
                  <p className="text-lg">Student Information</p>

                  <p className="ml-2">Student ID: {detail?.student_id}</p>

                  <p className="ml-2">
                    Student Email: {detail?.student_id_fk?.email}
                  </p>

                  <p className="ml-2">Current Grade: {detail?.current_grade}</p>

                  <p className="ml-2">
                    Expected Grade: {detail?.expected_grade}
                  </p>
                </span>
              )}

              <p className="text-lg">Description </p>

              <p className="ml-2">{detail?.description}</p>
            </div>
          )}
        </div>
        <div className="stream-detail-files"></div>
        <div className="stream-detail-comment">
          <CommentArea
            onSubmitComment={sendComment}
            loading={loadingComment}
            data={comments}
            userAvatar={currentUser?.avatar}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamContentDetail;

interface ReviewDetail {
  detail: {
    id: number;
    title: string;
    description: string;
    expected_grade: number;
    grade_category: number;
    grade_category_fk: {
      name: string;
    };
    classroom_id: number;
    classroom_id_fk: {
      name: string;
    };
    created_by: number;
    created_by_fk: {
      first_name: string;
      last_name: string;
      avatar: string;
    };
    student_id: number;
    student_id_fk: {
      email: string;
    };
    type: string;
    createdAt: string;
    current_grade: number;
  };
  comments: Comment[];
}

interface Comment {
  id: number;
  description: string;
  user_id: number;
  user_id_fk: {
    first_name: string;
    last_name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}