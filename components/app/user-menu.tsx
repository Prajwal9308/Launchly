"use client";

import { ExternalLink, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/server/actions/public";

export function UserMenu({
  firstName,
  lastName,
  email,
  accountHref,
}: {
  firstName: string;
  lastName: string;
  email: string;
  accountHref: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full" aria-label="Account menu">
        <Avatar firstName={firstName} lastName={lastName} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel className="pb-2">
          <span className="block truncate text-sm font-medium text-foreground">
            {firstName} {lastName}
          </span>
          <span className="block truncate">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={accountHref}>
            <UserRound /> Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/">
            <ExternalLink /> View website
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2.5 py-1.5 text-sm">
          <span className="text-muted">Theme</span>
          <p>Web design &amp; development for small businesses.</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void logoutAction()}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
