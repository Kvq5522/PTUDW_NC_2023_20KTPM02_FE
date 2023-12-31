"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { ProfileButton } from "../Button/ProfileButton";

import {
  Barcode,
  LayoutDashboard,
  Menu,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useSidebarContext } from "../Contexts/SideBarContext";
import { useAppSelector } from "@/redux/store";
import { useCreateClassModal } from "@/hooks/create-class-modal";
import { useJoinClassModal } from "@/hooks/join-class-modal";
import CreateClassModal from "../Modal/CreateClassModal";
import JoinClassModal from "../Modal/JoinClassModal";
import { NotificationButton } from "../Button/NotificationButton";
import { usePathname } from "next/navigation";

type PageNavbarSectionProps = {
  hidden?: boolean;
};

const Navbar = () => {
  const createClassModal = useCreateClassModal();
  const joinClassModal = useJoinClassModal();
  const avatar = useAppSelector(
    (state: any) => state.userInfoReducer.value?.userInfo?.avatar
  );
  const pathname = usePathname();

  const userInfo = useAppSelector(
    (state) => state.userInfoReducer.value?.userInfo
  );

  const isAdmin = userInfo?.authorization === 4;
  const isAtAdminRoute = pathname.includes("admin");

  return (
    <div className="flex gap-10 lg:gap-20 justify-between items-center pl-3 py-[0.3rem] pr-9 bg-white">
      <CreateClassModal />
      <JoinClassModal />
      <FirstNavbarSection />

      <div className="flex flex-shrink-0 md:gap-3 justify-end ">
        {isAdmin && !isAtAdminRoute && (
          <Link
            href="/admin"
            className="bg-red-500 hover:bg-red-700 text-white gap-1 py-2 px-4 border border-red-700 rounded flex cursor-default select-none items-center text-sm outline-none data-[state=open]:bg-accent"
          >
            <ShieldCheck />
            Admin Dashboard
          </Link>
        )}

        {isAdmin && isAtAdminRoute && (
          <Link
            href="/dashboard"
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 border border-green-700 rounded flex cursor-default select-none items-center text-sm outline-none data-[state=open]:bg-accent"
          >
            <LayoutDashboard />
            Dashboard
          </Link>
        )}

        <NotificationButton />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Plus />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => joinClassModal.onOpen()}>
              Join a class
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => createClassModal.onOpen()}>
              Create a class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ProfileButton avatarSrc={avatar} />
      </div>
    </div>
  );
};

export function FirstNavbarSection({ hidden }: PageNavbarSectionProps) {
  const { toggle } = useSidebarContext();
  return (
    <div className="flex gap-4 items-center flex-shrink-0">
      <Button onClick={toggle} variant="ghost" size="icon">
        <Menu />
      </Button>
      <Link href="/dashboard">
        <Logo />
      </Link>
    </div>
  );
}

export default Navbar;
